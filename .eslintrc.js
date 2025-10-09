/* eslint-env node */
// require('@rushstack/eslint-patch/modern-module-resolution')
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-essential', // or 'plugin:vue/vue3-recommended' for stricter rules
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    './.eslintrc-auto-import.json'
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // 只保留这个
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    eqeqeq: ['error', 'always'],
    // 其他全部都关闭
    'no-empty': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': 'off',
    'vue/no-multiple-template-root': 'off',
    'no-console': 'off',
    'vue/multi-word-component-names': 'off',
    'no-param-reassign': 'off',
    // 'no-param-reassign': [
    //   'error',
    //   {
    //     props: true,
    //     ignorePropertyModificationsFor: ['state', 'config']
    //   }
    // ],
    'vue/no-v-model-argument': 'off',
    'consistent-return': 'off',

    // 关闭从 extends 继承的常见规则
    'vue/no-unused-vars': 'off', // 关闭 Vue 特定的未使用变量规则（已由 no-unused-vars 覆盖）
    'vue/no-reserved-keys': 'off',
    'vue/no-unused-components': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    '@typescript-eslint/no-unused-vars': 'off', // 避免与基础规则冲突
    'eslintimport/prefer-default-export': 'off',
    'spaced-comment': 'off'
  },
  settings: {},
  ignorePatterns: ['package.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'vite.config.ts'], // Add this line
  globals: {
    ref: 'readonly',
    reactive: 'readonly',
    computed: 'readonly',
    ElMessageBox: 'readonly'
    // Add other Vue globals as needed
  }
}
