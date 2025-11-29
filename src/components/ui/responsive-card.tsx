import React from 'react'
import { Card } from '@/components/ui/shadcn/card'
import { cn } from '@/utils/shadcn'

export default function ResponsiveCard({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <Card
            className={cn(
                'mx-auto mb-6 w-full max-sm:border-none max-sm:bg-transparent max-sm:p-0 sm:mb-3 sm:w-md',
                className
            )}
            {...props}
        />
    )
}
