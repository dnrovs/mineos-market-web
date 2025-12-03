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
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { getExtracted, getLocale } from 'next-intl/server'

const inter = Inter({
    subsets: ['latin', 'cyrillic-ext'],
    variable: '--font-inter'
})

export async function generateMetadata(): Promise<Metadata> {
    const t = await getExtracted()

    return {
        title: 'MineOS Market',
        description: t(
            'Explore, upload and share MineOS software. View the source code. Communicate with developers.'
        ),
        openGraph: {
            title: 'MineOS Market',
            description: t(
                'Explore, upload and share MineOS software. View the source code. Communicate with developers.'
            ),
            url: 'https://mineos-market.vercel.app/',
            siteName: 'MineOS Market',
            type: 'website'
        },
        other: {
            'google-site-verification':
                process.env.GOOGLE_SITE_VERIFICATION ?? ''
        }
    }
}

export const viewport: Viewport = {
    interactiveWidget: 'resizes-content'
}

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const locale = await getLocale()

    return (
        <html
            lang={locale}
            className={inter.className}
            suppressHydrationWarning
        >
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
                                    <Analytics />
                                    <SpeedInsights />
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
