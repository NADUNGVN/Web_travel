import { chromium } from 'playwright';

async function testRealSrcMobile() {
  const url = "https://www.booking.com/hotel/vn/palm-villa-09-biet-thu-doi-ngoc-tuoc-giau-bang.vi.html";
  console.log(`[+] Đang mở trang Booking trên mobile: ${url}...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 }
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  const images = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('img').forEach(img => {
      const src = img.src || img.getAttribute('data-src') || img.getAttribute('lazy-src');
      if (src && src.includes('bstatic.com')) {
        list.push(src);
      }
    });
    return list;
  });

  console.log(`[✓] Lấy được ${images.length} URL ảnh từ Mobile DOM:`);
  images.slice(0, 15).forEach(u => console.log(" -", u));

  await browser.close();
}

testRealSrcMobile();
