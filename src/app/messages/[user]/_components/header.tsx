import Link from 'next/link'
import React from 'react'
import ProvidedAvatar from '@/components/ui/provided-avatar'
import { Button } from '@/components/ui/shadcn/button'
import { ChevronLeft } from 'lucide-react'
import { useExtracted } from 'next-intl'

export function Header({ userName }: { userName: string }) {
    const t = useExtracted()

    return (
        <div className="lg:bg-sidebar/75 bg-background/75 sticky top-0 z-20 flex w-full justify-between p-3 backdrop-blur-md lg:justify-center">
            <Button variant={'ghost'} className={'lg:hidden'} asChild>
                <Link href={'/messages'}>
                    <ChevronLeft />
                    {t('Messages')}
                </Link>
            </Button>
            <Link
                href={`/user/${userName}`}
                className={
                    'flex w-min flex-row-reverse items-center gap-3 px-1 lg:flex-row'
                }
            >
                <ProvidedAvatar username={userName} className={'size-9'} />
                <span className={'text-lg'}>{userName}</span>
            </Link>
        </div>
    )
}
