import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MineOS Market',
        short_name: 'MineOS',
        description:
            'Explore, upload and share MineOS software. View the source code. Communicate with developers. Everything in your browser.',
        start_url: '/applications',
        id: '/applications',
        display: 'standalone',
        categories: ['games', 'utilities'],
        theme_color: '#171717',
        background_color: '#ffffff',
        icons: [
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png'
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
        ],
        shortcuts: [
            {
                name: 'Overview',
                icons: [{ src: '/icons/house.svg', sizes: '24x24' }],
                url: '/overview',
                description: 'View the market statistics'
            },
            {
                name: 'Messages',
                icons: [{ src: '/icons/message-circle.svg', sizes: '24x24' }],
                url: '/messages',
                description: 'Communicate with another developers'
            },
            {
                name: 'Publish',
                icons: [{ src: '/icons/plus.svg', sizes: '24x24' }],
                url: '/publish',
                description: 'Upload your own software'
            }
        ]
    }
}
