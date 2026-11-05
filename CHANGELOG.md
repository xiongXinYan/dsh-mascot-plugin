# Changelog

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 新增

- 内置 SVG 立绘：分层绘制（发/脸/眼/嘴/身体），呼吸、眨眼、呆毛摆动，替代原来的色块占位
- 姿态表现落到立绘：`waiting` 光环脉冲 + 暖色描边，`sleepy` 闭眼与 `zZz`，`happy` 张嘴与跳跃
- 眼神跟随支持 SVG 路径：`--gaze-x/--gaze-y` → 头部微转 + 瞳孔偏移
- 姿态入口 `dsh-mascot:signal` 自定义事件，推送 `SessionSignal` 即换姿态
- `scripts/dev.mjs` + 假 DSH 界面的预览页，`pnpm dev` 一条命令看效果
- 模型清单地址改为按插件部署位置解析（原先是相对页面，装到 `/plugins/<id>/` 下会指错）

### 计划中

- 会话状态联动：工具开跑 → `working`，弹审批 → `waiting`
- 宿主侧静态服务，让 `assets/` 随包可用
- 拖拽与边缘吸附

## [0.1.0] - 2026-11-05

### 新增

- 双半场插件骨架：`dsh.bundle.patch` + `dsh.client`，挂到 `shell.overlay` 槽
- 客户端浮层：呼吸 / 眨眼动画、点击说话、五种姿态
- 姿态状态机与眼神跟随坐标换算，附单测
- 设置面板（称呼 / 缩放 / 气泡 / 模型地址），偏好存 localStorage
- Live2D 模型加载入口，运行时缺失时回落到内置占位立绘
- 构建脚本：扫描 `assets/` 生成模型清单，产出带 `__ModuleLoader__` 外壳的 `lib/client.js`
- CI：format / typecheck / lint / test / build
