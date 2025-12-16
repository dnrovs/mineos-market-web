import { defaultConfig } from '@/lib/constants'
import { DeepPartial } from 'react-hook-form'
import { useLocalStorage } from 'usehooks-ts'

export interface Config {
    server: {
        hostUrl: string
        proxyUrl: string
        validateResponses: boolean
    }
    behaviour: {
        useAvatarImages: boolean
        avatarProvider: string
        dialogsUpdateInterval: number
        chatUpdateInterval: number
    }
}

export function useConfig() {
    const [savedConfig, setSavedConfig, removeSavedConfig] =
        useLocalStorage<Config>('config', defaultConfig)

    const config = { ...defaultConfig, ...savedConfig }

    const setConfig = (newConfig: DeepPartial<Config>) => {
        return setSavedConfig({ ...config, ...newConfig } as Config)
    }

    const resetConfig = () => {
        return removeSavedConfig()
    }

    return { config, setConfig, resetConfig }
}
