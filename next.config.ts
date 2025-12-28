import { locales } from '@/lib/constants'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
    images: {
        localPatterns: [
            { pathname: '/api/image' },
            { pathname: '/placeholders/**' },
            { pathname: '/wallpapers/**' }
        ]
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack']
        })
        return config
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js'
            }
        }
    },
    experimental: {
        authInterrupts: true
    },
    devIndicators: false
}

const withNextIntl = createNextIntlPlugin({
    experimental: {
        srcPath: './src',
        extract: {
            sourceLocale: 'en'
        },
        messages: {
            path: './messages',
            format: 'po',
            locales: locales.map((l) => l.code)
        }
    }
})

export default withNextIntl(nextConfig)
