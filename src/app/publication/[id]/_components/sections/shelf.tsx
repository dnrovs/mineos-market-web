'use client'

import {
    ArrowRight,
    Download,
    GitBranch,
    Globe,
    Scale,
    Star
} from 'lucide-react'
import { FileType, License, Publication, Review } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import 'react-indiana-drag-scroll/dist/style.css'

import { Separator } from '@/components/ui/shadcn/separator'
import { usePublicationCategories } from '@/hooks/use-publication-categories'
import isPackaged from '@/utils/is-packaged'

const licenses: Record<License, string> = {
    [License.MIT]: 'MIT',
    [License.GPL3]: 'GPL 3',
    [License.AGPL3]: 'AGPL 3',
    [License.LGPL3]: 'LGPL 3',
    [License.ApacheLicense2]: 'Apache 5',
    [License.MPL2]: 'MPL',
    [License.TheUnlicense]: 'Unlicense'
}

interface ShelfElementProps {
    title: string
    Icon: React.ElementType
    value: string
}

function ShelfElement({ title, Icon, value }: ShelfElementProps) {
    return (
        <div className={'flex min-w-0 flex-1 flex-col items-center gap-2'}>
            <span className={'text-muted-foreground text-sm text-nowrap'}>
                {title}
            </span>
            <div className={'flex items-center gap-2 text-2xl text-nowrap'}>
                <Icon size={20} />
                {value}
            </div>
        </div>
    )
}

interface StatsBarProps {
    publication: Publication
    reviews: Review[]
}

export default function Shelf({ publication, reviews }: StatsBarProps) {
    const t = useExtracted()
    const categories = usePublicationCategories()

    const shelfRef = useRef<HTMLDivElement>(null)
    const [maxWidth, setMaxWidth] = useState(0)

    const category = categories.find((p) => p.enum === publication.categoryId)!

    const translations = isPackaged(publication.categoryId)
        ? (publication.dependenciesData &&
              Object.values(publication.dependenciesData).filter(
                  (dependency) => dependency.typeId === FileType.Localization
              ).length) ||
          0
        : undefined

    useEffect(() => {
        if (!shelfRef.current) return

        const children = shelfRef.current.querySelectorAll('[data-shelf-item]')
        let max = 0

        children.forEach((child) => {
            const width = (child as HTMLElement).offsetWidth
            if (width > max) max = width
        })

        setMaxWidth(max)
    }, [])

    const elements = [
        ...(publication.averageRating
            ? [
                  {
                      title: t(
                          '{length, plural, one {Rating} other {Ratings}}',
                          { length: reviews.length }
                      ),
                      icon: Star,
                      value: publication.averageRating.toFixed(1)
                  }
              ]
            : []),
        { title: t('Downloads'), icon: Download, value: publication.downloads },
        {
            title: t('Category'),
            icon: category.icon,
            value: category.shortName
        },
        { title: t('Version'), icon: GitBranch, value: publication.version },
        ...(translations
            ? [{ title: t('Languages'), icon: Globe, value: translations }]
            : []),
        {
            title: t('License'),
            icon: Scale,
            value: licenses[publication.licenseId]
        }
    ]

    return (
        <div className="relative">
            <span className="via-background pointer-events-none absolute h-full w-full bg-gradient-to-r from-transparent from-75% via-100%" />
            <ScrollContainer
                component={'div'}
                className={'-z-10 overflow-auto'}
                onMouseDown={(e) => e.preventDefault()}
            >
                <div ref={shelfRef} className={'flex gap-4'}>
                    {elements.map((element, index) => (
                        <div
                            key={index}
                            className="flex grow items-center gap-4"
                        >
                            <div
                                data-shelf-item
                                style={{
                                    minWidth: maxWidth > 0 ? maxWidth : 'auto'
                                }}
                                className="flex-shrink-0 grow"
                            >
                                <ShelfElement
                                    title={element.title.toUpperCase()}
                                    Icon={element.icon}
                                    value={element.value.toString()}
                                />
                            </div>
                            {index < elements.length - 1 && (
                                <Separator
                                    orientation="vertical"
                                    className="h-12"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </ScrollContainer>
        </div>
    )
}
