import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import typescriptEslint from 'typescript-eslint';
import alignAssignments from 'eslint-plugin-align-assignments';
import { defineConfig } from 'eslint/config';

// https://eslint.style/rules#rules
const formattingRules = {
    '@stylistic/indent':                   ['error', 4, { 'ignoredNodes': ['BinaryExpression'], 'CallExpression': { arguments: 'first' } }],
    '@stylistic/indent-binary-ops':        ['error', 4],
    '@stylistic/semi':                     ['error', 'always'],
    '@stylistic/quotes':                   ['error', 'single', { avoidEscape: true }],
    '@stylistic/comma-dangle':             ['error', 'always-multiline'],
    '@stylistic/arrow-parens':             ['error', 'always'],
    '@stylistic/block-spacing':            ['error', 'always'],
    '@stylistic/brace-style':              ['error', 'allman'],
    '@stylistic/comma-spacing':            ['error', { before: false, after: true }],
    '@stylistic/comma-style':              ['error', 'last'],
    '@stylistic/no-multi-spaces':          ['error', { exceptions: { Property: true, ImportAttribute: true, VariableDeclarator: true, AssignmentExpression: true } }],
    '@stylistic/key-spacing':              ['error', { beforeColon: false, afterColon: true, 'align': 'value' }],
    '@stylistic/keyword-spacing':          ['error', { before: true, after: true }],
    '@stylistic/space-before-blocks':      ['error', 'always'],
    '@stylistic/space-infix-ops':          'error',
    '@stylistic/space-in-parens':          ['error', 'never'],
    '@stylistic/object-curly-spacing':     ['error', 'always'],
    '@stylistic/array-bracket-spacing':    ['error', 'never'],
    '@stylistic/no-trailing-spaces':       'error',
    '@stylistic/no-tabs':                  'error',
    '@stylistic/eol-last':                 ['error', 'always'],
    '@stylistic/no-multiple-empty-lines':  ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
    '@stylistic/operator-linebreak':       ['error', 'after'],
    '@stylistic/spaced-comment':           ['error', 'always'],
    'align-assignments/align-assignments': ['error'],
};

const rules = {
    'eqeqeq':                   'off',
    'no-console':               'off',
    'no-useless-concat':        'off',
    'no-useless-assignment':    'off',
    'no-unused-vars':           'off',
    'block-scoped-var':         'off',
    'no-undef':                 'error',
    'no-unreachable':           'off',
    'no-self-assign':           'off',
    'no-global-assign':         'off',
    'no-regex-spaces':          'off',
    'no-redeclare':             'off',
    'no-extra-semi':            'off',
    'no-empty':                 'error',
    'no-dupe-else-if':          'error',
    'no-useless-escape':        'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-irregular-whitespace':  'off',
    'no-lone-blocks':           'off',
    'no-eval':                  'off',
};

export default defineConfig([
    {
        ignores: [
            '**/node_modules/**',
            '**/ws_dist/**',
            '**/dist/**',
            '**/external/**',
            '**/sim_hw/ts_out/**',
            '**/docs/**',
            '**/repo/**',
            '**/devel/external_glue/**',
        ],
    },
    {
        files:   ['**/*.js', '**/*.mjs'],
        plugins: {
            '@stylistic':        stylistic,
            'align-assignments': alignAssignments,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType:  'module',
            globals:     {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...rules,
            ...formattingRules,
        } as any,
    },
    {
        files:   ['**/*.ts'],
        plugins: {
            '@stylistic':        stylistic,
            'align-assignments': alignAssignments,
        },
        languageOptions: {
            parser:      typescriptEslint.parser,
            ecmaVersion: 'latest',
            sourceType:  'module',
            globals:     {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            ...formattingRules,
        } as any,
    },
    {
        files: ['**/*.d.ts'],
        rules: {
            '@stylistic/no-multi-spaces': 'off',
        },
    },
]);
