// @ts-check
/** @typedef {import('./types.js').MascotConfig} MascotConfig */

export const STORAGE_KEY = 'dsh-mascot:config'

/** @type {MascotConfig} */
export const DEFAULT_CONFIG = {
  displayName: '黑豆',
  scale: 1,
  showBubble: true,
  docked: true,
  modelUrl: '',
}

/**
 * 读取用户偏好。
 *
 * localStorage 在隐私模式、沙箱 iframe 里可能直接抛错，所以整段都要兜住：
 * 拿不到就用默认值，不能让"读设置失败"把整个浮层拖垮。
 *
 * @returns {MascotConfig}
 */
export function loadConfig() {
  if (typeof window === 'undefined') return { ...DEFAULT_CONFIG }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_CONFIG }
    /** @type {Partial<MascotConfig>} */
    const stored = JSON.parse(raw)
    return { ...DEFAULT_CONFIG, ...stored }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

/**
 * 合并写入，返回合并后的完整配置。
 * @param {Partial<MascotConfig>} patch
 * @returns {MascotConfig}
 */
export function saveConfig(patch) {
  const next = { ...loadConfig(), ...patch }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // 写不进去不影响本次会话，静默降级。
  }

  return next
}
