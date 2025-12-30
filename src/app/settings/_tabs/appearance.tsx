import WallpaperRadioGroup from '@/app/settings/_components/wallpaper-radio-group'
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
import { chatWallpapers } from '@/lib/constants'
import { useExtracted } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'

export default function Appearance() {
    const { config } = useConfig()
    const saveSettings = useSaveSettings()

    const t = useExtracted()

    const appearanceConfigurationForm = useForm<Config['appearance']>({
        defaultValues: config.appearance
    })

    return (
        <form
            onSubmit={appearanceConfigurationForm.handleSubmit((values) =>
                saveSettings('appearance', values)
            )}
        >
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>{t('Chat wallpapers')}</FieldLegend>
                    <FieldDescription>
                        {t(
                            'Control which wallpapers you see during conversations.'
                        )}
                    </FieldDescription>

                    <FieldGroup>
                        <Controller
                            name={'chatWallpaperDark'}
                            control={appearanceConfigurationForm.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>{t('Dark theme')}</FieldLabel>

                                    <WallpaperRadioGroup
                                        wallpapers={chatWallpapers.dark}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </Field>
                            )}
                        />

                        <Controller
                            name={'chatWallpaperLight'}
                            control={appearanceConfigurationForm.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>{t('Light theme')}</FieldLabel>

                                    <WallpaperRadioGroup
                                        wallpapers={chatWallpapers.light}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>

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
                    <FieldLegend>{t('Picture rendering')}</FieldLegend>
                    <FieldDescription>
                        {t(
                            'Control how converted .pic images are displayed in the application.'
                        )}
                    </FieldDescription>

                    <FieldGroup>
                        <Controller
                            name={'showAnimatedPublicationBackgrounds'}
                            control={appearanceConfigurationForm.control}
                            render={({ field }) => (
                                <Field orientation={'horizontal'}>
                                    <FieldLabel>
                                        {t(
                                            'Show animated publication backgrounds'
                                        )}
                                    </FieldLabel>
                                    <Switch
                                        name={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </Field>
                            )}
                        />
                        <Controller
                            name={'showPublicationIcons'}
                            control={appearanceConfigurationForm.control}
                            render={({ field }) => (
                                <Field orientation={'horizontal'}>
                                    <FieldLabel>
                                        {t('Show publication icons')}
                                    </FieldLabel>
                                    <Switch
                                        name={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </Field>
                            )}
                        />
                        <Controller
                            name={'showPublicationPreviews'}
                            control={appearanceConfigurationForm.control}
                            render={({ field }) => (
                                <Field orientation={'horizontal'}>
                                    <FieldLabel>
                                        {t('Show publication previews')}
                                    </FieldLabel>
                                    <Switch
                                        name={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
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
