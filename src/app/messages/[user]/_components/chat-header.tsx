import { ChevronLeft } from 'lucide-react'
import { useExtracted } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import ProvidedAvatar from '@/components/ui/provided-avatar'
import { Button } from '@/components/ui/shadcn/button'

export function ChatHeader({ userName }: { userName: string }) {
    const t = useExtracted()
    const router = useRouter()

    return (
        <header className="lg:bg-sidebar/75 bg-background/75 sticky top-0 z-20 flex w-full justify-between p-3 backdrop-blur-md lg:justify-center">
            <Button
                variant={'ghost'}
                className={'lg:hidden'}
                onClick={() => router.back()}
            >
                <ChevronLeft />
                {t('Back')}
            </Button>
            <Link
                href={`/user/${userName}`}
                className={
                    'flex w-min flex-row-reverse items-center gap-3 px-1 text-lg lg:flex-row'
                }
            >
                <ProvidedAvatar username={userName} className={'size-9'} />

                {userName}
            </Link>
        </header>
    )
}
