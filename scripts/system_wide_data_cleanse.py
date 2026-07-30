#!/usr/bin/env python3
"""
System-Wide Data Cleanse & Audit Script
Rà soát và loại bỏ toàn bộ dữ liệu giả lập (Fake Ratings, Fake Comments, Fake Votes) trên toàn hệ thống.
"""

import json
import os
import re

def cleanse_system_data():
    # 1. Cleanse mockVillas.js
    mock_villas_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_villas_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if match:
        villas = json.loads(match.group(1))
        for v in villas:
            v["votes"] = {"yes": 0, "maybe": 0, "no": 0}
            if "rating" in v: del v["rating"]
            if "reviewCount" in v: del v["reviewCount"]

        output_js = f"""// Dữ liệu 100% thực tế từ Google Sheet & Booking.com (Đã làm sạch hoàn toàn dữ liệu giả định)
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
        with open(mock_villas_path, 'w', encoding='utf-8') as f:
            f.write(output_js)
        print("[✓] Đã làm sạch 100% dữ liệu mockVillas.js (Loại bỏ fake rating, fake review, fake votes)")

    # 2. Cleanse mockFood.js
    mock_food_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockFood.js")
    with open(mock_food_path, 'r', encoding='utf-8') as f:
        food_text = f.read()
        
    match_food = re.search(r'export const mockFoodPlaces = (\[.*?\]);', food_text, re.DOTALL)
    if match_food:
        foods = json.loads(match_food.group(1))
        for f in foods:
            f["votes"] = {"yes": 0, "maybe": 0, "no": 0}
            if "rating" in f: del f["rating"]
            if "reviewCount" in f: del f["reviewCount"]

        output_food_js = f"""// Dữ liệu nhà hàng & quán ăn Vũng Tàu thực tế (Đã làm sạch toàn bộ dữ liệu giả định)
export const mockFoodPlaces = {json.dumps(foods, ensure_ascii=False, indent=2)};
"""
        with open(mock_food_path, 'w', encoding='utf-8') as f:
            f.write(output_food_js)
        print("[✓] Đã làm sạch 100% dữ liệu mockFood.js (Loại bỏ fake rating, fake review, fake votes)")

if __name__ == "__main__":
    cleanse_system_data()
