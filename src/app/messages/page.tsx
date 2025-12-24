'use client'

import useRequireUser from '@/hooks/use-require-user'
import { useExtracted } from 'next-intl'

export default function Messages() {
    const t = useExtracted()

    useRequireUser()

    return (
        <span
            className={'flex h-full w-full items-center justify-center text-xl'}
        >
            {t('Open chat to start talking')}
        </span>
    )
}
