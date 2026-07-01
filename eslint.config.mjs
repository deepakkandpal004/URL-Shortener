import js from '@eslint/js'

export default [
    js.configs.recommended,
    {
        files: ['**/*.js', '**/*.jsx'],
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
            'no-console': ['warn', { allow: ['error'] }],
            'no-undef': 'off', // Next.js globals handled by runtime
        },
    },
    {
        ignores: ['.next/**', 'node_modules/**', 'vitest.config.js'],
    },
]
