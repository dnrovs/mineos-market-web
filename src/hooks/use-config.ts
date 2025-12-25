import { defaultConfig } from '@/lib/constants'
import { DeepPartial } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'
import { z } from 'zod'

const configSchema = z.object({
    server: z.object({
        hostUrl: z.string(),
        proxyUrl: z.string(),
        validateResponses: z.boolean()
    }),
    appearance: z.object({
        chatWallpaperDark: z.string(),
        chatWallpaperLight: z.string(),
        useAvatarImages: z.boolean(),
        avatarProvider: z.string()
    }),
    behaviour: z.object({
        dialogsUpdateInterval: z.number(),
        chatUpdateInterval: z.number()
    })
})

export type Config = z.infer<typeof configSchema>

export function useConfig() {
    const [savedConfig, setSavedConfig, removeSavedConfig] =
        useLocalStorage<Config>('config', defaultConfig)

    let parsedConfig
    try {
        parsedConfig = configSchema.parse(savedConfig)
    } catch {
        parsedConfig = defaultConfig
    }

    const config = { ...defaultConfig, ...parsedConfig }

    const setConfig = (newConfig: DeepPartial<Config>) => {
        return setSavedConfig({ ...config, ...newConfig } as Config)
    }

    const resetConfig = () => {
        return removeSavedConfig()
    }

    return { config, setConfig, resetConfig }
}
