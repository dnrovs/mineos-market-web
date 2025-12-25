'use client'

import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'
import React from 'react'

import Dialogs from '@/app/messages/_components/dialogs'
import Header from '@/components/layout/header'
import { useMarket } from '@/context/MarketProvider'
import { useConfig } from '@/hooks/use-config'
import { cn } from '@/utils/shadcn'
import { useTheme } from 'next-themes'
import { useMediaQuery } from 'usehooks-ts'

interface MessagesLayoutProps {
    children: React.ReactNode
}

export default function MessagesLayout({ children }: MessagesLayoutProps) {
    const { user } = useMarket()
    const { config } = useConfig()
    const { resolvedTheme } = useTheme()
    const pathname = usePathname()

    const isMobile = useMediaQuery('(max-width: 64rem)')

    const isDialog = pathname !== '/messages'

    const wallpaperSource =
        resolvedTheme === 'dark'
            ? config.appearance.chatWallpaperDark
            : config.appearance.chatWallpaperLight

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
                        'light lg:bg-sidebar flex min-h-0 w-full grow rounded-md bg-transparent bg-cover lg:overflow-auto',
                        !isDialog && 'hidden lg:block',
                        !user && 'bg-transparent!'
                    )}
                    style={{
                        ...(wallpaperSource &&
                            user && {
                                backgroundImage: `url(${wallpaperSource})`
                            })
                    }}
                >
                    {children}
                </div>
            </div>
        </main>
    )
}
