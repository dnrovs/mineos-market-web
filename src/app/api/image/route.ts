import { OCIF } from '@dnrovs/ocif'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const pictureUrl = searchParams.get('url')

    const scale = Number(searchParams.get('scale') ?? 1)

    if (!pictureUrl) return new NextResponse(undefined, { status: 404 })

    try {
        const pictureArrayBuffer = await (await fetch(pictureUrl)).arrayBuffer()

        const pictureBuffer = Buffer.from(pictureArrayBuffer)

        const picture = OCIF.fromBuffer(pictureBuffer)

        const pngBuffer = picture.toPNG(scale)

        const pngArrayBuffer = new Uint8Array(pngBuffer).buffer

        return new NextResponse(pngArrayBuffer)
    } catch (error) {
        if (error instanceof TypeError)
            return new NextResponse(error.message, { status: 400 })

        if (error instanceof Error)
            return new NextResponse(error.message, { status: 500 })

        return new NextResponse(String(error), { status: 500 })
    }
}
