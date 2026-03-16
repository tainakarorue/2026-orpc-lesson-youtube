'use client'

// import { client } from '@/lib/orpc'
import { useQuery } from '@tanstack/react-query'

import { orpc } from '@/lib/orpc-rq.client'

export default function Home() {
  // const user = await client.user.getById({ id: '1' })
  // return <div>{user.name}</div>
  const { data: user } = useQuery(
    orpc.user.getById.queryOptions({ input: { id: '1' } }),
  )

  return <div>{user?.name}</div>
}
