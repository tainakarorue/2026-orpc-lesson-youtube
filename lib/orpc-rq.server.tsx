import 'server-only'

import { cache } from 'react'
import { createORPCReactQueryUtils } from '@orpc/react-query'
import {
  dehydrate,
  HydrationBoundary,
  type FetchQueryOptions,
  type FetchInfiniteQueryOptions,
  type QueryKey,
} from '@tanstack/react-query'
import type { InfiniteOptionsBase } from '@orpc/react-query'

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
// Promise を返すので RSC 側で await すること → dehydrate 前にデータが揃う
export function prefetch(queryOptions: FetchQueryOptions) {
  const queryClient = getQueryClient()
  return queryClient.prefetchQuery(queryOptions)
}

// RSC でのprefetchヘルパー（無限クエリ用）
// InfiniteOptionsBase を直接受け取り、prefetchInfiniteQuery に渡す
export function prefetchInfinite<TData, TPageParam>(
  queryOptions: InfiniteOptionsBase<TData, Error, TPageParam> & {
    initialPageParam: TPageParam
  },
) {
  const queryClient = getQueryClient()
  return queryClient.prefetchInfiniteQuery(
    queryOptions as FetchInfiniteQueryOptions<
      TData,
      Error,
      TData,
      QueryKey,
      TPageParam
    >,
  )
}
