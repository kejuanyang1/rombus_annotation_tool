// frontend/src/ImageAnnotator.tsx
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import axios from "axios";

/* -------------------------------------------------------------------------- */
/*                                BBox helper                                 */
/* -------------------------------------------------------------------------- */

interface BBoxProps {
  shapeProps: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: any) => void;
}

const BBox: React.FC<BBoxProps> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();

  useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        {...shapeProps}
        ref={shapeRef}
        draggable
        stroke="lime"
        strokeWidth={2}
        onClick={onSelect}
        onDragEnd={(e) =>
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })
        }
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={false}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      )}
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                         Main ImageAnnotator component                      */
/* -------------------------------------------------------------------------- */

interface Props {
  imageId: string;
  api: string; // e.g. http://localhost:8000/api
}

const ImageAnnotator: React.FC<Props> = ({ imageId, api }) => {
  /* ------------------------------ state hooks ----------------------------- */
  const [image] = useImage(`${api}/image/${imageId}/rgb`);
  const [bbox, setBBox] = useState<any | null>(null);
  const [selected, setSelected] = useState(false);
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState<string[]>([]); // dropdown values
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  /* -------------------- fetch dropdown options on image change ------------ */
  useEffect(() => {
    axios
      .get(`${api}/image/${imageId}/objects`)
      .then((res) => setOptions(res.data))
      .catch(() => setOptions([]));
  }, [imageId, api]);

  /* -------------------------- viewport scaling ---------------------------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!image) return;
  
    const reserve = 160;                // px reserved for header + controls
    const compute = () => {
      const vw = window.innerWidth;     // viewport width
      const vh = window.innerHeight - reserve;
      setScale(Math.min(vw / image.width, vh / image.height, 1));
    };
  
    compute();                          // run once
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [image]);

  /* -------------------------- confirm handler ----------------------------- */
  const confirm = () => {
    if (!bbox || !label.trim()) {
      return alert("Draw a box and choose / type a label.");
    }
    axios
      .post(`${api}/annotate`, {
        image_id: imageId,
        label: label.trim(),
        bbox: {
          cx: bbox.x + bbox.width / 2,
          cy: bbox.y + bbox.height / 2,
          w: bbox.width,
          h: bbox.height,
          angle: bbox.rotation,
        },
      })
      .then(() => {
        // alert("Saved!");
        setBBox(null);
        setLabel("");
        setSelected(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save annotation.");
      });
  };

  /* ----------------------------------------------------------------------- */
  /*                                render                                   */
  /* ----------------------------------------------------------------------- */

return (
    <div ref={containerRef} className="flex-1 flex flex-col overflow-hidden p-2">
      {/* ─────────────── TOP CONTROL BAR ─────────────── */}
      <div className="flex items-center space-x-2 mb-2">
        {/* Draw-box (always visible when no active bbox) */}
        {!bbox && image && (
          <button
            className="border px-3 py-1"
            onClick={() => {
              setBBox({ x: 50, y: 50, width: 150, height: 100, rotation: 0 });
              setSelected(true);
            }}
          >
            Draw box
          </button>
        )}
  
        {/* Label input + Confirm / Undo (visible during editing) */}
        {bbox && (
          <>
            <input
              list="objlist"
              className="border px-2 flex-1"
              placeholder="object name"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
            />
            <datalist id="objlist">
              {options.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
  
            <button onClick={confirm} className="border px-3">
              Confirm
            </button>
            <button
              onClick={() => {
                setBBox(null);
                setLabel("");
                setSelected(false);
              }}
              className="border px-3"
            >
              Undo
            </button>
          </>
        )}
      </div>
  
      {/* ─────────────── IMAGE AREA (auto-scaled) ─────────────── */}
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
          onMouseDown={(e) =>
            e.target === e.target.getStage() && setSelected(false)
          }
        >
          <Layer>
            {image && <KonvaImage image={image} />}
            {bbox && (
              <BBox
                shapeProps={bbox}
                isSelected={selected}
                onSelect={() => setSelected(true)}
                onChange={setBBox}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
  
};

export default ImageAnnotator;
