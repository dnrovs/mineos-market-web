'use client'

import {
    FileType,
    Publication,
    PublicationCategory,
    Review as ReviewT
} from 'mineos-market-client'

import { useExtracted } from 'next-intl'
import { notFound, useParams } from 'next/navigation'

import { useEffect, useState } from 'react'

import Previews from '@/app/publication/[id]/_components/previews'
import PublicationInfo from '@/app/publication/[id]/_components/publication-info'
import About from '@/app/publication/[id]/_components/sections/about'
import Dependencies from '@/app/publication/[id]/_components/sections/dependencies'
import RatingsAndReviews from '@/app/publication/[id]/_components/sections/ratings-and-reviews'
import WhatsNew from '@/app/publication/[id]/_components/sections/whats-new'
import Shelf from '@/app/publication/[id]/_components/shelf'

import Header from '@/components/layout/header'
import { Separator } from '@/components/ui/shadcn/separator'
import { Spinner } from '@/components/ui/shadcn/spinner'

import { useMarket } from '@/context/market-provider'

import { JsonLd } from '@/components/json-ld'
import { useConfig } from '@/hooks/use-config'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { licenses } from '@/lib/constants'
import { SoftwareApplication, WithContext } from 'schema-dts'

export default function PublicationPage() {
    const id = Number(useParams<{ id: string }>().id)

    const { client } = useMarket()
    const { config } = useConfig()

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
        updateData()
    }, [client.publications, client.reviews, id])

    const showPreviews = config.appearance.showPublicationPreviews

    const hasPreviews =
        publication?.dependenciesData &&
        Object.values(publication.dependenciesData).some(
            (dependency) => dependency.typeId === FileType.Preview
        )

    const hasDependencies =
        publication?.dependenciesData &&
        Object.values(publication.dependenciesData ?? {}).some(
            (dep) => dep.publicationName
        )

    const jsonLd: WithContext<SoftwareApplication> | undefined = publication
        ? {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              identifier: publication.fileId.toString(),
              name: publication.publicationName,
              author: {
                  '@type': 'Person',
                  name: publication.userName,
                  url: `https://mineos-market.vercel.app/user/${publication.userName}`,
                  image: `https://tapback.co/api/avatar/${publication.userName}`
              },
              version: publication.version.toString(),
              applicationCategory: PublicationCategory[publication.categoryId],
              license: licenses.find(
                  (license) => license.enum === publication.licenseId
              )!.name,
              datePublished: new Date(
                  publication.timestamp * 1000
              ).toISOString(),
              description: publication.initialDescription,
              image: `https://mineos-market.vercel.app/api/image?url=${publication.iconUrl}&scale=8&sharp=true`,
              aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: publication.averageRating ?? 0,
                  reviewCount: reviews.length
              },
              operatingSystem: 'MineOS',
              url: `https://mineos-market.vercel.app/publications/${publication.fileId}`,
              offers: {
                  '@type': 'Offer',
                  price: 0,
                  priceCurrency: 'UAH',
                  availability: 'InStock'
              }
          }
        : undefined

    return (
        <main className="relative flex h-screen w-full flex-col overflow-auto pb-[env(safe-area-inset-bottom)]">
            <Header />

            {loading ? (
                <Spinner className="mx-auto my-auto size-10" />
            ) : publication ? (
                <div className="mx-auto flex w-full flex-col items-center">
                    {jsonLd && <JsonLd jsonLd={jsonLd} />}

                    <PublicationInfo publication={publication} />

                    <div className={'flex w-full max-w-4xl flex-col gap-3 p-3'}>
                        <Shelf publication={publication} reviews={reviews} />

                        {hasPreviews && showPreviews && (
                            <Previews publication={publication} />
                        )}

                        <Separator />
                        <About publication={publication} />

                        {publication.whatsNew && (
                            <>
                                <Separator />
                                <WhatsNew publication={publication} />
                            </>
                        )}

                        {hasDependencies && (
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
