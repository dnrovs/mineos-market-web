import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar'
import React from 'react'
import ProvidedAvatar from '@/components/ui/provided-avatar'

export function Header({ userName }: { userName: string }) {
    return (
        <div className="lg:bg-sidebar/75 pointer-events-none fixed top-0 z-20 flex w-full justify-end p-3 lg:sticky lg:justify-center lg:backdrop-blur-md">
            <Link
                href={`/user/${userName}`}
                className={
                    'pointer-events-auto flex w-min flex-row-reverse items-center gap-3 lg:flex-row'
                }
            >
                <ProvidedAvatar username={userName} className={'size-9'} />
                <span className={'font-medium'}>{userName}</span>
            </Link>
        </div>
    )
}
