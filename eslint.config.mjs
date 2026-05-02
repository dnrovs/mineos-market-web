import nextVitals from 'eslint-config-next/core-web-vitals'
import { defineConfig } from 'eslint/config'

const eslintConfig = defineConfig(
    {
        ignores: [
            'src/components/shadcn',
            'src/utils/shadcn',
            'src/components/ui/shadcn',
            'src/lib/shadcn',
            'src/hooks/shadcn',

            'src/components/ui/shadcn-io'
        ]
    },
    [...nextVitals]
)

export default eslintConfig
