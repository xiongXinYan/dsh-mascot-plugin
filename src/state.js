// @ts-check
/** @typedef {import('./types.js').MascotMood} MascotMood */
/** @typedef {import('./types.js').SessionSignal} SessionSignal */

/** 超过这个时长没有动静，就认为用户在发呆，切到打盹姿态。 */
export const IDLE_SLEEP_MS = 5 * 60 * 1000

/** @type {Record<MascotMood, string>} */
export const MOOD_LABEL = {
  idle: '待机',
  working: '陪你干活',
  waiting: '等你确认',
  sleepy: '打盹',
  happy: '开心',
}

/**
 * 点她一下会随机说的话。
 * 台词量上来以后要挪到 assets/lines.json，别继续硬编码在这里。
 * @type {readonly string[]}
 */
export const GREETINGS = [
  '在的，继续吧。',
  '这段代码我看懂了……大概。',
  '要不要先跑个测试？',
  '别熬太晚。',
  '摸摸。',
]

/**
 * 把会话信号归一到一个姿态。
 *
 * 优先级是有意这么排的：审批弹窗最需要人注意，其次才是"正在干活"，
 * "打盹"只在前两者都不成立时才可能出现。
 *
 * @param {SessionSignal} signal
 * @param {number} [now]
 * @returns {MascotMood}
 */
export function resolveMood(signal, now = Date.now()) {
  if (signal.awaitingApproval) return 'waiting'
  if (signal.running) return 'working'

  const lastActivityAt = signal.lastActivityAt
  if (typeof lastActivityAt === 'number' && now - lastActivityAt >= IDLE_SLEEP_MS) return 'sleepy'

  return 'idle'
}

/**
 * 随机挑一句台词。传入 random 便于测试固定结果。
 * @param {() => number} [random]
 * @returns {string}
 */
export function pickGreeting(random = Math.random) {
  const index = Math.min(Math.floor(random() * GREETINGS.length), GREETINGS.length - 1)
  return GREETINGS[index] ?? GREETINGS[0] ?? ''
}
