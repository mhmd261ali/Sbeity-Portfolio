import { processContact } from '../../server/contact'

type NetlifyEvent = {
  httpMethod?: string
  body?: string | null
  headers?: Record<string, string | undefined>
}

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ ok: false, message: 'الطريقة غير مسموحة' }),
    }
  }

  try {
    const json: unknown = event.body ? JSON.parse(event.body) : {}
    const ip = event.headers?.['x-nf-client-connection-ip'] || event.headers?.['x-forwarded-for'] || 'unknown'
    const origin = event.headers?.origin
    const result = await processContact(json, { ip, origin })
    return {
      statusCode: result.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(result.body),
    }
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ ok: false, message: 'تعذر قراءة الطلب' }),
    }
  }
}
