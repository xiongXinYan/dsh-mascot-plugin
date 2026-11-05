// @ts-check

/** 头部最大转角（度），Cubism 参数的量纲。 */
const MAX_ANGLE = 30

/**
 * 把鼠标位置换算成归一化的视角偏移。
 *
 * 纯函数，方便单测：以 rect 中心为原点，右下为正向，四个方向都截断在 ±1。
 *
 * @param {number} clientX
 * @param {number} clientY
 * @param {{left: number, top: number, width: number, height: number}} rect
 * @returns {{x: number, y: number}}
 */
export function toGaze(clientX, clientY, rect) {
  const halfWidth = Math.max(rect.width / 2, 1)
  const halfHeight = Math.max(rect.height / 2, 1)
  const x = clamp((clientX - (rect.left + halfWidth)) / halfWidth)
  const y = clamp((rect.top + halfHeight - clientY) / halfHeight)
  return { x, y }
}

/**
 * @param {number} value
 * @returns {number}
 */
function clamp(value) {
  return Math.min(1, Math.max(-1, value))
}

/**
 * 让模型的眼神跟着鼠标走。
 *
 * 参数名用的是 Cubism 3/4 的标准 id，自定义模型若改名会静默无效——
 * 这类"没报错但没反应"的情况，优先怀疑参数名。
 *
 * @param {any} model Live2DModel 实例
 * @param {() => {left: number, top: number, width: number, height: number}} getRect
 * @returns {() => void} 解除监听
 */
export function attachLookAt(model, getRect) {
  let frame = 0

  /** @param {MouseEvent} event */
  function onMove(event) {
    if (frame) return // 一帧只处理一次，mousemove 比 rAF 密得多
    frame = window.requestAnimationFrame(() => {
      frame = 0
      const core = model?.internalModel?.coreModel
      if (typeof core?.setParameterValueById !== 'function') return

      const { x, y } = toGaze(event.clientX, event.clientY, getRect())
      core.setParameterValueById('ParamAngleX', x * MAX_ANGLE)
      core.setParameterValueById('ParamAngleY', y * MAX_ANGLE)
      core.setParameterValueById('ParamAngleZ', x * MAX_ANGLE * 0.3)
      core.setParameterValueById('ParamEyeBallX', x)
      core.setParameterValueById('ParamEyeBallY', y)
    })
  }

  window.addEventListener('mousemove', onMove, { passive: true })

  return () => {
    window.removeEventListener('mousemove', onMove)
    if (frame) window.cancelAnimationFrame(frame)
  }
}

/**
 * 让内置立绘的眼神跟着鼠标走。
 *
 * 和 attachLookAt 的区别只在于"往哪写"：Cubism 模型走参数 API，
 * SVG 立绘走 CSS 变量（--gaze-x / --gaze-y，范围 -1..1），
 * 具体偏移多少由 styles.js 决定，换模型时接口不用动。
 *
 * @param {HTMLElement} el 立绘根节点
 * @param {() => {left: number, top: number, width: number, height: number}} getRect
 * @returns {() => void} 解除监听
 */
export function attachGazeToElement(el, getRect) {
  let frame = 0
  /** @type {MouseEvent | null} */
  let latest = null

  /** @param {MouseEvent} event */
  function onMove(event) {
    latest = event
    if (frame) return
    frame = window.requestAnimationFrame(() => {
      frame = 0
      if (!latest) return
      const { x, y } = toGaze(latest.clientX, latest.clientY, getRect())
      el.style.setProperty('--gaze-x', x.toFixed(3))
      el.style.setProperty('--gaze-y', y.toFixed(3))
    })
  }

  window.addEventListener('mousemove', onMove, { passive: true })

  return () => {
    window.removeEventListener('mousemove', onMove)
    if (frame) window.cancelAnimationFrame(frame)
  }
}
