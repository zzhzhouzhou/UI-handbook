import { Showcase, SectionHeader } from "../components/Showcase";
import { Icon, Kbd } from "../components/primitives";
import { cn } from "../utils/cn";

/* 触控与控件尺寸标准 */
function SizingStandard() {
  return (
    <div className="w-full max-w-lg space-y-6">
      <div>
        <div className="mb-2 text-xs font-medium text-zinc-500">触控目标（人机交互最低标准）</div>
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <span className="grid h-11 w-11 place-items-center rounded-lg border-2 border-zinc-900 text-[10px] font-medium dark:border-white">44px</span>
            <span className="text-[10px] text-zinc-400">最低标准</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 opacity-60">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-300 text-[10px] dark:border-zinc-600">36</span>
            <span className="text-[10px] text-zinc-400">桌面紧凑</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 opacity-60">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-300 text-[10px] dark:border-zinc-600">32</span>
            <span className="text-[10px] text-zinc-400">密集工具栏</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          ["控件高度", "32 / 36 / 44", "工具栏 / 常规 / 大按钮"],
          ["图标尺寸", "16 / 20 / 24", "行内 / 按钮 / 空状态"],
          ["头像尺寸", "24 / 32 / 40 / 56", "行内 / 列表 / 页面 / 主页"],
        ].map(([t, v, d]) => (
          <div key={t} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-400">{t}</div>
            <div className="mt-1 font-mono text-xs font-medium">{v}</div>
            <div className="mt-1 text-[10px] text-zinc-400">{d}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {[["6px", "rounded-md"], ["12px", "rounded-xl"], ["16px", "rounded-2xl"]].map(([t, c]) => (
          <div key={t} className={cn("flex h-12 flex-1 items-center justify-center border border-zinc-200 bg-white text-[11px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900", c)}>
            圆角 {t}
          </div>
        ))}
      </div>
    </div>
  );
}

/* 色彩使用标准 */
function ColorStandard() {
  return (
    <div className="w-full max-w-lg space-y-6">
      <div>
        <div className="mb-2 text-xs font-medium text-zinc-500">60 · 30 · 10 法则</div>
        <div className="flex h-10 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex w-[60%] items-center justify-center bg-zinc-100 text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">60% 主背景</div>
          <div className="flex w-[30%] items-center justify-center bg-zinc-400 text-[11px] text-white dark:bg-zinc-500">30% 次级 / 卡片</div>
          <div className="flex w-[10%] items-center justify-center bg-zinc-900 text-[11px] font-medium text-white dark:bg-white dark:text-zinc-900">10%</div>
        </div>
        <p className="mt-2 text-xs text-zinc-400">强调色只给最重要的 10%：主按钮、链接、焦点环、选中态。</p>
      </div>
      <div className="space-y-2">
        <div className="mb-2 text-xs font-medium text-zinc-500">WCAG 对比度标准</div>
        {[
          ["正文文字", "≥ 4.5 : 1", "AA", "bg-zinc-900 text-white"],
          ["大号文字（≥ 24px）", "≥ 3 : 1", "AA", "bg-zinc-700 text-white"],
          ["图标 / 边框 / UI 组件", "≥ 3 : 1", "AA", "bg-zinc-500 text-white"],
          ["正文文字加强版", "≥ 7 : 1", "AAA", "bg-zinc-950 text-white ring-1 ring-zinc-700"],
        ].map(([t, v, g, c]) => (
          <div key={t as string} className="flex items-center gap-3">
            <span className={cn("grid h-8 w-14 shrink-0 place-items-center rounded text-[10px] font-medium", c)}>{g}</span>
            <span className="flex-1 text-sm">{t}</span>
            <span className="font-mono text-xs tabular-nums text-zinc-500">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 字阶与行高标准 */
function TypeStandard() {
  return (
    <div className="w-full max-w-xl space-y-1">
      {[
        ["Display", "48 / 1.1", "text-4xl sm:text-5xl font-semibold tracking-tighter leading-[1.1]"],
        ["H1", "32 / 1.25", "text-3xl font-semibold tracking-tight leading-[1.25]"],
        ["H2", "24 / 1.33", "text-2xl font-semibold leading-[1.33]"],
        ["H3", "20 / 1.4", "text-xl font-medium leading-[1.4]"],
        ["Body", "16 / 1.7", "text-base leading-[1.7] text-zinc-600 dark:text-zinc-400"],
        ["Caption", "12 / 1.5", "text-xs uppercase tracking-wider text-zinc-400"],
      ].map(([l, spec, c]) => (
        <div key={l} className="flex flex-col gap-0.5 border-b border-zinc-100 py-2 sm:flex-row sm:items-baseline sm:gap-4 dark:border-zinc-800">
          <span className="w-20 shrink-0 font-mono text-[11px] text-zinc-400">{l}</span>
          <span className="w-16 shrink-0 font-mono text-[11px] tabular-nums text-zinc-400">{spec}</span>
          <span className={cn("truncate", c)}>{l === "Body" || l === "Caption" ? "设计即秩序，排版即层级" : "设计即秩序"}</span>
        </div>
      ))}
      <p className="pt-3 text-xs text-zinc-400">字号按 1.25 倍率取值：12 / 14 / 16 / 20 / 24 / 32 / 48。正文行高 1.6–1.75，每行 30–40 个汉字。</p>
    </div>
  );
}

/* 层级 z-index 标准 */
function ZIndexStandard() {
  const layers = [
    ["Toast / 全局提示", "60", "w-3/4"],
    ["Modal · 遮罩", "50", "w-4/5"],
    ["粘性头部 / 侧边栏", "40", "w-full"],
    ["下拉 / 气泡", "20", "w-2/3"],
    ["悬浮卡片", "10", "w-1/2"],
    ["页面内容", "0", "w-full"],
  ];
  return (
    <div className="w-full max-w-md space-y-1.5">
      {layers.map(([t, z, w]) => (
        <div key={z} className={cn("flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-800", w)}>
          <span className="text-xs font-medium">{t}</span>
          <span className="font-mono text-[11px] tabular-nums text-zinc-400">z-{z}</span>
        </div>
      ))}
      <p className="pt-2 text-xs text-zinc-400">只允许这 6 个档位，禁止 9999 这种魔法数字；遮罩出现时，低于 50 的层级都不可交互。</p>
    </div>
  );
}

/* 动效时长标准 */
function MotionStandard() {
  return (
    <div className="w-full max-w-md space-y-5">
      {[
        ["微交互（hover / 按下）", "150ms", 150, "bg-zinc-300 dark:bg-zinc-600"],
        ["进入（弹窗 / 菜单）", "250ms", 250, "bg-zinc-500 dark:bg-zinc-400"],
        ["页面转场", "450ms", 450, "bg-zinc-900 dark:bg-white"],
      ].map(([t, d, ms, c]) => (
        <div key={t as string}>
          <div className="mb-1.5 flex justify-between text-xs">
            <span>{t}</span>
            <span className="font-mono tabular-nums text-zinc-400">{d}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div className={cn("h-full rounded-full", c)} style={{ animation: `motionStd ${ms}ms linear infinite alternate`, width: "60%" }} />
          </div>
        </div>
      ))}
      <style>{`@keyframes motionStd{from{margin-left:0}to{margin-left:40%}}`}</style>
      <p className="text-xs text-zinc-400">退出比进入快 20%；缓动进入用 ease-out、退出用 ease-in；只动 transform 和 opacity；尊重 prefers-reduced-motion。</p>
    </div>
  );
}

/* 响应式断点标准 */
function BreakpointStandard() {
  return (
    <div className="w-full max-w-lg">
      <div className="flex overflow-hidden rounded-lg border border-zinc-200 font-mono text-[11px] dark:border-zinc-800">
        {[
          ["< 640", "base\n手机", "bg-zinc-100 dark:bg-zinc-800"],
          ["≥ 640 sm", "平板竖屏", "bg-zinc-200 dark:bg-zinc-700"],
          ["≥ 768 md", "平板横屏", "bg-zinc-300 dark:bg-zinc-600"],
          ["≥ 1024 lg", "笔记本", "bg-zinc-500 text-white dark:bg-zinc-400 dark:text-zinc-900"],
          ["≥ 1280 xl", "桌面", "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"],
        ].map(([bp, d, c]) => (
          <div key={bp} className={cn("flex flex-1 flex-col items-center gap-0.5 py-3 text-center", c)}>
            <span className="font-medium">{bp}</span>
            <span className="text-[10px] opacity-70">{d}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
        <p>移动优先：先写手机样式，再用 <code className="rounded bg-zinc-100 px-1 font-mono text-[11px] dark:bg-zinc-800">sm:</code> <code className="rounded bg-zinc-100 px-1 font-mono text-[11px] dark:bg-zinc-800">md:</code> 逐级增强，而不是从桌面往下删。</p>
        <p>断点对应的是内容需要，不是具体设备；组件内部的响应式用容器查询 <code className="rounded bg-zinc-100 px-1 font-mono text-[11px] dark:bg-zinc-800">@container</code>。</p>
        <p>断点之间假设没有 hover：所有悬停效果都要有点按 / 触摸的替代路径。</p>
      </div>
    </div>
  );
}

export default function Standards() {
  return (
    <section>
      <SectionHeader
        id="standards"
        index="09"
        title="设计规范标准"
        en="Design Standards"
        intro="这一章把前面各章散落的标准数值汇总成速查表：触控目标、对比度、字阶、层级、动效时长与断点。规范的意义不是限制，而是让团队在不用讨论的情况下做出一致的决策。每个数值背后都有出处：WCAG、iOS HIG、Material Design。"
        icon={<Icon.ClipboardCheck />}
      />

      <Showcase
        id="sizing"
        title="触控与尺寸标准"
        en="Sizing Standards"
        description="一套界面里反复出现的尺寸应该来自同一张表，而不是每次随手写。控件高度、图标、头像、圆角各自只有 3–4 个档位。"
        usage={["新组件开发时先查表再写值。", "Design Review 时对照检查。"]}
        points={["触控目标最低 44×44px（iOS HIG 与 Material 一致；WCAG 2.5.8 AA 为 24px，AAA 为 44px）。", "控件高度三档：32（密集）/ 36（常规）/ 44（主要动作）。", "圆角三档：小元素 6px、卡片 12px、弹窗 16px；嵌套圆角 = 外圆角 − 内边距。", "视觉尺寸可以小于 44px，但要向外扩展透明热区到 44px。"]}
        a11y={["相邻可点击元素之间至少留 8px 间隔，防止误触。"]}
        code={`/* 尺寸令牌：只允许从这张表取值 */
--height-sm: 32px;  --height-md: 36px;  --height-lg: 44px;
--icon-sm: 16px;    --icon-md: 20px;    --icon-lg: 24px;
--radius-sm: 6px;   --radius-md: 12px;  --radius-lg: 16px;

/* 视觉 20px 的图标按钮，热区扩到 44px */
.icon-btn { position: relative; width: 20px; height: 20px; }
.icon-btn::after { content: ""; position: absolute; inset: -12px; }`}
        dotted={false}
      >
        <SizingStandard />
      </Showcase>

      <Showcase
        id="color-standard"
        title="色彩使用标准"
        en="Color Standards"
        description="颜色用量的黄金比例是 60 · 30 · 10：60% 主背景、30% 次级界面、10% 强调色。对比度必须满足 WCAG，这不是风格偏好，而是硬性标准。"
        usage={["确定品牌色在界面中的占比。", "上线前检查文字可读性。"]}
        points={["对比度标准：正文 ≥ 4.5:1、大字（≥ 24px 或 19px bold）≥ 3:1、图标与边框 ≥ 3:1（AA）；正文 7:1 为 AAA。", "强调色出现越少越有力量；如果一个页面有 3 个红色按钮，就没有主次了。", "语义色成对定义：浅底 + 深字（如 red-50 + red-700），并保证组合后满足对比度。", "避免纯黑 #000 和纯白 #fff 大面积使用，用 zinc-950 / zinc-50 更柔和。"]}
        a11y={["不能只靠颜色传达信息（WCAG 1.4.1）：错误状态要同时有图标和文字。", "深色模式要单独验证对比度，不能假设浅色达标深色也达标。"]}
        code={`/* 语义色定义成对出现，先算对比度再定色 */
:root  { --danger-bg: #fef2f2; --danger-fg: #b91c1c; }  /* 8.2:1 */
.dark  { --danger-bg: #450a0a; --danger-fg: #fecaca; }  /* 10.9:1 */

/* 检查工具：Chrome DevTools 内置对比度检查，或 WebAIM Contrast Checker */`}
        codeLang="css"
        dotted={false}
      >
        <ColorStandard />
      </Showcase>

      <Showcase
        id="type-standard"
        title="字阶与行高标准"
        en="Type Scale Standards"
        description="字号不应该是随意值：用 1.25 倍率（Major Third）生成字阶，每个层级同时定义字号与行高，两者不可分离。"
        usage={["搭建新设计系统时先定字阶。", "检查现有页面是否存在「差不多大小」的标题。"]}
        points={["字阶：12 / 14 / 16 / 20 / 24 / 32 / 48，相邻层级比值 1.25。", "行高随字号反比变化：正文 1.6–1.75，标题 1.1–1.4。", "中文正文每行 30–40 个汉字最舒适（对应英文 45–75 字符）。", "所有数字（表格、计时、金额）用 tabular-nums 等宽数字防跳动。", "中文避免使用斜体（没有真正的斜体字形，是伪斜体）。"]}
        code={`/* 字阶令牌：字号与行高成对定义 */
--text-caption: 12px;  --leading-caption: 1.5;
--text-body:    16px;  --leading-body:    1.7;
--text-h3:      20px;  --leading-h3:      1.4;
--text-h2:      24px;  --leading-h2:      1.33;
--text-h1:      32px;  --leading-h1:      1.25;
--text-display: 48px;  --leading-display: 1.1;

/* 标题收紧字距，正文保持默认 */
h1, h2, h3 { letter-spacing: -0.02em; }`}
        codeLang="css"
        dotted={false}
      >
        <TypeStandard />
      </Showcase>

      <Showcase
        id="z-index"
        title="层级 z-index 标准"
        en="Elevation & z-index"
        description="z-index 混乱的根源是随手写魔法数字。定 6 个档位，全站只用这些值，浮层之间的覆盖关系就永远不会打架。"
        usage={["新建浮层类组件时先分配档位。", "排查「弹窗被 Toast 盖住」这类问题。"]}
        points={["六档：内容 0 / 悬浮卡片 10 / 下拉与气泡 20 / 粘性头部与侧栏 40 / 遮罩与 Modal 50 / Toast 60。", "Toast 永远在最上：它是全局反馈，不能被任何弹窗挡住。", "遮罩（50）出现时，低于它的层级都不可交互，天然形成模态语义。", "z-index 只在同一个层叠上下文内比较——注意 transform / filter 会创建新的层叠上下文。"]}
        code={`/* 用变量而不用魔法数字 */
:root {
  --z-card: 10;  --z-dropdown: 20;  --z-sticky: 40;
  --z-overlay: 50;  --z-toast: 60;
}
.dropdown { z-index: var(--z-dropdown); }
.toast    { z-index: var(--z-toast); }`}
        codeLang="css"
        dotted={false}
      >
        <ZIndexStandard />
      </Showcase>

      <Showcase
        id="motion-standard"
        title="动效时长标准"
        en="Motion Standards"
        description="动效只有三个时长档位：150ms 微交互、250ms 进入、450ms 转场。退出永远比进入快 20%，让界面感觉「干脆」。"
        usage={["为按钮、弹窗、页面转场选择统一的时长。", "排查「动画感觉拖沓」的问题。"]}
        points={["三档：150ms（hover / 按下 / 颜色）、200–300ms（菜单 / 弹窗进入）、400–500ms（页面转场）。", "退出时长 = 进入 × 0.8：退出 200ms，进入 250ms。", "缓动：进入 ease-out（快出慢停）、退出 ease-in、弹性用 cubic-bezier(0.32, 0.72, 0, 1)。", "只对 transform 和 opacity 做动画，不触发重排。", "prefers-reduced-motion: reduce 时把动画时长压到接近 0。"]}
        a11y={["动画超过 5 秒的循环内容必须提供暂停方式（WCAG 2.2.2）。"]}
        code={`:root {
  --duration-fast: 150ms;   /* hover / 按下 */
  --duration-enter: 250ms;  /* 弹窗 / 菜单进入 */
  --duration-leave: 200ms;  /* 退出 = 进入 × 0.8 */
  --duration-page: 450ms;   /* 页面转场 */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`}
        codeLang="css"
        dotted={false}
      >
        <MotionStandard />
      </Showcase>

      <Showcase
        id="breakpoints"
        title="响应式断点标准"
        en="Breakpoint Standards"
        description="断点不是设备尺寸，而是「当前内容在哪个宽度开始放不下」。通用的 4 档：640 / 768 / 1024 / 1280，配合移动优先的书写顺序。"
        usage={["确定栅格列数变化的宽度。", "判断组件该用视口断点还是容器查询。"]}
        points={["四档：sm 640 / md 768 / lg 1024 / xl 1280；移动优先 = base 样式写给手机。", "断点由内容决定：三列卡片在 700px 就挤了，就别等到 768px 才换。", "组件级响应式用容器查询 @container，让组件不依赖视口宽度。", "触屏优先假设：hover 效果必须有替代路径，@media (hover: hover) 才启用悬停。", "320px 是最小可读宽度，任何页面在此宽度不得出现横向滚动。"]}
        code={`/* 移动优先：base → sm → md → lg → xl */
.cards { display: grid; grid-template-columns: 1fr; }
@media (min-width: 640px)  { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .cards { grid-template-columns: repeat(3, 1fr); } }

/* 组件内部响应式：跟随容器而不是视口 */
.widget { container-type: inline-size; }
@container (min-width: 400px) { .widget { flex-direction: row; } }`}
        codeLang="css"
        dotted={false}
      >
        <BreakpointStandard />
      </Showcase>

      <Showcase
        id="keyboard"
        title="键盘交互标准"
        en="Keyboard Interaction Standards"
        description="键盘是可访问性的底线：所有功能都要能用键盘完成。核心三条——焦点永远可见、Tab 顺序等于阅读顺序、覆盖层必配 Esc。下面是通用快捷键与焦点规则速查。"
        usage={["评审任何组件时对照检查。", "设计自定义组件（菜单、下拉、弹窗）时直接套用。"]}
        points={["焦点环只响应 :focus-visible：键盘用户必须有，鼠标用户不被打扰；必要时用 :focus-visible:not(:active) 再收窄。", "Tab 顺序 = DOM 顺序：不要用 tabindex > 0；复杂组件内部用 roving tabindex（容器 tabindex=0，内部方向键移动）。", "覆盖层（弹窗/菜单/抽屉）必须能 Esc 关闭，关闭后焦点归还触发元素。", "Enter 激活按钮，空格切换开关/复选；方向键移动单选组与菜单。", "快捷键（如 ⌘K）必须给出可发现的替代路径（按钮/菜单），不能只靠快捷键。"]}
        a11y={["快捷键冲突时提供修改入口；全局快捷键在输入框聚焦时应暂时停用。", "高对比与放大 200% 下焦点环依然清晰。"]}
        dotted={false}
      >
        <KeyboardStandard />
      </Showcase>
    </section>
  );
}

/* 键盘交互标准 */
function KeyboardStandard() {
  const rows: [string, string][] = [
    ["Esc", "关闭弹窗 / 菜单 / 抽屉；取消当前操作"],
    ["Enter", "提交表单；确认对话框；激活聚焦的按钮"],
    ["Tab / ⇧Tab", "焦点前进 / 后退；顺序 = DOM 顺序"],
    ["空格", "切换开关 / 复选；按钮聚焦时滚动页面"],
    ["↑ ↓ ← →", "单选组 / 菜单 / 网格内移动选项"],
    ["⌘K / Ctrl+K", "唤起命令面板（本站示例）"],
    ["/", "聚焦搜索框（本站示例）"],
    ["⌫", "删除 / 移除（列表项聚焦时）"],
  ];
  return (
    <div className="w-full max-w-xl space-y-5">
      <div>
        <div className="mb-2 text-xs font-medium text-zinc-500">通用快捷键速查</div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          {rows.map(([k, d], i) => (
            <div key={k} className={cn("flex items-center gap-3 px-3 py-2 text-sm", i > 0 && "border-t border-zinc-100 dark:border-zinc-900")}>
              <span className="w-28 shrink-0">
                <Kbd>{k}</Kbd>
              </span>
              <span className="text-zinc-600 dark:text-zinc-300">{d}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["焦点可见", "只用 :focus-visible 显示焦点环：键盘用户必须有，鼠标用户不打扰；焦点一旦进入页面必须永远可见。"],
          ["焦点顺序", "Tab 顺序 = DOM 顺序。复杂组件用 roving tabindex：容器一个 tabindex=0，内部用方向键在选项中移动。"],
          ["Esc 兜底", "任何覆盖层都能 Esc 关闭，并把焦点归还给触发它的元素，避免焦点「丢失」。"],
          ["激活语义", "Enter 激活按钮，空格切换开关/复选；单选组方向键移动后按空格确认。"],
        ].map(([t, d]) => (
          <div key={t} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <div className="text-[13px] font-medium">{t}</div>
            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
