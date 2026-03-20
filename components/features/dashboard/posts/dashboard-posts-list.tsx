'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale/ja'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useGetMyPosts } from '@/hooks/posts/use-posts'
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'

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
      <DashboardPostsListSuspense page={page} onPageChange={setPage} />
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
  const { data } = useGetMyPosts({ page, limit: MAX_POSTS_PER_PAGE })

  const { posts, pagenation } = data

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
          Page {pagenation.page + 1} of {pagenation.totalPages}
          {/* Page {pagenation.page + 1} of {pagenation.totalPages} */}
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
