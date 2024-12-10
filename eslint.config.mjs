import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default [
    {
        ignores: [
            '**/node_modules',
            '**/test-results',
            '**/playwright-report',
            '**/node_modules/',
            'test-results/',
            'playwright-report/',
            'playwright/.cache/',
            'downloads/',
            'dist/',
            '.idea/**/*',
            '!.idea/runConfigurations',
            '!.idea/runConfigurations/**/*',
            '!.idea/codeStyles/**/*',
            '!.idea/inspectionProfiles/**/*',
            '**/*.iws',
            '**/*.iml',
            '**/*.ipr',
            '**/out/',
            '!**/src/main/**/out/',
            '!**/src/test/**/out/',
            '**/.vscode/',
            '**/.env',
            '**/.DS_Store',
        ],
    },
    ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 12,
            sourceType: 'module',
        },

        rules: {
            '@typescript-eslint/no-unused-vars': [
                1,
                {
                    argsIgnorePattern: 'res|next|^err|_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
]
