import { clsx } from 'clsx'
import { Check, CheckCheck, Circle, Plus } from 'lucide-react'
import { Dialog as DialogT } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import ProvidedAvatar from '@/components/ui/provided-avatar'
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar'
import { Button } from '@/components/ui/shadcn/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/shadcn/dialog'
import { Input } from '@/components/ui/shadcn/input'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle
} from '@/components/ui/shadcn/item'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { useMarket } from '@/context/MarketProvider'
import { useConfig } from '@/hooks/use-config'
import handleFetchError from '@/hooks/use-handle-request-error'
import useHandleRequestError from '@/hooks/use-handle-request-error'

function NewChatDialogContent() {
    const t = useExtracted()
    const [username, setUsername] = useState('')

    return (
        <DialogContent className={'max-w-87.5!'}>
            <DialogTitle>New chat</DialogTitle>
            <Input
                placeholder={t('Username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="secondary">{t('Cancel')}</Button>
                </DialogClose>

                <Button type="submit" asChild={!!username} disabled={!username}>
                    <Link href={`/messages/${username}`}>{t('Open chat')}</Link>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

interface DialogProps {
    dialog: DialogT
}

function DialogItem({ dialog }: DialogProps) {
    const pathname = usePathname()
    const active = `/messages/${dialog.dialogUserName}` === pathname

    return (
        <Item
            key={dialog.dialogUserName}
            className={clsx(
                'w-full rounded-none p-3 px-4.5 lg:rounded-md lg:px-3',
                active && 'bg-accent/50'
            )}
            asChild
        >
            <Link href={`/messages/${dialog.dialogUserName}`}>
                <ItemMedia>
                    <ProvidedAvatar
                        username={dialog.dialogUserName}
                        className={'size-10'}
                    />
                </ItemMedia>
                <ItemContent className={'truncate'}>
                    <ItemTitle className={'truncate'}>
                        {dialog.dialogUserName}
                    </ItemTitle>
                    <ItemDescription className={'truncate text-nowrap'}>
                        {dialog.text}
                    </ItemDescription>
                </ItemContent>
                <ItemActions className={'size-5'}>
                    {dialog.dialogUserName === dialog.lastMessageUserName ? (
                        !dialog.lastMessageIsRead && (
                            <Circle className={'m-auto size-3 fill-current'} />
                        )
                    ) : dialog.lastMessageIsRead ? (
                        <CheckCheck />
                    ) : (
                        <Check />
                    )}
                </ItemActions>
            </Link>
        </Item>
    )
}

export default function Dialogs() {
    const { user, client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()

    const { config } = useConfig()

    const [dialogs, setDialogs] = useState<DialogT[]>([])

    const [loading, setLoading] = useState(true)
    const [intervalLoading, setIntervalLoading] = useState(false)
    const stopLoading = () => {
        setLoading(false)
        setIntervalLoading(false)
    }

    useEffect(() => {
        if (!user) return

        setLoading(true)

        const fetchDialogs = () => {
            client.messages
                .getDialogs()
                .then(setDialogs)
                .catch((error) => {
                    handleRequestError(error, t('while fetching dialogs'))
                })
                .finally(() => stopLoading())
        }

        fetchDialogs()

        const interval = setInterval(() => {
            setIntervalLoading(true)
            fetchDialogs()
        }, config.behaviour.dialogsUpdateInterval * 1000)

        return () => clearInterval(interval)
    }, [client.messages, config.behaviour.dialogsUpdateInterval, user])

    return (
        <div
            className={
                'relative flex h-full flex-col items-center justify-center lg:w-75 xl:w-87.5 2xl:w-100'
            }
        >
            {loading ? (
                <Spinner className={'size-10'} />
            ) : (
                <>
                    <ItemGroup
                        className={
                            'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-ring h-full w-full gap-1 overflow-auto'
                        }
                    >
                        {dialogs.map((dialog) => (
                            <DialogItem
                                key={dialog.dialogUserName}
                                dialog={dialog}
                            />
                        ))}
                    </ItemGroup>

                    <Spinner
                        className={clsx(
                            'absolute bottom-0 left-0 m-2 size-5 rounded-full backdrop-blur-xs transition-discrete',
                            !intervalLoading && 'hidden'
                        )}
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className={
                                    'absolute right-3 bottom-3 size-17 rounded-full lg:right-0 lg:bottom-0'
                                }
                            >
                                <Plus className={'size-5'} />
                            </Button>
                        </DialogTrigger>
                        <NewChatDialogContent />
                    </Dialog>
                </>
            )}
        </div>
    )
}
