from PIL import Image
import os

def remove_white_background(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # Если пиксель белый (или почти белый)
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0)) # Делаем прозрачным
            else:
                newData.append(item)
        
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Success! Saved to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

# Пути
input_file = "C:/Vika/ar-toy-filter/public/assets/horse.png"
output_file = "C:/Vika/ar-toy-filter/public/assets/horse_transparent.png"

remove_white_background(input_file, output_file)
