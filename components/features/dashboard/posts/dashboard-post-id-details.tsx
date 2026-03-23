'use client'

import { Suspense } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ErrorBoundary } from 'react-error-boundary'

import { useMyGetPostById } from '@/hooks/posts/use-posts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { UpdatePostForm } from './update-post-form'
import { SuspenseLoading } from '@/components/suspense-loading'
import { SuspenseMessage } from '@/components/suspense-message'

export const DashboardPostIdLoading = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <SuspenseLoading title="Loading post" description="Please wait..." />
    </div>
  )
}

export const DashboardPostIdError = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <SuspenseMessage
        title="Something went wrong"
        description="Failed to fetch post"
      />
    </div>
  )
}

export const DashboardPostIdEmpty = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <SuspenseMessage
        title="No post found"
        description="Please view another post page."
      />
    </div>
  )
}

interface DashboardPostIdDetailsProps {
  postId: string
}

export const DashboardPostIdDetails = ({
  postId,
}: DashboardPostIdDetailsProps) => {
  return (
    <ErrorBoundary fallback={<DashboardPostIdError />}>
      <Suspense fallback={<DashboardPostIdLoading />}>
        <DashboardPostIdDetailsSuspense postId={postId} />
      </Suspense>
    </ErrorBoundary>
  )
}

interface DashboardPostIdDetailsSuspenseProps {
  postId: string
}

export const DashboardPostIdDetailsSuspense = ({
  postId,
}: DashboardPostIdDetailsSuspenseProps) => {
  const { data: post } = useMyGetPostById(postId)

  if (!post) return <DashboardPostIdEmpty />

  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <p className="truncate">{post.title}</p>
              <p className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(post.updatedAt, {
                  addSuffix: true,
                  locale: ja,
                })}
              </p>
            </div>
          </CardTitle>
          <Separator className="mt-2" />
        </CardHeader>
        <CardContent>
          <UpdatePostForm post={post} />
        </CardContent>
      </Card>
    </div>
  )
}
