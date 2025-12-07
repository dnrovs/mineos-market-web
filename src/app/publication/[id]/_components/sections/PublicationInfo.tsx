import { EllipsisVertical, ExternalLink, Github } from 'lucide-react'
import { Publication, PublicationCategory } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import OptionsDropdownTrigger from '@/app/publication/[id]/_components/OptionsDropdownTrigger'
import { Button } from '@/components/ui/shadcn/button'
import {
    DropdownMenu,
    DropdownMenuTrigger
} from '@/components/ui/shadcn/dropdown-menu'
import getPublicationIcon from '@/utils/get-publication-icon'
import isPackaged from '@/utils/is-packaged'

interface PublicationInfoProps {
    publication: Publication
}

export default function PublicationInfo({ publication }: PublicationInfoProps) {
    const t = useExtracted()

    const sourceUrl = new URL(publication.sourceUrl)
    const isGithub = sourceUrl.hostname === 'raw.githubusercontent.com'
    const packaged = isPackaged(publication.categoryId)
    const finalUrl = isGithub
        ? sourceUrl
              .toString()
              .replace('raw.githubusercontent.com', 'github.com')
              .replace(/\/[^\/]+$/, packaged ? '' : '$&')
              .replace(
                  /^(https:\/\/github\.com\/[^\/]+\/[^\/]+\/)(.*)$/,
                  `$1${packaged ? 'tree' : 'blob'}/$2`
              )
        : sourceUrl.toString()

    return (
        <div className={'sticky bottom-full mb-3 flex w-full gap-3'}>
            <Image
                src={getPublicationIcon(
                    publication.iconUrl,
                    publication.categoryId
                )}
                alt={'Placeholder'}
                className={'size-32 rounded-xl max-[32rem]:size-28'}
                width={512}
                height={512}
            />
            <div className={'flex flex-col justify-between truncate'}>
                <div className={'flex flex-col'}>
                    <span className={'truncate text-xl font-medium'}>
                        {publication?.publicationName}
                    </span>
                    <span className={'text-muted-foreground w-full truncate'}>
                        {t.rich('by <link>{username}</link>', {
                            username: publication.userName,
                            link: (chunks) => (
                                <Link
                                    className={
                                        'text-foreground underline-offset-2 hover:underline'
                                    }
                                    href={`/user/${publication?.userName}`}
                                >
                                    {chunks}
                                </Link>
                            )
                        })}
                    </span>
                </div>
                <div className={'flex gap-2'}>
                    <Button size={'sm'} className={'w-fit'} asChild>
                        <Link href={finalUrl} target={'_blank'}>
                            {isGithub ? (
                                <>
                                    {t('View on GitHub')} <Github />
                                </>
                            ) : (
                                <>
                                    {t('View source code')} <ExternalLink />
                                </>
                            )}
                        </Link>
                    </Button>
                    <OptionsDropdownTrigger publication={publication}>
                        <Button size={'icon-sm'} variant={'secondary'}>
                            <EllipsisVertical />
                        </Button>
                    </OptionsDropdownTrigger>
                </div>
            </div>
        </div>
    )
}
