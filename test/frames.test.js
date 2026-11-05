// @ts-check
import { describe, expect, it } from 'vitest'

import { ACT_BEATS, IDLE_BEATS, createFramePlayer } from '../src/frames-player.js'

/**
 * 按到期时间顺序推进的假时钟，不依赖真实定时器。
 * @returns {{schedule: (fn: () => void, ms: number) => number, cancel: (id: number) => void, tick: (ms: number) => void}}
 */
function fakeClock() {
  let now = 0
  let seq = 0
  /** @type {Map<number, {at: number, fn: () => void}>} */
  const tasks = new Map()

  return {
    schedule(fn, ms) {
      const id = ++seq
      tasks.set(id, { at: now + ms, fn })
      return id
    },
    cancel(id) {
      tasks.delete(id)
    },
    tick(ms) {
      const end = now + ms
      for (;;) {
        /** @type {{id: number, at: number, fn: () => void} | null} */
        let next = null
        for (const [id, task] of tasks) {
          if (task.at > end) continue
          if (!next || task.at < next.at) next = { id, at: task.at, fn: task.fn }
        }
        if (!next) break
        tasks.delete(next.id)
        now = next.at
        next.fn()
      }
      now = end
    },
  }
}

/**
 * @param {boolean} [reducedMotion]
 */
function setup(reducedMotion = false) {
  const clock = fakeClock()
  /** @type {string[]} */
  const seen = []
  const player = createFramePlayer({
    onFrame: (name) => seen.push(name),
    schedule: clock.schedule,
    cancel: clock.cancel,
    reducedMotion,
  })
  return { clock, seen, player }
}

describe('createFramePlayer', () => {
  it('启动后先显示 rest', () => {
    const { player, seen } = setup()
    player.start()
    expect(seen).toEqual(['rest'])
    expect(player.current()).toBe('rest')
    player.destroy()
  })

  it('待机循环会眨眼、再睁开', () => {
    const { clock, seen, player } = setup()
    const [first, second] = IDLE_BEATS
    player.start()
    clock.tick(first?.[1] ?? 0)
    expect(seen.at(-1)).toBe('blink')
    clock.tick(second?.[1] ?? 0)
    expect(seen.at(-1)).toBe('rest')
    player.destroy()
  })

  it('一轮待机里既有眨眼也有头耳微动', () => {
    const { clock, seen, player } = setup()
    player.start()
    clock.tick(IDLE_BEATS.reduce((sum, beat) => sum + beat[1], 0))
    expect(seen).toContain('blink')
    expect(seen).toContain('idleAlt')
    expect(seen.length).toBeGreaterThan(IDLE_BEATS.length - 1)
    player.destroy()
  })

  it('大动作接管后播对应帧序列', () => {
    const { clock, seen, player } = setup()
    player.start()
    player.playAct('jump')
    expect(seen.at(-1)).toBe('rest')
    clock.tick(120)
    expect(seen.at(-1)).toBe('jump')
    clock.tick(400)
    expect(seen.at(-1)).toBe('jump')
    player.destroy()
  })

  it('每个大动作都有帧序列，sit 交还待机', () => {
    /** @type {import('../src/types.js').MascotAct[]} */
    const acts = ['stretch', 'bow', 'wink', 'jump', 'nap', 'alert']
    for (const act of acts) {
      expect(ACT_BEATS[act]?.length).toBeGreaterThan(0)
    }
    expect(ACT_BEATS.sit).toBeNull()

    const { seen, player } = setup()
    player.start()
    player.playAct('bow')
    expect(seen.at(-1)).toBe('bow')
    player.playAct('sit')
    expect(seen.at(-1)).toBe('rest')
    player.destroy()
  })

  it('未知帧名不影响 other 序列，destroy 后不再切帧', () => {
    const { clock, seen, player } = setup()
    player.start()
    player.destroy()
    const before = seen.length
    clock.tick(20_000)
    expect(seen).toHaveLength(before)
  })

  it('reducedMotion 下不排定时器，但仍响应动作姿态', () => {
    const { clock, seen, player } = setup(true)
    player.start()
    expect(seen).toEqual(['rest'])
    clock.tick(20_000)
    expect(seen).toEqual(['rest'])
    player.playAct('nap')
    expect(seen.at(-1)).toBe('nap')
    player.destroy()
  })
})
