# 形色场 UI Handbook · 离线文档版

> 本文档是 [形色场 UI Handbook](https://github.com/zzhzhouzhou/UI-handbook) 的离线速览版，供无法访问网页时阅读。
>
> - 在线阅读（Cloudflare）：<https://uihandbook.zzhzhou2026.workers.dev>
> - 在线阅读（GitHub Pages）：<https://zzhzhouzhou.github.io/UI-handbook/>
> - 项目仓库：<https://github.com/zzhzhouzhou/UI-handbook>

一套覆盖 10 章、104 个组件的 UI 教程：每个组件都包含可交互预览、用途说明、实现要点、无障碍细节与可直接复制的代码，全部以 React + Tailwind CSS 手写实现，不依赖任何 UI 组件库。本文档浓缩了全部章节的核心结论，**设计规范（第 09 章）保留了完整数值**。

---

## 目录

1. [设计基础](#01-设计基础)
2. [基础组件](#02-基础组件)
3. [表单与输入](#03-表单与输入)
4. [导航](#04-导航)
5. [反馈与覆盖层](#05-反馈与覆盖层)
6. [数据展示](#06-数据展示)
7. [指针交互与背景](#07-指针交互与背景)
8. [文字、滚动与高级模式](#08-文字滚动与高级模式)
9. [设计规范标准](#09-设计规范标准)
10. [模式与原则](#10-模式与原则)

---

## 01 设计基础

组件只是表象，决定界面质感的是底层设计令牌（Design Tokens）。

### 色彩系统

- 界面只需三类颜色：**中性灰阶（90%）+ 一个强调色 + 语义色**。
- 灰阶用 11 级（zinc 50→950）；文字主 900、次要 500–600、占位 400。
- 用 CSS 变量定义语义色（--bg / --fg / --muted / --border / --accent），深色模式只换变量值。
- 避免大面积纯黑 #000 与纯白 #fff，用 zinc-950 / zinc-50 更柔和。

### 排版层级

- 字号按 1.25 倍率取值：12 / 14 / 16 / 20 / 24 / 32 / 48。
- 大标题收紧字距（letter-spacing -0.02em ~ -0.04em），正文行高 1.6–1.75。
- 每行 45–75 个英文字符（中文 30–40 字）；数字用 tabular-nums 防跳动。

### 间距与栅格

- 4px 基准刻度：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64，所有间距只从中取值。
- 优先用 gap 而非 margin；响应式栅格可用 `repeat(auto-fill, minmax(240px, 1fr))`。

### 圆角阴影层级

- 圆角三档：小元素 6px、卡片 12px、弹窗 16px；嵌套圆角 = 外圆角 − 内边距。
- 阴影用多层叠加的极淡黑（0.04–0.08），深色模式改用更亮的边框表达层级。

### 动效令牌

- 只对 transform / opacity 做动画；进入 ease-out、退出 ease-in、弹性 cubic-bezier(0.32, 0.72, 0, 1)。
- 尊重 prefers-reduced-motion。

### 交互状态

- 每个可交互元素至少设计 6 态：默认、悬停、按下、聚焦、禁用、加载。
- 用 :focus-visible 而非 :focus，避免鼠标点击出现焦点环。

---

## 02 基础组件

### 按钮 Button

- 变体：主要（每屏一个）、次要、描边、幽灵、危险、链接；高度三档 32 / 36 / 44。
- 加载态保持宽度不跳动（min-w 或 spinner 替换图标位）；`active:scale-[0.98]` 提供按下反馈。
- 图标按钮必须有 aria-label。

### 分段控制器 Segmented

- 本质是一组 Radio，白色滑块用绝对定位 + left/width 百分比滑动。
- 指示器与按钮必须以同一基准计算（容器宽度 − 内边距），否则越往右越歪。

### 徽章 / 标签 / 角标 Badge / Tag / Chip

- 状态徽章 rounded-full、可移除标签 rounded-md；角标用 ring-2 ring-white 与背景分离。
- 数量超过 99 显示 99+。

### 头像 Avatar

- 三种回退：图片 → 首字母 → 图标；尺寸 24 / 32 / 40 / 56，字号 = size × 0.36。
- 头像组用负间距重叠 + ring-2 ring-white 分隔，超出显示 +N。

### 工具提示 Tooltip

- 纯 CSS：group + group-hover:opacity-100 + 位移过渡；键盘 focus 也要能触发（group-focus-within）。
- 复杂定位（翻转、避让）交给 Floating UI；不放交互内容。

### 标签输入 Tag Input

- 输入框与标签放在同一个 flex-wrap 容器，容器承担边框与焦点环。
- 回车添加（去重 + 上限）、Backspace 删除最后一个；单个标签限制长度（如 12 字）并显示 n/12 计数。

### 数字步进器 Number Input

- 增减按钮 + 可输入；到达边界自动禁用对应按钮；数字用等宽字体防宽度跳动。

### 倒计时按钮 Countdown Button

- 单个剩余秒数 state 驱动：useEffect 每秒减一，归零自动恢复；期间 disabled 防重复。

---

## 03 表单与输入

### 输入框 Input

- 四要素：标签、输入区、帮助文字、错误信息；焦点态 = 边框加深 + 4px 淡色外发光。
- 错误态：红色边框 + aria-invalid + 红色错误文字；错误文字加 role="alert"。

### 搜索框 Search Input

- 有内容时快捷键提示变为清空按钮——同一位置只放一个元素。
- 清空后把焦点还给输入框。

### 密码输入 Password Input

- 明文 / 密文切换（眼睛图标 aria-pressed）、实时强度条（长度 / 大写 / 数字 / 符号四条件）。
- autoComplete="new-password" / "current-password" 让密码管理器正确工作。

### 浮动标签 Floating Label

- 依赖 `:placeholder-shown` + peer 选择器；input 必须设 `placeholder=" "`。

### 复选 / 单选 / 开关

- 自定义样式 = 隐藏真实 input（sr-only）+ peer 绘制；保留原生键盘与表单能力。
- Switch 用 role="switch" + aria-checked；选中态用填充色而非加粗边框。

### 滑块 Slider

- 原生 input[type=range] 透明覆盖在自绘轨道上，保留键盘与触摸。
- 区间滑块：两个 input 都 pointer-events-none，只让 thumb 可点（WebKit 与 Firefox 的伪元素都要写）。

### 验证码输入 OTP

- 每格 maxLength=1 + inputMode="numeric"；输入自动跳格、Backspace 回退、支持整体粘贴。
- autoComplete="one-time-code" 让 iOS 自动填充短信验证码。

### 评分 Rating

- hover 预览 + 点击确定两个 state；容器 role="radiogroup"。

### 可搜索下拉 Combobox

- input 承担搜索，列表 role="listbox"；onBlur 关闭需要延迟，或选项用 onMouseDown。
- 复杂场景直接用 cmdk / react-select。

### 下拉选择 Select

- 4–10 个选项、无需搜索时的默认选择；原生 select + appearance-none 定制箭头。
- 移动端唤起原生选择器，键盘与 type-ahead 免费获得。

### 日期选择器 Date Picker

- 日历网格 = 月首星期偏移 + 当月天数；跨年用 new Date(y, m ± 1, 1) 自动处理。
- 选中态实心、今天加下划线；生产环境用 date-fns 处理时区与本地化。

### 文件上传区 Dropzone

- label 包裹隐藏 input[type=file]；onDragOver 必须 preventDefault。
- dragenter/leave 会在子元素间反复触发——内层 pointer-events-none 或计数器避免闪烁。
- 校验类型与大小，错误在文件行内提示。

### 颜色选择 Color Swatches

- 限定色板 + 选中环（scale + ring）；色块即按钮，天然支持键盘与触屏。

---

## 04 导航

### 顶部导航栏 Navbar

- Logo + 链接组 + 行动按钮三段式；移动端折叠汉堡菜单；当前页用深色文字而非下划线。

### 标签页 Tabs（滑动指示器）

- 指示器读取选中 tab 的 offsetLeft / offsetWidth 平滑滑动；用 ResizeObserver 跟随宽度变化。
- 内容面板加 key={index} 触发重新挂载的进入动画。

### 面包屑 Breadcrumb

- 层级过深折叠中间为「…」；最后一项 aria-current="page" 且不可点。

### 分页 Pagination

- 页码集合 = {1, total, p−1, p, p+1}，排序后相邻差 > 1 插省略号。

### 侧边栏 Sidebar

- 宽度过渡 w-52 ↔ w-14；选中项白色卡片 + 细阴影从灰底「浮起」。
- 折叠时隐藏文字并加 title 提示；状态存 localStorage。

### 步骤条 Stepper

- 三态：已完成（实心勾）、当前（描边 + ring-4 外环）、未开始（灰描边）。
- 标签用 top-full + left-1/2 -translate-x-1/2 锚定到圆点正下方。

### 下拉菜单 Dropdown Menu

- document mousedown + ref.contains 判断点击外部关闭；Esc 关闭。
- 出现动画 origin-top-left + scale 0.96→1；危险项用分割线隔开。

### 命令面板 Command Palette ⌘K

- 全局 keydown 监听 metaKey/ctrlKey + k，preventDefault 拦截浏览器默认。
- 打开时锁定 body 滚动、role="dialog" aria-modal、autoFocus 输入框。
- 模糊搜索用 fuse.js 或 cmdk。

### 右键菜单 Context Menu

- onContextMenu preventDefault + 记录相对坐标；坐标钳制在容器内防边缘裁切。
- 移动端长按触发：pointerdown(touch) + 500ms 定时器，移动超 8px 取消；打开后忽略合成的 click。

### macOS Dock 放大

- scale = max(1, maxScale − distance / falloff)；用 transform: scale() 而非改宽高，布局不回流不抖动。
- 触屏没有 hover：matchMedia('(hover: hover)') 检测后关闭。

### 阅读进度 / 收缩头部

- 进度 = scrollTop / (scrollHeight − clientHeight)，分母为 0 要兜底。
- 现代浏览器可用 CSS animation-timeline: scroll() 零 JS 实现。

### 底部标签栏 Bottom Tab Bar

- fixed bottom-0 + `padding-bottom: env(safe-area-inset-bottom)` 适配安全区。
- 半透明背景 + backdrop-blur；选中项颜色 + 指示条双重标识。

### 通知面板 Notifications

- 铃铛 + 未读红点（ring 与底色同色挖空）；未读项浅底 + 圆点双重标识。
- 面板 absolute right-0 对齐按钮右缘，max-w 防小屏溢出。

---

## 05 反馈与覆盖层

从轻到重选择：Toast（不打断）→ Alert（页面内）→ Popover（局部）→ Drawer（侧边）→ Modal（必须处理）。

### 轻提示 Toast

- 数组队列 slice(-3) 限数量；两段式移除：先 leaving 触发退出动画，300ms 后删除。
- 容器 pointer-events-none、单条 pointer-events-auto。

### 对话框 / 确认框 Modal

- 打开时锁定 body 滚动；焦点陷阱（Tab 循环）+ 关闭后焦点归还触发按钮。
- 危险确认框用 role="alertdialog"，危险按钮不要默认聚焦。
- 原生 `<dialog>` + showModal() 自带焦点陷阱与 Esc，值得优先考虑。

### 抽屉 / 底部面板 Drawer

- 右侧 translateX(100%→0)、底部 translateY(100%→0) + rounded-t-2xl。
- 缓动 cubic-bezier(0.32,0.72,0,1) 300ms；底部面板手势下拉超过阈值关闭。
- 打开时锁滚动、Esc 关闭，与 Modal 一致。

### 警告条 / 横幅 Alert

- 浅底 + 同色系深字 + 同色系边框；横幅用反色从页面中区分。
- 一般提示 role="status"，重要即时信息才用 role="alert"。

### 进度指示 Progress

- 环形：dashoffset = c − c × p%，svg 旋转 −90° 让起点在顶部。
- role="progressbar" + aria-valuenow/min/max；不确定进度省略 valuenow。

### 加载态 Loading

- Spinner 用于 < 1s 等待；骨架屏形状与真实内容一致；超过 300ms 才显示 loading 防闪烁。

### 空状态 Empty State

- 解释「为什么是空的」并给出下一步行动；搜索无结果时提供「清除筛选」。

### 气泡卡片 Popover

- 箭头 = 旋转 45° 的正方形 + 左上两条边框；可以放表单等交互内容（与 Tooltip 的区别）。

### 悬浮操作按钮 FAB / Speed Dial

- 一个页面最多一个 FAB；展开项从 bottom 向上排布，逐项 40ms 延迟出现。
- 移动端避开安全区：bottom = 16px + env(safe-area-inset-bottom)。

---

## 06 数据展示

### 卡片 Card

- 基础（仅边框）、可点击（hover 上浮 + 阴影加深）、媒体、横向四种形态；不要卡片套卡片。

### 数据表格 Table

- 排序：sortKey + asc + useMemo；多选：Set + 全选 indeterminate。
- 去掉竖线只留极淡横分隔；数字列右对齐 + tabular-nums。
- 大数据量用虚拟滚动（@tanstack/react-virtual）+ 服务端分页。

### 手风琴 Accordion

- 高度动画用 grid-template-rows 0fr → 1fr，无需测量高度；加号 rotate-45 变叉。

### 时间线 Timeline

- 左侧圆点 + 绝对定位 1px 竖线（最后一项不渲染）；时间右对齐 shrink-0。

### 指标卡片 / 迷你图 Stats

- Sparkline：数据归一化映射到 SVG 坐标，polyline 连线；变化率绿升红降。
- 柱状图纯 div + group-hover 显示数值。

### 代码块 Code Block

- 代码块始终深色（即使浅色主题）；行号 select-none；语法高亮构建时用 shiki、运行时用 prism。

### 树形视图 Tree View

- 递归组件渲染；展开状态用 Set<path>；缩进 = depth × 16 + 8。

### 看板拖放 Kanban

- Pointer Events + setPointerCapture：桌面触屏都能拖；move 中比对列矩形做高亮。
- 松手时更新数据；卡片 touch-none 防止触发滚动。复杂需求用 @dnd-kit/core。

### 聊天气泡 Chat

- 自己的消息 flex-row-reverse + 深色；靠近头像的一角圆角更小。
- 「正在输入」用三个 animation-delay 依次 160ms 的跳动点。

### 日历热力图 Heatmap

- grid-flow-col + grid-rows-7 按列排布；容器 w-max 防止 auto 列被拉伸。
- 数值分 5 级映射灰度；每格 title 提供原生 tooltip。

### 轮播 Carousel

- 轨道 flex + translateX(-index × 100%)；循环 (i ± 1 + n) % n。
- 触摸滑动：pointerdown 记起点，pointerup 位移超 40px 翻页；容器 touch-pan-y。

### 图片对比滑块 Compare

- 上层 clipPath: inset(0 (100−p)% 0 0)；Pointer Events + touch-pan-y。

### Bento 网格 Bento

- grid-cols-3 grid-rows-2 + col-span / row-span；穿插 1–2 个反色或纹理卡片。
- 移动端退化为单列或两列。

### 瀑布流 Masonry

- CSS 多列：columns-2/3 + break-inside-avoid；多列是纵向优先填充，不适合强顺序内容。

### 描述列表 Description List

- 原生 dl / dt / dd 语义标签；dt 定宽、dd flex-1 min-w-0 可换行。

### 引用块 Blockquote

- 竖线式（border-l-2 + pl-4）适合正文内嵌；卡片式适合独立成段；出处用 footer 弱化。

---

## 07 指针交互与背景

共同原则：用 CSS 变量传坐标、直接操作 DOM style 而非 setState、只动 transform / opacity、rAF 节流；装饰性动效一个页面最多一两处。

- **聚光灯背景**：mask-image 径向渐变裁剪高亮网格，中心由 --x / --y 变量控制。
- **鼠标视差**：每层 translate = (dx × depth, dy × depth)，transition 200ms 抹平抖动。
- **音频律动条**：AudioContext 必须在用户手势后创建；AnalyserNode fftSize=256，幂函数取样让频段均匀。
- **磁性按钮**：偏移 = (鼠标 − 中心) × 0.35，文字再 × 0.15；用 transition-transform 弹回。
- **3D 倾斜卡片**：perspective(800px) rotateX/rotateY ±16°，preserve-3d + translateZ 分层。
- **边框聚光卡**：外层 1px padding 的「边框层」+ 径向渐变，内层盖住中间。
- **自定义光标**：圆点直接跟随、圆环 rAF 每帧 lerp 15%；移动端用 @media (hover: none) 隐藏。
- **粒子连线背景**：canvas 尺寸 × devicePixelRatio 防模糊（建议封顶 1.5）；粒子 ≤ 100；离屏时暂停 rAF。
- **涟漪点击**：涟漪尺寸 = max(w, h)，位置 = 点击点 − size/2，600ms 后移除。
- **旋钮**：pointerdown + setPointerCapture；滚轮需要原生 addEventListener('wheel', fn, { passive: false }) 才能 preventDefault。
- **毛玻璃**：bg-white/50 + backdrop-blur-xl + border-white/60；开销大，避免大面积。
- **边框光束**：offset-path: rect(...) + offset-distance 动画，纯 CSS 无 JS。

---

## 08 文字、滚动与高级模式

- **无限跑马灯**：内容渲染两份、每份自带 pr=gap 的组，translateX(−50%) 才不会跳变；hover 暂停。
- **打字机**：三 state（词索引 / 已显示文本 / 是否删除中），输入 110ms、删除 50ms，输入完停 1200ms。
- **文字乱码解码**：setInterval 40ms 一帧，第 i 个字符在 frame > i×2 后固定；用等宽字体防宽度跳动。
- **数字滚动**：rAF + easeOutCubic（e = 1 − (1−p)³）+ toLocaleString；组件定义在组件外。
- **滚动显现**：IntersectionObserver + data-shown 属性，threshold 0.3 触发后 unobserve。
- **堆叠卡片**：纯 CSS sticky，top = 基础值 + index × 12px。
- **无限滚动**：哨兵元素 + IntersectionObserver（rootMargin 80px），loading 锁防重复。
- **拖拽排序**：Pointer Events 比对每项 getBoundingClientRect 找落点，splice 重排。
- **纸屑庆祝**：canvas 粒子系统，每片有生命值衰减；raf 存 ref 防连点并发循环。
- **左滑删除**：滑动超阈值松手直接删除，未过阈值弹回；不要做常开的删除按钮（拖拽结束的 click 会误删）。
- **主题切换转场**：View Transitions API，clip-path circle 从点击位置扩散；t.ready 要 .catch。
- **时钟**：时针角 = (h%12 + m/60) × 30；指针 transform-origin: 50% 100% 从底部旋转。
- **伸缩画廊**：激活项 flex-[4] 其他 flex-1，transition-[flex]；onMouseEnter 与 onClick 双绑定兼容触屏。
- **滚动逐字点亮**：外层滚动 + 内层 sticky，进度换算逐字变色；rAF 节流。
- **可拖拽分栏**：分割条 setPointerCapture + body cursor: col-resize；宽度存 localStorage（try/catch）。
- **噪点纹理**：::after + feTurbulence SVG，mix-blend-mode multiply（浅色）/ screen（深色），透明度 3%–8%。

---

## 09 设计规范标准

本章是全站数值的速查表。规范的意义不是限制，而是让团队在不用讨论的情况下做出一致的决策。每个数值都有出处：WCAG、iOS HIG、Material Design。

### 9.1 触控与尺寸标准

| 项目 | 标准值 | 说明 |
| --- | --- | --- |
| 触控目标 | ≥ 44×44px | iOS HIG 与 Material 一致；WCAG 2.5.8 AA 为 24px、AAA 为 44px |
| 控件高度 | 32 / 36 / 44px | 密集工具栏 / 常规 / 主要动作 |
| 图标尺寸 | 16 / 20 / 24px | 行内 / 按钮 / 空状态 |
| 头像尺寸 | 24 / 32 / 40 / 56px | 行内 / 列表 / 页面 / 主页 |
| 圆角 | 6 / 12 / 16px | 小元素 / 卡片 / 弹窗；嵌套圆角 = 外 − 内 |
| 相邻点击间隔 | ≥ 8px | 防误触 |

- 视觉尺寸可以小于 44px，但要向外扩展透明热区（`::after { inset: -12px }`）。

### 9.2 色彩使用标准

**60 · 30 · 10 法则**：60% 主背景、30% 次级界面（卡片 / 侧栏）、10% 强调色。强调色只给最重要的动作——出现越少越有力量。

**WCAG 对比度标准**：

| 元素 | 最低对比度 | 等级 |
| --- | --- | --- |
| 正文文字 | ≥ 4.5 : 1 | AA |
| 大号文字（≥ 24px 或 19px bold） | ≥ 3 : 1 | AA |
| 图标 / 边框 / UI 组件 | ≥ 3 : 1 | AA |
| 正文文字（加强） | ≥ 7 : 1 | AAA |

- 语义色成对定义（浅底 + 深字，如 red-50 + red-700），组合后必须满足对比度。
- 深色模式单独验证对比度；不能只靠颜色传达信息（同时给图标和文字）。

### 9.3 字阶与行高标准

| 层级 | 字号 / 行高 | 用途 |
| --- | --- | --- |
| Display | 48 / 1.1 | 落地页主标题 |
| H1 | 32 / 1.25 | 页面标题 |
| H2 | 24 / 1.33 | 区块标题 |
| H3 | 20 / 1.4 | 卡片标题 |
| Body | 16 / 1.7 | 正文 |
| Caption | 12 / 1.5 | 辅助信息（可加大写） |

- 字阶按 1.25 倍率（Major Third）生成；字号与行高成对定义、不可分离。
- 中文正文每行 30–40 字最舒适；数字一律 tabular-nums；中文避免伪斜体。

### 9.4 层级 z-index 标准

| 层级 | z-index | 示例 |
| --- | --- | --- |
| 页面内容 | 0 | 普通文档流 |
| 悬浮卡片 | 10 | 悬停浮起的卡片 |
| 下拉 / 气泡 | 20 | Dropdown / Popover |
| 粘性头部 / 侧栏 | 40 | sticky 元素 |
| 遮罩 / Modal | 50 | 遮罩出现时低于它的层级不可交互 |
| Toast | 60 | 全局提示，永远在最上 |

- 只允许这 6 个档位，用变量管理、禁止 9999 魔法数字。
- 注意 transform / filter 会创建新的层叠上下文，z-index 只在同一上下文内比较。

### 9.5 动效时长标准

| 场景 | 时长 | 缓动 |
| --- | --- | --- |
| 微交互（hover / 按下） | 150ms | ease-out |
| 进入（弹窗 / 菜单） | 200–300ms | ease-out |
| 退出 | 进入 × 0.8 | ease-in |
| 页面转场 | 400–500ms | ease-in-out |

- 只动 transform 和 opacity；列表出现使用 stagger（每项延迟 30–50ms）。
- prefers-reduced-motion: reduce 时把所有动画压到 0.01ms。

### 9.6 响应式断点标准

| 断点 | 宽度 | 典型设备 |
| --- | --- | --- |
| base | < 640px | 手机 |
| sm | ≥ 640px | 平板竖屏 |
| md | ≥ 768px | 平板横屏 |
| lg | ≥ 1024px | 笔记本 |
| xl | ≥ 1280px | 桌面 |

- **移动优先**：base 样式写给手机，再用 min-width 逐级增强。
- 断点由内容决定，不是设备；组件内部的响应式用容器查询 `@container`。
- 320px 是最小可读宽度，不得出现横向滚动；断点之间假设没有 hover。

---

## 10 模式与原则

### 页面布局骨架

- 四种骨架：后台（侧栏 + 顶栏 + 内容网格）、圣杯、居中单列、分屏。
- 粘性页脚：min-h-screen flex flex-col + main flex-1。

### 响应式策略

- 移动优先；断点只写 min-width。
- 表格 → 移动端卡片；侧栏 → 抽屉；Modal → 全屏 / 底部面板。
- 隐藏不是响应式：移动端应重新排布而不是简单 hidden。

### 表单体验

- 校验时机：blur 时校验 + 提交时全量校验；已出错字段在输入时实时重新校验（reward early, punish late）。
- 错误信息紧贴字段下方，红色 + 图标 + role="alert" + aria-invalid。
- 单列布局、标签在上方；提交后禁用按钮防重复，成功后显示明确结果。
- 密码弱时必须给出可见错误——静默失败是表单体验的大忌。

### 深色模式

- Tailwind 4：`@custom-variant dark (&:where(.dark, .dark *))`。
- 初始化在 `<head>` 内联脚本执行（读 localStorage → 否则 matchMedia），避免闪白。
- 背景不用纯黑、文字不用纯白、层级越高背景越亮；阴影改边框。
- `color-scheme: dark` 让原生控件与滚动条同步变深。

### 设计走查清单

- 层级：只有一个 H1；主按钮每屏一次；视线流从左上到右下。
- 一致性：同类元素同尺寸、圆角、间距；图标风格统一。
- 反馈：所有操作 100ms 内有视觉反馈；异步有加载态；错误说明原因和解决方式。
- 无障碍：对比度 ≥ 4.5:1；键盘可完成所有操作；图标按钮有 aria-label。
- 响应式：320px 不横向滚动；触控目标 ≥ 44×44px；hover 有触屏替代方案。
- 性能：动画只用 transform / opacity；图片懒加载并指定宽高；首屏无 CLS。

---

## 关于

作者：zzh_zhou · **Garbage Human Studio**

本项目由 AI 辅助开发。全部组件以 React + Tailwind CSS 手写实现，不依赖任何 UI 组件库。

- 项目主页：<https://github.com/zzhzhouzhou/UI-handbook>
- 在线阅读：<https://uihandbook.zzhzhou2026.workers.dev>
- 在线阅读（GitHub Pages）：<https://zzhzhouzhou.github.io/UI-handbook/>
