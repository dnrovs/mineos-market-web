import { useConfig } from '@/hooks/use-config'
import {
    PreviewPublication,
    Publication,
    PublicationCategory
} from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

const placeholders = {
    [PublicationCategory.Applications]: '/placeholders/applications.png',
    [PublicationCategory.Libraries]: '/placeholders/libraries.png',
    [PublicationCategory.Scripts]: '/placeholders/scripts.png',
    [PublicationCategory.Wallpapers]: '/placeholders/wallpapers.png'
}

export default function PublicationIcon({
    publication,
    ...props
}: {
    publication: Publication | PreviewPublication
} & Omit<ImageProps, 'src' | 'alt' | 'onError'>) {
    const { config } = useConfig()

    const t = useExtracted()

    const showIcons = config.appearance.showPublicationIcons

    const placeholder = placeholders[publication.categoryId]
    const ocif = `/api/image?url=${publication.iconUrl}&scale=8&sharp=true`

    const [source, setSource] = useState<string>(
        publication.iconUrl && showIcons ? ocif : placeholder
    )

    return (
        <Image
            src={source}
            alt={t('Icon for {publicationName}', {
                publicationName: publication.publicationName
            })}
            onError={() => {
                if (source !== placeholder) setSource(placeholder)
            }}
            width={512}
            height={512}
            {...props}
        />
    )
}
