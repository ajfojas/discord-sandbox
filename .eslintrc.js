module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    es6: true
  },
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    quotes: ['error', 'single'],
    'no-trailing-spaces': [
      'error',
      {
        ignoreComments: true,
        skipBlankLines: true
      }],
    'comma-dangle': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'comma-spacing': ['error', { before: false, after: true }],
    'no-console': 'off'
  }
};
