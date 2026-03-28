import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { onError } from '@orpc/server'
import { auth } from '@/lib/auth'
import { router } from '@/orpc/routers'

const handler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

// 許可するオリジン: 環境変数 CORS_ALLOWED_ORIGINS にカンマ区切りで指定
// 例: CORS_ALLOWED_ORIGINS=https://example.com,https://app.example.com
// 未設定時は同一オリジンのみ許可（Access-Control-Allow-Origin ヘッダーなし）
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : []

function getCorsHeaders(origin: string | null): HeadersInit {
  if (!origin || !allowedOrigins.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

async function handleRequest(request: Request) {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const { response } = await handler.handle(request, {
    prefix: '/api/rest',
    context: { session },
  })

  if (!response) return new Response('Not found', { status: 404 })

  // CORS ヘッダーをレスポンスにマージ
  const newHeaders = new Headers(response.headers)
  for (const [key, value] of Object.entries(corsHeaders)) {
    newHeaders.set(key, value)
  }
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  })
}

// OPTIONS プリフライトリクエスト
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)
  if (Object.keys(corsHeaders).length === 0) {
    return new Response(null, { status: 403 })
  }
  return new Response(null, { status: 204, headers: corsHeaders })
}

export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
