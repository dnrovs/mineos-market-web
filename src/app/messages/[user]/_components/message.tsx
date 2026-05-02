import { clsx } from 'clsx'
import type { Message as MessageT } from 'mineos-market-client'

import { useMarket } from '@/context/MarketProvider'
import { useFormatter } from 'next-intl'

export default function Message({ message }: { message: MessageT }) {
    const { user } = useMarket()

    const format = useFormatter()

    const outgoing = user?.name === message.userName

    return (
        <div className={clsx('flex w-full flex-col')}>
            <div
                className={clsx(
                    'flex w-max max-w-xs flex-col overflow-hidden rounded-xl p-2 text-wrap wrap-break-word xl:max-w-sm',
                    outgoing
                        ? 'self-end rounded-br-lg bg-primary text-right text-primary-foreground'
                        : 'self-start rounded-bl-lg bg-accent/25 text-left text-accent-foreground backdrop-blur-2xl backdrop-brightness-95 dark:backdrop-brightness-200'
                )}
            >
                <span>{message.text}</span>
                <span
                    className={clsx(
                        'text-sm font-medium',
                        outgoing
                            ? 'text-primary-foreground/50'
                            : 'text-accent-foreground/50'
                    )}
                >
                    {format.dateTime(new Date(message.timestamp * 1000), {
                        timeStyle: 'short'
                    })}
                </span>
            </div>
        </div>
    )
}
