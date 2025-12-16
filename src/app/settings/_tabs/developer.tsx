import { useExtracted } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'

import { useSaveSettings } from '@/app/settings/page'
import { Button } from '@/components/ui/shadcn/button'
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
import { Switch } from '@/components/ui/shadcn/switch'
import { Config, useConfig } from '@/hooks/use-config'

export default function DeveloperTab() {
    const { config, setConfig } = useConfig()
    const saveSettings = useSaveSettings()

    const t = useExtracted()

    const serverConfigurationForm = useForm<Config['server']>({
        defaultValues: config.server
    })

    return (
        <FieldSet>
            <FieldLegend>{t('Server configuration')}</FieldLegend>
            <FieldDescription>
                {t('Control how the application connects to the server.')}
            </FieldDescription>
            <form
                onSubmit={serverConfigurationForm.handleSubmit((values) =>
                    saveSettings('server', values)
                )}
            >
                <FieldGroup>
                    <Controller
                        name={'hostUrl'}
                        control={serverConfigurationForm.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>{t('Host URL')}</FieldLabel>
                                <Input
                                    {...field}
                                    placeholder={
                                        'http://mineos.local/MineOSAPI/2.04/'
                                    }
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name={'proxyUrl'}
                        control={serverConfigurationForm.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>{t('Proxy URL')}</FieldLabel>
                                <Input
                                    {...field}
                                    placeholder={'https://corsproxy.io/?url='}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name={'validateResponses'}
                        control={serverConfigurationForm.control}
                        render={({ field }) => (
                            <Field orientation={'horizontal'}>
                                <FieldLabel>
                                    {t('Validate server responses')}
                                </FieldLabel>
                                <Switch
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </Field>
                        )}
                    />

                    <Field>
                        <Button type={'submit'}>{t('Save')}</Button>
                    </Field>
                </FieldGroup>
            </form>
        </FieldSet>
    )
}
