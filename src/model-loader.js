// @ts-check

/** 运行时缺失时给一条能排查的提示，比 "Cannot read properties of undefined" 有用。 */
export const RUNTIME_MISSING = '未检测到 Live2D 运行时：window.PIXI.live2d 不存在'

/** 画布尺寸（CSS 像素）。模型按这个比例摆放，缩放交给外层 transform。 */
const STAGE_WIDTH = 220
const STAGE_HEIGHT = 280

/** @returns {any} */
function getPIXI() {
  return /** @type {any} */ (globalThis).PIXI
}

/**
 * Cubism 运行时是否就绪。
 *
 * 注意：这是"宿主有没有注入 Live2D 运行时"，不是"模型文件在不在"。
 * 两者失败要分开提示，否则用户只会看到一句笼统的"加载失败"。
 *
 * @returns {boolean}
 */
export function hasLive2DRuntime() {
  const PIXI = getPIXI()
  return Boolean(PIXI?.Application && PIXI?.live2d?.Live2DModel)
}

/**
 * 读取模型清单（assets/models.json，由 `pnpm build` 扫描 assets/ 生成）。
 *
 * 浏览器不能列目录，所以"自动扫描 .model3.json"必须发生在构建期或宿主侧，
 * 前端只能读这份清单。清单不存在时返回空数组，不抛错。
 *
 * @param {string} [url]
 * @returns {Promise<Array<{id: string, label: string, url: string}>>}
 */
export async function fetchModelManifest(url = 'assets/models.json') {
  try {
    const response = await fetch(url, { credentials: 'same-origin' })
    if (!response.ok) return []
    /** @type {{models?: Array<{id: string, label: string, url: string}>}} */
    const data = await response.json()
    return Array.isArray(data.models) ? data.models : []
  } catch {
    return []
  }
}

/**
 * 把 Live2D 模型挂进容器。
 *
 * 失败时会把已经创建的 canvas / Application 一起清掉再抛错，
 * 避免"模型加载失败但画布留在那儿挡着占位立绘"。
 *
 * @param {HTMLElement} container
 * @param {string} url .model3.json 地址
 * @returns {Promise<{destroy: () => void, model: any}>}
 */
export async function mountLive2D(container, url) {
  if (!hasLive2DRuntime()) throw new Error(RUNTIME_MISSING)

  const PIXI = getPIXI()
  const app = new PIXI.Application({
    backgroundAlpha: 0,
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
  })

  const view = /** @type {HTMLCanvasElement} */ (app.view)
  view.className = 'dsh-mascot__canvas'
  container.appendChild(view)

  try {
    const model = await PIXI.live2d.Live2DModel.from(url, { autoInteract: false })
    model.anchor?.set?.(0.5, 1)
    model.position.set(STAGE_WIDTH / 2, STAGE_HEIGHT)
    model.scale.set(1)
    app.stage.addChild(model)

    return {
      model,
      destroy() {
        view.remove()
        app.destroy(true, { children: true })
      },
    }
  } catch (error) {
    view.remove()
    app.destroy(true, { children: true })
    throw error
  }
}
