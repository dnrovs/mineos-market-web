'use client'

import React, { useEffect } from 'react'
import { useMarket } from '@/context/MarketProvider'

import { redirect, useRouter, useSearchParams } from 'next/navigation'

import Header from '@/components/layout/header'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/shadcn/card'
import { useExtracted } from 'next-intl'
import PublishForm, {
    formatPublishFormValues,
    PublishFormValues
} from '@/components/forms/publish-form'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { toast } from 'sonner'
import {
    License,
    PublicationCategory,
    UploadPublicationParams
} from 'mineos-market-client'
import { useForm } from 'react-hook-form'
import { usePublicationCategories } from '@/hooks/use-publication-categories'
import PublishFormFields from '@/components/forms/publish-form'
import { Field, FieldSet } from '@/components/ui/shadcn/field'
import { Button } from '@/components/ui/shadcn/button'
import { licenses } from '@/lib/constants'
import ResponsiveCard from '@/components/ui/responsive-card'

export default function PublishPage() {
    const searchParams = useSearchParams()

    const publicationCategories = usePublicationCategories()
    const defaultCategory =
        publicationCategories.find(
            (category) =>
                category.url.split('/')[1] === searchParams.get('category')
        )?.enum || publicationCategories[0].enum

    const { user, client } = useMarket()

    const t = useExtracted()
    const router = useRouter()

    const handleRequestError = useHandleRequestError()

    useEffect(() => {
        if (!user) router.push('/login')
    }, [router, user])

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
