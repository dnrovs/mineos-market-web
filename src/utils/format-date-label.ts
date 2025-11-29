/*
 export default function formatDate(timestamp: number) {
    const raw = new Date(timestamp * 1000)
    const now = Date.now()
    const diffMs = now - raw.getTime()

    const ONE_DAY = 86400000
    const ONE_YEAR = 31557600000

    if (diffMs < ONE_DAY) {
        return raw.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        })
    } else if (diffMs < ONE_YEAR) {
        return raw.toLocaleString(undefined, {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } else {
        return raw.toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }
}
*/

export function formatTime(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function formatDateLabel(timestamp: number): string {
    const date = new Date(timestamp * 1000)
    const today = new Date()

    const twoDaysMs = 2 * 24 * 60 * 60 * 1000

    if (date.getTime() - today.getTime() < twoDaysMs) {
        return new Intl.RelativeTimeFormat(undefined, {
            numeric: 'auto'
        }).format(date.getDay(), 'day')
    } else {
        return date.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year:
                date.getFullYear() !== today.getFullYear()
                    ? 'numeric'
                    : undefined
        })
    }
}
