'use client'

import { useMarket } from '@/context/MarketProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function useRequireUser() {
    const { user } = useMarket()
    const router = useRouter()

    useEffect(() => {
        if (!user) router.push('/login')
    }, [])
}
