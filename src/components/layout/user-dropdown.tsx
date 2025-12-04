import {
    Globe,
    LaptopMinimal,
    LogIn,
    LogOut,
    Moon,
    Paintbrush,
    Settings,
    Sun,
    UserRoundPlus
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/components/ui/shadcn/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar'
import { useSidebar } from '@/components/ui/shadcn/sidebar'
import { useMarket } from '@/context/MarketProvider'
import Link from 'next/link'
import React from 'react'
import { useTheme } from 'next-themes'
import { useLocale } from '@/hooks/use-locale'
import { locales } from '@/lib/constants'
import { useExtracted } from 'next-intl'
import ProvidedAvatar from '@/components/ui/provided-avatar'

export default function UserDropdown({
    children
}: {
    children: React.ReactNode
}) {
    const { isMobile } = useSidebar()
    const { user, logout } = useMarket()
    const t = useExtracted()
    const { theme, setTheme } = useTheme()
    const { locale, setLocale } = useLocale()

    const themes = [
        {
            name: t('System'),
            value: 'system',
            icon: LaptopMinimal
        },
        {
            name: t('Dark'),
            value: 'dark',
            icon: Moon
        },

        {
            name: t('Light'),
            value: 'light',
            icon: Sun
        }
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
            >
                {user ? (
                    <DropdownMenuItem className="p-0 font-normal" asChild>
                        <Link href={`/user/${user.name}`}>
                            <div className="flex items-center gap-2 p-1.5 text-left text-sm">
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
                            </div>
                        </Link>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href={'/login'}>
                                <LogIn />
                                {t('Login')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={'/register'}>
                                <UserRoundPlus />
                                {t('Register')}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={'/settings'}>
                            <Settings />
                            {t('Settings')}
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Paintbrush />
                            {t('Theme')}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup
                                value={theme}
                                onValueChange={setTheme}
                            >
                                {themes.map((t) => (
                                    <DropdownMenuRadioItem
                                        key={t.value}
                                        value={t.value}
                                    >
                                        <t.icon />
                                        {t.name}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Globe />
                            {t('Language')}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup
                                value={locale}
                                onValueChange={setLocale}
                            >
                                {locales.map((l) => (
                                    <DropdownMenuRadioItem
                                        key={l.code}
                                        value={l.code}
                                    >
                                        {l.name}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                {user && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut />
                            {t('Log out')}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
