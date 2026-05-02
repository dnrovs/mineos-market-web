import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/shadcn/button'
import { Toggle } from '@/components/ui/shadcn/toggle'
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
    const currentCategory = usePathname()

    return (
        <Toggle
            className={
                'h-17 flex-1 flex-col rounded-none p-2 text-sidebar-foreground transition hover:bg-background/25 hover:text-inherit data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-foreground/90 sm:flex-row'
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
                    'flex w-full overflow-hidden rounded-2xl bg-background/75 backdrop-blur-md'
                }
            >
                {categories.map((category) => (
                    <BottomNavigationButton
                        key={category.enum}
                        href={category.url}
                    >
                        <category.icon className={'size-5'} />
                        <span
                            className={
                                'max-w-full truncate text-center text-xs'
                            }
                        >
                            {category.shortName}
                        </span>
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
