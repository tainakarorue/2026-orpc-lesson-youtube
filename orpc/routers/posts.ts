import { z } from 'zod'
import { ORPCError } from '@orpc/client'
import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm'

import { postInsertSchema, posts, postSchema } from '@/src/db/schema'
import { db } from '@/src/db'

import { base, authed } from '../base'
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'

const pagenationSchema = z.object({
  page: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(MAX_POSTS_PER_PAGE),
  search: z.string().default(''),
})

const paginationResultSchema = z.object({
  posts: z.array(postSchema),
  pagenation: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
})

export const postsRouter = base.router({
  create: authed
    .input(postInsertSchema)
    .output(postSchema)
    .handler(async ({ input, context }) => {
      const [created] = await db
        .insert(posts)
        .values({
          id: crypto.randomUUID(),
          userId: context.session.user.id,
          title: input.title,
          content: input.content,
        })
        .returning()

      if (!created) throw new ORPCError('INTERNAL_SERVER_ERROR')
      return created
    }),

  myList: authed
    .input(pagenationSchema)
    .output(paginationResultSchema)
    .handler(async ({ input, context }) => {
      const { page = 0, limit = MAX_POSTS_PER_PAGE, search = '' } = input
      const userId = context.session.user.id

      const skip = page * limit
      const whereCondition = search
        ? and(
            eq(posts.userId, userId),
            or(
              ilike(posts.title, `%${search}%`),
              ilike(posts.content, `%${search}%`),
            ),
          )
        : eq(posts.userId, userId)

      const postsData = await db
        .select({
          ...getTableColumns(posts),
          total: sql<number>`(count(*) OVER())::int`.as('total'),
        })
        .from(posts)
        .where(whereCondition)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(skip)

      if (!postsData || !postsData.length) {
        return {
          posts: [],
          pagenation: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }
      }

      const total = postsData[0]?.total ?? 0
      const totalPages = Math.ceil(total / limit)
      const hasNextPage = skip + limit < total
      const hasPrevPage = page > 0

      return {
        posts: postsData,
        pagenation: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      }
    }),
})
