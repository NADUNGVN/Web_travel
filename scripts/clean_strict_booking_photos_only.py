#!/usr/bin/env python3
"""
Strict Clean: Retain ONLY exact bstatic.com photos scraped from Booking.com URLs.
Remove 100% of unsplash, stock, or padded filler photos.
"""

import json
import os
import re

def strict_clean():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không đọc được mockVillas")
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Lọc triệt để 100% ảnh cào thực tế từ Booking cho {len(villas)} villa...")

    total_photos_count = 0
    for v in villas:
        # Keep ONLY official bstatic.com URLs
        raw_images = v.get("images", [])
        clean_images = []
        seen = set()

        for img in raw_images:
            if "bstatic.com" in img and img not in seen:
                seen.add(img)
                clean_images.append(img)

        # Set exact clean bstatic images
        v["images"] = clean_images
        total_photos_count += len(clean_images)
        print(f"• {v['name'][:30]}... -> {len(clean_images)} ảnh gốc Booking")

    output_js = f"""// 100% Ảnh gốc cào trực tiếp từ Booking.com (Đã làm sạch hoàn toàn 100% ảnh phụ/ảnh ngoài)
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã làm sạch triệt để! Tổng cộng {total_photos_count} ảnh bstatic.com gốc từ Booking cho 50 Villa.")

if __name__ == "__main__":
    strict_clean()
