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
import { ChevronLeft, Construction } from 'lucide-react'
import Link from 'next/link'

export default function underConstruction() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Construction />
                </EmptyMedia>
                <EmptyTitle>Under Construction</EmptyTitle>
                <EmptyDescription>
                    This functionality is not implemented yet.
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
