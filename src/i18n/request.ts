import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

import { parse, pick } from 'accept-language-parser'

import { locales } from '@/lib/constants'

const codes = locales.map((l) => l.code)

const validate = (locale?: string) =>
    locale && codes.includes(locale) ? locale : undefined

export default getRequestConfig(async (params) => {
    const param = validate(params.locale)
    const stored = validate((await cookies()).get('locale')?.value)
    const acceptLanguage = pick(
        codes,
        parse((await headers()).get('accept-language') || undefined)
    )
    const fallback = codes[0]

    const locale = param || stored || acceptLanguage || fallback
    const messages = (await import(`../../messages/${locale}.po`)).default

    return {
        locale,
        messages
    }
})
