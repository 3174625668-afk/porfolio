# Research & Curation：本地水印处理（第一阶段）

本阶段只生成明确标记为模拟内容的 A4 测试页，不处理或发布真实论文。
所有版权文字都合成到图像像素中，不依赖 CSS。默认中央 `LINJUN YE`
为 5.5% 黑色透明度、宽约页面的 62%；底部为 `© LINJUN YE · 2026`，
8pt、48% 黑色透明度，距纸张底边 6mm。正式处理前仍需确认视觉效果。

## 环境

Python 3.10+。使用 PyMuPDF 渲染 PDF、Pillow 合成与编码；ReportLab 仅用于模拟页。
当前环境已安装并运行通过，不需要外部转换服务。

```bash
python3 -m pip install -r scripts/research-watermark/requirements.txt
```

默认寻找 DejaVu Sans / Liberation Sans / Arial。如本机没有这些字体，用
`--font /绝对路径/字体.ttf` 指定支持 `©` 和 `·` 的 Unicode TTF 字体。

## 正式文件怎样提供

等小也确认水印后，再把 PDF 作为聊天附件提供，或提供本地文件路径；
**不要上传原始 PDF 到 GitHub。** 本地建议放在仓库之外：

```text
~/linjun-research-private/
  input/                 原始 PDF
  review/                私下审核图与中间文件
  processed/<项目名>/    已加水印、审核前的 WebP
```

不要将这个目录放在网站根目录或 `public/` 内。`.gitignore` 排除了大小写形式的
PDF、仓库内 `.private/`、`local-research/`、`research-local/`、`watermark-work/`
及明确命名的未加水印图；这些规则只是防止误提交，**不是访问控制**。
本工具还会拒绝处理位于 Git 仓库内部的原始 PDF。真实文件应始终放在仓库外。

## 重现模拟测试

```bash
python3 scripts/research-watermark/make_demo.py --output /tmp/linjun-watermark-review-new
```

目标目录必须是仓库外的新目录或空目录。输出包含：

- `synthetic-a4.pdf`：明确标记的模拟输入，只保存在本地。
- `before.png`、`after.png`：同一 A4 页面、同一分辨率的前后对比。
- `watermarked-webp/01.webp`：像素内嵌水印的无损 WebP。
- `pages.json`：此模拟页的像素尺寸，仅供本地审核，不能接入正式研究项目。

这些文件不提交 Git，也不嵌入公开网站。不要把模拟数据当成正式论文。

## 确认后批量处理真实 PDF

```bash
python3 scripts/research-watermark/pdf_to_webp.py \
  "$HOME/linjun-research-private/input/essay.pdf" \
  --output "$HOME/linjun-research-private/processed/essay-v1" \
  --manifest "$HOME/linjun-research-private/review/essay-pages.json" \
  --dpi 240 --opacity 0.055 --width 0.62 --x 0.5 --y 0.5 \
  --footer-size 8 --footer-opacity 0.48 --footer-margin-mm 6 --year 2026
```

输出目录必须为空，已有文件不会被覆盖；manifest 也必须是仓库外的新文件。
程序按 PDF 原有页序输出 `01.webp`、`02.webp`……，保留页面可见范围、旋转方向
和长宽比例，不重排正文，不写出无水印中间图。每次只在内存中处理一页。
240 DPI 的 A4 约为 1985 × 2807 像素；可用 `--dpi 300` 提高细字分辨率。
默认无损 WebP；需要较小文件时可显式使用 `--lossy --quality 96`，并重新审核细字。

常用调整：

| 参数 | 意义 |
| --- | --- |
| `--opacity 0.04` | 中央水印更淡；不能设为 0 |
| `--width 0.55` | 水印宽度为纸张宽度的 55% |
| `--x 0.5 --y 0.48` | 水印中心位置，按页面宽高的比例表示 |
| `--footer-size 8` | 底部署名字号，单位 pt |
| `--footer-margin-mm 6` | 署名底边距纸张底边的毫米数 |
| `--footer-opacity 0.48` | 底部版权字的深浅 |
| `--font /path/to/font.ttf` | 自定义 Unicode TTF 字体 |

工具拒绝裁掉中央水印的参数。若原论文页脚、插图或正文恰好位于水印区域，
在本地调整水印位置与页脚距离后重新输出到一个新目录；原始 PDF 始终不变。
加密 PDF 需要先在本地提供可读取的副本。80MP 以上的单页须降低 DPI。

## 审核后接入网站（本阶段不执行）

1. 检查所有页面，包括正文、脚注、原页码及插图。
2. 只复制审核通过的 `*.webp` 到 `public/images/<项目 id>/pages/`。
   原始 PDF、`before.png`、模拟文件、manifest 和其他中间文件均不复制。
3. 将实际页序与 manifest 中的 `file`、`width`、`height` 写入
   `projects/research-shared/project-data.js` 对应项目的 `pages` 数组。
4. 确认项目内容后再开放首页链接，不能用模拟文件填充。

只有生成工具的代码、操作说明与空的研究阅读结构会提交。

## 自检

```bash
python3 -m unittest discover -s scripts/research-watermark -p 'test_*.py' -v
```

测试仅创建临时模拟 PDF，验证顺序、旋转、像素水印、无损编码、原件不变，
以及禁止覆盖与禁止不可见水印。
