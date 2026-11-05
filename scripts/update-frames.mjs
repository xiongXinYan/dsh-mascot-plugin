#!/usr/bin/env node
// @ts-check
/**
 * 把 assets/frames/*.webp 内联成 src/frames.js。
 *
 * Loader 只投放 client.js，宿主从源码安装时既不跑构建，也没有承诺把
 * assets/ 挂成静态目录。所有帧必须变成 JS 字符串跟着产物走，否则会
 * 出现"插件装上了但看不见狗"。
 *
 * 换帧 / 加帧的正确姿势：
 *   1. 替换或新增 assets/frames/<name>.webp（透明底、九帧共用同一个
 *      裁切框，尺寸一致；尺寸或位置不一致，切帧时狗会跳）
 *   2. 在下面的 ORDER 里登记帧名
 *   3. node scripts/update-frames.mjs && pnpm build
 *   4. 把 assets/frames/、src/frames.js、lib/client.js 一起提交
 *      （CI 会核对产物与源码是否一致）
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** 顺序即 frames.js 里的顺序，rest 必须排第一（初始帧）。 */
const ORDER = ['rest', 'bow', 'wink', 'blink', 'idleAlt', 'jump', 'nap', 'alert', 'yawn']

const lines = []
let total = 0
for (const name of ORDER) {
  const bytes = await readFile(resolve(root, 'assets/frames', `${name}.webp`))
  total += bytes.length
  lines.push(`  ${name}: 'data:image/webp;base64,${bytes.toString('base64')}',`)
}

const header = `// @ts-check
// 由 scripts/update-frames.mjs 生成，请勿手改。

/**
 * 内置立绘的逐帧素材：一只中华五黑犬的九种姿态/表情，按实拍照片生成、
 * 抠成透明底、统一对齐裁切后压成 WebP。
 *
 * 硬切不淡入：逐帧动画加 transition 会糊成重影，显示哪帧由
 * frames-player.js 决定，character.js 只负责切换 data-active。
 */

/** @type {Record<string, string>} */
`

await writeFile(
  resolve(root, 'src/frames.js'),
  `${header}export const FRAME_URIS = {\n${lines.join('\n')}\n}\n`,
  'utf8',
)
console.log(
  `[dsh-mascot] ${ORDER.length} 帧已内联：${(total / 1024).toFixed(1)} KB → src/frames.js`,
)
