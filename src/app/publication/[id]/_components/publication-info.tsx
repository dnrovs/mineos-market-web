import { EllipsisVertical, ExternalLink, Github, Pencil } from 'lucide-react'
import { Publication, PublicationCategory } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import EditDropdownTrigger from '@/app/publication/[id]/_components/edit-dropdown-trigger'
import OptionsDropdownTrigger from '@/app/publication/[id]/_components/options-dropdown-trigger'
import { Button } from '@/components/ui/shadcn/button'
import { ButtonGroup } from '@/components/ui/shadcn/button-group'
import {
    DropdownMenu,
    DropdownMenuTrigger
} from '@/components/ui/shadcn/dropdown-menu'
import { useMarket } from '@/context/MarketProvider'
import { useMediaQuery } from '@/hooks/shadcn/use-media-query'
import { useIsMobile } from '@/hooks/shadcn/use-mobile'
import getPublicationIcon from '@/utils/get-publication-icon'
import isPackaged from '@/utils/is-packaged'

interface PublicationInfoProps {
    publication: Publication
}

export default function PublicationInfo({ publication }: PublicationInfoProps) {
    const t = useExtracted()
    const isMobile = useMediaQuery('(max-width: 64rem)')

    const { user } = useMarket()

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

    const iconSource = getPublicationIcon(
        publication.iconUrl,
        publication.categoryId
    )

    return (
        <div className={'flex w-full flex-col items-center overflow-hidden'}>
            <div
                className={
                    'sticky bottom-full flex w-full max-w-192 gap-3 p-3 pt-0'
                }
            >
                <Image
                    src={iconSource}
                    alt={t('Icon for {publicationName}', {
                        publicationName: publication.publicationName
                    })}
                    className={'size-28 rounded-2xl sm:size-32 lg:size-36'}
                    width={512}
                    height={512}
                />
                <div className={'flex flex-col justify-between truncate'}>
                    <div className={'flex flex-col'}>
                        <h1
                            className={
                                'truncate text-xl font-medium lg:text-2xl'
                            }
                        >
                            {publication?.publicationName}
                        </h1>
                        <span
                            className={
                                'text-muted-foreground w-full truncate lg:text-lg'
                            }
                        >
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
                        <Button size={isMobile ? 'sm' : 'default'} asChild>
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
                        <ButtonGroup className={'gap-px'}>
                            <OptionsDropdownTrigger
                                publication={publication}
                                asChild
                            >
                                <Button
                                    size={isMobile ? 'icon-sm' : 'icon'}
                                    variant={'secondary'}
                                >
                                    <EllipsisVertical />
                                </Button>
                            </OptionsDropdownTrigger>
                            {user?.name === publication.userName && (
                                <EditDropdownTrigger
                                    publication={publication}
                                    asChild
                                >
                                    <Button
                                        size={isMobile ? 'icon-sm' : 'icon'}
                                        variant={'secondary'}
                                    >
                                        <Pencil />
                                    </Button>
                                </EditDropdownTrigger>
                            )}
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </div>
    )
}
