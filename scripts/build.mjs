#!/usr/bin/env node
/**
 * 客户端产物构建脚本。
 *
 * 只做两件事：
 *   1. 扫描 assets/ 里的 *.model3.json，生成 assets/models.json 清单
 *      （浏览器不能列目录，"自动扫描模型"只能发生在构建期或宿主侧）；
 *   2. 把 src/ 打包成一个 lib/client.js，并套上 Loader 认的外壳：
 *        window.__ModuleLoader__.load({ id, factory })
 *
 * lib/index.js 是手写的宿主入口，不参与构建。
 *
 * 用法：
 *   node scripts/build.mjs           一次性构建
 *   node scripts/build.mjs --watch   监听改动（配合 dsh web 的热更新）
 */
import { build, context } from 'esbuild'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
const watch = process.argv.includes('--watch')

const CLIENT_ENTRY = resolve(root, 'src/index.js')
const CLIENT_OUT = resolve(root, 'lib/client.js')
const ASSETS_DIR = resolve(root, 'assets')
const MANIFEST_OUT = resolve(ASSETS_DIR, 'models.json')

/**
 * 宿主已提供、绝对不能打进包里的模块。
 * 打进去 = 第二份 React，运行时会因为实例不一致而静默失效（hooks 直接报错）。
 */
const PLATFORM_MODULES = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react-dom/client',
  '@deepseek-ai/*',
]

/** 递归找出所有 .model3.json，生成前端可读的清单。 */
async function scanModels(dir = ASSETS_DIR) {
  const found = []

  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return found
  }

  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      found.push(...(await scanModels(full)))
    } else if (entry.isFile() && entry.name.endsWith('.model3.json')) {
      const path = relative(ASSETS_DIR, full).split('\\').join('/')
      const id = entry.name.replace(/\.model3\.json$/, '')
      found.push({ id, label: id, url: `assets/${path}` })
    }
  }

  return found.sort((a, b) => a.id.localeCompare(b.id))
}

async function writeManifest() {
  const models = await scanModels()
  await writeFile(MANIFEST_OUT, `${JSON.stringify({ models }, null, 2)}\n`, 'utf8')
  console.log(`[dsh-mascot] 模型清单：${models.length} 个 → assets/models.json`)
  return models
}

/**
 * 给浏览器半场套 Loader 外壳。
 * factory 收到的 require 用来取宿主模块表里的 React 等依赖。
 */
function wrapClientHalf(code) {
  const body = code
    .split('\n')
    .map((line) => (line.length > 0 ? `      ${line}` : line))
    .join('\n')

  return `window.__ModuleLoader__.load({
  id: ${JSON.stringify(pkg.name)},
  factory: function (require) {
    'use strict';
    var module = { exports: {} };
    var exports = module.exports;
${body}
    return module.exports;
  }
});
`
}

const moduleLoaderShell = {
  name: 'dsh-module-loader-shell',
  setup(pluginBuild) {
    pluginBuild.onEnd(async (result) => {
      if (result.errors.length > 0) return
      const output = result.outputFiles?.[0]
      if (!output) return
      await mkdir(dirname(CLIENT_OUT), { recursive: true })
      await writeFile(CLIENT_OUT, wrapClientHalf(output.text), 'utf8')
      console.log(`[dsh-mascot] 浏览器半场 → ${CLIENT_OUT}`)
    })
  },
}

const clientOptions = {
  entryPoints: [CLIENT_ENTRY],
  outfile: CLIENT_OUT,
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  external: PLATFORM_MODULES,
  write: false, // 交给 moduleLoaderShell 落盘
  logLevel: 'info',
  legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [moduleLoaderShell],
}

await writeManifest()

if (watch) {
  const clientCtx = await context(clientOptions)
  await clientCtx.watch()
  console.log('[dsh-mascot] watching…（Ctrl+C 结束）')
} else {
  await build(clientOptions)
  console.log('[dsh-mascot] 构建完成 → lib/client.js')
}
