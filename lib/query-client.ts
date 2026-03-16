import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR時の不要なrefetchを防ぐ
        //サーバーでfetchしたデータをクライアントで即座にrefetchしない
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // pending状態もdehydrate対象に含める（Suspense対応に必須）
        //Suspense使用時、prefetchしたpending状態のクエリもHydrationで渡せるようにする
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}
