import React from 'react'
import { PublicationCategory } from 'mineos-market-client'
import {
    AppWindowMac,
    FileTerminal,
    SquareLibrary,
    Wallpaper
} from 'lucide-react'
import { useExtracted } from 'next-intl'

export interface Category {
    name: string
    shortName: string
    url: string
    icon: React.ElementType
    enum: PublicationCategory
}

export function usePublicationCategories(): Category[] {
    const t = useExtracted()

    return [
        {
            name: t('Applications'),
            shortName: t('Apps'),
            url: '/applications',
            icon: AppWindowMac,
            enum: PublicationCategory.Applications
        },
        {
            name: t('Libraries'),
            shortName: t('Libs'),
            url: '/libraries',
            icon: SquareLibrary,
            enum: PublicationCategory.Libraries
        },
        {
            name: t('Scripts'),
            shortName: t('Scripts'),
            url: '/scripts',
            icon: FileTerminal,
            enum: PublicationCategory.Scripts
        },
        {
            name: t('Wallpapers'),
            shortName: t('Walls'),
            url: '/wallpapers',
            icon: Wallpaper,
            enum: PublicationCategory.Wallpapers
        }
    ]
}
