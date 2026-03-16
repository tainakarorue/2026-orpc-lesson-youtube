'use client'

import { Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { DashboardPostIdDetails } from './dashboard-post-id-details'
import { DashboardPostIdBreadCrumbs } from './dashboard-post-id-breadcrumbs'

interface Props {
  postId: string
}

export const DashboardPostIdView = ({ postId }: Props) => {
  return (
    <>
      <DashboardPostIdBreadCrumbs />
      <div className="w-full h-full flex flex-col gap-4 mt-2">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl font-medium">Post Details</h2>
          <Button onClick={() => {}} variant="destructive" className="w-fit">
            <Trash2Icon className="size-4" />
            Delete Post
          </Button>
        </div>
        <DashboardPostIdDetails postId={postId} />
      </div>
    </>
  )
}
