'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from '@/components/ui/shadcn/select'
import React from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from '@/components/ui/shadcn/input-group'
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
import { OrderBy, OrderDirection } from 'mineos-market-client'
import { Button } from '@/components/ui/shadcn/button'
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar'
import { useMarket } from '@/context/MarketProvider'
import UserDropdown from '@/components/layout/user-dropdown'
import Link from 'next/link'
import { Badge } from '@/components/ui/shadcn/badge'
import { Separator } from '@/components/ui/shadcn/separator'
import { useUnreadMessages } from '@/utils/use-unread-messages'
import { useExtracted } from 'next-intl'
import { Category } from '@/hooks/use-publication-categories'
import ProvidedAvatar from '@/components/ui/provided-avatar'

interface HeaderProps {
    category: Category

    searchQuery: string
    orderBy: string
    orderDirection: string

    setSearchQuery: (query: string) => void
    setOrderBy: (orderBy: OrderBy) => void
    setOrderDirection: (orderDirection: OrderDirection) => void
}

export default function Header({
    category,
    searchQuery,
    orderBy,
    orderDirection,
    setSearchQuery,
    setOrderBy,
    setOrderDirection
}: HeaderProps) {
    const { user } = useMarket()
    const t = useExtracted()
    const unreadMessages = useUnreadMessages()

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
                <InputGroup className={'w-64 max-lg:flex-1'}>
                    <InputGroupInput
                        placeholder={t('Search...')}
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                        value={searchQuery}
                    />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>

                <Select
                    value={`${orderBy}-${orderDirection}`}
                    onValueChange={(value) => {
                        const [by, dir] = value.split('-') as [
                            OrderBy,
                            OrderDirection
                        ]
                        setOrderBy(by)
                        setOrderDirection(dir)
                    }}
                >
                    <SelectTrigger className={'w-41'}>
                        <SelectValue placeholder={t('Sort by...')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            value={`${OrderBy.Popularity}-${OrderDirection.Descending}`}
                        >
                            <ArrowDownWideNarrow />
                            {t('Most popular')}
                        </SelectItem>
                        <SelectItem
                            value={`${OrderBy.Popularity}-${OrderDirection.Ascending}`}
                        >
                            <ArrowUpWideNarrow />
                            {t('Least popular')}
                        </SelectItem>
                        <SelectSeparator />
                        <SelectItem
                            value={`${OrderBy.Rating}-${OrderDirection.Descending}`}
                        >
                            <ArrowDown10 />
                            {t('Highest rated')}
                        </SelectItem>
                        <SelectItem
                            value={`${OrderBy.Rating}-${OrderDirection.Ascending}`}
                        >
                            <ArrowUp10 />
                            {t('Lowest rated')}
                        </SelectItem>
                        <SelectSeparator />
                        <SelectItem
                            value={`${OrderBy.Date}-${OrderDirection.Descending}`}
                        >
                            <CalendarArrowDown />
                            {t('Newest')}
                        </SelectItem>
                        <SelectItem
                            value={`${OrderBy.Date}-${OrderDirection.Ascending}`}
                        >
                            <CalendarArrowUp />
                            {t('Oldest')}
                        </SelectItem>
                        <SelectSeparator />
                        <SelectItem
                            value={`${OrderBy.Name}-${OrderDirection.Ascending}`}
                        >
                            <ArrowDownAZ />
                            {t('A → Z')}
                        </SelectItem>
                        <SelectItem
                            value={`${OrderBy.Name}-${OrderDirection.Descending}`}
                        >
                            <ArrowUpAZ />
                            {t('Z → A')}
                        </SelectItem>
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
                            <Link href={`/publish?category=${category}`}>
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
