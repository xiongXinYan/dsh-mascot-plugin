/**
 * 样式表。
 *
 * 为什么是字符串而不是 .css 文件：Loader 只给前端一个 client.js，
 * 没有静态资源通道，样式必须随 JS 一起进来，由 apply() 注入 <style>。
 *
 * 四段读：
 *   1. 外壳 —— 定位、气泡、设置面板
 *   2. 立绘 —— 位图、状态叠加层、眼神视差
 *   3. 姿态与情绪 —— data-act 换 --p-act，整只狗做不破坏形体的变换
 *   4. 关键帧 —— 常态呼吸、跳、光晕、zZz
 *
 * 写实立绘不能分部件变形，所以 transform 分了三层：
 *   art（视差）→ act（姿态 transition）→ img（呼吸 animation）。
 * 同一个元素上 transition 和 animation 会互相覆盖，必须拆开。
 */

export const STYLE_ID = 'dsh-mascot-styles'

export const MASCOT_CSS = `
/* ---------------- 外壳 ---------------- */
.dsh-mascot-anchor {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 60;
}

.dsh-mascot {
  /* 浮层卡片的中性配色。data-theme 由 theme.js 按宿主界面判定后写在根节点上 */
  --mascot-surface: rgba(255, 255, 255, 0.94);
  --mascot-text: #1f2328;
  --mascot-line: rgba(15, 23, 42, 0.14);
  --mascot-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);

  /* 姿态回弹的缓动：带一点过冲，小动物的动作才不会像机械臂 */
  --ease-pose: cubic-bezier(0.34, 1.28, 0.58, 1);

  position: absolute;
  right: 24px;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  transform: scale(var(--dsh-mascot-scale, 1));
  transform-origin: bottom right;
  pointer-events: none;
  user-select: none;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  color: var(--mascot-text);
}

.dsh-mascot[data-theme='dark'] {
  --mascot-surface: rgba(32, 35, 42, 0.96);
  --mascot-text: #e8eaee;
  --mascot-line: rgba(255, 255, 255, 0.14);
  --mascot-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
}

/* 兜底：theme.js 没跑起来（例如被 CSP 拦了 inline script）时也不至于配色错乱 */
@media (prefers-color-scheme: dark) {
  .dsh-mascot:not([data-theme]) {
    --mascot-surface: rgba(32, 35, 42, 0.96);
    --mascot-text: #e8eaee;
    --mascot-line: rgba(255, 255, 255, 0.14);
    --mascot-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
  }
}

.dsh-mascot__stage {
  position: relative;
  pointer-events: auto;
}

.dsh-mascot__body {
  display: block;
  width: 216px;
  height: 213px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.dsh-mascot__body[hidden] { display: none; }

.dsh-mascot__body:focus-visible {
  outline: 2px solid #6f9df0;
  outline-offset: 4px;
  border-radius: 12px;
}

.dsh-mascot__canvas {
  display: block;
  width: 220px;
  height: 280px;
}

/* ---------------- 立绘 ---------------- */
/* 440×433 的统一裁切框，九帧共用。容器按原比例给，拉伸会把狗压扁 */
.dsh-mascot__art {
  position: relative;
  width: 216px;
  height: 213px;
  transform:
    translate(
      calc(var(--gaze-x, 0) * 2.5px),
      calc(var(--gaze-y, 0) * -1.6px + var(--hover-y, 0px))
    );
  transition: transform 200ms ease-out;
}

.dsh-mascot__stage:hover .dsh-mascot__art { --hover-y: -3px; }

.dsh-mascot__act {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  transform-origin: 50% 88%;
  transform: var(--p-act, none);
  transition: transform 480ms var(--ease-pose), filter 380ms ease-out;
}

/* 深色界面上黑狗会糊进背景：整体提一点亮度，比改毛色安全 */
.dsh-mascot[data-theme='dark'] .dsh-mascot__act { filter: brightness(1.13); }

/* 呼吸作用在帧栈外层，九帧一起轻轻起伏 */
.dsh-mascot__frames {
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: 50% 94%;
  animation: mascot-breathe 3.2s ease-in-out infinite;
  transition: filter 380ms ease-out;
}

.dsh-mascot__frame {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  pointer-events: none;
  -webkit-user-drag: none;
}

/* 硬切，不加 transition —— 逐帧动画淡入淡出会糊成重影 */
.dsh-mascot__frame[data-active] { opacity: 1; }

/* 影子、等待光晕、zZz 都在立绘身后，不碰狗本身 */
.dsh-mascot__fx {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.mascot-shadow {
  fill: #06050a;
  opacity: 0.22;
  filter: blur(3px);
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

.dsh-mascot[data-theme='dark'] .mascot-shadow { opacity: 0.34; }

.mascot-halo {
  fill: #ffb84c;
  opacity: 0;
  filter: blur(9px);
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

.mascot-zzz { opacity: 0; transition: opacity 260ms linear; }
.mascot-zzz text {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

/* ---------------- 姿态 ---------------- */
/* 形体变化全靠切帧，CSS 这里只补一点点整体重心偏移，别和帧抢戏 */
.dsh-mascot[data-act='stretch'] { --p-act: translateY(-3px); }
.dsh-mascot[data-act='bow']     { --p-act: translateY(3px); }
.dsh-mascot[data-act='wink']    { --p-act: rotate(-1.5deg); }
.dsh-mascot[data-act='jump']    { --p-act: translateY(-6px); }
.dsh-mascot[data-act='alert']   { --p-act: translateY(-2px); }
.dsh-mascot[data-act='nap']     { --p-act: none; }

.dsh-mascot[data-act='nap'] .dsh-mascot__frames {
  filter: brightness(0.9) saturate(0.92);
  /* 睡着时唯一还在动的就是呼吸，周期要短一点、幅度看得出来 */
  animation-duration: 3.4s;
}
.dsh-mascot[data-act='nap'] .mascot-zzz { opacity: 1; }
.dsh-mascot[data-act='nap'] .mascot-zzz__a { animation: mascot-zzz 3.2s ease-in-out infinite; }
.dsh-mascot[data-act='nap'] .mascot-zzz__b { animation: mascot-zzz 3.2s ease-in-out 1.1s infinite; }

/* ---------------- 情绪 ---------------- */
.dsh-mascot[data-mood='working'] .dsh-mascot__frames { animation-duration: 2.2s; }
.dsh-mascot[data-mood='happy'] .dsh-mascot__frames { animation-duration: 1.9s; }
.dsh-mascot[data-mood='sleepy'] .dsh-mascot__frames { animation-duration: 6.4s; }

.dsh-mascot[data-mood='waiting'] .mascot-halo {
  opacity: 0.42;
  animation: mascot-halo 2.6s ease-out infinite;
}

/* ---------------- 气泡 ---------------- */
/* 贴在头顶而不是脚边：气泡是"它在说话"，位置必须靠近脸 */
.dsh-mascot__bubble {
  position: relative;
  align-self: flex-start;
  margin-top: 12px;
  max-width: 190px;
  padding: 8px 12px;
  border-radius: 12px 12px 4px 12px;
  background: var(--mascot-surface);
  border: 1px solid var(--mascot-line);
  box-shadow: var(--mascot-shadow);
  animation: mascot-pop 180ms ease-out;
}

.dsh-mascot__bubble::after {
  content: '';
  position: absolute;
  right: 10px;
  bottom: -6px;
  width: 10px;
  height: 10px;
  background: var(--mascot-surface);
  border-right: 1px solid var(--mascot-line);
  border-bottom: 1px solid var(--mascot-line);
  border-radius: 0 0 3px 0;
  transform: rotate(45deg);
}

.dsh-mascot__bubble[hidden] { display: none; }

/* ---------------- 齿轮与面板 ---------------- */
.dsh-mascot__gear {
  position: absolute;
  right: 2px;
  top: 4px;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid rgba(127, 127, 127, 0.28);
  border-radius: 50%;
  background: rgba(127, 127, 127, 0.12);
  color: inherit;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  pointer-events: auto;
  /* 不能用 opacity: 0 常驻：触屏设备没有 hover，等于把设置入口藏死了。
     给一个够淡但始终可点的默认态，悬停/聚焦时再提亮。 */
  opacity: 0.42;
  transition: opacity 140ms ease-out;
}

.dsh-mascot:hover .dsh-mascot__gear,
.dsh-mascot__gear:focus-visible { opacity: 1; }

.dsh-mascot__panel {
  position: absolute;
  /* 往左开、往上抬：不要盖住立绘，也不要压住输入框 —— 压在输入框上等于把人锁在门外 */
  right: calc(100% + 10px);
  bottom: calc(100% + 8px);
  width: 248px;
  max-height: min(64vh, 460px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 12px;
  border-radius: 14px;
  background: var(--mascot-surface);
  border: 1px solid var(--mascot-line);
  box-shadow: var(--mascot-shadow);
  pointer-events: auto;
  display: grid;
  gap: 8px;
  font-size: 12px;
}

.dsh-mascot__panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}

.dsh-mascot__panel-close {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.6;
}

.dsh-mascot__row {
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  gap: 8px;
  opacity: 0.9;
}

.dsh-mascot__input {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid var(--mascot-line);
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  color: inherit;
  font: inherit;
}

.dsh-mascot__hint {
  margin: 0;
  font-size: 11px;
  opacity: 0.55;
  line-height: 1.4;
}

/* ---------------- 关键帧 ---------------- */
@keyframes mascot-breathe {
  0%, 100% { transform: scale(1, 1); }
  50% { transform: scale(1.012, 1.026); }
}

@keyframes mascot-halo {
  0%   { opacity: 0.42; transform: scale(0.9); }
  70%  { opacity: 0.12; transform: scale(1.12); }
  100% { opacity: 0.42; transform: scale(0.9); }
}

@keyframes mascot-zzz {
  0%   { opacity: 0; transform: translateY(6px) scale(0.9); }
  25%  { opacity: 0.9; }
  75%  { opacity: 0.9; }
  100% { opacity: 0; transform: translateY(-10px) scale(1.06); }
}

@keyframes mascot-pop {
  from { opacity: 0; transform: translateY(6px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .dsh-mascot__frames,
  .mascot-halo,
  .mascot-shadow,
  .mascot-zzz__a,
  .mascot-zzz__b,
  .dsh-mascot__bubble {
    animation: none !important;
  }
  .dsh-mascot__art,
  .dsh-mascot__act,
  .dsh-mascot__frames { transition: none !important; }
}

@media (max-width: 720px) {
  .dsh-mascot { right: 12px; bottom: 10px; }
  .dsh-mascot__body,
  .dsh-mascot__art { width: 162px; height: 160px; }
  .dsh-mascot__canvas { width: 150px; height: 190px; }
  .dsh-mascot__bubble { max-width: 150px; margin-top: 8px; }
}
`

/** 注入一次样式表。重复调用是幂等的，方便热更新。 */
export function injectStyles() {
  if (document.getElementById(STYLE_ID)) return () => {}

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = MASCOT_CSS
  document.head.appendChild(style)

  return () => style.remove()
}
