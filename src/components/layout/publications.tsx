import clsx from 'clsx'
import { Download, Star } from 'lucide-react'
import { PreviewPublication } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { useIsMobile } from '@/hooks/shadcn/use-mobile'
import getPublicationIcon from '@/utils/get-publication-icon'

interface PublicationProps {
    publication: PreviewPublication
}

function Publication({ publication }: PublicationProps) {
    const t = useExtracted()

    const isMobile = useIsMobile()

    return (
        <Link
            key={publication.fileId}
            className={
                'bg-muted/50 focus-visible:border-ring focus-visible:ring-ring/50 flex cursor-pointer overflow-hidden rounded-xl focus-visible:ring-[3px] max-md:max-h-fit max-md:w-full max-md:flex-col md:min-w-80'
            }
            href={`/publication/${publication.fileId}`}
        >
            <Image
                className={'size-25 h-max max-md:w-full'}
                src={getPublicationIcon(
                    publication.iconUrl,
                    publication.categoryId
                )}
                alt={`Icon for ${publication.publicationName}`}
                width={512}
                height={512}
            />

            <div className="flex flex-grow flex-col justify-center truncate p-3">
                <span className="block max-w-full truncate text-xl font-medium">
                    {publication.publicationName}
                </span>
                <span className="text-muted-foreground block max-w-full truncate">
                    {t('by {username}', { username: publication.userName })}
                </span>

                <div className={'flex gap-2.5'}>
                    <div className={'flex items-center gap-1'}>
                        {isMobile ? (
                            <Star size={19} fill={'currentcolor'} />
                        ) : (
                            <div className={'flex gap-0.5'}>
                                {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                        key={i}
                                        size={19}
                                        fill={
                                            i < (publication.averageRating || 0)
                                                ? 'currentColor'
                                                : 'none'
                                        }
                                    />
                                ))}
                            </div>
                        )}
                        <span className={'font-light'}>
                            {(publication.averageRating || 0).toFixed(1)}
                        </span>
                    </div>
                    <div className={'flex items-center gap-1'}>
                        <Download size={19} />
                        <span className={'font-light'}>
                            {publication.downloads}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

interface PublicationsProps {
    publications: PreviewPublication[]
    className?: string
}

export default function Publications({
    publications,
    className
}: PublicationsProps) {
    return (
        <div
            className={clsx(
                'grid w-full flex-1 grid-cols-2 content-start gap-3 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]',
                className
            )}
        >
            {publications.map((publication) => (
                <Publication
                    key={publication.fileId}
                    publication={publication}
                />
            ))}
        </div>
    )
}
