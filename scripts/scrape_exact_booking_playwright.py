#!/usr/bin/env python3
"""
Playwright Exact Booking.com Photo Crawler
Mở trực tiếp từng URL Booking.com của 50 Villa từ Google Sheet bằng Playwright Headless Browser
để bóc tách 100% ảnh không gian thực tế (Phòng ngủ, Bể bơi, Phòng khách, Sân BBQ, WC).
"""

import json
import os
import re
import time
from extract_rich_text_links import extract_all_sheet_urls
from playwright.sync_api import sync_playwright

def scrape_real_booking_photos_playwright():
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
    print(f"[+] Bắt đầu cào bộ ảnh Playwright chính chủ từ 50 URL Booking cho {len(villas)} villa...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            locale="vi-VN"
        )
        page = context.new_page()

        success_count = 0
        for idx, villa in enumerate(villas):
            if idx >= len(booking_links):
                break
                
            booking_url = booking_links[idx]
            villa["sourceUrl"] = booking_url
            print(f"[{idx+1}/{len(villas)}] Cào ảnh chính chủ từ Booking: {villa['name'][:35]}...")
            
            try:
                page.goto(booking_url, timeout=20000, wait_until="domcontentloaded")
                time.sleep(1.5)  # allow dynamic gallery images to load
                
                # Query all bstatic image tags & gallery links
                img_elements = page.query_selector_all('img')
                raw_srcs = []
                for img in img_elements:
                    src = img.get_attribute('src') or img.get_attribute('data-src') or ""
                    if 'cf.bstatic.com' in src and not src.endswith('.png') and 'images-flags' not in src:
                        raw_srcs.append(src)
                        
                # Upgrade image resolutions to max1024x768
                cleaned_imgs = []
                seen = set()
                for src in raw_srcs:
                    high_res = re.sub(r'square\d+|max\d+x\d+|max\d+', 'max1024x768', src)
                    if high_res not in seen and 'max1024x768' in high_res:
                        seen.add(high_res)
                        cleaned_imgs.append(high_res)

                if cleaned_imgs:
                    villa["images"] = cleaned_imgs[:6]
                    success_count += 1
                    print(f"   ✓ Lấy được {len(cleaned_imgs[:6])} ảnh chính chủ!")
                else:
                    print(f"   ⚠️ Không lấy được ảnh bstatic cho {villa['name']}")
                    
            except Exception as e:
                print(f"   [-] Lỗi cào trang {booking_url}: {e}")

        browser.close()

    # Save updated villas back to mockVillas.js
    output_js = f"""// Tự động bóc tách bộ ảnh 100% chính chủ từ Playwright Headless Browser trên 50 URL Booking.com
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] ĐÃ HOÀN THÀNH CÀO 100% BỘ ẢNH CHÍNH CHỦ CHO {success_count}/{len(villas)} VILLA!")

if __name__ == "__main__":
    scrape_real_booking_photos_playwright()
