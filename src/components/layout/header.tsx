import { Button } from '@/components/ui/shadcn/button'
import { cn } from '@/lib/shadcn/utils'
import { ChevronLeft } from 'lucide-react'
import { useExtracted } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Header({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const t = useExtracted()
    const router = useRouter()

    return (
        <header
            className={cn(
                'top sticky top-0 z-10 flex items-center justify-between bg-background/75 p-3 backdrop-blur-md',
                className
            )}
            {...props}
        >
            <Button variant={'ghost'} onClick={() => router.back()}>
                <ChevronLeft />
                {t('Back')}
            </Button>
        </header>
    )
}
