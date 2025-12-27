'use client'

import { FileType, Publication, Review as ReviewT } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import Screenshots from '@/app/publication/[id]/_components/previews'
import PublicationInfo from '@/app/publication/[id]/_components/publication-info'
import About from '@/app/publication/[id]/_components/sections/about'
import Dependencies from '@/app/publication/[id]/_components/sections/dependencies'
import RatingsAndReviews from '@/app/publication/[id]/_components/sections/ratings-and-reviews'
import WhatsNew from '@/app/publication/[id]/_components/sections/whats-new'
import Shelf from '@/app/publication/[id]/_components/shelf'
import Header from '@/components/layout/header'
import { Separator } from '@/components/ui/shadcn/separator'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { useMarket } from '@/context/MarketProvider'
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
        <main className="relative flex h-screen w-full flex-col overflow-auto pb-[env(safe-area-inset-bottom)]">
            <Header />

            {loading ? (
                <Spinner className="mx-auto my-auto size-10" />
            ) : publication ? (
                <div className="mx-auto flex w-full flex-col items-center">
                    <PublicationInfo publication={publication} />

                    <div className={'flex w-full max-w-3xl flex-col gap-3 p-3'}>
                        <Shelf publication={publication} reviews={reviews} />

                        {publication.dependenciesData &&
                            !!Object.values(
                                publication.dependenciesData
                            ).filter(
                                (dependency) =>
                                    dependency.typeId === FileType.Preview
                            ).length && (
                                <Screenshots publication={publication} />
                            )}

                        <Separator />
                        <About publication={publication} />

                        {publication?.whatsNew && (
                            <>
                                <Separator />
                                <WhatsNew publication={publication} />
                            </>
                        )}

                        {publication?.dependenciesData &&
                            Object.values(
                                publication.dependenciesData ?? {}
                            ).some((dep) => dep.publicationName) && (
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
                </div>
            ) : (
                notFound()
            )}
        </main>
    )
}
