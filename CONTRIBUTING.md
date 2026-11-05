# 开发规范

目标只有一个：**改动可预测**。板娘是长期驻留的浮层，任何泄漏都会在用户那儿攒成"越用越卡"。

## 1. 环境

- Node `^22.19.0 || >=24.0.0`（与 DSH 宿主一致，见 `package.json` 的 `engines`）
- pnpm 9+；提交 `pnpm-lock.yaml`，CI 用 `--frozen-lockfile` 校验
- 编辑器建议开启 `checkJs`（仓库已在 `tsconfig.json` 打开），保存即报类型错误

## 2. 分支与提交

- 主干 `main` 始终可构建、可安装。
- 分支：`feat/<简述>`、`fix/<简述>`、`chore/<简述>`、`docs/<简述>`。
- 提交信息用 Conventional Commits：`feat(client): 支持拖拽停靠`、`fix(loader): 模型加载失败时清理 canvas`。
- 一个提交只做一件事。改了 `src/` 时要**同一个提交**里带上重建后的 `lib/client.js`——它是入库的，漏了就等于源码安装的人拿到旧客户端；CI 会跑 `git diff --exit-code` 抓这种不一致。

## 3. 代码规范

- 源码是 `.js` + JSDoc，不用 `.ts`；每个文件首行 `// @ts-check`（`types.js` 例外）。
- 类型定义集中在 `src/types.js`，别在业务文件里散落 `@typedef`。
- 格式化交给 Prettier（`pnpm format`）， lint 交给 oxlint（`pnpm lint`），不要手工对齐格式。
- 命名：`模块-元素` 的 BEM 风格类名（`.dsh-mascot__gear`），变量用完整单词，别用 `m`、`el`、`tmp`。
- 注释写"为什么"，不写"是什么"。`// 设置 item 数量` 这类注释一律删掉。

### 双半场的硬边界

|        | Host（`lib/index.js`）      | Client（`src/`）                         |
| ------ | --------------------------- | ---------------------------------------- |
| 能碰   | Node API、`ctx`、文件与网络 | DOM、`window`、React                     |
| 不能碰 | `document` / `window`       | `fs` / `process` / 直接 `fetch` 本地文件 |
| 依赖   | 不 import `src/`            | 只能 import `react`（宿主提供）          |

- `src/` 里的模块**不许**出现 Node 内置模块，否则打进浏览器包会直接崩。
- `lib/client.js` 是产物，**不要手改**，也不要为了调试在 `src/` 里留 `console.log` 之外的调试代码。
- 所有 DOM 注入、定时器、事件监听都必须挂在 `ctx.effect()` 返回的清理函数里 —— 否则热更新会一层层叠加。

## 4. 状态与副作用

- 姿态只由 `resolveMood()` 决定，视觉状态只由 `render()` 写到 DOM。不要在事件回调里东改一个 `style`、西改一个 `class`。
- 新增姿态：先改 `MascotMood` 类型与 `MOOD_LABEL`，再补 `styles.js` 的 `[data-mood='…']` 规则，最后补单测。
- 网络请求必须可失败：超时、404、跨域失败都要有回落路径，不允许白屏。

## 5. 测试

- 纯逻辑（状态机、坐标换算、配置合并）必须有单测；DOM 与 Live2D 允许不做自动化测试。
- 断言优先测**边界**：正好达到阈值、空数组、0 尺寸 —— 这类地方才是真的会挂。
- 提 PR 前 `pnpm check` 全绿。

## 6. 素材规范

- 模型放 `assets/mascot/<模型名>/`，入口必须是 `<模型名>.model3.json`，构建时自动登记进 `assets/models.json`。
- 图片统一 WebP（透明）或 PNG，单帧 ≤ 300 KB，画布尺寸写进该模型目录的 `README.md`。
- 授权来源写入 `assets/mascot/CREDITS.md`（作者 / 协议 / 原始链接）。**来源不明的素材不要提交。**
- 大体积源文件（PSD / CSP / Blend）不进 Git，放 Release 附件。

## 7. 版本与兼容

- DSH 处于 developer preview，`dsh.client.inject` 依赖的包名与版本可能变。每次适配新宿主版本时：
  1. 在 README「兼容性」记录验证过的 DSH 版本与日期；
  2. 本文件同步记录变更点（哪个包改名、哪个 API 变了）。
- 破坏性变更走 minor 升级，并在 `CHANGELOG.md` 写清迁移方式。
- 发布：`pnpm check` → `pnpm version <patch|minor|major>` → `pnpm publish`（`prepack` 会自动重建产物）。

## 8. PR 检查清单

- [ ] `pnpm check` 通过
- [ ] 新增/变更的行为有对应测试，或说明了为什么不测
- [ ] 没有提交 `node_modules`、编辑器配置
- [ ] 改了 `src/` 时同步提交了 `pnpm build` 的产物（`lib/client.js`、`assets/models.json`）
- [ ] 新增的定时器 / 监听器 / DOM 节点都在清理函数里
- [ ] 文案没有硬编码在渲染逻辑里（该进 `state.js` 或 `assets/lines.json`）
- [ ] 素材授权已注明
