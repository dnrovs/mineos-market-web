'use client'

import { Github, User } from 'lucide-react'
import {
    PreviewPublication,
    PublicationCategory,
    Statistic
} from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import WigglyWobbly from '@/app/overview/components/wiggly-wobbly'
import Header from '@/components/layout/header'
import { Card } from '@/components/ui/shadcn/card'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { useMarket } from '@/context/MarketProvider'
import useHandleRequestError from '@/hooks/use-handle-request-error'

import { useHover } from '@uidotdev/usehooks'
import FlatIcon from '../../../public/market.svg'

export default function Overview() {
    const { client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()

    const [statistic, setStatistic] = useState<Statistic>()
    const [popularApplications, setPopularApplications] = useState<
        PreviewPublication[]
    >([])

    const [loading, setLoading] = useState(true)

    const [githubLabelRef, githubLabelHovering] = useHover()

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

        client.publications
            .getPublications({
                category: PublicationCategory.Applications
            })
            .then(setPopularApplications)
            .catch((error) =>
                handleRequestError(
                    error,
                    t('while fetching popular applications')
                )
            )
            .finally(() => setLoading(false))
    }, [client.statistics])

    const gitCommitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
    const gitCommitAuthorLogin =
        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN
    const gitCommitMessage = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE

    const isGitDataPresent =
        gitCommitSha && gitCommitAuthorLogin && gitCommitMessage

    return (
        <main className={'flex h-full w-full flex-col'}>
            <Header />
            <WigglyWobbly
                publications={popularApplications
                    .filter(
                        (
                            pub
                        ): pub is PreviewPublication & { iconUrl: string } =>
                            typeof pub.iconUrl === 'string'
                    )
                    .slice(0, 10)}
            >
                <Card
                    className={
                        'h-5/8 max-h-150 min-h-100 w-full cursor-default flex-col items-center justify-between truncate border-none bg-white/50 p-6 backdrop-blur-3xl select-none max-sm:rounded-none max-sm:border-x-0 sm:h-9/12 sm:w-md dark:bg-[#24242480]'
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
                    <Link
                        href={'https://github.com/dnrovs/mineos-market-web'}
                        target={'_blank'}
                        ref={githubLabelRef}
                        className={
                            'text-muted-foreground hover:text-foreground flex w-full justify-center gap-1 truncate text-xs transition'
                        }
                    >
                        <Github className={'size-4 fill-current'} />

                        {isGitDataPresent && !githubLabelHovering ? (
                            <span className={'truncate'}>
                                {t.rich(
                                    'Build <b>{hash}</b> by {author}: {message}',
                                    {
                                        b: (chunks) => (
                                            <span className={'font-semibold'}>
                                                {chunks}
                                            </span>
                                        ),
                                        hash: gitCommitSha.slice(0, 7),
                                        author: gitCommitAuthorLogin,
                                        message: gitCommitMessage
                                    }
                                )}
                            </span>
                        ) : (
                            <span>
                                mineos-market-web © dnrovs{' '}
                                {new Date().getFullYear()}
                            </span>
                        )}
                    </Link>
                </Card>
            </WigglyWobbly>
        </main>
    )
}
