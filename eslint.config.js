import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules:{
      'semi': ['error', 'never'],  // 禁止在语句末尾使用分号
      'indent': ['error', 2],  // 强制使用2个空格进行缩进
      'space-infix-ops': 'error',  // 要求运算符周围必须有空格，例如 x = y 而非 x=y
      'quotes': ['error', 'single'],  // 强制使用单引号
      // 'no-console': 'warn',  // 在使用 console 时发出警告
      'array-callback-return': 'warn',  // 要求数组方法的回调函数必须有返回值
      'no-loop-func': 'error',  // 禁止在循环中创建函数
      'key-spacing': ['error', { 'afterColon': true }],  // 键和冒号之间必须有空格
      'no-var': 'error',  // 禁止使用 var 声明变量
      'no-duplicate-case': 'error',  // 禁止 switch 语句中的 case 标签重复
      'no-cond-assign': ['error', 'always'],  // 禁止在条件表达式中出现赋值操作
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/set-state-in-effect': 'warn'
    }
  },
])
