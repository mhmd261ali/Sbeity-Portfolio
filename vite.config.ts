import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer | string) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function contactApiPlugin(): Plugin {
  return {
    name: 'contact-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void handleContact(req, res, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        void handleContact(req, res, next)
      })
    },
  }
}

async function handleContact(
  req: IncomingMessage,
  res: ServerResponse,
  next: (error?: unknown) => void,
) {
  const url = req.url?.split('?')[0]
  if (url !== '/api/contact') {
    next()
    return
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ ok: false, message: 'الطريقة غير مسموحة' }))
    return
  }

  try {
    const raw = await readBody(req)
    const json: unknown = raw ? JSON.parse(raw) : {}
    const { processContact } = await import('./server/contact')
    const originHeader = req.headers.origin
    const result = await processContact(json, {
      ip: req.socket.remoteAddress || 'local',
      origin: typeof originHeader === 'string' ? originHeader : undefined,
    })
    res.statusCode = result.status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(result.body))
  } catch {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ ok: false, message: 'تعذر قراءة الطلب' }))
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), contactApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      dedupe: ['react', 'react-dom', 'styled-components'],
    },
    define: {
      'process.env.SANITY_STUDIO_PROJECT_ID': JSON.stringify(
        env.SANITY_STUDIO_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || '',
      ),
      'process.env.SANITY_STUDIO_DATASET': JSON.stringify(
        env.SANITY_STUDIO_DATASET || env.VITE_SANITY_DATASET || 'production',
      ),
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts', 'server/**/*.test.ts', 'scripts/**/*.test.ts'],
    },
  }
})
