module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off',
    camelcase: 'off',
    semi: ['error', 'always'],
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
    'no-template-curly-in-string': 'off',
    "template-curly-spacing" : "off",
    "indent": ["error", 2, {
      "ignoredNodes": ["TemplateLiteral"]
    }]
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off'
      }
    }
  ]
};
