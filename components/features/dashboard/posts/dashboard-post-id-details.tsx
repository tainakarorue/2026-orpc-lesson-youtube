'use client'

import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface DashboardPostIdDetailsProps {
  postId: string
}

export const DashboardPostIdDetails = ({
  postId,
}: DashboardPostIdDetailsProps) => {
  return (
    <div>
      <DashboardPostIdDetailsSuspense postId={postId} />
    </div>
  )
}

interface DashboardPostIdDetailsSuspenseProps {
  postId: string
}

export const DashboardPostIdDetailsSuspense = ({
  postId,
}: DashboardPostIdDetailsSuspenseProps) => {
  const post = {
    id: '1',
    title: 'Post-1',
    content: 'Content-1',
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

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
        <CardContent>{/* <UpdatePostForm post={post} /> */}</CardContent>
      </Card>
    </div>
  )
}
