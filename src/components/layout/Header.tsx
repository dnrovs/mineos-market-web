import React from 'react'
import { Button } from '@/components/ui/shadcn/button'
import { ChevronLeft } from 'lucide-react'
import { useExtracted } from 'next-intl'

export default function Header() {
    const t = useExtracted()

    return (
        <header className="top bg-background/75 sticky top-0 z-10 flex items-center justify-between p-3 backdrop-blur-md">
            <Button variant={'ghost'} onClick={() => history.back()}>
                <ChevronLeft />
                {t('Back')}
            </Button>
        </header>
    )
}
