'use client'

import { ApiError } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import Header from '@/components/layout/header'
import ResponsiveCard from '@/components/ui/responsive-card'
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
import { useMarket } from '@/context/MarketProvider'
import handleFetchError from '@/hooks/use-handle-request-error'
import useHandleRequestError from '@/hooks/use-handle-request-error'

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
            <div className="flex h-full w-full items-center">
                <ResponsiveCard>
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
                                <Controller
                                    name="username"
                                    control={control}
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>
                                                {t('Username')}
                                            </FieldLabel>

                                            <Input
                                                type="text"
                                                placeholder="johnpork"
                                                required
                                                {...field}
                                            />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>
                                                {t('Email')}
                                            </FieldLabel>

                                            <Input
                                                type="email"
                                                placeholder="jonny@example.com"
                                                required
                                                {...field}
                                            />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>
                                                {t('Password')}
                                            </FieldLabel>

                                            <Input
                                                type="password"
                                                required
                                                {...field}
                                            />
                                        </Field>
                                    )}
                                />
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
                </ResponsiveCard>
            </div>
        </main>
    )
}
