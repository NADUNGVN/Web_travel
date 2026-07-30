#!/usr/bin/env python3
"""
Fix 50 Villa Coordinates to Land Areas in Vũng Tàu & Add 'highlights' field
"""

import json
import os
import re
import random

def fix_coords_and_highlights():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không đọc được mockVillas")
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Bắt đầu cập nhật tọa độ đất liền thực tế và trường highlights cho {len(villas)} villa...")

    # Real Vũng Tàu Villa Land Clusters (avoiding Hồ Bàu Sen lake & sea)
    clusters = [
        # Cluster 1: Bãi Sau / Đồi Ngọc Tước / Thuỳ Vân
        {"lat_min": 10.335, "lat_max": 10.348, "lng_min": 107.089, "lng_max": 107.098},
        # Cluster 2: Phan Chu Trinh / Á Áu / Hoàng Hoa Thám
        {"lat_min": 10.330, "lat_max": 10.340, "lng_min": 107.080, "lng_max": 107.088},
        # Cluster 3: Võ Thị Sáu / Chu Mạnh Trinh / Lê Hồng Phong
        {"lat_min": 10.342, "lat_max": 10.352, "lng_min": 107.083, "lng_max": 107.092},
        # Cluster 4: Trần Phú / Bãi Trước
        {"lat_min": 10.355, "lat_max": 10.370, "lng_min": 107.068, "lng_max": 107.078},
        # Cluster 5: Chí Linh / Aria Resort / Thuỳ Dương
        {"lat_min": 10.368, "lat_max": 10.385, "lng_min": 107.112, "lng_max": 107.124}
    ]

    highlight_options = [
        "Cách biển Bãi Sau 150m đi bộ",
        "Hồ bơi riêng rộng 45m² siêu đẹp",
        "Sân vườn nướng BBQ rộng rãi cho đoàn 20 người",
        "Trang bị bàn Bida & Dàn Karaoke miễn phí",
        "Có thang máy hiện đại, phù hợp đoàn đông",
        "Phòng ốc rộng thoáng, view biển ngắm hoàng hôn",
        "Đậu được 3-4 xe ô tô 16-29 chỗ thoải mái",
        "Không gian yên tĩnh, riêng tư tuyệt đối"
    ]

    for idx, v in enumerate(villas):
        # Pick cluster based on index or title keywords
        name_lower = v["name"].lower()
        if "aria" in name_lower or "chí linh" in name_lower:
            c = clusters[4]
        elif "trần phú" in name_lower or "bãi trước" in name_lower:
            c = clusters[3]
        elif "phan chu trinh" in name_lower or "á áu" in name_lower:
            c = clusters[1]
        elif "võ thị sáu" in name_lower:
            c = clusters[2]
        else:
            c = clusters[idx % 4]

        # Assign precise land lat/lng with small unique offset
        v["lat"] = round(random.uniform(c["lat_min"], c["lat_max"]), 6)
        v["lng"] = round(random.uniform(c["lng_min"], c["lng_max"]), 6)

        # Ensure highlights array exists
        if "highlights" not in v or not v["highlights"]:
            # Select 2-3 highlights
            sample_hl = random.sample(highlight_options, k=3)
            v["highlights"] = sample_hl

    output_js = f"""// Tự động kiểm tra & chuẩn hóa tọa độ đất liền Vũng Tàu + Trường Điểm Đặc Biệt
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã cập nhật xong tọa độ đất liền thực tế và highlights cho 50 Villa!")

if __name__ == "__main__":
    fix_coords_and_highlights()
