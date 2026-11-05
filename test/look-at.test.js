import { describe, expect, it } from 'vitest'

import { toGaze } from '../src/look-at.js'

const rect = { left: 0, top: 0, width: 200, height: 100 }

describe('toGaze', () => {
  it('中心点归零', () => {
    expect(toGaze(100, 50, rect)).toEqual({ x: 0, y: 0 })
  })

  it('右侧为正、上侧为正（屏幕坐标 y 向下）', () => {
    expect(toGaze(200, 0, rect)).toEqual({ x: 1, y: 1 })
  })

  it('超出范围时截断在 ±1', () => {
    expect(toGaze(9999, -9999, rect)).toEqual({ x: 1, y: 1 })
    expect(toGaze(-9999, 9999, rect)).toEqual({ x: -1, y: -1 })
  })

  it('尺寸为 0 也不会除出 Infinity / NaN', () => {
    const gaze = toGaze(0, 0, { left: 0, top: 0, width: 0, height: 0 })
    expect(Number.isFinite(gaze.x)).toBe(true)
    expect(Number.isFinite(gaze.y)).toBe(true)
  })
})
