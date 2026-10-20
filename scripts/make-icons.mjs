/**
 * Derives the favicon set from the 1024px source in `assets/`.
 *
 *   node scripts/make-icons.mjs
 *
 * The source is cropped before it is scaled: the "Made with AI" badge sits in
 * the top-right corner, and at 32px a badge is a white blob over the logo. The
 * crop takes the square that holds the mark and leaves the badge behind.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const SOURCE = resolve('assets/favicon-source.png')
const OUT = resolve('public')

/**
 * The whole lockup — the symbol and the wordmark — inside the source's own
 * gradient, cropped below the badge so it never reaches the icon.
 */
const LOCKUP = { x: 100, y: 100, size: 800 }

/**
 * The symbol alone — the cat, the arrow and the bars. A wordmark cannot be
 * read at 16 or 32 pixels, so the small sizes carry the symbol and the large
 * ones carry the whole lockup.
 */
const MARK = { x: 105, y: 300, size: 315 }

const SIZES = [
  { size: 16, crop: MARK },
  { size: 32, crop: MARK },
  { size: 48, crop: MARK },
  { size: 180, crop: LOCKUP, name: 'apple-touch-icon.png' },
  { size: 192, crop: LOCKUP },
  { size: 512, crop: LOCKUP },
]

const source = await readFile(SOURCE)
const dataUrl = `data:image/png;base64,${source.toString('base64')}`

await mkdir(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

const written = []

try {
  for (const { size, crop, name } of SIZES) {
    const page = await browser.newPage()
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 })

    const scale = size / crop.size
    const offsetX = crop.x * scale
    const offsetY = crop.y * scale

    await page.setContent(
      `<!doctype html>
       <style>
         html, body { margin: 0; padding: 0; background: transparent; }
         .box { width: ${size}px; height: ${size}px; overflow: hidden; }
         img { position: absolute; width: ${1024 * scale}px; height: ${1024 * scale}px;
               left: ${-offsetX}px; top: ${-offsetY}px; }
       </style>
       <div class="box"><img src="${dataUrl}" alt=""></div>`,
    )

    const buffer = await page.screenshot({
      omitBackground: true,
      clip: { x: 0, y: 0, width: size, height: size },
    })

    const file = name ?? `favicon-${size}.png`
    await writeFile(resolve(OUT, file), buffer)
    written.push({ name: file, size, bytes: buffer.length })
    await page.close()
  }

  // A real .ico with a PNG payload inside, for the browsers that still ask for one.
  const png32 = await readFile(resolve(OUT, 'favicon-32.png'))
  const header = Buffer.alloc(22)
  header.writeUInt16LE(0, 0) // reservado
  header.writeUInt16LE(1, 2) // tipo: icono
  header.writeUInt16LE(1, 4) // un icono
  header.writeUInt8(32, 6) // ancho
  header.writeUInt8(32, 7) // alto
  header.writeUInt8(0, 8) // paleta
  header.writeUInt8(0, 9) // reservado
  header.writeUInt16LE(1, 10) // planos
  header.writeUInt16LE(32, 12) // bits por píxel
  header.writeUInt32LE(png32.length, 14) // tamaño del imagen
  header.writeUInt32LE(22, 18) // desplazamiento
  await writeFile(resolve(OUT, 'favicon.ico'), Buffer.concat([header, png32]))
  written.push({ name: 'favicon.ico', size: 32, bytes: header.length + png32.length })
} finally {
  await browser.close()
}

for (const file of written) {
  console.log(`${file.name.padEnd(24)} ${String(file.size).padStart(4)}px  ${(file.bytes / 1024).toFixed(1)} kB`)
}
