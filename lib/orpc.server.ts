import 'server-only'

import { headers } from 'next/headers'
import { createRouterClient } from '@orpc/server'
import { router } from '@/orpc/routers'
import { auth } from '@/lib/auth'

globalThis.$client = createRouterClient(router, {
  context: async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    return { session }
  },
})
