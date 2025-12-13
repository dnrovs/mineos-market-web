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
import { useConfig } from '@/hooks/use-config'
import { AlertDialogTriggerProps } from '@radix-ui/react-alert-dialog'
import { useExtracted } from 'next-intl'
import { toast } from 'sonner'

export default function ResetSettingsAlertDialogTrigger({
    ...props
}: AlertDialogTriggerProps) {
    const { resetConfig } = useConfig()

    const t = useExtracted()

    const resetSettings = () => {
        resetConfig()

        location.reload()

        toast.success(t('Settings reset successfully.'))
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger {...props} />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('Reset settings?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t(
                            'This will reset settings from Behaviour and Developer tabs to their default values. Use this if something went wrong with your settings.'
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => resetSettings()}>
                        {t('Reset')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
