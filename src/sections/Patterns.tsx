import { useState } from "react";
import { Showcase, SectionHeader } from "../components/Showcase";
import { Button, Icon, inputCls, Label } from "../components/primitives";
import { cn } from "../utils/cn";

function LayoutDemo() {
  const [l, setL] = useState<"holy" | "center" | "split" | "dash">("dash");
  const box = "rounded-md bg-zinc-200 dark:bg-zinc-800";
  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex justify-center gap-1 rounded-lg bg-zinc-100 p-1 text-xs dark:bg-zinc-800">
        {(
          [
            ["dash", "后台"],
            ["holy", "圣杯"],
            ["center", "居中"],
            ["split", "分屏"],
          ] as const
        ).map(([k, t]) => (
          <button key={k} onClick={() => setL(k)} className={cn("rounded-md px-3 py-1", l === k ? "bg-white shadow-sm dark:bg-zinc-950" : "text-zinc-500")}>
            {t}
          </button>
        ))}
      </div>
      <div className="h-56 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
        {l === "dash" && (
          <div className="flex h-full gap-2">
            <div className={cn(box, "w-14")} />
            <div className="flex flex-1 flex-col gap-2">
              <div className={cn(box, "h-8")} />
              <div className="grid flex-1 grid-cols-3 gap-2">
                <div className={box} />
                <div className={box} />
                <div className={box} />
                <div className={cn(box, "col-span-3")} />
              </div>
            </div>
          </div>
        )}
        {l === "holy" && (
          <div className="flex h-full flex-col gap-2">
            <div className={cn(box, "h-8")} />
            <div className="flex flex-1 gap-2">
              <div className={cn(box, "w-16")} />
              <div className={cn(box, "flex-1")} />
              <div className={cn(box, "w-16")} />
            </div>
            <div className={cn(box, "h-8")} />
          </div>
        )}
        {l === "center" && (
          <div className="flex h-full flex-col gap-2">
            <div className={cn(box, "h-8")} />
            <div className="flex flex-1 justify-center">
              <div className={cn(box, "w-2/3")} />
            </div>
            <div className={cn(box, "h-8")} />
          </div>
        )}
        {l === "split" && (
          <div className="flex h-full gap-2">
            <div className={cn(box, "flex-1")} />
            <div className="flex flex-1 items-center justify-center">
              <div className={cn(box, "h-2/3 w-2/3")} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormUxDemo() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [touched, setTouched] = useState(false);
  const [pwdTouched, setPwdTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const strength = [pwd.length >= 8, /[A-Z]/.test(pwd), /\d/.test(pwd), /[^A-Za-z0-9]/.test(pwd)].filter(Boolean).length;
  const pwdError = (touched || pwdTouched) && strength < 3;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        setPwdTouched(true);
        if (emailOk && strength >= 3) setSent(true);
      }}
      className="w-full max-w-sm space-y-4"
    >
      <div>
        <Label htmlFor="fe">邮箱</Label>
        <input id="fe" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={touched && !emailOk} className={cn(inputCls, touched && !emailOk && "border-red-500")} placeholder="you@example.com" />
        {touched && !emailOk && <p role="alert" className="mt-1.5 text-xs text-red-600">请输入有效邮箱地址</p>}
      </div>
      <div>
        <Label htmlFor="fp">密码</Label>
        <input id="fp" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} onBlur={() => setPwdTouched(true)} aria-invalid={pwdError} className={cn(inputCls, pwdError && "border-red-500")} placeholder="至少 8 位" />
        <div className="mt-2 flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < strength ? (strength <= 1 ? "bg-red-500" : strength <= 2 ? "bg-amber-500" : "bg-emerald-500") : "bg-zinc-200 dark:bg-zinc-800")} />
          ))}
        </div>
        <p className="mt-1.5 text-xs text-zinc-500">{["", "太弱", "一般", "较强", "很强"][strength]} · 大写字母、数字、符号可提高强度</p>
        {pwdError && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            密码强度不足：至少 8 位，并包含大写字母 / 数字 / 符号中的两类
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={sent}>
        {sent ? (
          <>
            <Icon.Check /> 已提交
          </>
        ) : (
          "创建账户"
        )}
      </Button>
    </form>
  );
}

function ResponsiveDemo() {
  const [w, setW] = useState(100);
  const cols = w < 45 ? 1 : w < 75 ? 2 : 3;
  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span>视口</span>
        <input type="range" min={30} max={100} value={w} onChange={(e) => setW(+e.target.value)} className="flex-1 accent-zinc-900" />
        <span className="w-24 font-mono">{cols === 1 ? "mobile" : cols === 2 ? "tablet" : "desktop"}</span>
      </div>
      <div className="mx-auto rounded-xl border border-zinc-200 bg-white p-3 transition-all dark:border-zinc-800 dark:bg-zinc-900" style={{ width: `${w}%` }}>
        <div className={cn("mb-3 flex items-center", cols === 1 ? "justify-between" : "gap-3")}>
          <span className="h-5 w-5 rounded bg-zinc-900 dark:bg-white" />
          {cols > 1 && <span className="h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />}
          {cols === 1 && <Icon.Menu />}
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-md bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      </div>
    </div>
  );
}

const checklist = [
  { t: "层级", items: ["页面只有一个 H1，标题层级不跳级", "主按钮每屏只出现一次", "视线流：从左上到右下，重要信息在前"] },
  { t: "一致性", items: ["同类元素同样的尺寸、圆角、间距", "图标风格统一（线性 / 面性，粗细一致）", "文案语气一致，按钮用动词"] },
  { t: "反馈", items: ["所有操作 100ms 内有视觉反馈", "异步操作有加载态与结果提示", "错误信息说明原因和解决方式"] },
  { t: "无障碍", items: ["对比度 ≥ 4.5:1，不仅靠颜色传达信息", "键盘可完成所有操作，焦点可见", "图片有 alt，图标按钮有 aria-label"] },
  { t: "响应式", items: ["320px 宽度不横向滚动", "触控目标 ≥ 44×44px", "hover 效果在触屏有替代方案"] },
  { t: "性能", items: ["动画只用 transform / opacity", "图片懒加载并指定宽高防止 CLS", "首屏无 layout shift，字体使用 font-display: swap"] },
];

function ChecklistDemo() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const total = checklist.reduce((a, c) => a + c.items.length, 0);
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-medium">设计走查清单</span>
        <span className="font-mono text-xs text-zinc-500">
          {done.size}/{total}
        </span>
      </div>
      <div className="mb-5 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className="h-full rounded-full bg-zinc-900 transition-all dark:bg-white" style={{ width: `${(done.size / total) * 100}%` }} />
      </div>
      <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
        {checklist.map((g) => (
          <div key={g.t}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">{g.t}</div>
            <ul className="space-y-1.5">
              {g.items.map((it) => {
                const on = done.has(it);
                return (
                  <li key={it}>
                    {/* 整行是一个 role=checkbox 的按钮：点击区域大、键盘可操作；不要把 button 嵌进 label */}
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => {
                        const s = new Set(done);
                        on ? s.delete(it) : s.add(it);
                        setDone(s);
                      }}
                      className="flex w-full cursor-pointer items-start gap-2.5 rounded-md py-1 text-left text-sm focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950"
                    >
                      <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors", on ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900" : "border-zinc-300 dark:border-zinc-600")}>
                        {on && <Icon.Check size={11} strokeWidth={3} />}
                      </span>
                      <span className={cn("leading-5 transition-colors", on && "text-zinc-400 line-through")}>{it}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Patterns() {
  return (
    <section>
      <SectionHeader
        id="patterns"
        index="08"
        title="模式与原则"
        en="Patterns & Principles"
        intro="组件是词汇，模式是语法。这一章讲如何把组件组合成好用的页面：布局骨架、响应式策略、表单体验、深色模式方法论，以及一份可以直接拿去走查的设计清单。"
        icon={<Icon.Layout />}
      />

      <Showcase
        id="layout"
        title="页面布局骨架"
        en="Layout Patterns"
        description="四种最常见的页面骨架：后台（侧栏 + 顶栏 + 内容网格）、圣杯（头 / 左 / 中 / 右 / 尾）、居中单列（文章、设置页）、分屏（登录页、营销页）。"
        usage={["后台：管理系统、SaaS 应用。", "圣杯：门户、新闻。", "居中：阅读、表单、文档。", "分屏：登录注册、产品介绍。"]}
        points={["后台：h-screen flex；侧栏固定宽，内容 flex-1 overflow-auto。", "粘性页脚：min-h-screen flex flex-col + main flex-1。", "居中内容 max-w-2xl（阅读）/ max-w-6xl（应用）+ mx-auto px-6。", "分屏：grid lg:grid-cols-2，移动端隐藏装饰侧。"]}
        code={`// 后台骨架
<div className="flex h-screen">
  <aside className="w-56 shrink-0 border-r overflow-y-auto">…</aside>
  <div className="flex flex-1 flex-col min-w-0">
    <header className="h-14 shrink-0 border-b">…</header>
    <main className="flex-1 overflow-auto p-6">…</main>
  </div>
</div>

// 粘性页脚
<body className="min-h-screen flex flex-col">
  <main className="flex-1">…</main>
  <footer>…</footer>
</body>`}
        dotted={false}
      >
        <LayoutDemo />
      </Showcase>

      <Showcase
        id="responsive"
        title="响应式策略"
        en="Responsive Design"
        description="拖动滑块模拟视口变化：导航从完整变为汉堡，网格从 3 列变 2 列再变 1 列。移动优先（先写移动端样式，再用 md: / lg: 逐级增强）。"
        usage={["所有面向公众的界面。", "断点：sm 640 / md 768 / lg 1024 / xl 1280。"]}
        points={["容器查询（@container）让组件根据自身宽度而非视口响应——Tailwind 4 内置 @container / @md: 语法。", "流体排版：font-size: clamp(1rem, 0.9rem + 1vw, 1.25rem)。", "表格 → 移动端卡片；侧栏 → 抽屉；Modal → 全屏 / 底部面板。", "隐藏不是响应式：移动端应重新排布而不是简单 hidden。"]}
        code={`<!-- 移动优先 -->
<div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">…</div>

<!-- 容器查询 -->
<div class="@container">
  <div class="flex flex-col @md:flex-row">…</div>
</div>

/* 流体字号 */
h1 { font-size: clamp(2rem, 1.5rem + 2.5vw, 3.5rem); }`}
        codeLang="html"
        dotted={false}
      >
        <ResponsiveDemo />
      </Showcase>

      <Showcase
        id="form-ux"
        title="表单体验"
        en="Form UX"
        description="表单是转化率的关键。示例展示：失焦后才校验（不打断输入）、密码强度实时反馈、提交按钮在成功后变为已完成态。"
        usage={["注册 / 登录、结账、设置页、问卷。"]}
        points={["校验时机：blur 时校验 + 提交时全量校验；已出错的字段在输入时实时重新校验（reward early, punish late）。", "错误信息紧贴字段下方，红色 + 图标；顶部可加汇总。", "单列布局，标签在上方；相关短字段（省 / 市）可并排。", "必填不用星号标全部，改为标注「选填」。", "提交后禁用按钮防重复，成功后显示明确结果。"]}
        code={`const [touched, setTouched] = useState(false);
const valid = /^\\S+@\\S+\\.\\S+$/.test(email);

<input value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(true)}
  aria-invalid={touched && !valid}
  className={cn(inputCls, touched && !valid && "border-red-500")} />
{touched && !valid && <p role="alert" className="mt-1.5 text-xs text-red-600">请输入有效邮箱地址</p>}`}
        dotted={false}
      >
        <FormUxDemo />
      </Showcase>

      <Showcase
        id="darkmode"
        title="深色模式方法论"
        en="Dark Mode"
        description="深色模式不是反色。原则：背景不用纯黑（zinc-950）、文字不用纯白（zinc-100）、层级越高背景越亮（与浅色模式相反）、阴影几乎无效改用边框、饱和色降低亮度。"
        usage={["所有现代产品都应支持。", "跟随系统 + 手动覆盖 + 记忆选择。"]}
        points={["Tailwind 4：@custom-variant dark (&:where(.dark, .dark *)); 用 html.dark 类切换。", "初始化：读 localStorage → 否则 matchMedia('(prefers-color-scheme: dark)')；在 <head> 内联脚本执行避免闪白。", "语义 token（--bg / --fg / --border）让深色只是换一套变量。", "图片可加 dark:brightness-90；图表颜色单独定义。", "color-scheme: dark 让原生控件与滚动条也变深。"]}
        code={`<!-- index.html <head> 内联，避免闪烁 -->
<script>
  const t = localStorage.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.classList.toggle("dark", t === "dark");
</script>

/* CSS */
@custom-variant dark (&:where(.dark, .dark *));
.dark { color-scheme: dark; }`}
        codeLang="html"
        dotted={false}
      >
        <div className="grid w-full max-w-lg grid-cols-2 gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900">
            <div className="text-xs text-zinc-500">Light</div>
            <div className="mt-2 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="h-2 w-2/3 rounded bg-zinc-900" />
              <div className="mt-2 h-2 w-1/2 rounded bg-zinc-300" />
            </div>
            <div className="mt-2 rounded-lg bg-zinc-100 p-3">
              <div className="h-2 w-1/2 rounded bg-zinc-400" />
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-100">
            <div className="text-xs text-zinc-500">Dark</div>
            <div className="mt-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
              <div className="h-2 w-2/3 rounded bg-zinc-100" />
              <div className="mt-2 h-2 w-1/2 rounded bg-zinc-600" />
            </div>
            <div className="mt-2 rounded-lg bg-zinc-900 p-3">
              <div className="h-2 w-1/2 rounded bg-zinc-600" />
            </div>
          </div>
        </div>
      </Showcase>

      <Showcase
        id="checklist"
        title="设计走查清单"
        en="Design Review Checklist"
        description="发布前逐条走查。覆盖层级、一致性、反馈、无障碍、响应式与性能六个维度，勾选进度会实时更新。"
        usage={["设计评审、Code Review、上线前自检。"]}
        points={["把清单放进 PR 模板。", "每个维度至少一条硬性指标（对比度、触控尺寸、CLS）。", "定期回看线上页面，清单要随产品迭代。"]}
        dotted={false}
      >
        <ChecklistDemo />
      </Showcase>
    </section>
  );
}
