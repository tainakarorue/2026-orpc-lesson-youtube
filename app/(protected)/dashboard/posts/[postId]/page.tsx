import { DashboardPostIdView } from '@/components/features/dashboard/posts/dashboard-post-id-view'
import { HydrateClient, orpc, prefetch } from '@/lib/orpc-rq.server'

interface Props {
  params: Promise<{ postId: string }>
}

const Page = async ({ params }: Props) => {
  const { postId } = await params
  await prefetch(orpc.posts.myGetById.queryOptions({ input: { id: postId } }))

  return (
    <HydrateClient>
      <DashboardPostIdView postId={postId} />
    </HydrateClient>
  )
}

export default Page
