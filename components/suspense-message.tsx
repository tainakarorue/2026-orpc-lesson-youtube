'use client'

import Link from 'next/link'
import { AlertTriangleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface Props {
  title: string
  description: string
  onClick?: () => void
  btnLabel?: string
}

export const SuspenseMessage = ({
  title,
  description,
  onClick,
  btnLabel,
}: Props) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangleIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex items-center justify-center gap-2">
          {onClick && btnLabel && <Button onClick={onClick}>{btnLabel}</Button>}
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
