import { JsonLdObject } from 'schema-dts-lib'

export function JsonLd({ jsonLd }: { jsonLd: JsonLdObject }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
            }}
        />
    )
}
