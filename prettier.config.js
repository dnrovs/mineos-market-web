export default {
    tabWidth: 4,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    importOrder: ['^@/(.*)$', '^[./]'],
    importOrderSeparation: true,
    plugins: [
        '@trivago/prettier-plugin-sort-imports',
        'prettier-plugin-tailwindcss'
    ]
}
