import { HydrateClient, orpc, prefetch } from '@/lib/orpc-rq.server'
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'
import type { SearchParams } from 'nuqs/server'

import { DashboardPostsView } from '@/components/features/dashboard/posts/dashboard-posts-view'
import { loadSearchPostParams } from '@/modules/posts/params/load-post-params'

interface Props {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  const { page, search } = await loadSearchPostParams(searchParams)

  await prefetch(
    orpc.posts.myList.queryOptions({
      input: { page: page - 1, limit: MAX_POSTS_PER_PAGE, search },
    }),
  )

  return (
    <HydrateClient>
      <DashboardPostsView />
    </HydrateClient>
  )
}

export default Page
