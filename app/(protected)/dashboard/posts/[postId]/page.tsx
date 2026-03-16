import { DashboardPostIdView } from '@/components/features/dashboard/posts/dashboard-post-id-view'

interface Props {
  params: Promise<{ postId: string }>
}

const Page = async ({ params }: Props) => {
  const { postId } = await params

  return <DashboardPostIdView postId={postId} />
}

export default Page
