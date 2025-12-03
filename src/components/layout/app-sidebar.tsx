'use client'

import { ChevronsUpDown, House, MessageCircle, UserRound } from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from '@/components/ui/shadcn/sidebar'
import Link from 'next/link'
import { useMarket } from '@/context/MarketProvider'
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar'
import UserDropdown from '@/components/layout/user-dropdown'
import React from 'react'
import { Badge } from '@/components/ui/shadcn/badge'
import { useUnreadMessages } from '@/utils/use-unread-messages'
import { usePublicationCategories } from '@/hooks/use-publication-categories'
import { useExtracted } from 'next-intl'
import ProvidedAvatar from '@/components/ui/provided-avatar'

export default function AppSidebar() {
    const { user } = useMarket()

    const t = useExtracted()

    const currentPath = usePathname()
    const unreadMessages = useUnreadMessages()
    const categories = usePublicationCategories()

    return (
        <Sidebar className={'z-20'} collapsible={'icon'}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {categories.map((category) => (
                                <SidebarMenuItem key={category.enum}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={currentPath.startsWith(
                                            category.url
                                        )}
                                        className={'h-10'}
                                    >
                                        <Link href={category.url}>
                                            <category.icon />
                                            <span>{category.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={currentPath.startsWith('/overview')}
                        >
                            <Link href={'/overview'}>
                                <House />
                                {t('Overview')}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {user && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={currentPath.startsWith('/messages')}
                            >
                                <Link href={'/messages'}>
                                    <div className={'relative size-4'}>
                                        {unreadMessages > 0 && (
                                            <Badge
                                                className={
                                                    'absolute -top-1 -right-1 h-3.5 min-w-3.5 rounded-full p-0 px-0.5'
                                                }
                                            >
                                                {unreadMessages < 100
                                                    ? unreadMessages
                                                    : '+'}
                                            </Badge>
                                        )}
                                        <MessageCircle className={'size-4'} />
                                    </div>
                                    {t('Messages')}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <UserDropdown>
                            {user ? (
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <ProvidedAvatar
                                        username={user.name}
                                        className="size-8"
                                    />
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {user.name}
                                        </span>
                                        <span className="text-muted-foreground truncate text-xs">
                                            {user.email}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton>
                                    <UserRound />
                                    {t('Account')}
                                </SidebarMenuButton>
                            )}
                        </UserDropdown>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
