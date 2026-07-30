#!/usr/bin/env python3
"""
Extract Embedded Hyperlinks from Google Sheet Cells using Google Sheets API v4 & credentials.json
"""

import json
import os
import re
import ssl
import urllib.request

def get_service_account_token(cred_path):
    """Tạo OAuth2 Token cho Google Sheets API từ credentials.json"""
    import time
    with open(cred_path, 'r', encoding='utf-8') as f:
        creds = json.load(f)
        
    private_key = creds['private_key']
    client_email = creds['client_email']
    token_uri = creds['token_uri']
    
    # We can use PyJWT or urllib with google auth if installed, or fallback to direct google sheets API
    return creds

def extract_hyperlinks_with_api():
    cred_file = os.path.join(os.path.dirname(__file__), "..", "credentials.json")
    sheet_id = "1gv8Xq04uPuYWjRirSvVQartVdf8BuxsxEuh2CG78tVM"
    
    print(f"[+] Đang trích xuất Hyperlink ngầm từ Google Sheet ID: {sheet_id}")
    
    # Check if google-auth and google-api-python-client are installed or install via pip if needed
    try:
        from google.oauth2.service_account import Credentials
        from googleapiclient.discovery import build
        
        scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
        creds = Credentials.from_service_account_file(cred_file, scopes=scopes)
        service = build('sheets', 'v4', credentials=creds)
        
        # Get sheet data with hyperlinks
        result = service.spreadsheets().get(
            spreadsheetId=sheet_id,
            fields='sheets/data/rowData/values(formattedValue,hyperlink,userEnteredValue)'
        ).execute()
        
        rows = result['sheets'][0]['data'][0]['rowData']
        extracted = []
        for idx, row in enumerate(rows, 1):
            values = row.get('values', [])
            if not values:
                continue
            cell = values[0]
            name = cell.get('formattedValue', f'Villa #{idx}')
            link = cell.get('hyperlink')
            
            # Check formula if hyperlink field not populated
            if not link and 'userEnteredValue' in cell:
                formula = cell['userEnteredValue'].get('formulaValue', '')
                h_match = re.search(r'HYPERLINK\("([^"]+)"', formula, re.IGNORECASE)
                if h_match:
                    link = h_match.group(1)
                    
            extracted.append({
                "idx": idx,
                "name": name,
                "link": link or ""
            })
            
        print(f"[✓] Đã trích xuất {len(extracted)} hàng từ Google Sheets API!")
        return extracted
    except Exception as e:
        print(f"[-] API Exception: {e}")
        return []

if __name__ == "__main__":
    links = extract_hyperlinks_with_api()
    for item in links[:10]:
        print(f"[{item['idx']}] {item['name'][:40]}... -> LINK: {item['link']}")
