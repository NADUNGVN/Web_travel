#!/usr/bin/env python3
"""
Clear all fake/mock votes from mockVillas.js
Set initial votes to { yes: 0, maybe: 0, no: 0 } for all 50 villas.
"""

import json
import os
import re

def clear_fake_votes():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không đọc được mockVillas")
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Xóa toàn bộ vote giả định, reset về 0 lượt vote thực tế...")
    
    for v in villas:
        v["votes"] = {"yes": 0, "maybe": 0, "no": 0}

    output_js = f"""// Reset toàn bộ lượt vote về 0 thực tế (Không dùng vote giả lập)
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã reset 100% lượt vote về 0 cho tất cả {len(villas)} Villa!")

if __name__ == "__main__":
    clear_fake_votes()
