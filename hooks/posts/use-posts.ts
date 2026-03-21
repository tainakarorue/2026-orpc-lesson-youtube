'use client'
import { z } from 'zod'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { toast } from 'sonner'

import { client } from '@/lib/orpc'
import { orpc } from '@/lib/orpc-rq.client'

import { postCreateModalOpenAtom } from '@/store/posts'
import { postInsertSchema } from '@/src/db/schema'

type CreatePostInput = z.infer<typeof postInsertSchema>
type UpdatePostInput = z.infer<typeof postInsertSchema>

type GetPostsParams = {
  page?: number
  limit?: number
  search?: string
}

export const useCreatePost = () => {
  const setModalOpen = useSetAtom(postCreateModalOpenAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CreatePostInput) => client.posts.create(values),
    onSuccess: (data) => {
      setModalOpen(false)
      toast.success(`Post ${data.title} created`)
      //   queryClient.invalidateQueries({ queryKey: orpc.posts.list.key() }),
      //   queryClient.invalidateQueries({queryKey: orpc.posts.getById.key({input: {id: data.id}})})
    },
    onError: () => {
      toast.error('Failed to create post')
    },
  })
}

export const useGetMyPosts = (params: GetPostsParams = {}) => {
  return useSuspenseQuery(orpc.posts.myList.queryOptions({ input: params }))
}
