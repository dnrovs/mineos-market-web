'use client'

import { FileType, Publication } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import PublishFormFields, {
    AddDependencyFormValues,
    formatPublishFormValues,
    PublishFormValues
} from '@/components/forms/publish-form'
import Header from '@/components/layout/header'
import { Button } from '@/components/ui/shadcn/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/shadcn/card'
import {
    Field,
    FieldError,
    FieldLabel,
    FieldSeparator,
    FieldSet
} from '@/components/ui/shadcn/field'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { Textarea } from '@/components/ui/shadcn/textarea'
import { useMarket } from '@/context/MarketProvider'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import isPackaged from '@/utils/is-packaged'

const formatPublicationToFormValues = (
    publication: Publication
): PublishFormValues => {
    const common = {
        name: publication.publicationName,
        description: publication.initialDescription,
        license: publication.licenseId,
        mainFileUrl: publication.sourceUrl,
        previews: Object.values(publication.dependenciesData ?? {})
            .filter((dep) => dep.typeId === FileType.Preview)
            .map((dep) => ({ value: dep.sourceUrl })),
        dependencies: Object.values(publication.dependenciesData || {})
            .filter((dependency) =>
                [FileType.Main, FileType.Resource].includes(dependency.typeId)
            )
            .map(
                (dependency): AddDependencyFormValues =>
                    dependency.publicationName
                        ? {
                              type: 'publication',
                              publicationName: dependency.publicationName
                          }
                        : {
                              type: 'file',
                              sourceUrl: dependency.sourceUrl,
                              path: dependency.path,
                              relativePath: dependency.path.startsWith('/')
                          }
            )
    }

    if (isPackaged(publication.categoryId)) {
        return {
            ...common,
            category: publication.categoryId,
            iconUrl: publication.iconUrl || '',
            localizations: Object.values(publication.dependenciesData ?? {})
                .filter((dep) => dep.typeId === FileType.Localization)
                .map((dep) => ({ value: dep.sourceUrl }))
        }
    }

    return {
        ...common,
        category: publication.categoryId,
        mainFilePath: publication.path
    }
}

export type UpdateFormValues = PublishFormValues & {
    whatsNew?: string
}

export default function UpdatePublication() {
    const params = useParams<{ id: string }>()
    const id = Number(params.id)

    const t = useExtracted()

    const { user, client } = useMarket()

    const router = useRouter()
    const handleRequestError = useHandleRequestError()

    const [publication, setPublication] = useState<Publication>()
    const isOwner = user?.name === publication?.userName

    const [loading, setLoading] = useState(true)

    const updateForm = useForm<UpdateFormValues>()

    useEffect(() => {
        if (!user) return router.push('/login')

        client.publications
            .getPublication({ fileId: id })
            .then((publication) => {
                setPublication(publication)

                updateForm.reset(formatPublicationToFormValues(publication))
            })
            .catch((error) =>
                handleRequestError(error, t('while fetching publication'))
            )
            .finally(() => setLoading(false))
    }, [client.publications, id, router, user])

    const updatePublication = (data: UpdateFormValues) => {
        const updatePublicationPromise = client.publications
            .updatePublication({
                fileId: id,
                whatsNew: data.whatsNew,
                ...formatPublishFormValues(data)
            })
            .then(() => router.back())
            .catch((error) => {
                throw new Error(
                    handleRequestError(
                        error,
                        t('while updating publication'),
                        true
                    )
                )
            })

        toast.promise(updatePublicationPromise, {
            loading: t('Updating publication...'),
            success: t('Publication updated successfully.'),
            error: (error: Error) => error.message
        })
    }

    return (
        <main className="flex h-screen w-full flex-col overflow-auto">
            <Header />
            {loading ? (
                <Spinner className="mx-auto my-auto size-10" />
            ) : publication && isOwner ? (
                <Card className={'m-3 mx-auto mt-0 w-auto sm:w-md'}>
                    <CardHeader>
                        <CardTitle>{t('Update publication')}</CardTitle>
                        <CardDescription>
                            {t(
                                'This is where you can update your publication.'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={updateForm.handleSubmit(updatePublication)}>
                        <CardContent>
                            <FieldSet>
                                <Controller
                                    name={'whatsNew'}
                                    control={updateForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>
                                                {t("What's new?")}
                                            </FieldLabel>
                                            <Textarea
                                                {...field}
                                                placeholder={t(
                                                    'In this update, i added and fixed...'
                                                )}
                                            />
                                            {fieldState.error && (
                                                <FieldError>
                                                    {fieldState.error.message}
                                                </FieldError>
                                            )}
                                        </Field>
                                    )}
                                />

                                <FieldSeparator />

                                <PublishFormFields form={updateForm} />
                                <Field>
                                    <Button type={'submit'}>
                                        {t('Update to {newVersion}', {
                                            newVersion: String(
                                                (
                                                    publication.version + 0.01
                                                ).toFixed(2)
                                            )
                                        })}
                                    </Button>
                                </Field>
                            </FieldSet>
                        </CardContent>
                    </form>
                </Card>
            ) : (
                notFound()
            )}
        </main>
    )
}
