module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  globals: {
    describe: true,
    expect: true,
    it: true,
  },
  rules: {},
}
