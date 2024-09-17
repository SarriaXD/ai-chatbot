// 文件名: scripts/convert-json-to-base64.js

import { readFileSync, appendFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取 JSON 文件
const serviceAccountPath = join(__dirname, '..', 'service_account.json')
const serviceAccountContent = readFileSync(serviceAccountPath, 'utf8')
const serviceAccount = JSON.parse(serviceAccountContent)

// 转换为 Base64
const base64ServiceAccount = Buffer.from(
    JSON.stringify(serviceAccount)
).toString('base64')

console.log('Base64 encoded string:')
console.log(base64ServiceAccount)

// 将结果写入 .env.local 文件
const envPath = join(__dirname, '..', '.env.local')
appendFileSync(
    envPath,
    `\nFIREBASE_SERVICE_ACCOUNT_BASE64=${base64ServiceAccount}\n`
)

console.log('\nThe Base64 string has been added to your .env.local file.')
console.log('You can now use this in your Vercel environment variables.')
