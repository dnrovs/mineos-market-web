'use client'

import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'
import React from 'react'

import Dialogs from '@/app/messages/_components/dialogs'
import Header from '@/components/layout/header'
import { useMarket } from '@/context/MarketProvider'
import { cn } from '@/utils/shadcn'
import { useMediaQuery } from 'usehooks-ts'

interface MessagesLayoutProps {
    children: React.ReactNode
}

export default function MessagesLayout({ children }: MessagesLayoutProps) {
    const { user } = useMarket()
    const pathname = usePathname()

    const isMobile = useMediaQuery('(max-width: 64rem)')

    const isDialog = pathname !== '/messages'

    return (
        <main className="flex h-dvh w-full flex-col">
            <Header className={cn('hidden lg:flex', !isDialog && 'flex')} />

            <div className="flex min-h-0 w-full grow gap-3 lg:px-3 lg:pb-3">
                {user && (!isMobile || !isDialog) && (
                    <div className={clsx('w-full shrink-0 lg:w-auto')}>
                        <Dialogs />
                    </div>
                )}

                <div
                    className={clsx(
                        'lg:bg-sidebar flex min-h-0 w-full grow rounded-md bg-transparent lg:overflow-auto',
                        !isDialog && 'hidden lg:block',
                        !user && 'bg-transparent!'
                    )}
                >
                    {children}
                </div>
            </div>
        </main>
    )
}
