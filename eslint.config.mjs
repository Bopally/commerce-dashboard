import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import pluginPrettier from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      "prettier/prettier": "error", // signale les erreurs de formatage
    },
  },

  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Désactive les règles qui entrent en conflit avec Prettier
  {
    rules: {
      ...prettierConfig.rules,
    },
  },
])