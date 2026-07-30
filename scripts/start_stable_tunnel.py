import subprocess
import re
import time

print("[+] Đang khởi tạo Cloudflare Tunnel siêu ổn định...")
cmd = "npx -y cloudflared tunnel --url http://localhost:3000"
proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding='utf-8', errors='ignore')

tunnel_url = ""
start_time = time.time()

while time.time() - start_time < 15:
    line = proc.stdout.readline()
    if not line:
        time.sleep(0.5)
        continue
    print(line.strip())
    match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
    if match:
        tunnel_url = match.group(0)
        break

if tunnel_url:
    print(f"\n[✓] LINK TRUY CẬP TRÊN ĐIỆN THOẠI SIÊU ỔN ĐỊNH: {tunnel_url}\n")
    with open("active_mobile_url.txt", "w") as f:
        f.write(tunnel_url)
else:
    print("[-] Không bắt được URL Cloudflare")
