import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Showcase, SectionHeader, Highlighted } from "../components/Showcase";
import { Button, Icon, Avatar, Kbd } from "../components/primitives";
import { cn } from "../utils/cn";
import { useCopy } from "../hooks/useCopy";

function CardDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-xs text-zinc-500">基础卡片</div>
        <div className="mt-1 font-medium">边框 + 无阴影</div>
        <p className="mt-2 text-sm text-zinc-500">最克制的形式，适合列表中的大量卡片。</p>
      </div>
      <div className="group cursor-pointer rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-xs text-zinc-500">可点击卡片</div>
        <div className="mt-1 flex items-center justify-between font-medium">
          悬停上浮 <Icon.Arrow className="text-zinc-400 transition-transform group-hover:translate-x-1" />
        </div>
        <p className="mt-2 text-sm text-zinc-500">hover 时轻微上移 + 阴影加深。</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-20 bg-zinc-100 bg-grid dark:bg-zinc-800" />
        <div className="p-5">
          <div className="text-xs text-zinc-500">媒体卡片</div>
          <div className="mt-1 font-medium">图片 + 内容</div>
        </div>
      </div>
      <div className="md:col-span-3 flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Avatar name="Design System" size={44} />
        <div className="flex-1">
          <div className="font-medium">横向卡片</div>
          <div className="text-sm text-zinc-500">头像 / 缩略图在左，内容在中，操作在右。</div>
        </div>
        <Button size="sm" variant="outline">
          查看
        </Button>
      </div>
    </div>
  );
}

const rows = [
  { name: "设计系统 v2", owner: "Li Hua", status: "进行中", progress: 68, updated: "2 小时前" },
  { name: "官网改版", owner: "Wang Fang", status: "已完成", progress: 100, updated: "昨天" },
  { name: "移动端 App", owner: "Zhang Wei", status: "已暂停", progress: 35, updated: "3 天前" },
  { name: "数据看板", owner: "Chen Jing", status: "进行中", progress: 82, updated: "5 分钟前" },
  { name: "品牌手册", owner: "Liu Yang", status: "评审中", progress: 90, updated: "1 周前" },
];
function TableDemo() {
  const [sortKey, setSortKey] = useState<"name" | "progress">("progress");
  const [asc, setAsc] = useState(false);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const allRef = useRef<HTMLInputElement>(null);
  const data = useMemo(() => [...rows].sort((a, b) => (asc ? 1 : -1) * (a[sortKey] > b[sortKey] ? 1 : -1)), [sortKey, asc]);
  const toggleAll = () => setSel(sel.size === rows.length ? new Set() : new Set(rows.map((r) => r.name)));
  // 部分选中时显示半选状态
  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = sel.size > 0 && sel.size < rows.length;
  }, [sel]);
  const statusCls: Record<string, string> = {
    进行中: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
    已完成: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    已暂停: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    评审中: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  };
  const Th = ({ k, children }: { k?: "name" | "progress"; children: React.ReactNode }) => (
    <th scope="col" aria-sort={k ? (sortKey === k ? (asc ? "ascending" : "descending") : "none") : undefined} className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
      {k ? (
        <button
          onClick={() => {
            if (sortKey === k) setAsc(!asc);
            else {
              setSortKey(k);
              setAsc(true);
            }
          }}
          className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white"
        >
          {children}
          <Icon.ChevronDown size={12} className={cn("transition-all", sortKey !== k && "opacity-0", asc && "rotate-180")} />
        </button>
      ) : (
        children
      )}
    </th>
  );
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-12 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
        <span className="text-sm font-medium">{sel.size > 0 ? `已选 ${sel.size} 项` : "项目"}</span>
        {sel.size > 0 && (
          <Button size="xs" variant="outline" onClick={() => setSel(new Set())}>
            <Icon.X size={12} /> 清除选择
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-950/50">
            <tr>
              <th className="w-10 px-4">
                <input ref={allRef} type="checkbox" checked={sel.size === rows.length} onChange={toggleAll} className="accent-zinc-900" aria-label="全选" />
              </th>
              <Th k="name">名称</Th>
              <Th>负责人</Th>
              <Th>状态</Th>
              <Th k="progress">进度</Th>
              <Th>更新</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {data.map((r) => (
              <tr key={r.name} className={cn("transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50", sel.has(r.name) && "bg-zinc-50 dark:bg-zinc-800/50")}>
                <td className="px-4">
                  <input
                    type="checkbox"
                    checked={sel.has(r.name)}
                    onChange={() => {
                      const n = new Set(sel);
                      n.has(r.name) ? n.delete(r.name) : n.add(r.name);
                      setSel(n);
                    }}
                    className="accent-zinc-900"
                    aria-label={`选择 ${r.name}`}
                  />
                </td>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <Avatar name={r.owner} size={22} /> {r.owner}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusCls[r.status])}>{r.status}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <span className="block h-full rounded-full bg-zinc-900 dark:bg-white" style={{ width: `${r.progress}%` }} />
                    </span>
                    <span className="font-mono text-xs tabular-nums text-zinc-500">{r.progress}%</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{r.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AccordionDemo() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    ["如何取消订阅？", "在「设置 → 账单」中点击取消订阅，当前周期结束前仍可使用全部功能。"],
    ["支持哪些支付方式？", "支持支付宝、微信支付、Visa / Mastercard 信用卡以及对公转账。"],
    ["数据存储在哪里？", "所有数据加密存储在国内的云服务器，符合等保三级要求。"],
  ];
  return (
    <div className="w-full max-w-md divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      {items.map(([q, a], i) => (
        <div key={q}>
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium">
            {q}
            <Icon.Plus className={cn("shrink-0 text-zinc-400 transition-transform duration-300", open === i && "rotate-45")} />
          </button>
          <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
            <div className="overflow-hidden">
              <p className="px-5 pb-4 text-sm leading-6 text-zinc-500">{a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineDemo() {
  const events = [
    ["刚刚", "Li Hua 评论了「首页改版」", "看起来不错，导航栏的高度可以再压缩一点。", true],
    ["2 小时前", "Wang Fang 上传了 3 个文件", "", false],
    ["昨天", "状态变更为「评审中」", "", false],
    ["3 天前", "项目创建", "", false],
  ] as const;
  return (
    <ol className="w-full max-w-md">
      {events.map(([t, title, desc, hl], i) => (
        <li key={i} className="relative flex gap-4 pb-8 last:pb-0">
          {i < events.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-zinc-200 dark:bg-zinc-800" />}
          <span className={cn("relative mt-1 h-4 w-4 shrink-0 rounded-full border-2 bg-white dark:bg-zinc-950", hl ? "border-zinc-900 dark:border-white" : "border-zinc-300 dark:border-zinc-700")}>
            {hl && <span className="absolute inset-0.5 rounded-full bg-zinc-900 dark:bg-white" />}
          </span>
          <div className="flex-1">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium">{title}</span>
              <span className="shrink-0 text-xs text-zinc-400">{t}</span>
            </div>
            {desc && <p className="mt-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">{desc}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Sparkline({ data, w = 96, h = 28 }: { data: number[]; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / (max - min || 1)) * (h - 2) - 1}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / (max - min || 1)) * (h - 2) - 1} r="2.5" fill="currentColor" />
    </svg>
  );
}
function StatsDemo() {
  const stats = [
    ["月活用户", "48,210", "+12.4%", true, [20, 28, 24, 36, 40, 38, 52, 60]],
    ["转化率", "3.42%", "-0.8%", false, [40, 42, 38, 36, 39, 35, 34, 33]],
    ["平均停留", "4m 12s", "+5.1%", true, [10, 14, 12, 18, 22, 20, 26, 28]],
  ] as const;
  const bars = [42, 68, 55, 80, 62, 90, 74];
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(([l, v, d, up, s]) => (
          <div key={l} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <span className="text-sm text-zinc-500">{l}</span>
              <span className={cn("text-xs font-medium", up ? "text-emerald-600" : "text-red-600")}>{d}</span>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-semibold tracking-tight tabular-nums">{v}</span>
              <span className={up ? "text-zinc-900 dark:text-white" : "text-zinc-400"}>
                <Sparkline data={[...s]} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-medium">本周访问</span>
          <span className="text-zinc-500">合计 471</span>
        </div>
        <div className="flex h-28 items-end gap-3">
          {bars.map((b, i) => (
            <div key={i} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full rounded-t-md bg-zinc-900 transition-all group-hover:bg-zinc-700 dark:bg-white dark:group-hover:bg-zinc-300" style={{ height: `${b}%` }}>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-zinc-900">{b}</span>
              </div>
              <span className="text-[10px] text-zinc-400">{["一", "二", "三", "四", "五", "六", "日"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeBlockDemo() {
  const code = `export function cn(...inputs) {\n  return twMerge(clsx(inputs));\n}`;
  const { state: copied, copy } = useCopy();
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="overflow-hidden rounded-xl border border-zinc-300 bg-zinc-950 text-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            </span>
            <span className="ml-2 font-mono text-xs text-zinc-500">utils/cn.ts</span>
          </div>
          <button onClick={() => copy(code)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white">
            {copied === "ok" ? <Icon.Check size={12} /> : <Icon.Copy size={12} />} {copied === "ok" ? "已复制" : "复制"}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[12.5px] leading-6">
          <code>
            {code.split("\n").map((l, i) => (
              <span key={i} className="flex">
                <span className="w-6 select-none text-zinc-600">{i + 1}</span>
                <span className="text-zinc-300">
                  <Highlighted code={l} />
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        行内代码 <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">npm install</code>，快捷键 <Kbd>⌘</Kbd> <Kbd>⇧</Kbd> <Kbd>P</Kbd>。
      </p>
    </div>
  );
}

function TreeDemo() {
  type Node = { name: string; children?: Node[] };
  const tree: Node[] = [
    { name: "src", children: [{ name: "components", children: [{ name: "Button.tsx" }, { name: "Input.tsx" }] }, { name: "App.tsx" }, { name: "main.tsx" }] },
    { name: "public", children: [{ name: "favicon.svg" }] },
    { name: "package.json" },
  ];
  const [open, setOpen] = useState<Set<string>>(new Set(["src", "src/components"]));
  const [sel, setSel] = useState("src/App.tsx");
  const Row = ({ n, path, depth }: { n: Node; path: string; depth: number }) => {
    const isDir = !!n.children;
    const o = open.has(path);
    return (
      <>
        <button
          onClick={() => {
            if (isDir) {
              const s = new Set(open);
              o ? s.delete(path) : s.add(path);
              setOpen(s);
            }
            setSel(path);
          }}
          style={{ paddingLeft: depth * 16 + 8 }}
          className={cn("flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left text-sm", sel === path ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50")}
        >
          <Icon.ChevronRight size={12} className={cn("text-zinc-400 transition-transform", !isDir && "invisible", o && "rotate-90")} />
          {isDir ? <Icon.Folder size={14} className="text-zinc-500" /> : <Icon.File size={14} className="text-zinc-400" />}
          {n.name}
        </button>
        {isDir && o && n.children!.map((c) => <Row key={c.name} n={c} path={`${path}/${c.name}`} depth={depth + 1} />)}
      </>
    );
  };
  return (
    <div className="w-full max-w-64 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
      {tree.map((n) => (
        <Row key={n.name} n={n} path={n.name} depth={0} />
      ))}
    </div>
  );
}

function KanbanDemo() {
  const [cols, setCols] = useState<Record<string, string[]>>({
    待办: ["调研竞品", "撰写 PRD"],
    进行中: ["设计首页", "搭建组件库"],
    已完成: ["项目启动会"],
  });
  // Pointer Events 拖拽：HTML5 DnD 在移动端不触发，pointer events 桌面 / 触屏通吃
  const [dragging, setDragging] = useState<{ from: string; item: string; x: number; y: number } | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const colRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const startDrag = (e: React.PointerEvent, from: string, item: string) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging({ from, item, x: e.clientX, y: e.clientY });
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging({ ...dragging, x: e.clientX, y: e.clientY });
    const hit = Object.entries(colRefs.current).find(([, el]) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });
    setOver(hit ? hit[0] : null);
  };
  const endDrag = () => {
    const d = dragging;
    setDragging(null);
    setOver(null);
    if (!d || !over || d.from === over) return;
    setCols((c) => ({ ...c, [d.from]: c[d.from].filter((x) => x !== d.item), [over]: [...c[over], d.item] }));
  };
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 min-[480px]:grid-cols-3">
      {Object.entries(cols).map(([k, items]) => (
        <div
          key={k}
          ref={(el) => {
            colRefs.current[k] = el;
          }}
          className={cn("min-h-40 rounded-xl border bg-zinc-50 p-2 transition-colors dark:bg-zinc-900", over === k ? "border-zinc-900 dark:border-white" : "border-zinc-200 dark:border-zinc-800")}
        >
          <div className="mb-2 flex items-center justify-between px-1 text-xs font-medium text-zinc-500">
            {k} <span className="rounded-full bg-zinc-200 px-1.5 dark:bg-zinc-800">{items.length}</span>
          </div>
          <div className="space-y-2">
            {items.map((it) => (
              <div
                key={it}
                onPointerDown={(e) => startDrag(e, k, it)}
                onPointerMove={onMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className={cn("cursor-grab touch-none rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800", dragging?.from === k && dragging.item === it && "opacity-40")}
              >
                <div className="flex items-center gap-2">
                  <Icon.Grip size={14} className="text-zinc-300" /> {it}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* 跟随指针的拖拽幻影：portal 到 body——章节 article 的 content-visibility 会成为 fixed 后代的包含块，
          不挪出去的话视口坐标会被错误地叠加 article 的偏移，幻影位置大幅跑偏 */}
      {dragging &&
        createPortal(
          <div className="pointer-events-none fixed z-50 w-40 -translate-x-1/2 -translate-y-1/2 rotate-2 rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-xl dark:border-zinc-700 dark:bg-zinc-800" style={{ left: dragging.x, top: dragging.y }}>
            {dragging.item}
          </div>,
          document.body,
        )}
    </div>
  );
}

function ChatDemo() {
  const msgs = [
    ["them", "你好！关于新版设计稿有几个问题想确认一下。"],
    ["me", "当然，请说。"],
    ["them", "首页顶部的导航在移动端是折叠还是底部 Tab？"],
    ["me", "底部 Tab，我们参考了 iOS 的 HIG，缩略图我稍后发你。"],
  ] as const;
  return (
    <div className="w-full max-w-md space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {msgs.map(([who, t], i) => (
        <div key={i} className={cn("flex items-end gap-2", who === "me" && "flex-row-reverse")}>
          <Avatar name={who === "me" ? "Me" : "Li Hua"} size={26} />
          <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-6", who === "me" ? "rounded-br-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "rounded-bl-md bg-zinc-100 dark:bg-zinc-800")}>{t}</div>
        </div>
      ))}
      <div className="flex items-end gap-2">
        <Avatar name="Li Hua" size={26} />
        <div className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 dark:bg-zinc-800">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-dot rounded-full bg-zinc-500" style={{ animationDelay: `${i * 0.16}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeatmapDemo() {
  const data = useMemo(() => Array.from({ length: 40 * 7 }, (_, i) => ((i * 7919) % 11 > 6 ? 0 : (i * 31) % 5)), []);
  const lv = ["bg-zinc-100 dark:bg-zinc-800", "bg-zinc-300 dark:bg-zinc-700", "bg-zinc-500 dark:bg-zinc-500", "bg-zinc-700 dark:bg-zinc-300", "bg-zinc-900 dark:bg-white"];
  return (
    <div className="w-full space-y-2">
      {/* 居中 + 横向可滑动（w-max 防止 auto 列被拉伸）；间隙 3px 横竖一致 */}
      <div className="flex justify-center overflow-x-auto pb-1">
        <div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">
          {data.map((d, i) => (
            <span key={i} title={`${d} 次贡献`} className={cn("h-2.5 w-2.5 shrink-0 rounded-[2px]", lv[d])} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-400">
        少 {lv.map((c) => <span key={c} className={cn("h-2.5 w-2.5 rounded-[2px]", c)} />)} 多
      </div>
    </div>
  );
}

function CarouselDemo() {
  const [i, setI] = useState(0);
  const n = 4;
  // 指针横滑翻页：touch-pan-y 保证竖向滚动仍由浏览器接管
  const startX = useRef<number | null>(null);
  const onDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40) setI((i + (dx < 0 ? 1 : -1) + n) % n);
  };
  return (
    <div className="w-full max-w-md">
      <div className="relative touch-pan-y overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (startX.current = null)}>
        <div className="flex transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ transform: `translateX(-${i * 100}%)` }}>
          {Array.from({ length: n }).map((_, k) => (
            <div key={k} className="flex h-44 w-full shrink-0 items-center justify-center bg-zinc-100 bg-grid text-4xl font-semibold text-zinc-300 dark:bg-zinc-900 dark:text-zinc-700">
              {k + 1}
            </div>
          ))}
        </div>
        <button onClick={() => setI((i - 1 + n) % n)} className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow dark:bg-zinc-800" aria-label="上一张">
          <Icon.ChevronLeft />
        </button>
        <button onClick={() => setI((i + 1) % n)} className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow dark:bg-zinc-800" aria-label="下一张">
          <Icon.ChevronRight />
        </button>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {Array.from({ length: n }).map((_, k) => (
          <button key={k} onClick={() => setI(k)} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-6 bg-zinc-900 dark:bg-white" : "w-1.5 bg-zinc-300 dark:bg-zinc-700")} aria-label={`第 ${k + 1} 张`} />
        ))}
      </div>
    </div>
  );
}

function CompareDemo() {
  const [p, setP] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef(false);
  const move = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    setP(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };
  // 统一 Pointer Events：捕获后 move/up 都派发到容器，拖出边界不中断；touch-pan-y 放行页面竖向滚动
  return (
    <div
      ref={ref}
      className="relative h-48 w-full max-w-md cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
      onPointerDown={(e) => {
        active.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => active.current && move(e.clientX)}
      onPointerUp={() => (active.current = false)}
      onPointerCancel={() => (active.current = false)}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-white">
        <span className="text-2xl font-semibold tracking-tight">After</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 bg-grid text-zinc-900" style={{ clipPath: `inset(0 ${100 - p}% 0 0)` }}>
        <span className="text-2xl font-semibold tracking-tight">Before</span>
      </div>
      <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${p}%` }}>
        <span className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-zinc-900 shadow-lg">
          <Icon.ChevronLeft size={12} />
          <Icon.ChevronRight size={12} />
        </span>
      </div>
    </div>
  );
}

function BentoDemo() {
  const cell = "rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900";
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:grid-cols-3 sm:grid-rows-2">
      <div className={cn(cell, "flex flex-col justify-between sm:col-span-2")}>
        <span className="text-xs text-zinc-400">01</span>
        <div>
          <div className="font-medium">大卡片 · 核心功能</div>
          <div className="text-sm text-zinc-500">占 2 列，放最重要的信息。</div>
        </div>
      </div>
      <div className={cn(cell, "flex min-h-36 flex-col justify-between bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 sm:row-span-2")}>
        <span className="text-xs opacity-50">02</span>
        <div className="font-medium">竖向卡片</div>
      </div>
      <div className={cell}>
        <span className="text-xs text-zinc-400">03</span>
        <div className="mt-6 font-medium">小卡片</div>
      </div>
      <div className={cn(cell, "bg-grid")}>
        <span className="text-xs text-zinc-400">04</span>
        <div className="mt-6 font-medium">纹理卡片</div>
      </div>
    </div>
  );
}

function MasonryDemo() {
  const items = [
    { h: "h-24", t: "设计即秩序" },
    { h: "h-36", t: "留白是骨架" },
    { h: "h-28", t: "层级靠对比" },
    { h: "h-40", t: "间距传达关系" },
    { h: "h-20", t: "少即是多" },
    { h: "h-32", t: "克制的灰阶" },
    { h: "h-28", t: "栅格即节奏" },
    { h: "h-24", t: "一致性复利" },
  ];
  return (
    <div className="w-full max-w-md columns-2 gap-3 sm:columns-3">
      {items.map((it, i) => (
        <div key={i} className={cn("mb-3 flex break-inside-avoid flex-col justify-between rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900", it.h)}>
          <span className="font-mono text-[10px] text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-xs font-medium">{it.t}</span>
        </div>
      ))}
    </div>
  );
}


function DescriptionListDemo() {
  const rows = [
    ["订单编号", "ORD-20260905-0042"],
    ["下单时间", "2026-09-05 14:32"],
    ["支付方式", "微信支付"],
    ["收货地址", "上海市徐汇区××路 88 号 3F"],
    ["发票", "电子普通发票"],
  ];
  return (
    <dl className="w-full max-w-md divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-4 px-4 py-2.5 text-sm">
          <dt className="w-20 shrink-0 text-zinc-400">{k}</dt>
          <dd className="min-w-0 flex-1 font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function BlockquoteDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <blockquote className="border-l-2 border-zinc-900 pl-4 text-sm leading-7 text-zinc-600 dark:border-zinc-100 dark:text-zinc-400">
        好的设计是尽可能少的设计。每个元素都应该有存在的理由，删到不能再删，剩下的才是本质。
        <footer className="mt-2 text-xs text-zinc-400">— Dieter Rams</footer>
      </blockquote>
      <blockquote className="rounded-xl bg-zinc-50 p-4 text-sm leading-7 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
        「简单比复杂更难，但值得。」
        <footer className="mt-2 text-xs text-zinc-400">— Steve Jobs</footer>
      </blockquote>
    </div>
  );
}

export default function DataDisplay() {
  return (
    <section>
      <SectionHeader
        id="data"
        index="06"
        title="数据展示"
        en="Data Display"
        intro="展示类组件的目标是让信息「一眼可读」。原则：对齐（数字右对齐并使用等宽数字）、分组（用间距而不是线条）、层级（标题 / 正文 / 辅助三级）。这一章覆盖从卡片、表格、树形视图到看板拖放、日历热力图、瀑布流的结构化展示场景，也包含代码块、聊天气泡、描述列表与引用块这类内容型组件。表格与图表尽量去掉多余的边框和网格线——去掉的每一条线，都会让剩下的信息更清晰。"
        icon={<Icon.BarChart />}
      />

      <Showcase id="card" title="卡片" en="Card" description="卡片是内容容器的基本单位：基础（仅边框）、可点击（悬停上浮）、媒体（图片 + 内容）、横向（头像 + 内容 + 操作）。极简风格中卡片默认无阴影，靠 1px 边框与背景区分。" usage={["列表化的同类内容：项目、文章、商品。", "仪表盘的指标模块。", "注意：不要把卡片套卡片。"]} points={["圆角 12px（rounded-xl），内边距 20px（p-5）。", "可点击卡片：hover:-translate-y-0.5 hover:shadow-md，箭头图标 group-hover:translate-x-1。", "媒体卡片用 overflow-hidden 让图片跟随圆角。", "整卡可点击时用 <a> 包裹或在卡片内放一个覆盖全卡的伪元素链接。"]} code={`<a href="/p/1" className="group block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm
  transition-all hover:-translate-y-0.5 hover:shadow-md">
  <div className="flex items-center justify-between font-medium">
    标题 <ArrowIcon className="text-zinc-400 transition-transform group-hover:translate-x-1" />
  </div>
  <p className="mt-2 text-sm text-zinc-500">描述…</p>
</a>`}>
        <CardDemo />
      </Showcase>

      <Showcase id="table" title="数据表格" en="Data Table" level="进阶" description="支持排序、多选、批量操作栏、状态徽章、行内进度条的数据表格。去掉竖线，只保留极淡的横向分隔，表头用浅灰背景。" usage={["管理后台的列表页。", "需要比较多个对象多个属性的场景。", "移动端需要转为卡片列表。"]} points={["排序：维护 sortKey + asc，useMemo 计算排序后的数据；表头图标用旋转表示方向。", "多选：Set 存储选中 id，全选 checkbox 支持 indeterminate。", "选中后表头切换为批量操作栏。", "数字列右对齐 + tabular-nums；文字列左对齐。", "大数据量用虚拟滚动（@tanstack/react-virtual）+ 服务端分页。"]} a11y={["表头 <th scope=\"col\">；排序按钮加 aria-sort。", "checkbox 加 aria-label。"]} code={`const data = useMemo(
  () => [...rows].sort((a, b) => (asc ? 1 : -1) * (a[key] > b[key] ? 1 : -1)),
  [key, asc]);

<table className="w-full text-sm">
  <thead className="bg-zinc-50">
    <tr><th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
      <button onClick={() => toggleSort("name")}>名称 <ChevronDown className={cn(asc && "rotate-180")} /></button>
    </th></tr>
  </thead>
  <tbody className="divide-y divide-zinc-100">
    {data.map(r => <tr key={r.id} className="hover:bg-zinc-50">…</tr>)}
  </tbody>
</table>`}>
        <TableDemo />
      </Showcase>

      <Showcase id="accordion" title="手风琴" en="Accordion" description="可展开 / 折叠的内容区。展开动画使用 grid-template-rows 0fr → 1fr 技巧，无需测量高度即可平滑过渡。加号图标旋转 45° 变成叉号。" usage={["FAQ、设置分组、长表单分节。", "一次只展开一项（单开）或允许多开。"]} points={["高度动画：外层 grid + gridTemplateRows: open ? '1fr' : '0fr'，内层 overflow-hidden。这是目前最优雅的「auto 高度动画」方案。", "Plus 图标 rotate-45 变为 X，比换图标更流畅。", "单开：state 存当前 index；多开：存 Set。", "原生 <details> / <summary> 也可以，但动画支持有限。"]} a11y={["按钮 aria-expanded + aria-controls；内容区 role=\"region\"。"]} code={`<button onClick={toggle} aria-expanded={open}>
  {q} <PlusIcon className={cn("transition-transform duration-300", open && "rotate-45")} />
</button>
<div className="grid transition-[grid-template-rows] duration-300"
     style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
  <div className="overflow-hidden"><p className="pb-4">{a}</p></div>
</div>`}>
        <AccordionDemo />
      </Showcase>

      <Showcase id="timeline" title="时间线 · 活动流" en="Timeline · Activity Feed" description="按时间排列的事件列表，左侧圆点 + 竖线连接，最新事件高亮，带内容的事件附卡片。" usage={["操作历史、版本记录、物流跟踪、评论流。"]} points={["竖线用绝对定位的 1px 宽 span，最后一项不渲染。", "圆点 border-2 + 内部实心圆表示当前 / 高亮。", "时间放在右侧且 shrink-0 防止换行。", "长列表分页或「加载更多」。"]} code={`<li className="relative flex gap-4 pb-8">
  <span className="absolute left-[7px] top-4 h-full w-px bg-zinc-200" />
  <span className="relative mt-1 h-4 w-4 rounded-full border-2 border-zinc-900 bg-white">
    <span className="absolute inset-0.5 rounded-full bg-zinc-900" />
  </span>
  <div className="flex-1">…</div>
</li>`}>
        <TimelineDemo />
      </Showcase>

      <Showcase id="stats" title="指标卡片 · 迷你图表" en="Stats · Sparkline · Bar Chart" level="进阶" description="仪表盘的核心：大数字 + 环比变化 + 迷你趋势线（Sparkline）。柱状图用纯 div 实现，hover 显示数值。不引入图表库也能做出干净的可视化。" usage={["KPI 概览、数据看板首屏。", "复杂图表用 Recharts / ECharts / visx。"]} points={["Sparkline：把数据归一化到 0–1，映射到 SVG 坐标，polyline 连线，末尾加圆点。", "大数字 text-2xl font-semibold tabular-nums；变化率绿升红降。", "柱状图：flex items-end + 每根柱 height 百分比 + group-hover 显示 tooltip。", "颜色：主数据用 zinc-900，次数据 zinc-400，不用彩虹色。"]} code={`function Sparkline({ data, w = 96, h = 28 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) =>
    \`\${(i / (data.length - 1)) * w},\${h - ((d - min) / (max - min || 1)) * (h - 2) - 1}\`).join(" ");
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}`}>
        <StatsDemo />
      </Showcase>

      <Showcase id="code" title="代码块 · 行内代码 · 快捷键" en="Code Block · Kbd" description="深色代码块带文件名、行号和复制按钮。行内代码用浅灰底色 + 等宽字体。快捷键（Kbd）模拟键帽，底部有 1px 内阴影。" usage={["开发文档、技术博客、设置页的快捷键说明。"]} points={["代码块始终深色（即使浅色主题），提高辨识度。", "行号 select-none 避免复制时带上。", "语法高亮用 shiki（构建时）或 prism（运行时）。", "Kbd：border + bg-zinc-50 + shadow-[inset_0_-1px_0_rgba(0,0,0,.15)]。"]} code={`<kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-zinc-300
  bg-zinc-50 px-1.5 font-mono text-[11px] font-medium text-zinc-600
  shadow-[inset_0_-1px_0_rgb(0_0_0/0.15)]">⌘</kbd>

<code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px]">npm install</code>`}>
        <CodeBlockDemo />
      </Showcase>

      <Showcase id="tree" title="树形视图" en="Tree View" level="进阶" description="递归渲染的层级结构，文件夹可展开，缩进随深度递增，箭头旋转表示状态。" usage={["文件浏览器、组织架构、分类目录、大纲。"]} points={["递归组件 Row 渲染自身 + children。", "展开状态用 Set<path> 存储；path 用完整路径保证唯一。", "缩进 paddingLeft = depth × 16 + 8。", "文件不显示箭头但保留占位（invisible）保持对齐。"]} a11y={["role=\"tree\" / \"treeitem\" + aria-expanded + aria-level；支持 ← → 展开折叠、↑ ↓ 移动。"]} code={`const Row = ({ node, path, depth }) => (
  <>
    <button style={{ paddingLeft: depth * 16 + 8 }} onClick={() => toggle(path)}>
      <Chevron className={cn(!node.children && "invisible", open.has(path) && "rotate-90")} />
      {node.children ? <FolderIcon /> : <FileIcon />} {node.name}
    </button>
    {node.children && open.has(path) &&
      node.children.map(c => <Row key={c.name} node={c} path={\`\${path}/\${c.name}\`} depth={depth + 1} />)}
  </>
);`}>
        <TreeDemo />
      </Showcase>

      <Showcase id="kanban" title="看板（拖放）" en="Kanban · Drag & Drop" level="高级" description="跨列拖动卡片。用 Pointer Events 实现，桌面鼠标与手机触屏都能拖；拖动时显示跟随指针的幻影卡片，目标列边框高亮。" usage={["任务管理、销售漏斗、招聘流程。"]} points={["卡片 onPointerDown + setPointerCapture 记录来源，后续 move/up 都派发到卡片，拖出窗口也能收到。", "onPointerMove 里用 elementFromPoint 思路（比对列矩形的 getBoundingClientRect）判断悬停在哪列，刷新高亮。", "幻影卡片要 createPortal 到 document.body 再 fixed——祖先有 content-visibility / transform 时会成为 fixed 的包含块，视口坐标会全部跑偏。", "松手（onPointerUp）时把数据从源列移到目标列；卡片加 touch-none 防止触摸时触发页面滚动。", "复杂需求（列内排序、多拖、自动滚动）请用 @dnd-kit/core，其 PointerSensor 同样基于 Pointer Events。"]} code={`// 卡片
<div onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag({ from: col, item }); }}
     onPointerMove={(e) => setDrag(d => d && { ...d, x: e.clientX, y: e.clientY })}
     onPointerUp={drop} className="touch-none cursor-grab">…</div>

// 移动中：命中检测 + 高亮
const hit = Object.entries(colRefs.current).find(([, el]) => inRect(e, el));
setOver(hit?.[0] ?? null);

// 松手：更新数据
setCols(c => ({ ...c, [d.from]: c[d.from].filter(x => x !== d.item), [over]: [...c[over], d.item] }))}`}>
        <KanbanDemo />
      </Showcase>

      <Showcase id="chat" title="聊天气泡" en="Chat Bubbles" description="自己的消息靠右深色，对方靠左浅色，靠近头像的一角圆角更小以指向说话者。「正在输入」用三个跳动的点。" usage={["IM、客服、AI 对话界面。"]} points={["flex-row-reverse 翻转自己的消息。", "rounded-2xl + 一角 rounded-br-md / rounded-bl-md。", "max-w-[75%] 防止太长。", "AI 流式输出：逐字追加文本，末尾显示闪烁光标。"]} code={`<div className={cn("flex items-end gap-2", mine && "flex-row-reverse")}>
  <Avatar />
  <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
    mine ? "rounded-br-md bg-zinc-900 text-white" : "rounded-bl-md bg-zinc-100")}>
    {text}
  </div>
</div>`}>
        <ChatDemo />
      </Showcase>

      <Showcase id="heatmap" title="日历热力图" en="Calendar Heatmap" level="进阶" description="GitHub 贡献图：40 周 × 7 天的方格，颜色深浅表示数值等级。使用 grid-flow-col + grid-rows-7 让数据按列排布。" usage={["活跃度、打卡记录、提交历史。"]} points={["grid grid-flow-col grid-rows-7 自动纵向填充。", "数值分 5 级映射到 5 个灰度。", "每格 title 属性提供原生 tooltip，或自定义 Popover。", "右下角图例「少 → 多」。"]} code={`<div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">
  {days.map((d, i) => (
    <span key={i} title={\`\${d.count} 次\`}
      className={cn("h-2.5 w-2.5 rounded-[2px]", levels[d.level])} />
  ))}
</div>
{/* w-max 让容器收缩到内容宽度：否则 auto 列被拉伸，横向间隙会比竖向大 */}`}>
        <HeatmapDemo />
      </Showcase>

      <Showcase id="carousel" title="轮播" en="Carousel" description="水平滑动的多页内容，前后按钮 + 指示点（当前点拉长）。用 translateX 移动轨道。" usage={["产品图片、推荐位、引导页。", "自动轮播需提供暂停且悬停时暂停。"]} points={["轨道 flex + 每页 w-full shrink-0；transform: translateX(-index × 100%)。", "循环：(i ± 1 + n) % n。", "当前指示点 w-6，其余 w-1.5，transition-all 产生拉伸动画。", "触摸滑动：容器记 pointerdown 的 clientX，pointerup 时位移超过 40px 就翻页；加 touch-pan-y 避免和页面滚动冲突。惯性 / 多页用 embla-carousel 或 CSS scroll-snap。"]} code={`<div className="overflow-hidden rounded-xl">
  <div className="flex transition-transform duration-500" style={{ transform: \`translateX(-\${i * 100}%)\` }}>
    {slides.map(s => <div key={s} className="w-full shrink-0">…</div>)}
  </div>
</div>

/* 纯 CSS 方案 */
.track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; }
.slide { flex: 0 0 100%; scroll-snap-align: start; }`}>
        <CarouselDemo />
      </Showcase>

      <Showcase id="compare" title="图片对比滑块" en="Image Comparison" level="进阶" description="拖动中间的分割线对比前后两张图。上层用 clip-path 裁剪，随指针位置更新百分比。" usage={["修图前后、改版前后、AI 生成效果对比。"]} points={["两层绝对定位叠放；上层 clipPath: inset(0 (100−p)% 0 0)。", "Pointer Events 统一鼠标与触摸：pointerdown 时 setPointerCapture，move 持续更新，拖出边界也不会中断。", "容器加 touch-pan-y：横向拖动由组件处理，竖向滚动仍归浏览器，触屏上互不干扰。", "分割线 + 中间圆形手柄，cursor-ew-resize；select-none 防止拖动时选中文字。"]} code={`<div ref={ref} className="relative cursor-ew-resize touch-pan-y select-none"
  onPointerDown={(e) => { down.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX); }}
  onPointerMove={(e) => down.current && move(e.clientX)}
  onPointerUp={() => (down.current = false)}>
  <img src={after} className="absolute inset-0" />
  <img src={before} className="absolute inset-0" style={{ clipPath: \`inset(0 \${100 - p}% 0 0)\` }} />
  <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: \`\${p}%\` }} />
</div>`}>
        <CompareDemo />
      </Showcase>

      <Showcase id="bento" title="Bento 网格" en="Bento Grid" level="进阶" description="便当盒式的不规则网格布局，大小卡片穿插，是当下产品落地页最流行的信息呈现方式（Apple、Vercel、Linear）。" usage={["功能特性介绍、个人主页、作品集。"]} points={["grid-cols-3 grid-rows-2 + 用 col-span / row-span 让部分卡片跨格。", "每个卡片内部左上角放编号或图标，左下角放标题，保持视觉锚点一致。", "穿插 1–2 个反色或带纹理的卡片打破单调。", "移动端全部退化为单列。"]} code={`<div className="grid grid-cols-3 grid-rows-2 gap-3">
  <div className="col-span-2 rounded-xl border p-5">大卡片</div>
  <div className="row-span-2 rounded-xl bg-zinc-900 p-5 text-white">竖向卡片</div>
  <div className="rounded-xl border p-5">小卡片</div>
  <div className="rounded-xl border bg-grid p-5">纹理卡片</div>
</div>`}>
        <BentoDemo />
      </Showcase>

      <Showcase
        id="masonry"
        title="瀑布流"
        en="Masonry Layout"
        level="进阶"
        description="高度不等的卡片按列自上而下填充，自动补齐空隙。纯 CSS 实现：多列布局 columns + break-inside-avoid 防止卡片被截断。"
        usage={["图片墙、作品集、Pinterest 式信息流。", "内容高度差异大、顺序不敏感的列表。"]}
        points={["columns-2 sm:columns-3 定义列数；列间距用 gap（即 column-gap）。", "子项 break-inside-avoid（避免跨列截断）+ mb-3 充当行间距。", "CSS 多列是「纵向优先」填充：阅读顺序为上→下再右移，不适合强顺序内容。", "需要严格横向排序或超长列表时，用 JS 分列（按最短列插入）。"]}
        a11y={["多列布局的读屏顺序与视觉顺序不完全一致，重要操作不要依赖列顺序。"]}
        code={`<div className="columns-2 gap-3 sm:columns-3">
  {items.map((it, i) => (
    <div key={i} className="mb-3 break-inside-avoid rounded-xl border bg-white p-3">
      {it.content}
    </div>
  ))}
</div>

/* JS 分列（顺序敏感时） */
const cols = Array.from({ length: n }, () => []);
items.forEach((it, i) => cols[i % n].push(it));`}
      >
        <MasonryDemo />
      </Showcase>

      <Showcase id="description-list" title="描述列表" en="Description List" description="键值对形式的详情展示：订单信息、商品参数、操作日志。用原生 dl / dt / dd 语义标签，左侧键固定宽度，右侧值可换行。" usage={["订单详情、商品参数、配置信息、日志摘要。", "字段多且只读的场景——需要编辑时改用表单。"]} points={["原生 <dl> <dt> <dd> 标签自带「描述列表」语义。", "dt 定宽 text-zinc-400，dd flex-1 min-w-0 保证长值可换行不挤压。", "行间用 divide-y 极淡分隔，外层一张卡片收口。", "字段过多时分栏展示（md:grid-cols-2），重要字段放前面。"]} a11y={["dl/dt/dd 的语义关联对读屏软件友好，优于 div 模拟。"]} code={`<dl className="divide-y divide-zinc-100 rounded-xl border bg-white">
  {rows.map(([k, v]) => (
    <div key={k} className="flex gap-4 px-4 py-2.5 text-sm">
      <dt className="w-20 shrink-0 text-zinc-400">{k}</dt>
      <dd className="min-w-0 flex-1 font-medium">{v}</dd>
    </div>
  ))}
</dl>`}>
        <DescriptionListDemo />
      </Showcase>

      <Showcase id="blockquote" title="引用块" en="Blockquote" description="引用他人观点或文案的两种形态：左侧竖线的经典样式与浅底卡片样式，出处放在 footer 里弱化显示。" usage={["文章引言、用户评价、理念宣言。", "竖线式适合正文内嵌，卡片式适合独立成段。"]} points={["竖线式：border-l-2 + pl-4，线条颜色与文字同一灰阶。", "卡片式：rounded-xl + 浅底色，适合页面里独立呈现的引言。", "出处用 <footer> + 破折号前缀，字号比正文小两级。", "引用本体用原生 <blockquote> 标签保留语义。"]} a11y={["<blockquote> 语义让读屏软件按引用朗读。"]} code={`<blockquote className="border-l-2 border-zinc-900 pl-4 text-sm leading-7 text-zinc-600">
  引用内容…
  <footer className="mt-2 text-xs text-zinc-400">— 作者</footer>
</blockquote>`}>
        <BlockquoteDemo />
      </Showcase>

      <Showcase
        id="virtual-list"
        title="虚拟滚动列表"
        en="Virtual List"
        level="高级"
        description="一万行数据只渲染屏幕可见的 20 多行：外层容器固定高度，内层撑起总高度当「滚动轨道」，行用 translateY 绝对定位到自己的位置。"
        usage={["十万级日志、聊天记录、长菜单、无限表格。", "行高固定时最简单；行高可变需要测量缓存。"]}
        points={["轨道高度 = 总数 × 行高，行绝对定位 translateY(i × 行高)——浏览器的滚动条因此是正确的。", "onScroll 里按 scrollTop / 行高算出首行，再各加 overscan（前后多渲染几行，快速滚动不露白）。", "只渲染 start..end 区间，DOM 数量恒定，长列表性能与列表长度无关。", "key 用行号；行内容保持轻量（不要每行写复杂 state）。", "行高不固定时：先估计高度渲染，测量后再校正（或直接用 content-visibility 的 contain-intrinsic-size 近似）。"]}
        a11y={["容器加 role=\"list\"，行 role=\"listitem\"；aria-setsize / aria-posinset 告知读屏真实总数与位置。", "键盘滚动依赖原生滚动条，方向键可滚动（容器可聚焦时）。"]}
        code={`const ROW = 40;                // 固定行高
const onScroll = () => {
  const start = Math.max(0, Math.floor(el.scrollTop / ROW) - overscan);
  const end = Math.min(total, start + Math.ceil(el.clientHeight / ROW) + overscan);
  setRange({ start, end });
};

<div style={{ height: total * ROW }} className="relative">   {/* 轨道 */}
  {rows.map(i => (
    <div key={i} style={{ transform: \`translateY(\${i * ROW}px)\` }}
      className="absolute inset-x-0 h-10 border-b px-3">{i}</div>
  ))}
</div>`}
      >
        <VirtualListDemo />
      </Showcase>

      <Showcase
        id="transfer"
        title="穿梭框"
        en="Transfer"
        level="进阶"
        description="左右两栏 + 中间方向按钮：在候选与已选之间批量移动成员。两栏各自的已选项用 checkbox 标记，中间按钮负责移动。"
        usage={["分配权限、选择负责人、配置可见性。", "选项多且需要「从大池子里挑一批」时。"]}
        points={["中间按钮是「动作」，候选右侧列出所有可选项与已选项；两侧共享同一选中集合。", "按钮 disabled 当对应方向没有可移动的选中项，比点了没反应好。", "移动后清空选中集，避免残留选中引向「幽灵移动」。", "左侧保留搜索，大列表必配。", "列表项复用原生 button + checkbox 图形，天然可键盘操作。"]}
        a11y={["箭头按钮 aria-label=\"移到右侧 / 移到左侧\"；已选项用 aria-selected 或 checkbox 语义。", "移动后焦点保持在按钮上，读屏可感知列表变化（示例用数量文字同步）。"]}
        code={`const [sel, setSel] = useState(new Set());
const toggle = (n) => setSel(s => { const ns = new Set(s);
  ns.has(n) ? ns.delete(n) : ns.add(n); return ns; });
const move = (toRight) => {
  const target = [...sel].filter(n => toRight ? left.includes(n) : right.includes(n));
  setRight(r => toRight ? [...r, ...target].sort() : r.filter(n => !target.includes(n)));
  setSel(new Set());
};

<button onClick={() => move(true)} disabled={!canMoveRight} aria-label="移到右侧">
  <Arrow />
</button>`}
      >
        <TransferDemo />
      </Showcase>

    </section>
  );
}

/* ---------------- Virtual List ---------------- */
const ROW_H = 40;
const VL_TOTAL = 10000;
const VL_WORDS = ["设计令牌", "视觉层级", "间距栅格", "圆角阴影", "动效曲线", "交互状态", "反馈机制", "响应式断点", "触控尺寸", "色彩对比度"];
function VirtualListDemo() {
  const [range, setRange] = useState({ start: 0, end: 30 });
  const ref = useRef<HTMLDivElement>(null);
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const start = Math.max(0, Math.floor(el.scrollTop / ROW_H) - 5);
    const end = Math.min(VL_TOTAL, start + Math.ceil(el.clientHeight / ROW_H) + 10);
    setRange({ start, end });
  };
  const rows: number[] = [];
  for (let i = range.start; i < range.end; i++) rows.push(i);
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        <span>
          共 {VL_TOTAL.toLocaleString()} 行 · 每行 {ROW_H}px
        </span>
        <span className="font-mono tabular-nums">只渲染 {rows.length} 行</span>
      </div>
      <div ref={ref} onScroll={onScroll} className="relative h-64 overflow-y-auto">
        <div className="relative w-full" style={{ height: VL_TOTAL * ROW_H }}>
          {rows.map((i) => (
            <div key={i} style={{ transform: `translateY(${i * ROW_H}px)` }} className="absolute inset-x-0 flex h-10 items-center gap-3 border-b border-zinc-100 px-3 text-sm dark:border-zinc-900">
              <span className="w-14 shrink-0 font-mono text-xs text-zinc-400">#{i}</span>
              <span className="truncate">{VL_WORDS[i % VL_WORDS.length]} · 示例数据行</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Transfer ---------------- */
const T_ALL = ["张伟", "李娜", "王芳", "刘洋", "陈静", "杨帆", "赵磊", "黄敏", "周杰", "吴倩", "郑爽", "孙悦"];
function CheckIcon({ sel, n }: { sel: Set<string>; n: string }) {
  return (
    <span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded border", sel.has(n) ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900" : "border-zinc-300 dark:border-zinc-600")}>
      {sel.has(n) && <Icon.Check size={10} />}
    </span>
  );
}
function TransferDemo() {
  const [right, setRight] = useState<string[]>(["李娜", "陈静"]);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const left = T_ALL.filter((n) => !right.includes(n));
  const leftFiltered = left.filter((n) => n.includes(q.trim()));
  const toggleSel = (n: string) =>
    setSel((s) => {
      const ns = new Set(s);
      if (ns.has(n)) ns.delete(n);
      else ns.add(n);
      return ns;
    });
  const move = (toRight: boolean) => {
    const target = [...sel].filter((n) => (toRight ? left.includes(n) : right.includes(n)));
    if (!target.length) return;
    setRight((r) => (toRight ? [...r, ...target].sort((a, b) => a.localeCompare(b, "zh")) : r.filter((n) => !target.includes(n))));
    setSel(new Set());
  };

    return (
    <div className="flex w-full max-w-xl items-center gap-3">
      <div className="min-w-0 flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
          <span className="text-xs font-medium">候选成员</span>
          <span className="font-mono text-xs text-zinc-400">{leftFiltered.length} 人</span>
        </div>
        <div className="border-b border-zinc-100 p-2 dark:border-zinc-900">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索成员…"
            aria-label="搜索候选成员"
            className="h-7 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs outline-none transition focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-white"
          />
        </div>
        <ul className="max-h-44 overflow-y-auto p-1">
          {leftFiltered.map((n) => (
            <li key={n}>
              <button type="button" onClick={() => toggleSel(n)} aria-pressed={sel.has(n)} className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <CheckIcon sel={sel} n={n} />
                {n}
              </button>
            </li>
          ))}
          {leftFiltered.length === 0 && <li className="px-2 py-4 text-center text-xs text-zinc-400">无匹配成员</li>}
        </ul>
      </div>

      <div className="flex shrink-0 flex-col gap-2">
        <button
          type="button"
          onClick={() => move(true)}
          disabled={![...sel].some((n) => left.includes(n))}
          aria-label="移到右侧"
          className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-300 text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <Icon.Arrow size={15} />
        </button>
        <button
          type="button"
          onClick={() => move(false)}
          disabled={![...sel].some((n) => right.includes(n))}
          aria-label="移到左侧"
          className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-300 text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <Icon.ChevronLeft size={15} />
        </button>
      </div>

      <div className="min-w-0 flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
          <span className="text-xs font-medium">已选成员</span>
          <span className="font-mono text-xs text-zinc-400">{right.length} 人</span>
        </div>
        <ul className="max-h-44 overflow-y-auto p-1">
          {right.map((n) => (
            <li key={n}>
              <button type="button" onClick={() => toggleSel(n)} aria-pressed={sel.has(n)} className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <CheckIcon sel={sel} n={n} />
                {n}
              </button>
            </li>
          ))}
          {right.length === 0 && <li className="px-2 py-4 text-center text-xs text-zinc-400">暂无成员</li>}
        </ul>
      </div>
    </div>
  );
}
