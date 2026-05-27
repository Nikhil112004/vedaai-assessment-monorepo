import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXElement > JSXExpressionContainer > ConditionalExpression",
          message:
            "Avoid direct conditional rendering in JSX. Compute the render node in a variable before returning JSX.",
        },
        {
          selector:
            "JSXElement > JSXExpressionContainer > LogicalExpression[operator='&&']",
          message:
            "Avoid direct logical rendering in JSX. Compute the render node in a variable before returning JSX.",
        },
        {
          selector: "JSXFragment > JSXExpressionContainer > ConditionalExpression",
          message:
            "Avoid direct conditional rendering in JSX. Compute the render node in a variable before returning JSX.",
        },
        {
          selector:
            "JSXFragment > JSXExpressionContainer > LogicalExpression[operator='&&']",
          message:
            "Avoid direct logical rendering in JSX. Compute the render node in a variable before returning JSX.",
        },
      ],
    },
  },
];
