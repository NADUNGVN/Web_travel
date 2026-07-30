async function testAlbumScrape() {
  const url = "https://www.booking.com/hotel/vn/villa-8-phong-ngu-bida-dan-karaoke-le-hong-phong.vi.html";
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    const html = await res.text();
    console.log(`Status: ${res.status}, Length: ${html.length}`);
    
    const photoIds = html.match(/[0-9]{8,10}/g) || [];
    console.log("Found raw numbers sample:", photoIds.slice(0, 10));

    const bstaticMatches = html.match(/bstatic\.com[^\s"']+/g) || [];
    console.log("Found bstatic strings:", bstaticMatches.length);
    if (bstaticMatches.length > 0) {
      console.log("Sample bstatic:", bstaticMatches.slice(0, 5));
    }
  } catch (err) {
    console.error(err);
  }
}

testAlbumScrape();
