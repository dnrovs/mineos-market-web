import { Button } from '@/components/ui/shadcn/button'
import clsx from 'clsx'
import Link, { LinkProps } from 'next/link'
import React from 'react'

interface ButtonLinkProps extends LinkProps {
    children?: React.ReactNode
    className?: string
}

export default function ButtonLink({
    children,
    className,
    ...props
}: ButtonLinkProps) {
    return (
        <Button
            variant={'link'}
            className={clsx(
                'text-foreground h-auto p-0! text-base font-normal underline-offset-2 focus-visible:underline focus-visible:ring-0',
                className
            )}
            asChild
        >
            <Link {...props}>{children}</Link>
        </Button>
    )
}
