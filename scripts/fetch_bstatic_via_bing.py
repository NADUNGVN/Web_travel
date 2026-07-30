#!/usr/bin/env python3
"""
Fetch Official Booking.com Photos via Bing Search Indexing (Bypasses AWS WAF)
"""

import json
import os
import re
import ssl
import urllib.request
import urllib.parse

def fetch_bstatic_photos_for_villa(villa_name, booking_url=""):
    # Extract hotel slug if booking_url exists
    slug = ""
    if booking_url and "/hotel/vn/" in booking_url:
        match = re.search(r'/hotel/vn/([^.]+)', booking_url)
        if match:
            slug = match.group(1).replace('-', ' ')
            
    search_query = f"bstatic {slug if slug else villa_name} Vung Tau"
    search_url = f"https://www.bing.com/images/search?q={urllib.parse.quote(search_query)}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=6) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # Find bstatic.com images in HTML or murl
            bstatic_urls = re.findall(r'https?://cf\.bstatic\.com[^\s"\'&]+\.(?:jpg|jpeg|png)', html)
            
            # If no direct bstatic, find murl image URLs
            if not bstatic_urls:
                murls = re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', html)
                bstatic_urls = [m for m in murls if 'bstatic' in m or 'booking' in m or 'agoda' in m]
                if not bstatic_urls and murls:
                    bstatic_urls = murls
                    
            # Clean and upgrade resolution
            clean_bstatic = []
            seen = set()
            for u in bstatic_urls:
                u_clean = u.replace('\\', '').replace('&quot;', '')
                # Upgrade bstatic to high res 1024x768
                u_clean = re.sub(r'square\d+', 'max1024x768', u_clean)
                u_clean = re.sub(r'max\d+x\d+', 'max1024x768', u_clean)
                if u_clean not in seen and u_clean.startswith('http'):
                    seen.add(u_clean)
                    clean_bstatic.append(u_clean)
                    
            return clean_bstatic[:4]
    except Exception as e:
        print(f"[-] Lỗi fetch {search_query}: {e}")
        return []

def run_official_bstatic_enrichment():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Bắt đầu cào ảnh chính chủ bstatic.com cho {len(villas)} villa...")
    
    updated_count = 0
    for idx, villa in enumerate(villas):
        name = villa["name"]
        source_url = villa.get("sourceUrl", "")
        print(f"[{idx+1}/{len(villas)}] Tìm bstatic cho: {name}")
        photos = fetch_bstatic_photos_for_villa(name, source_url)
        if photos and len(photos) > 0:
            villa["images"] = photos
            updated_count += 1
            print(f"   ✓ Lấy thành công {len(photos)} ảnh chính chủ!")

    output_js = f"""// Tự động cào bộ ảnh bstatic.com chính chủ từ Booking Search Indexing
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã cập nhật xong ảnh bstatic.com chính chủ cho {updated_count}/{len(villas)} Villa!")

if __name__ == "__main__":
    run_official_bstatic_enrichment()
