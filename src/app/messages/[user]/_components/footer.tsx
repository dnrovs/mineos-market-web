import { clsx } from 'clsx'
import { ArrowUp } from 'lucide-react'
import { useExtracted } from 'next-intl'
import { useStickToBottomContext } from 'use-stick-to-bottom'

import { Button } from '@/components/ui/shadcn/button'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from '@/components/ui/shadcn/input-group'
import { Spinner } from '@/components/ui/shadcn/spinner'
import { useMediaQuery } from 'usehooks-ts'

interface FooterProps {
    dialogUserName: string
    sendMessage: () => void
    message: string
    setMessage: (message: string) => void
    sending: boolean
    intervalLoading: boolean
}

export default function Footer({
    dialogUserName,
    sendMessage,
    message,
    setMessage,
    sending,
    intervalLoading
}: FooterProps) {
    const t = useExtracted()

    const { scrollToBottom } = useStickToBottomContext()
    const isMobile = useMediaQuery('(max-width: 768px)')

    const handleSendMessage = () => {
        sendMessage()
        scrollToBottom()
    }

    return (
        <footer className="sticky bottom-0 mb-[env(safe-area-inset-bottom)] flex w-full justify-center backdrop-blur-md">
            <div
                className={
                    'flex w-full max-w-300 items-center justify-between gap-2 p-3'
                }
            >
                <InputGroup
                    className={
                        'bg-primary/10 w-full rounded-full border-none shadow-none'
                    }
                >
                    <InputGroupInput
                        className={'placeholder:text-foreground/50'}
                        placeholder={t('Say something to {dialogUserName}...', {
                            dialogUserName
                        })}
                        enterKeyHint={'send'}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') handleSendMessage()
                        }}
                        onFocus={() => setTimeout(() => scrollToBottom(), 200)}
                        value={message}
                        disabled={sending}
                        onInput={(onchange) =>
                            setMessage(onchange.currentTarget.value)
                        }
                    />
                    <InputGroupAddon align={'inline-end'}>
                        <Spinner
                            className={clsx('transition-discrete', {
                                hidden: !intervalLoading
                            })}
                        />
                    </InputGroupAddon>
                </InputGroup>
                <Button
                    className={'rounded-full'}
                    size={isMobile ? 'icon' : 'default'}
                    onClick={handleSendMessage}
                    disabled={sending}
                >
                    <ArrowUp />
                    <span className={'hidden md:block'}> {t('Send')}</span>
                </Button>
            </div>
        </footer>
    )
}
