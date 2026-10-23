import type { IncomingMessage, ServerResponse } from 'node:http'
import { processContact } from '../server/contact'

type NodeRequest = IncomingMessage & { body?: unknown }

async function requestJson(req: NodeRequest): Promise<unknown> {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.trim()) return JSON.parse(req.body) as unknown
  const raw = await readBody(req)
  return raw ? (JSON.parse(raw) as unknown) : {}
}

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

export default async function handler(req: NodeRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ ok: false, message: 'الطريقة غير مسموحة' }))
    return
  }

  try {
    const json = await requestJson(req)
    const forwarded = req.headers['x-forwarded-for']
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() || 'unknown' : req.socket.remoteAddress || 'unknown'
    const origin = typeof req.headers.origin === 'string' ? req.headers.origin : undefined
    const result = await processContact(json, { ip, origin })
    res.statusCode = result.status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(result.body))
  } catch {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ ok: false, message: 'تعذر قراءة الطلب' }))
  }
}
