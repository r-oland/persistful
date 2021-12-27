module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'prettier',
  ],
  rules: {
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'no-undef': 0,
    'no-underscore-dangle': 0,
    'no-console': 0,
    'react/require-default-props': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react/no-unescaped-entities': 0,
    'consistent-return': 0,
    'import/extensions': 0,
    'import/no-mutable-exports': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 80,
        endOfLine: 'auto',
      },
    ],
    'react/jsx-props-no-spreading': 0,
    'react-hooks/exhaustive-deps': 0,
  },
};
