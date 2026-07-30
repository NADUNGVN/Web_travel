#!/usr/bin/env python3
"""
Deep Scraper to extract exact Rich Text Embedded URLs from Google Sheets JS bundle
"""

import json
import re
import ssl
import urllib.request
import urllib.parse

def extract_all_sheet_urls(sheet_url):
    match = re.search(r'/d/([a-zA-Z0-9-_]+)', sheet_url)
    if not match:
        return []
    sheet_id = match.group(1)
    edit_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/edit"
    
    print(f"[+] Đang cào JS Data Bundle từ Google Sheet Edit View: {edit_url}")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(edit_url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    with urllib.request.urlopen(req, context=ctx) as response:
        html = response.read().decode('utf-8', errors='ignore')

    # Find all http/https URLs in the raw HTML JS payload
    found_urls = re.findall(r'https?://[^\s"\'\\<>]+', html)
    
    # Filter for travel/booking/villa/image links
    filtered_links = []
    for url in found_urls:
        url_clean = url.rstrip(';,."\')')
        if any(domain in url_clean.lower() for domain in ['booking.com', 'agoda.com', 'traveloka.com', 'airbnb.com', 'villa', 'facebook.com', 'bstatic.com', 'akamaized.net']):
            if url_clean not in filtered_links:
                filtered_links.append(url_clean)

    print(f"[✓] Đã bóc tách được {len(filtered_links)} đường dẫn link gốc từ Google Sheet!")
    return filtered_links

if __name__ == "__main__":
    url = "https://docs.google.com/spreadsheets/d/1gv8Xq04uPuYWjRirSvVQartVdf8BuxsxEuh2CG78tVM/edit?usp=sharing"
    urls = extract_all_sheet_urls(url)
    for idx, u in enumerate(urls[:20], 1):
        print(f"[{idx}] {u}")
