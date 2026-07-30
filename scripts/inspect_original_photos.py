import json
import re

try:
    with open('scripts/mockVillas_original.js', 'r', encoding='utf-16') as f:
        text = f.read()
except Exception:
    with open('scripts/mockVillas_original.js', 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

match = re.search(r'export const mockVillas = (\[.*?\]);', text, re.DOTALL)
if match:
    villas = json.loads(match.group(1))
    print(f"Loaded {len(villas)} villas from original commit 8653a96!")
    for idx in range(min(5, len(villas))):
        v = villas[idx]
        print(f"\nVilla: {v['name']}")
        print(f"Photos count: {len(v['images'])}")
        for img in v['images']:
            print("  -", img)
