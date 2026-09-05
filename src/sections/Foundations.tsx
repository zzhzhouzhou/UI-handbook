import { Showcase, SectionHeader } from "../components/Showcase";
import { Icon } from "../components/primitives";
import { cn } from "../utils/cn";

const grays = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const grayCls: Record<string, string> = {
  "50": "bg-zinc-50", "100": "bg-zinc-100", "200": "bg-zinc-200", "300": "bg-zinc-300", "400": "bg-zinc-400",
  "500": "bg-zinc-500", "600": "bg-zinc-600", "700": "bg-zinc-700", "800": "bg-zinc-800", "900": "bg-zinc-900", "950": "bg-zinc-950",
};

export default function Foundations() {
  return (
    <section>
      <SectionHeader
        id="foundations"
        index="01"
        title="设计基础"
        en="Foundations"
        intro="组件只是表象，真正决定一套界面是否“高级”的是底层的设计令牌（Design Tokens）：色彩、字体、间距、圆角、阴影与动效曲线。先把这些统一，后面所有组件都会自然地协调一致。极简风格的核心是：用一套中性灰 + 一个强调色，用层级和留白来表达结构，而不是靠颜色和装饰。"
        icon={<Icon.Layers />}
      />

      <Showcase
        id="color"
        title="色彩系统"
        en="Color System"
        description="极简界面通常只需要三类颜色：中性灰阶（承担 90% 的界面）、一个品牌/强调色（只用于最重要的动作）、语义色（成功 / 警告 / 危险 / 信息）。灰阶建议 11 级，从 50 到 950，深色模式直接反转层级即可。"
        usage={[
          "文字：主文字用 900，次要 500–600，占位符 400，禁用 300。",
          "背景：页面 white / 950，卡片 white / 900，悬浮层 white / 900 + 边框。",
          "边框：200（浅色）/ 800（深色）。分割线比边框再淡一级。",
          "强调色只用在主按钮、链接、焦点环、选中态——出现越少越有力量。",
        ]}
        points={[
          "用 CSS 变量定义语义色（--bg、--fg、--muted、--border、--accent），而不是直接写色值，深色模式只需要替换变量。",
          "确保对比度：正文 ≥ 4.5:1，大字与图标 ≥ 3:1（WCAG AA）。",
          "语义色要成对出现：背景（浅）+ 前景（深），如 red-50 + red-700。",
          "避免纯黑 #000 做大面积背景，用 zinc-950 更柔和；避免纯灰文字放在彩色背景上。",
        ]}
        pitfalls={["同一个界面使用超过 2 个饱和色。", "把强调色用在次要按钮上，导致主次不分。", "深色模式只是简单反色，没有调整阴影和边框亮度。"]}
        code={`:root {
  --bg: #ffffff;        --fg: #18181b;
  --muted: #71717a;     --border: #e4e4e7;
  --card: #ffffff;      --accent: #18181b;
  --danger: #dc2626;    --success: #16a34a;
}
.dark {
  --bg: #09090b;        --fg: #fafafa;
  --muted: #a1a1aa;     --border: #27272a;
  --card: #18181b;      --accent: #fafafa;
}
/* 使用 */
.card { background: var(--card); color: var(--fg); border: 1px solid var(--border); }`}
        codeLang="css"
        dotted={false}
      >
        <div className="w-full max-w-2xl space-y-6">
          <div>
            <div className="mb-2 text-xs font-medium text-zinc-500">中性灰阶 Zinc</div>
            <div className="flex overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
              {grays.map((g) => (
                <div key={g} className={cn("flex h-14 flex-1 items-end justify-center pb-1 font-mono text-[10px]", grayCls[g], Number(g) >= 500 ? "text-white/70" : "text-zinc-600")}>
                  {g}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["信息", "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900"],
              ["成功", "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"],
              ["警告", "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"],
              ["危险", "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"],
            ].map(([n, c]) => (
              <div key={n} className={cn("rounded-lg border px-3 py-3 text-center text-sm font-medium", c)}>
                {n}
              </div>
            ))}
          </div>
        </div>
      </Showcase>

      <Showcase
        id="typography"
        title="排版层级"
        en="Typography"
        description="排版是极简风格里最重要的表达手段。用 5–6 级字号、2–3 种字重和明确的行高建立层级，标题收紧字距（tracking-tight），正文保持 1.6–1.75 的行高，数字使用等宽数字（tabular-nums）对齐。"
        usage={["Display（48–72px）用于落地页主标题。", "H1–H3 用于页面 / 区块 / 卡片标题。", "Body 15–16px，Small 13–14px，Caption 12px 用于辅助信息。"]}
        points={[
          "字号采用倍率比例（如 1.25 Major Third）：12 / 14 / 16 / 20 / 24 / 32 / 40 / 48。",
          "大标题 letter-spacing -0.02em ~ -0.04em；小字 caption 可以 +0.02em 并加大写。",
          "一行正文控制在 60–75 个字符（max-w-prose）。",
          "中文字体回退链：Inter / system-ui → PingFang SC → Microsoft YaHei。",
          "数字 / 表格用 font-variant-numeric: tabular-nums 防止跳动。",
        ]}
        code={`/* Tailwind 4: 在 @theme 中定义字体 */
@theme {
  --font-sans: "Inter", "PingFang SC", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

<h1 class="text-4xl font-semibold tracking-tight">页面标题</h1>
<p class="text-[15px] leading-7 text-zinc-600 max-w-prose">正文…</p>
<span class="text-xs uppercase tracking-wider text-zinc-400">CAPTION</span>
<td class="tabular-nums">1,234.00</td>`}
        codeLang="html"
        dotted={false}
      >
        <div className="w-full max-w-xl space-y-4">
          {[
            ["Display", "text-4xl sm:text-5xl font-semibold tracking-tighter", "设计即秩序"],
            ["H1 / 32", "text-3xl font-semibold tracking-tight", "构建清晰的视觉层级"],
            ["H2 / 24", "text-2xl font-semibold tracking-tight", "构建清晰的视觉层级"],
            ["H3 / 20", "text-xl font-medium", "构建清晰的视觉层级"],
            ["Body / 15", "text-[15px] leading-7 text-zinc-600 dark:text-zinc-400", "好的排版让用户意识不到排版的存在，只是觉得读起来很顺畅。"],
            ["Caption / 12", "text-xs uppercase tracking-wider text-zinc-400", "Updated 2 hours ago"],
          ].map(([l, c, t]) => (
            <div key={l} className="flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="w-24 shrink-0 font-mono text-[11px] text-zinc-400">{l}</span>
              <span className={c}>{t}</span>
            </div>
          ))}
        </div>
      </Showcase>

      <Showcase
        id="spacing"
        title="间距与栅格"
        en="Spacing & Grid"
        description="使用 4px 基准的间距刻度（4 / 8 / 12 / 16 / 24 / 32 / 48 / 64），所有 padding、gap、margin 只从这个刻度里取值。间距的“亲密性”传达关系：相关元素靠近、无关元素拉远。"
        usage={["组件内部：4–12px。", "组件之间：16–24px。", "区块之间：48–96px。", "页面容器：max-w-6xl + px-6，12 列栅格。"]}
        points={[
          "优先使用 gap（flex / grid）而非 margin，避免外边距折叠和最后一个元素的多余间距。",
          "用 space-y-* 处理垂直堆叠的文本流。",
          "响应式栅格：移动端 1 列 → 平板 2 列 → 桌面 3–4 列，用 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] 可以自动适配。",
          "留白是极简风格的骨架，宁多勿少。",
        ]}
        code={`<div class="grid gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
  <Card /> <Card /> <Card />
</div>

<!-- 容器 -->
<main class="mx-auto max-w-6xl px-6 py-16"> … </main>`}
        codeLang="html"
        dotted={false}
      >
        <div className="w-full max-w-xl">
          <div className="flex items-end gap-3">
            {[4, 8, 12, 16, 24, 32, 48, 64].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className="bg-zinc-900 dark:bg-zinc-100" style={{ width: s, height: s }} />
                <span className="font-mono text-[10px] text-zinc-400">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-12 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        </div>
      </Showcase>

      <Showcase
        id="elevation"
        title="圆角、阴影与层级"
        en="Radius · Shadow · Elevation"
        description="极简风格里阴影应当“几乎看不见”：低海拔用 1px 边框 + 极淡阴影，高海拔（弹窗、菜单）用多层叠加的柔和阴影。圆角要有体系：小元素 6px、卡片 12px、弹窗 16px，嵌套元素内圆角 = 外圆角 − 内边距。"
        usage={["卡片：border + shadow-sm。", "下拉菜单 / Popover：shadow-lg + border。", "Modal：shadow-2xl + 遮罩。", "按下态：去掉阴影或缩小 scale。"]}
        points={[
          "阴影颜色不要用纯黑，用 rgb(0 0 0 / 0.06 ~ 0.12)。深色模式阴影几乎不可见，改用更亮的边框表示层级。",
          "多层阴影公式：0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.08)。",
          "嵌套圆角：外层 rounded-2xl(16) + p-2(8) → 内层 rounded-lg(8)。",
          "同一界面圆角不超过 3 种。",
        ]}
        code={`/* 多层柔和阴影 */
.elevation-2 {
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.04),
    0 4px 12px rgb(0 0 0 / 0.06),
    0 12px 32px rgb(0 0 0 / 0.08);
}
/* 深色模式用边框表达层级 */
.dark .elevation-2 { box-shadow: none; border: 1px solid rgb(255 255 255 / 0.1); }`}
        codeLang="css"
        dotted={false}
      >
        <div className="grid w-full max-w-xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {[
            ["Flat", "border border-zinc-200 dark:border-zinc-800"],
            ["Raised", "border border-zinc-200 shadow-sm dark:border-zinc-800"],
            ["Floating", "border border-zinc-200 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_4px_12px_rgb(0_0_0/0.06),0_12px_32px_rgb(0_0_0/0.08)] dark:border-zinc-700"],
            ["Overlay", "border border-zinc-200 shadow-2xl dark:border-zinc-700"],
          ].map(([n, c]) => (
            <div key={n} className="flex flex-col items-center gap-3">
              <div className={cn("h-20 w-full rounded-xl bg-white p-2 dark:bg-zinc-900", c)}>
                <div className="h-full w-full rounded-md bg-zinc-100 dark:bg-zinc-800" />
              </div>
              <span className="text-xs text-zinc-500">{n}</span>
            </div>
          ))}
        </div>
      </Showcase>

      <Showcase
        id="motion-tokens"
        title="动效令牌"
        en="Motion Tokens"
        description="动效要有统一的时长和缓动：微交互 150ms、进入 200–300ms、退出比进入快 20%、大型页面转场 400–500ms。缓动曲线用 ease-out 进入、ease-in 退出，弹性用 cubic-bezier(0.32, 0.72, 0, 1)。"
        usage={["hover / 颜色变化：150ms ease。", "弹窗 / 菜单出现：200ms ease-out + scale 0.96→1。", "抽屉 / 底部面板：300ms cubic-bezier(0.32,0.72,0,1)。"]}
        points={[
          "只对 transform 和 opacity 做动画，它们不会触发重排，GPU 加速。",
          "尊重 prefers-reduced-motion，减少或关闭动画。",
          "动画要有“物理感”：进入从下向上 8–12px + 淡入；退出反向且更快。",
          "列表出现使用 stagger（每项延迟 30–50ms）。",
        ]}
        code={`@theme {
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
}
.enter { animation: fadeUp 240ms var(--ease-spring) both; }
.list > * { animation: fadeUp 300ms ease-out both; }
.list > :nth-child(2) { animation-delay: 40ms; }
.list > :nth-child(3) { animation-delay: 80ms; }

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}`}
        codeLang="css"
        dotted={false}
      >
        <div className="grid w-full max-w-xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {[
            ["linear", "linear"],
            ["ease-out", "ease-out"],
            ["ease-in-out", "ease-in-out"],
            ["spring", "cubic-bezier(0.32,0.72,0,1)"],
          ].map(([n, e]) => (
            <div key={n} className="group flex flex-col items-center gap-3">
              <div className="h-24 w-full rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
                <div
                  className="h-4 w-4 rounded-full bg-zinc-900 transition-transform duration-700 group-hover:translate-y-16 group-active:translate-y-16 dark:bg-zinc-100"
                  style={{ transitionTimingFunction: e }}
                />
              </div>
              <span className="font-mono text-[11px] text-zinc-500">{n}</span>
            </div>
          ))}
          <p className="col-span-2 text-center text-xs text-zinc-400 sm:col-span-4">悬停或点按上方，对比四种缓动曲线</p>
        </div>
      </Showcase>

      <Showcase
        id="states"
        title="交互状态"
        en="Interactive States"
        description="每一个可交互元素至少要设计 6 种状态：默认、悬停、按下、聚焦（键盘）、禁用、加载。状态之间的差异要“可感知但不突兀”。"
        usage={["hover：背景加深一级或出现边框。", "active：scale(0.98) 或背景再加深一级。", "focus-visible：2px 焦点环 + 2px 偏移，只在键盘导航时显示。", "disabled：opacity 50% + cursor-not-allowed。"]}
        points={[
          "使用 :focus-visible 而不是 :focus，避免鼠标点击时出现焦点环。",
          "选中态（selected / checked）用强调色填充，而不是只改边框。",
          "hover 状态只在支持 hover 的设备生效：@media (hover: hover)。",
          "加载态应保持按钮宽度不变，避免布局抖动。",
        ]}
        code={`<button class="
  bg-zinc-900 text-white
  hover:bg-zinc-800
  active:scale-[0.98]
  focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none
  transition-all duration-150
">保存</button>`}
        codeLang="html"
        dotted={false}
      >
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {[
            ["Default", "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"],
            ["Hover", "bg-zinc-700 text-white dark:bg-zinc-300 dark:text-zinc-900"],
            ["Active", "bg-zinc-950 text-white scale-[0.96] dark:bg-zinc-400 dark:text-zinc-900"],
            ["Focus", "bg-zinc-900 text-white ring-2 ring-zinc-900 ring-offset-2 dark:bg-white dark:text-zinc-900 dark:ring-white dark:ring-offset-zinc-950"],
            ["Disabled", "bg-zinc-900 text-white opacity-40 dark:bg-white dark:text-zinc-900"],
            ["Loading", "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"],
          ].map(([n, c]) => (
            <div key={n} className="flex flex-col items-center gap-2">
              <div className={cn("inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium", c)}>
                {n === "Loading" && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                按钮
              </div>
              <span className="text-[11px] text-zinc-500">{n}</span>
            </div>
          ))}
        </div>
      </Showcase>
    </section>
  );
}
