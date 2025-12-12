'use client'

import { HeartCrack } from 'lucide-react'
import {
    OrderBy,
    OrderDirection,
    PreviewPublication
} from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import { notFound, useParams } from 'next/navigation'
import {
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
    useQueryState
} from 'nuqs'
import { useEffect, useState } from 'react'

import BottomNavigation from '@/app/[category]/_components/bottom-navigation'
import Footer from '@/app/[category]/_components/footer'
import Header from '@/app/[category]/_components/header'
import Publications from '@/components/layout/publications'
import { Button } from '@/components/ui/shadcn/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/shadcn/empty'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { useMarket } from '@/context/MarketProvider'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { usePublicationCategories } from '@/hooks/use-publication-categories'

const sortingValues = {
    'most-popular': {
        orderBy: OrderBy.Popularity,
        orderDirection: OrderDirection.Descending
    },
    'least-popular': {
        orderBy: OrderBy.Popularity,
        orderDirection: OrderDirection.Ascending
    },
    'highest-rated': {
        orderBy: OrderBy.Rating,
        orderDirection: OrderDirection.Descending
    },
    'lowest-rated': {
        orderBy: OrderBy.Rating,
        orderDirection: OrderDirection.Ascending
    },
    newest: {
        orderBy: OrderBy.Date,
        orderDirection: OrderDirection.Descending
    },
    oldest: {
        orderBy: OrderBy.Date,
        orderDirection: OrderDirection.Ascending
    },
    'a-z': {
        orderBy: OrderBy.Name,
        orderDirection: OrderDirection.Ascending
    },
    'z-a': {
        orderBy: OrderBy.Name,
        orderDirection: OrderDirection.Descending
    }
} as const

export type Sorting = keyof typeof sortingValues

export default function Page() {
    const categoryName = useParams<{ category: string }>().category

    const categories = usePublicationCategories()
    const category = categories.find((c) => c.url.endsWith(categoryName))

    const t = useExtracted()

    const { client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const [publications, setPublications] = useState<PreviewPublication[]>([])

    const [currentPage, setCurrentPage] = useQueryState(
        'page',
        parseAsInteger.withDefault(1)
    )
    const [showPerPage, setShowPerPage] = useQueryState(
        'per-page',
        parseAsInteger.withDefault(25)
    )
    const [isNextPage, setIsNextPage] = useState(false)

    const [searchQuery, setSearchQuery] = useQueryState(
        'search',
        parseAsString.withDefault('')
    )
    const [sorting, setSorting] = useQueryState(
        'sort',
        parseAsStringLiteral(
            Object.keys(sortingValues) as Sorting[]
        ).withDefault('most-popular')
    )

    const [loading, setLoading] = useState(true)

    if (!category) notFound()

    useEffect(() => {
        setLoading(true)

        client.publications
            .getPublications({
                category: category.enum,
                count: showPerPage + 1,
                offset: showPerPage * (currentPage - 1),
                search: searchQuery,
                orderBy: sortingValues[sorting].orderBy,
                orderDirection: sortingValues[sorting].orderDirection
            })
            .then((data) => {
                setIsNextPage(data.length === showPerPage + 1)
                setPublications(data.slice(0, showPerPage))
            })
            .catch((error) => {
                handleRequestError(error, t('while fetching publications'))
            })
            .finally(() => setLoading(false))
    }, [category.enum, client, currentPage, searchQuery, showPerPage, sorting])

    return (
        <main className="flex h-dvh w-full flex-col overflow-y-scroll">
            <Header
                category={category}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sorting={sorting}
                setSorting={setSorting}
            />

            {loading ? (
                <Spinner className={'mx-auto my-auto size-10'} />
            ) : publications.length > 0 ? (
                <>
                    <Publications
                        publications={publications}
                        className={'px-3'}
                    />

                    <Footer
                        isNextPage={isNextPage}
                        currentPage={currentPage}
                        showPerPage={showPerPage}
                        setCurrentPage={setCurrentPage}
                        setShowPerPage={(value: number) => {
                            setShowPerPage(value)
                            setCurrentPage(1)
                        }}
                    />
                </>
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <HeartCrack />
                        </EmptyMedia>
                        <EmptyTitle>{t('No publications found')}</EmptyTitle>
                        <EmptyDescription>
                            {searchQuery
                                ? t(
                                      'No publication satisfies your search criteria.'
                                  )
                                : t(
                                      'Looks like there are no publications in this category.'
                                  )}
                        </EmptyDescription>
                    </EmptyHeader>
                    {searchQuery && (
                        <EmptyContent>
                            <Button
                                variant={'outline'}
                                onClick={() => setSearchQuery('')}
                            >
                                {t('Clear search')}
                            </Button>
                        </EmptyContent>
                    )}
                </Empty>
            )}

            <BottomNavigation />
        </main>
    )
}
