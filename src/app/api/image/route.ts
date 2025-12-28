import sharpen from '@/app/api/image/_utils/sharpen'
import { NextRequest, NextResponse } from 'next/server'
import { OCIF } from 'ocif-js'

export async function GET(request: NextRequest) {
    const urlParam = request.nextUrl.searchParams.get('url')
    if (!urlParam) {
        return new NextResponse(undefined, { status: 400 })
    }

    let parsed: URL
    try {
        parsed = new URL(urlParam)
    } catch {
        return new NextResponse(undefined, { status: 400 })
    }

    const scale = Number(request.nextUrl.searchParams.get('scale') ?? 1)
    if (!Number.isInteger(scale) || scale < 1 || scale > 8)
        return new NextResponse(undefined, {
            status: 400
        })

    const sharp = request.nextUrl.searchParams.get('sharp') === 'true'

    try {
        const response = await fetch(parsed.href)
        if (!response.ok)
            return new NextResponse(undefined, {
                status: 502
            })

        const buffer = Buffer.from(await response.arrayBuffer())
        let picture = OCIF.fromBuffer(buffer)

        if (picture.height > 16 || picture.width > 64)
            return new NextResponse(undefined, {
                status: 400
            })

        if (sharp) picture = sharpen(picture)

        const pngBuffer = picture.toPNG(scale)
        const pngArrayBuffer = new Uint8Array(pngBuffer).buffer

        return new NextResponse(pngArrayBuffer)
    } catch {
        return new NextResponse(undefined, { status: 500 })
    }
}
