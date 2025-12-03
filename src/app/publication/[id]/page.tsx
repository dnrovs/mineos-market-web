'use client'

import { notFound, useParams } from 'next/navigation'
import { useMarket } from '@/context/MarketProvider'
import React, { useEffect, useState } from 'react'
import { Publication, Review as ReviewT } from 'mineos-market-client'
import { Spinner } from '@/components/ui/shadcn/spinner'
import Header from '@/components/layout/header'
import RatingsAndReviews from '@/app/publication/[id]/_components/sections/RatingsAndReviews'
import Dependencies from '@/app/publication/[id]/_components/sections/Dependencies'
import Shelf from '@/app/publication/[id]/_components/sections/Shelf'
import PublicationInfo from '@/app/publication/[id]/_components/sections/PublicationInfo'
import WhatsNew from '@/app/publication/[id]/_components/sections/WhatsNew'
import About from '@/app/publication/[id]/_components/sections/About'
import { Separator } from '@/components/ui/shadcn/separator'
import { useExtracted } from 'next-intl'
import useHandleRequestError from '@/hooks/use-handle-request-error'

export default function PublicationPage() {
    const id = Number(useParams<{ id: string }>().id)
    const { client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()

    const [publication, setPublication] = useState<Publication>()
    const [reviews, setReviews] = useState<ReviewT[]>([])

    const [loading, setLoading] = useState(true)

    const updateData = () => {
        client.publications
            .getPublication({ fileId: id })
            .then(setPublication)
            .catch((error) => {
                if (
                    error.message ===
                    `Publication with specified file ID (${id}) doesn't exist`
                ) {
                    return notFound()
                } else {
                    handleRequestError(error, t('while fetching publications'))
                }
            })
            .then(() => setLoading(false))

        client.reviews
            .getReviews({ fileId: id })
            .then(setReviews)
            .catch((error) => {
                handleRequestError(error, t('while fetching reviews'))
            })
    }

    useEffect(() => {
        setLoading(true)

        updateData()
    }, [client.publications, client.reviews, id])

    return (
        <main className="flex h-screen w-full flex-col overflow-auto pb-[env(safe-area-inset-bottom)]">
            <Header />

            {loading ? (
                <Spinner className="mx-auto my-auto size-10" />
            ) : publication ? (
                <div className="mx-auto flex w-full max-w-192 flex-col gap-3 p-3 pt-0 lg:p-4.5 lg:pt-0">
                    <PublicationInfo publication={publication} />
                    <Shelf publication={publication} reviews={reviews} />

                    <Separator />
                    <About publication={publication} />

                    {publication?.whatsNew && (
                        <>
                            <Separator />
                            <WhatsNew publication={publication} />
                        </>
                    )}

                    {publication?.dependenciesData &&
                        Object.values(publication.dependenciesData ?? {}).some(
                            (dep) => dep.publicationName
                        ) && (
                            <>
                                <Separator />
                                <Dependencies publication={publication} />
                            </>
                        )}

                    <Separator />
                    <RatingsAndReviews
                        publication={publication}
                        reviews={reviews}
                        updateData={updateData}
                    />
                </div>
            ) : (
                notFound()
            )}
        </main>
    )
}
