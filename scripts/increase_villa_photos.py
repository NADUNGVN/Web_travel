#!/usr/bin/env python3
"""
Increase Villa Photos to 10-12 High-Res Photos per Villa
"""

import json
import os
import re

def expand_photos():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không đọc được mockVillas")
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Bắt đầu mở rộng kho ảnh lên 10-12 ảnh nét cao cho {len(villas)} villa...")

    # Extended high-res luxury villa photos pool
    extra_photo_pool = [
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/384218320.jpg?k=5c32729a8a72b0cf64d3910c660f970631f496c21e6fb644b988f583bb9e3204&o=",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/384218324.jpg?k=2834b6b668ebc1e3090886a1170757dfd8f515e0e012e1ec7e0ff837e289bf44&o=",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/384218328.jpg?k=424c56e3b5e4a81fa6d07d17e761df89c564344585f8e6e583c27e85c1b5055b&o=",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/412085710.jpg?k=7b49463943a41b1cfeb1e9447477161b2e2d93e17629532588c83c2005a9e334&o=",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/412085715.jpg?k=1b2a95c9629b35a51a84f329977a4560b45d045fb151e2b58832a8298711832a&o=",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/412085720.jpg?k=3f45d1a89b37a541604a11f28b495201a4034bf51a021bb204c328905b768e71&o=",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ]

    for idx, v in enumerate(villas):
        current_images = v.get("images", [])
        # Ensure at least 10-12 unique photos per villa
        needed = 12 - len(current_images)
        if needed > 0:
            # Append from extra pool
            added_photos = extra_photo_pool[:needed]
            v["images"] = current_images + added_photos

    output_js = f"""// Tự động mở rộng bộ bộ sưu tập 10-12 ảnh chất lượng cao cho 50 Villa
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã mở rộng thành công 10-12 ảnh nét cao cho tất cả 50 Villa!")

if __name__ == "__main__":
    expand_photos()
