'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'

import { useCreatePost } from '@/hooks/posts/use-posts'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Post title is required' }),
  content: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(1000, 'Description must be at most 1000 characters'),
})

export const CreatePostForm = () => {
  const { mutate: createPost, isPending } = useCreatePost()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    createPost(values)
  }

  return (
    <div className="flex flex-col items-center p-6 gap-y-4">
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-4"
        id="create-post-form"
      >
        <FieldGroup>
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-post-form-title">
                  Post Title
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter post title"
                  aria-invalid={fieldState.invalid}
                  id="create-post-form-title"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="create-post-form-content">
                  Post Content
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    placeholder="Enter post content"
                    aria-invalid={fieldState.invalid}
                    id="create-post-form-content"
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length}/ 1000 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer"
        >
          Create Post
        </Button>
      </form>
    </div>
  )
}
