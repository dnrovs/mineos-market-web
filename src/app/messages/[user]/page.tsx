'use client'

import emojiRegex from 'emoji-regex'
import { Message as MessageT } from 'mineos-market-client'
import { useExtracted, useFormatter } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { StickToBottom } from 'use-stick-to-bottom'

import { ChatHeader } from '@/app/messages/[user]/_components/chat-header'
import Footer from '@/app/messages/[user]/_components/footer'
import Message from '@/app/messages/[user]/_components/message'
import Header from '@/components/layout/header'
import ProvidedAvatar from '@/components/ui/provided-avatar'
import { Badge } from '@/components/ui/shadcn/badge'
import { Button } from '@/components/ui/shadcn/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/shadcn/empty'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { useMarket } from '@/context/MarketProvider'
import { useConfig } from '@/hooks/use-config'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { LogIn, UserRoundPlus } from 'lucide-react'
import Link from 'next/link'

type MessageGroups = Record<string, MessageT[]>

export default function Chat() {
    const { user, client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()
    const format = useFormatter()

    const { config } = useConfig()
    const router = useRouter()
    const dialogUserName = useParams<{ user: string }>().user

    const [messages, setMessages] = useState<MessageT[]>([])
    const [lastMessageIsRead, setLastMessageIsRead] = useState<
        undefined | boolean
    >(undefined)

    const messageGroups: MessageGroups = messages.reduce((groups, message) => {
        const date = new Date(message.timestamp * 1000)
        const now = new Date()

        const label = format.dateTime(date, {
            day: 'numeric',
            month: 'short',
            ...(date.getFullYear() !== now.getFullYear() && {
                year: 'numeric'
            })
        })

        if (!groups[label]) groups[label] = []

        groups[label].push(message)

        return groups
    }, {} as MessageGroups)

    const [loading, setLoading] = useState(true)
    const [intervalLoading, setIntervalLoading] = useState(false)
    const stopLoading = () => {
        setLoading(false)
        setIntervalLoading(false)
    }

    const [sending, setSending] = useState(false)
    const [message, setMessage] = useState('')

    const fetchLastMessageIsRead = () => {
        client.messages
            .getDialogs()
            .then((dialogs) => {
                const dialog = dialogs.find(
                    (dialog) =>
                        dialog.dialogUserName === dialogUserName &&
                        dialog.lastMessageUserName === user?.name
                )

                setLastMessageIsRead(
                    dialog ? !!dialog.lastMessageIsRead : undefined
                )
            })
            .catch((error) =>
                handleRequestError(
                    error,
                    t('while fetching last message read status')
                )
            )
    }

    const fetchMessages = () => {
        client.messages
            .getDialog({ userName: dialogUserName })
            .then(setMessages)
            .catch((error) => {
                if (
                    user &&
                    error.message === 'User with specified token not exists'
                ) {
                    toast.error(
                        t('User {dialogUserName} does not exist.', {
                            dialogUserName
                        })
                    )
                    router.push('/messages')
                } else {
                    handleRequestError(error, t('while fetching dialog'))
                }
            })
            .finally(() => stopLoading())

        fetchLastMessageIsRead()
    }

    const sendMessage = () => {
        if (!message || sending) return

        if (emojiRegex().test(message))
            return toast.error(t('Emoji are not allowed.'))

        setIntervalLoading(true)
        setSending(true)

        client.messages
            .sendMessage({
                userName: dialogUserName,
                text: message
            })
            .then(() => {
                setMessage('')
                fetchMessages()
            })
            .catch((error) =>
                handleRequestError(error, t('while sending a message'))
            )
            .finally(() => setSending(false))
    }

    useEffect(() => {
        if (!user) return

        setLoading(true)

        fetchMessages()

        const interval = setInterval(() => {
            setIntervalLoading(true)
            fetchMessages()
        }, config.behaviour.chatUpdateInterval * 1000)

        return () => clearInterval(interval)
    }, [
        client.messages,
        config.behaviour.chatUpdateInterval,
        dialogUserName,
        user
    ])

    if (!user)
        return (
            <div className={'w-full'}>
                <Header className={'md:hidden'} />

                <Empty className={'h-full'}>
                    <EmptyHeader>
                        <EmptyMedia>
                            <ProvidedAvatar
                                username={dialogUserName}
                                className={'size-15'}
                            />
                        </EmptyMedia>
                        <EmptyTitle>
                            {t('Talk to {dialogUserName}', { dialogUserName })}
                        </EmptyTitle>
                        <EmptyDescription>
                            {t(
                                'Log in or register to start chatting with users'
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
            </div>
        )

    return loading ? (
        <Spinner className={'mx-auto my-auto size-10'} />
    ) : (
        <StickToBottom
            initial={'instant'}
            className="scrollbar-thin flex h-full grow flex-col items-center overflow-auto"
        >
            <StickToBottom.Content className={'flex min-h-full flex-col'}>
                <ChatHeader userName={dialogUserName} />

                <div className="flex w-full max-w-300 grow flex-col-reverse gap-1 px-3">
                    <span
                        className={
                            'text-muted-foreground text-right text-sm font-medium'
                        }
                    >
                        {lastMessageIsRead === undefined
                            ? null
                            : lastMessageIsRead
                              ? t('Read')
                              : t('Sent')}
                    </span>

                    {Object.entries(messageGroups).map(([label, messages]) => (
                        <React.Fragment key={label}>
                            {messages.map((message, index) => (
                                <Message key={index} message={message} />
                            ))}

                            <Badge
                                variant={'secondary'}
                                className={
                                    'm-1 self-center rounded-full text-sm'
                                }
                            >
                                {label}
                            </Badge>
                        </React.Fragment>
                    ))}
                </div>

                <Footer
                    dialogUserName={dialogUserName}
                    sendMessage={sendMessage}
                    message={message}
                    setMessage={setMessage}
                    sending={sending}
                    intervalLoading={intervalLoading}
                />
            </StickToBottom.Content>
        </StickToBottom>
    )
}
