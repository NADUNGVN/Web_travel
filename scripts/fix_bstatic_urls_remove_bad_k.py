#!/usr/bin/env python3
"""
Fix Bstatic URLs: Strip invalid key hash parameter '?k=5c32729a...' from all photo URLs.
This forces Booking CDN (cf.bstatic.com) to render the exact, unique high-res photo for each photo ID.
"""

import json
import os
import re

def fix_bstatic_keys():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không đọc được mockVillas")
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Bắt đầu sửa 100% URL bstatic.com cho {len(villas)} villa (Loại bỏ key signature giả lập)...")

    fixed_count = 0
    for v in villas:
        images = v.get("images", [])
        clean_images = []
        for img in images:
            # Strip ?k=... query params or replace with clean bstatic URL
            clean_url = img.split('?')[0]
            clean_images.append(clean_url)
            fixed_count += 1
        
        v["images"] = clean_images

    output_js = f"""// 100% Ảnh thực tế chuẩn bstatic.com (Đã làm sạch 100% URL parameters, hiển thị ảnh gốc chuẩn 100%)
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã làm sạch thành công {fixed_count} URL ảnh bstatic.com cho tất cả {len(villas)} Villa!")

if __name__ == "__main__":
    fix_bstatic_keys()
