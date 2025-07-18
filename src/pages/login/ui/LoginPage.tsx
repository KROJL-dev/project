import type { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useNavigate } from '@tanstack/react-router'

import { Input } from '@/shared/ui/atoms/input'
import { Button } from '@/shared/ui/atoms/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/organisms/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/atoms/card'

import { validationSchema } from '../model/validation.schema'
import { useCallback, useEffect } from 'react'
import { useLoginMutation } from '@/features/auth/api/login'
import { useIsUserAuthorized } from '@/features/auth/model/auth'

const LoginPage = () => {
  const navigate = useNavigate()
  const isUserAuthorized = useIsUserAuthorized()
  const { mutate: login } = useLoginMutation()

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = useCallback(
    (values: z.infer<typeof validationSchema>) => {
      login(values)
    },
    [login]
  )

  const onRedirectToSignUp = useCallback(() => {
    navigate({ to: '/signUp' })
  }, [navigate])

  useEffect(() => {
    if (isUserAuthorized) {
      navigate({ to: '/dashboard' })
    }
  }, [isUserAuthorized, navigate])

  return (
    <div className="flex h-full items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
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
                      <Input type="password" placeholder="Ваш пароль" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="link" className="!block ml-auto" onClick={onRedirectToSignUp}>
                Sign Up
              </Button>
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
export default LoginPage
