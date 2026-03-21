'use client'

import { LoaderIcon } from 'lucide-react'

interface Props {
  title: string
  description?: string
}

export const SuspenseLoading = ({ title, description }: Props) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-y-2">
      <h2 className="text-sm font-medium">{title}</h2>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <LoaderIcon className="size-6 animate-spin" />
    </div>
  )
}
