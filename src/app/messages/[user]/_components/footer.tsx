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

    const handleSendMessage = () => {
        sendMessage()
        scrollToBottom()
    }

    return (
        <footer className="bg-background/75 lg:bg-sidebar/75 sticky bottom-0 mb-[env(safe-area-inset-bottom)] flex w-full justify-center gap-2 p-3 backdrop-blur-md">
            <InputGroup className={'w-full max-w-283 rounded-full'}>
                <InputGroupInput
                    placeholder={t('Say something to {dialogUserName}...', {
                        dialogUserName
                    })}
                    enterKeyHint={'send'}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') handleSendMessage()
                    }}
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
                className="rounded-full"
                size="icon"
                onClick={handleSendMessage}
                disabled={sending}
            >
                <ArrowUp />
            </Button>
        </footer>
    )
}
