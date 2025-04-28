# Rombus 3D Annotation Tool

## Layout 

```
project/
├─ data/
│  ├─ scene_01_0_rgb.png
│  ├─ scene_01_0_depth.png # should not use, saved in wrong format
│  ├─ scene_01_0_cloud.ply
│  ├─ scene_01_0_metadata.json
│  └─ …
├─ output/                 # ⇦ annotated Json here
│
├─ outputs_helper/         # optional, used a owl-vit to generated a first set of bboxs for each image
├─ backend/
│  ├─ main.py
│  └─ requirements.txt
└─ frontend/
   └─ (React sources)
```


## frontend

```shell
cd frontend
npm create vite@latest  . -- --template react-ts
npm i react-konva konva axios use-image
```

```shell
npm run dev
```


## backend

```shell
conda create -n 3danno python==3.10
conda activate 3danno
cd backend
pip install -r requirements.txt
```

```shell
uvicorn main:app --reload --port 8000
```