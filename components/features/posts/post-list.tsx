'use client'

import Link from 'next/link'
import { Loader2Icon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale/ja'

import { useInfiniteGetPosts } from '@/hooks/posts/use-posts'
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { SuspenseLoading } from '@/components/suspense-loading'
import { SuspenseMessage } from '@/components/suspense-message'

export const PostsListLoading = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <SuspenseLoading title="Loading posts" description="Please wait..." />
    </div>
  )
}

export const PostsListError = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <SuspenseMessage
        title="Something went wrong"
        description="Failed to fetch posts"
      />
    </div>
  )
}

export const PostsListEmpty = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <SuspenseMessage
        title="No post found"
        description="Please create posts."
      />
    </div>
  )
}

export const PostsList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteGetPosts({ limit: MAX_POSTS_PER_PAGE })

  if (status === 'pending') {
    return <PostsListLoading />
  }

  if (status === 'error') {
    return <PostsListError />
  }

  const posts = data.pages.flatMap((page) => page.posts)

  if (posts.length === 0) {
    return <PostsListEmpty />
  }

  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <ul className="w-full space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>
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

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            )}
            もっと見る
          </Button>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          すべての投稿を表示しました
        </p>
      )}
    </div>
  )
}
