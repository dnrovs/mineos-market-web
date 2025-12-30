'use client'

import {
    ArrowDown10,
    ArrowDownAZ,
    ArrowDownWideNarrow,
    ArrowUp10,
    ArrowUpAZ,
    ArrowUpWideNarrow,
    CalendarArrowDown,
    CalendarArrowUp,
    House,
    MessageCircle,
    Plus,
    SearchIcon,
    UserRound
} from 'lucide-react'
import { useExtracted } from 'next-intl'
import Link from 'next/link'
import React from 'react'

import { Sorting } from '@/app/[category]/page'
import UserDropdown from '@/components/layout/user-dropdown'
import ProvidedAvatar from '@/components/ui/provided-avatar'
import { Badge } from '@/components/ui/shadcn/badge'
import { Button } from '@/components/ui/shadcn/button'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from '@/components/ui/shadcn/input-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from '@/components/ui/shadcn/select'
import { Separator } from '@/components/ui/shadcn/separator'
import { useMarket } from '@/context/MarketProvider'
import { Category } from '@/hooks/use-publication-categories'
import { useUnreadMessages } from '@/hooks/use-unread-messages'

interface HeaderProps {
    category: Category

    searchQuery: string
    setSearchQuery: (query: string) => void

    sorting: Sorting
    setSorting: (sorting: Sorting) => void
}

export default function Header({
    category,
    searchQuery,
    setSearchQuery,
    sorting,
    setSorting
}: HeaderProps) {
    const { user } = useMarket()
    const t = useExtracted()
    const unreadMessages = useUnreadMessages()

    const sortingVariants = [
        {
            name: t('Most popular'),
            value: 'most-popular',
            icon: ArrowDownWideNarrow
        },
        {
            name: t('Least popular'),
            value: 'least-popular',
            icon: ArrowUpWideNarrow
        },
        {
            name: t('Highest rated'),
            value: 'highest-rated',
            icon: ArrowDown10
        },
        {
            name: t('Lowest rated'),
            value: 'lowest-rated',
            icon: ArrowUp10
        },
        {
            name: t('Newest'),
            value: 'newest',
            icon: CalendarArrowDown
        },
        {
            name: t('Oldest'),
            value: 'oldest',
            icon: CalendarArrowUp
        },
        {
            name: t('A → Z'),
            value: 'a-z',
            icon: ArrowDownAZ
        },
        {
            name: t('Z → A'),
            value: 'z-a',
            icon: ArrowUpAZ
        }
    ]

    return (
        <header className="bg-background/75 sticky top-0 flex w-full items-center justify-between px-3 py-3 backdrop-blur-md max-lg:flex-col max-lg:items-start max-lg:gap-2.5">
            <div className={'flex w-full justify-between'}>
                <h1 className="text-3xl font-semibold max-lg:text-left">
                    {category.name}
                </h1>
                <div className={'flex gap-2 md:hidden'}>
                    <Button
                        size={'icon'}
                        className={'rounded-full'}
                        variant={'secondary'}
                        asChild
                    >
                        <Link href={'/overview'}>
                            <House />
                        </Link>
                    </Button>
                    {user ? (
                        <>
                            <Button
                                size={'icon'}
                                className={'rounded-full'}
                                variant={'secondary'}
                                asChild
                            >
                                <Link href={'/messages'} className={'relative'}>
                                    {unreadMessages > 0 && (
                                        <Badge
                                            className={
                                                'absolute -top-1 -right-1 min-w-5.5 rounded-full px-1'
                                            }
                                        >
                                            {unreadMessages < 100
                                                ? unreadMessages
                                                : '+'}
                                        </Badge>
                                    )}
                                    <MessageCircle />
                                </Link>
                            </Button>
                            <UserDropdown>
                                <ProvidedAvatar
                                    username={user.name}
                                    className={'size-9 cursor-pointer'}
                                />
                            </UserDropdown>
                        </>
                    ) : (
                        <UserDropdown>
                            <Button className={'rounded-full'} asChild>
                                <Link href={'/login'}>
                                    <UserRound />
                                    {t('Account')}
                                </Link>
                            </Button>
                        </UserDropdown>
                    )}
                </div>
            </div>
            <div className={'flex w-full items-center justify-end gap-1'}>
                <InputGroup className={'w-75 min-w-40 max-lg:flex-1'}>
                    <InputGroupInput
                        placeholder={t('Search...')}
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                        value={searchQuery}
                    />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>

                <Select value={sorting} onValueChange={setSorting}>
                    <SelectTrigger className={'w-1/2 min-w-45 sm:w-45'}>
                        <SelectValue placeholder={t('Sort by...')} />
                    </SelectTrigger>
                    <SelectContent>
                        {sortingVariants.map((variant, index) => (
                            <React.Fragment key={variant.value}>
                                <SelectItem value={variant.value}>
                                    <variant.icon />
                                    <span className={'truncate'}>
                                        {variant.name}
                                    </span>
                                </SelectItem>

                                {(index + 1) % 2 === 0 &&
                                    index !== sortingVariants.length - 1 && (
                                        <SelectSeparator />
                                    )}
                            </React.Fragment>
                        ))}
                    </SelectContent>
                </Select>

                {user && (
                    <>
                        <Separator
                            orientation={'vertical'}
                            className={'bg-input mx-1 hidden h-9! md:flex'}
                        />
                        <Button
                            className={'hidden size-9 md:flex xl:size-auto'}
                            asChild
                        >
                            <Link
                                href={`/publish?category=${category.url.slice(1)}`}
                            >
                                <Plus />
                                <span className={'hidden xl:block'}>
                                    {t('Publish {category}...', {
                                        category: category.name.toLowerCase()
                                    })}
                                </span>
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    )
}
