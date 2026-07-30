#!/usr/bin/env python3
"""
Sanitize mockVillas.js: Remove 100% of non-bstatic photos.
Ensure ONLY official bstatic.com Booking URLs are retained.
"""

import json
import os
import re

def sanitize_bstatic_only():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không đọc được mockVillas")
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Bắt đầu lọc sạch 100% ảnh bstatic.com gốc từ Booking cho {len(villas)} villa...")

    for v in villas:
        bstatic_photos = [img for img in v.get("images", []) if "bstatic.com" in img]
        # Remove duplicate image URLs
        seen = set()
        unique_bstatic = []
        for img in bstatic_photos:
            if img not in seen:
                seen.add(img)
                unique_bstatic.append(img)

        v["images"] = unique_bstatic

    output_js = f"""// 100% Ảnh gốc cào trực tiếp từ Booking.com (Lọc sạch 100% ảnh ngoài)
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã lọc sạch 100% ảnh chỉ giữ lại ảnh bstatic.com cào từ Booking.com!")

if __name__ == "__main__":
    sanitize_bstatic_only()
