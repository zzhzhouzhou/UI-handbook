import { useEffect, useMemo, useState } from "react";
import { NAV, type NavGroup } from "./nav";
import { Icon, Kbd } from "./components/primitives";
import { cn } from "./utils/cn";
import Foundations from "./sections/Foundations";
import Basics from "./sections/Basics";
import Navigation from "./sections/Navigation";
import Feedback from "./sections/Feedback";
import DataDisplay from "./sections/DataDisplay";
import Motion from "./sections/Motion";
import Advanced from "./sections/Advanced";
import Patterns from "./sections/Patterns";
import Standards from "./sections/Standards";

function useTheme() {
  // index.html 的内联脚本已在首帧前把 .dark 挂到 <html> 上，这里直接以其初始值同步状态
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const ob = new MutationObserver(() => {
      const now = document.documentElement.classList.contains("dark");
      setDark(now);
      try {
        localStorage.setItem("theme", now ? "dark" : "light");
      } catch {
        /* 隐私模式下写入会失败，忽略 */
      }
    });
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => ob.disconnect();
  }, []);
  const toggle = () => document.documentElement.classList.toggle("dark");
  return { dark, toggle };
}

function useActiveId(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** 聚焦当前可见的侧边栏搜索框（桌面栏与移动抽屉各有一个实例） */
function focusNavSearch(): boolean {
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>("input[data-nav-search]"));
  const visible = inputs.find((el) => el.getClientRects().length > 0);
  const target = visible ?? inputs[0];
  if (!target) return false;
  target.focus();
  target.select();
  return target.getClientRects().length > 0;
}

function Sidebar({ q, onSearch, groups, active, onNavigate, autoFocusSearch = false }: { q: string; onSearch: (v: string) => void; groups: NavGroup[]; active: string; onNavigate: () => void; autoFocusSearch?: boolean }) {
  return (
    <nav className="flex h-full flex-col">
      <div className="px-4 pb-3">
        <div className="relative">
          <Icon.Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          <input
            data-nav-search
            autoFocus={autoFocusSearch}
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="搜索组件…"
            autoComplete="off"
            className="h-8 w-full rounded-md border border-zinc-200 bg-white pl-8 pr-8 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            <Kbd>/</Kbd>
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {groups.map((g) => (
          <div key={g.id} className="mb-5">
            <a href={`#${g.id}`} onClick={onNavigate} className="mb-1.5 flex items-baseline gap-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <span className="font-mono">{g.index}</span> {g.title}
            </a>
            <ul className="space-y-px">
              {g.items.map((it) => (
                <li key={it.id}>
                  <a
                    href={`#${it.id}`}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-1 text-[13px] transition-colors",
                      active === it.id ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white",
                    )}
                  >
                    <span className="truncate">{it.label}</span>
                    {it.level === "高级" && <span className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900 dark:bg-white" />}
                    {it.level === "进阶" && <span className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full border border-zinc-900 dark:border-white" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {groups.length === 0 && <p className="px-2 py-6 text-center text-xs text-zinc-400">没有匹配 “{q}” 的组件</p>}
      </div>
      <div className="border-t border-zinc-200 px-4 py-3 text-[11px] text-zinc-400 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full border border-zinc-900 dark:border-white" /> 进阶
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 高级
          </span>
        </div>
      </div>
    </nav>
  );
}

const total = NAV.reduce((a, g) => a + g.items.length, 0);

export default function App() {
  const { dark, toggle } = useTheme();
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const ids = useMemo(() => NAV.flatMap((g) => g.items.map((i) => i.id)), []);
  const active = useActiveId(ids);

  const filtered = useMemo(() => {
    if (!q.trim()) return NAV;
    const s = q.trim().toLowerCase();
    return NAV.map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(s) || i.en.toLowerCase().includes(s) || g.title.includes(s)) })).filter((g) => g.items.length);
  }, [q]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement || (t instanceof HTMLElement && t.isContentEditable)) return;
      e.preventDefault();
      // 找不到可见的搜索框（如窄屏且抽屉未打开）时，直接打开抽屉
      if (!focusNavSearch()) {
        setMenu(true);
        requestAnimationFrame(() => focusNavSearch());
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  // 移动抽屉打开时锁定背景滚动 + Esc 关闭
  useEffect(() => {
    if (!menu) return;
    const ow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = ow;
      window.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const sidebar = <Sidebar q={q} onSearch={setQ} groups={filtered} active={active} onNavigate={() => setMenu(false)} />;

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenu(!menu)} className="grid h-9 w-9 place-items-center rounded-md hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-800" aria-label="目录" aria-expanded={menu}>
              {menu ? <Icon.X size={18} /> : <Icon.Menu size={18} />}
            </button>
            <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
              <span className="grid h-6 w-6 grid-cols-2 gap-0.5 rounded-md bg-zinc-900 p-1 dark:bg-white">
                <span className="rounded-[2px] bg-white dark:bg-zinc-900" />
                <span className="rounded-[2px] bg-white/40 dark:bg-zinc-900/40" />
                <span className="rounded-[2px] bg-white/40 dark:bg-zinc-900/40" />
                <span className="rounded-[2px] bg-white dark:bg-zinc-900" />
              </span>
              形色场
              <span className="hidden text-[11px] font-normal tracking-wide text-zinc-400 [transform:translateY(3px)] sm:inline">/ UI Handbook</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden font-mono text-xs text-zinc-400 md:inline">{total} 个组件 · {NAV.length} 章</span>
            <button onClick={toggle} className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800" aria-label="切换主题">
              {dark ? <Icon.Sun size={15} /> : <Icon.Moon size={15} />}
            </button>
          </div>
        </div>
      </header>

      <div id="top" className="mx-auto flex max-w-[1400px]">
        {/* Sidebar desktop */}
        <aside className="sticky top-14 hidden h-[calc(100dvh-56px)] w-64 shrink-0 border-r border-zinc-200 pt-4 lg:block dark:border-zinc-800">{sidebar}</aside>
        {/* Sidebar mobile */}
        {menu && (
          <div className="fixed inset-0 top-14 z-30 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMenu(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 animate-slide-in-left bg-white pt-4 shadow-2xl dark:bg-zinc-950">
              <Sidebar q={q} onSearch={setQ} groups={filtered} active={active} onNavigate={() => setMenu(false)} autoFocusSearch />
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="min-w-0 flex-1 px-5 pb-32 md:px-10 lg:px-14">
          {/* Hero */}
          <div className="border-b border-zinc-200 py-16 md:py-24 dark:border-zinc-800">
            <div className="font-mono text-xs text-zinc-400">UI Handbook · Interface Component Handbook · 2026</div>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              把界面上会用到的一切，
              <br />
              <span className="text-zinc-400">看一遍、懂一遍、做一遍。</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-zinc-600 dark:text-zinc-400">
              一份从设计令牌到高级交互的完整 UI 教程。每个组件包含<strong className="font-medium text-zinc-900 dark:text-white">可交互预览</strong>、<strong className="font-medium text-zinc-900 dark:text-white">用途说明</strong>、<strong className="font-medium text-zinc-900 dark:text-white">实现要点</strong>、<strong className="font-medium text-zinc-900 dark:text-white">无障碍细节</strong>与<strong className="font-medium text-zinc-900 dark:text-white">核心代码</strong>。全部采用克制的黑白灰实现——把 zinc-900 换成你的品牌色，就是你的设计系统。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#foundations" className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                从基础开始 <Icon.Arrow />
              </a>
              <a href="#motion" className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-300 px-5 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
                直接看高级交互
              </a>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 md:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
              {NAV.map((g) => (
                <a key={g.id} href={`#${g.id}`} className="group bg-white p-4 transition-colors hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-zinc-400">{g.index}</span>
                    <Icon.Arrow size={14} className="text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  </div>
                  <div className="mt-3 text-sm font-medium">{g.title}</div>
                  <div className="text-xs text-zinc-400">{g.items.length} 个组件</div>
                </a>
              ))}
            </div>
          </div>

          <Foundations />
          <Basics />
          <Navigation />
          <Feedback />
          <DataDisplay />
          <Motion />
          <Advanced />
          <Patterns />
          <Standards />

          {/* 使用指南 */}
          <div className="mt-24 border-t border-zinc-200 pt-12 dark:border-zinc-800">
            <div className="font-mono text-xs text-zinc-400">How to use</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">如何使用本站</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Icon.Search />, t: "快速搜索", d: "按 / 唤起侧边栏搜索，输入中文名或英文名即可过滤全部组件。" },
                { icon: <Icon.Moon />, t: "深色模式", d: "右上角一键切换，跟随系统偏好并记忆选择；代码块始终为深色。" },
                { icon: <Icon.Copy />, t: "复制代码", d: "每个组件的「代码」Tab 都有一键复制，示例可直接粘贴进项目。" },
                { icon: <Icon.Play />, t: "可交互预览", d: "所有 demo 真实可交互，⟳ 可重新播放动画；手机端支持拖拽与滑动手势。" },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 [&_svg]:h-4 [&_svg]:w-4">{c.icon}</span>
                  <div className="mt-3 text-sm font-medium">{c.t}</div>
                  <p className="mt-1 text-[13px] leading-6 text-zinc-500">{c.d}</p>
                </div>
              ))}
            </div>
          </div>

          <footer className="mt-24 border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">关于作者</div>
                <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                  zzh_zhou · <span className="font-medium">Garbage Human Studio</span>
                </p>
                <p className="mt-1 max-w-md text-xs leading-6 text-zinc-400">本项目由 AI 辅助开发。全部组件均以 React + Tailwind CSS 手写实现，不依赖任何 UI 组件库；示例代码可直接复制到你的项目中使用。</p>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://github.com/zzhzhouzhou/UI-handbook" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:text-white" aria-label="项目主页（GitHub）" title="项目主页">
                  <Icon.GitHub size={16} />
                </a>
                <a href="https://uihandbook.zzhzhou2026.workers.dev" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:text-white" aria-label="在线阅读" title="在线阅读">
                  <Icon.Globe size={16} />
                </a>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-6 dark:border-zinc-800">
              <div>
                形色场 UI Handbook · 用 React + Tailwind CSS 4 构建 · 所有示例代码可直接复制使用
              </div>
              <a href="#top" className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white">
                回到顶部 <Icon.ArrowUp size={14} />
              </a>
            </div>
            <p className="mt-4 max-w-2xl text-xs leading-6 text-zinc-400">
              推荐延伸阅读的库：Radix UI / Headless UI（无样式可访问组件）、cmdk（命令面板）、sonner（Toast）、vaul（底部面板）、@dnd-kit（拖拽）、Floating UI（定位）、framer-motion（动效）、@tanstack/react-virtual（虚拟列表）、date-fns（日期）。
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
