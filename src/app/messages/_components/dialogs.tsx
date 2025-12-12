import { clsx } from 'clsx'
import { Check, CheckCheck, Circle, Plus } from 'lucide-react'
import { Dialog as DialogT } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import ProvidedAvatar from '@/components/ui/provided-avatar'
import { Button } from '@/components/ui/shadcn/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/shadcn/dialog'
import { Field, FieldLabel } from '@/components/ui/shadcn/field'
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
import useHandleRequestError from '@/hooks/use-handle-request-error'

function NewChatDialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogTrigger>) {
    const t = useExtracted()

    const [open, setOpen] = useState(false)
    const [username, setUsername] = useState('')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger {...props} />

            <DialogContent className={'sm:max-w-90'}>
                <DialogTitle>{t('New chat')}</DialogTitle>

                <Field>
                    <FieldLabel>{t('Username')}</FieldLabel>

                    <Input
                        placeholder={'dnrovs'}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Field>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        {t('Cancel')}
                    </Button>

                    <Button
                        asChild={!!username}
                        disabled={!username}
                        onClick={() => setOpen(false)}
                    >
                        <Link href={`/messages/${username}`}>
                            {t('Open chat')}
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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

                        <NewChatDialogTrigger asChild>
                            <Button
                                className={
                                    'sticky bottom-3 left-full mx-3 mt-auto size-17 rounded-full lg:bottom-0 lg:mx-0'
                                }
                            >
                                <Plus className={'size-5'} />
                            </Button>
                        </NewChatDialogTrigger>
                    </ItemGroup>

                    <Spinner
                        className={clsx(
                            'absolute bottom-0 left-0 m-2 size-5 rounded-full backdrop-blur-xs transition-discrete',
                            !intervalLoading && 'hidden'
                        )}
                    />
                </>
            )}
        </div>
    )
}
