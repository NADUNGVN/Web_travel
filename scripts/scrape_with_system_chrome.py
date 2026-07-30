#!/usr/bin/env python3
"""
Scrape Booking photos using Python Playwright with System Chrome
"""

import json
import os
import re
from playwright.sync_api import sync_playwright

def scrape_chrome():
    url = "https://www.booking.com/hotel/vn/villa-8-phong-ngu-bida-dan-karaoke-le-hong-phong.vi.html"
    print(f"[+] Bắt đầu thử nghiệm cào qua Playwright...")

    with sync_playwright() as p:
        # Try system chrome or default chromium
        try:
            browser = p.chromium.launch(headless=True)
        except Exception:
            browser = p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe", headless=True)

        page = browser.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(3000)

        # Extract all bstatic photo IDs
        extracted_photos = page.evaluate("""() => {
            const urls = new Set();
            document.querySelectorAll('img, a').forEach(el => {
                const src = el.getAttribute('src') || el.getAttribute('href') || el.getAttribute('data-src');
                if (src && src.includes('bstatic.com')) {
                    const match = src.match(/\/([0-9]+)\.jpg/);
                    if (match && match[1] && match[1].length >= 7) {
                        urls.add('https://cf.bstatic.com/xdata/images/hotel/max1024x768/' + match[1] + '.jpg?k=5c32729a8a72b0cf64d3910c660f970631f496c21e6fb644b988f583bb9e3204&o=');
                    }
                }
            });
            return Array.from(urls);
        }""")

        print(f"[✓] Lấy được {len(extracted_photos)} ảnh bstatic thực tế!")
        for img in extracted_photos:
            print(" -", img)

        browser.close()

if __name__ == "__main__":
    scrape_chrome()
