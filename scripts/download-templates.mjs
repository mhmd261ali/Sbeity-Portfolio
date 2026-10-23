import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const photos = {
  canvas: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1400&q=70',
  paint: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1400&q=70',
  frames: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=70',
  wood: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1400&q=70',
  workshop: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=1400&q=70',
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=70',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=70',
  store: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=70',
  interior: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=70',
  desk: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1400&q=70',
  fabric: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1400&q=70',
  gallery: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&w=1400&q=70',
  living: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=70',
  writing: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=70',
  color: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=70',
}

const dir = path.resolve('public/templates')
await mkdir(dir, { recursive: true })

for (const [name, url] of Object.entries(photos)) {
  const response = await fetch(url, { headers: { 'User-Agent': 'SbeityPortfolio/1.0' } })
  if (!response.ok) {
    console.error(name, response.status)
    continue
  }
  const bytes = Buffer.from(await response.arrayBuffer())
  await writeFile(path.join(dir, `${name}.jpg`), bytes)
  console.log(name, bytes.length)
}
