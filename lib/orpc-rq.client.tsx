'use client'

import { useState } from 'react'
import { createORPCReactQueryUtils } from '@orpc/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { client } from '@/lib/orpc'
import { makeQueryClient } from '@/lib/query-client'

// ブラウザでは QueryClient をシングルトンとして保持
// （再レンダリングのたびに新しいインスタンスが作られるのを防ぐ）
let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // サーバー側: 毎回新しいインスタンスを返す（リクエスト間の共有を避ける）
    return makeQueryClient()
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

// クライアントコンポーネントで使用する orpc utils
// queryOptions / mutationOptions / infiniteOptions / key が使える
export const orpc = createORPCReactQueryUtils(client)

export function ORPCQueryProvider({ children }: { children: React.ReactNode }) {
  // NOTE: useState を使うことで初回レンダリング時のみ QueryClient を生成
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
