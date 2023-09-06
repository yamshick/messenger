module.exports = {
  // parser: "@babel/eslint-parser",
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["plugin:react/recommended", "prettier"],
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
    parser: "@babel/eslint-parser",
  },
  plugins: ["react", "prettier"],
  rules: {
    "prettier/prettier": ["error"],
    "react/prop-types": 0,
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx", "json"] },
    ],
  },
};
