'use client'

import { useMarket } from '@/context/market-provider'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { useExtracted } from 'next-intl'
import { useEffect, useState } from 'react'

export function useUnreadMessages() {
    const { user, client } = useMarket()
    const t = useExtracted()
    const handleRequestError = useHandleRequestError()
    const [unreadMessages, setUnreadMessages] = useState(0)

    useEffect(() => {
        if (!user) return

        client.messages
            .getDialogs()
            .then((dialogs) => {
                const unread = dialogs.filter(
                    (dialog) =>
                        !dialog.lastMessageIsRead &&
                        dialog.dialogUserName === dialog.lastMessageUserName
                ).length

                setUnreadMessages(unread)
            })
            .catch((error) =>
                handleRequestError(error, t('while fetching unread messages'))
            )
    }, [client.messages, t, user])

    return unreadMessages
}
