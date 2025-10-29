// scripts/generate-webConfigApi.js
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
/**
 * 解析 .env 文件
 */
function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const config = {}

  content.split('\n').forEach((line) => {
    // 跳过注释和空行
    line = line.trim()
    if (!line || line.startsWith('#')) return

    // 解析 KEY = VALUE (处理单引号、双引号、末尾逗号)
    const match = line.match(/^([^=]+)\s*=\s*['"]?([^'"]+?)['"]?\s*,?\s*$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      // 移除末尾的逗号
      value = value.replace(/,\s*$/, '')
      config[key] = value
    }
  })

  return config
}

/**
 * 格式化生成的文件
 */
function formatFile(filePath) {
  try {
    console.info('\n🎨 正在格式化文件...')
    execSync(`npx prettier --write "${filePath}"`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    })
    console.info('✅ 文件格式化完成')
  } catch (error) {
    console.warn('⚠️  格式化失败，但文件已生成:', error.message)
  }
}

/**
 * 生成 webConfigApi.js 文件
 */
function generateWebConfig(envFile = '.env.production') {
  // 1. 读取 package.json 获取版本号
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'))
  const version = packageJson.version

  // 2. 读取指定的 .env 文件获取基础服务配置
  const envPath = path.join(__dirname, '..', envFile)

  if (!fs.existsSync(envPath)) {
    console.error(`\n❌ 环境文件不存在: ${envFile}`)
    process.exit(1)
  }

  const envConfig = parseEnvFile(envPath)

  console.info(`\n📄 使用环境配置文件: ${envFile}`)

  // 3. 完整配置模板（生产环境）
  const config = {
    // ============ 核心配置（从环境文件自动填充）============
    appName: envConfig.VITE_APP_NAME || '', // 从 env 文件读取
    apiPath: envConfig.VITE_PROXY_DOMAIN || '', // 从 env 文件读取

    // ============ 客户品牌信息 ============
    logoPath: 'https://stt.pwtk.cc/devmedia/photossys/guarantee/img/24/11/18/6452534cc56f4a86a754f89e0407c457.png', //
    phone: '000-000-0000',
    whatsapp: '000-000-0000',
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',

    // ============ 基础服务配置（从 .env.production 自动填充）============
    PUBLIC_KV_URL: envConfig.PUBLIC_KV_URL,
    VITE_PROXY_UPLOAD: envConfig.VITE_PROXY_UPLOAD,
    VITE_SERVER_CALLBACK: envConfig.VITE_SERVER_CALLBACK,
    VITE_CDN_URL: envConfig.VITE_CDN_URL,
    VITE_STORY_TYPE: envConfig.VITE_STORY_TYPE,
    VITE_STORAGE_BUCKET: envConfig.VITE_STORAGE_BUCKET,
    VITE_NODE_ENV: envConfig.VITE_NODE_ENV,
    VITE_CHAT_DOMAIN: envConfig.VITE_CHAT_DOMAIN,
    VITE_PUBLIC_ENCRYPTION_URL: envConfig.VITE_PUBLIC_ENCRYPTION_URL,
    VITE_PUBLIC_AES_KEY_VERSION: envConfig.VITE_PUBLIC_AES_KEY_VERSION,
    VITE_TASK_DOMAIN: envConfig.VITE_TASK_DOMAIN,
    VITE_TASK_LIVE_DOMAIN: envConfig.VITE_TASK_LIVE_DOMAIN,
    VITE_AUDIO_CONVERT_TOOL_DOMAIN: envConfig.VITE_AUDIO_CONVERT_TOOL_DOMAIN,
    VITE_VIDEO_DOMAIN: envConfig.VITE_VIDEO_DOMAIN,
    VITE_PUBLIC_BIZ_URL: envConfig.VITE_PUBLIC_BIZ_URL,

    // ============ 版本信息（自动填充）============
    version: version
  }

  // 4. 生成 JS 文件内容（带详细注释）
  const content = `// 自动生成的配置文件
// 生成时间: ${new Date().toLocaleString('zh-CN')}
// 版本: ${version}
// 环境文件: ${envFile}
// appName: ${config.appName}
// apiPath: ${config.apiPath}

window.webConfigApi = ${JSON.stringify(config, null, 2)}
`

  // 5. 写入 public 目录（开发环境使用）
  const publicPath = path.join(__dirname, '../public/webConfigApi.js')
  fs.writeFileSync(publicPath, content, 'utf-8')
  console.info('\n✅ 成功生成 public/webConfigApi.js')
  console.info('📝 版本:', version)
  console.info('📝 AppName:', config.appName)
  console.info('📝 ApiPath:', config.apiPath)
  console.info('📂 位置:', publicPath)

  // 格式化 public 文件
  formatFile(publicPath)

  // 6. 写入 dist 目录（生产环境使用）
  const distPath = path.join(__dirname, '../dist/webConfigApi.js')
  const distDir = path.join(__dirname, '../dist')

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(distPath, content, 'utf-8')
    console.info('\n✅ 成功生成 dist/webConfigApi.js')
    console.info('📂 位置:', distPath)

    // 格式化 dist 文件
    formatFile(distPath)
  } else {
    console.warn('\n⚠️  dist 目录不存在（跳过）')
  }

  console.info('─────────────────────────────────\n')
}

// 执行生成 - 支持命令行参数
try {
  const envFile = process.argv[2] || '.env.production'
  generateWebConfig(envFile)
} catch (error) {
  console.error('\n❌ 生成失败:', error.message)
  console.error('─────────────────────────────────\n')
  process.exit(1)
}
