import { useEffect, useState } from "react";
import { Showcase, SectionHeader } from "../components/Showcase";
import { Button, Icon, Avatar, inputCls } from "../components/primitives";
import { cn } from "../utils/cn";

/* ---------------- Demos ---------------- */

function ButtonsDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button>主要按钮</Button>
        <Button variant="secondary">次要</Button>
        <Button variant="outline">描边</Button>
        <Button variant="ghost">幽灵</Button>
        <Button variant="danger">危险</Button>
        <Button variant="link">链接按钮</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="xs">XS</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="添加">
          <Icon.Plus />
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          {loading ? "保存中…" : "点击加载"}
        </Button>
        <Button disabled>禁用</Button>
        <Button variant="outline">
          <Icon.Mail /> 带图标
        </Button>
        <Button variant="secondary">
          继续 <Icon.Arrow />
        </Button>
        <div className="inline-flex overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700">
          {["日", "周", "月"].map((t, i) => (
            <button key={t} className={cn("h-9 px-4 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800", i > 0 && "border-l border-zinc-300 dark:border-zinc-700")}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SegmentedDemo() {
  const opts = ["列表", "看板", "日历", "时间线"];
  const [i, setI] = useState(0);
  return (
    <div className="relative inline-flex w-full max-w-xs rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
      <span
        className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] dark:bg-zinc-950"
        style={{ left: `calc(4px + ${i} * (100% - 8px) / ${opts.length})`, width: `calc((100% - 8px) / ${opts.length})` }}
      />
      {opts.map((o, idx) => (
        <button key={o} onClick={() => setI(idx)} className={cn("relative z-10 min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-sm transition-colors", i === idx ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200")}>
          {o}
        </button>
      ))}
    </div>
  );
}

function BadgeDemo() {
  const [tags, setTags] = useState(["React", "TypeScript", "Tailwind", "Vite"]);
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-900">默认</span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">次要</span>
        <span className="rounded-full border border-zinc-300 px-2.5 py-0.5 text-xs font-medium dark:border-zinc-700">描边</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          在线
        </span>
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">待审核</span>
        <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">已过期</span>
        <span className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">v2.4.0</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white py-1 pl-2.5 pr-1 text-xs dark:border-zinc-700 dark:bg-zinc-900">
            {t}
        <button
          onClick={() => setTags(tags.filter((x) => x !== t))}
          className="relative rounded p-0.5 text-zinc-400 after:absolute after:-inset-1.5 after:content-[''] hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label={`移除 ${t}`}
        >
              <Icon.X size={12} />
            </button>
          </span>
        ))}
        {tags.length < 4 && (
          <button onClick={() => setTags(["React", "TypeScript", "Tailwind", "Vite"])} className="text-xs text-zinc-500 underline underline-offset-2">
            重置
          </button>
        )}
      </div>
      <div className="flex items-center gap-6">
        <span className="relative inline-flex">
          <Button variant="outline" size="icon" aria-label="通知">
            <Icon.Bell />
          </Button>
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-zinc-950">3</span>
        </span>
        <span className="relative inline-flex">
          <Button variant="outline" size="icon" aria-label="消息">
            <Icon.Mail />
          </Button>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-zinc-950" />
        </span>
      </div>
    </div>
  );
}

function AvatarDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-4">
        <Avatar name="Li Hua" size={24} />
        <Avatar name="Wang Fang" size={32} />
        <Avatar name="Zhang Wei" size={40} />
        <Avatar name="Chen Jing" size={56} />
        <span className="relative">
          <Avatar name="Liu Yang" size={40} />
          <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
        </span>
      </div>
      <div className="flex items-center">
        <div className="flex -space-x-2.5">
          {["Ava Lin", "Bo Xu", "Cai Ye", "Du Fan"].map((n) => (
            <Avatar key={n} name={n} size={36} />
          ))}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium ring-2 ring-white dark:bg-zinc-800 dark:ring-zinc-950">+12</span>
        </div>
        <span className="ml-3 text-sm text-zinc-500">16 人参与</span>
      </div>
    </div>
  );
}

function TooltipDemo() {
  const pos = { top: "bottom-full left-1/2 -translate-x-1/2 mb-2", bottom: "top-full left-1/2 -translate-x-1/2 mt-2", left: "right-full top-1/2 -translate-y-1/2 mr-2", right: "left-full top-1/2 -translate-y-1/2 ml-2" };
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(Object.keys(pos) as (keyof typeof pos)[]).map((p) => (
        <span key={p} className="group relative">
          <Button variant="outline" size="sm">
            {p}
          </Button>
          <span role="tooltip" className={cn("pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 shadow transition-all duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-white dark:text-zinc-900", pos[p], p === "top" && "translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0", p === "bottom" && "-translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0")}>
            提示信息 · {p}
          </span>
        </span>
      ))}
    </div>
  );
}

function TagInputDemo() {
  const [tags, setTags] = useState(["React", "Tailwind"]);
  const [v, setV] = useState("");
  const add = () => {
    const t = v.trim();
    if (t && !tags.includes(t) && tags.length < 6) setTags([...tags, t]);
    setV("");
  };
  return (
    <div className="w-full max-w-sm">
      <div className="flex w-full flex-wrap items-center gap-1.5 rounded-lg border border-zinc-300 bg-white p-2 text-sm transition focus-within:border-zinc-900 focus-within:ring-4 focus-within:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-white dark:focus-within:ring-white/10">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-md bg-zinc-100 py-0.5 pl-2 pr-1 text-xs dark:bg-zinc-800">
            {t}
            <button onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`移除 ${t}`} className="relative rounded p-0.5 text-zinc-400 after:absolute after:-inset-1 after:content-[''] hover:text-zinc-900 dark:hover:text-white">
              <Icon.X size={11} />
            </button>
          </span>
        ))}
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
            if (e.key === "Backspace" && !v && tags.length) setTags(tags.slice(0, -1));
          }}
          onBlur={add}
          placeholder={tags.length ? "" : "输入后回车添加"}
          className="h-6 min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
      </div>
      <p className="mt-2 text-xs text-zinc-400">回车添加 · Backspace 删除最后一个 · 去重且最多 6 个</p>
    </div>
  );
}

function NumberInputDemo() {
  const [v, setV] = useState(1);
  const min = 1, max = 9;
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const btn = "grid h-9 w-9 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-zinc-800";
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700">
        <button className={btn} disabled={v <= min} onClick={() => setV(clamp(v - 1))} aria-label="减少">
          <Icon.Minus />
        </button>
        <input
          value={v}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!Number.isNaN(n)) setV(clamp(n));
          }}
          className="h-9 w-12 border-x border-zinc-300 bg-transparent text-center font-mono text-sm tabular-nums outline-none dark:border-zinc-700"
          aria-label="数量"
        />
        <button className={btn} disabled={v >= max} onClick={() => setV(clamp(v + 1))} aria-label="增加">
          <Icon.Plus />
        </button>
      </div>
      <p className="text-xs text-zinc-400">范围 {min}–{max}，到达边界自动禁用对应按钮</p>
    </div>
  );
}

function CountdownButtonDemo() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <input className={cn(inputCls, "w-40")} placeholder="手机号" aria-label="手机号" />
        <Button variant="outline" disabled={left > 0} onClick={() => setLeft(60)} className="w-28 shrink-0 tabular-nums">
          {left > 0 ? `${left}s 后重发` : "获取验证码"}
        </Button>
      </div>
      <p className="text-xs text-zinc-400">{left > 0 ? `已发送，${left}s 内不能重复获取` : "点击按钮开始 60s 倒计时"}</p>
    </div>
  );
}

/* ---------------- Section ---------------- */

export default function General() {
  return (
    <section>
      <SectionHeader
        id="general"
        index="02"
        title="基础组件"
        en="Basic Components"
        intro="按钮、徽章、头像、工具提示——这些不依赖表单状态的元素构成了界面的词汇表。它们的特点是「小而常用」：一个页面会出现十几次，所以每一个像素的一致性都会被放大。这里的关键是同一套尺寸表：高度 32 / 36 / 44、圆角 6 / 12 / 16、图标 16 / 20 / 24。每个组件都提供多个变体与尺寸档位，可按场景自由组合，而不必为特例新造组件。"
        icon={<Icon.Grid />}
      />

      <Showcase
        id="button"
        title="按钮"
        en="Button"
        description="按钮是界面中最核心的交互元素。一套完整的按钮体系包括：6 种变体（主要、次要、描边、幽灵、危险、链接）、4 种尺寸、图标按钮、加载态、禁用态、按钮组。一个页面里主要按钮只出现一次。"
        usage={["主要：页面的唯一主动作（保存、提交、下一步）。", "次要 / 描边：并列的备选操作（取消、返回）。", "幽灵：工具栏、卡片内的低优先级操作。", "危险：不可逆操作（删除、清空），配合二次确认。"]}
        points={[
          "使用 variant × size 两个维度组合 class，用 cva 或 cn() 管理。",
          "加载态：禁用点击 + 显示 spinner，保持宽度不跳动（可用 min-w 或用 spinner 替换图标位）。",
          "图标与文字间距 8px，图标大小 = 字号（16px 配 14px 文字略大一点）。",
          "active:scale-[0.98] 提供轻微的按下反馈。",
          "按钮组：相邻按钮共享边框，用 divide-x 或 border-l。",
        ]}
        a11y={["图标按钮必须有 aria-label。", "加载中设置 aria-busy=\"true\"。", "不要用 div 模拟按钮，原生 <button> 天然支持键盘与焦点。"]}
        code={`const variants = {
  primary:   "bg-zinc-900 text-white hover:bg-zinc-800",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  outline:   "border border-zinc-300 hover:bg-zinc-50",
  ghost:     "hover:bg-zinc-100",
  danger:    "bg-red-600 text-white hover:bg-red-700",
  link:      "underline-offset-4 hover:underline px-0",
};
const sizes = { sm: "h-8 px-3 text-sm", md: "h-9 px-4 text-sm", lg: "h-11 px-6", icon: "h-9 w-9" };

export function Button({ variant = "primary", size = "md", loading, className, children, ...rest }) {
  return (
    <button
      disabled={loading || rest.disabled}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all",
        "focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 active:scale-[0.98]",
        variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading && <Spinner className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}`}
      >
        <ButtonsDemo />
      </Showcase>

      <Showcase
        id="segmented"
        title="分段控制器"
        en="Segmented Control"
        level="进阶"
        description="iOS 风格的分段选择器，选中的白色滑块在灰色轨道内平滑滑动。本质是一组 Radio，视觉上比 Tabs 更紧凑，适合 2–5 个视图切换。"
        usage={["视图模式切换（列表 / 网格）、时间粒度（日 / 周 / 月）。", "作为表单里的小型单选。"]}
        points={[
          "滑块是一个绝对定位的 span，left 和 width 由 index / count 计算，transition-all 产生滑动效果。",
          "按钮 z-10 位于滑块之上；选中态只改文字颜色。",
          "所有分段等宽（w-20 或 flex-1），否则需要用 ref 测量每段实际宽度。",
          "缓动用 cubic-bezier(0.32,0.72,0,1) 带一点弹性。",
        ]}
        code={`<div className="relative inline-flex w-full max-w-xs rounded-lg bg-zinc-100 p-1">
  {/* 指示器与按钮都以「容器宽度 - 8px 内边距」为基准计算，才能对齐 */}
  <span className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm transition-all duration-300"
    style={{ left: \`calc(4px + \${i} * (100% - 8px) / \${n})\`, width: \`calc((100% - 8px) / \${n})\` }} />
  {opts.map((o, idx) => (
    <button key={o} onClick={() => setI(idx)}
      className={cn("relative z-10 flex-1 py-1.5 text-sm", i === idx ? "text-zinc-900" : "text-zinc-500")}>
      {o}
    </button>
  ))}
</div>`}
      >
        <SegmentedDemo />
      </Showcase>

      <Showcase
        id="badge"
        title="徽章 · 标签 · 角标"
        en="Badge · Tag · Chip"
        description="徽章用于状态说明（只读），标签 / Chip 用于分类且通常可移除，角标（Notification Badge）叠在图标上显示数量。极简风格里状态色用「浅底深字」的低饱和组合。"
        usage={["状态：已发布 / 草稿 / 已归档。", "分类：文章标签、筛选条件。", "数量：未读消息、购物车。", "版本号、快捷键用等宽字体的方形徽章。"]}
        points={[
          "圆角：状态徽章 rounded-full；可移除标签 rounded-md（更像“对象”）。",
          "带脉冲点的“在线”徽章：两个圆叠加，外圆 animate-ping。",
          "角标定位：absolute -top-1 -right-1 + ring-2 ring-white 与背景分离。",
          "数量超过 99 显示 99+。",
        ]}
        code={`// 脉冲状态点
<span className="relative flex h-1.5 w-1.5">
  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
</span>

// 角标
<span className="relative">
  <BellIcon />
  <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center
    rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white ring-2 ring-white">3</span>
</span>`}
      >
        <BadgeDemo />
      </Showcase>

      <Showcase
        id="avatar"
        title="头像 · 头像组"
        en="Avatar · Avatar Group"
        description="头像有图片、首字母、图标三种回退形式。头像组用负间距重叠并用 ring 分隔，超出数量显示 +N。"
        usage={["用户信息、评论列表、协作者展示。", "状态点表示在线 / 离开。"]}
        points={["首字母回退：取名字每个单词首字母，最多 2 个。", "尺寸按 24 / 32 / 40 / 56 递增，字号 = size × 0.36。", "头像组：-space-x-2.5 + ring-2 ring-white（深色模式 ring-zinc-950）。", "图片加载失败时 onError 切换到首字母。"]}
        code={`<div className="flex -space-x-2.5">
  {users.map(u => (
    <img key={u.id} src={u.avatar} alt={u.name}
      className="h-9 w-9 rounded-full ring-2 ring-white object-cover" />
  ))}
  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs ring-2 ring-white">+12</span>
</div>`}
      >
        <AvatarDemo />
      </Showcase>

      <Showcase
        id="tooltip"
        title="工具提示"
        en="Tooltip"
        description="悬停或聚焦时出现的简短说明。四个方向定位，延迟 300ms 出现避免闪烁，退出即刻消失。复杂定位（自动翻转、避让视口）用 Floating UI。"
        usage={["解释图标按钮的含义。", "显示被截断的完整文字。", "不要放交互内容，那是 Popover 的职责。"]}
        points={["纯 CSS：group + group-hover:opacity-100 + 位移过渡。", "位置：bottom-full + left-1/2 -translate-x-1/2 + mb-2。", "生产环境使用 @floating-ui/react 处理边界碰撞和箭头。", "延迟：transition-delay: 300ms 只加在出现时。"]}
        a11y={["触发元素加 aria-describedby 指向 tooltip；tooltip 用 role=\"tooltip\"。", "键盘 focus 也要能触发（group-focus-within）。"]}
        code={`<span className="group relative">
  <button>Hover me</button>
  <span role="tooltip"
    className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1
               whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-white opacity-0
               transition-all group-hover:translate-y-0 group-hover:opacity-100
               group-focus-within:opacity-100">
    提示
  </span>
</span>`}
      >
        <TooltipDemo />
      </Showcase>

      <Showcase
        id="tag-input"
        title="标签输入"
        en="Tag Input"
        level="进阶"
        description="在输入框内直接生成可删除的标签（Chip）：回车添加、Backspace 删除最后一个、点 × 移除。常用于收件人、分类、技能标签。"
        usage={["邮件收件人、文章标签、筛选条件输入。"]}
        points={["输入框和标签放在同一个 flex-wrap 容器里，容器承担边框和 focus 环。", "回车添加：去重 + 上限校验后追加并清空输入。", "输入为空时按 Backspace 删除最后一个标签，是键盘用户的习惯路径。", "标签删除按钮用 after 扩大命中区（见「徽章 · 标签」一章）。"]}
        a11y={["容器加 role=\"list\"，每个标签 role=\"listitem\"；删除按钮有独立的 aria-label。", "复杂的自动补全场景请用 react-select / cmdk。"]}
        code={`const add = () => {
  const t = v.trim();
  if (t && !tags.includes(t) && tags.length < 6) setTags([...tags, t]);
  setV("");
};

<input value={v} onChange={(e) => setV(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && !v && tags.length) setTags(tags.slice(0, -1));
  }}
  className="h-6 min-w-24 flex-1 bg-transparent outline-none" />`}
      >
        <TagInputDemo />
      </Showcase>

      <Showcase
        id="number-input"
        title="数字步进器"
        en="Number Input"
        level="进阶"
        description="增减按钮 + 可直接输入的组合。边界处自动禁用对应按钮，输入非法内容时收敛到合法范围。"
        usage={["购买数量、乘客人数、页码跳转。", "范围小且需要精细调整的数值。"]}
        points={["用 clamp 统一收敛：Math.max(min, Math.min(max, n))。", "到达边界 disabled 对应按钮，而不是点了没反应。", "数字用 font-mono + tabular-nums 防止宽度跳动。", "生产环境可加长按连续增减（pointerdown + interval）。"]}
        a11y={["按钮加 aria-label（减少 / 增加）；输入框 aria-label 或关联 label。", "也可以用原生 input[type=number] 换取自带键盘。"]}
        code={`const clamp = (n) => Math.max(min, Math.min(max, n));

<div className="flex items-center rounded-lg border">
  <button disabled={v <= min} onClick={() => setV(clamp(v - 1))} aria-label="减少"><Minus /></button>
  <input value={v} onChange={(e) => setV(clamp(parseInt(e.target.value, 10) || min))}
    className="h-9 w-12 border-x text-center font-mono tabular-nums outline-none" aria-label="数量" />
  <button disabled={v >= max} onClick={() => setV(clamp(v + 1))} aria-label="增加"><Plus /></button>
</div>`}
      >
        <NumberInputDemo />
      </Showcase>

      <Showcase
        id="countdown-button"
        title="倒计时按钮"
        en="Countdown Button"
        level="进阶"
        description="发送验证码场景的防重复点击按钮：点击后进入 60s 倒计时，期间禁用并显示剩余秒数，归零后自动恢复。"
        usage={["短信 / 邮箱验证码、重新发送、限时操作。"]}
        points={["单个 state（剩余秒数）驱动一切：useEffect 依赖 [left]，每秒 setTimeout 减一，归零时 effect 不再续期。", "disabled={left > 0}，文案从「获取验证码」切换为「59s 后重发」。", "剩余秒数用 tabular-nums，数字变化时按钮宽度不抖。", "组件卸载时 setTimeout 由 cleanup 清理。"]}
        a11y={["倒计时期间按钮 disabled，读屏软件聚焦时能听到禁用状态；可用 aria-live=\"polite\" 播报剩余时间。"]}
        code={`const [left, setLeft] = useState(0);
useEffect(() => {
  if (left <= 0) return;
  const t = setTimeout(() => setLeft((s) => s - 1), 1000);
  return () => clearTimeout(t);
}, [left]);

<Button disabled={left > 0} onClick={() => setLeft(60)} className="tabular-nums">
  {left > 0 ? \`\${left}s 后重发\` : "获取验证码"}
</Button>`}
      >
        <CountdownButtonDemo />
      </Showcase>
    </section>
  );
}
