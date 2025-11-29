'use client'
import {
    useFieldArray,
    Controller,
    UseFormReturn,
    FieldValues,
    UseFieldArrayReturn,
    useForm
} from 'react-hook-form'
import {
    License,
    PublicationCategory,
    UploadPublicationParams
} from 'mineos-market-client'

import { Button } from '@/components/ui/shadcn/button'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldSet
} from '@/components/ui/shadcn/field'
import { Input } from '@/components/ui/shadcn/input'
import { Textarea } from '@/components/ui/shadcn/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/shadcn/select'
import { Pencil, Plus, SquareLibrary, X } from 'lucide-react'
import isPackaged from '@/utils/is-packaged'
import { usePublicationCategories } from '@/hooks/use-publication-categories'
import { licenses } from '@/lib/constants'
import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/shadcn/dialog'
import { Switch } from '@/components/ui/shadcn/switch'
import { useMarket } from '@/context/MarketProvider'
import { useExtracted } from 'next-intl'
import useHandleRequestError from '@/hooks/use-handle-request-error'
import { toast } from 'sonner'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput
} from '@/components/ui/shadcn/input-group'
import { Link } from 'lucide-react'

export type AddDependencyFormValues =
    | {
          type: 'publication'
          publicationName: string
          sourceUrl?: undefined
          path?: undefined
          relativePath?: undefined
      }
    | {
          type: 'file'
          sourceUrl: string
          path: string
          relativePath: boolean
          publicationName?: undefined
      }

interface addDependencyDialogProps {
    dependenciesFieldArray: UseFieldArrayReturn<
        PublishFormValues & FieldValues,
        'dependencies'
    >
    packaged: boolean
    children: React.ReactNode
    defaultValues?: AddDependencyFormValues
    index?: number
}

function AddDependencyDialog({ children, ...props }: addDependencyDialogProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className={'sm:max-w-md'}>
                <DialogHeader>
                    <DialogTitle>
                        {props.index !== undefined
                            ? 'Edit dependency'
                            : 'Add dependency'}
                    </DialogTitle>
                </DialogHeader>
                <AddDependencyForm {...props} close={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}

function AddDependencyForm({
    dependenciesFieldArray,
    packaged,
    defaultValues,
    index,
    close
}: Omit<addDependencyDialogProps, 'children'> & { close: () => void }) {
    const { client } = useMarket()
    const t = useExtracted()
    const handleRequestError = useHandleRequestError()

    const addDependencyForm = useForm<AddDependencyFormValues>({
        defaultValues: defaultValues || {
            type: 'file'
        }
    })

    const dependencyType = addDependencyForm.watch('type')
    const isRelativePath = addDependencyForm.watch('relativePath')

    const addDependency = (fields: AddDependencyFormValues) => {
        if (
            JSON.stringify(dependenciesFieldArray.fields) ===
            JSON.stringify(fields)
        ) {
            return toast.error('This dependency is already added.')
        }

        if (fields.type === 'publication') {
            const checkPublicationExistencePromise = client.publications
                .getPublications({ search: fields.publicationName })
                .catch((error) => {
                    throw new Error(
                        handleRequestError(
                            error,
                            'while checking publication',
                            true
                        )
                    )
                })
                .then((publications) => {
                    const publication = publications.find(
                        (publication) =>
                            publication.publicationName ===
                            fields.publicationName
                    )

                    if (!publication)
                        throw new Error(
                            'Publication you want to depend on does not exist.'
                        )

                    const data = {
                        type: 'publication' as const,
                        publicationName: publication.publicationName
                    }

                    if (index !== undefined) {
                        dependenciesFieldArray.update(index, data)
                    } else {
                        dependenciesFieldArray.append(data)
                    }
                    close()
                })

            toast.promise(checkPublicationExistencePromise, {
                loading: 'Checking publication...',
                error: (error: Error) => error.message
            })
        } else {
            const data = {
                type: 'file' as const,
                sourceUrl: fields.sourceUrl,
                path: fields.path,
                relativePath: fields.relativePath
            }

            if (index !== undefined) {
                dependenciesFieldArray.update(index, data)
            } else {
                dependenciesFieldArray.append(data)
            }
            close()
        }
    }

    return (
        <FieldSet>
            <Controller
                name={'type'}
                control={addDependencyForm.control}
                render={({ field }) => (
                    <Field>
                        <FieldLabel>Dependency type</FieldLabel>
                        <Select
                            name={field.name}
                            value={String(field.value)}
                            onValueChange={(
                                value: AddDependencyFormValues['type']
                            ) => {
                                field.onChange()
                                addDependencyForm.reset({
                                    type: value as never
                                })
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={'file'}>
                                    File via URL
                                </SelectItem>
                                <SelectItem value={'publication'}>
                                    Existing publication
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                )}
            />

            <FieldSeparator />

            {dependencyType === 'file' && (
                <>
                    <Controller
                        name={'sourceUrl'}
                        control={addDependencyForm.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Source URL</FieldLabel>
                                <Input
                                    {...field}
                                    autoComplete={'off'}
                                    placeholder={
                                        'https://example.com/.../Something.lua'
                                    }
                                />
                            </Field>
                        )}
                    />

                    <Controller
                        name={'path'}
                        control={addDependencyForm.control}
                        render={({ field }) => (
                            <Field>
                                <FieldContent>
                                    <FieldLabel>Installation path</FieldLabel>
                                    <FieldDescription>
                                        {isRelativePath
                                            ? "Relative path in your publication's folder"
                                            : 'Absolute path from the filesystem root folder'}
                                    </FieldDescription>
                                </FieldContent>

                                <Input
                                    {...field}
                                    autoComplete={'off'}
                                    placeholder={
                                        isRelativePath
                                            ? 'Resources/Main.lua'
                                            : 'Users/Scripts/Main.lua'
                                    }
                                />
                            </Field>
                        )}
                    />

                    {packaged && (
                        <Controller
                            name={'relativePath'}
                            control={addDependencyForm.control}
                            render={({ field }) => (
                                <Field orientation={'horizontal'}>
                                    <FieldLabel>Use relative path</FieldLabel>
                                    <Switch
                                        name={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </Field>
                            )}
                        />
                    )}
                </>
            )}

            {dependencyType === 'publication' && (
                <Controller
                    name={'publicationName'}
                    control={addDependencyForm.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Publication name</FieldLabel>
                            <Input
                                {...field}
                                autoComplete={'off'}
                                placeholder={'Filesystem'}
                            />
                        </Field>
                    )}
                />
            )}

            <DialogFooter>
                <Button variant={'secondary'} onClick={close}>
                    Cancel
                </Button>
                <Button onClick={addDependencyForm.handleSubmit(addDependency)}>
                    {index !== undefined ? 'Save changes' : 'Add dependency'}
                </Button>
            </DialogFooter>
        </FieldSet>
    )
}

type PublishFormValuesBase = {
    name: string
    description: string
    license: License
    mainFileUrl: string
    previews: { value: string }[]
    dependencies?: AddDependencyFormValues[]
}

type PublishPackagedFormValues = {
    category: PublicationCategory.Applications | PublicationCategory.Wallpapers
    iconUrl: string
    localizations: { value: string }[]
}

type PublishNotPackagedFormValues = {
    category: PublicationCategory.Libraries | PublicationCategory.Scripts
    mainFilePath: string
}

export type PublishFormValues = PublishFormValuesBase &
    (PublishPackagedFormValues | PublishNotPackagedFormValues)

function PackagedFields({
    form
}: {
    form: UseFormReturn<PublishFormValues & FieldValues>
}) {
    const localizationsFieldArray = useFieldArray({
        control: form.control,
        name: 'localizations'
    })

    return (
        <>
            <Controller
                name={'iconUrl'}
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor={'iconUrl'}>Icon URL</FieldLabel>
                        <Input
                            id={'iconUrl'}
                            type={'url'}
                            placeholder={
                                'https://raw.githubusercontent.com/.../Icon.pic'
                            }
                            required
                            {...field}
                        />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            <Field>
                <FieldLabel htmlFor="localizations">Localizations</FieldLabel>
                <div className="flex flex-col gap-2">
                    {localizationsFieldArray.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <InputGroup>
                                <InputGroupInput
                                    {...form.register(
                                        `localizations.${index}.value`
                                    )}
                                    placeholder={
                                        'https://example.com/.../Ukrainian.lang'
                                    }
                                    required
                                />
                                <InputGroupAddon align={'inline-end'}>
                                    <InputGroupButton
                                        size={'icon-xs'}
                                        onClick={() =>
                                            localizationsFieldArray.remove(
                                                index
                                            )
                                        }
                                    >
                                        <X />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            localizationsFieldArray.append({ value: '' })
                        }
                    >
                        <Plus />
                        Add localization
                    </Button>
                </div>
            </Field>
        </>
    )
}

function NotPackagedFields({
    form
}: {
    form: UseFormReturn<PublishFormValues & FieldValues>
}) {
    return (
        <Controller
            name={'mainFilePath'}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel htmlFor={'mainFilePath'}>
                        Main file path
                    </FieldLabel>
                    <Input
                        id={'mainFilePath'}
                        type={'text'}
                        placeholder={'MyScript.lua'}
                        required
                        {...field}
                    />
                    {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                    )}
                </Field>
            )}
        />
    )
}

export const formatPublishFormValues = (
    data: PublishFormValues
): UploadPublicationParams => {
    const base = {
        name: data.name,
        description: data.description,
        license: data.license,
        category: data.category,
        sourceUrl: data.mainFileUrl,
        previews: data.previews
            .map((p) => p.value)
            .filter(Boolean) as `${string}/${string}.pic`[],
        dependencies: data.dependencies?.map((dep) =>
            dep.type === 'publication'
                ? { publicationName: dep.publicationName }
                : {
                      sourceUrl: dep.sourceUrl,
                      path: dep.relativePath
                          ? (dep.path.replace(
                                /^\/+/,
                                ''
                            ) as `${string}.${string}`)
                          : (dep.path.replace(
                                /\/+/g,
                                '/'
                            ) as `${string}.${string}`)
                  }
        )
    }

    if ('iconUrl' in data && 'localizations' in data) {
        return {
            ...base,
            iconUrl: data.iconUrl as `${string}/${string}.pic`,
            localizations: data.localizations
                .map((l) => l.value)
                .filter(Boolean) as `${string}/${string}.lang`[]
        }
    } else {
        return {
            ...base,
            path: data.mainFilePath as `${string}.lua`
        }
    }
}

export interface PublicationFieldsProps {
    form: UseFormReturn<PublishFormValues & FieldValues>
}

export default function PublishFormFields({ form }: PublicationFieldsProps) {
    const { control, register, watch } = form

    const previewsFieldArray = useFieldArray({
        control,
        name: 'previews'
    })

    const dependenciesFieldArray = useFieldArray({
        control,
        name: 'dependencies'
    })

    const categories = usePublicationCategories()
    const category = Number(watch('category'))
    const packaged = isPackaged(category)

    return (
        <FieldGroup>
            <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="category">Category</FieldLabel>
                        <Select
                            value={String(field.value)}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                                {categories.map((cat) => (
                                    <SelectItem
                                        key={cat.enum}
                                        value={cat.enum.toString()}
                                    >
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="name">Publication name</FieldLabel>
                        <Input
                            id="name"
                            type="text"
                            placeholder="My publication"
                            required
                            {...field}
                        />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="description">
                            Description
                        </FieldLabel>
                        <Textarea
                            placeholder="This software does..."
                            {...field}
                        />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            <Controller
                name="license"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="license">License</FieldLabel>
                        <Select
                            name={field.name}
                            value={String(field.value)}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                                {licenses.map((licence) => (
                                    <SelectItem
                                        key={licence.enum}
                                        value={licence.enum.toString()}
                                    >
                                        {licence.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            <Controller
                name="mainFileUrl"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="mainFileUrl">
                            Main file URL
                        </FieldLabel>
                        <Input
                            id="mainFileUrl"
                            type="url"
                            placeholder="https://raw.githubusercontent.com/.../Main.lua"
                            required
                            {...field}
                        />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            {packaged ? (
                <PackagedFields form={form} />
            ) : (
                <NotPackagedFields form={form} />
            )}

            <Field>
                <FieldLabel>Previews</FieldLabel>
                <div className="flex flex-col gap-2">
                    {previewsFieldArray.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <InputGroup>
                                <InputGroupInput
                                    {...register(`previews.${index}.value`)}
                                    placeholder={
                                        'https://example.com/.../Previews/1.pic'
                                    }
                                    required
                                />
                                <InputGroupAddon align={'inline-end'}>
                                    <InputGroupButton
                                        size={'icon-xs'}
                                        onClick={() =>
                                            previewsFieldArray.remove(index)
                                        }
                                    >
                                        <X />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => previewsFieldArray.append({ value: '' })}
                    >
                        <Plus />
                        Add preview
                    </Button>
                </div>
            </Field>
            <Field>
                <FieldLabel>Dependencies</FieldLabel>

                <div className="flex flex-col gap-2">
                    {dependenciesFieldArray.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <InputGroup>
                                <InputGroupAddon>
                                    {field.type === 'publication' ? (
                                        <SquareLibrary />
                                    ) : (
                                        <Link />
                                    )}
                                </InputGroupAddon>
                                <InputGroupInput
                                    {...register(
                                        dependenciesFieldArray.fields[index]
                                            .type === 'publication'
                                            ? `dependencies.${index}.publicationName`
                                            : `dependencies.${index}.sourceUrl`
                                    )}
                                    readOnly
                                    required
                                />
                                <InputGroupAddon align={'inline-end'}>
                                    <AddDependencyDialog
                                        dependenciesFieldArray={
                                            dependenciesFieldArray
                                        }
                                        packaged={packaged}
                                        defaultValues={field}
                                        index={index}
                                    >
                                        <InputGroupButton size={'icon-xs'}>
                                            <Pencil />
                                        </InputGroupButton>
                                    </AddDependencyDialog>
                                    <InputGroupButton
                                        size={'icon-xs'}
                                        onClick={() =>
                                            dependenciesFieldArray.remove(index)
                                        }
                                    >
                                        <X />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    ))}

                    <AddDependencyDialog
                        dependenciesFieldArray={dependenciesFieldArray}
                        packaged={packaged}
                    >
                        <Button type="button" variant="outline">
                            <Plus />
                            Add dependency
                        </Button>
                    </AddDependencyDialog>
                </div>
            </Field>
        </FieldGroup>
    )
}
