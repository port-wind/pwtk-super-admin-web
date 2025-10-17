const fs = require('fs')
const path = require('path')

// 读取源文件
const sourceFile = path.join(__dirname, '../src/webConfigApi.ts')
const source = fs.readFileSync(sourceFile, 'utf8')

// 移除 TypeScript 类型声明（如果有的话）
const jsContent = source
  .replace(/^declare /gm, '')
  .replace(/: string/g, '')
  .replace(/: number/g, '')
  .replace(/: boolean/g, '')

// 写入到目标文件
const targetFile = path.join(__dirname, '../public/webConfigApi.js')
fs.writeFileSync(targetFile, jsContent, 'utf8')

console.log('webConfigApi.js has been generated successfully!')
