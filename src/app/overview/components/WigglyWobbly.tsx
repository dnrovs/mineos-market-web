'use client'

import type React from 'react'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Spinner } from '@/components/ui/shadcn/spinner'

interface Icon {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    url: string
}

interface WigglyWobblyProps {
    iconUrls: string[]
    children?: React.ReactNode
}

export default function WigglyWobbly({
    iconUrls,
    children
}: WigglyWobblyProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [icons, setIcons] = useState<Icon[]>([])
    const [isMouseDown, setIsMouseDown] = useState(false)
    const mousePos = useRef({ x: 0, y: 0 })
    const animationFrameId = useRef<number>(0)

    const ICON_SIZE = 64
    const SPEED = 2
    const ATTRACTION_STRENGTH = 0.3

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const rect = container.getBoundingClientRect()

        const initialIcons: Icon[] = iconUrls.map((url, index) => ({
            id: index,
            x: Math.random() * (rect.width - ICON_SIZE),
            y: Math.random() * (rect.height - ICON_SIZE),
            vx: (Math.random() - 0.5) * SPEED,
            vy: (Math.random() - 0.5) * SPEED,
            url
        }))

        setIcons(initialIcons)
    }, [iconUrls])

    useEffect(() => {
        if (!containerRef.current || icons.length === 0) return

        const animate = () => {
            setIcons((prevIcons) => {
                const container = containerRef.current
                if (!container) return prevIcons

                const rect = container.getBoundingClientRect()

                return prevIcons.map((icon) => {
                    let { x, y, vx, vy } = icon

                    if (isMouseDown) {
                        const dx = mousePos.current.x - (x + ICON_SIZE / 2)
                        const dy = mousePos.current.y - (y + ICON_SIZE / 2)
                        vx += dx * ATTRACTION_STRENGTH * 0.01
                        vy += dy * ATTRACTION_STRENGTH * 0.01

                        const maxSpeed = 8
                        const speed = Math.sqrt(vx * vx + vy * vy)
                        if (speed > maxSpeed) {
                            vx = (vx / speed) * maxSpeed
                            vy = (vy / speed) * maxSpeed
                        }
                    }

                    x += vx
                    y += vy

                    if (x <= 0 || x >= rect.width - ICON_SIZE) {
                        vx = -vx * 0.95
                        x = x <= 0 ? 0 : rect.width - ICON_SIZE
                    }
                    if (y <= 0 || y >= rect.height - ICON_SIZE) {
                        vy = -vy * 0.95
                        y = y <= 0 ? 0 : rect.height - ICON_SIZE
                    }

                    return { ...icon, x, y, vx, vy }
                })
            })

            animationFrameId.current = requestAnimationFrame(animate)
        }

        animationFrameId.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current)
            }
        }
    }, [icons.length, isMouseDown])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        mousePos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
            className="relative h-full w-full"
            style={{ cursor: isMouseDown ? 'grabbing' : 'grab' }}
        >
            {icons.map((icon) => (
                <div
                    key={icon.id}
                    className="absolute transition-transform"
                    style={{
                        left: `${icon.x}px`,
                        top: `${icon.y}px`,
                        width: `${ICON_SIZE}px`,
                        height: `${ICON_SIZE}px`
                    }}
                >
                    <Image
                        src={icon.url || '/placeholder.svg'}
                        alt={`Icon ${icon.id}`}
                        className="h-full w-full rounded-xl shadow-lg select-none"
                        draggable={false}
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                    />
                </div>
            ))}

            {icons.length === 0 && (
                <Spinner className={'mx-auto my-auto size-10'} />
            )}

            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}
