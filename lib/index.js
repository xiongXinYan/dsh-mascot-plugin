/**
 * dsh-mascot-plugin · Host 端入口
 *
 * 这里是手写的纯 JavaScript，不参与构建（lib/client.js 才是产物）。
 *
 * 它现在几乎什么都不做，但必须有：
 *   1. 包需要自己的 Node 入口才能在 Loader 里占一行；
 *   2. 只有成为 Loader entry，宿主才会读到 package.json 的 dsh.client 声明，
 *      把浏览器半场编进 window.__DSH_BOOT__ 并在 /plugins/<包名>/client.js 上投放。
 *
 * 宿主侧后续要接的东西（都挂在这里，不要在别处生成全局状态）：
 *   - 静态资源：把 assets/ 下的模型与立绘通过 webserver 暴露给前端，
 *     否则前端只能加载外部 URL 的模型（见 README「内置模型」一节）；
 *   - 偏好持久化：替代 localStorage，让设置在设备间同步；
 *   - 陪伴能力：余额 / 天气等需要网络或凭据的逻辑，必须留在宿主侧。
 */

export const name = 'dsh-mascot-plugin'

/**
 * @typedef {object} MascotHostConfig
 * @property {boolean} [enabled] 关掉后浏览器半场仍会加载，但不再渲染浮层（留作后路）。
 */

/**
 * @param {any} _ctx 宿主注入的 Cordis Context。等 DSH 版本锁定后换成
 *   `@deepseek-ai/cordis` 的 Context 类型（TypeScript 项目可直接 import type）。
 * @param {MascotHostConfig} [_config]
 * @returns {void}
 */
export function apply(_ctx, _config = {}) {
  // 有意为空：当前形态是纯前端浮层，宿主侧没有要注册的东西。
}
