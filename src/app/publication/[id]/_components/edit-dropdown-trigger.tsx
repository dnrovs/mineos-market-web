import { GitBranch, Trash } from 'lucide-react'
import { Publication } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/shadcn/alert-dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/shadcn/dropdown-menu'
import { useMarket } from '@/context/MarketProvider'
import useHandleRequestError from '@/hooks/use-handle-request-error'

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

                <AlertDialogFooter>
                    <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={deletePublication}>
                        {t('Delete {publicationName}', {
                            publicationName: publication.publicationName
                        })}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function EditDropdownTrigger({
    publication,
    ...props
}: {
    publication: Publication
} & React.ComponentProps<typeof DropdownMenuTrigger>) {
    const t = useExtracted()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger {...props} />

            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link href={`/publication/${publication.fileId}/update`}>
                        <GitBranch />
                        {t('Edit')}
                    </Link>
                </DropdownMenuItem>
                <DeletePublicationAlertDialogTrigger publication={publication}>
                    <DropdownMenuItem
                        variant={'destructive'}
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Trash />
                        {t('Remove')}
                    </DropdownMenuItem>
                </DeletePublicationAlertDialogTrigger>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
