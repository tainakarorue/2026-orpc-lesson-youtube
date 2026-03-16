import 'server-only'

import { cache } from 'react'
import { createORPCReactQueryUtils } from '@orpc/react-query'
import {
  dehydrate,
  HydrationBoundary,
  type FetchQueryOptions,
  type FetchInfiniteQueryOptions,
} from '@tanstack/react-query'

import { client } from '@/lib/orpc'
import { makeQueryClient } from '@/lib/query-client'

// React の cache() でリクエストごとに QueryClient を1つに固定
// 同一リクエスト内での prefetch がすべて同じ QueryClient に溜まる
export const getQueryClient = cache(makeQueryClient)

// RSC・prefetch で使用する orpc utils
// client は $client（直接ルーター呼び出し）が使われる → HTTP不要
export const orpc = createORPCReactQueryUtils(client)

// RSC でprefetchしたデータをクライアントに渡す Hydration ラッパー
export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

// RSC でのprefetchヘルパー（通常クエリ用）
export function prefetch(queryOptions: FetchQueryOptions) {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(queryOptions)
}

// RSC でのprefetchヘルパー（無限クエリ用）
export function prefetchInfinite(
  queryOptions: FetchInfiniteQueryOptions<
    unknown,
    Error,
    unknown,
    readonly unknown[],
    unknown
  >,
) {
  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(queryOptions)
}
