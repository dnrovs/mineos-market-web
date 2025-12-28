import { OCIF } from 'ocif-js'

const cornerCharacters = [
    { x: 0, y: 0, character: '⣾' },
    { x: 7, y: 0, character: '⣷' },
    { x: 0, y: 3, character: '⢿' },
    { x: 7, y: 3, character: '⡿' }
] as const

export default function sharpen(icon: OCIF): OCIF {
    const corners = cornerCharacters.map(({ x, y, character }) => {
        const pixel = icon.getPixel(x, y)
        if (!pixel) return null
        return { x, y, expected: character, pixel }
    })

    if (corners.some((c) => c === null)) {
        return icon
    }

    if (!corners.every((c) => c!.pixel.character === c!.expected)) {
        return icon
    }

    for (const c of corners) {
        icon.setPixel(c!.x, c!.y, {
            ...c!.pixel,
            background: c!.pixel.foreground,
            alpha: 0
        })
    }

    return icon
}
