'use client'

import React, { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'

import {
    OrderBy,
    OrderDirection,
    PreviewPublication
} from 'mineos-market-client'
import { useMarket } from '@/context/MarketProvider'

import Header from '@/app/[category]/_components/Header'
import Footer from '@/app/[category]/_components/Footer'
import { Spinner } from '@/components/ui/shadcn/spinner'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/shadcn/empty'
import { HeartCrack, TestTubeDiagonal } from 'lucide-react'
import { Button } from '@/components/ui/shadcn/button'
import BottomNavigation from '@/app/[category]/_components/BottomNavigation'
import Publications from '@/components/layout/Publications'
import { useExtracted } from 'next-intl'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { usePublicationCategories } from '@/hooks/use-publication-categories'
import { toast } from 'sonner'

export default function Page() {
    const categoryName = useParams<{ category: string }>().category
    const categories = usePublicationCategories()

    const category = categories.find((c) => c.url.endsWith(categoryName))

    const t = useExtracted()

    const { client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const [publications, setPublications] = useState<PreviewPublication[]>([])

    const [currentPage, setCurrentPage] = useState(1)
    const [showPerPage, setShowPerPage] = useState('25')
    const [isNextPage, setIsNextPage] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')
    const [orderBy, setOrderBy] = useState<string>(OrderBy.Popularity)
    const [orderDirection, setOrderDirection] = useState<string>(
        OrderDirection.Descending
    )

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setCurrentPage(1)
    }, [showPerPage])

    useEffect(() => {
        if (!category) notFound()

        setLoading(true)

        client.publications
            .getPublications({
                category: category.enum,
                count: Number(showPerPage) + 1,
                offset: Number(showPerPage) * (currentPage - 1),
                search: searchQuery,
                orderBy: orderBy as OrderBy,
                orderDirection: orderDirection as OrderDirection
            })
            .then((data) => {
                setIsNextPage(data.length === Number(showPerPage) + 1)
                setPublications(data.slice(0, Number(showPerPage)))
            })
            .catch((error) => {
                handleRequestError(error, t('while fetching publications'))
            })
            .finally(() => setLoading(false))
    }, [
        category?.enum,
        client,
        currentPage,
        orderBy,
        orderDirection,
        searchQuery,
        showPerPage
    ])

    return (
        <main className="flex h-dvh w-full flex-col overflow-auto">
            <Header
                category={category!}
                searchQuery={searchQuery}
                orderBy={orderBy}
                orderDirection={orderDirection}
                setSearchQuery={setSearchQuery}
                setOrderBy={setOrderBy}
                setOrderDirection={setOrderDirection}
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
                        setShowPerPage={setShowPerPage}
                    />
                </>
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <HeartCrack />
                        </EmptyMedia>
                        <EmptyTitle>{t('Nothing found')}</EmptyTitle>
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
