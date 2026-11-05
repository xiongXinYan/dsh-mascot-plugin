import { describe, expect, it } from 'vitest'

import { luminance, parseColor } from '../src/theme.js'

describe('parseColor', () => {
  it('解析十进制 rgb / rgba', () => {
    expect(parseColor('rgb(255, 255, 255)')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(parseColor('rgba(32, 35, 42, 0.96)')).toEqual({ r: 32, g: 35, b: 42, a: 0.96 })
  })

  it('解析现代写法（空格 + 斜杠透明度）', () => {
    expect(parseColor('rgb(32 35 42 / 50%)')).toEqual({ r: 32, g: 35, b: 42, a: 0.5 })
  })

  it('解析十六进制，含三位简写', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(parseColor('#1b1e24')).toEqual({ r: 27, g: 30, b: 36, a: 1 })
    expect(parseColor('#1b1e2480')).toEqual({ r: 27, g: 30, b: 36, a: 128 / 255 })
  })

  it('认不出来的返回 null，而不是猜一个值', () => {
    expect(parseColor('transparent')).toBeNull()
    expect(parseColor('var(--bg)')).toBeNull()
    expect(parseColor('')).toBeNull()
  })
})

describe('luminance', () => {
  it('黑白两端', () => {
    expect(luminance({ r: 0, g: 0, b: 0 })).toBe(0)
    expect(luminance({ r: 255, g: 255, b: 255 })).toBe(1)
  })

  it('深色界面落在 0.45 阈值以下，浅色在上面', () => {
    // DSH 深色主题的正文底色与预览页的浅色底色
    expect(luminance(/** @type {any} */ (parseColor('#1b1e24')))).toBeLessThan(0.45)
    expect(luminance(/** @type {any} */ (parseColor('#ffffff')))).toBeGreaterThan(0.45)
  })
})
