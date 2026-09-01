# Caju 门户

Cute-Satsuma / 可爱桔（Caju）的产品门户与管理后台。静态站，部署到 GitHub Pages。

## 本地运行

```bash
npm install
npm run dev
```

- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin

## 部署

把本仓库推到 `Cute-Satsuma/Cute-Satsuma.github.io`，在仓库 Settings → Pages 里把 Source 设为 **GitHub Actions**。之后推 `main` 会自动发布到 https://cute-satsuma.github.io/

已有的产品落地页与网页版（`/decibel_meter/`、`/game_sudoku/app/`、`/qr_scanner/`）不要改路径。应用隐私政策在 `/privacy/{slug}/`。

## Admin

1. 创建一个 Fine-grained PAT，只授权本仓库：Contents 读写，Releases 只读。
2. 打开 `/admin/`，填 owner / repo / token。Token 只放在当前标签页的 sessionStorage。
3. 保存产品 JSON 后，Actions 重建站点大约一分钟。
4. APK / DMG / EXE 请先在 GitHub Releases 网页上传，再到后台把下载地址填进对应平台。
