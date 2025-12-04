import { Publication } from 'mineos-market-client'
import { useExtracted, useFormatter } from 'next-intl'
import React from 'react'

interface AboutProps {
    publication: Publication
}

export default function About({ publication }: AboutProps) {
    const t = useExtracted()
    const format = useFormatter()

    return (
        <section className={'flex flex-col gap-3'}>
            <h2 className={'text-xl font-bold'}>{t('About')}</h2>

            <span className={'flex flex-col gap-1.5'}>
                {publication.initialDescription}
            </span>

            <span className={'text-muted-foreground'}>
                {t(
                    '{version, plural, =1 {Released on} other {Last released on}} {date}',
                    {
                        version: publication.version,
                        date: format.dateTime(
                            new Date(publication.timestamp * 1000),
                            {
                                dateStyle: 'medium'
                            }
                        )
                    }
                )}
            </span>
        </section>
    )
}
