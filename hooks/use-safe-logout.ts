'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'

export const useSafeLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    setIsLoading(true)
    try {
      await authClient.signOut()

      queryClient.clear()

      router.replace('/sign-in')
      router.refresh()

      toast.success('success signout')
    } catch (error) {
      toast.error('failed to signout')
    } finally {
      setIsLoading(false)
    }
  }

  return { logout, isLoading }
}
