// @ts-check
/**
 * 小动作轮播的测试。
 *
 * 这一层最容易出的是"节奏错"而不是"报错"：动作不回到坐姿、情绪切了还在放旧动作、
 * poke 之后停在半空。这类问题看截图看不出来，只能把定时器换成假时钟来断言顺序。
 */
import { describe, expect, it } from 'vitest'

import { ACT_MS, ACT_POOL, BASE_ACT, createActPlayer, gapMs, heldActOf } from '../src/acts.js'

/** 极简假时钟：只实现 schedule / cancel / advance，够这套逻辑用。 */
function makeClock() {
  let now = 0
  let seq = 1
  /** @type {Map<number, { fn: () => void, at: number }>} */
  const timers = new Map()

  return {
    schedule(/** @type {() => void} */ fn, /** @type {number} */ ms) {
      const id = seq
      seq += 1
      timers.set(id, { fn, at: now + ms })
      return id
    },
    cancel(/** @type {number} */ id) {
      timers.delete(id)
    },
    advance(/** @type {number} */ ms) {
      const target = now + ms
      for (;;) {
        const due = [...timers.entries()]
          .filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at)[0]
        if (!due) break
        const [id, timer] = due
        timers.delete(id)
        now = timer.at
        timer.fn()
      }
      now = target
    },
    pending: () => timers.size,
  }
}

/** 造一个记录所有姿态变换的播放器。 */
function setup(random = () => 0.5) {
  const clock = makeClock()
  /** @type {string[]} */
  const acts = []
  const player = createActPlayer({
    onAct: (act) => acts.push(act),
    random,
    schedule: clock.schedule,
    cancel: clock.cancel,
  })
  return { clock, acts, player }
}

describe('gapMs', () => {
  it('落在 620~1500 之间，且随 random 变化', () => {
    expect(gapMs(() => 0)).toBe(620)
    expect(gapMs(() => 0.999)).toBeLessThanOrEqual(1500)
    expect(gapMs(() => 0.999)).toBeGreaterThan(gapMs(() => 0))
  })
})

describe('heldActOf', () => {
  it('等待确认和打盹是钉住的姿态，其余不是', () => {
    expect(heldActOf('waiting')).toBe('alert')
    expect(heldActOf('sleepy')).toBe('nap')
    expect(heldActOf('idle')).toBe(null)
    expect(heldActOf('working')).toBe(null)
    expect(heldActOf('happy')).toBe(null)
  })
})

describe('createActPlayer', () => {
  it('start 先坐下，再开始做动作', () => {
    const { clock, acts, player } = setup()
    player.start()
    expect(acts).toEqual([BASE_ACT])

    clock.advance(gapMs(() => 0.5))
    expect(acts).toHaveLength(2)
    expect(acts[1]).not.toBe(BASE_ACT)
  })

  it('每个动作做完都会回到坐姿', () => {
    const { clock, acts, player } = setup()
    player.start()

    // 走 20 秒，足够跨过好几个动作
    for (let i = 0; i < 40; i += 1) clock.advance(500)

    // 除第一个 sit 外，"非 sit" 后面必然跟一个 sit
    for (let i = 1; i < acts.length - 1; i += 1) {
      if (acts[i] !== BASE_ACT) expect(acts[i + 1]).toBe(BASE_ACT)
    }
  })

  it('只做当前情绪允许的动作', () => {
    const { clock, acts, player } = setup()
    player.setMood('working')
    player.start()
    for (let i = 0; i < 40; i += 1) clock.advance(500)

    const allowed = new Set([BASE_ACT, ...ACT_POOL.working])
    for (const act of acts) expect(allowed.has(/** @type {any} */ (act))).toBe(true)
  })

  it('切到打盹会立刻趴下，并且不再排新动作', () => {
    const { clock, acts, player } = setup()
    player.start()
    clock.advance(200)

    player.setMood('sleepy')
    expect(acts[acts.length - 1]).toBe('nap')
    expect(clock.pending()).toBe(0)
  })

  it('打盹中切回待机会先回坐姿，再继续轮播', () => {
    const { clock, acts, player } = setup()
    player.start()
    player.setMood('sleepy')
    clock.advance(5000)

    player.setMood('idle')
    expect(acts[acts.length - 1]).toBe(BASE_ACT)
    expect(clock.pending()).toBe(1)
  })

  it('poke 会插一个动作，做完回到坐姿而不是停在那里', () => {
    const { clock, acts, player } = setup()
    player.start()

    player.poke('jump')
    expect(acts[acts.length - 1]).toBe('jump')

    clock.advance(ACT_MS.jump)
    expect(acts[acts.length - 1]).toBe(BASE_ACT)
  })

  it('start 时如果已经在等确认，直接进入 alert', () => {
    const { acts, player } = setup()
    player.setMood('waiting')
    player.start()
    expect(acts).toEqual(['alert'])
  })

  it('destroy 会清掉定时器，之后不再有回调', () => {
    const { clock, acts, player } = setup()
    player.start()
    player.destroy()

    const count = acts.length
    clock.advance(20_000)
    expect(acts).toHaveLength(count)
  })

  it('情绪没变时 setMood 不会打断当前动作', () => {
    const { clock, acts, player } = setup()
    player.setMood('working')
    player.start()
    clock.advance(gapMs(() => 0.5))

    const before = [...acts]
    player.setMood('working')
    expect(acts).toEqual(before)
  })
})
