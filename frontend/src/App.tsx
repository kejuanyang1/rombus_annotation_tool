import React, { useEffect, useState } from "react";
import ImageAnnotator from "./ImageAnnotator.tsx";
import axios from "axios";

const API = "http://localhost:8000/api";

export default function App() {
  const [startId, setStartId] = useState("scene_01_0");
  const [ids,   setIds]   = useState<string[]>([]);
  const [idx,   setIdx]   = useState(0);

  useEffect(() => {
    axios.get(`${API}/images`, { params:{ start:startId } })
         .then(res => setIds(res.data))
         .catch(console.error);
  }, [startId]);

  const next = () => setIdx(i => Math.min(i+1, ids.length-1));
  const prev = () => setIdx(i => Math.max(i-1, 0));

  if (!ids.length) return <p>Loading list…</p>;

  return (
    <div className="h-screen flex flex-col">
      <header className="p-2 bg-gray-800 text-white flex items-center">
        <span className="mr-4">Start from&nbsp;
          <input value={startId} onChange={e=>setStartId(e.target.value)} />
        </span>
        <button onClick={prev} disabled={idx===0}>Prev</button>
        <button onClick={next} disabled={idx===ids.length-1}>Next</button>
        <span className="ml-auto">{ids[idx]}</span>
      </header>
      {/* # ImageAnnotator should take 70% of height of screen*/}
      {/* <div className="flex-1 overflow-hidden">  */}
      <ImageAnnotator imageId={ids[idx]} api={API} />
      {/* </div> */}
      
      
      {/* <ImageAnnotator imageId={ids[idx]} api={API} /> */}
    </div>
  );
}
