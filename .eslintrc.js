module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:prettier/recommended'],
  env: {
    node: true,
    browser: true,
    es6: true,
    amd: false,
  },
  rules: {
    'prefer-const': [1],
  },
}
