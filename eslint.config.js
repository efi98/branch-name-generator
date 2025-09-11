import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            prettier,
        },
        rules: {
            "prettier/prettier": "error",
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
    {
        ignores: ["dist/", "node_modules/"],
    },
];
