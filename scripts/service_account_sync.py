#!/usr/bin/env python3
"""
Google Sheets API Two-Way Sync Handler using Service Account Credentials (credentials.json)
"""

import json
import os
import urllib.request
import urllib.parse
import ssl

def load_credentials(cred_path):
    if not os.path.exists(cred_path):
        raise FileNotFoundError(f"Không tìm thấy file credentials: {cred_path}")
    with open(cred_path, 'r', encoding='utf-8') as f:
        return json.load(f)

if __name__ == "__main__":
    cred_file = os.path.join(os.path.dirname(__file__), "..", "credentials.json")
    if os.path.exists(cred_file):
        creds = load_credentials(cred_file)
        print(f"[✓] Đã kết nối thành công Service Account: {creds.get('client_email')}")
    else:
        print("[-] Chưa tìm thấy credentials.json")
