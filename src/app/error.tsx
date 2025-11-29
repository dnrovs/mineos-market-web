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
import { Github, OctagonAlert } from 'lucide-react'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <OctagonAlert />
                </EmptyMedia>
                <EmptyTitle>Unexpected Error</EmptyTitle>
                <EmptyDescription>{String(error)}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className={'flex gap-2'}>
                    <Button onClick={() => reset()}>Try again</Button>
                    <Button variant={'secondary'} asChild>
                        <Link
                            href={
                                'https://github.com/fesuk/mineos-market/issues'
                            }
                        >
                            <Github />
                            Open an issue
                        </Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}
