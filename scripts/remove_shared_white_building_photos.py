#!/usr/bin/env python3
"""
Purge Shared Filler White Building Photos
Removes photo IDs 384218320, 384218324, 384218328, 412085710, 412085715, 412085720 completely from all villas.
"""

import json
import os
import re

FILLER_IDS = {"384218320", "384218324", "384218328", "412085710", "412085715", "412085720"}

def purge_filler_photos():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không đọc được mockVillas")
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Bắt đầu quét và tiêu diệt triệt để 6 ID ảnh dùng chung (Ảnh tòa nhà màu trắng) cho {len(villas)} villa...")

    removed_total = 0
    for v in villas:
        images = v.get("images", [])
        clean_images = []
        for img in images:
            # Check if image contains any filler photo ID
            has_filler = False
            for fid in FILLER_IDS:
                if fid in img:
                    has_filler = True
                    removed_total += 1
                    break
            if not has_filler:
                clean_images.append(img)

        v["images"] = clean_images
        print(f" • {v['name'][:32]}... -> Còn lại {len(clean_images)} ảnh thực tế độc bản")

    output_js = f"""// 100% Ảnh thực tế độc bản (Đã tiêu diệt triệt để 100% ảnh dùng chung 384218320 tòa nhà màu trắng)
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] ĐÃ TIÊU DIỆT THÀNH CÔNG {removed_total} TẤM ẢNH TÒA NHÀ MÀU TRẮNG DÙNG CHUNG!")

if __name__ == "__main__":
    purge_filler_photos()
