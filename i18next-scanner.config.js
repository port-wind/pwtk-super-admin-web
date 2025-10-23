/* eslint-disable no-undef */
module.exports = {
  input: [
    'src/**/*.{js,ts,vue}', // 扫描 js、ts 和 vue 文件
    '!src/**/*.spec.{js,ts}', // 排除测试文件
    '!src/locales/**', // 排除 locales 文件夹
    '!**/node_modules/**' // 排除 node_modules
  ],
  output: './',
  options: {
    debug: true,
    lngs: ['zh-cn', 'en', 'zh-tw'], // 与你的语言文件一致
    defaultLng: 'zh-cn',
    resource: {
      loadPath: 'src/locales/{{lng}}.json', // 语言文件路径
      savePath: 'src/locales/{{lng}}.json', // 保存路径
      jsonIndent: 2
    },
    ns: ['translation'], // 命名空间
    defaultNs: 'translation',
    func: {
      list: ['t'], // 扫描的函数名
      extensions: ['.js', '.ts', '.vue'] // 支持的文件类型
    },
    vue: true // 启用 Vue 支持
  }
}
