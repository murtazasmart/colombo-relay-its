import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Get base rules from Next.js but override with our custom rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Custom overrides to disable non-critical rules
  {
    rules: {
      // Disable React hooks exhaustive deps warnings
      "react-hooks/exhaustive-deps": "off",
      
      // Keep critical TypeScript errors
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Disable other non-critical rules
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "import/no-anonymous-default-export": "off",
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];

export default eslintConfig;
