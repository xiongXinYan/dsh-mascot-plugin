// @ts-check

import { FRAME_URIS } from './frames.js'

/**
 * 内置立绘：一只趴着抬头的中华五黑犬，九帧姿态循环。
 *
 * 结构（从外到内）：
 *   .dsh-mascot__art      ← 眼神视差（--gaze-x / --gaze-y 由 look-at.js 写）
 *     .dsh-mascot__act    ← 情绪/动作的整图微调（--p-act）
 *       .dsh-mascot__frames  ← 呼吸；里面九张帧图叠在一起
 *         img[data-frame]    ← 只有带 data-active 的那张可见，硬切
 *     .dsh-mascot__fx     ← 影子、等待光晕、打盹的 zZz（在立绘身后）
 *
 * 所有帧共用同一个裁切框（见 scripts/update-frames.mjs），所以切帧时
 * 狗不会跳位置。叠在一起而不是改 img.src，是为了避免解码瞬间闪白。
 *
 * 三层 transform 必须分开：同一个元素上 transition 和 animation 会互相覆盖。
 */

/** 多实例时给叠加层加个标识，便于调试区分。 */
let instanceSeq = 0

/**
 * 造一个立绘节点。
 * @returns {HTMLDivElement}
 */
export function createCharacter() {
  const uid = `mc${++instanceSeq}`
  const el = document.createElement('div')
  el.className = 'dsh-mascot__art'

  // 纯静态字符串，没有任何用户输入拼进来。rest 必须是第一帧（初始显示）。
  const imgs = Object.entries(FRAME_URIS)
    .map(
      ([name, uri], i) =>
        `<img class="dsh-mascot__frame" data-frame="${name}" src="${uri}" alt="" draggable="false" decoding="async"${i === 0 ? ' data-active' : ''}>`,
    )
    .join('')

  el.innerHTML = `<div class="dsh-mascot__act"><div class="dsh-mascot__frames">${imgs}</div></div>
<svg class="dsh-mascot__fx" viewBox="0 0 200 197" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-uid="${uid}">
  <ellipse class="mascot-shadow" cx="100" cy="187" rx="62" ry="4"/>
  <circle class="mascot-halo" cx="138" cy="72" r="40"/>
  <g class="mascot-zzz" font-family="system-ui, sans-serif" font-weight="700" fill="#cfc6e6">
    <text class="mascot-zzz__a" x="170" y="48" font-size="14">z</text>
    <text class="mascot-zzz__b" x="184" y="28" font-size="17">Z</text>
  </g>
</svg>`
  return el
}

/**
 * 硬切到某一帧。帧名不存在时保持现状，避免动画序列写错导致整只狗消失。
 * @param {HTMLElement} art createCharacter() 的返回值
 * @param {string} name
 * @returns {void}
 */
export function showFrame(art, name) {
  const next = art.querySelector(`[data-frame="${name}"]`)
  if (!next || next.hasAttribute('data-active')) return
  const current = art.querySelector('[data-frame][data-active]')
  if (current) current.removeAttribute('data-active')
  next.setAttribute('data-active', '')
}
