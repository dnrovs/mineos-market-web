'use client'

import { useExtracted } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import PublishFormFields, {
    formatPublishFormValues,
    PublishFormValues
} from '@/components/forms/publish-form'
import Header from '@/components/layout/header'
import ResponsiveCard from '@/components/ui/responsive-card'
import { Button } from '@/components/ui/shadcn/button'
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/shadcn/card'
import { Field, FieldSet } from '@/components/ui/shadcn/field'
import { useMarket } from '@/context/MarketProvider'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { usePublicationCategories } from '@/hooks/use-publication-categories'
import useRequireUser from '@/hooks/use-require-user'
import { licenses } from '@/lib/constants'
import { parseAsStringLiteral, useQueryState } from 'nuqs'

export default function PublishPage() {
    const publicationCategories = usePublicationCategories()
    const [category] = useQueryState(
        'category',
        parseAsStringLiteral(
            publicationCategories.map((p) => p.url.slice(1))
        ).withDefault('applications')
    )

    const defaultCategory =
        publicationCategories.find((p) => p.url.slice(1) === category)?.enum ??
        publicationCategories[0].enum

    const { user, client } = useMarket()

    const t = useExtracted()
    const router = useRouter()

    const handleRequestError = useHandleRequestError()

    useRequireUser()

    const publishForm = useForm<PublishFormValues>({
        defaultValues: {
            category: defaultCategory,
            license: licenses[0].enum
        }
    })

    const uploadPublication = (data: PublishFormValues) => {
        const uploadPublicationPromise = client.publications
            .uploadPublication(formatPublishFormValues(data))
            .then(() => router.back())
            .catch((error) => {
                throw new Error(
                    handleRequestError(
                        error,
                        t('while uploading publication'),
                        true
                    )
                )
            })

        toast.promise(uploadPublicationPromise, {
            loading: t('Uploading publication...'),
            success: t('Publication uploaded successfully.'),
            error: (error: Error) => error.message
        })
    }

    return (
        <main className="flex h-svh w-full flex-col overflow-auto">
            <Header />
            <ResponsiveCard>
                <CardHeader>
                    <CardTitle>{t('Publish software')}</CardTitle>
                    <CardDescription>
                        {t('Create something amazing and share it!')}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={publishForm.handleSubmit(uploadPublication)}>
                    <FieldSet>
                        <CardContent>
                            <PublishFormFields form={publishForm} />
                        </CardContent>
                        <CardFooter>
                            <Field>
                                <Button type={'submit'}>{t('Publish')}</Button>
                            </Field>
                        </CardFooter>
                    </FieldSet>
                </form>
            </ResponsiveCard>
        </main>
    )
}
