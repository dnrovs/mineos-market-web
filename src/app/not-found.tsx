'use client'

import { BadgeQuestionMark, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

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

export default function NotFound() {
    const t = useExtracted()

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <BadgeQuestionMark />
                </EmptyMedia>
                <EmptyTitle>{t('Not Found')}</EmptyTitle>
                <EmptyDescription>
                    {t('This resource does not exist.')}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className={'flex gap-2'}>
                    <Button onClick={() => history.back()}>
                        <ChevronLeft />
                        {t('Go back')}
                    </Button>
                    <Button variant={'secondary'} asChild>
                        <Link href={'/'}>{t('Browse publications')}</Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}
