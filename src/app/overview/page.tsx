'use client'

import WigglyWobbly from '@/app/overview/components/WigglyWobbly'
import { Card } from '@/components/ui/shadcn/card'
import FlatIcon from '../../../public/market.svg'
import { useEffect, useState } from 'react'
import { ApiError, Statistic } from 'mineos-market-client'
import { useMarket } from '@/context/MarketProvider'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/shadcn/spinner'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import { User } from 'lucide-react'
import handleFetchError from '@/hooks/use-handle-request-error'
import { useExtracted } from 'next-intl'
import useHandleRequestError from '@/hooks/use-handle-request-error'

export default function Overview() {
    const { client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()

    const [statistic, setStatistic] = useState<Statistic>()
    const [loading, setLoading] = useState(true)

    const stats = [
        { label: t('Users count'), value: statistic?.usersCount },
        {
            label: t('New user'),
            value: statistic?.lastRegisteredUser,
            username: true
        },
        {
            label: t('Most active'),
            value: statistic?.mostPopularUser,
            username: true
        },
        { label: t('Publications count'), value: statistic?.publicationsCount },
        { label: t('Reviews count'), value: statistic?.reviewsCount },
        { label: t('Messages count'), value: statistic?.messagesCount }
    ]

    useEffect(() => {
        setLoading(true)

        client.statistics
            .getStatistic()
            .then(setStatistic)
            .catch((error) => {
                handleRequestError(error, t('while fetching statistics'))
            })
            .finally(() => setLoading(false))
    }, [client.statistics])

    return (
        <main className={'flex h-full w-full flex-col'}>
            <Header />
            <WigglyWobbly iconUrls={Array(10).fill('/Gay.jpg')}>
                <Card
                    className={
                        'h-5/8 max-h-150 min-h-100 w-full cursor-default flex-col items-center justify-between border-none bg-white/50 backdrop-blur-3xl select-none max-sm:rounded-none max-sm:border-x-0 sm:h-9/12 sm:w-md dark:bg-[#24242480]'
                    }
                >
                    <FlatIcon
                        width={64}
                        height={64}
                        className={'mx-auto'}
                        alt={'Flat icon'}
                    />
                    {loading ? (
                        <Spinner className={'mx-auto my-auto size-10'} />
                    ) : (
                        <div className={'flex w-xs flex-col gap-2'}>
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className={'flex justify-between'}
                                >
                                    <span>{stat.label}:</span>
                                    {stat.username ? (
                                        <Link
                                            href={`/user/${stat.value}`}
                                            className={
                                                'text-muted-foreground flex cursor-pointer items-center gap-1 font-semibold underline-offset-2 hover:underline'
                                            }
                                        >
                                            <User size={16} />
                                            {stat.value}
                                        </Link>
                                    ) : (
                                        <span
                                            className={
                                                'text-muted-foreground font-semibold'
                                            }
                                        >
                                            {stat.value}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <span
                        className={
                            'text-muted-foreground flex flex-col items-center text-xs'
                        }
                        onClick={() =>
                            new Audio('/We Are Charlie Kirk.mp3').play()
                        }
                    >
                        mineos-market-web © dnrovs{' '}
                        {new Date().getFullYear()}{' '}
                    </span>
                </Card>
            </WigglyWobbly>
        </main>
    )
}
