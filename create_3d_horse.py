import trimesh
import numpy as np
from PIL import Image
import os

def create_textured_plane(image_path, output_path):
    print(f"Processing {image_path}...")
    
    img = Image.open(image_path)
    width, height = img.size
    aspect_ratio = width / height
    
    # Размеры (высота 1 метр)
    h = 1.0
    w = h * aspect_ratio
    
    # Вершины (центр внизу)
    vertices = np.array([
        [-w/2, 0, 0],
        [w/2, 0, 0],
        [w/2, h, 0],
        [-w/2, h, 0]
    ])

    # Грани
    faces = np.array([
        [0, 1, 2],
        [0, 2, 3]
    ])
    
    # UV
    uv = np.array([
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1]
    ])

    # Создаем PBR материал с прозрачностью
    # Важно: alphaMode='BLEND' для прозрачности
    material = trimesh.visual.material.PBRMaterial(
        name='HorseMaterial',
        baseColorTexture=img,
        alphaMode='BLEND',
        doubleSided=True,
        baseColorFactor=[255, 255, 255, 255], # Белый цвет, полная непрозрачность (текстура сама определит альфу)
        metallicFactor=0.0,
        roughnessFactor=1.0
    )
    
    # Визуализация
    visual = trimesh.visual.TextureVisuals(uv=uv, material=material)

    # Меш
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces, visual=visual, process=False)

    # Экспорт
    mesh.export(output_path)
    print(f"Successfully saved transparent 3D model to {output_path}")

# Пути
input_img = "C:/Vika/ar-toy-filter/public/assets/horse_transparent.png"
output_glb = "C:/Vika/ar-toy-filter/public/models/horse_cardboard.glb"

create_textured_plane(input_img, output_glb)
