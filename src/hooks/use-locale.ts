import { getCookie, setCookie } from 'cookies-next'
import { useExtracted, useLocale as useLocaleValue } from 'next-intl'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

export function useLocale() {
    const t = useExtracted()
    const locale = useLocaleValue()
    const router = useRouter()

    const setLocale = (locale: string) => {
        if (!getCookie('locale'))
            toast.info(
                t(
                    'This application uses cookies to save your language preferences.'
                )
            )

        setCookie('locale', locale, { path: '/', maxAge: 31556926 })

        router.refresh()
    }

    return { locale, setLocale }
}
