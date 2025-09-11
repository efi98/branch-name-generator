const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettier = require("eslint-plugin-prettier");

module.exports = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            prettier,
        },
        rules: {
            "prettier/prettier": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", {"argsIgnorePattern": "^_"}],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-useless-escape": "warn"
        },
    },
    {
        ignores: [
            "dist/",
            "node_modules/",
            "karma.conf.js",
            "src/**/*.spec.ts",
            "src/test.ts"
        ],
    },
];
