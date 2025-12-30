import { EllipsisVertical, ExternalLink, Github, Pencil } from 'lucide-react'
import { Publication } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Link from 'next/link'

import EditDropdownTrigger from '@/app/publication/[id]/_components/edit-dropdown-trigger'
import OptionsDropdownTrigger from '@/app/publication/[id]/_components/options-dropdown-trigger'
import PublicationIcon from '@/components/ui/publication-icon'
import { Button } from '@/components/ui/shadcn/button'
import {
    ButtonGroup,
    ButtonGroupSeparator
} from '@/components/ui/shadcn/button-group'
import { useMarket } from '@/context/MarketProvider'
import { useMediaQuery } from '@/hooks/shadcn/use-media-query'
import { useConfig } from '@/hooks/use-config'
import isPackaged from '@/utils/is-packaged'
import { cn } from '@/utils/shadcn'

interface PublicationInfoProps {
    publication: Publication
}

export default function PublicationInfo({ publication }: PublicationInfoProps) {
    const t = useExtracted()
    const isMobile = useMediaQuery('(max-width: 64rem)')

    const { user } = useMarket()
    const { config } = useConfig()

    const showBackgroundAnimation =
        config.appearance.showAnimatedPublicationBackgrounds

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
        <div
            className={
                'relative flex w-full flex-col items-center overflow-hidden'
            }
        >
            <div
                className={cn(
                    'flex w-full max-w-4xl gap-3 p-3',
                    showBackgroundAnimation ? 'p-4 xl:px-0 xl:py-6' : 'pt-0'
                )}
            >
                {showBackgroundAnimation && (
                    <PublicationIcon
                        publication={publication}
                        className={
                            'absolute -top-[calc(100svh/3)] left-0 -z-10 w-full scale-125 bg-white opacity-50 blur-3xl motion-safe:animate-[spin_100s_linear_infinite]'
                        }
                    />
                )}

                <PublicationIcon
                    publication={publication}
                    className={'size-28 rounded-3xl sm:size-32 lg:size-34'}
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
                                'text-foreground/50 w-full truncate lg:text-lg'
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
                                        {t('Package on GitHub')}
                                        <Github />
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink />
                                        {t('View source code')}
                                    </>
                                )}
                            </Link>
                        </Button>
                        <ButtonGroup
                            className={
                                '[&>button]:bg-secondary/75 [&>div]:border/75'
                            }
                        >
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
                                <>
                                    <ButtonGroupSeparator />
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
                                </>
                            )}
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </div>
    )
}
