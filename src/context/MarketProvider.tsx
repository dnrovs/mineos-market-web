'use client'

import React, {
    createContext,
    useContext,
    useMemo,
    useState,
    useEffect,
    ReactNode
} from 'react'
import {
    LoginParams,
    MarketClient,
    UserCredentials
} from 'mineos-market-client'
import { useConfig } from '@/hooks/use-config'

interface MarketContextValue {
    client: MarketClient
    user: UserCredentials | null
    login: (params: LoginParams) => Promise<UserCredentials>
    logout: () => void
}

interface MarketProviderProps {
    children: ReactNode
}

const MarketContext = createContext<MarketContextValue | undefined>(undefined)

export const useMarket = () => {
    const context = useContext(MarketContext)
    if (!context) {
        throw new Error('useMarket must be used within a MarketProvider')
    }
    return context
}

const STORAGE_KEY = 'user'

const getStoredUser = (): UserCredentials | null => {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

const setStoredUser = (user: UserCredentials | null): void => {
    if (typeof window === 'undefined') return
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
}

export const MarketProvider: React.FC<MarketProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserCredentials | null>(null)
    const [isHydrated, setIsHydrated] = useState(false)

    const { config } = useConfig()

    useEffect(() => {
        const stored = getStoredUser()
        if (stored) setUser(stored)
        setIsHydrated(true)
    }, [])

    const client = useMemo(() => {
        const client = new MarketClient({
            hostUrl: config.server.hostUrl,
            proxyUrl: config.server.proxyUrl
        })
        if (user?.token) client.useToken(user.token)
        return client
    }, [config.server.hostUrl, config.server.proxyUrl, user])

    const login = async (params: LoginParams): Promise<UserCredentials> => {
        const loginParams = params.userName
            ? { userName: params.userName, password: params.password }
            : { email: params.email!, password: params.password }

        const userData = await client.login(loginParams)
        setUser(userData)
        setStoredUser(userData)
        return userData
    }

    const logout = () => {
        client.logout()
        setUser(null)
        setStoredUser(null)
    }

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setUser(e.newValue ? JSON.parse(e.newValue) : null)
            }
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    if (!isHydrated) return null

    const value: MarketContextValue = {
        client,
        user,
        login,
        logout
    }

    return (
        <MarketContext.Provider value={value}>
            {children}
        </MarketContext.Provider>
    )
}
