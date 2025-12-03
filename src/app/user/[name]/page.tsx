'use client'

import Header from '@/components/layout/header'
import { useParams } from 'next/navigation'
import { useMarket } from '@/context/MarketProvider'
import { Button } from '@/components/ui/shadcn/button'
import React, { useEffect, useState } from 'react'
import { OrderBy, PreviewPublication } from 'mineos-market-client'
import { HeartCrack, MessageCirclePlus, Settings, Share2 } from 'lucide-react'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/shadcn/empty'
import { Spinner } from '@/components/ui/shadcn/spinner'
import Publications from '@/components/layout/publications'
import Link from 'next/link'
import { useExtracted } from 'next-intl'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import ProvidedAvatar from '@/components/ui/provided-avatar'
import { Switch } from '@/components/ui/shadcn/switch'

export default function User() {
    const name = useParams<{ name: string }>().name
    const { user, client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()

    const [publications, setPublications] = useState<PreviewPublication[]>()
    const [loading, setLoading] = useState(true)

    const isCurrentUser = user?.name === name

    useEffect(() => {
        setLoading(true)

        client.publications
            .getPublications({
                userName: name,
                orderBy: OrderBy.Date
            })
            .then(setPublications)
            .catch((error) => {
                handleRequestError(error, t('while fetching publications'))
            })
            .finally(() => setLoading(false))
    }, [client.publications, name])

    return (
        <main className="flex h-screen w-full flex-col overflow-auto">
            <Header />
            <div
                className={
                    'mx-auto flex w-full max-w-192 flex-1 flex-col items-center justify-between gap-3 p-4.5 pt-0! max-sm:p-3 sm:pt-0!'
                }
            >
                <div className={'flex h-min w-full justify-between gap-3'}>
                    <div className={'flex w-full flex-col justify-between'}>
                        <span className={'text-2xl'}>{name}</span>
                        <div className={'flex gap-2'}>
                            <Button size={'sm'} className={'w-fit'} asChild>
                                {isCurrentUser ? (
                                    <Link href={'/settings'}>
                                        <Settings />
                                        {t('Settings')}
                                    </Link>
                                ) : (
                                    <Link href={`/messages/${name}`}>
                                        <MessageCirclePlus />
                                        {t('Open chat')}
                                    </Link>
                                )}
                            </Button>
                            {navigator.share && (
                                <Button
                                    variant={'secondary'}
                                    size={'icon-sm'}
                                    onClick={() =>
                                        navigator.share({
                                            title: name,
                                            url: `https://market.dnrovs.com/user/${name}`
                                        })
                                    }
                                >
                                    <Share2 />
                                </Button>
                            )}
                        </div>
                    </div>
                    <ProvidedAvatar username={name} className={'size-18'} />
                </div>
                {loading ? (
                    <Spinner className={'mx-auto my-auto size-10'} />
                ) : publications && publications?.length !== 0 ? (
                    <Publications publications={publications} />
                ) : (
                    <Empty className={'m-auto'}>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <HeartCrack />
                            </EmptyMedia>
                            <EmptyTitle>No publications found</EmptyTitle>
                            <EmptyDescription>
                                {isCurrentUser
                                    ? t("You don't have any publications yet.")
                                    : t(
                                          'This user does not have any publications yet, or does not exist.'
                                      )}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}
            </div>
        </main>
    )
}
