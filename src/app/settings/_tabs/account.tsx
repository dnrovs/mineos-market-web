import { clsx } from 'clsx'
import {
    AtSign,
    Calendar,
    Check,
    CheckCheck,
    Circle,
    Fingerprint,
    LogIn,
    LogOut,
    User,
    UserRound,
    UserRoundPlus
} from 'lucide-react'
import { ChangePasswordParams, UserCredentials } from 'mineos-market-client'
import { useExtracted, useFormatter } from 'next-intl'
import Link from 'next/link'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ButtonLink from '@/components/ui/button-link'
import ProvidedAvatar from '@/components/ui/provided-avatar'
import { Badge } from '@/components/ui/shadcn/badge'
import { Button } from '@/components/ui/shadcn/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/shadcn/card'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/shadcn/empty'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet
} from '@/components/ui/shadcn/field'
import { Input } from '@/components/ui/shadcn/input'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle
} from '@/components/ui/shadcn/item'
import { Separator } from '@/components/ui/shadcn/separator'
import { TabsContent } from '@/components/ui/shadcn/tabs'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/shadcn/tooltip'
import { useMarket } from '@/context/MarketProvider'
import useHandleRequestError from '@/hooks/use-handle-request-error'

function UserItem() {
    const { user, logout } = useMarket()

    const t = useExtracted()
    const format = useFormatter()

    const userBadges = [
        {
            icon: AtSign,
            value: user?.email,
            description: t('Email')
        },
        {
            icon: Calendar,
            value: format.dateTime(new Date(user!.timestamp * 1000), {
                dateStyle: 'short',
                timeStyle: 'short'
            }),
            description: t('Registered at')
        },
        {
            icon: Fingerprint,
            value: user?.id,
            description: t('User ID')
        }
    ]

    if (!user) return

    return (
        <Item className={'p-0'}>
            <ItemMedia className={'my-auto'}>
                <Link href={`/user/${user.name}`}>
                    <ProvidedAvatar
                        username={user.name}
                        className={'size-13'}
                    />
                </Link>
            </ItemMedia>
            <ItemContent className={'truncate'}>
                <ItemTitle className={'truncate'}>
                    <ButtonLink href={`/user/${user.name}`}>
                        {user.name}
                    </ButtonLink>
                </ItemTitle>
                <ItemDescription>
                    {userBadges.map((badge, index) => (
                        <Tooltip key={index} delayDuration={500}>
                            <TooltipTrigger>
                                <Badge
                                    variant={'secondary'}
                                    className={'m-0.25 cursor-help'}
                                >
                                    <badge.icon />
                                    {badge.value}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>{badge.description}</TooltipContent>
                        </Tooltip>
                    ))}
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button size={'icon'} variant={'ghost'} onClick={logout}>
                    <LogOut />
                </Button>
            </ItemActions>
        </Item>
    )
}

type ChangePasswordFormValues = Omit<ChangePasswordParams, 'email'>

export default function AccountTab() {
    const { user, client, logout } = useMarket()
    const t = useExtracted()
    const handleRequestError = useHandleRequestError()

    const changePasswordForm = useForm<ChangePasswordFormValues>()

    const changePassword = async (data: ChangePasswordFormValues) => {
        if (!user) return logout()

        const changePasswordPromise = client.auth
            .changePassword({
                email: user.email,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            })
            .then(() => {
                changePasswordForm.reset()
            })
            .catch((error) => {
                throw new Error(
                    handleRequestError(
                        error,
                        t('while changing password'),
                        true
                    )
                )
            })

        toast.promise(changePasswordPromise, {
            loading: t('Changing your password...'),
            success: t('Your password has been changed successfully.'),
            error: (error: Error) => error.message
        })
    }

    return user ? (
        <FieldGroup>
            <UserItem />

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>{t('Change password')}</FieldLegend>
                <FieldDescription>
                    {t("Reset your account's password.")}
                </FieldDescription>
                <form
                    onSubmit={changePasswordForm.handleSubmit(changePassword)}
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel>{t('Current password')}</FieldLabel>
                            <Controller
                                name={'currentPassword'}
                                control={changePasswordForm.control}
                                render={({ field }) => (
                                    <Input type="password" {...field} />
                                )}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>{t('New password')}</FieldLabel>
                            <Controller
                                name={'newPassword'}
                                control={changePasswordForm.control}
                                render={({ field }) => (
                                    <Input type="password" {...field} />
                                )}
                            />
                        </Field>
                        <Field>
                            <Button type="submit">
                                {t('Change password')}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </FieldSet>
        </FieldGroup>
    ) : (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                    <UserRound />
                </EmptyMedia>
                <EmptyTitle>{t("You're not logged in")}</EmptyTitle>
                <EmptyDescription>
                    {t(
                        'To access account settings, please log in or register.'
                    )}
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
                <div className={'flex gap-2'}>
                    <Button variant={'outline'} asChild>
                        <Link href={'/login'}>
                            <LogIn />
                            {t('Login')}
                        </Link>
                    </Button>
                    <Button variant={'outline'} asChild>
                        <Link href={'/register'}>
                            <UserRoundPlus />
                            {t('Register')}
                        </Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}
