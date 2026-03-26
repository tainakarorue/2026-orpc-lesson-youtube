'use client'

import { PostsList } from './post-list'
import { PostsBreadcrumbs } from './posts-breadcrumbs'

export const PostsView = () => {
  return (
    <>
      <PostsBreadcrumbs />
      <div className="w-full h-full flex flex-col gap-4 mt-2">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl font-medium">Posts</h2>
        </div>
        <PostsList />
      </div>
    </>
  )
}
