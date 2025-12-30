import { chatWallpapers } from '@/lib/constants'
import { DeepPartial } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import { z } from 'zod'
import { init } from 'zod-empty'

const configSchema = z.object({
    server: z.object({
        hostUrl: z.string().default('http://mineos.buttex.ru/MineOSAPI/2.04/'),
        proxyUrl: z.string().default('/api/proxy?url='),
        validateResponses: z.boolean().default(true)
    }),
    appearance: z.object({
        chatWallpaperDark: z.string().default(chatWallpapers.dark[0]),
        chatWallpaperLight: z.string().default(chatWallpapers.light[0]),
        useAvatarImages: z.boolean().default(true),
        avatarProvider: z.string().default('https://tapback.co/api/avatar/'),
        showAnimatedPublicationBackgrounds: z.boolean().default(true),
        showPublicationIcons: z.boolean().default(true),
        showPublicationPreviews: z.boolean().default(true)
    }),
    behaviour: z.object({
        dialogsUpdateInterval: z.number().default(10),
        chatUpdateInterval: z.number().default(5)
    })
})

const defaultConfig = init(configSchema)

export type Config = z.infer<typeof configSchema>

export function useConfig() {
    const [savedConfig, setSavedConfig, removeSavedConfig] =
        useLocalStorage<Config>('config', defaultConfig)

    let config
    try {
        config = configSchema.parse(savedConfig)
    } catch (e) {
        config = defaultConfig
    }

    const setConfig = (newConfig: DeepPartial<Config>) => {
        return setSavedConfig({ ...config, ...newConfig } as Config)
    }

    const resetConfig = () => {
        return removeSavedConfig()
    }

    return { config, setConfig, resetConfig }
}
