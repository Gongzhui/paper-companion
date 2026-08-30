# paper-companion

把 IEEE 短文做成「手机无痛伴读」：英文原文在主位，导游词（旁白 / 术语 / 自测题）默认折叠。

在线阅读：**https://paper.gongzhui.me**

阅读器源码以 MIT 授权。论文原文与插图的版权仍归 IEEE 及原作者，本仓库只作个人学习展示，不授予转载或商业使用那些材料的权利。

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000
```

## 构建（静态导出）

```bash
npm run build      # 产物在 out/
npm run preview    # 本地预览 out/
```

## 加一篇论文

在 `content/papers/` 放一份 `PXX.yaml`，插图放到 `public/figures/PXX/`，然后 `npm run build`。

YAML 里常见块：`para`（英文原文）、`figure`、`math`、`aside`（折叠旁白）、`terms`、`ticket`（出站票）。长文可给 chunk 加 `intensity: close | skim | skip`。

## 部署

Cloudflare Pages，静态目录 `out/`：

```bash
npm run build
npx wrangler pages deploy out --project-name=paper-companion --branch=main
```

## 结构

```
content/papers/PXX.yaml   # 伴读稿
public/figures/PXX/       # 插图
app/                      # 书架 + 阅读页
lib/companions.ts         # 加载 YAML
```
