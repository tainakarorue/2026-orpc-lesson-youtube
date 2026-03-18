import { posts } from '@/src/db/schema'

export type Post = typeof posts.$inferSelect
