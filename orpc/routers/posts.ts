import { postInsertSchema, posts, postSchema } from '@/src/db/schema'
import { db } from '@/src/db'

import { base, authed } from '../base'
import { ORPCError } from '@orpc/client'

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
})
