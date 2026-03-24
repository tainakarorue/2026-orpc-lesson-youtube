'use client'

import { useRouter } from 'next/navigation'
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
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'

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

// export const useGetMyPosts = (params: GetPostsParams = {}) => {
//   return useSuspenseQuery(orpc.posts.myList.queryOptions({ input: params }))
// }

export const useGetMyPosts = ({
  page = 0,
  limit = MAX_POSTS_PER_PAGE,
  search = '',
}: GetPostsParams = {}) => {
  return useSuspenseQuery(
    orpc.posts.myList.queryOptions({ input: { page, limit, search } }),
  )
}

export const useMyGetPostById = (id: string) => {
  return useSuspenseQuery(orpc.posts.myGetById.queryOptions({ input: { id } }))
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      values,
    }: {
      postId: string
      values: UpdatePostInput
    }) => client.posts.update({ id: postId, ...values }),
    onSuccess: (data) => {
      toast.success('Post updated')
      queryClient.invalidateQueries({ queryKey: orpc.posts.myList.key() })
      queryClient.invalidateQueries({
        queryKey: orpc.posts.myGetById.key({ input: { id: data.id } }),
      })
    },
    onError: () => {
      toast.error('Failed to update post')
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (postId: string) => client.posts.delete({ id: postId }),
    onSuccess: (data) => {
      toast.success('Post deleted')
      queryClient.invalidateQueries({ queryKey: orpc.posts.myList.key() })
      queryClient.invalidateQueries({
        queryKey: orpc.posts.myGetById.key({ input: { id: data.id } }),
      })
      router.push('/dashboard/posts')
    },
    onError: () => {
      toast.error('Failed to delete post')
    },
  })
}
