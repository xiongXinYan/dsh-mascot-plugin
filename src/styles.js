/**
 * 样式表。
 *
 * 为什么是字符串而不是 .css 文件：Loader 只给前端一个 client.js，
 * 没有静态资源通道，样式必须随 JS 一起进来，由 apply() 注入 <style>。
 */

export const STYLE_ID = 'dsh-mascot-styles'

export const MASCOT_CSS = `
.dsh-mascot-anchor {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 60;
}

.dsh-mascot {
  position: absolute;
  right: 24px;
  bottom: 20px;
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
  color: inherit;
}

.dsh-mascot__stage {
  position: relative;
  pointer-events: auto;
  transition: transform 160ms ease-out;
}

.dsh-mascot__stage:hover {
  transform: translateY(-2px);
}

.dsh-mascot__canvas {
  display: block;
  width: 220px;
  height: 280px;
}

/* 没有模型时的占位立绘：一个会呼吸的小家伙，保证插件肉眼可验证 */
.dsh-mascot__body {
  position: relative;
  width: 96px;
  height: 116px;
  padding: 0;
  border: none;
  cursor: pointer;
  border-radius: 52% 52% 46% 46% / 58% 58% 42% 42%;
  background:
    radial-gradient(circle at 32% 26%, rgba(255, 255, 255, 0.85), transparent 42%),
    linear-gradient(168deg, #9ec7ff 0%, #6f9df0 58%, #5a86e0 100%);
  box-shadow:
    0 12px 28px rgba(60, 92, 160, 0.28),
    inset 0 -8px 18px rgba(38, 62, 120, 0.22);
  transform-origin: bottom center;
  animation: dsh-mascot-breathe 4.6s ease-in-out infinite;
  transition: transform 160ms ease-out;
}

.dsh-mascot__body:focus-visible {
  outline: 2px solid #6f9df0;
  outline-offset: 3px;
}

.dsh-mascot__eye {
  position: absolute;
  top: 44px;
  width: 9px;
  height: 13px;
  border-radius: 50%;
  background: #1d2740;
  animation: dsh-mascot-blink 6.4s ease-in-out infinite;
}

.dsh-mascot__eye--left { left: 30px; }
.dsh-mascot__eye--right { right: 30px; }

.dsh-mascot__mouth {
  position: absolute;
  left: 50%;
  top: 66px;
  width: 12px;
  height: 6px;
  margin-left: -6px;
  border-radius: 0 0 8px 8px;
  background: rgba(29, 39, 64, 0.72);
}

.dsh-mascot__bubble {
  max-width: 200px;
  padding: 8px 12px;
  border-radius: 12px 12px 4px 12px;
  background: rgba(127, 127, 127, 0.12);
  border: 1px solid rgba(127, 127, 127, 0.22);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  animation: dsh-mascot-pop 180ms ease-out;
}

.dsh-mascot__bubble[hidden] { display: none; }

.dsh-mascot__gear {
  position: absolute;
  right: 0;
  top: 0;
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
  opacity: 0;
  transition: opacity 140ms ease-out;
}

.dsh-mascot:hover .dsh-mascot__gear,
.dsh-mascot__gear:focus-visible {
  opacity: 1;
}

.dsh-mascot__panel {
  position: absolute;
  right: 0;
  bottom: 8px;
  width: 248px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(127, 127, 127, 0.14);
  border: 1px solid rgba(127, 127, 127, 0.24);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
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
  border: 1px solid rgba(127, 127, 127, 0.28);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font: inherit;
}

.dsh-mascot__hint {
  margin: 0;
  font-size: 11px;
  opacity: 0.55;
  line-height: 1.4;
}

/* 工作态：呼吸更快 */
.dsh-mascot[data-mood='working'] .dsh-mascot__body { animation-duration: 1.5s; }

/* 等待确认：加一圈琥珀色提示环 */
.dsh-mascot[data-mood='waiting'] .dsh-mascot__body {
  animation-duration: 1s;
  box-shadow:
    0 0 0 3px rgba(255, 186, 76, 0.5),
    0 12px 28px rgba(60, 92, 160, 0.28);
}

/* 打盹：压扁一点、眼睛闭上 */
.dsh-mascot[data-mood='sleepy'] .dsh-mascot__body {
  animation-duration: 6.5s;
  filter: saturate(0.85);
}

.dsh-mascot[data-mood='sleepy'] .dsh-mascot__eye {
  height: 2px;
  animation: none;
}

.dsh-mascot[data-mood='happy'] .dsh-mascot__body {
  animation: dsh-mascot-hop 420ms ease-out 2;
}

@keyframes dsh-mascot-breathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.025); }
}

@keyframes dsh-mascot-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

@keyframes dsh-mascot-hop {
  0%, 100% { transform: translateY(0); }
  45% { transform: translateY(-10px); }
}

@keyframes dsh-mascot-pop {
  from { opacity: 0; transform: translateY(6px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .dsh-mascot__body,
  .dsh-mascot__eye,
  .dsh-mascot__bubble,
  .dsh-mascot__stage {
    animation: none !important;
    transition: none !important;
  }
}

@media (max-width: 720px) {
  .dsh-mascot { right: 12px; bottom: 12px; }
  .dsh-mascot__canvas { width: 150px; height: 190px; }
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
