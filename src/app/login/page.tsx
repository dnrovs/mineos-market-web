'use client'

import Header from '@/components/layout/header'
import React, { useEffect } from 'react'

import { Button } from '@/components/ui/shadcn/button'
import {
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
import ResponsiveCard from '@/components/ui/responsive-card'

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
            <div className="flex h-full w-full items-center">
                <ResponsiveCard>
                    <CardHeader>
                        <CardTitle>{t('Login to your account')}</CardTitle>
                        <CardDescription>
                            {t(
                                'Enter your credentials below to sign in to your account'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name={'username'}
                                    control={control}
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>
                                                {t('Email or username')}
                                            </FieldLabel>

                                            <Input
                                                placeholder="m@example.com"
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
                                    <Button type="submit">{t('Login')}</Button>
                                    <FieldDescription className="text-center">
                                        {t("Don't have an account?")}{' '}
                                        <Link href="/register">
                                            {t('Register')}
                                        </Link>
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
