import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url)

    const targetUrl = searchParams.get('url')
    const isMineOSApi = targetUrl?.split('?')[0].includes('/MineOSAPI/2.04/')

    if (!targetUrl) {
        return NextResponse.json(
            { error: "Missing 'value' query parameter." },
            { status: 400 }
        )
    }

    if (!isMineOSApi) {
        return NextResponse.json(
            { error: 'Only MineOS API URLs are allowed.' },
            { status: 403 }
        )
    }

    try {
        let body
        if (
            req.headers.get('Content-Type') ===
            'application/x-www-form-urlencoded'
        ) {
            const formData = await req.formData()

            body = new URLSearchParams(
                Array.from(formData.entries()).map(([k, v]) => [k, String(v)])
            ).toString()
        }

        const res = await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': req.headers.get('User-Agent') ?? ''
            },
            method: 'POST',
            body
        })

        const arrayBuffer = await res.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const headers: Record<string, string> = {}
        res.headers.forEach((value, key) => {
            if (key.toLowerCase() !== 'content-encoding') {
                headers[key] = value
            }
        })

        return new NextResponse(buffer, {
            status: res.status,
            headers
        })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: 'Error fetching target URL.', details: error.message },
                { status: 500 }
            )
        }
    }
}
