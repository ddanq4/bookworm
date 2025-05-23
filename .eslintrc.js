module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:react/recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off'
  }
};
