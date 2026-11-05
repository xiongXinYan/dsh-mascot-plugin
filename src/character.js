// @ts-check

import { PORTRAIT_DATA_URI } from './portrait.js'

/**
 * 内置立绘：一只趴着抬头的中华五黑犬。
 *
 * 主体是 portrait.js 里的透明底位图（按实拍照片生成）。这里只负责把它和
 * "会动、会表达状态"的叠加层组装起来：
 *
 *   .dsh-mascot__art      ← 眼神视差（--gaze-x / --gaze-y 由 look-at.js 写）
 *     .dsh-mascot__act    ← 姿态（--p-act 由 data-act 决定，走 transition）
 *       img               ← 呼吸 / 跳 / 明暗（走 animation，和姿态分层避免 transform 打架）
 *     .dsh-mascot__fx     ← 影子、等待光晕、打盹的 zZz
 *
 * 为什么位图和叠加层要分开：写实立绘不能再分部件弯折。原来 SVG 那套
 * "头转 8 度、耳朵转 12 度"用在照片级插画上，一动就露馅。现在整只狗保持
 * 形状不变，只做不破坏轮廓的轻微位移和缩放，状态交给外围元素表达。
 *
 * 三层 transform 是必须的：同一个元素上 transition 和 animation 会互相覆盖。
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
  // 纯静态字符串，没有任何用户输入拼进来。
  el.innerHTML = `<div class="dsh-mascot__act">
  <img class="dsh-mascot__portrait" src="${PORTRAIT_DATA_URI}" alt="" draggable="false" decoding="async">
</div>
<svg class="dsh-mascot__fx" viewBox="0 0 200 169" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-uid="${uid}">
  <ellipse class="mascot-shadow" cx="100" cy="160" rx="62" ry="4"/>
  <circle class="mascot-halo" cx="141" cy="56" r="40"/>
  <g class="mascot-zzz" font-family="system-ui, sans-serif" font-weight="700" fill="#cfc6e6">
    <text class="mascot-zzz__a" x="170" y="46" font-size="14">z</text>
    <text class="mascot-zzz__b" x="184" y="28" font-size="17">Z</text>
  </g>
</svg>`
  return el
}
