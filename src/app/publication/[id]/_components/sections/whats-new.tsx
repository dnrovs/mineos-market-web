import { Publication } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import React from 'react'

interface WhatsNewProps {
    publication: Publication
}

export default function WhatsNew({ publication }: WhatsNewProps) {
    const t = useExtracted()

    return (
        <section className={'flex flex-col gap-3'}>
            <h2 className="text-xl font-bold">
                {t("What's new")}{' '}
                {publication.whatsNewVersion &&
                    publication.whatsNewVersion !== publication.version &&
                    t('in {whatsNewVersion}', {
                        whatsNewVersion: publication.whatsNewVersion.toString()
                    })}
            </h2>

            <span>{publication.whatsNew}</span>
        </section>
    )
}
