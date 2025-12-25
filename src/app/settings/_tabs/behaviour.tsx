import { Minus, Plus } from 'lucide-react'
import { useExtracted } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'

import { useSaveSettings } from '@/app/settings/page'
import { Button } from '@/components/ui/shadcn/button'
import { ButtonGroup } from '@/components/ui/shadcn/button-group'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet
} from '@/components/ui/shadcn/field'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText
} from '@/components/ui/shadcn/input-group'
import { Config, useConfig } from '@/hooks/use-config'

export default function BehaviourTab() {
    const { config } = useConfig()
    const saveSettings = useSaveSettings()

    const t = useExtracted()

    const behaviourConfigurationForm = useForm<Config['behaviour']>({
        defaultValues: config.behaviour
    })

    return (
        <form
            onSubmit={behaviourConfigurationForm.handleSubmit((values) =>
                saveSettings('behaviour', values)
            )}
        >
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>{t('Messages')}</FieldLegend>
                    <FieldDescription>
                        {t('Control how messages behave in the application.')}
                    </FieldDescription>

                    <FieldGroup>
                        <Controller
                            name={'dialogsUpdateInterval'}
                            control={behaviourConfigurationForm.control}
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
                                                behaviourConfigurationForm.setValue(
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
                                                behaviourConfigurationForm.setValue(
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
                            control={behaviourConfigurationForm.control}
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
                                                behaviourConfigurationForm.setValue(
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
                                                behaviourConfigurationForm.setValue(
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
                <Field>
                    <Button type={'submit'}>{t('Save')}</Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
