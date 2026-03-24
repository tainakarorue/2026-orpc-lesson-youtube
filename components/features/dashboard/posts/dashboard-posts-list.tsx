'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { ErrorBoundary } from 'react-error-boundary'
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import { useSetAtom } from 'jotai'

import { postCreateModalOpenAtom } from '@/store/posts'
import { useGetMyPosts } from '@/hooks/posts/use-posts'
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'
import { usePostParams } from '@/modules/posts/params/use-post-params'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { SuspenseLoading } from '@/components/suspense-loading'
import { SuspenseMessage } from '@/components/suspense-message'

export const DashboardPostsListLoading = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <SuspenseLoading title="Loading posts" description="Please wait..." />
    </div>
  )
}

export const DashboardPostsListError = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <SuspenseMessage
        title="Something went wrong"
        description="Failed to fetch post"
      />
    </div>
  )
}

export const DashboardPostsListEmpty = () => {
  const setModalOpen = useSetAtom(postCreateModalOpenAtom)

  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <SuspenseMessage
        title="No post found"
        description="Please create post."
        btnLabel="Try Create Post"
        onClick={() => setModalOpen(true)}
      />
    </div>
  )
}

export const DashboardPostsList = () => {
  const [params, setParams] = usePostParams()
  const handleSearchChange = (value: string) => {
    setParams({ page: 1, search: value })
  }

  return (
    <>
      <div className="relative w-full max-w-[220px]">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={params.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<DashboardPostsListLoading />}>
          <DashboardPostsListSuspense />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export const DashboardPostsListSuspense = () => {
  const [params, setParams] = usePostParams()

  const { data } = useGetMyPosts({
    page: params.page - 1,
    limit: MAX_POSTS_PER_PAGE,
    search: params.search,
  })

  const { posts, pagination } = data

  if (posts.length === 0) {
    return params.search ? (
      <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-muted-foreground">
              No posts found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search
            </p>
          </div>
        </div>
      </div>
    ) : (
      <DashboardPostsListEmpty />
    )
  }

  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <ul className="w-full space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/dashboard/posts/${post.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <Separator className="mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-x-2">
                    <p className="truncate">{post.content}</p>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(post.createdAt, {
                        addSuffix: true,
                        locale: ja,
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() =>
            setParams({ page: params.page - 1, search: params.search })
          }
          disabled={false}
        >
          <ChevronLeftIcon className="size-4" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Page {pagination.page + 1} of {pagination.totalPages}
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setParams({ page: params.page + 1, search: params.search })
          }
          disabled={false}
        >
          Next
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
