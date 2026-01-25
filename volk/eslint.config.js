const tseslintParser = require('@typescript-eslint/parser');
const tseslintPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');

const tsconfig = require('./tsconfig.json');
const tsconfigAliases = tsconfig.compilerOptions?.paths || {};

module.exports = [
	{
		ignores: [
			'node_modules/**',
			'.medusa/**',
			'build/**',
			'coverage/**',
			'dist/**',
			'*.config.js'
		]
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			parser: tseslintParser,
			ecmaVersion: 2022,
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				console: 'readonly',
				process: 'readonly',
				Buffer: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				module: 'readonly',
				require: 'readonly',
				exports: 'readonly'
			}
		},
		plugins: {
			'@typescript-eslint': tseslintPlugin,
			import: importPlugin,
			'simple-import-sort': simpleImportSort,
			react,
			'react-hooks': reactHooks
		},
		settings: {
			react: {
				version: 'detect'
			}
		},
		rules: {
			// Quotes and formatting
			'jsx-quotes': ['error', 'prefer-double'],
			'no-multiple-empty-lines': ['error', {max: 1}],
			'no-trailing-spaces': 'error',
			'space-infix-ops': ['error', {int32Hint: false}],
			quotes: ['error', 'single', {avoidEscape: true, allowTemplateLiterals: true}],
			semi: ['error', 'always'],
			'object-curly-spacing': ['error', 'never'],
			'comma-spacing': ['error', {before: false, after: true}],
			'comma-dangle': ['error', 'never'],
			indent: ['error', 'tab', {SwitchCase: 1}],
			'max-len': [
				'error',
				{
					code: 140,
					ignoreUrls: true,
					ignoreStrings: true,
					ignoreComments: true,
					ignoreTemplateLiterals: true
				}
			],

			// React
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react/prop-types': 'off',
			'react/display-name': 'off',
			'react/react-in-jsx-scope': 'off',

			// TypeScript
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
					argsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',

			// Console
			'no-console': ['warn', {allow: ['warn', 'error', 'info']}],

			// Imports
			'import/no-cycle': ['error', {maxDepth: 2}],
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						// External packages
						['^@?\\w'],
						// Internal aliases
						[...Object.keys(tsconfigAliases).map(key => `^${key.replace('/*', '')}`)],
						// Parent imports
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						// Relative imports
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
					]
				}
			],
			'simple-import-sort/exports': 'error',

			// Spacing
			'keyword-spacing': ['error', {before: true, after: true}],
			'padding-line-between-statements': [
				'error',
				{blankLine: 'always', prev: '*', next: 'return'},
				{blankLine: 'always', prev: '*', next: 'if'},
				{blankLine: 'always', prev: 'if', next: '*'},
				{blankLine: 'always', prev: '*', next: 'try'},
				{blankLine: 'always', prev: '*', next: ['const', 'let', 'var']},
				{blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var']}
			]
		}
	}
];
