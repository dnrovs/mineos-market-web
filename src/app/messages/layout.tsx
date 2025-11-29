'use client'

import Header from '@/components/layout/Header'
import Dialogs from '@/app/messages/_components/dialogs'
import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import { useMarket } from '@/context/MarketProvider'
import { useExtracted } from 'next-intl'

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
        <main className="flex h-dvh w-full flex-col overflow-auto lg:overflow-hidden">
            <Header />
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
                        'lg:bg-sidebar flex min-h-0 w-full grow flex-col rounded-xl bg-transparent lg:overflow-auto',
                        !isDialog && 'hidden lg:block'
                    )}
                >
                    {children}
                </div>
            </div>
        </main>
    )
}
