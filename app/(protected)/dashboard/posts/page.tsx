import { orpc, prefetch } from '@/lib/orpc-rq.server'
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'

import { DashboardPostsView } from '@/components/features/dashboard/posts/dashboard-posts-view'

const Page = async () => {
  await prefetch(
    orpc.posts.myList.queryOptions({
      input: { page: 0, limit: MAX_POSTS_PER_PAGE, search: '' },
    }),
  )

  return <DashboardPostsView />
}

export default Page
