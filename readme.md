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
npm install
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


## Bbox Annotaion using OwlViT

Install GPU compatible Pytorch first, then

```shell
pip install transformers
```

```shell
python inference.py --img_dir /your_dataset_path
```