import { Minus, Plus } from 'lucide-react'
import { useExtracted } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/shadcn/button'
import { ButtonGroup } from '@/components/ui/shadcn/button-group'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet
} from '@/components/ui/shadcn/field'
import { Input } from '@/components/ui/shadcn/input'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText
} from '@/components/ui/shadcn/input-group'
import { Switch } from '@/components/ui/shadcn/switch'
import { Config, useConfig } from '@/hooks/use-config'

export default function BehaviourTab() {
    const { config, setConfig, resetConfig } = useConfig()

    const t = useExtracted()

    const appearanceConfigurationForm = useForm<Config['behaviour']>({
        defaultValues: config.behaviour
    })

    return (
        <form
            onSubmit={appearanceConfigurationForm.handleSubmit((values) => {
                setConfig({ behaviour: values })
                location.reload()
            })}
        >
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>{t('Avatars')}</FieldLegend>
                    <FieldDescription>
                        {t(
                            'Control how avatars are displayed in the application.'
                        )}
                    </FieldDescription>

                    <FieldGroup>
                        <Controller
                            name={'useAvatarImages'}
                            control={appearanceConfigurationForm.control}
                            render={({ field }) => (
                                <Field orientation={'horizontal'}>
                                    <FieldLabel>
                                        {t('Use avatar images')}
                                    </FieldLabel>
                                    <Switch
                                        name={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <span>{field.value}</span>
                                </Field>
                            )}
                        />
                        <Controller
                            name={'avatarProvider'}
                            control={appearanceConfigurationForm.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>
                                        {t('Avatar provider')}
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        disabled={
                                            !appearanceConfigurationForm.watch(
                                                'useAvatarImages'
                                            )
                                        }
                                        placeholder={
                                            'https://tapback.co/api/avatar/'
                                        }
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>
                <FieldSet>
                    <FieldLegend>{t('Messages')}</FieldLegend>
                    <FieldDescription>
                        {t('Control how messages behave in the application.')}
                    </FieldDescription>

                    <FieldGroup>
                        <Controller
                            name={'dialogsUpdateInterval'}
                            control={appearanceConfigurationForm.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>
                                        {t('Dialogs update interval')}
                                    </FieldLabel>

                                    <ButtonGroup>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                placeholder={'10'}
                                            />
                                            <InputGroupAddon
                                                align={'inline-end'}
                                            >
                                                <InputGroupText>
                                                    {t('sec')}
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <Button
                                            variant={'outline'}
                                            size={'icon'}
                                            type={'button'}
                                            onClick={() =>
                                                appearanceConfigurationForm.setValue(
                                                    'dialogsUpdateInterval',
                                                    Number(field.value) + 1
                                                )
                                            }
                                        >
                                            <Plus />
                                        </Button>
                                        <Button
                                            variant={'outline'}
                                            size={'icon'}
                                            type={'button'}
                                            onClick={() =>
                                                appearanceConfigurationForm.setValue(
                                                    'dialogsUpdateInterval',
                                                    Number(field.value) - 1
                                                )
                                            }
                                        >
                                            <Minus />
                                        </Button>
                                    </ButtonGroup>
                                </Field>
                            )}
                        />
                        <Controller
                            name={'chatUpdateInterval'}
                            control={appearanceConfigurationForm.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>
                                        {t('Chat update interval')}
                                    </FieldLabel>

                                    <ButtonGroup>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                placeholder={'5'}
                                            />
                                            <InputGroupAddon
                                                align={'inline-end'}
                                            >
                                                <InputGroupText>
                                                    {t('sec')}
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <Button
                                            variant={'outline'}
                                            size={'icon'}
                                            type={'button'}
                                            onClick={() =>
                                                appearanceConfigurationForm.setValue(
                                                    'chatUpdateInterval',
                                                    Number(field.value) + 1
                                                )
                                            }
                                        >
                                            <Plus />
                                        </Button>
                                        <Button
                                            variant={'outline'}
                                            size={'icon'}
                                            type={'button'}
                                            onClick={() =>
                                                appearanceConfigurationForm.setValue(
                                                    'chatUpdateInterval',
                                                    Number(field.value) - 1
                                                )
                                            }
                                        >
                                            <Minus />
                                        </Button>
                                    </ButtonGroup>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>
                <Field orientation={'horizontal'}>
                    <Button type={'submit'}>{t('Save')}</Button>
                    <Button
                        variant={'secondary'}
                        onClick={() => resetConfig('behaviour')}
                    >
                        {t('Restore default')}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
