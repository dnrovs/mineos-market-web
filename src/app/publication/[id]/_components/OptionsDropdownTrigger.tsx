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

interface RawJSONDialogTriggerProps {
    publication: Publication
    children: React.ReactNode
}

function RawJSONDialogTrigger({
    publication,
    children
}: RawJSONDialogTriggerProps) {
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
            <DialogTrigger asChild>{children}</DialogTrigger>
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

interface DeletePublicationAlertDialogTriggerProps {
    publication: Publication
    children: React.ReactNode
}

function DeletePublicationAlertDialogTrigger({
    publication,
    children
}: DeletePublicationAlertDialogTriggerProps) {
    const { client } = useMarket()
    const t = useExtracted()
    const router = useRouter()
    const handleRequestError = useHandleRequestError()

    const deletePublication = () => {
        const deletePublicationPromise = client.publications
            .deletePublication({
                fileId: publication.fileId
            })
            .then(() => router.back())
            .catch((error) => {
                throw new Error(
                    handleRequestError(
                        error,
                        t('while deleting publication'),
                        true
                    )
                )
            })

        toast.promise(deletePublicationPromise, {
            loading: t('Deleting publication...'),
            success: t('Publication deleted successfully.'),
            error: (error: Error) => error.message
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('Delete {publicationName}?', {
                            publicationName: publication.publicationName
                        })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t(
                            "This will delete publication, it's statistics and reviews from the registry forever. Source files will stay on the server."
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <DialogFooter>
                    <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={deletePublication}>
                        {t('Delete {publicationName}', {
                            publicationName: publication.publicationName
                        })}
                    </AlertDialogAction>
                </DialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

interface EllipsisDropdownProps {
    publication: Publication
    children: React.ReactNode
}

export default function OptionsDropdownTrigger({
    publication,
    children
}: EllipsisDropdownProps) {
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
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

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
                        <RawJSONDialogTrigger publication={publication}>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                            >
                                {t('Raw JSON')}
                            </DropdownMenuItem>
                        </RawJSONDialogTrigger>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {publication.userName === user?.name && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/publication/${publication.fileId}/update`}
                            >
                                <GitBranch />
                                {t('Update')}
                            </Link>
                        </DropdownMenuItem>
                        <DeletePublicationAlertDialogTrigger
                            publication={publication}
                        >
                            <DropdownMenuItem
                                variant={'destructive'}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <Trash />
                                {t('Remove')}
                            </DropdownMenuItem>
                        </DeletePublicationAlertDialogTrigger>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
