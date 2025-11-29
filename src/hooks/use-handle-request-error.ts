import { ApiError } from 'mineos-market-client'
import { toast } from 'sonner'
import { useExtracted } from 'next-intl'

export default function useHandleRequestError() {
    const t = useExtracted()

    return (error: unknown, action: string, silent: boolean = false) => {
        let message: string

        if (error instanceof ApiError) {
            message = error.message
        } else if (error instanceof Error) {
            message = t('Error {while}: {message}', {
                while: action,
                message: error.message
            })
        } else {
            message = t('Unexpected error {while}: {error}', {
                while: action,
                error: String(error)
            })
        }

        if (!silent) toast.error(message)

        return message
    }
}
