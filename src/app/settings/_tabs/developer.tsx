import { useExtracted } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'

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
import { Config, useConfig } from '@/hooks/use-config'

export default function DeveloperTab() {
    const { config, setConfig, resetConfig } = useConfig()
    const router = useRouter()

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
                onSubmit={serverConfigurationForm.handleSubmit((values) => {
                    setConfig({ server: values })
                    router.refresh()
                })}
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
                    <Field orientation={'horizontal'}>
                        <Button type={'submit'}>{t('Save')}</Button>
                        <Button
                            variant={'secondary'}
                            onClick={() => resetConfig('server')}
                        >
                            {t('Restore default')}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </FieldSet>
    )
}
