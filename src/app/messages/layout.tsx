'use client'

import { clsx } from 'clsx'
import { useExtracted } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { StickToBottom } from 'use-stick-to-bottom'

import Dialogs from '@/app/messages/_components/dialogs'
import Header from '@/components/layout/header'
import { useMarket } from '@/context/MarketProvider'
import { useIsMobile } from '@/hooks/shadcn/use-mobile'
import { cn } from '@/utils/shadcn'

interface MessagesLayoutProps {
    children: React.ReactNode
}

export default function MessagesLayout({ children }: MessagesLayoutProps) {
    const { user } = useMarket()
    const pathname = usePathname()
    const router = useRouter()
    const isDialog = pathname !== '/messages'

    useEffect(() => {
        if (!user) router.push('/login')
    }, [router, user])

    return (
        <main className="flex h-dvh w-full flex-col">
            <Header className={cn('hidden lg:flex', !isDialog && 'flex')} />

            <div className="flex min-h-0 w-full grow gap-3 lg:px-3 lg:pb-3">
                <div
                    className={clsx(
                        'w-full flex-shrink-0 lg:w-auto',
                        isDialog && 'hidden lg:block'
                    )}
                >
                    <Dialogs />
                </div>

                <div
                    className={clsx(
                        'lg:bg-sidebar flex min-h-0 w-full grow rounded-md bg-transparent lg:overflow-auto',
                        !isDialog && 'hidden lg:block'
                    )}
                >
                    {children}
                </div>
            </div>
        </main>
    )
}
