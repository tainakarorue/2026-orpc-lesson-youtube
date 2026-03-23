'use client'

import { Trash2Icon } from 'lucide-react'

import { useDeletePost } from '@/hooks/posts/use-posts'
import { useConfirmDialog } from '@/hooks/use-confirm-dialog'

import { Button } from '@/components/ui/button'

import { DashboardPostIdDetails } from './dashboard-post-id-details'
import { DashboardPostIdBreadCrumbs } from './dashboard-post-id-breadcrumbs'

interface Props {
  postId: string
}

export const DashboardPostIdView = ({ postId }: Props) => {
  const { confirm, ConfirmDialog } = useConfirmDialog({
    title: 'Delete Post',
    description: 'Are you sure you want to delete post?',
  })
  const { mutateAsync: deletePost, isPending } = useDeletePost()

  const handleDeletePost = async () => {
    const ok = await confirm()

    if (!ok) return

    await deletePost(postId)
  }

  return (
    <>
      <ConfirmDialog />
      <DashboardPostIdBreadCrumbs />
      <div className="w-full h-full flex flex-col gap-4 mt-2">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl font-medium">Post Details</h2>
          <Button
            onClick={handleDeletePost}
            variant="destructive"
            className="w-fit"
            disabled={isPending}
          >
            <Trash2Icon className="size-4" />
            Delete Post
          </Button>
        </div>
        <DashboardPostIdDetails postId={postId} />
      </div>
    </>
  )
}
