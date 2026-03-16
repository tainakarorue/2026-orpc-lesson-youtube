'use client'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { DashboardPostsList } from './dashboard-posts-list'
import { DashboardPostsBreadcrumbs } from './dashboard-posts-breadcrumbs'

export const DashboardPostsView = () => {
  return (
    <>
      <DashboardPostsBreadcrumbs />
      <div className="w-full h-full flex flex-col gap-4 mt-2">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl font-medium">User Posts</h2>
          <Button onClick={() => {}} className="w-fit">
            <PlusIcon className="size-4" />
            Create Post
          </Button>
        </div>
        <DashboardPostsList />
      </div>
    </>
  )
}
