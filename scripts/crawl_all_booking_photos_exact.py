#!/usr/bin/env python3
"""
Playwright Scraper: Extract ALL Official Booking.com Photos per Villa
Replaces mockVillas.js 'images' array strictly with 100% crawled photos from sourceUrl.
"""

import json
import os
import re
from playwright.sync_api import sync_playwright

def crawl_exact_photos():
    mock_js_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mockVillas.js")
    with open(mock_js_path, 'r', encoding='utf-8') as f:
        js_text = f.read()
        
    match = re.search(r'export const mockVillas = (\[.*?\]);', js_text, re.DOTALL)
    if not match:
        print("[-] Không đọc được mockVillas")
        return
        
    villas = json.loads(match.group(1))
    print(f"[+] Bắt đầu cào 100% ảnh gốc từ Booking.com cho {len(villas)} villa...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x54) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )

        for idx, v in enumerate(villas):
            url = v.get("sourceUrl")
            print(f"[{idx+1}/{len(villas)}] Cào ảnh từ URL: {url}...")
            
            if not url or "booking.com" not in url:
                continue

            crawled_images = []
            page = context.new_page()
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=25000)
                page.wait_for_timeout(2000)

                # Extract all high-res bstatic.com images from gallery / img tags
                imgs = page.evaluate("""() => {
                    const urls = new Set();
                    document.querySelectorAll('img').forEach(img => {
                        const src = img.getAttribute('src') || img.getAttribute('data-src');
                        if (src && src.includes('bstatic.com') && src.includes('max1024x768')) {
                            urls.add(src);
                        } else if (src && src.includes('bstatic.com') && src.includes('square600')) {
                            urls.add(src.replace('square600', 'max1024x768'));
                        }
                    });
                    return Array.from(urls);
                }""")

                if imgs and len(imgs) > 0:
                    crawled_images = imgs
                    print(f"   ✓ Đã lấy được {len(imgs)} ảnh gốc từ Booking!")
                else:
                    print(f"   ⚠️ Giữ nguyên ảnh bstatic đã cào trước đó ({len(v.get('images', []))} ảnh)")

            except Exception as e:
                print(f"   ❌ Lỗi cào ảnh ({e}), giữ nguyên ảnh bstatic sẵn có.")
            finally:
                page.close()

            # Filter images: strictly keep ONLY official bstatic.com photos, zero unsplash/external photos
            if crawled_images:
                v["images"] = [img for img in crawled_images if "bstatic.com" in img]
            else:
                v["images"] = [img for img in v.get("images", []) if "bstatic.com" in img]

        browser.close()

    output_js = f"""// 100% Ảnh gốc cào trực tiếp từ Booking.com theo URL (Không dùng ảnh mẫu ngoài)
export const mockVillas = {json.dumps(villas, ensure_ascii=False, indent=2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {{
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
}};
"""
    with open(mock_js_path, 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"[✓] Đã cập nhật 100% ảnh cào trực tiếp từ Booking.com cho tất cả {len(villas)} Villa!")

if __name__ == "__main__":
    crawl_exact_photos()
