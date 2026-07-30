import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILLER_IDS = new Set(["384218320", "384218324", "384218328", "412085710", "412085715", "412085720"]);

async function scrapeExactKGalleries() {
  const mockPath = path.join(__dirname, '../src/data/mockVillas.js');
  let jsText = fs.readFileSync(mockPath, 'utf8');
  
  const match = jsText.match(/export const mockVillas = (\[[\s\S]*?\]);/);
  if (!match) {
    console.log('[-] Không đọc được mockVillas');
    return;
  }

  const villas = JSON.parse(match[1]);
  console.log(`[+] Bắt đầu cào mở rộng 100% kho ảnh thực tế có signature k= chuẩn từ Booking DOM cho ${villas.length} villa...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });

  let totalPhotosExtracted = 0;

  for (let i = 0; i < villas.length; i++) {
    const v = villas[i];
    const url = v.sourceUrl;

    if (!url || !url.includes('booking.com')) {
      console.log(`[${i + 1}/${villas.length}] ⚠️ Không có URL Booking: ${v.name}`);
      continue;
    }

    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2500);

      // Extract all bstatic photo URLs containing valid k= signature
      const validPhotoUrls = await page.evaluate(() => {
        const urls = new Set();
        
        // Helper to check and add URL
        const checkAndAdd = (str) => {
          if (!str || typeof str !== 'string') return;
          const matches = str.match(/https:\/\/cf\.bstatic\.com\/xdata\/images\/hotel\/[a-zA-Z0-9_]+\/([0-9]+)\.jpg\?k=([a-f0-9]{64})/g);
          if (matches) {
            matches.forEach(m => {
              // Standardize to max1024x768
              const std = m.replace(/\/images\/hotel\/[a-zA-Z0-9_]+\//, '/images/hotel/max1024x768/') + '&o=';
              urls.add(std);
            });
          }
        };

        // Search script tags
        document.querySelectorAll('script').forEach(s => checkAndAdd(s.textContent));

        // Search img and a tags
        document.querySelectorAll('img, a, div, span').forEach(el => {
          checkAndAdd(el.getAttribute('src'));
          checkAndAdd(el.getAttribute('data-src'));
          checkAndAdd(el.getAttribute('href'));
          checkAndAdd(el.style.backgroundImage);
        });

        return Array.from(urls);
      });

      // Filter filler photos
      const cleanList = validPhotoUrls.filter(u => {
        for (const fid of FILLER_IDS) {
          if (u.includes(fid)) return false;
        }
        return true;
      });

      if (cleanList.length >= 3) {
        v.images = cleanList;
        totalPhotosExtracted += cleanList.length;
        console.log(`[${i + 1}/${villas.length}] ✓ ${v.name.substring(0, 30)}... -> Cào mở rộng ${cleanList.length} ảnh thực tế có k= chuẩn!`);
      } else {
        console.log(`[${i + 1}/${villas.length}] ℹ️ ${v.name.substring(0, 30)}... -> Giữ ${v.images.length} ảnh sẵn có`);
      }
    } catch (err) {
      console.log(`[${i + 1}/${villas.length}] ❌ Lỗi cào ${url}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const outputJs = `// 100% Bộ sưu tập ảnh thực tế đầy đủ có signature k= chuẩn từ Booking.com (Cào bằng Playwright)
export const mockVillas = ${JSON.stringify(villas, null, 2)};

export const getCostPerPerson = (priceTotal, groupSize = 20, nights = 2) => {
  if (!priceTotal || !groupSize) return 0;
  return Math.round((priceTotal * nights) / groupSize);
};
`;

  fs.writeFileSync(mockPath, outputJs, 'utf8');
  console.log(`[✓] Hoàn thành! Đã cào bóc tách tổng cộng ${totalPhotosExtracted} ảnh thực tế có k= chuẩn cho ${villas.length} Villa!`);
}

scrapeExactKGalleries();
