import { MarketClient } from 'mineos-market-client'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const map: MetadataRoute.Sitemap = [
        {
            url: 'https://mineos-market.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        },
        {
            url: 'https://mineos-market.vercel.app/overview',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9
        }
    ]

    const client = new MarketClient()

    const count = 100

    for (let offset = 0; ; offset += count) {
        try {
            const response = await client.publications.getPublications({
                offset,
                count
            })

            response.forEach((publication) =>
                map.push({
                    url: `https://mineos-market.vercel.app/publication/${publication.fileId}`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 0.8
                })
            )

            if (response.length < count) break
        } catch (error) {
            console.error('Fetching publications for sitemap failed:', {
                error
            })

            break
        }
    }

    return map
}
