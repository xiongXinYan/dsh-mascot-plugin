# 发布与提交到 dsh-plugin.org

这个文件只做一件事：把 [dsh-plugin.org/zh/submit](https://dsh-plugin.org/zh/submit) 的收录要求逐条落到本仓库，并给出可以直接执行（或复制）的命令。

## 一、收录要求对照

| 要求                                   | 状态 | 说明                                                               |
| -------------------------------------- | ---- | ------------------------------------------------------------------ |
| 仓库公开                               | 待办 | 仓库还没 push 到 GitHub，见第 2 步                                 |
| 添加 GitHub topic `dsh-plugin`         | 待办 | 网页操作或 `gh repo edit`，见第 2 步                               |
| README 含安装命令                      | ✅   | `dsh plugin --profile web add dsh-mascot-plugin` 与 `github:` 两种 |
| 导出 `apply(ctx)`                      | ✅   | `lib/index.js` 的 `export function apply(ctx)`                     |
| 根目录 `package.json`（包名 + 版本）   | ✅   | `dsh-mascot-plugin@0.2.0`                                          |
| 许可证                                 | ✅   | MIT，见 `LICENSE`                                                  |
| 截图 / 演示                            | ✅   | `docs/screenshots/`，README 已引用                                 |
| 权限与兼容说明                         | ✅   | README「权限与风险」「兼容性」两节                                 |
| 发布 NPM 包（想进 DSH 插件中心才需要） | 待办 | 见第 3 步                                                          |

没有 NPM 包也能被收录：会以源码安装命令展示，只是不会出现在 DSH 内的「插件中心」。

## 二、把仓库推上去并打 topic

```bash
# 首次推送，建立上游追踪
git push -u origin main

# 有 gh CLI 的话，一条命令补 topic（没有就在仓库首页 About 右侧齿轮里手动加）
gh repo edit xiongXinYan/dsh-mascot-plugin --add-topic dsh-plugin
```

手动加 topic：仓库首页 → 右侧 **About** → 齿轮 → Topics 填 `dsh-plugin` → 保存。

顺手把仓库描述改成一句话价值，爬虫会读：

> 给 DeepSeek Harness Web 界面装一位会呼吸、会看你、随会话状态换姿态的板娘。

## 三、发布 NPM 包（可选，但想进插件中心必须做）

```bash
npm login                      # 包名 dsh-mascot-plugin 在 npm 上未被占用
pnpm check                     # 确认全绿
npm publish --access public    # prepack 会重建 lib/client.js
```

发布后验证：

```bash
npm view dsh-mascot-plugin version dist.tarball
npm pack --dry-run             # 确认 lib/client.js、patches/、assets/ 都在包里
```

## 四、提交 Issue

标题：

```
[插件提交] xiongXinYan/dsh-mascot-plugin — 给 DSH Web 界面装一位会看你、随状态换姿态的板娘
```

正文（可直接复制）：

```markdown
### 仓库地址

https://github.com/xiongXinYan/dsh-mascot-plugin

### 一句话价值

装完 DSH 的 Web 界面右下角会多一位板娘：呼吸、眨眼、眼神跟着鼠标走，工具跑起来她进入工作姿态，等你审批时亮起琥珀色光环，久无操作会打盹。

### 能力分类

界面与体验

### 安装命令

# npm（发布后）

dsh plugin --profile web add dsh-mascot-plugin

# 源码安装

dsh plugin --profile web add github:xiongXinYan/dsh-mascot-plugin

### 兼容与运行要求

DSH 0.1.x，web profile（DSH 仍为 developer preview，槽位契约可能变化）。
纯浏览器侧运行，无原生依赖；Node ^22.19.0 || >=24.0.0 仅在安装与构建时需要。
不依赖 Live2D 运行时：内置立绘开箱可用，检测到 PIXI/Cubism 时可切换 Live2D 模型。

### 许可证

MIT

### 截图 / 演示

见仓库 docs/screenshots/：深色 / 浅色主题、等待审批态、设置面板。
本地可复现：pnpm install && pnpm dev → http://127.0.0.1:5173/

### 补充说明

权限：不联网（除插件自带 assets/models.json 与用户手填的 modelUrl）；不读凭据；只在自建浮层节点内操作 DOM；偏好存 localStorage。
已知限制：内置模型尚未随包提供静态服务（宿主侧路线图第 2 项），当前默认使用内置立绘；暂不支持拖拽；会话事件流订阅待接。

### 提交前自查

- [x] 仓库已公开
- [x] 已添加 GitHub topic：dsh-plugin
- [x] README 包含安装命令
- [x] 插件导出 apply(ctx) 模块
- [x] 仓库根目录包含 package.json
```

提交入口：https://github.com/dshplugin/dsh-plugin-hub/issues/new

## 五、收录后的徽章

把 `your-owner` / `your-plugin-slug` 换成详情页地址里对应的部分，贴到 README 顶部：

```markdown
[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/xiongxinyan/dsh-mascot-plugin)
```

## 六、提交前本地自检

```bash
pnpm check                                  # typecheck + lint + test + build
grep -q '__ModuleLoader__.load' lib/client.js   # 客户端外壳
grep -n 'export function apply' lib/index.js     # 宿主入口
node -e "const p=require('./package.json');console.log(p.name,p.version,p.exports['./client'])"
npm pack --dry-run                          # 看最终包里有什么
git status --short                          # lib/client.js 不能被忽略
```

第 6 条最容易被忽略：`lib/client.js` 一旦被 `.gitignore` 挡在门外，用 `github:` 源码安装的人拿到的包**没有客户端产物**，现象是"装成功了但界面什么都没有"。
