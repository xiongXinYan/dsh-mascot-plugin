#!/usr/bin/env node
// @ts-check
/**
 * 把 assets/mascot.webp 内联成 src/portrait.js。
 *
 * 为什么要有这一步：Loader 只投放 client.js，宿主从源码安装时既不跑构建，
 * 也没有承诺把 assets/ 挂成静态目录。立绘必须变成 JS 字符串跟着产物走，
 * 否则会出现"插件装上了但看不见狗"。
 *
 * 换立绘的正确姿势：
 *   1. 替换 assets/mascot.webp（透明底、四周多余留白已裁掉，约 620px 宽）
 *   2. node scripts/update-portrait.mjs && pnpm build
 *   3. 把 assets/mascot.webp、src/portrait.js、lib/client.js 一起提交
 *      （CI 会核对产物与源码是否一致）
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(root, 'assets/mascot.webp')
const target = resolve(root, 'src/portrait.js')

const bytes = await readFile(source)
const uri = `data:image/webp;base64,${bytes.toString('base64')}`

const header = `// @ts-check
// 由 scripts/update-portrait.mjs 生成，请勿手改。

/**
 * 内置立绘：一只趴着抬头的中华五黑犬。
 *
 * 来源：按用户提供的实拍照片生成插画，再抠掉背景、裁掉透明边、压成 WebP。
 * 毛流、体积和五官靠手写 SVG 路径拼不出来，越补细节越像贴纸，所以主体用位图。
 *
 * 姿态、眼神、状态叠加层都在 character.js / styles.js，换图不影响上层接口。
 */

`

await writeFile(target, `${header}export const PORTRAIT_DATA_URI =\n  '${uri}'\n`, 'utf8')
console.log(`[dsh-mascot] 立绘已内联：${(bytes.length / 1024).toFixed(1)} KB → src/portrait.js`)
