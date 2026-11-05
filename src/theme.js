// @ts-check
/**
 * 主题识别。
 *
 * 为什么不用 `prefers-color-scheme`：DSH Web 有自己的明暗开关，和系统设置并不总是同步
 * （深色系统 + 浅色界面、浅色系统 + 深色界面都很常见）。只跟媒体查询的结果是
 * "浅色界面上浮了一张深色卡片"，看起来像没适配。
 *
 * 做法是从浮层所在位置往上走，读第一层不透明的背景色，按亮度判断；
 * 拿不到任何背景色时才退回媒体查询。宿主换主题时靠 MutationObserver 跟上。
 */

/** 比这个亮就是浅色。0.45 是偏保守的值：中间灰算浅色，卡片用深色底更好读。 */
const DARK_THRESHOLD = 0.45

/**
 * 解析 `rgb()` / `rgba()` / `#rgb` / `#rrggbb`，失败返回 null。
 * @param {string} color
 * @returns {{ r: number, g: number, b: number, a: number } | null}
 */
export function parseColor(color) {
  const text = color.trim()
  if (!text) return null

  if (text.startsWith('#')) {
    const hex = text.slice(1)
    if (hex.length === 3) {
      const r = Number.parseInt(hex.slice(0, 1).repeat(2), 16)
      const g = Number.parseInt(hex.slice(1, 2).repeat(2), 16)
      const b = Number.parseInt(hex.slice(2, 3).repeat(2), 16)
      return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : { r, g, b, a: 1 }
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = Number.parseInt(hex.slice(0, 2), 16)
      const g = Number.parseInt(hex.slice(2, 4), 16)
      const b = Number.parseInt(hex.slice(4, 6), 16)
      const a = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1
      return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) || Number.isNaN(a)
        ? null
        : { r, g, b, a }
    }
    return null
  }

  const match = text.match(/^rgba?\(([^)]+)\)$/i)
  const body = match?.[1]
  if (!body) return null

  // 现代写法允许 "255 255 255 / 50%"，也允许逗号与空格混用
  const parts = body.split(/[,/\s]+/).filter(Boolean)
  const [rawR = '', rawG = '', rawB = '', rawA] = parts
  if (!rawR || !rawG || !rawB) return null

  const channel = (/** @type {string} */ raw) => {
    if (raw.endsWith('%')) return (Number.parseFloat(raw) / 100) * 255
    return Number.parseFloat(raw)
  }
  const r = channel(rawR)
  const g = channel(rawG)
  const b = channel(rawB)
  const a =
    rawA === undefined
      ? 1
      : rawA.endsWith('%')
        ? Number.parseFloat(rawA) / 100
        : Number.parseFloat(rawA)

  if ([r, g, b, a].some((value) => Number.isNaN(value))) return null
  return { r, g, b, a }
}

/**
 * 感知亮度（0 = 黑，1 = 白）。用 Rec.601 权重，够判断明暗，不需要 gamma 校正。
 * @param {{ r: number, g: number, b: number }} color
 * @returns {number}
 */
export function luminance(color) {
  return (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255
}

/**
 * 判断当前界面是深色还是浅色。
 * @param {Document} [doc]
 * @returns {'light' | 'dark'}
 */
export function detectTheme(doc = document) {
  const fallback = prefersDark(doc) ? 'dark' : 'light'
  const view = doc.defaultView
  if (!view) return fallback

  /** @type {Element | null} */
  let node = doc.body
  while (node) {
    const background = parseColor(view.getComputedStyle(node).backgroundColor)
    if (background && background.a >= 0.2) {
      return luminance(background) < DARK_THRESHOLD ? 'dark' : 'light'
    }
    node = node.parentElement
  }

  return fallback
}

/**
 * 跟随宿主主题变化。
 * @param {(theme: 'light' | 'dark') => void} callback
 * @param {Document} [doc]
 * @returns {() => void} 取消订阅
 */
export function watchTheme(callback, doc = document) {
  const view = doc.defaultView
  if (!view) return () => {}

  let last = detectTheme(doc)
  let frame = 0

  const check = () => {
    frame = 0
    const next = detectTheme(doc)
    if (next === last) return
    last = next
    callback(next)
  }

  // 主题通常体现为 <html>/<body> 上的 class 或 data-theme，也可能只是一段内联样式
  const observer = new MutationObserver(() => {
    if (frame) return
    frame = view.requestAnimationFrame(check)
  })
  for (const target of [doc.documentElement, doc.body]) {
    if (!target) continue
    observer.observe(target, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    })
  }

  const media = view.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', check)

  return () => {
    observer.disconnect()
    media.removeEventListener('change', check)
    if (frame) view.cancelAnimationFrame(frame)
  }
}

/**
 * @param {Document} doc
 * @returns {boolean}
 */
function prefersDark(doc) {
  const view = doc.defaultView
  return view ? view.matchMedia('(prefers-color-scheme: dark)').matches : false
}
