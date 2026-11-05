/**
 * 样式表。
 *
 * 为什么是字符串而不是 .css 文件：Loader 只给前端一个 client.js，
 * 没有静态资源通道，样式必须随 JS 一起进来，由 apply() 注入 <style>。
 *
 * 分两段读：
 *   1. 外壳 —— 定位、气泡、设置面板（HTML 部分）
 *   2. 立绘 —— SVG 各层的动画（呼吸/眨眼/眼神/姿态）
 * 立绘的颜色刻意选了明暗主题都能站住的中间调，暗色下还有一层极淡的白色辉光兜底。
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
  width: 160px;
  height: 200px;
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
.dsh-mascot__art {
  width: 160px;
  height: 200px;
  transition: transform 180ms ease-out;
}

.dsh-mascot__stage:hover .dsh-mascot__art { transform: translateY(-3px); }

.dsh-mascot__svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 呼吸：整只上下微微起伏，作用在最外层组上，头和身体一起动才不散架 */
.mascot-breathe {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: mascot-breathe 4.8s ease-in-out infinite;
}

/* 眼神：头带一点点，瞳孔带多一点。--gaze-x/y 由 look-at.js 写在外层节点上 */
.mascot-head {
  transform-box: fill-box;
  transform-origin: 50% 88%;
  transform:
    translate(calc(var(--gaze-x, 0) * 2px), calc(var(--gaze-y, 0) * -1.5px))
    rotate(calc(var(--gaze-x, 0) * 3.5deg));
  transition: transform 240ms ease-out;
}

.mascot-pupil {
  transform: translate(calc(var(--gaze-x, 0) * 2.6px), calc(var(--gaze-y, 0) * -2px));
  transition: transform 90ms linear;
}

.mascot-eyes {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation: mascot-blink 5.6s ease-in-out infinite;
}

.mascot-ahoge {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: mascot-ahoge 3.8s ease-in-out infinite;
}

/* 嘴：三种形态常驻在 DOM 里，只切透明度，避免切姿态时闪一下 */
.mascot-mouth { opacity: 0; transition: opacity 120ms linear; }
.mascot-mouth--smile { opacity: 1; }

/* 等待确认：琥珀色光环脉冲 */
.mascot-ring {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

/* 打盹：飘出来的 zZz */
.mascot-zzz { opacity: 0; }

/* ---------------- 姿态 ---------------- */
.dsh-mascot[data-mood='working'] .mascot-breathe { animation-duration: 2.4s; }

.dsh-mascot[data-mood='working'] .mascot-eyes { animation-duration: 3.4s; }

.dsh-mascot[data-mood='waiting'] .mascot-ring {
  animation: mascot-ring 1.8s ease-out infinite;
}

/* 光环是"扫过去"的，单靠它容易漏看，再叠一层常亮的暖色描边 */
.dsh-mascot[data-mood='waiting'] .dsh-mascot__art {
  filter: drop-shadow(0 0 9px rgba(255, 184, 76, 0.55));
}

.dsh-mascot[data-mood='waiting'] .mascot-breathe { animation-duration: 3s; }

.dsh-mascot[data-mood='sleepy'] .mascot-breathe { animation-duration: 7s; }

.dsh-mascot[data-mood='sleepy'] .mascot-eyes {
  animation: none;
  transform: scaleY(0.1);
}

.dsh-mascot[data-mood='sleepy'] .mascot-mouth--smile { opacity: 0; }
.dsh-mascot[data-mood='sleepy'] .mascot-mouth--flat { opacity: 1; }

.dsh-mascot[data-mood='sleepy'] .mascot-zzz { opacity: 1; }
.dsh-mascot[data-mood='sleepy'] .mascot-zzz__a { animation: mascot-zzz 3.2s ease-in-out infinite; }
.dsh-mascot[data-mood='sleepy'] .mascot-zzz__b { animation: mascot-zzz 3.2s ease-in-out 1.1s infinite; }

.dsh-mascot[data-mood='happy'] .mascot-mouth--smile { opacity: 0; }
.dsh-mascot[data-mood='happy'] .mascot-mouth--open { opacity: 1; }
.dsh-mascot[data-mood='happy'] .dsh-mascot__art { animation: mascot-hop 520ms ease-out 2; }

/* ---------------- 气泡 ---------------- */
/* 贴在头顶而不是脚边：气泡是"她在说话"，位置必须靠近脸 */
.dsh-mascot__bubble {
  position: relative;
  align-self: flex-start;
  margin-top: 22px;
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
  right: 6px;
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
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.022); }
}

@keyframes mascot-blink {
  0%, 90%, 100% { transform: scaleY(1); }
  93% { transform: scaleY(0.08); }
  96% { transform: scaleY(1); }
}

@keyframes mascot-ahoge {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}

@keyframes mascot-ring {
  0% { opacity: 0.75; transform: scale(0.86); }
  75% { opacity: 0; transform: scale(1.08); }
  100% { opacity: 0; transform: scale(1.08); }
}

@keyframes mascot-zzz {
  0% { opacity: 0; transform: translateY(6px) scale(0.92); }
  25% { opacity: 0.85; }
  75% { opacity: 0.85; }
  100% { opacity: 0; transform: translateY(-10px) scale(1.06); }
}

@keyframes mascot-hop {
  0%, 100% { transform: translateY(0); }
  45% { transform: translateY(-10px); }
}

@keyframes mascot-pop {
  from { opacity: 0; transform: translateY(6px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .mascot-breathe,
  .mascot-eyes,
  .mascot-ahoge,
  .mascot-ring,
  .mascot-zzz__a,
  .mascot-zzz__b,
  .dsh-mascot__art,
  .dsh-mascot__bubble {
    animation: none !important;
  }
  .mascot-head,
  .mascot-pupil { transition: none !important; }
}

@media (max-width: 720px) {
  .dsh-mascot { right: 12px; bottom: 10px; }
  .dsh-mascot__body,
  .dsh-mascot__art { width: 120px; height: 150px; }
  .dsh-mascot__canvas { width: 150px; height: 190px; }
  .dsh-mascot__bubble { max-width: 150px; margin-bottom: 18px; }
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
