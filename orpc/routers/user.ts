import { z } from 'zod'

import { base } from '../base'

const userSchema = z.object({ id: z.string(), name: z.string() })

export const userRouter = base.router({
  list: base.output(z.array(userSchema)).handler(async () => {
    // DBアクセスなど
    return [{ id: '1', name: 'Alice' }]
  }),
  getById: base
    .input(z.object({ id: z.string() }))
    .output(userSchema)
    .handler(async () => {
      // DBアクセスなど
      return { id: '1', name: 'Alice' }
    }),
})
