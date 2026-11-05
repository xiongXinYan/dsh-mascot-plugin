#!/usr/bin/env node
/**
 * 本地预览服务器。
 *
 * 为什么需要它：dev/preview.html 要用 fetch 读模型清单，file:// 下会被 CORS 拦掉；
 * 而且构建出来的 lib/client.js 得从"跟插件同源"的位置加载才接近真实环境。
 *
 * 做三件事：
 *   1. 起一个只监听 127.0.0.1 的静态服务器，根目录 = 仓库根目录；
 *   2. 用子进程跑 `scripts/build.mjs --watch`，改 src 就自动重新打包；
 *   3. 打印预览地址（默认 / 指向 dev/preview.html）。
 *
 * 用法：pnpm dev        （默认 5173，可用 PORT=xxxx 改）
 */
import { spawn } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const entry = '/dev/preview.html'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.moc3': 'application/octet-stream',
  '.md': 'text/markdown; charset=utf-8',
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1')
  const requested = url.pathname === '/' ? entry : decodeURIComponent(url.pathname)

  // 归一化后再确认没跳出仓库，避免 ../../ 读到仓库外的文件
  const target = resolve(root, `.${normalize(requested)}`)
  if (!target.startsWith(root + sep) && target !== root) {
    res.writeHead(403).end('forbidden')
    return
  }

  let info
  try {
    info = await stat(target)
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('404')
    return
  }

  if (info.isDirectory()) {
    res.writeHead(302, { location: `${url.pathname.replace(/\/?$/, '/')}index.html` }).end()
    return
  }

  res.writeHead(200, {
    'content-type': MIME[extname(target).toLowerCase()] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  })
  createReadStream(target).pipe(res)
})

const build = spawn(process.execPath, [join(root, 'scripts', 'build.mjs'), '--watch'], {
  cwd: root,
  stdio: 'inherit',
})

/** 端口被占就往后顺延，省得每次都手动改环境变量。 */
const listen = (port, attempt = 0) =>
  new Promise((done, fail) => {
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE' && attempt < 10) done(listen(port + 1, attempt + 1))
      else fail(error)
    })
    server.listen(port, '127.0.0.1', () => done(port))
  })

const startPort = Number(process.env.PORT ?? 5173)
const port = await listen(startPort)
console.log(`\n[dsh-mascot] 预览： http://127.0.0.1:${port}/\n`)

const shutdown = () => {
  build.kill()
  server.close(() => process.exit(0))
  // 兜底：子进程/连接卡住时别把终端吊死在退出阶段
  setTimeout(() => process.exit(0), 800).unref()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
build.on('exit', (code) => {
  if (code && code !== 0) console.error(`[dsh-mascot] 构建进程退出：${code}`)
})
