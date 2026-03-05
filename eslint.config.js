import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"

export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react,
      "react-hooks": reactHooks
    },
    settings: {
      react: { version: "detect" }
    },
    rules: {
      // React 17+/18 (Vite)
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // PropTypes nicht nötig
      "react/prop-types": "off",

      // Hooks Regeln
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // weniger strenge Fehler für Demo
      "no-unused-vars": "warn"
    }
  },

  {
    files: ["vite.config.js", "**/*.config.js"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

  {
    ignores: [
      "**/*.test.js",
      "**/*.spec.js",
      "src/hooks/use-mobile.js"
    ]
  }
]