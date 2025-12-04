import { ChangePasswordParams } from 'mineos-market-client'
import { useExtracted } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/shadcn/button'
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/shadcn/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/shadcn/field'
import { Input } from '@/components/ui/shadcn/input'
import { useMarket } from '@/context/MarketProvider'
import handleFetchError from '@/hooks/use-handle-request-error'
import useHandleRequestError from '@/hooks/use-handle-request-error'

type ChangePasswordFormValues = Omit<ChangePasswordParams, 'email'>

export default function ChangePasswordDialog() {
    const { user, client } = useMarket()

    const t = useExtracted()

    const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>()
    const handleRequestError = useHandleRequestError()

    if (!user) return null

    const changePassword = async (data: ChangePasswordFormValues) => {
        const changePasswordPromise = client.auth
            .changePassword({
                email: user.email,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            })
            .then(() => {
                reset()
            })
            .catch((error) => {
                throw new Error(
                    handleRequestError(
                        error,
                        t('while changing password'),
                        true
                    )
                )
            })

        toast.promise(changePasswordPromise, {
            loading: 'Changing your password...',
            success: 'Your password has been changed successfully.',
            error: (error: Error) => error.message
        })
    }

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Change password</DialogTitle>
                <DialogDescription>
                    Set a new password for your account.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(changePassword)}>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Current password</FieldLabel>
                        <Controller
                            name={'currentPassword'}
                            control={control}
                            render={({ field }) => (
                                <Input type="password" {...field} />
                            )}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>New password</FieldLabel>
                        <Controller
                            name={'newPassword'}
                            control={control}
                            render={({ field }) => (
                                <Input type="password" {...field} />
                            )}
                        />
                    </Field>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit">Change password</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </FieldGroup>
            </form>
        </DialogContent>
    )
}
