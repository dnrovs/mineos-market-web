import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import { ThemeProvider } from 'next-themes'
import AppSidebar from '@/components/layout/app-sidebar'
import { MarketProvider } from '@/context/MarketProvider'
import { Toaster } from '@/components/ui/shadcn/sonner'
import { SidebarProvider } from '@/components/ui/shadcn/sidebar'
import { NextIntlClientProvider } from 'next-intl'
import { NuqsAdapter } from 'nuqs/adapters/next'

const inter = Inter({
    subsets: ['latin', 'cyrillic-ext'],
    variable: '--font-inter'
})

export const metadata: Metadata = {
    title: 'MineOS Market',
    description:
        'Explore, upload and share MineOS software. View the source code. Communicate with developers. Everything in your browser.',
    openGraph: {
        title: 'MineOS Market',
        description:
            'Explore, upload and share MineOS software. View the source code. Communicate with developers. Everything in your browser.',
        url: 'https://mineos-market.vercel.app/',
        siteName: 'MineOS Market',
        type: 'website'
    }
}

export const viewport: Viewport = {
    interactiveWidget: 'resizes-content'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <body
                className={`bg-background [&_*]:scrollbar [&_*]:scrollbar-thumb-primary/20 [&_*]:scrollbar-track-transparent flex overflow-hidden antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <NextIntlClientProvider>
                        <NuqsAdapter>
                            <MarketProvider>
                                <SidebarProvider
                                    style={
                                        {
                                            '--sidebar-width': '18rem'
                                        } as React.CSSProperties
                                    }
                                >
                                    <AppSidebar />
                                    {children}
                                    <Toaster />
                                </SidebarProvider>
                            </MarketProvider>
                        </NuqsAdapter>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
