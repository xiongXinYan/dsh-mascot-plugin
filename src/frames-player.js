// @ts-check
/** @typedef {import('./types.js').MascotAct} MascotAct */

/**
 * 逐帧播放器：让立绘真的像一张循环 GIF，而不是把整张图挪几像素。
 *
 * 两层节奏：
 *   1. 待机微动（IDLE_BEATS）一直在跑——眨眼、头耳微动、间歇回正。
 *      一只不动的狗再写实也是死的，"活着"的感觉主要来自这几帧。
 *   2. 大动作（ACT_BEATS）由 acts.js 轮播触发，临时接管，播完回到待机。
 *
 * 切帧是硬切，不做 transition：GIF 就是硬切，加了淡入淡出会糊成重影。
 * 帧名对应 assets/frames/<name>.webp，新增帧要同时改 update-frames.mjs。
 */

/**
 * 每帧：[帧名, 停留毫秒]
 * @typedef {readonly (readonly [string, number])[]} Beats
 */

/** 待机循环。约 6 秒一轮，中间眨两次眼、动两次头耳。 */
/** @type {Beats} */
export const IDLE_BEATS = [
  ['rest', 1400],
  ['blink', 110],
  ['rest', 520],
  ['idleAlt', 1050],
  ['rest', 950],
  ['blink', 110],
  ['rest', 1250],
  ['idleAlt', 850],
]

/**
 * 大动作帧序列。时长不必精确对齐 ACT_MS——序列会自动循环，
 * acts.js 切回 `sit` 时交还待机。`sit` 本身没有专属序列。
 * @type {Record<MascotAct, Beats | null>}
 */
export const ACT_BEATS = {
  sit: null,
  stretch: [
    ['yawn', 900],
    ['yawn', 650],
    ['rest', 260],
    ['yawn', 560],
  ],
  bow: [
    ['bow', 1100],
    ['bow', 780],
    ['rest', 260],
    ['bow', 460],
  ],
  wink: [
    ['rest', 240],
    ['wink', 900],
    ['rest', 320],
  ],
  jump: [
    ['rest', 120],
    ['jump', 400],
    ['jump', 420],
    ['rest', 220],
  ],
  nap: [
    ['nap', 2600],
    ['rest', 620],
    ['nap', 1000],
  ],
  alert: [
    ['alert', 1100],
    ['idleAlt', 420],
    ['alert', 680],
  ],
}

/**
 * @typedef {object} FramePlayer
 * @property {() => void} start
 * @property {(act: MascotAct) => void} playAct
 * @property {() => string} current
 * @property {() => void} destroy
 */

/**
 * @param {object} options
 * @param {(frame: string) => void} options.onFrame
 * @param {(fn: () => void, ms: number) => number} [options.schedule]
 * @param {(id: number) => void} [options.cancel]
 * @param {boolean} [options.reducedMotion] 系统要求减少动效时只显示静态帧
 * @returns {FramePlayer}
 */
export function createFramePlayer({ onFrame, schedule, cancel, reducedMotion = false }) {
  /** 默认用 window 上的定时器；测试里换成假时钟。 */
  const set =
    schedule ??
    ((/** @type {() => void} */ fn, /** @type {number} */ ms) => Number(setTimeout(fn, ms)))
  const clear = cancel ?? ((/** @type {number} */ id) => clearTimeout(id))

  let timer = 0
  let running = false
  let frame = 'rest'
  /** @type {Beats} */
  let beats = IDLE_BEATS
  let cursor = 0
  /** 索引兜底；noUncheckedIndexedAccess 下 beats[i] 可能报 undefined。 */
  /** @type {readonly [string, number]} */
  const fallbackBeat = ['rest', 1400]

  /** @param {string} name */
  function show(name) {
    frame = name
    onFrame(name)
  }

  function step() {
    timer = 0
    if (!running || reducedMotion) return
    const beat = beats[cursor % beats.length] ?? fallbackBeat
    cursor += 1
    show(beat[0])
    timer = set(step, beat[1])
  }

  /** @param {Beats} next */
  function restart(next) {
    if (!running) return
    if (timer) clear(timer)
    timer = 0
    beats = next
    cursor = 0
    step()
  }

  return {
    start() {
      if (running) return
      running = true
      // 减少动效时完全不排定时器，只留一帧静态立绘
      if (reducedMotion) {
        show('rest')
        return
      }
      step()
    },

    playAct(act) {
      if (!running) return
      const sequence = ACT_BEATS[act]
      if (reducedMotion) {
        // 仍响应情绪/动作，但不逐帧播放（预览和截图也能看到对应姿态）
        show(sequence?.[0]?.[0] ?? 'rest')
        return
      }
      restart(sequence ?? IDLE_BEATS)
    },

    current: () => frame,

    destroy() {
      running = false
      if (timer) clear(timer)
      timer = 0
    },
  }
}
