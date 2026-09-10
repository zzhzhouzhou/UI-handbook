import { useEffect, useRef, useState, type MouseEvent as RMouseEvent, type ReactElement } from "react";
import { Showcase, SectionHeader } from "../components/Showcase";
import { Button, Icon, Kbd } from "../components/primitives";
import { openCommandPalette } from "../components/CommandPalette";
import { cn } from "../utils/cn";

function NavbarDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 font-semibold">
            <span className="h-5 w-5 rounded-md bg-zinc-900 dark:bg-white" /> Acme
          </span>
          <ul className="hidden items-center gap-1 text-sm md:flex">
            {["产品", "方案", "定价", "文档"].map((t, i) => (
              <li key={t}>
                <a href="#" onClick={(e) => e.preventDefault()} className={cn("rounded-md px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800", i === 0 ? "text-zinc-900 dark:text-white" : "text-zinc-500")}>
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm">
            登录
          </Button>
          <Button size="sm">开始使用</Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="菜单" aria-expanded={open}>
          {open ? <Icon.X size={20} /> : <Icon.Menu size={20} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-zinc-200 p-3 md:hidden dark:border-zinc-800">
          {["产品", "方案", "定价", "文档"].map((t) => (
            <a key={t} href="#" onClick={(e) => e.preventDefault()} className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
              {t}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function TabsDemo() {
  const tabs = ["概览", "分析", "报告", "通知", "设置"];
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [ind, setInd] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const measure = () => {
      const el = refs.current[i];
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    // 窗口缩放 / 旋转 / 字体晚到都会改变 tab 宽度，用 ResizeObserver 跟随重测
    const list = refs.current[i]?.parentElement;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [i]);
  return (
    <div className="w-full max-w-md">
      <div
        className="relative flex border-b border-zinc-200 dark:border-zinc-800"
        role="tablist"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            const n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
            setI(n);
            refs.current[n]?.focus();
          }
        }}
      >
        {tabs.map((t, idx) => (
          <button
            key={t}
            role="tab"
            aria-selected={i === idx}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            onClick={() => setI(idx)}
            className={cn("px-4 pb-3 pt-1 text-sm transition-colors", i === idx ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200")}
          >
            {t}
          </button>
        ))}
        <span className="absolute bottom-[-1px] h-0.5 bg-zinc-900 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] dark:bg-white" style={{ left: ind.left, width: ind.width }} />
      </div>
      <div key={i} role="tabpanel" className="animate-fade-up py-5 text-sm text-zinc-600 dark:text-zinc-400">
        这是「{tabs[i]}」面板的内容。切换时下划线指示器会平滑滑动到目标位置，内容淡入。
      </div>
    </div>
  );
}

function BreadcrumbDemo() {
  return (
    <div className="space-y-4">
      <nav aria-label="面包屑" className="flex items-center gap-1.5 text-sm">
        <a href="#" onClick={(e) => e.preventDefault()} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
          <Icon.Home size={14} />
        </a>
        <Icon.ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700" />
        <a href="#" onClick={(e) => e.preventDefault()} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
          项目
        </a>
        <Icon.ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700" />
        <button className="rounded px-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">…</button>
        <Icon.ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700" />
        <span aria-current="page" className="font-medium">
          设计系统 v2
        </span>
      </nav>
      <nav aria-label="面包屑" className="flex items-center text-sm">
        {["首页", "组件", "导航"].map((t, i, a) => (
          <span key={t} className="flex items-center">
            <span className={cn("px-2", i === a.length - 1 ? "font-medium" : "text-zinc-500")}>{t}</span>
            {i < a.length - 1 && <span className="text-zinc-300 dark:text-zinc-700">/</span>}
          </span>
        ))}
      </nav>
    </div>
  );
}

function PaginationDemo() {
  const total = 12;
  const [p, setP] = useState(5);
  const pages = (): (number | "…")[] => {
    const s = new Set([1, total, p - 1, p, p + 1].filter((x) => x >= 1 && x <= total));
    const arr = [...s].sort((a, b) => a - b);
    const out: (number | "…")[] = [];
    arr.forEach((n, i) => {
      if (i > 0 && n - arr[i - 1] > 1) out.push("…");
      out.push(n);
    });
    return out;
  };
  const btn = "h-9 min-w-9 rounded-md px-2 text-sm transition-colors disabled:opacity-40";
  return (
    <div className="flex flex-col items-center gap-6">
      <nav className="flex items-center gap-1" aria-label="分页">
        <button className={cn(btn, "hover:bg-zinc-100 dark:hover:bg-zinc-800")} disabled={p === 1} onClick={() => setP(p - 1)} aria-label="上一页">
          <Icon.ChevronLeft />
        </button>
        {pages().map((n, i) =>
          n === "…" ? (
            <span key={`e${i}`} className="px-1 text-zinc-400">
              …
            </span>
          ) : (
            <button key={n} onClick={() => setP(n)} aria-current={n === p ? "page" : undefined} className={cn(btn, n === p ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}>
              {n}
            </button>
          ),
        )}
        <button className={cn(btn, "hover:bg-zinc-100 dark:hover:bg-zinc-800")} disabled={p === total} onClick={() => setP(p + 1)} aria-label="下一页">
          <Icon.ChevronRight />
        </button>
      </nav>
      <div className="flex w-full max-w-md items-center justify-between text-sm text-zinc-500">
        <span>
          显示 {(p - 1) * 10 + 1}–{p * 10} 条，共 120 条
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={p === 1} onClick={() => setP(p - 1)}>
            上一页
          </Button>
          <Button variant="outline" size="sm" disabled={p === total} onClick={() => setP(p + 1)}>
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}

function SidebarDemo() {
  const [active, setActive] = useState("仪表盘");
  const [collapsed, setCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState(true);
  const items: [string, (p: { size?: number; className?: string }) => ReactElement][] = [
    ["仪表盘", Icon.Home],
    ["收件箱", Icon.Mail],
    ["文件", Icon.Folder],
    ["成员", Icon.User],
    ["设置", Icon.Settings],
  ];
  return (
    <div className="flex h-72 w-full max-w-xl overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <aside className={cn("flex flex-col border-r border-zinc-200 bg-zinc-50 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950", collapsed ? "w-14" : "w-52")}>
        <div className="flex h-12 items-center justify-between px-3">
          {!collapsed && <span className="text-sm font-semibold">工作区</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800" aria-label="折叠侧栏">
            <Icon.ChevronLeft className={cn("transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 px-2">
          {items.map(([t, I]) => (
            <div key={t}>
              <button
                onClick={() => {
                  setActive(t);
                  if (t === "文件") setOpenGroup(!openGroup);
                }}
                title={collapsed ? t : undefined}
                className={cn("flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors", active === t ? "bg-white font-medium text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white" : "text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800/60")}
              >
                <I size={16} className="shrink-0" />
                {!collapsed && <span className="flex-1 text-left">{t}</span>}
                {!collapsed && t === "文件" && <Icon.ChevronDown size={14} className={cn("transition-transform", openGroup && "rotate-180")} />}
                {!collapsed && t === "收件箱" && <span className="rounded-full bg-zinc-900 px-1.5 text-[10px] text-white dark:bg-white dark:text-zinc-900">8</span>}
              </button>
              {t === "文件" && openGroup && !collapsed && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-zinc-200 pl-3 dark:border-zinc-800">
                  {["设计稿", "合同", "归档"].map((s) => (
                    <button key={s} onClick={() => setActive(s)} className={cn("block w-full rounded-md px-2 py-1 text-left text-[13px]", active === s ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200")}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">{active}</div>
    </div>
  );
}

function StepperDemo() {
  const steps = ["账户信息", "团队设置", "邀请成员", "完成"];
  const [s, setS] = useState(1);
  return (
    <div className="w-full max-w-lg">
      <ol className="flex items-center">
        {steps.map((t, i) => (
          <li key={t} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
            <button onClick={() => setS(i)} className="relative flex flex-col items-center gap-2">
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-all", i < s && "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900", i === s && "border-zinc-900 ring-4 ring-zinc-900/10 dark:border-white dark:ring-white/10", i > s && "border-zinc-300 text-zinc-400 dark:border-zinc-700")}>
                {i < s ? <Icon.Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn("absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] min-[420px]:text-xs", i <= s ? "text-zinc-900 dark:text-white" : "text-zinc-400")}>{t}</span>
            </button>
            {i < steps.length - 1 && (
              <div className="mx-3 h-px flex-1 bg-zinc-200 dark:bg-zinc-800">
                <div className="h-full bg-zinc-900 transition-all duration-500 dark:bg-white" style={{ width: i < s ? "100%" : "0%" }} />
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-14 flex justify-center gap-2">
        <Button variant="outline" size="sm" disabled={s === 0} onClick={() => setS(s - 1)}>
          上一步
        </Button>
        <Button size="sm" disabled={s === steps.length - 1} onClick={() => setS(s + 1)}>
          下一步
        </Button>
      </div>
    </div>
  );
}

function DropdownDemo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("keydown", k);
    };
  }, []);
  const item = "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800";
  return (
    <div ref={ref} className="relative">
      <Button variant="outline" onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open}>
        操作 <Icon.ChevronDown className={cn("transition-transform", open && "rotate-180")} />
      </Button>
      {open && (
        <div role="menu" className="absolute left-0 z-20 mt-2 w-52 origin-top-left animate-scale-in rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <div className="px-2 py-1.5 text-xs text-zinc-400">我的账户</div>
          <button role="menuitem" className={item}>
            <Icon.User /> 个人资料 <span className="ml-auto flex gap-0.5"><Kbd>⇧</Kbd><Kbd>P</Kbd></span>
          </button>
          <button role="menuitem" className={item}>
            <Icon.Settings /> 设置 <span className="ml-auto"><Kbd>,</Kbd></span>
          </button>
          <button role="menuitem" className={cn(item, "justify-between")}>
            <span className="flex items-center gap-2">
              <Icon.Folder /> 切换团队
            </span>
            <Icon.ChevronRight size={14} className="text-zinc-400" />
          </button>
          <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <button role="menuitem" className={cn(item, "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40")}>
            <Icon.Trash /> 删除账户
          </button>
        </div>
      )}
    </div>
  );
}

function CommandPaletteDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <button type="button" onClick={openCommandPalette} className="flex h-10 w-72 max-w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-400 shadow-sm transition hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900">
        <Icon.Search /> 搜索组件、跳转章节
        <span className="ml-auto flex gap-0.5">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      <p className="text-xs text-zinc-400">点击上面的按钮，或直接按 ⌘K / Ctrl+K —— 打开的就是本站真实的全局命令面板（全屏模糊 + 居中）。</p>
    </div>
  );
}

function ContextMenuDemo() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<number | undefined>(undefined);
  // 长按打开菜单后，松手产生的合成 click 会立即触发 window 的 close，需要跳过一次
  const suppressClick = useRef(false);
  useEffect(() => {
    const close = () => {
      if (suppressClick.current) {
        suppressClick.current = false;
        return;
      }
      setPos(null);
    };
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.clearTimeout(pressTimer.current);
    };
  }, []);
  const openAt = (clientX: number, clientY: number) => {
    const r = ref.current!.getBoundingClientRect();
    // 菜单 w-44（176px）、四项约 150px 高，钳制在容器内防止边缘裁切
    setPos({
      x: Math.max(4, Math.min(clientX - r.left, r.width - 176 - 4)),
      y: Math.max(4, Math.min(clientY - r.top, r.height - 150 - 4)),
    });
  };
  const onCtx = (e: RMouseEvent) => {
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };
  // 移动端：长按 500ms 触发；手指移动超过 8px（滚动意图）则取消
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    pressStart.current = { x: e.clientX, y: e.clientY };
    const { clientX, clientY } = e;
    window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      suppressClick.current = true;
      openAt(clientX, clientY);
    }, 500);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pressStart.current) return;
    if (Math.hypot(e.clientX - pressStart.current.x, e.clientY - pressStart.current.y) > 8) {
      pressStart.current = null;
      cancelPress();
    }
  };
  const cancelPress = () => window.clearTimeout(pressTimer.current);
  const item = "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800";
  return (
    <div
      ref={ref}
      onContextMenu={onCtx}
      onPointerDown={onPointerDown}
      onPointerUp={() => {
        pressStart.current = null;
        cancelPress();
      }}
      onPointerMove={onPointerMove}
      onPointerCancel={() => {
        pressStart.current = null;
        cancelPress();
      }}
      className="relative flex h-44 w-full max-w-md touch-manipulation select-none items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700"
    >
      在此区域右键（或长按）
      {pos && (
        <div role="menu" style={{ left: pos.x, top: pos.y }} className="absolute z-20 w-44 animate-scale-in rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <button className={item}>
            <Icon.Copy /> 复制 <span className="ml-auto text-[11px] text-zinc-400">⌘C</span>
          </button>
          <button className={item}>
            <Icon.Image /> 重命名
          </button>
          <button className={item}>
            <Icon.Folder /> 移动到…
          </button>
          <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <button className={cn(item, "text-red-600")}>
            <Icon.Trash /> 删除
          </button>
        </div>
      )}
    </div>
  );
}

function DockDemo() {
  const [mx, setMx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  // 触屏没有 hover，放大效果无意义，直接关闭
  const [hoverable] = useState(() => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches);
  const icons = [Icon.Home, Icon.Mail, Icon.Folder, Icon.Image, Icon.Settings, Icon.User, Icon.Bell];
  const onMove = (e: React.MouseEvent) => {
    if (!hoverable) return;
    setMx(e.clientX - ref.current!.getBoundingClientRect().left);
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setMx(null)}
      className="flex h-20 items-end justify-center gap-3 rounded-2xl border border-zinc-200 bg-white/80 px-3 pb-2 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80"
    >
      {icons.map((I, i) => {
        // 图标布局尺寸固定（40px），缩放用 transform 完成——布局不回流，中心点公式始终准确
        const center = 12 + 8 + i * (40 + 12) + 20;
        const d = mx === null ? 999 : Math.abs(mx - center);
        const scale = hoverable ? Math.max(1, 1.6 - d / 100) : 1;
        return (
          <button key={i} style={{ transform: `scale(${scale})` }} className="flex h-10 w-10 origin-bottom items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-transform duration-150 ease-out dark:bg-zinc-800 dark:text-zinc-200" aria-label={`app ${i}`}>
            <I size={20} />
          </button>
        );
      })}
    </div>
  );
}

function ScrollProgressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const onScroll = () => {
    const el = ref.current!;
    // 分母可能为 0（内容不溢出时），避免得到 NaN%
    setP((el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)) * 100);
  };
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-zinc-200 dark:bg-zinc-800">
        <div className="h-full bg-zinc-900 dark:bg-white" style={{ width: `${p}%` }} />
      </div>
      <div className={cn("sticky top-0 z-[5] flex items-center justify-between border-b bg-white/80 px-4 backdrop-blur transition-all duration-300 dark:bg-zinc-900/80", p > 5 ? "h-10 border-zinc-200 dark:border-zinc-800" : "h-14 border-transparent")}>
        <span className={cn("font-semibold transition-all", p > 5 ? "text-sm" : "text-base")}>文章标题</span>
        <span className="font-mono text-[11px] text-zinc-400">{Math.round(p)}%</span>
      </div>
      <div ref={ref} onScroll={onScroll} className="h-48 overflow-auto px-4 pb-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i} className="mb-3">
            段落 {i + 1}：向下滚动可以看到顶部进度条增长，同时头部高度从 56px 收缩到 40px，这是内容型页面常见的“收缩头部”模式。
          </p>
        ))}
      </div>
      <button onClick={() => ref.current?.scrollTo({ top: 0, behavior: "smooth" })} className={cn("absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition-all duration-300 dark:bg-white dark:text-zinc-900", p > 20 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0")} aria-label="回到顶部">
        <Icon.ArrowUp />
      </button>
    </div>
  );
}

function BottomTabsDemo() {
  const tabs = [["首页", Icon.Home], ["发现", Icon.Compass], ["消息", Icon.Mail], ["我的", Icon.User]] as const;
  const [i, setI] = useState(0);
  return (
    <nav aria-label="底部导航" className="flex w-full max-w-xs rounded-2xl border border-zinc-200 bg-white/95 px-2 py-2 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      {tabs.map(([t, I], k) => (
        <button
          key={t}
          onClick={() => setI(k)}
          aria-current={i === k ? "page" : undefined}
          className={cn("relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] transition-colors", i === k ? "text-zinc-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}
        >
          {/* 红点锚定在图标右上角，ring 与导航栏底色一致 */}
          <span className="relative">
            <I size={20} />
            {t === "消息" && <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900" />}
          </span>
          {t}
          {/* 指示条锚定到导航栏下缘（-bottom-2 = 按钮的 py-2 内边距） */}
          {i === k && <span className="absolute -bottom-2 h-0.5 w-6 rounded-full bg-zinc-900 dark:bg-white" />}
        </button>
      ))}
    </nav>
  );
}


function NotificationPanelDemo() {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const items = [
    ["评论", "Li Hua 评论了你的组件：按钮的焦点环可以再明显一点。", "5 分钟前", !read],
    ["系统", "你的组件库已通过设计走查，可以发布到生产环境。", "1 小时前", !read],
    ["关注", "Wang Fang 收藏了你的「命令面板」组件。", "昨天", false],
  ] as const;
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-label="通知" aria-expanded={open} className="relative grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
        <Icon.Bell />
        {!read && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950" />}
      </button>
      {open && (
        <div role="dialog" aria-label="通知列表" className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] animate-scale-in overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
            <span className="text-sm font-medium">通知</span>
            <button onClick={() => setRead(true)} className="text-xs text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white">全部已读</button>
          </div>
          {items.map(([tag, text, time, unread]) => (
            <div key={text} className={cn("flex gap-3 border-b border-zinc-100 px-4 py-3 text-sm last:border-0 dark:border-zinc-800", unread && "bg-zinc-50 dark:bg-zinc-800/40")}>
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900 dark:bg-white" style={{ opacity: unread ? 1 : 0 }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{tag}</span>
                  <span className="text-[10px] text-zinc-400">{time}</span>
                </div>
                <p className="mt-0.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  return (
    <section>
      <SectionHeader
        id="navigation"
        index="04"
        title="导航"
        en="Navigation"
        intro="导航告诉用户「我在哪里、能去哪里、怎么回去」。从顶栏、标签页、面包屑到 ⌘K 命令面板、macOS Dock 与移动端底部标签栏——桌面与移动端各有自己的导航惯例，但内核相同：当前项用颜色与字重区分，而不是彩色高亮块；每一层入口都保持可预期。这一章还包含通知面板这类「以导航为入口」的衍生组件。"
        icon={<Icon.Compass />}
      />

      <Showcase
        id="navbar"
        title="顶部导航栏"
        en="Navbar"
        description="Logo + 链接组 + 行动按钮的三段式布局。移动端折叠成汉堡菜单。当前页链接用深色文字，其他用灰色，无需下划线。"
        usage={["网站 / 应用的全局导航。", "滚动后可加 backdrop-blur + 半透明背景做成粘性头部。"]}
        points={["h-14 或 h-16，两侧 px-4 ~ px-6。", "链接 hover 用淡灰背景块（rounded-md px-3 py-1.5）代替下划线。", "md:hidden / hidden md:flex 切换移动与桌面布局。", "粘性：sticky top-0 z-40 bg-white/80 backdrop-blur border-b。"]}
        a11y={["<nav> 元素 + aria-label；汉堡按钮 aria-expanded、aria-controls。", "当前页链接加 aria-current=\"page\"。"]}
        code={`<nav className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200
                bg-white/80 px-6 backdrop-blur">
  <div className="flex items-center gap-8">
    <Logo />
    <ul className="hidden gap-1 text-sm md:flex">
      {links.map(l => (
        <li key={l.href}><a href={l.href} aria-current={l.active ? "page" : undefined}
          className={cn("rounded-md px-3 py-1.5 hover:bg-zinc-100", l.active ? "text-zinc-900" : "text-zinc-500")}>
          {l.label}</a></li>
      ))}
    </ul>
  </div>
  <div className="hidden gap-2 md:flex"><Button variant="ghost">登录</Button><Button>开始使用</Button></div>
  <button className="md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}><MenuIcon /></button>
</nav>`}
      >
        <NavbarDemo />
      </Showcase>

      <Showcase
        id="tabs"
        title="标签页（滑动指示器）"
        en="Tabs"
        level="进阶"
        description="下划线指示器根据选中 tab 的实际位置与宽度平滑滑动，比每个 tab 各自画下划线更有质感。内容切换时淡入。"
        usage={["同一层级的内容视图切换。", "标签数量 2–7 个；超过用下拉或滚动。"]}
        points={[
          "用 ref 数组收集每个 tab 按钮，选中变化时读取 offsetLeft / offsetWidth 更新指示器。",
          "指示器绝对定位在 bottom-[-1px] 与容器底边框重叠。",
          "内容面板加 key={index} 让 React 重新挂载以触发进入动画。",
          "窗口 resize 时需要重新测量（可用 ResizeObserver）。",
        ]}
        a11y={["role=\"tablist\" / \"tab\" / \"tabpanel\"，aria-selected，aria-controls。", "支持 ← → 方向键切换焦点。"]}
        code={`const refs = useRef([]);
const [ind, setInd] = useState({ left: 0, width: 0 });
useEffect(() => {
  const el = refs.current[active];
  if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
}, [active]);

<div className="relative flex border-b border-zinc-200" role="tablist">
  {tabs.map((t, i) => (
    <button key={t} ref={el => refs.current[i] = el} role="tab" aria-selected={i === active}
      onClick={() => setActive(i)}
      className={cn("px-4 pb-3 text-sm", i === active ? "text-zinc-900" : "text-zinc-500")}>{t}</button>
  ))}
  <span className="absolute -bottom-px h-0.5 bg-zinc-900 transition-all duration-300"
    style={{ left: ind.left, width: ind.width }} />
</div>`}
      >
        <TabsDemo />
      </Showcase>

      <Showcase
        id="breadcrumb"
        title="面包屑"
        en="Breadcrumb"
        description="显示当前页面在层级结构中的位置。层级过深时折叠中间项为「…」。最后一项是当前页，不可点击。"
        usage={["文件系统、多级分类、后台管理系统。", "不适合扁平结构的网站。"]}
        points={["分隔符用 ChevronRight 或 /，颜色比文字淡两级。", "超过 4 级时折叠中间为下拉菜单。", "最后一项加粗且 aria-current=\"page\"。"]}
        code={`<nav aria-label="面包屑" className="flex items-center gap-1.5 text-sm">
  <a href="/" className="text-zinc-500 hover:text-zinc-900">首页</a>
  <ChevronRight size={14} className="text-zinc-300" />
  <a href="/projects" className="text-zinc-500 hover:text-zinc-900">项目</a>
  <ChevronRight size={14} className="text-zinc-300" />
  <span aria-current="page" className="font-medium">设计系统</span>
</nav>`}
      >
        <BreadcrumbDemo />
      </Showcase>

      <Showcase
        id="pagination"
        title="分页"
        en="Pagination"
        description="数字分页显示首尾页 + 当前页前后各一页，中间用省略号折叠。简洁场景使用「上一页 / 下一页 + 计数」。"
        usage={["表格、搜索结果、文章列表。", "移动端或无限内容优先考虑无限滚动 / 加载更多。"]}
        points={["页码集合 = {1, total, p-1, p, p+1}，排序后相邻差 > 1 处插入省略号。", "当前页实心，其他 hover 浅灰。", "首尾禁用按钮 opacity-40 + disabled。", "同时显示「显示 x–y 条，共 n 条」。"]}
        code={`const pages = () => {
  const s = new Set([1, total, p - 1, p, p + 1].filter(x => x >= 1 && x <= total));
  const arr = [...s].sort((a, b) => a - b);
  const out = [];
  arr.forEach((n, i) => { if (i && n - arr[i - 1] > 1) out.push("…"); out.push(n); });
  return out;
};`}
      >
        <PaginationDemo />
      </Showcase>

      <Showcase
        id="sidebar"
        title="侧边栏导航"
        en="Sidebar"
        level="进阶"
        description="后台应用的主导航，支持折叠为图标模式、分组展开、计数徽章。选中项用白色卡片 + 细阴影从灰色背景中「浮起」。"
        usage={["管理后台、文档站、IDE 类应用。", "移动端转为抽屉（Drawer）。"]}
        points={["宽度过渡：w-52 ↔ w-14 + transition-all；折叠时隐藏文字并给按钮加 title 提示。", "选中态 bg-white shadow-sm（深色 bg-zinc-800）。", "子级用左边框 border-l + pl-3 表示层级。", "折叠状态存 localStorage 记忆。"]}
        code={`<aside className={cn("flex flex-col border-r bg-zinc-50 transition-all duration-300", collapsed ? "w-14" : "w-52")}>
  <nav className="space-y-0.5 px-2">
    {items.map(it => (
      <a key={it.href} href={it.href} title={collapsed ? it.label : undefined}
        className={cn("flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm",
          it.active ? "bg-white font-medium shadow-sm" : "text-zinc-600 hover:bg-zinc-200/60")}>
        <it.icon size={16} />
        {!collapsed && <span>{it.label}</span>}
      </a>
    ))}
  </nav>
</aside>`}
      >
        <SidebarDemo />
      </Showcase>

      <Showcase
        id="stepper"
        title="步骤条"
        en="Stepper"
        description="多步骤流程的进度指示：已完成（实心 + 勾）、当前（描边 + 外环）、未开始（灰色描边）。连接线随进度填充。"
        usage={["注册引导、结账流程、表单向导。", "步骤 3–6 个为宜。"]}
        points={["三种状态分别定义 class；连接线用 flex-1 h-px 容器 + 内部宽度 0→100% 过渡。", "当前步 ring-4 ring-zinc-900/10 突出。", "标签绝对定位：button 加 relative，标签用 top-full + left-1/2 -translate-x-1/2 锚定到圆点正下方。", "允许点击已完成步骤回退。"]}
        code={`<span className={cn("flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium",
  i < step  && "border-zinc-900 bg-zinc-900 text-white",
  i === step && "border-zinc-900 ring-4 ring-zinc-900/10",
  i > step  && "border-zinc-300 text-zinc-400")}>
  {i < step ? <Check size={14} /> : i + 1}
</span>
<div className="mx-3 h-px flex-1 bg-zinc-200">
  <div className="h-full bg-zinc-900 transition-all duration-500" style={{ width: i < step ? "100%" : 0 }} />
</div>`}
      >
        <StepperDemo />
      </Showcase>

      <Showcase
        id="dropdown"
        title="下拉菜单"
        en="Dropdown Menu"
        description="点击触发的操作菜单，包含分组标题、快捷键提示、子菜单指示、分割线和危险操作。点击外部或 Esc 关闭。"
        usage={["用户菜单、更多操作（···）、表格行操作。"]}
        points={["点击外部关闭：document mousedown 监听 + ref.contains 判断。", "出现动画：origin-top-left + scale 0.96→1 + 淡入，180ms。", "危险项红色，用分割线与普通项隔开。", "生产环境建议用 Radix / Headless UI 处理焦点管理与定位。"]}
        a11y={["触发按钮 aria-haspopup=\"menu\" aria-expanded；菜单 role=\"menu\"；项 role=\"menuitem\"。", "打开后焦点移入菜单，↑↓ 移动，Esc 关闭并返回触发器。"]}
        previewClassName="overflow-visible"
        code={`useEffect(() => {
  const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
  const onKey = (e) => e.key === "Escape" && setOpen(false);
  document.addEventListener("mousedown", onDown);
  document.addEventListener("keydown", onKey);
  return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
}, []);

{open && (
  <div role="menu" className="absolute mt-2 w-52 origin-top-left animate-scale-in rounded-lg border bg-white p-1 shadow-lg">
    <button role="menuitem" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100">…</button>
  </div>
)}`}
      >
        <DropdownDemo />
      </Showcase>

      <Showcase
        id="command"
        title="命令面板 ⌘K"
        en="Command Palette"
        level="高级"
        description="现代应用的标志性功能：一个全局快捷键唤起的搜索框，可以执行命令、跳转页面、搜索内容。Linear、Notion、VS Code 都在用。试试按 ⌘K / Ctrl+K。"
        usage={["功能繁多的专业工具。", "替代深层菜单，让高级用户用键盘完成一切。"]}
        points={[
          "全局 keydown 监听 metaKey/ctrlKey + k，preventDefault 阻止浏览器默认行为；Esc 关闭。",
          "遮罩 fixed inset-0 bg-black/40 + backdrop-blur-md 全屏毛玻璃；外层 flex items-center justify-center 让面板真正居中。",
          "命令按组渲染，过滤后计算扁平索引用于键盘高亮，↑↓ 循环、Enter 跳转。",
          "数据源直接用本站目录 NAV，选中后 close 再 smoothScrollTo 目标锚点。",
          "底部显示键盘操作提示与结果计数。",
        ]}
        a11y={["打开时 autoFocus 输入框，关闭后恢复焦点。", "role=\"dialog\" aria-modal；列表 role=\"listbox\"。"]}
        code={`useEffect(() => {
  const k = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); toggle(); }
    if (e.key === "Escape") close();
  };
  window.addEventListener("keydown", k);
  return () => window.removeEventListener("keydown", k);
}, []);

{open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={close}>
    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
    <div onClick={e => e.stopPropagation()} className="relative z-10 w-full max-w-lg animate-scale-in rounded-2xl border bg-white shadow-2xl">
      <input autoFocus placeholder="输入命令…" className="h-14 w-full px-4 outline-none" />
      <div className="max-h-72 overflow-auto p-2">{/* groups */}</div>
    </div>
  </div>
)}`}
      >
        <CommandPaletteDemo />
      </Showcase>

      <Showcase
        id="contextmenu"
        title="右键菜单"
        en="Context Menu"
        level="进阶"
        description="在触发位置弹出的上下文操作菜单。相对容器定位，点击任意处或滚动时关闭。"
        usage={["文件管理器、画布、表格行、卡片的快捷操作。"]}
        points={["onContextMenu 中 e.preventDefault() 阻止原生菜单，记录相对容器的坐标。", "坐标要钳制在容器内（min(x, containerWidth - menuWidth)），防止边缘被裁切。", "window click 与 scroll（捕获阶段）时关闭。", "移动端用长按触发：pointerdown (touch) + 500ms 定时器，移动超过 8px 视为滚动并取消；打开后要忽略随后合成的 click。"]}
        code={`const onContextMenu = (e) => {
  e.preventDefault();
  const r = ref.current.getBoundingClientRect();
  setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
};
useEffect(() => {
  const close = () => setPos(null);
  window.addEventListener("click", close);
  window.addEventListener("scroll", close, true);
  return () => { window.removeEventListener("click", close); window.removeEventListener("scroll", close, true); };
}, []);`}
      >
        <ContextMenuDemo />
      </Showcase>

      <Showcase
        id="dock"
        title="macOS Dock 放大"
        en="Magnifying Dock"
        level="高级"
        description="鼠标靠近的图标按距离放大，形成 macOS Dock 的鱼眼效果。每个图标的缩放 = f(鼠标与图标中心的距离)。"
        usage={["应用启动器、工具栏、个人主页的社交链接。", "纯装饰性的精致感。"]}
        previewClassName="overflow-visible"
        points={[
          "容器 onMouseMove 记录鼠标 x（相对容器）。",
          "每个图标计算中心位置 center，distance = |mouseX − center|，scale = max(1, maxScale − distance / falloff)。",
          "缩放用 transform: scale() 而不是改 width/height：布局尺寸不变，中心点公式始终准确，也不会出现整条 Dock「呼吸」抖动。",
          "触屏没有 hover，用 matchMedia('(hover: hover)') 检测并关闭放大。",
          "用 framer-motion 的 useSpring 可以获得更自然的弹性。",
        ]}
        code={`const [mx, setMx] = useState(null);
const hoverable = matchMedia("(hover: hover)").matches;
<div onMouseMove={e => setMx(e.clientX - ref.current.getBoundingClientRect().left)} onMouseLeave={() => setMx(null)}
  className="flex items-end gap-3 rounded-2xl border bg-white/80 px-3 pb-2 backdrop-blur">
  {icons.map((Icon, i) => {
    const center = PAD + i * (SIZE + GAP) + SIZE / 2;
    const d = mx === null ? Infinity : Math.abs(mx - center);
    const scale = hoverable ? Math.max(1, 1.6 - d / 100) : 1;
    return <button key={i} style={{ transform: \`scale(\${scale})\` }}
      className="h-10 w-10 origin-bottom rounded-xl bg-zinc-100 transition-transform duration-150" />;
  })}
</div>`}
      >
        <DockDemo />
      </Showcase>

      <Showcase
        id="scroll-progress"
        title="阅读进度 · 收缩头部 · 回到顶部"
        en="Scroll Progress · Shrinking Header · Back to Top"
        level="进阶"
        description="三个滚动驱动的模式打包演示：顶部细进度条、随滚动收缩的粘性头部、滚动一定距离后出现的回到顶部按钮。"
        usage={["长文阅读页、文档、博客。"]}
        points={[
          "进度 = scrollTop / (scrollHeight − clientHeight)。窗口级用 window.scrollY 和 document.documentElement。",
          "头部 sticky top-0 + 根据进度切换 h-14 / h-10 + transition-all。",
          "回到顶部按钮用 translate-y + opacity 过渡出现，pointer-events-none 防止误触。",
          "现代浏览器可用 CSS animation-timeline: scroll() 零 JS 实现进度条。",
        ]}
        code={`/* 纯 CSS 滚动进度条（Chrome 115+） */
.progress {
  position: fixed; top: 0; left: 0; height: 2px; width: 100%;
  background: #18181b; transform-origin: left;
  animation: grow linear both;
  animation-timeline: scroll();
}
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}
        codeLang="css"
      >
        <ScrollProgressDemo />
      </Showcase>

      <Showcase
        id="bottom-tabs"
        title="底部标签栏"
        en="Bottom Tab Bar"
        level="进阶"
        description="移动端 App 最常见的导航形态：3–5 个入口平铺底部，拇指热区。选中项用颜色加深 + 顶部指示条区分，可以叠加未读红点与数字角标。"
        usage={["移动端 Web App、PWA、小程序外壳。", "入口 ≤ 5 个；更多用「更多」页收拢。"]}
        points={["fixed bottom-0 inset-x-0 z-40 + 安全区：padding-bottom: env(safe-area-inset-bottom)。", "半透明背景 bg-white/95 + backdrop-blur，内容从其下滚过。", "选中态同时改变颜色与 2px 指示条，比只变色更清晰。", "触控目标整格可点（≥ 44px 高），图标与文字一起响应。"]}
        a11y={["nav + aria-label；当前项 aria-current=\"page\"。", "红点纯装饰时加 aria-hidden，或用 sr-only 文案说明「有未读」。"]}
        code={`<nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-white/95 px-2 py-2
                backdrop-blur [padding-bottom:env(safe-area-inset-bottom)]">
  {tabs.map(([label, Icon], k) => (
    <button key={label} aria-current={active === k ? "page" : undefined}
      className={cn("relative flex flex-1 flex-col items-center gap-1 text-[11px]",
        active === k ? "text-zinc-900" : "text-zinc-400")}>
      <span className="relative">
        <Icon size={20} />
        {/* 红点锚定图标右上角，ring 用导航栏底色「挖空」一圈 */}
        {hasUnread && <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />}
      </span>
      {label}
      {/* 指示条贴住导航栏下缘：-bottom-2 正好抵消按钮的 py-2 */}
      {active === k && <span className="absolute -bottom-2 h-0.5 w-6 rounded-full bg-zinc-900" />}
    </button>
  ))}
</nav>`}
      >
        <BottomTabsDemo />
      </Showcase>

      <Showcase
        id="notification-panel"
        title="通知面板"
        en="Notifications"
        level="进阶"
        description="铃铛按钮 + 下拉通知列表：未读红点、未读项浅底高亮、「全部已读」一键清除。点击外部自动关闭。"
        usage={["后台系统的消息中心入口。", "配合未读数角标与红点使用。"]}
        points={["铃铛按钮 aria-expanded；未读红点用 ring 与底色同色「挖空」。", "面板 absolute right-0 对齐按钮右缘，max-w 限制防止小屏溢出。", "未读项用浅底色 + 左侧圆点双重标识；「全部已读」只改一个 state。", "生产环境用轮询 / WebSocket 拉取新通知，未读数交给 React Query 缓存。"]}
        a11y={["未读红点纯装饰加 aria-hidden；数量信息用 sr-only 文案补充。", "面板 role=\"dialog\" + aria-label；Esc 关闭并归还焦点。"]}
        previewClassName="overflow-visible"
        code={`const [open, setOpen] = useState(false);
<div ref={ref} className="relative">
  <button aria-expanded={open} aria-label="通知" onClick={() => setOpen(!open)}
    className="relative grid h-10 w-10 place-items-center rounded-lg border">
    <Bell />
    {hasUnread && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
  </button>
  {open && (
    <div role="dialog" aria-label="通知列表"
      className="absolute right-0 z-20 mt-2 w-80 rounded-xl border bg-white shadow-xl">
      {items.map(it => <div className="flex gap-3 px-4 py-3">{/* … */}</div>)}
    </div>
  )}
</div>`}
      >
        <NotificationPanelDemo />
      </Showcase>

    </section>
  );
}
