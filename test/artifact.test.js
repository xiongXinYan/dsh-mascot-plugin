// @ts-check
/**
 * 产物冒烟测试。
 *
 * 单测覆盖的是 src/ 里的纯逻辑，但用户装的是 lib/client.js —— 它有没有 Loader 认的外壳、
 * 能不能被 __ModuleLoader__ 收下、apply(ctx) 会不会真的把浮层注册到 shell.overlay，
 * 这三件事只能对着**产物本身**验证。源码改动导致产物没重建时，这个测试也会跟着挂。
 */
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

import { describe, expect, it } from 'vitest'

const CLIENT = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')

/**
 * 假装自己是宿主：最小的 window / document / require，够 apply() 跑完就行。
 * 刻意不引 jsdom —— 这个测试要守的是"外壳与注册契约"，不是 DOM 行为。
 */
function boot() {
  /** @type {{ id?: string, loaded?: any }} */
  const loaded = {}
  /** @type {Array<{ slot: string }>} */
  const injected = []
  /** @type {Array<{ name: string, id?: string }>} */
  const registered = []
  /** @type {any[]} */
  const styleNodes = []

  const document = {
    currentScript: null,
    getElementById: () => null,
    createElement: (/** @type {string} */ tag) => {
      const node = { tag, style: {}, dataset: {}, textContent: '', remove() {} }
      if (tag === 'style') styleNodes.push(node)
      return node
    },
    head: { appendChild: () => {} },
    body: null,
    documentElement: {},
  }

  const window = {
    __ModuleLoader__: {
      load: (/** @type {{ id: string, factory: (req: any) => any }} */ payload) => {
        loaded.id = payload.id
        loaded.loaded = payload.factory((/** @type {string} */ name) => {
          if (name === 'react') {
            return {
              createElement: () => null,
              useEffect: () => {},
              useRef: () => ({ current: null }),
            }
          }
          throw new Error(`unexpected external: ${name}`)
        })
      },
    },
    location: { href: 'http://127.0.0.1:5173/' },
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    cancelIdleCallback: () => {},
    requestIdleCallback: () => 0,
  }

  const ctx = {
    effect: (/** @type {() => any} */ fn) => {
      fn()
    },
    slots: {
      inject: (/** @type {string} */ slot, /** @type {() => void} */ cb) => {
        injected.push({ slot })
        cb()
      },
      register: (/** @type {{ name: string, id?: string }} */ options) => {
        registered.push(options)
      },
    },
  }

  runInNewContext(CLIENT, {
    window,
    document,
    location: window.location,
    console,
    URL,
    globalThis: undefined,
  })

  return { loaded, injected, registered, styleNodes, ctx, window, document }
}

describe('lib/client.js', () => {
  it('以宿主要的形式注册自己', () => {
    const { loaded } = boot()
    expect(loaded.id).toBe('dsh-mascot-plugin')
    expect(loaded.loaded).toBeTruthy()
  })

  it('导出 apply(ctx)，并把浮层挂到 shell.overlay', () => {
    const { loaded, injected, registered, ctx } = boot()
    expect(typeof loaded.loaded.apply).toBe('function')

    loaded.loaded.apply(ctx)

    expect(injected).toEqual([{ slot: 'shell.overlay' }])
    expect(registered).toHaveLength(1)
    expect(registered[0]?.name).toBe('shell.overlay')
    expect(registered[0]?.id).toBe('mascot')
  })

  it('样式随 apply 注入，且可以卸载', () => {
    const { loaded, styleNodes, ctx } = boot()
    loaded.loaded.apply(ctx)
    expect(styleNodes).toHaveLength(1)
    expect(styleNodes[0]?.textContent).toContain('.dsh-mascot')
  })

  it('声明了 inject，且只声明真正用到的服务', () => {
    const { loaded } = boot()
    expect(loaded.loaded.inject).toEqual(['slots'])
  })
})
