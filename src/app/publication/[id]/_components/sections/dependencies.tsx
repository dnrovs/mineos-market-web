import { Publication } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Link from 'next/link'

import { Badge } from '@/components/ui/shadcn/badge'

interface DependenciesProps {
    publication: Publication
}

export default function Dependencies({ publication }: DependenciesProps) {
    const t = useExtracted()

    const depsWithName = Object.entries(
        publication?.dependenciesData ?? {}
    ).filter(([_, d]) => d.publicationName?.trim())

    if (depsWithName.length === 0) return null

    return (
        <section className="flex flex-col gap-3 sm:col-start-2">
            <h2 className="text-xl font-bold">{t('Dependencies')}</h2>
            <div className="flex flex-wrap gap-1">
                {depsWithName.map(([id, d]) => (
                    <Badge asChild key={id}>
                        <Link href={`/publication/${id}`}>
                            {d.publicationName}@{d.version}
                        </Link>
                    </Badge>
                ))}
            </div>
        </section>
    )
}
