import { ORPCError, os } from '@orpc/server'
import type { auth } from '@/lib/auth'

// better-auth の型推論を使用（スキーマ変更に追従）
export type Session = typeof auth.$Infer.Session

// リクエストごとに渡すコンテキストの型
// 例: 認証情報など。最初は空でOK
export type Context = {
  session: Session | null
}

// ベースプロシージャ。全プロシージャはここから派生させる
export const base = os.$context<Context>()

// 認証必須プロシージャ
// session が null なら UNAUTHORIZED を throw
// next 以降では context.session が non-null に絞り込まれる
export const authed = base.use(({ context, next }) => {
  if (!context.session) throw new ORPCError('UNAUTHORIZED')

  return next({ context: { session: context.session } })
})
