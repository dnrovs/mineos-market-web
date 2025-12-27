import { cn } from '@/utils/shadcn'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    children: React.ReactElement<
        React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
    >
}
export default function HorizontalScrollShadow({
    children,
    className,
    ...props
}: Props & React.HTMLAttributes<HTMLDivElement>) {
    const childRef = useRef<HTMLElement | null>(null)

    const [show, setShow] = useState(true)

    const child = React.cloneElement(children, {
        ref: childRef
    })

    useEffect(() => {
        const element = childRef.current
        if (!element) return

        const onScroll = () => {
            setShow(
                element.scrollLeft < element.scrollWidth - element.clientWidth
            )
        }

        element.addEventListener('scroll', onScroll)
        return () => element.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div className={cn('relative', className)} {...props}>
            <span
                className={cn(
                    'via-background pointer-events-none absolute h-full w-full from-transparent from-80% via-100%',
                    show && 'bg-linear-to-r'
                )}
            />

            {child}
        </div>
    )
}
