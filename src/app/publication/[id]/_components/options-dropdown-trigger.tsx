import {
    Braces,
    Download,
    EllipsisVertical,
    GitBranch,
    Pencil,
    Share2,
    Trash
} from 'lucide-react'
import { Publication } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

import {
    BundledLanguage,
    CodeBlock,
    CodeBlockBody,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockFilename,
    CodeBlockFiles,
    CodeBlockHeader,
    CodeBlockItem
} from '@/components/ui/shadcn-io/code-block'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/shadcn/alert-dialog'
import { Button } from '@/components/ui/shadcn/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/shadcn/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/components/ui/shadcn/dropdown-menu'
import { Input } from '@/components/ui/shadcn/input'
import { Label } from '@/components/ui/shadcn/label'
import { useMarket } from '@/context/MarketProvider'
import useHandleRequestError from '@/hooks/use-handle-request-error'

function RawJSONDialogTrigger({
    publication,
    ...props
}: { publication: Publication } & React.ComponentProps<
    typeof DropdownMenuTrigger
>) {
    const t = useExtracted()

    const code = [
        {
            language: 'JSON',
            filename: `${publication.publicationName}.json`,
            code: JSON.stringify(publication, null, 2)
        }
    ]

    return (
        <Dialog>
            <DialogTrigger {...props} />
            <DialogContent className={'max-h-[90dvh] overflow-auto'}>
                <DialogHeader>
                    <DialogTitle>
                        {t("{publicationName}'s raw JSON", {
                            publicationName: publication.publicationName
                        })}
                    </DialogTitle>
                </DialogHeader>

                <CodeBlock data={code} defaultValue={code[0].language}>
                    <CodeBlockHeader>
                        <CodeBlockFiles>
                            {(item) => (
                                <CodeBlockFilename
                                    key={item.language}
                                    value={item.language}
                                >
                                    {item.filename}
                                </CodeBlockFilename>
                            )}
                        </CodeBlockFiles>
                        <CodeBlockCopyButton
                            onCopy={() =>
                                toast.success(t('JSON copied to clipboard'))
                            }
                            onError={() =>
                                toast.error(
                                    t('Failed to copy JSON to clipboard')
                                )
                            }
                        />
                    </CodeBlockHeader>

                    <CodeBlockBody>
                        {(item) => (
                            <CodeBlockItem
                                key={item.language}
                                value={item.language as BundledLanguage}
                            >
                                <CodeBlockContent className={'[&>pre]:pb-0'}>
                                    {item.code}
                                </CodeBlockContent>
                            </CodeBlockItem>
                        )}
                    </CodeBlockBody>
                </CodeBlock>
            </DialogContent>
        </Dialog>
    )
}

export default function OptionsDropdownTrigger({
    publication,
    ...props
}: { publication: Publication } & React.ComponentProps<
    typeof DropdownMenuTrigger
>) {
    const { user, client } = useMarket()
    const handleRequestError = useHandleRequestError()

    const t = useExtracted()

    const markDownloaded = () => {
        const markDownloadedPromise = client.publications
            .markDownloaded({ fileId: publication.fileId })
            .catch((error) => {
                throw new Error(
                    handleRequestError(
                        error,
                        t('while marking publication as downloaded'),
                        true
                    )
                )
            })

        toast.promise(markDownloadedPromise, {
            loading: t('Marking publication as downloaded...'),
            success: t('Publication marked as downloaded.'),
            error: (error: Error) => error.message
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger {...props} />

            <DropdownMenuContent>
                {navigator.share && (
                    <DropdownMenuItem
                        onClick={() =>
                            navigator.share({
                                title: publication.publicationName,
                                url: location.toString()
                            })
                        }
                    >
                        <Share2 />
                        {t('Share')}
                    </DropdownMenuItem>
                )}

                {user && (
                    <DropdownMenuItem onClick={markDownloaded}>
                        <Download />
                        {t('Mark downloaded')}
                    </DropdownMenuItem>
                )}

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Braces />
                        {t('Sources')}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                            <Link href={publication.sourceUrl}>
                                {t('Source code')}
                            </Link>
                        </DropdownMenuItem>
                        {publication.iconUrl && (
                            <DropdownMenuItem asChild>
                                <Link href={publication.iconUrl}>
                                    {t('Icon picture')}
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <RawJSONDialogTrigger publication={publication} asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                            >
                                {t('Raw JSON')}
                            </DropdownMenuItem>
                        </RawJSONDialogTrigger>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
