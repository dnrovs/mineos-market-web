'use client'

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/shadcn/empty'
import { Button } from '@/components/ui/shadcn/button'
import { BadgeQuestionMark, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <BadgeQuestionMark />
                </EmptyMedia>
                <EmptyTitle>Not Found</EmptyTitle>
                <EmptyDescription>
                    This resource does not exist.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className={'flex gap-2'}>
                    <Button onClick={() => history.back()}>
                        <ChevronLeft />
                        Go back
                    </Button>
                    <Button variant={'secondary'} asChild>
                        <Link href={'/'}>Browse publications</Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}
