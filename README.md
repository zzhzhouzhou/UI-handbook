# 形色场
# UI Handbook

**在线阅读**

- Cloudflare：<https://uihandbook.zzhzhou2026.workers.dev>
- GitHub Pages：<https://zzhzhouzhou.github.io/UI-handbook/>
- 设计规范文档（Markdown 离线版，纯中文概述，适合无法访问网页时阅读）：[docs/handbook.md](docs/handbook.md)

一份从设计令牌到高级交互的完整 UI 组件教程。每个组件都包含**可交互预览**、**用途说明**、**实现要点**、**无障碍细节**与**可直接复制的核心代码**，全部采用克制的黑白灰实现——把 `zinc-900` 换成你的品牌色，就是你的设计系统。

全站 104 个组件、10 大章节，没有任何 UI 组件库——每一个组件（按钮、命令面板、看板拖放、日期选择器……）都是用 React + Tailwind CSS 手写实现的，这也是本站的意义：教你从零理解每个组件的原理。

## 章节目录

| 章节 | 内容 |
| --- | --- |
| 01 设计基础 | 色彩系统、排版层级、间距栅格、圆角阴影、动效令牌、交互状态 |
| 02 基础组件 | 按钮、徽章、头像、工具提示、分段控制器、标签输入、数字步进器、倒计时按钮 |
| 03 表单与输入 | 输入框、搜索框、密码输入、浮动标签、复选/单选/开关、滑块、验证码、评分、组合框、下拉选择、日期选择器、文件上传、颜色选择 |
| 04 导航 | 顶部导航栏、标签页、面包屑、分页、侧边栏、步骤条、下拉菜单、命令面板 ⌘K、右键菜单、macOS Dock、阅读进度、底部标签栏、通知面板 |
| 05 反馈与覆盖层 | Toast、对话框、抽屉、警告条、进度指示、加载态、空状态、气泡卡片、悬浮操作按钮 |
| 06 数据展示 | 表格、手风琴、时间线、指标卡片、代码块、树形视图、看板拖放、聊天气泡、日历热力图、轮播、图片对比、Bento 网格、瀑布流、描述列表、引用块 |
| 07 指针交互与背景 | 聚光灯背景、鼠标视差、音频律动条、磁性按钮、3D 倾斜、边框聚光、自定义光标、粒子连线、涟漪、旋钮、毛玻璃、边框光束 |
| 08 文字、滚动与高级模式 | 跑马灯、打字机、文字解码、数字滚动、滚动显现、堆叠卡片、无限滚动、拖拽排序、纸屑庆祝、左滑删除、主题切换转场、时钟、伸缩画廊、逐字点亮、可拖拽分栏、噪点纹理 |
| 09 设计规范标准 | 触控尺寸、色彩对比度、字阶行高、层级 z-index、动效时长、响应式断点 |
| 10 模式与原则 | 布局骨架、响应式策略、表单体验、深色模式方法论、设计走查清单 |


## 特性

- **可交互预览** — 所有 demo 都是真的，不是截图；支持深色模式，跟随系统并可手动切换
- **教程与实现一致** — 每个组件的要点文案与其实现严格对应，照抄即可用
- **手机端完整适配** — 拖拽、滑动手势均基于 Pointer Events，桌面与触屏行为一致
- **语法高亮代码块** — 内置轻量分词器，零依赖实现 TS / CSS / HTML 高亮
- **单文件产物** — 构建后所有 JS / CSS 内联进一个 HTML，可部署到任何静态托管

## 技术栈

- [React 19](https://react.dev) + [TypeScript 5.9](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)（`@theme` 定义设计令牌与动画）
- [Vite 7](https://vite.dev) + [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)
- 运行时依赖仅 `clsx` + `tailwind-merge`，图标为手写内联 SVG

## 快速开始

```bash
git clone https://github.com/zzhzhouzhou/UI-handbook.git
cd UI-handbook
npm install
npm run dev      # 开发预览 http://localhost:5173
npm run build    # 产物：dist/index.html（单文件）
npm run preview  # 本地预览构建产物
```

## 项目结构

```
src/
├── App.tsx              # 应用外壳：侧边栏搜索、滚动高亮、主题切换
├── nav.ts               # 全站目录数据源（8 章 / 91 个组件）
├── index.css            # 设计令牌、动画、深色模式变体
├── components/
│   ├── Showcase.tsx     # 组件展示框架：预览/代码双 Tab、复制、懒挂载
│   └── primitives.tsx   # 基础原子组件与手写 SVG 图标库
├── sections/            # 8 个章节，每个文件是一章
└── utils/               # cn / copy（剪贴板降级）/ highlight（语法高亮）
```

## 部署

本项目部署在 Cloudflare Workers（静态资源 + Git 集成）：仓库推送到 `main` 后自动构建上线，无需手动操作。

如果你也想部署自己的副本：构建产物是单个 `dist/index.html`，Cloudflare Pages / Vercel / Netlify 等任何静态托管都能直接用（构建命令 `npm run build`，输出目录 `dist`）。

欢迎 Fork ；如果对你有帮助，欢迎点个 Star，感谢你！

## 作者

zzh_zhou · **Garbage Human Studio**

- 项目主页：<https://github.com/zzhzhouzhou/UI-handbook>
- 在线阅读：<https://uihandbook.zzhzhou2026.workers.dev>
