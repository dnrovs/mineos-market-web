import React from 'react'
import { Button } from '@/components/ui/shadcn/button'
import { ChevronLeft } from 'lucide-react'
import { useExtracted } from 'next-intl'
import { cn } from '@/utils/shadcn'
import { useRouter } from 'next/navigation'

export default function Header({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const t = useExtracted()
    const router = useRouter()

    return (
        <header
            className={cn(
                'top bg-background/75 sticky top-0 z-10 flex items-center justify-between p-3 backdrop-blur-md',
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
