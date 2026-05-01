import { Card } from '@/components/ui/shadcn/card'
import { cn } from '@/lib/shadcn/utils'
import React from 'react'

export default function ResponsiveCard({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <Card
            className={cn(
                'mx-auto my-px mb-6 h-fit w-full overflow-visible max-sm:border-none max-sm:bg-transparent max-sm:p-0 max-sm:shadow-none max-sm:ring-0 sm:mb-3 sm:w-md',
                className
            )}
            {...props}
        />
    )
}
