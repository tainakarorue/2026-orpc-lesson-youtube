'use client'

import { useAtom } from 'jotai'
import { postCreateModalOpenAtom } from '@/store/posts'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { CreatePostForm } from './create-post-form'

export const PostCreateModal = () => {
  const [open, setOpen] = useAtom(postCreateModalOpenAtom)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Create a new post</DialogDescription>
        </DialogHeader>
        <CreatePostForm />
      </DialogContent>
    </Dialog>
  )
}
