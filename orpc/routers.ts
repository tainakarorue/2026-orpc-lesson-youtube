import { InferRouterInputs, InferRouterOutputs } from '@orpc/server'

import { base } from './base'
import { userRouter } from './routers/user'
import { postsRouter } from './routers/posts'

export const router = base.router({
  // 他のサブルーターをここに追加
  user: userRouter,
  posts: postsRouter,
})

// クライアント側で型推論に使う
export type Router = typeof router

export type Inputs = InferRouterInputs<Router>
type UserGetByIdInput = Inputs['user']['getById']

export type Outputs = InferRouterOutputs<Router>
type UserGetByIdOutput = Outputs['user']['getById']
