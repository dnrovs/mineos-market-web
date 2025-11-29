import { Config } from '@/hooks/use-config'
import { License } from 'mineos-market-client'

export const locales = [
    { code: 'en', name: 'English' },
    { code: 'uk', name: 'Українська' },
    { code: 'ru', name: 'Русский' }
] as const

export const defaultConfig: Config = {
    server: {
        hostUrl: 'http://mineos.buttex.ru/MineOSAPI/2.04/',
        proxyUrl: '/api/proxy?url='
    },
    behaviour: {
        useAvatarImages: true,
        avatarProvider: 'https://tapback.co/api/avatar/',
        dialogsUpdateInterval: 10,
        chatUpdateInterval: 5
    }
} as const

export const licenses = [
    { enum: License.MIT, name: 'MIT', shortName: 'MIT' },
    {
        enum: License.GPL3,
        name: 'GNU GPL v3.0',
        shortName: 'GPL 3'
    },
    {
        enum: License.AGPL3,
        name: 'GNU AGPL v3.0',
        shortName: 'AGPL 3'
    },
    {
        enum: License.LGPL3,
        name: 'GNU LGPL v3.0',
        shortName: 'LGPL 3'
    },
    {
        enum: License.ApacheLicense2,
        name: 'Apache License 2.0',
        shortName: 'Apache 2.0'
    },
    {
        enum: License.MPL2,
        name: 'Mozilla Public License 2.0',
        shortName: 'MPL 2.0'
    },
    {
        enum: License.TheUnlicense,
        name: 'The Unlicense',
        shortName: 'Unlicense'
    }
] as const
