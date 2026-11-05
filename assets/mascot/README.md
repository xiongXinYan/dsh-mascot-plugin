# 内置素材

## 目录约定

```
assets/mascot/
└── <模型名>/
    ├── <模型名>.model3.json   # 入口，构建时被扫进 assets/models.json
    ├── *.moc3 / *.png / *.physics3.json / *.motion3.json …
    └── README.md              # 画布尺寸、原作者、协议
```

`pnpm build` 会递归扫描 `assets/` 下所有 `*.model3.json`，生成 `assets/models.json`：

```json
{
  "models": [{ "id": "shizuku", "label": "shizuku", "url": "assets/shizuku/shizuku.model3.json" }]
}
```

## 授权

任何随包分发的模型都必须在 `assets/mascot/CREDITS.md` 登记：

| 模型            | 作者        | 协议             | 原始链接                |
| --------------- | ----------- | ---------------- | ----------------------- |
| （示例）shizuku | Live2D Inc. | 官方示例素材条款 | https://www.live2d.com/ |

没有登记的素材不要提交。二次创作、商用授权范围以原作者的条款为准，本仓库的 MIT 协议不覆盖这些美术资源。

## 占位立绘

在没有模型时，`src/styles.js` 里的 `.dsh-mascot__body` 会渲染一个纯 CSS 的小家伙（会呼吸、会眨眼、点击有反应）。它是**兜底**而不是主形象：一旦 `modelUrl` 可加载，就会被 Live2D 画布替换。
