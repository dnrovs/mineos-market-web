import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            allow: '/',
            disallow: [
                '/login',
                '/register',
                '/settings',
                '/publish',
                '/messages/'
            ]
        },
        sitemap: 'https://mineos-market.vercel.app/sitemap.xml'
    }
}
