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
import { ApiError } from 'mineos-market-client'
import { toast } from 'sonner'
import Link from 'next/link'
import handleFetchError from '@/hooks/use-handle-request-error'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { useExtracted } from 'next-intl'

type RegisterFormValues = {
    username: string
    email: string
    password: string
}

export default function LoginPage() {
    const { user, client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()

    const router = useRouter()

    useEffect(() => {
        if (user) router.push('/')
    }, [user, router])

    const { control, handleSubmit } = useForm<RegisterFormValues>()

    const register = async (data: RegisterFormValues) => {
        const registerPromise = client.auth
            .register({
                userName: data.username,
                email: data.email,
                password: data.password
            })
            .then(() => {
                router.push('/')
                toast.success(
                    t(
                        'Check your e-mail and spam folder message to submit your MineOS account'
                    )
                )
            })
            .catch((error) => {
                throw new Error(
                    handleRequestError(error, t('while registering'))
                )
            })

        toast.promise(registerPromise, {
            loading: t('Registering your account...'),
            success: t('Your account has been registered successfully.'),
            error: (error: Error) => error.message
        })
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
                        <CardTitle>{t('Register a new account')}</CardTitle>
                        <CardDescription>
                            {t(
                                'Enter your information below to create your account.'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(register)}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="username">
                                        {t('Username')}
                                    </FieldLabel>
                                    <Controller
                                        name="username"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="johnpork"
                                                required
                                                {...field}
                                            />
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email">
                                        {t('Email')}
                                    </FieldLabel>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="jonny@example.com"
                                                required
                                                {...field}
                                            />
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password">
                                        {t('Password')}
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
                                    <Button type="submit">Register</Button>
                                    <FieldDescription className="text-center">
                                        {t('Already have an account?')}{' '}
                                        <Link href="/login">{t('Login')}</Link>
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
