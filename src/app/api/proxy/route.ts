import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
        return new NextResponse(undefined, { status: 400 })
    }

    let parsed: URL
    try {
        parsed = new URL(url)
    } catch {
        return new NextResponse(undefined, { status: 400 })
    }

    if (!parsed.pathname.startsWith('/MineOSAPI/2.04/'))
        return new NextResponse(undefined, { status: 403 })

    let upstream: Response

    try {
        upstream = await fetch(parsed.href, {
            method: request.method,
            headers: request.headers,
            body: request.body,
            duplex: 'half',
            redirect: 'manual'
        } as RequestInit)
    } catch (error) {
        return new NextResponse(undefined, { status: 502 })
    }

    const responseHeaders = new Headers(upstream.headers)
    responseHeaders.delete('content-encoding')

    return new NextResponse(upstream.body, {
        ...upstream,
        headers: responseHeaders
    })
}
