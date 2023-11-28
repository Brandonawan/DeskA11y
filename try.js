const puppeteer = require('puppeteer');

async function testImageAccessibility(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Wait for lazy-loaded images to become visible
// Wait for lazy-loaded images to become visible with a longer timeout (e.g., 60 seconds)
await page.waitForSelector('img[loading="lazy"]:not([alt=""])', { timeout: 60000 });


  // Evaluate the images after they become visible
  const images = await page.$$eval('img', (imgs) =>
    imgs.map((img) => ({
      src: img.src,
      alt: img.alt,
    }))
  );

  const accessibilityIssues = [];

  images.forEach((img, index) => {
    if (!img.alt.trim()) {
      accessibilityIssues.push({
        index,
        src: img.src,
        issue: 'Missing alt text',
      });
    }
    // Add additional checks as needed
  });

  console.log('Accessibility Issues:', accessibilityIssues);

  await browser.close();
}

// Example usage
testImageAccessibility('https://example.com');
