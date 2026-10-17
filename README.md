# 一园两境 · Gardens Across Cultures

《跨文化交际与国际智慧》课程双语园林数字展览。网站以苏州网师园与英国 Stourhead 为具体案例。

## 本地开发

需要 Node.js 24+ 和 npm。

```powershell
npm ci
npm run dev
```

打开 http://localhost:3000。

## 静态构建

```powershell
npm run check
npm run build
```

Next.js 静态导出将生成 `out/`。本项目使用本地图片、字体与脚本，不需要后端运行时。

## Cloudflare Pages

- Root directory: `.`
- Build command: `npm run build`
- Build output directory: `out`
- Node.js: `24`

摄影作者、来源和许可在页面展签与资料索引中标示；字体授权文件随本地字体保留。
