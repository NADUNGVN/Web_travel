#!/usr/bin/env python3
"""
Bing Real Villa Image Scraper for 50 Vũng Tàu Villas
Cào hình ảnh thực tế chính xác từng căn Villa từ Bing Image Search
"""

import csv
import json
import os
import re
import ssl
import urllib.request
import urllib.parse

def fetch_bing_image(query):
    search_url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query + ' Vung Tau villa')}&first=1"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    }
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(search_url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=6) as response:
            html = response.read().decode('utf-8', errors='ignore')
            # Extract murl (media url in Bing image results)
            murls = re.findall(r'&quot;murl&quot;:&quot;(https?://[^&]+)&quot;', html)
            if not murls:
                murls = re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', html)
            
            # Filter image URLs ending in jpg, png, webp
            valid = [u for u in murls if any(u.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.jpg']) or 'booking' in u or 'agoda' in u or 'traveloka' in u or 'bstatic' in u]
            return valid[:3] if valid else murls[:3]
    except Exception as e:
        print(f"[-] Lỗi cào Bing cho {query}: {e}")
        return []

def run_bing_photo_update():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không tìm thấy mockVillas")
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Bắt đầu tìm ảnh thực tế Bing cho {len(villas)} căn Villa...")
    
    updated_count = 0
    for idx, villa in enumerate(villas):
        name = villa["name"]
        print(f"[{idx+1}/{len(villas)}] Tìm ảnh cho: {name}")
        images = fetch_bing_image(name)
        if images and len(images) > 0:
            villa["images"] = images
            updated_count += 1
            print(f"   ✓ Lấy được {len(images)} ảnh thực tế")

    output_js = f"""// Tự động cập nhật từ Bing Real Image Scraper
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã cập nhật xong ảnh thực tế Bing cho {updated_count}/{len(villas)} Villa!")

if __name__ == "__main__":
    run_bing_photo_update()
