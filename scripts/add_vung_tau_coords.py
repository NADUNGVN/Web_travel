#!/usr/bin/env python3
"""
Add Realistic Lat/Lng Coordinates to 50 Vũng Tàu Villas
"""

import json
import os
import re
import random

def assign_coords():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        return
        
    villas = json.loads(match.group(1))
    
    # Base areas in Vũng Tàu
    # Bãi Sau: 10.339 to 10.350, 107.085 to 107.098
    # Aria Resort / Chí Linh: 10.368 to 10.375, 107.112 to 107.122
    # Trần Phú / Bãi Trước: 10.345 to 10.365, 107.065 to 107.075
    
    random.seed(42)
    for idx, v in enumerate(villas):
        name_lower = v["name"].lower()
        if "aria" in name_lower or "chí linh" in name_lower or "long cung" in name_lower:
            lat = 10.368 + (random.random() * 0.01)
            lng = 107.112 + (random.random() * 0.01)
            area_name = "Khu Resort Chí Linh / Aria"
        elif "trần phú" in name_lower or "hạ long" in name_lower or "bãi trước" in name_lower or "bãi dâu" in name_lower:
            lat = 10.350 + (random.random() * 0.015)
            lng = 107.065 + (random.random() * 0.01)
            area_name = "Tuyến Biển Trần Phú / Bãi Trước"
        elif "đồi ngọc tước" in name_lower or "lạc long quân" in name_lower or "nguyễn hiền" in name_lower:
            lat = 10.342 + (random.random() * 0.008)
            lng = 107.088 + (random.random() * 0.008)
            area_name = "Khu Biệt Thự Đồi Ngọc Tước"
        else:
            # Bãi Sau / Thùy Vân / VTS / Phan Chu Trinh
            lat = 10.338 + (random.random() * 0.012)
            lng = 107.085 + (random.random() * 0.012)
            area_name = "Trung Tâm Bãi Sau Thùy Vân"

        v["lat"] = round(lat, 5)
        v["lng"] = round(lng, 5)
        v["areaName"] = area_name

    output_js = f"""// Tự động gán tọa độ địa lý Vũng Tàu cho Bản đồ tương tác
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã gán tọa độ lat/lng thành công cho {len(villas)} Villa!")

if __name__ == "__main__":
    assign_coords()
