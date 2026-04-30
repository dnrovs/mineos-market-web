/** @type {import("prettier").Config & Record<string, unknown>} */
const prettierConfig = {
    bracketSpacing: true,
    tabWidth: 4,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'none',

    plugins: [
        'prettier-plugin-organize-imports',
        'prettier-plugin-tailwindcss'
    ],

    tailwindStylesheet: 'src/app/globals.css',
    tailwindFunctions: ['cn', 'cva']
}

export default prettierConfig
