import { HydrateClient, orpc, prefetchInfinite } from '@/lib/orpc-rq.server'
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'

import { PostsView } from '@/components/features/posts/posts-view'

const Page = async () => {
  await prefetchInfinite(
    orpc.posts.list.infiniteOptions({
      input: (pageParam) => ({
        page: pageParam,
        limit: MAX_POSTS_PER_PAGE,
      }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasNextPage
          ? lastPage.pagination.page + 1
          : undefined,
    }),
  )

  return (
    <HydrateClient>
      <PostsView />
    </HydrateClient>
  )
}

export default Page
