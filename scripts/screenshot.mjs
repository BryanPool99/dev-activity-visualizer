/**
 * Screenshots of the running app, for the design review.
 *
 *   node scripts/screenshot.mjs <url> <name> [width] [height] [token]
 *
 * The token is optional: when given, it is placed in sessionStorage before the
 * page loads, exactly as the token dialog would, so the full-year report can
 * be captured. It is never written to disk by this script.
 */
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT_DIR = resolve('.impeccable/review')

const [url, name, width = '1440', height = '900', token] = process.argv.slice(2)

if (!url || !name) {
  console.error('usage: node scripts/screenshot.mjs <url> <name> [width] [height] [token]')
  process.exit(1)
}

await mkdir(OUT_DIR, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: Number(width), height: Number(height), deviceScaleFactor: 1 })

  if (token) {
    await page.evaluateOnNewDocument((value) => {
      window.sessionStorage.setItem('dav.githubToken', value)
    }, token)
  }

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

  // The charts only exist once the report has arrived.
  await page.waitForSelector('svg[role="img"]', { timeout: 45000 }).catch(() => {})
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const outPath = resolve(OUT_DIR, `${name}.png`)
  await page.screenshot({ path: outPath, fullPage: false })
  console.log(outPath)
} finally {
  await browser.close()
}
