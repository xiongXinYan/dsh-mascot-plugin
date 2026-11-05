// @ts-check
/** @typedef {import('./types.js').MascotAct} MascotAct */
/** @typedef {import('./types.js').MascotMood} MascotMood */

/**
 * 小动作播放器。
 *
 * 为什么需要它：立绘只有一张，但看起来要像动图那样一直在动。
 * 做法是把"形状"交给 data-act（每套姿态就是一组 transform，切换时靠 transition 过渡），
 * 这里只负责**什么时候切成哪一套**，不碰任何几何。
 *
 * 节奏设计：每个动作之前先回一次 `sit`（实际是趴姿，名字沿用早期代码）。
 * 少了这个中间态，两个动作连着切会像抽帧；有了它，观感是"趴着 → 支起来做个动作 → 趴回去"。
 */

/** 每个动作持续多久（毫秒）。和 CSS 里的 transition 时长是对着调的。 */
export const ACT_MS = {
  sit: 1500,
  stretch: 2400,
  bow: 2600,
  wink: 1500,
  jump: 1200,
  nap: 4200,
  alert: 2200,
}

/** 所有动作的共同落点。 */
export const BASE_ACT = /** @type {const} */ ('sit')

/**
 * 每种情绪下允许出现的动作池。
 *
 * 等人确认的时候不该跑去睡觉，所以 `waiting` 池里只有 `alert`；
 * 打盹同理。这两个是"被情绪钉住"的姿态，不参与轮播。
 * @type {Record<MascotMood, readonly MascotAct[]>}
 */
export const ACT_POOL = {
  idle: ['stretch', 'bow', 'wink', 'jump', 'nap'],
  working: ['stretch', 'wink', 'bow'],
  waiting: ['alert'],
  sleepy: ['nap'],
  happy: ['jump', 'wink'],
}

/** 被情绪钉住、不轮播的动作。 */
const HELD_ACTS = /** @type {Partial<Record<MascotMood, MascotAct>>} */ ({
  waiting: 'alert',
  sleepy: 'nap',
})

/**
 * 洗牌。
 * @param {readonly MascotAct[]} pool
 * @param {() => number} random
 * @returns {MascotAct[]}
 */
function shuffle(pool, random) {
  /** @type {MascotAct[]} */
  const copy = [...pool]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.min(i, Math.floor(random() * (i + 1)))
    const a = /** @type {MascotAct} */ (copy[i])
    const b = /** @type {MascotAct} */ (copy[j])
    copy[i] = b
    copy[j] = a
  }
  return copy
}

/**
 * 两次动作之间在 `sit`（趴姿）上停多久。
 * 带随机是刻意的：固定间隔听一会儿就像节拍器。
 * @param {() => number} random
 * @returns {number}
 */
export function gapMs(random) {
  return 620 + Math.floor(random() * 880)
}

/**
 * 这个情绪是不是"钉住某个姿态"的。
 * @param {MascotMood} mood
 * @returns {MascotAct | null}
 */
export function heldActOf(mood) {
  return HELD_ACTS[mood] ?? null
}

/**
 * @typedef {object} ActPlayer
 * @property {() => void} start
 * @property {(mood: MascotMood) => void} setMood
 * @property {(act: MascotAct) => void} poke 临时插入一个动作，做完回到轮播
 * @property {() => MascotAct} current
 * @property {() => void} destroy
 */

/**
 * @param {object} options
 * @param {(act: MascotAct) => void} options.onAct
 * @param {() => number} [options.random]
 * @param {(fn: () => void, ms: number) => number} [options.schedule]
 * @param {(id: number) => void} [options.cancel]
 * @returns {ActPlayer}
 */
export function createActPlayer({ onAct, random = Math.random, schedule, cancel }) {
  /** 默认用 window 上的定时器；测试里换成假时钟。 */
  const set =
    schedule ??
    ((/** @type {() => void} */ fn, /** @type {number} */ ms) => Number(setTimeout(fn, ms)))
  const clear = cancel ?? ((/** @type {number} */ id) => clearTimeout(id))

  /** @type {MascotAct} */
  let act = BASE_ACT
  /** @type {MascotAct[]} */
  let queue = []
  /** @type {MascotMood} */
  let mood = 'idle'
  /** @type {number} */
  let timer = 0
  let running = false
  /** 用 poke 插进来的动作，做完要回到轮播而不是停在上面。 */
  let poking = false

  /** @param {MascotAct} next */
  function play(next) {
    act = next
    onAct(next)
  }

  /** 取下一个动作。池子抽完就重新洗一次，并尽量避免和上一个撞。 */
  function takeNext() {
    if (queue.length === 0) queue = shuffle(ACT_POOL[mood], random)
    const picked = queue.shift() ?? BASE_ACT
    return picked === act && queue.length > 0 ? /** @type {MascotAct} */ (queue.shift()) : picked
  }

  /**
   * 排一个定时器；重复调用不会叠。
   * @param {number} ms
   * @param {() => void} fn
   */
  function after(ms, fn) {
    if (timer) clear(timer)
    timer = set(fn, ms)
  }

  function tick() {
    timer = 0
    if (!running) return

    if (poking) {
      poking = false
      play(BASE_ACT)
      after(gapMs(random), tick)
      return
    }

    const held = heldActOf(mood)
    if (held) {
      // 被钉住：停在那个姿态上，不再轮播
      if (act !== held) play(held)
      return
    }

    if (act === BASE_ACT) {
      const next = takeNext()
      play(next)
      after(Math.round(ACT_MS[next] * (mood === 'working' ? 0.8 : 1)), tick)
    } else {
      play(BASE_ACT)
      after(gapMs(random), tick)
    }
  }

  return {
    start() {
      if (running) return
      running = true
      const held = heldActOf(mood)
      if (held) {
        play(held)
        return
      }
      play(BASE_ACT)
      after(gapMs(random), tick)
    },

    setMood(next) {
      if (next === mood) return
      mood = next
      queue = []
      poking = false
      if (!running) return

      const held = heldActOf(mood)
      if (held) {
        if (timer) clear(timer)
        timer = 0
        play(held)
        return
      }
      // 从钉住的姿态里解放出来：先回趴姿，再继续轮播
      play(BASE_ACT)
      after(gapMs(random), tick)
    },

    poke(next) {
      if (!running) return
      poking = true
      if (timer) clear(timer)
      timer = 0
      play(next)
      after(ACT_MS[next], tick)
    },

    current: () => act,

    destroy() {
      running = false
      if (timer) clear(timer)
      timer = 0
    },
  }
}
