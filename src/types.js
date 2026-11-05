/**
 * 共享类型（JSDoc）。
 *
 * 运行时不产生任何代码，也不会被打进产物——它只服务编辑器补全和 `tsc --noEmit`。
 * 这是"纯 JavaScript + 类型检查"的常规做法：源码保持 .js，类型写在注释里。
 */

/**
 * 板娘的情绪姿态。渲染层只认这几个值，其它信号先归一到它们。
 * @typedef {'idle'|'working'|'waiting'|'sleepy'|'happy'} MascotMood
 */

/**
 * 立绘能做的小动作。每个值在 styles.js 里对应一组姿态变量，
 * 由 acts.js 按节奏轮播 —— 这是"看起来像动图"的来源。
 * @typedef {'sit'|'stretch'|'bow'|'wink'|'jump'|'nap'|'alert'} MascotAct
 */

/**
 * 会话侧推给板娘的粗粒度信号。等接上 DSH 会话事件流后由宿主/客户端服务填充。
 * @typedef {object} SessionSignal
 * @property {boolean} [running] 有工具在跑 / agent 正在执行
 * @property {boolean} [awaitingApproval] 弹了审批，等人点确认
 * @property {number} [lastActivityAt] 最后一次活动的时间戳
 */

/**
 * 用户偏好。落在 localStorage，不进会话日志。
 * @typedef {object} MascotConfig
 * @property {string} displayName 称呼
 * @property {number} scale 缩放倍数，1 = 100%
 * @property {boolean} showBubble 是否显示对话气泡
 * @property {boolean} docked 是否吸附在右下角
 * @property {string} modelUrl Live2D 的 .model3.json 地址；空串表示用内置占位立绘
 */

/**
 * @typedef {object} ClientSlotRegistration
 * @property {string} name slot 名，例如 shell.overlay
 * @property {string} id 本插件在该 slot 内的唯一 id
 * @property {number} [order] 同 slot 内排序，越小越靠前
 */

/**
 * @typedef {object} ClientSlots
 * @property {(slot: string, factory: () => unknown) => unknown} inject
 * @property {(registration: ClientSlotRegistration, component: Function) => unknown} register
 */

/**
 * 浏览器半场的 Cordis 上下文子集。
 *
 * 只声明本插件真正用到的口子，避免把整份 @deepseek-ai/dsh-client-* 的类型版本绑死。
 * DSH 版本锁定后可以换成官方类型包。
 *
 * @typedef {object} ClientContext
 * @property {(execute: () => void | (() => void), label?: string) => void} effect 注册可逆副作用
 * @property {ClientSlots} slots
 */

export {}
