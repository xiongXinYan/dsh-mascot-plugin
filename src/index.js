// @ts-check
/**
 * 客户端挂载入口：把板娘挂到 shell.overlay 上，并决定这一轮用 Live2D 还是内置立绘。
 *
 * 这里刻意不写 JSX —— 直接用 createElement，产物里就只需要 require('react')，
 * 不用再多引一个 react/jsx-runtime 到宿主的模块表里。
 */
import { createElement, useEffect, useRef } from 'react'

import { loadConfig, saveConfig } from './config.js'
import { attachLookAt } from './look-at.js'
import { fetchModelManifest, mountLive2D } from './model-loader.js'
import { createSettingsPanel } from './settings.js'
import { MOOD_LABEL, pickGreeting, resolveMood } from './state.js'
import { injectStyles } from './styles.js'

export const name = 'dsh-mascot'

/**
 * 客户端半场声明它依赖的 client 行。
 * 只写真正会用到的：多声明一个不存在的服务，这一行会永远等不到依赖，
 * 表现为"插件装了但界面上什么都没有"。
 */
export const inject = ['slots']

/**
 * @param {import('./types.js').ClientContext} ctx
 * @returns {void}
 */
export function apply(ctx) {
  // 样式必须走 effect：卸载时才会真正移除，否则热更新会叠出多层 <style>。
  ctx.effect(() => injectStyles(), 'dsh-mascot: styles')

  // shell.overlay 是全屏浮层槽：板娘浮在界面上层，但只占右下角一小块。
  ctx.slots.inject('shell.overlay', () =>
    ctx.slots.register({ name: 'shell.overlay', id: 'mascot', order: 900 }, MascotLayer),
  )
}

/** 气泡停留时长。 */
const BUBBLE_MS = 2400

/**
 * 槽位渲染函数。宿主用 React 渲染它，所以我们返回一个空锚点，
 * 真正的 DOM 交给 mountMascot 管理 —— 动画和 canvas 不适合塞进 React 的渲染节奏里。
 */
function MascotLayer() {
  const anchorRef = useRef(/** @type {HTMLDivElement | null} */ (null))

  useEffect(() => {
    const host = anchorRef.current
    if (!host) return undefined
    return mountMascot(host)
  }, [])

  return createElement('div', { ref: anchorRef, className: 'dsh-mascot-anchor' })
}

/**
 * 把板娘挂进锚点，返回卸载函数。
 * @param {HTMLElement} host
 * @returns {() => void}
 */
function mountMascot(host) {
  /** @type {import('./types.js').MascotConfig} */
  let config = loadConfig()
  /** @type {import('./types.js').MascotMood} */
  let mood = resolveMood({})
  /** @type {Array<{id: string, label: string, url: string}>} */
  let models = []
  /** @type {null | {destroy: () => void, model: any}} */
  let live2d = null
  /** @type {null | (() => void)} */
  let detachLookAt = null
  /** @type {HTMLElement | null} */
  let panel = null
  let bubbleTimer = 0
  let disposed = false

  const root = document.createElement('div')
  root.className = 'dsh-mascot'

  const bubble = document.createElement('div')
  bubble.className = 'dsh-mascot__bubble'
  bubble.hidden = true
  bubble.setAttribute('role', 'status')

  const stage = document.createElement('div')
  stage.className = 'dsh-mascot__stage'

  // 内置占位立绘：没有模型、模型挂了、运行时缺失，都靠它兜底。
  const body = document.createElement('button')
  body.type = 'button'
  body.className = 'dsh-mascot__body'

  for (const side of ['left', 'right']) {
    const eye = document.createElement('span')
    eye.className = `dsh-mascot__eye dsh-mascot__eye--${side}`
    body.appendChild(eye)
  }
  const mouth = document.createElement('span')
  mouth.className = 'dsh-mascot__mouth'
  body.appendChild(mouth)

  stage.appendChild(body)

  const gear = document.createElement('button')
  gear.type = 'button'
  gear.className = 'dsh-mascot__gear'
  gear.textContent = '⚙'
  gear.title = '板娘设置'

  root.append(bubble, stage, gear)
  host.appendChild(root)

  body.addEventListener('click', greet)
  gear.addEventListener('click', togglePanel)

  render()
  void loadManifest()
  void applyModel()

  /** 把当前配置与姿态同步到 DOM。所有视觉状态都从这里出去。 */
  function render() {
    root.style.setProperty('--dsh-mascot-scale', String(config.scale))
    root.dataset.mood = mood
    body.title = `点一下${config.displayName}`
    body.setAttribute('aria-label', `${config.displayName}，当前${MOOD_LABEL[mood]}，点一下打招呼`)
  }

  function greet() {
    showBubble(pickGreeting())
    mood = 'happy'
    render()

    if (bubbleTimer) window.clearTimeout(bubbleTimer)
    bubbleTimer = window.setTimeout(() => {
      bubble.hidden = true
      mood = resolveMood({})
      render()
    }, BUBBLE_MS)
  }

  /** @param {string} text */
  function showBubble(text) {
    bubble.textContent = text
    bubble.hidden = !config.showBubble
  }

  /**
   * 读内置模型清单。
   * 清单为空（例如宿主还没把 assets/ 挂出来）就安静地什么都不做，
   * 不自动挑模型 —— 否则用户会看到一个他并不知道从哪来的模型。
   */
  async function loadManifest() {
    models = await fetchModelManifest()
    if (disposed) return

    const bundled = models[0]
    if (!bundled || config.modelUrl) return

    config = saveConfig({ modelUrl: bundled.url })
    void applyModel()
  }

  /** 重新装载模型：先卸干净，再挂新的，避免 canvas 叠在一起。 */
  async function applyModel() {
    detachLookAt?.()
    detachLookAt = null
    live2d?.destroy()
    live2d = null
    body.hidden = false

    if (!config.modelUrl) return

    try {
      const mounted = await mountLive2D(stage, config.modelUrl)
      if (disposed) {
        mounted.destroy()
        return
      }
      live2d = mounted
      body.hidden = true
      detachLookAt = attachLookAt(mounted.model, () => stage.getBoundingClientRect())
    } catch (error) {
      console.warn('[dsh-mascot] 模型加载失败，回落到内置立绘：', error)
      body.hidden = false
    }
  }

  function togglePanel() {
    if (panel) {
      closePanel()
      return
    }

    panel = createSettingsPanel({
      config,
      models,
      onPatch(patch) {
        const previousModelUrl = config.modelUrl
        config = saveConfig(patch)
        render()
        if (patch.modelUrl !== undefined && patch.modelUrl !== previousModelUrl) void applyModel()
      },
      onClose: closePanel,
    })

    stage.appendChild(panel)
  }

  function closePanel() {
    panel?.remove()
    panel = null
  }

  function dispose() {
    disposed = true
    body.removeEventListener('click', greet)
    gear.removeEventListener('click', togglePanel)
    if (bubbleTimer) window.clearTimeout(bubbleTimer)
    detachLookAt?.()
    live2d?.destroy()
    panel = null
    root.remove()
  }

  return dispose
}
