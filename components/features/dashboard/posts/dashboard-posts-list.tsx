'use client'

import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale/ja'

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export const DashboardPostsList = () => {
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
      <DashboardPostsListSuspense />
    </>
  )
}

export const DashboardPostsListSuspense = () => {
  const post = {
    id: '1',
    title: 'Post-1',
    userId: '1',
    content: 'Content-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <div className="w-full flex-1 flex flex-col bg-accent rounded-md p-6 gap-y-4">
      <ul className="w-full space-y-4">
        <li>
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
      </ul>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => {}} disabled={false}>
          <ChevronLeftIcon className="size-4" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Page {1} of {1}
        </div>

        <Button variant="outline" onClick={() => {}} disabled={false}>
          Next
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
