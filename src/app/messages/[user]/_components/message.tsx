import { useMarket } from '@/context/MarketProvider'
import type { Message as MessageT } from 'mineos-market-client'
import { clsx } from 'clsx'
import { formatTime } from '@/utils/format-date-label'

export default function Message({ message }: { message: MessageT }) {
    const { user } = useMarket()
    const outgoing = user?.name === message.userName

    return (
        <div className={clsx('flex w-full flex-col')}>
            <div
                className={clsx(
                    'flex w-max max-w-xs flex-col overflow-hidden rounded-xl p-2 text-wrap break-words xl:max-w-sm',
                    outgoing
                        ? 'bg-primary text-primary-foreground self-end rounded-br-lg text-right'
                        : 'bg-accent text-accent-foreground self-start rounded-bl-lg text-left'
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
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    )
}
