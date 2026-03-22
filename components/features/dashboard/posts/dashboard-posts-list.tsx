'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { ErrorBoundary } from 'react-error-boundary'
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import { useSetAtom } from 'jotai'

import { postCreateModalOpenAtom } from '@/store/posts'
import { useGetMyPosts } from '@/hooks/posts/use-posts'
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'

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
        title="Something went wrong"
        description="Failed to fetch post"
        btnLabel="Try Create Post"
        onClick={() => setModalOpen(true)}
      />
    </div>
  )
}

export const DashboardPostsList = () => {
  const [page, setPage] = useState(0)
  return (
    <>
      <div className="relative w-full max-w-[220px]">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value=""
          onChange={() => {}}
          className="pl-8"
        />
      </div>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<DashboardPostsListLoading />}>
          <DashboardPostsListSuspense page={page} onPageChange={setPage} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

type DashboardPostsListSuspenseProps = {
  page: number
  onPageChange: (page: number) => void
}

export const DashboardPostsListSuspense = ({
  page,
  onPageChange,
}: DashboardPostsListSuspenseProps) => {
  const { data } = useGetMyPosts({
    page,
    limit: MAX_POSTS_PER_PAGE,
    search: '',
  })

  const { posts, pagination } = data

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
          onClick={() => onPageChange(page - 1)}
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
          onClick={() => onPageChange(page + 1)}
          disabled={false}
        >
          Next
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
