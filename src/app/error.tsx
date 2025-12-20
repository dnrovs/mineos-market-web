'use client'

import { Github, OctagonAlert } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/components/ui/shadcn/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/shadcn/empty'
import { useExtracted } from 'next-intl'

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useExtracted()

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <OctagonAlert />
                </EmptyMedia>
                <EmptyTitle>{t('Unexpected Error')}</EmptyTitle>
                <EmptyDescription>{String(error)}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className={'flex gap-2'}>
                    <Button onClick={() => reset()}>{t('Try again')}</Button>
                    <Button variant={'secondary'} asChild>
                        <Link
                            href={
                                'https://github.com/dnrovs/mineos-market-web/issues'
                            }
                        >
                            <Github />
                            {t('Open an issue')}
                        </Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}
