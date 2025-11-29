import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { defaultConfig } from '@/lib/constants'
import { useExtracted } from 'next-intl'

export interface Config {
    server: {
        hostUrl: string
        proxyUrl: string
    }
    behaviour: {
        useAvatarImages: boolean
        avatarProvider: string
        dialogsUpdateInterval: number
        chatUpdateInterval: number
    }
}

export function useConfig() {
    const t = useExtracted()

    const [config, setConfigState] = useState<Config>(() => {
        try {
            const saved = localStorage.getItem('config')
            return saved ? JSON.parse(saved) : defaultConfig
        } catch {
            return defaultConfig
        }
    })

    const [pendingToast, setPendingToast] = useState<{
        type: 'success' | 'error'
        message: string
    } | null>(null)

    useEffect(() => {
        try {
            localStorage.setItem('config', JSON.stringify(config))
            console.log(config)
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error)
            toast.error(
                t('Failed to update configuration: {message}', { message })
            )
        }
    }, [config, t])

    useEffect(() => {
        if (pendingToast) {
            if (pendingToast.type === 'success') {
                toast.success(pendingToast.message)
            } else {
                toast.error(pendingToast.message)
            }
            setPendingToast(null)
        }
    }, [pendingToast])

    const setConfig = (value: Partial<Config>, silent = false) => {
        setConfigState((prev) => ({ ...prev, ...value }))

        if (!silent) {
            setPendingToast({
                type: 'success',
                message: t('Configuration saved successfully')
            })
        }
    }

    const resetConfig = (category?: keyof Config, silent = false) => {
        setConfig(
            category ? { [category]: defaultConfig[category] } : defaultConfig,
            silent
        )
    }

    return { config, setConfig, resetConfig } as const
}
