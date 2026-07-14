import js from "@eslint/js";
import globals from "globals";

export default {
    // Reemplaza a "env" y "parserOptions.ecmaVersion/sourceType"
    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.es2021,
        },
    },
    // Reemplaza a "extends" y "rules"
    rules: {
        ...js.configs.recommended.rules,
        "eqeqeq": "off",
        "no-console": "off",
        "no-useless-concat": "off",
        "no-unused-vars": "off",
        "block-scoped-var": "off",
        "no-undef": "error",
        "no-unreachable": "off",
        "no-self-assign": "off",
        "no-global-assign": "off",
        "no-regex-spaces": "off",
        "no-redeclare": "off",
        "no-extra-semi": "error",
        "no-empty": "error",
        "no-dupe-else-if": "error",
        "no-useless-escape": "off",
        "no-mixed-spaces-and-tabs": "off",
        "no-irregular-whitespace": "off",
        "no-lone-blocks": "off",
        "no-eval": "off",
        // "no-useless-assignment": "off",
    },
};