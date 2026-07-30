import { chromium } from 'playwright';

async function debugBookingJson() {
  const url = "https://www.booking.com/hotel/vn/palm-villa-09-biet-thu-doi-ngoc-tuoc-giau-bang.vi.html";
  console.log(`[+] Phân tích cấu trúc dữ liệu ảnh Booking: ${url}...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });

  const scriptContents = await page.evaluate(() => {
    const scripts = [];
    document.querySelectorAll('script').forEach(s => {
      if (s.textContent && s.textContent.includes('b_photos')) {
        scripts.push(s.textContent);
      }
    });
    return scripts;
  });

  console.log(`[✓] Tìm thấy ${scriptContents.length} thẻ script chứa b_photos!`);
  if (scriptContents.length > 0) {
    console.log("Snippet:", scriptContents[0].substring(0, 500));
  } else {
    // Print all photo-like URLs in HTML content
    const html = await page.content();
    const matches = html.match(/https:\/\/[^"'\s]*bstatic\.com[^"'\s]*/g) || [];
    console.log(`[✓] Tổng số URL bstatic trong HTML: ${matches.length}`);
    console.log("Sample URLs:", matches.slice(0, 10));
  }

  await browser.close();
}

debugBookingJson();
