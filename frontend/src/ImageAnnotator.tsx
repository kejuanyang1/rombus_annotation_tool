// frontend/src/ImageAnnotator.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Stage, Layer, Image as KonvaImage,
  Rect, Transformer, Text, Group
} from "react-konva";
import useImage from "use-image";
import axios from "axios";

/* -------------------------------------------------------------------------- */
/*                               type helpers                                 */
/* -------------------------------------------------------------------------- */
type BoxArr  = [number, number, number, number, number]; // [x,y,w,h,angle]
type BBox    = { cx: number; cy: number; w: number; h: number; angle: number };
type Anno    = { bbox: BBox; label: string; conf?: number };

interface Props { imageId: string; api: string }

/* ---------- conversion between array format and cx/cy format ------------- */
const arr2bbox = ([x, y, w, h, a]: BoxArr): BBox => ({
  cx: x + w / 2,
  cy: y + h / 2,
  w, h, angle: a,
});
const bbox2arr = (b: BBox): BoxArr => [
  b.cx - b.w / 2,
  b.cy - b.h / 2,
  b.w,
  b.h,
  b.angle,
];

/* -------------------------------------------------------------------------- */
/*                               component                                    */
/* -------------------------------------------------------------------------- */
const ImageAnnotator: React.FC<Props> = ({ imageId, api }) => {
  /* ------------------------------ state -------------------------------- */
  const [image] = useImage(`${api}/image/${imageId}/rgb?ts=${imageId}`);
  const [boxes, setBoxes] = useState<Anno[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  /* --------------------------- fetch initial --------------------------- */
  useEffect(() => {
    axios.get(`${api}/image/${imageId}/annotations`).then(res => {
      const list = (res.data as any[]).map(obj => ({
        bbox : arr2bbox(obj.bbox as BoxArr),
        label: obj.name,
        conf : obj.conf,
      }));
      setBoxes(list);
    });
    axios.get(`${api}/image/${imageId}/objects`)
         .then(res => setCandidates(res.data));
  }, [imageId, api]);

  /* ------------------------------- scale ------------------------------- */
  useEffect(() => {
    if (!image) return;
    const reserve = 170;
    const upd = () => setScale(Math.min(
      window.innerWidth  / image.width,
      (window.innerHeight - reserve) / image.height,
      1
    ));
    upd(); window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, [image]);

  /* ------------------------------ helpers ------------------------------ */
  const toRect = (b: BBox) => ({
    x: b.cx - b.w / 2,
    y: b.cy - b.h / 2,
    width: b.w,
    height: b.h,
    rotation: b.angle,
  });

  /* ------------------------- BBox component --------------------------- */
  const BBoxShape: React.FC<{ idx: number; anno: Anno }> = ({ idx, anno }) => {
    const rectRef = useRef<any>(), trRef = useRef<any>();
    const isSel   = idx === selectedIdx;

    /* keep Transformer attached */
    useEffect(() => {
      if (isSel && rectRef.current) {
        trRef.current?.nodes([rectRef.current]);
        trRef.current?.getLayer()?.batchDraw();
      }
    }, [isSel]);

    /* update helpers */
    const commit = (node: any) => {
      // const r   = node.getClientRect();
      const rot = node.rotation();
      const w   = node.width()  * node.scaleX();
      const h   = node.height() * node.scaleY();
      const cx  = node.x() + w / 2;
      const cy  = node.y() + h / 2;
      node.scaleX(1); node.scaleY(1);      // reset for next edit
      setBoxes(bs =>
        bs.map((b, i) =>
          i === idx ? { ...b, bbox: { cx, cy, w, h, angle: rot } } : b
        )
      );
    };

    const { x, y, width, height, rotation } = toRect(anno.bbox);

    return (
      <>
        <Group>
          <Rect
            ref={rectRef}
            x={x} y={y} width={width} height={height} rotation={rotation}
            stroke="lime" strokeWidth={2} draggable
            onClick={() => setSelectedIdx(idx)}
            onDragEnd={e => commit(e.target)}
            onTransformEnd={e => commit(e.target)}
          />
          {anno.label && (
            <Text
              text={anno.label}
              x={x} y={y - 18}
              fontSize={18}
              fill="white" stroke="white" strokeWidth={1}
            />
          )}
        </Group>
        {isSel && (
          <Transformer
            ref={trRef} keepRatio={false} rotateEnabled
            enabledAnchors={[
              "top-left","top-right","bottom-left","bottom-right",
              "middle-left","middle-right","middle-top","middle-bottom",
            ]}
          />
        )}
      </>
    );
  };

  /* ---------------------------- handlers ------------------------------ */
  const addBox = () => {
    setBoxes([...boxes, {
      bbox: { cx: 100, cy: 100, w: 120, h: 80, angle: 0 },
      label: "",
    }]);
    setSelectedIdx(boxes.length);
  };

  const saveAll = () => {
    const annos = boxes.map(b => ({
      bbox: b.bbox,                // {cx,cy,w,h,angle}
      category: b.label || "",     // backend field alias => "label"
      conf: b.conf ?? undefined,
    }));
  
    axios
      .post(`${api}/annotate`, { image_id: imageId, annos })
      .then(() => alert("Saved!"))
      .catch(err => console.error(err));
  };

  /* ------------------------------ render ------------------------------ */
  return (
    <div ref={containerRef} className="flex-1 flex flex-col p-2 space-y-2 overflow-hidden">
      {/* ---------------- top bar ---------------- */}
      <div className="flex items-center space-x-2">
        <button className="border px-3 py-1" onClick={addBox}>Add box</button>
        <button className="border px-3 py-1" onClick={saveAll}>Confirm / Save</button>

        {selectedIdx !== null && boxes[selectedIdx] && (
          <>
            <input
              list="objectList" className="border px-2 flex-1"
              placeholder="object name"
              value={boxes[selectedIdx].label}
              onChange={e => {
                const v = e.target.value;
                setBoxes(bs => bs.map((b,i)=>
                  i===selectedIdx? {...b,label:v}: b));
              }}
              autoFocus
            />
            <datalist id="objectList">
              {candidates.map(c => <option key={c} value={c} />)}
            </datalist>
            <button
              className="border px-2"
              onClick={()=>{
                setBoxes(bs=>bs.filter((_,i)=>i!==selectedIdx));
                setSelectedIdx(null);
              }}
            >Delete</button>
          </>
        )}
      </div>

      {/* ---------------- canvas ---------------- */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: image?.width ?? 800,
          height: image?.height ?? 600,
        }}
        className="self-start"
      >
        <Stage
          width={image?.width ?? 800}
          height={image?.height ?? 600}
          onMouseDown={e =>
            e.target === e.target.getStage() && setSelectedIdx(null)}
        >
          <Layer>
            {image && <KonvaImage image={image} />}
            {boxes.map((a,i)=> <BBoxShape key={i} idx={i} anno={a} />)}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default ImageAnnotator;
