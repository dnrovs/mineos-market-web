'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useMarket } from '@/context/MarketProvider'
import { Message as MessageT } from 'mineos-market-client'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/shadcn/button'
import { ArrowUp } from 'lucide-react'
import handleFetchError from '@/hooks/use-handle-request-error'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from '@/components/ui/shadcn/input-group'
import { useConfig } from '@/hooks/use-config'
import { toast } from 'sonner'
import emojiRegex from 'emoji-regex'
import Message from '@/app/messages/[user]/_components/message'
import { Header } from '@/app/messages/[user]/_components/header'
import { useExtracted } from 'next-intl'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import {
    StickToBottom,
    useStickToBottom,
    useStickToBottomContext
} from 'use-stick-to-bottom'

export default function Chat() {
    const { user, client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()

    const { config } = useConfig()
    const router = useRouter()
    const dialogUserName = useParams<{ user: string }>().user

    const [messages, setMessages] = useState<MessageT[]>([])

    const [loading, setLoading] = useState(true)
    const [intervalLoading, setIntervalLoading] = useState(false)
    const stopLoading = () => {
        setLoading(false)
        setIntervalLoading(false)
    }

    const [sending, setSending] = useState(false)
    const [message, setMessage] = useState('')

    const fetchLastMessageIsRead = () => {
        let lastMessageIsRead = false
        client.messages
            .getDialogs()
            .then((dialogs) => {
                lastMessageIsRead = !!dialogs.find(
                    (dialog) => dialog.dialogUserName === dialogUserName
                )?.lastMessageIsRead
            })
            .catch((error) =>
                handleRequestError(
                    error,
                    t('while fetching last message read status')
                )
            )
        return lastMessageIsRead
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
    }

    const sendMessage = () => {
        if (!message || sending) return

        if (emojiRegex().test(message))
            return toast.error(t('Emoji are not allowed.'))

        if (message.startsWith('{') || message.endsWith('}'))
            return toast.error(
                t('Message cannot start or end with curly braces.')
            )

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

    return loading ? (
        <Spinner className={'mx-auto my-auto size-10'} />
    ) : (
        <StickToBottom className="scrollbar-thin flex h-full grow flex-col items-center overflow-auto">
            <StickToBottom.Content className={'flex h-full flex-col'}>
                <Header userName={dialogUserName} />

                <div className="flex w-full max-w-300 grow flex-col-reverse gap-1 px-3">
                    <span className={'text-muted-foreground text-right'}>
                        {fetchLastMessageIsRead() ? t('Read') : t('Unread')}
                    </span>

                    {messages.map((message, index) => (
                        <Message key={index} message={message} />
                    ))}
                </div>

                <div className="bg-background/75 lg:bg-sidebar/75 sticky bottom-0 mb-[env(safe-area-inset-bottom)] flex w-full justify-center gap-2 p-3 backdrop-blur-md">
                    <InputGroup className={'w-full max-w-283 rounded-full'}>
                        <InputGroupInput
                            placeholder={t(
                                'Say something to {dialogUserName}...',
                                {
                                    dialogUserName
                                }
                            )}
                            enterKeyHint={'send'}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') sendMessage()
                            }}
                            value={message}
                            disabled={sending}
                            onInput={(onchange) =>
                                setMessage(onchange.currentTarget.value)
                            }
                        />
                        <InputGroupAddon align={'inline-end'}>
                            <Spinner
                                className={clsx('transition-discrete', {
                                    hidden: !intervalLoading
                                })}
                            />
                        </InputGroupAddon>
                    </InputGroup>
                    <Button
                        className="rounded-full"
                        size="icon"
                        onClick={sendMessage}
                        disabled={sending}
                    >
                        <ArrowUp />
                    </Button>
                </div>
            </StickToBottom.Content>
        </StickToBottom>
    )
}
