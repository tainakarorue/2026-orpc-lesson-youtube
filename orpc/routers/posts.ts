import { z } from 'zod'
import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm'

import { ORPCError } from '@orpc/server'
import { postInsertSchema, posts, postSchema } from '@/src/db/schema'
import { db } from '@/src/db'
import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'

import { base, authed } from '../base'

const paginationSchema = z.object({
  page: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(MAX_POSTS_PER_PAGE),
  search: z.string().default(''),
})

const paginationResultSchema = z.object({
  posts: z.array(postSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
})

export const postsRouter = base.router({
  list: base
    .route({
      method: 'GET',
      path: '/posts',
      summary: '投稿一覧取得',
      tags: ['posts'],
    })
    .input(paginationSchema)
    .output(paginationResultSchema)
    .handler(async ({ input }) => {
      const { page = 0, limit = MAX_POSTS_PER_PAGE, search = '' } = input

      const skip = page * limit
      const whereCondition = search
        ? or(
            ilike(posts.title, `%${search}%`),
            ilike(posts.content, `%${search}%`),
          )
        : undefined

      // const postsData = await db
      //   .select({
      //     ...getTableColumns(posts),
      //     // ウィンドウ関数で総件数を各行に含める
      //     total: sql<number>`count(*) OVER()`.as('total'),
      //   })
      //   .from(posts)
      //   .where(whereCondition)
      //   .orderBy(desc(posts.createdAt))
      //   .limit(limit)
      //   .offset(skip)

      const postsData = await db
        .select({
          ...getTableColumns(posts),
          // PostgreSQL の bigint は JS では文字列になるので ::int でキャスト
          total: sql<number>`(count(*) OVER())::int`.as('total'),
        })
        .from(posts)
        .where(whereCondition)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(skip)

      // 投稿が0件の場合や検索結果が空の場合は、空の配列を返す
      // if (!postsData || !postsData.length) {
      //   throw new Response('Posts not found', { status: 404 })
      // }
      if (!postsData || !postsData.length) {
        return {
          posts: [],
          pagination: {
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

      // skip = 1 * 10 = 10
      // skip + limit = 10 + 10 = 20
      // 20 < 25 = true  → hasNextPage: true
      const hasNextPage = skip + limit < total
      const hasPrevPage = page > 0

      return {
        posts: postsData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      }
    }),

  // 静的パス（/posts/mylist, /posts/mypost/{id}）を /posts/{id} より先に定義することで
  // OpenAPI ハンドラーがパスを正しく解決できるようにする
  myList: authed
    .route({
      method: 'GET',
      path: '/posts/mylist',
      summary: '自分の投稿一覧取得',
      tags: ['posts'],
    })
    .input(paginationSchema)
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
          pagination: {
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
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      }
    }),

  myGetById: authed
    .route({
      method: 'GET',
      path: '/posts/mypost/{id}',
      summary: '自分の投稿詳細取得',
      tags: ['posts'],
    })
    .input(z.object({ id: z.string() }))
    .output(postSchema.nullable())
    .handler(async ({ input, context }) => {
      const [post] = await db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.id, input.id),
            eq(posts.userId, context.session.user.id),
          ),
        )
        .limit(1)

      return post ?? null
    }),

  getById: base
    .route({
      method: 'GET',
      path: '/posts/{id}',
      summary: '投稿詳細取得',
      tags: ['posts'],
    })
    .input(z.object({ id: z.string() }))
    .output(postSchema.nullable())
    .handler(async ({ input }) => {
      const [post] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1)

      return post ?? null
    }),

  create: authed
    .route({
      method: 'POST',
      path: '/posts',
      summary: '投稿作成',
      tags: ['posts'],
    })
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

  update: authed
    .route({
      method: 'PATCH',
      path: '/posts/{id}',
      summary: '投稿更新',
      tags: ['posts'],
    })
    .input(postInsertSchema.extend({ id: z.string() }))
    .output(postSchema)
    .handler(async ({ input, context }) => {
      const [updated] = await db
        .update(posts)
        .set({ title: input.title, content: input.content })
        .where(
          and(
            eq(posts.id, input.id),
            eq(posts.userId, context.session.user.id),
          ),
        )
        .returning()

      if (!updated)
        throw new ORPCError('NOT_FOUND', {
          message: 'Post not found or unauthorized',
        })
      return updated
    }),

  delete: authed
    .route({
      method: 'DELETE',
      path: '/posts/{id}',
      summary: '投稿削除',
      tags: ['posts'],
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const [deleted] = await db
        .delete(posts)
        .where(
          and(
            eq(posts.id, input.id),
            eq(posts.userId, context.session.user.id),
          ),
        )
        .returning({ id: posts.id })

      if (!deleted)
        throw new ORPCError('NOT_FOUND', {
          message: 'Post not found or unauthorized',
        })
      return deleted
    }),
})

// http://localhost:3000/api/openapi.json — JSON スペック
// http://localhost:3000/api/docs — Swagger UI
// http://localhost:3000/api/rest/posts — REST エンドポイント

// Python: openapi-python-client, fastapi-codegen
// Go: oapi-codegen
// Rust: progenitor, openapi-generator

// import { z } from 'zod'
// import { ORPCError } from '@orpc/client'
// import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm'

// import { postInsertSchema, posts, postSchema } from '@/src/db/schema'
// import { db } from '@/src/db'

// import { base, authed } from '../base'
// import { MAX_POSTS_PER_PAGE } from '@/modules/posts/constants'

// const paginationSchema = z.object({
//   page: z.number().int().min(0).default(0),
//   limit: z.number().int().min(1).max(100).default(MAX_POSTS_PER_PAGE),
//   search: z.string().default(''),
// })

// const paginationResultSchema = z.object({
//   posts: z.array(postSchema),
//   pagination: z.object({
//     page: z.number(),
//     limit: z.number(),
//     total: z.number(),
//     totalPages: z.number(),
//     hasNextPage: z.boolean(),
//     hasPrevPage: z.boolean(),
//   }),
// })

// export const postsRouter = base.router({
//   create: authed
//     .input(postInsertSchema)
//     .output(postSchema)
//     .handler(async ({ input, context }) => {
//       const [created] = await db
//         .insert(posts)
//         .values({
//           id: crypto.randomUUID(),
//           userId: context.session.user.id,
//           title: input.title,
//           content: input.content,
//         })
//         .returning()

//       if (!created) throw new ORPCError('INTERNAL_SERVER_ERROR')
//       return created
//     }),

//   myList: authed
//     .input(paginationSchema)
//     .output(paginationResultSchema)
//     .handler(async ({ input, context }) => {
//       const { page = 0, limit = MAX_POSTS_PER_PAGE, search = '' } = input
//       const userId = context.session.user.id

//       const skip = page * limit
//       const whereCondition = search
//         ? and(
//             eq(posts.userId, userId),
//             or(
//               ilike(posts.title, `%${search}%`),
//               ilike(posts.content, `%${search}%`),
//             ),
//           )
//         : eq(posts.userId, userId)

//       const postsData = await db
//         .select({
//           ...getTableColumns(posts),
//           total: sql<number>`(count(*) OVER())::int`.as('total'),
//         })
//         .from(posts)
//         .where(whereCondition)
//         .orderBy(desc(posts.createdAt))
//         .limit(limit)
//         .offset(skip)

//       if (!postsData || !postsData.length) {
//         return {
//           posts: [],
//           pagination: {
//             page,
//             limit,
//             total: 0,
//             totalPages: 0,
//             hasNextPage: false,
//             hasPrevPage: false,
//           },
//         }
//       }

//       const total = postsData[0]?.total ?? 0
//       const totalPages = Math.ceil(total / limit)
//       const hasNextPage = skip + limit < total
//       const hasPrevPage = page > 0

//       return {
//         posts: postsData,
//         pagination: {
//           page,
//           limit,
//           total,
//           totalPages,
//           hasNextPage,
//           hasPrevPage,
//         },
//       }
//     }),

//   list: base
//     .input(paginationSchema)
//     .output(paginationResultSchema)
//     .handler(async ({ input }) => {
//       const { page = 0, limit = MAX_POSTS_PER_PAGE, search = '' } = input

//       const skip = page * limit
//       const whereCondition = search
//         ? and(
//             or(
//               ilike(posts.title, `%${search}%`),
//               ilike(posts.content, `%${search}%`),
//             ),
//           )
//         : undefined

//       const postsData = await db
//         .select({
//           ...getTableColumns(posts),
//           total: sql<number>`(count(*) OVER())::int`.as('total'),
//         })
//         .from(posts)
//         .where(whereCondition)
//         .orderBy(desc(posts.createdAt))
//         .limit(limit)
//         .offset(skip)

//       if (!postsData || !postsData.length) {
//         return {
//           posts: [],
//           pagination: {
//             page,
//             limit,
//             total: 0,
//             totalPages: 0,
//             hasNextPage: false,
//             hasPrevPage: false,
//           },
//         }
//       }

//       const total = postsData[0]?.total ?? 0
//       const totalPages = Math.ceil(total / limit)
//       const hasNextPage = skip + limit < total
//       const hasPrevPage = page > 0

//       return {
//         posts: postsData,
//         pagination: {
//           page,
//           limit,
//           total,
//           totalPages,
//           hasNextPage,
//           hasPrevPage,
//         },
//       }
//     }),

//   myGetById: authed
//     .input(z.object({ id: z.string() }))
//     .output(postSchema.nullable())
//     .handler(async ({ input, context }) => {
//       const [post] = await db
//         .select()
//         .from(posts)
//         .where(
//           and(
//             eq(posts.id, input.id),
//             eq(posts.userId, context.session.user.id),
//           ),
//         )
//         .limit(1)

//       return post ?? null
//     }),
//   update: authed
//     .input(postInsertSchema.extend({ id: z.string() }))
//     .output(postSchema)
//     .handler(async ({ input, context }) => {
//       const [updated] = await db
//         .update(posts)
//         .set({ title: input.title, content: input.content })
//         .where(
//           and(
//             eq(posts.id, input.id),
//             eq(posts.userId, context.session.user.id),
//           ),
//         )
//         .returning()

//       if (!updated)
//         throw new ORPCError('NOT_FOUND', {
//           message: 'Post not found or unauthorized',
//         })

//       return updated
//     }),
//   delete: authed
//     .input(z.object({ id: z.string() }))
//     .output(z.object({ id: z.string() }))
//     .handler(async ({ input, context }) => {
//       const [deleted] = await db
//         .delete(posts)
//         .where(
//           and(
//             eq(posts.id, input.id),
//             eq(posts.userId, context.session.user.id),
//           ),
//         )
//         .returning({ id: posts.id })

//       if (!deleted)
//         throw new ORPCError('NOT_FOUND', {
//           message: 'Post not found or unauthorized',
//         })

//       return deleted
//     }),
// })
