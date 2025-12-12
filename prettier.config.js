export default {
    tabWidth: 4,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    importOrder: ['^@/(.*)$', '^[./]'],
    importOrderSeparation: true,
    plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss']
}
