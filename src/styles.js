/**
 * 样式表。
 *
 * 为什么是字符串而不是 .css 文件：Loader 只给前端一个 client.js，
 * 没有静态资源通道，样式必须随 JS 一起进来，由 apply() 注入 <style>。
 *
 * 三段读：
 *   1. 外壳 —— 定位、气泡、设置面板
 *   2. 立绘 —— 每一层都只认一个 CSS 变量（--p-xxx），几何全在 character.js
 *   3. 姿态与关键帧 —— 每套动作就是一组变量值，切换靠 transition 过渡
 *
 * 姿态为什么用变量而不是每个动作写一套 keyframes：
 *   六个动作 × 七个部位 = 42 段关键帧，改一处就要同步改六处。
 *   用变量的话，"趴下"只是把 --p-root 换成另一串 transform，部位之间的相对关系
 *   由浏览器插值，改一个动作只动一行。
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
  width: 168px;
  height: 168px;
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
  width: 168px;
  height: 168px;
  transition: transform 180ms ease-out, filter 260ms ease-out;
}

.dsh-mascot__stage:hover .dsh-mascot__art { transform: translateY(-3px); }

.dsh-mascot__svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 所有会动的组都要 fill-box，否则 transform-origin 的百分比是按视口算的 */
.dog-hop,
.dog-pose,
.dog-breathe,
.dog-head-pose,
.dog-head-sway,
.dog-head,
.dog-ear,
.dog-tail-pose,
.dog-tail-wag,
.dog-hind,
.dog-leg-l,
.dog-leg-r,
.dog-eye,
.dog-eye-pose,
.dog-tongue { transform-box: fill-box; }

/* 待机呼吸：整体起伏，头身一起动才不散架 */
.dog-breathe {
  transform-origin: 50% 100%;
  animation: dog-breathe 4.6s ease-in-out infinite;
}

/* 姿态层：整只狗的位移与形变 */
.dog-pose {
  transform: var(--p-root, none);
  transform-origin: 50% 100%;
  transition: transform 520ms var(--ease-pose);
}

/* 头：姿态 → 待机微晃 → 跟鼠标。三层必须是三个元素，transform 只有一个 */
.dog-head-pose {
  transform: var(--p-head, none);
  transform-origin: 50% 94%;
  transition: transform 460ms var(--ease-pose);
}

.dog-head-sway {
  transform-origin: 50% 96%;
  animation: dog-sway 6.4s ease-in-out infinite;
}

.dog-head {
  transform:
    translate(calc(var(--gaze-x, 0) * 2.4px), calc(var(--gaze-y, 0) * -2px))
    rotate(calc(var(--gaze-x, 0) * 3deg));
  transition: transform 200ms ease-out;
}

/* 耳：立耳会随情绪前压或后倒，这是狗最有表情的部位 */
.dog-ear { transform-origin: 50% 100%; transition: transform 340ms var(--ease-pose); }
.dog-ear--l { transform: var(--p-ear-l, none); }
.dog-ear--r { transform: var(--p-ear-r, none); }

/* 尾：姿态负责"抬多高"，关键帧负责"摇" */
.dog-tail-pose {
  transform: var(--p-tail, none);
  transform-origin: 14% 86%;
  transition: transform 420ms var(--ease-pose);
}

.dog-tail-wag {
  transform-origin: 14% 90%;
  animation: dog-wag 2.1s ease-in-out infinite;
}

.dog-hind {
  transform: var(--p-hind, none);
  transform-origin: 50% 92%;
  transition: transform 460ms var(--ease-pose);
}

.dog-leg-l,
.dog-leg-r {
  transform-origin: 50% 5%;
  transition: transform 460ms var(--ease-pose);
}

.dog-leg-l { transform: var(--p-leg-l, none); }
.dog-leg-r { transform: var(--p-leg-r, none); }

/* 眼：姿态（眯/闭）在外层，跟鼠标在内层 */
.dog-eye-pose {
  transform: var(--p-eye, none);
  transform-origin: 50% 50%;
  transition: transform 320ms var(--ease-pose);
}

.dog-eyes {
  transform-origin: 50% 50%;
  animation: dog-blink 5.4s ease-in-out infinite;
}

.dog-eye {
  transform: translate(calc(var(--gaze-x, 0) * 1.7px), calc(var(--gaze-y, 0) * -1.4px));
  transition: transform 120ms linear, opacity 140ms linear;
}

.dog-eye.dog-eye--r {
  transform: var(--p-eye-r, none) translate(calc(var(--gaze-x, 0) * 1.7px), calc(var(--gaze-y, 0) * -1.4px));
  transition: transform 220ms var(--ease-pose), opacity 140ms linear;
}

.dog-wink-line { opacity: 0; transition: opacity 120ms linear; }

/* 眼睑弧：眯眼 / 闭眼直接用画的线，比把眼球压扁干净 —— 压扁会留一条琥珀色细缝 */
.dog-lid { opacity: 0; transition: opacity 140ms linear; }

.dog-tongue {
  transform: var(--p-tongue, none);
  transform-origin: 50% 4%;
  transition: transform 340ms var(--ease-pose);
}

/* 等待确认：琥珀光环脉冲 */
.dog-ring {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

/* 打盹：飘出来的 zZz */
.dog-zzz { opacity: 0; transition: opacity 260ms linear; }

/* ---------------- 姿态 ---------------- */
/* 坐着：基准姿态，所有变量都是默认值，不需要额外声明 */

/* 伸懒腰：站起来往上撑，眼睛眯着，舌头伸出来一点 */
.dsh-mascot[data-act='stretch'] .dog-eye { opacity: 0; }
.dsh-mascot[data-act='stretch'] .dog-lid--squint { opacity: 1; }

.dsh-mascot[data-act='stretch'] {
  --p-root: translateY(-5px) scaleY(1.06);
  --p-head: translateY(-7px) rotate(-3deg);
  --p-leg-l: rotate(3deg) translateY(-3px);
  --p-leg-r: rotate(-3deg) translateY(-3px);
  --p-hind: translateY(-5px);
  --p-tail: rotate(-18deg);
  --p-tongue: scaleY(1.25);
  --p-ear-l: rotate(-6deg);
  --p-ear-r: rotate(6deg);
}

/* 下犬式：前低后高，屁股撅起来，尾巴翘到最高 */
.dsh-mascot[data-act='bow'] {
  --p-root: scaleY(0.9);
  --p-head: translateY(15px) scale(1.02);
  --p-leg-l: rotate(-13deg) translate(1px, 3px);
  --p-leg-r: rotate(13deg) translate(-1px, 3px);
  --p-hind: translateY(-16px) scaleY(1.14);
  --p-tail: rotate(-42deg);
  --p-ear-l: rotate(-15deg);
  --p-ear-r: rotate(15deg);
  --p-tongue: translateY(2px) scaleY(1.5);
}

/* wink：头一歪，右眼闭上，一条眼睑线补上闭合的弧度 */
.dsh-mascot[data-act='wink'] {
  --p-root: translateY(-2px);
  --p-head: translateY(-3px) rotate(-8deg);
  --p-tail: rotate(-26deg);
  --p-tongue: scaleY(1.35);
  --p-ear-l: rotate(-10deg);
  --p-ear-r: rotate(4deg);
}

.dsh-mascot[data-act='wink'] .dog-eye--r { opacity: 0; }
.dsh-mascot[data-act='wink'] .dog-wink-line { opacity: 1; }

/* 跳：形变交给 .dog-hop 的关键帧，这里只调整零件朝向 */
.dsh-mascot[data-act='jump'] {
  --p-leg-l: rotate(8deg);
  --p-leg-r: rotate(-8deg);
  --p-hind: translateY(4px);
  --p-tail: rotate(-30deg);
  --p-ear-l: rotate(-12deg);
  --p-ear-r: rotate(12deg);
  --p-tongue: translateY(1px) scaleY(1.45);
}

.dsh-mascot[data-act='jump'] .dog-hop {
  transform-origin: 50% 100%;
  animation: dog-hop 1200ms var(--ease-pose) both;
}

.dsh-mascot[data-act='jump'] .dog-shadow {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation: dog-shadow-hop 1200ms var(--ease-pose) both;
}

/* 打盹：整只趴下去，耳后倒，尾巴收到身边，眼睛闭死 */
.dsh-mascot[data-act='nap'] {
  --p-root: scaleY(0.84) rotate(-2deg);
  --p-head: translateY(13px) rotate(6deg) scale(0.97);
  --p-ear-l: rotate(26deg);
  --p-ear-r: rotate(-26deg);
  --p-tail: rotate(22deg) scale(0.86);
  --p-hind: translateY(8px);
  --p-leg-l: rotate(-4deg) translateY(6px);
  --p-leg-r: rotate(4deg) translateY(6px);
}

.dsh-mascot[data-act='nap'] .dog-eyes { animation: none; }
.dsh-mascot[data-act='nap'] .dog-eye { opacity: 0; }
.dsh-mascot[data-act='nap'] .dog-lid--sleep { opacity: 1; }
.dsh-mascot[data-act='nap'] .dog-zzz { opacity: 1; }
.dsh-mascot[data-act='nap'] .dog-zzz__a { animation: dog-zzz 3.2s ease-in-out infinite; }
.dsh-mascot[data-act='nap'] .dog-zzz__b { animation: dog-zzz 3.2s ease-in-out 1.1s infinite; }
.dsh-mascot[data-act='nap'] .dog-breathe { animation-duration: 7.4s; }

/* 等你确认：抬头、竖耳、尾巴压低蓄势 */
.dsh-mascot[data-act='alert'] {
  --p-root: translateY(-3px) scaleY(1.03);
  --p-head: translateY(-7px) rotate(-2deg);
  --p-ear-l: rotate(-7deg);
  --p-ear-r: rotate(7deg);
  --p-tail: rotate(-14deg);
}

/* ---------------- 情绪 ---------------- */
.dsh-mascot[data-mood='working'] .dog-breathe { animation-duration: 2.8s; }
.dsh-mascot[data-mood='working'] .dog-tail-wag { animation-duration: 1.1s; }
.dsh-mascot[data-mood='working'] .dog-eyes { animation-duration: 3.6s; }

.dsh-mascot[data-mood='happy'] .dog-tail-wag { animation-duration: 0.42s; }

.dsh-mascot[data-mood='waiting'] .dog-ring {
  animation: dog-ring 1.8s ease-out infinite;
}

/* 光环是"扫过去"的，单靠它容易漏看，再叠一层常亮的暖色描边 */
.dsh-mascot[data-mood='waiting'] .dsh-mascot__art {
  filter: drop-shadow(0 0 9px rgba(255, 184, 76, 0.5));
}

.dsh-mascot[data-mood='waiting'] .dog-tail-wag { animation-duration: 0.9s; }

.dsh-mascot[data-mood='sleepy'] .dog-tail-wag { animation-duration: 4.2s; }

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
@keyframes dog-breathe {
  0%, 100% { transform: scale(1, 1); }
  50% { transform: scale(1.012, 1.028); }
}

@keyframes dog-sway {
  0%, 100% { transform: rotate(-1.1deg) translateY(0); }
  50% { transform: rotate(1.1deg) translateY(-1.2px); }
}

@keyframes dog-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.06); }
  97% { transform: scaleY(1); }
}

@keyframes dog-wag {
  0%, 100% { transform: rotate(-9deg); }
  50% { transform: rotate(12deg); }
}

@keyframes dog-hop {
  0% { transform: translateY(0) scale(1, 1); }
  16% { transform: translateY(5px) scale(1.07, 0.9); }
  38% { transform: translateY(-28px) scale(0.95, 1.09); }
  58% { transform: translateY(-6px) scale(0.99, 1.02); }
  76% { transform: translateY(4px) scale(1.06, 0.93); }
  100% { transform: translateY(0) scale(1, 1); }
}

@keyframes dog-shadow-hop {
  0%, 100% { transform: scale(1); opacity: 0.26; }
  38% { transform: scale(0.72); opacity: 0.12; }
  76% { transform: scale(1.04); opacity: 0.28; }
}

@keyframes dog-ring {
  0% { opacity: 0.75; transform: scale(0.86); }
  75% { opacity: 0; transform: scale(1.08); }
  100% { opacity: 0; transform: scale(1.08); }
}

@keyframes dog-zzz {
  0% { opacity: 0; transform: translateY(6px) scale(0.92); }
  25% { opacity: 0.85; }
  75% { opacity: 0.85; }
  100% { opacity: 0; transform: translateY(-10px) scale(1.06); }
}

@keyframes mascot-pop {
  from { opacity: 0; transform: translateY(6px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .dog-breathe,
  .dog-head-sway,
  .dog-eyes,
  .dog-tail-wag,
  .dog-hop,
  .dog-shadow,
  .dog-ring,
  .dog-zzz__a,
  .dog-zzz__b,
  .dsh-mascot__art,
  .dsh-mascot__bubble {
    animation: none !important;
  }
  .dog-pose,
  .dog-head-pose,
  .dog-ear,
  .dog-tail-pose,
  .dog-hind,
  .dog-leg-l,
  .dog-leg-r,
  .dog-eye-pose,
  .dog-eye,
  .dog-tongue,
  .dog-head { transition: none !important; }
}

@media (max-width: 720px) {
  .dsh-mascot { right: 12px; bottom: 10px; }
  .dsh-mascot__body,
  .dsh-mascot__art { width: 126px; height: 126px; }
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
