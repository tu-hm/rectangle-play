import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: [
            'dist',
            'node_modules',
            '.env.local',
            '.env.development.local',
            '.env.test.local',
            '.env.production.local',
            '.idea/',
            '.vscode/',
            'public',
            'package-lock.json',
            'yarn.lock',
            'vite.config.ts',

        ]
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'prettier/prettier': [
                'warn',
                {
                    endOfLine: 'auto',
                    "singleQuote": true,
                    "parser": "flow"
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/camelcase': 'off',
            'react/prop-types': 'off',
            '@typescript-eslint/interface-name-prefix': 'off',
            'no-duplicate-imports': 'error',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-pascal-case': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': 'off',
        },
    },
)
