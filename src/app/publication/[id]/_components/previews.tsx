import HorizontalScrollShadow from '@/components/ui/horizontal-scroll-shadow'
import { FileType, Publication } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Image from 'next/image'
import ScrollContainer from 'react-indiana-drag-scroll'

export default function Previews({
    publication
}: {
    publication: Publication
}) {
    const t = useExtracted()

    if (!publication.dependenciesData) return

    const previews = Object.values(publication.dependenciesData).filter(
        (dependency) => dependency.typeId === FileType.Preview
    )

    return (
        <HorizontalScrollShadow>
            <ScrollContainer
                component={'div'}
                className={'-z-10 flex w-full gap-3'}
                onMouseDown={(e) => e.preventDefault()}
            >
                {previews.map((preview, index) => (
                    <Image
                        key={index}
                        src={`/api/image?url=${preview.sourceUrl}&scale=3`}
                        alt={t('Preview {index} for {publicationName}', {
                            index: String(index + 1),
                            publicationName: publication.publicationName
                        })}
                        className={'h-62.5 max-w-none rounded-xl'}
                        width={2048}
                        height={2048}
                        onError={(event) =>
                            (event.currentTarget.className = 'hidden')
                        }
                    />
                ))}
            </ScrollContainer>
        </HorizontalScrollShadow>
    )
}
