# dsh-mascot-plugin

> 给你的 DeepSeek Harness（DSH）Web 界面放一只板娘：她待在右下角，你写代码她待机，工具跑起来她工作，弹审批时她会看你一眼。

这是一个 DSH **双半场插件**（host + client）。仓库现在处于 `0.1.0` 骨架阶段：整条加载链路已经打通、能构建、有测试，立绘还是内置的占位形象，Live2D 接入点已经留好。

---

## 现在能跑通什么

| 能力                                                                                  | 状态                              |
| ------------------------------------------------------------------------------------- | --------------------------------- |
| 作为 bundle 装进 web profile，Loader 里能看到 `ui-mascot` 这一行                      | ✅                                |
| 浏览器半场投放 `lib/client.js`，挂到 `shell.overlay` 槽                               | ✅                                |
| 右下角浮层 + 呼吸/眨眼动画 + 点击说话 + 姿态切换（idle/working/waiting/sleepy/happy） | ✅                                |
| 设置面板（称呼 / 缩放 / 气泡 / 模型地址），偏好存 localStorage                        | ✅                                |
| Live2D 模型加载、眼神跟随、运行时缺失时回落占位立绘                                   | ✅ 代码就绪，**待补运行时与模型** |
| 会话状态联动（工具开跑 → 工作姿态）                                                   | ⬜ 见路线图第 1 项                |
| 内置模型随包分发                                                                      | ⬜ 需要宿主把 `assets/` 暴露出来  |

## 技术选型：为什么是 JavaScript，不是 TypeScript / Rust

DSH 的插件不是原生扩展，宿主只加载 **JS 模块**，因此可选范围很窄：

| 候选                                     | 结论    | 理由                                                                                                                        |
| ---------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| **JavaScript + JSDoc + `tsc --checkJs`** | ✅ 采用 | 源码保持 `.js`，`lib/client.js` 可直接拼装投放，不需要额外产物；类型检查照跑（`pnpm typecheck`），编辑器补全不缺。          |
| TypeScript                               | 可切    | 类型更顺手，但要多一层 `lib/` 产物与 sourcemap 处理。骨架阶段收益不抵成本，随时可迁移（`.js` + JSDoc 就是半只脚在 TS 里）。 |
| 纯 JavaScript 无类型                     | ❌      | `inject` 声明、slot 契约、模型参数名这类东西**写错不报错、只是没反应**，没有类型检查会非常难查。                            |
| Rust / Go / C++                          | ❌      | 宿主没有原生 ABI。真要原生只能走 `subprocess` 拉起外部进程再代理，为一个浮层付这个代价不值。                                |
| 前端框架（Vue/Svelte）                   | ❌      | 槽位由宿主的 React 渲染，多引一套框架等于把运行时塞进插件包。                                                               |

构建选 **esbuild**：一次调用产出 CJS + 套上 `__ModuleLoader__` 外壳，秒级完成，不需要额外插件生态。

## 目录结构

```
dsh-mascot-plugin/
├── package.json                # 【必需】声明 dsh.bundle.patch 与 dsh.client
├── patches/
│   └── bundle.yaml             # 【必需】Bundle Patch，插入 ui-mascot 一行
├── lib/
│   ├── index.js                # 【必需】Host 端入口（手写纯 JS，入库）
│   └── client.js               # 【必需】浏览器端投放产物（构建生成，不入库）
├── src/                        # 客户端源码，构建后拼成 lib/client.js
│   ├── index.js                # 挂载入口 + 浮层装配 + Live2D 初始化
│   ├── look-at.js              # 眼神跟随（mousemove → Cubism 参数）
│   ├── model-loader.js         # 模型清单读取、加载、卸载
│   ├── settings.js             # 设置面板 UI
│   ├── state.js                # 姿态状态机（纯函数，可单测）
│   ├── config.js               # 偏好读写（localStorage 容错）
│   ├── styles.js               # 样式表（随 JS 注入）
│   └── types.js                # 共享 JSDoc 类型，不产生任何运行时代码
├── assets/
│   ├── models.json             # 构建时扫描生成的模型清单
│   └── mascot/                 # 内置模型 / 立绘
├── scripts/build.mjs           # 扫模型 + 打客户端产物
├── dev/preview.html            # 本地预览页（用桩跑 client.js，免重装）
├── test/                       # vitest 单测
├── .github/workflows/ci.yml    # typecheck / lint / test / build
├── CONTRIBUTING.md             # 开发规范
└── LICENSE
```

比你给的草图多了 `state.js` / `config.js` / `styles.js` / `types.js`：把状态机、偏好、样式、类型从 `index.js` 拆出去，`index.js` 才只负责"装配"，状态机也才能被单测覆盖。

## 快速开始

**环境**：Node `^22.19.0 || >=24.0.0`，pnpm 9+，DSH `0.1.x`（web profile）。

```bash
pnpm install
pnpm build                      # 生成 lib/client.js 与 assets/models.json

# 装进一个独立开发档案，别污染日常用的 profile
dsh plugin --profile plugin-dev add .
dsh --profile plugin-dev --dump-config | grep -i mascot   # 确认 ui-mascot 已插入
dsh --profile plugin-dev
```

开发循环（改 `src/` 自动重建，`dsh web` 会轮询到新产物并热更新）：

```bash
pnpm dev
```

| 命令             | 作用                                              |
| ---------------- | ------------------------------------------------- |
| `pnpm build`     | 扫模型清单 + 构建 `lib/client.js`                 |
| `pnpm dev`       | 监听模式                                          |
| `pnpm typecheck` | `tsc --checkJs` 检查 `.js`                        |
| `pnpm lint`      | oxlint                                            |
| `pnpm test`      | vitest                                            |
| `pnpm check`     | 提交前跑这一条（typecheck + lint + test + build） |

想看效果但不想反复重装插件：`pnpm build` 之后用浏览器直接打开 `dev/preview.html`，它用最小的桩把 `lib/client.js` 跑起来（刻意不接 Live2D 运行时，日志里出现"模型加载失败"属于预期）。

## 它怎么被加载

```
profile.bundles
  └─ patches/bundle.yaml      → 插入一行 entry：id=ui-mascot, name=dsh-mascot-plugin
       └─ lib/index.js        → 宿主加载 Node 入口（现在是空实现，但必须存在）
            └─ package.json 的 dsh.client
                 → Loader 把浏览器半场编进 window.__DSH_BOOT__
                      → 前端拉 /plugins/dsh-mascot-plugin/client.js?rev=<rev>
                           → window.__ModuleLoader__.load({ id, factory }) 懒执行
                                → apply(ctx) → ctx.slots.register('shell.overlay', …)
```

两个容易踩的点：

1. **`lib/index.js` 不能省。** 它不是业务代码，而是"让包成为 Loader entry"的凭证 —— 没有它，`dsh.client` 永远不会被发现，表现是"装成功了但界面上什么都没有"。
2. **`dsh.client.inject` 只写真实存在的行。** 多声明一个不存在的包，这一行会一直等依赖，同样"静默不出现"。

## 内置模型

浏览器不能列目录，所以"自动扫描 `.model3.json`"必须发生在构建期：`pnpm build` 会递归扫 `assets/`，把结果写进 `assets/models.json`，前端只读这份清单。

把模型目录塞进 `assets/mascot/<模型名>/`，保证里面有 `<模型名>.model3.json`，重新 `pnpm build` 即可被发现。

⚠️ **但模型文件本身还取不到**：Loader 只投放 `client.js`，不会自动把 `assets/` 变成静态资源。所以现在有两条路：

- 短期：在设置面板里填一个**可跨域访问**的 `.model3.json` 地址；
- 正解：在 `lib/index.js` 里把 `assets/` 通过宿主 webserver 暴露成 `/plugins/dsh-mascot-plugin/assets/*`（路线图第 2 项）。

另外，DSH Web 没有内置 PIXI 与 Cubism 运行时。要让 Live2D 真正跑起来，还需要把 `pixi.js` + `pixi-live2d-display` + Cubism Core 挂到 `window.PIXI` 上；`model-loader.js` 检测不到运行时会打印 `RUNTIME_MISSING` 并自动回落到占位立绘，不会白屏。

## 配置项

| 键            | 默认   | 说明                                       |
| ------------- | ------ | ------------------------------------------ |
| `displayName` | `板娘` | 称呼，出现在 tooltip 与无障碍标签里        |
| `scale`       | `1`    | 缩放，`0.6 ~ 1.6`                          |
| `showBubble`  | `true` | 是否显示对话气泡                           |
| `docked`      | `true` | 是否吸附右下角（自由拖拽待实现）           |
| `modelUrl`    | `''`   | `.model3.json` 地址；空串 = 用内置占位立绘 |

存于 `localStorage['dsh-mascot:config']`。**不写进会话日志**，也不上云。

## 权限与安全

- 不联网：除读取 `assets/models.json` 与用户手动填写的模型地址外，不发起任何请求。
- 不执行模型生成的代码：本插件只读 DOM 事件与配置，不接触工具调用、沙箱、凭据。
- 唯一的外部输入是 `modelUrl`，由用户自己填写；模型 JSON 里的相对路径会以该地址为基准解析。
- 分发模型前请确认授权，来源写进 `assets/mascot/CREDITS.md`。

## 兼容性

DSH 仍是 developer preview，接口会有破坏性变更。当前验证基线与锁定策略见 `CONTRIBUTING.md`「版本与兼容」。

## 路线图

1. 接会话事件流：工具开跑 → `working`，弹审批 → `waiting`，久无动静 → `sleepy`。
2. 宿主侧静态服务：让 `assets/` 随包分发，模型开箱即用。
3. 拖拽 + 边缘吸附 + 位置记忆（`docked` 开关落地）。
4. 设置面板迁进 DSH 设置页的 `settings.section` 槽，替代浮层小卡片。
5. 立绘分层（表情 / 动作叠加）与台词库 `assets/lines.json`。

## 贡献

见 [CONTRIBUTING.md](./CONTRIBUTING.md)。提 PR 前请先跑 `pnpm check`。

## 许可

[MIT](./LICENSE)。内置模型与立绘的授权单独说明，见 `assets/mascot/CREDITS.md`。
