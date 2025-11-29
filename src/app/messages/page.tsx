import { useExtracted } from 'next-intl'

export default function Messages() {
    const t = useExtracted()

    return (
        <span
            className={
                'flex h-full w-full items-center justify-center text-lg font-light'
            }
        >
            {t('Open chat to start talking')}
        </span>
    )
}
