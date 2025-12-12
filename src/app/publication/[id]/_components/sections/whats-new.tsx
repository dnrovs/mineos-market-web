import { Publication } from 'mineos-market-client'
import { useExtracted, useFormatter, useNow } from 'next-intl'
import React from 'react'

interface WhatsNewProps {
    publication: Publication
}

export default function WhatsNew({ publication }: WhatsNewProps) {
    const t = useExtracted()
    const now = useNow()
    const format = useFormatter()

    return (
        <section className={'flex flex-col gap-3'}>
            <h2 className="text-xl font-bold">
                {t("What's new")}{' '}
                {publication.whatsNewVersion &&
                    publication.whatsNewVersion !== publication.version &&
                    t('in {whatsNewVersion}', {
                        whatsNewVersion: publication.whatsNewVersion.toString()
                    })}
                {publication.version === publication.whatsNewVersion &&
                    format.relativeTime(
                        new Date(publication.timestamp * 1000),
                        { now, style: 'short' }
                    )}
            </h2>

            <span>{publication.whatsNew}</span>
        </section>
    )
}
