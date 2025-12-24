'use client'

import { useMarket } from '@/context/MarketProvider'
import { useExtracted } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function Messages() {
    const { user } = useMarket()
    const router = useRouter()

    const t = useExtracted()

    if (!user) return router.push('/login')

    return (
        <span
            className={'flex h-full w-full items-center justify-center text-xl'}
        >
            {t('Open chat to start talking')}
        </span>
    )
}
