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
import { UserX } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <UserX />
                </EmptyMedia>
                <EmptyTitle>Unauthorized</EmptyTitle>
                <EmptyDescription>
                    You need to be logged in to access this page.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className={'flex gap-2'}>
                    <Button asChild>
                        <Link href={'/login'}>Login</Link>
                    </Button>
                    <Button variant={'outline'} asChild>
                        <Link href={'/register'}>Register</Link>
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}
