import { Button } from '@/components/ui/shadcn/button'
import React from 'react'
import Link, { LinkProps } from 'next/link'
import clsx from 'clsx'

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
                'h-auto p-0 text-base font-normal focus-visible:underline focus-visible:ring-0',
                className
            )}
            asChild
        >
            <Link {...props}>{children}</Link>
        </Button>
    )
}
