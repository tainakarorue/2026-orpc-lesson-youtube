'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { OctagonAlertIcon } from 'lucide-react'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle } from '@/components/ui/alert'

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.email(),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const SignUpView = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null)

    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          router.push('/')
        },
        onError: ({ error }) => {
          toast.error(error.message)
          setError(error.message)
        },
      },
    )
  }

  const isPending = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-muted-foreground text-balance">
              Create your account
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!error && (
            <Alert className="bg-rose-100 border-none text-rose-500">
              <OctagonAlertIcon className="size-4" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <Button disabled={isPending} type="submit" className="w-full">
            Sign up
          </Button>
          <div className="text-center text-sm text-blue-500">
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in your account
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
