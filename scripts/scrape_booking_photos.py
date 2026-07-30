#!/usr/bin/env python3
"""
Scrape Exact Photos from the 50 Booking.com Villa URLs Extracted from Google Sheet
"""

import json
import os
import re
import ssl
import urllib.request
from extract_rich_text_links import extract_all_sheet_urls

def fetch_booking_photos(booking_url):
    """Bóc tách ảnh high-res (bstatic.com) trực tiếp từ trang Booking.com chính chủ"""
    print(f"[+] Đang cào ảnh từ Booking: {booking_url}")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
    }

    try:
        req = urllib.request.Request(booking_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=8) as response:
            html = response.read().decode('utf-8', errors='ignore')

            # Find all bstatic.com max photo URLs
            imgs = re.findall(r'https?://cf\.bstatic\.com/xdata/images/hotel/max1024x768/[^\s"\'\\]+', html)
            if not imgs:
                imgs = re.findall(r'https?://cf\.bstatic\.com/xdata/images/hotel/square600/[^\s"\'\\]+', html)
            if not imgs:
                imgs = re.findall(r'https?://cf\.bstatic\.com[^\s"\'\\]+\.(?:jpg|jpeg|png)', html)

            # Deduplicate while preserving order
            seen = set()
            unique_imgs = []
            for img in imgs:
                # Upgrade resolution to 1024x768 if square600
                img_high = img.replace('square600', 'max1024x768').replace('max500', 'max1024x768')
                if img_high not in seen:
                    seen.add(img_high)
                    unique_imgs.append(img_high)

            return unique_imgs[:5]
    except Exception as e:
        print(f"[-] Lỗi cào Booking ({booking_url}): {e}")
        return []

def run_booking_photo_scraper():
    sheet_url = "https://docs.google.com/spreadsheets/d/1gv8Xq04uPuYWjRirSvVQartVdf8BuxsxEuh2CG78tVM/edit?usp=sharing"
    booking_links = extract_all_sheet_urls(sheet_url)
    
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không đọc được mockVillas")
        return
        
    villas = json.loads(match.group(1))
    
    print(f"[+] Bắt đầu cào ảnh Booking.com chính chủ cho {len(villas)} căn...")
    
    success_count = 0
    for idx, villa in enumerate(villas):
        # Match with booking link by index if available
        if idx < len(booking_links):
            link = booking_links[idx]
            villa["sourceUrl"] = link
            real_photos = fetch_booking_photos(link)
            if real_photos and len(real_photos) > 0:
                villa["images"] = real_photos
                success_count += 1
                print(f"   ✓ [{idx+1}] {villa['name'][:30]}... -> Lấy {len(real_photos)} ảnh bstatic chính chủ!")

    output_js = f"""// Tự động cào bộ ảnh bstatic.com chính chủ từ 50 link Booking.com trong Google Sheet
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] ĐÃ CÀO BỘ ẢNH BSTATIC.COM CHÍNH CHỦ THÀNH CÔNG CHO {success_count}/{len(villas)} VILLA!")

if __name__ == "__main__":
    run_booking_photo_scraper()
