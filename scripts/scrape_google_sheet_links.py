#!/usr/bin/env python3
"""
Scrape Embedded Hyperlink URLs directly from Google Sheet HTML View
"""

import json
import re
import ssl
import urllib.request
import urllib.parse
from html.parser import HTMLParser

class GoogleSheetHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self.current_row = []
        self.current_cell = {"text": "", "link": ""}
        self.in_td = False
        self.in_a = False

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "tr":
            self.current_row = []
        elif tag == "td":
            self.in_td = True
            self.current_cell = {"text": "", "link": ""}
        elif tag == "a" and self.in_td:
            self.in_a = True
            href = attr_dict.get("href", "")
            # Clean Google redirect links (e.g. google.com/url?q=HTTPS_LINK)
            if "google.com/url?" in href:
                parsed_url = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
                clean_href = parsed_url.get("q", [href])[0]
            else:
                clean_href = href
            self.current_cell["link"] = clean_href

    def handle_endtag(self, tag):
        if tag == "td" and self.in_td:
            self.in_td = False
            if self.current_cell["text"].strip():
                self.current_row.append(dict(self.current_cell))
        elif tag == "a":
            self.in_a = False
        elif tag == "tr" and self.current_row:
            self.rows.append(list(self.current_row))

    def handle_data(self, data):
        if self.in_td:
            self.current_cell["text"] += data

def get_sheet_embedded_links(sheet_url):
    match = re.search(r'/d/([a-zA-Z0-9-_]+)', sheet_url)
    if not match:
        return []
    sheet_id = match.group(1)
    html_view_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/htmlview"
    
    print(f"[+] Đang cào đường dẫn ngầm từ HTML View: {html_view_url}")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(html_view_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req, context=ctx) as response:
        html_content = response.read().decode('utf-8', errors='ignore')

    parser = GoogleSheetHTMLParser()
    parser.feed(html_content)
    
    links_data = []
    for r_idx, row in enumerate(parser.rows, 1):
        if row:
            title = row[0]["text"].strip()
            link = row[0]["link"].strip()
            if title and title != "Tên" and not title.startswith("Sheet"):
                links_data.append({
                    "idx": len(links_data) + 1,
                    "title": title,
                    "link": link
                })
                
    print(f"[✓] Tìm thấy {len(links_data)} link ngầm gắn trong từng ô!")
    return links_data

if __name__ == "__main__":
    url = "https://docs.google.com/spreadsheets/d/1gv8Xq04uPuYWjRirSvVQartVdf8BuxsxEuh2CG78tVM/edit?usp=sharing"
    data = get_sheet_embedded_links(url)
    for item in data[:15]:
        print(f"[{item['idx']}] {item['title'][:45]}...\n   => LINK: {item['link']}\n")
