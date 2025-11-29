import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Toggle } from '@/components/ui/shadcn/toggle'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/shadcn/button'
import { useMarket } from '@/context/MarketProvider'
import { usePublicationCategories } from '@/hooks/use-publication-categories'

interface BottomNavigationButtonProps {
    href: string
    children: React.ReactNode
}

function BottomNavigationButton({
    href,
    children
}: BottomNavigationButtonProps) {
    const pathname = usePathname()
    const [currentCategory, setCurrentCategory] =
        useState<string>('/applications')

    useEffect(() => {
        setCurrentCategory(pathname)
    }, [pathname])

    return (
        <Toggle
            className={
                'text-sidebar-foreground data-[state=on]:text-background data-[state=on]:bg-foreground data-[state=on]:hover:bg-foreground/90 hover:bg-background/25 h-17 flex-1 flex-col rounded-none p-3 transition hover:text-inherit sm:flex-row'
            }
            pressed={currentCategory === href}
            asChild
        >
            <Link href={href}>{children}</Link>
        </Toggle>
    )
}

export default function BottomNavigation() {
    const { user } = useMarket()
    const categories = usePublicationCategories()

    return (
        <div
            className={
                'sticky bottom-3 flex gap-2 px-3 pt-3 pb-[env(safe-area-inset-bottom)] md:hidden'
            }
        >
            <nav
                className={
                    'bg-background/75 flex w-full overflow-hidden rounded-2xl backdrop-blur-md'
                }
            >
                {categories.map((category) => (
                    <BottomNavigationButton
                        key={category.enum}
                        href={category.url}
                    >
                        <category.icon className={'size-5'} />
                        <span className={'text-xs'}>{category.shortName}</span>
                    </BottomNavigationButton>
                ))}
            </nav>
            {user && (
                <Button className={'size-17 rounded-full'} asChild>
                    <Link href={'/publish'}>
                        <Plus className={'size-5'} />
                    </Link>
                </Button>
            )}
        </div>
    )
}
