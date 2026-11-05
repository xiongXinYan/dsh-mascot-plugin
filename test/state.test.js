import { describe, expect, it } from 'vitest'

import { GREETINGS, IDLE_SLEEP_MS, pickGreeting, resolveMood } from '../src/state.js'

describe('resolveMood', () => {
  it('默认是待机', () => {
    expect(resolveMood({}, 0)).toBe('idle')
  })

  it('有工具在跑就是工作态', () => {
    expect(resolveMood({ running: true }, 0)).toBe('working')
  })

  it('审批优先级高于工作态', () => {
    expect(resolveMood({ running: true, awaitingApproval: true }, 0)).toBe('waiting')
  })

  it('超过阈值没动静就打盹', () => {
    expect(resolveMood({ lastActivityAt: 0 }, IDLE_SLEEP_MS - 1)).toBe('idle')
    expect(resolveMood({ lastActivityAt: 0 }, IDLE_SLEEP_MS)).toBe('sleepy')
  })

  it('工作态不会被"太久没动"覆盖', () => {
    expect(resolveMood({ running: true, lastActivityAt: 0 }, IDLE_SLEEP_MS * 10)).toBe('working')
  })
})

describe('pickGreeting', () => {
  it('随机数为 0 时取第一句', () => {
    expect(pickGreeting(() => 0)).toBe(GREETINGS[0])
  })

  it('随机数接近 1 时不会越界', () => {
    expect(pickGreeting(() => 0.999999)).toBe(GREETINGS[GREETINGS.length - 1])
    expect(pickGreeting(() => 1)).toBe(GREETINGS[GREETINGS.length - 1])
  })
})
