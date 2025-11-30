import * as fs from 'node:fs'
import Link from 'next/link'

const build = fs.readFileSync('.next/BUILD_ID', 'utf8').slice(0, 8)

export default function BetaLabel() {
    return (
        <div
            className={
                'bg-background/50 text-muted-foreground fixed top-1 left-1/2 z-50 -translate-x-1/2 text-xs'
            }
        >
            beta build {build} by{' '}
            <Link
                href={'https://github.com/dnrovs'}
                className={'text-foreground'}
            >
                dnrovs
            </Link>
        </div>
    )
}
