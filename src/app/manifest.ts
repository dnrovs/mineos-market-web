import { MetadataRoute } from 'next'
import { getExtracted } from 'next-intl/server'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const t = await getExtracted()

    return {
        name: 'MineOS Market',
        description: t(
            'Explore, upload and share MineOS software. View the source code. Communicate with developers.'
        ),
        categories: ['games', 'utilities'],
        theme_color: '#171717',
        background_color: '#ffffff',
        start_url: '/applications',
        id: '/applications',
        display: 'standalone',
        icons: [
            {
                src: 'icons/icon.png',
                sizes: '1024x1024',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/icons/maskable.png',
                sizes: '1024x1024',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icons/monochrome.png',
                sizes: '512x512',
                purpose: 'monochrome'
            }
        ],
        screenshots: [
            {
                src: '/screenshots/wide/publications.png',
                form_factor: 'wide'
            },
            {
                src: '/screenshots/narrow/publications.png',
                form_factor: 'narrow'
            },
            {
                src: '/screenshots/wide/overview.png',
                form_factor: 'wide'
            },
            {
                src: '/screenshots/narrow/overview.png',
                form_factor: 'narrow'
            },
            {
                src: '/screenshots/wide/messages.png',
                form_factor: 'wide'
            },
            {
                src: '/screenshots/narrow/messages.png',
                form_factor: 'narrow'
            }
        ]
    }
}
