const express = require('express')
const puppeteer = require('puppeteer');
const app = express()
const port = process.env.PORT || 9000

async function start(url, {width, height}) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    defaultViewport: {
      width,
      height,
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 3,
    },
    slowMo: 250
  });
  const page = await browser.newPage();
  await page.goto(url);
  const image = await page.screenshot();
  // await page.screenshot({ path: 'example.png' });

  await browser.close();
  return image
}


app.get('/', async (req, res) => {
  const { url, width = 375, height = 150 } = req.query
  if (!url) return
  const image = await start(url, {width, height})
  res.set('Content-Type', 'image/png');
  res.send(image);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})