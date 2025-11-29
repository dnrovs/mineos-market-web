'use client'

import Header from '@/components/layout/Header'
import React, { useEffect } from 'react'

import { Button } from '@/components/ui/shadcn/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/shadcn/card'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel
} from '@/components/ui/shadcn/field'
import { Input } from '@/components/ui/shadcn/input'

import { useForm, Controller } from 'react-hook-form'
import { useMarket } from '@/context/MarketProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { useExtracted } from 'next-intl'

type LoginFormValues = {
    username: string
    password: string
}

export default function LoginPage() {
    const { user, login } = useMarket()
    const t = useExtracted()
    const handleRequestError = useHandleRequestError()
    const router = useRouter()

    useEffect(() => {
        if (user) router.push('/')
    }, [user, router])

    const { control, handleSubmit } = useForm<LoginFormValues>()

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login({
                userName: data.username,
                password: data.password
            })
        } catch (error) {
            handleRequestError(error, t('while logging in'))
        }
    }

    return (
        <main className="flex h-screen w-full flex-col overflow-auto">
            <Header />
            <div className="flex h-full w-full">
                <Card
                    className={
                        'm-auto w-full max-sm:rounded-none max-sm:border-x-0 sm:w-sm'
                    }
                >
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                            Enter your credentials below to sign in to your
                            account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="username">
                                        Email or username
                                    </FieldLabel>
                                    <Controller
                                        name="username"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="m@example.com"
                                                required
                                                {...field}
                                            />
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                {...field}
                                            />
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <Button type="submit">Login</Button>
                                    <FieldDescription className="text-center">
                                        Don&apos;t have an account?{' '}
                                        <Link href="/register">Register</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
