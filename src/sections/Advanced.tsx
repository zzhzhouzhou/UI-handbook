import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Showcase, SectionHeader } from "../components/Showcase";
import { Button, Icon } from "../components/primitives";
import { cn } from "../utils/cn";

/* Marquee */
function MarqueeDemo() {
  const logos = ["Vercel", "Linear", "Notion", "Figma", "Stripe", "Raycast", "Arc", "Supabase"];
  return (
    <div className="w-full space-y-4">
      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* 两份内容各自成组并带 pr（= gap），translateX(-50%) 恰好移动一份的宽度，接缝处不会跳变 */}
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((g) => (
            <div key={g} aria-hidden={g === 1} className="flex shrink-0 gap-12 pr-12">
              {logos.map((l, i) => (
                <span key={i} className="text-xl font-semibold tracking-tight text-zinc-400">
                  {l}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee [animation-direction:reverse] [animation-duration:30s] group-hover:[animation-play-state:paused]">
          {[0, 1].map((g) => (
            <div key={g} aria-hidden={g === 1} className="flex shrink-0 gap-3 pr-3">
              {logos.map((l, i) => (
                <span key={i} className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm dark:border-zinc-800">
                  “{l} 让我们的效率提升了 3 倍”
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Typewriter */
function TypewriterDemo() {
  const words = ["设计师", "开发者", "产品经理", "创业者"];
  const [wi, setWi] = useState(0), [txt, setTxt] = useState(""), [del, setDel] = useState(false);
  const pauseTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(pauseTimer.current), []);
  useEffect(() => {
    const w = words[wi];
    const t = setTimeout(
      () => {
        if (!del) {
          setTxt(w.slice(0, txt.length + 1));
          if (txt.length + 1 === w.length) pauseTimer.current = window.setTimeout(() => setDel(true), 1200);
        } else {
          setTxt(w.slice(0, txt.length - 1));
          if (txt.length - 1 === 0) {
            setDel(false);
            setWi((wi + 1) % words.length);
          }
        }
      },
      del ? 50 : 110,
    );
    return () => clearTimeout(t);
  }, [txt, del, wi]);
  return (
    <div className="text-3xl font-semibold tracking-tight">
      为每一位<span className="text-zinc-400">{txt}</span>
      <span className="ml-0.5 inline-block h-8 w-0.5 translate-y-1 animate-caret bg-zinc-900 dark:bg-white" />
      而生
    </div>
  );
}

/* Scramble */
function ScrambleDemo() {
  const target = "DESIGN SYSTEMS";
  const chars = "!<>-_\\/[]{}—=+*^?#";
  const [out, setOut] = useState(target);
  const intervalRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(intervalRef.current), []);
  const run = () => {
    // 防重入：连续悬停时先清掉上一次的循环，避免多个 interval 同时写 out
    window.clearInterval(intervalRef.current);
    let frame = 0;
    const total = 30;
    intervalRef.current = window.setInterval(() => {
      frame++;
      setOut(
        target
          .split("")
          .map((c, i) => (c === " " ? " " : frame > i * 2 ? c : chars[Math.floor(Math.random() * chars.length)]))
          .join(""),
      );
      if (frame > total) window.clearInterval(intervalRef.current);
    }, 40);
  };
  return (
    <button onMouseEnter={run} onClick={run} className="font-mono text-2xl font-semibold tracking-widest">
      {out}
      <span className="mt-2 block text-center text-xs font-normal tracking-normal text-zinc-400">悬停触发</span>
    </button>
  );
}

/* Count up */
function Num({ to, go, suffix = "", decimals = 0 }: { to: number; go: number; suffix?: string; decimals?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now(), dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setV(to * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, go]);
  return (
    <span className="text-4xl font-semibold tracking-tight tabular-nums">
      {v.toLocaleString("zh-CN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

function CountUpDemo() {
  const [go, setGo] = useState(0);
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-3 gap-6 min-[420px]:gap-10 text-center">
        <div>
          <Num to={12840} go={go} suffix="+" />
          <div className="mt-1 text-xs text-zinc-500">活跃用户</div>
        </div>
        <div>
          <Num to={99.98} go={go} suffix="%" decimals={2} />
          <div className="mt-1 text-xs text-zinc-500">可用性</div>
        </div>
        <div>
          <Num to={4.9} go={go} decimals={1} />
          <div className="mt-1 text-xs text-zinc-500">平均评分</div>
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={() => setGo((g) => g + 1)}>
        重新播放
      </Button>
    </div>
  );
}

/* Scroll reveal */
function RevealDemo() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = ref.current!.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.shown = "true";
            io.unobserve(e.target);
          }
        }),
      { root: ref.current, threshold: 0.3 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="h-64 w-full max-w-md overflow-auto rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-40 text-center text-xs text-zinc-400">↓ 向下滚动</p>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }} className="rounded-lg border border-zinc-200 p-4 opacity-0 translate-y-6 transition-all duration-700 ease-out data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100 dark:border-zinc-800">
            <div className="text-sm font-medium">卡片 {i + 1}</div>
            <div className="text-xs text-zinc-500">进入视口时淡入上浮，相邻卡片交错延迟。</div>
          </div>
        ))}
      </div>
      <div className="h-32" />
    </div>
  );
}

/* Sticky stacking cards */
function StackDemo() {
  return (
    <div className="h-72 w-full max-w-md overflow-auto rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="py-3 text-center text-xs text-zinc-400">↓ 滚动查看卡片堆叠</p>
      {["第一步：定义令牌", "第二步：搭建原子组件", "第三步：组合成模式", "第四步：沉淀文档"].map((t, i) => (
        <div key={t} className="sticky px-4" style={{ top: 12 + i * 12 }}>
          <div className="mb-40 h-44 rounded-xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <span className="font-mono text-xs text-zinc-400">0{i + 1}</span>
            <div className="mt-2 text-lg font-semibold tracking-tight">{t}</div>
          </div>
        </div>
      ))}
      <div className="h-20" />
    </div>
  );
}

/* Infinite scroll */
function InfiniteDemo() {
  const [items, setItems] = useState(Array.from({ length: 12 }, (_, i) => i + 1));
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting && !loading && items.length < 60) {
          setLoading(true);
          timer.current = window.setTimeout(() => {
            setItems((it) => [...it, ...Array.from({ length: 10 }, (_, i) => it.length + i + 1)]);
            setLoading(false);
          }, 700);
        }
      },
      { root: root.current, rootMargin: "80px" },
    );
    if (sentinel.current) io.observe(sentinel.current);
    return () => io.disconnect();
  }, [items, loading]);
  return (
    <div ref={root} className="h-64 w-full max-w-sm overflow-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {items.map((i) => (
        <div key={i} className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 text-sm dark:border-zinc-800">
          <span className="h-8 w-8 rounded-md bg-zinc-100 dark:bg-zinc-800" />
          <span>列表项 {i}</span>
        </div>
      ))}
      <div ref={sentinel} className="flex h-12 items-center justify-center text-xs text-zinc-400">
        {items.length >= 60 ? "没有更多了" : loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" /> : ""}
      </div>
    </div>
  );
}

/* Sortable list */
function SortableDemo() {
  const [list, setList] = useState(["收件箱", "今天", "即将到来", "项目", "标签"]);
  // Pointer Events 拖拽：HTML5 DnD 在触屏上不触发
  const dragIdx = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const onDown = (e: RPointerEvent, i: number) => {
    dragIdx.current = i;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: RPointerEvent) => {
    if (dragIdx.current === null) return;
    setDragging(dragIdx.current);
    const hit = itemRefs.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return e.clientY >= r.top && e.clientY <= r.bottom;
    });
    setOver(hit >= 0 ? hit : null);
  };
  const onUp = () => {
    const from = dragIdx.current;
    const to = over;
    if (from !== null && to !== null && from !== to) {
      const l = [...list];
      const [m] = l.splice(from, 1);
      l.splice(to, 0, m);
      setList(l);
    }
    dragIdx.current = null;
    setDragging(null);
    setOver(null);
  };
  return (
    <ul className="w-full max-w-64 space-y-1.5">
      {list.map((it, i) => (
        <li
          key={it}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          onPointerDown={(e) => onDown(e, i)}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={cn("flex cursor-grab touch-none items-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm shadow-sm transition-all active:cursor-grabbing dark:bg-zinc-900", (over === i || dragging === i) ? "border-zinc-900 scale-[1.02] dark:border-white" : "border-zinc-200 dark:border-zinc-800", dragging === i && "opacity-50")}
        >
          <Icon.Grip size={14} className="text-zinc-300" />
          {it}
        </li>
      ))}
    </ul>
  );
}

/* Confetti */
function ConfettiDemo() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  const fire = () => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio, 1.5);
    c.width = c.offsetWidth * dpr;
    c.height = c.offsetHeight * dpr;
    const dark = document.documentElement.classList.contains("dark");
    const cols = dark ? ["#fff", "#d4d4d8", "#a1a1aa", "#71717a"] : ["#18181b", "#3f3f46", "#71717a", "#a1a1aa"];
    const ps = Array.from({ length: 120 }, () => {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.2, s = (6 + Math.random() * 8) * dpr;
      return { x: c.width / 2, y: c.height, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, w: (4 + Math.random() * 4) * dpr, h: (6 + Math.random() * 6) * dpr, col: cols[Math.floor(Math.random() * cols.length)], life: 1 };
    });
    // raf 存在 ref 里：连点时先取消上一轮循环，否则两轮循环会同时画同一块画布
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      ps.forEach((p) => {
        p.vy += 0.25 * dpr;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        p.life -= 0.008;
        if (p.life <= 0) return;
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive) rafRef.current = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, c.width, c.height);
    };
    tick();
  };
  return (
    <div className="relative flex h-56 w-full max-w-md items-end justify-center pb-6">
      <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />
      <Button onClick={fire}>🎉 庆祝一下</Button>
    </div>
  );
}

/* Swipe to delete */
function SwipeDemo() {
  const INITIAL_ITEMS = ["回复设计评审邮件", "更新组件文档", "整理 Figma 文件"];
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [dx, setDx] = useState<Record<string, number>>({});
  const start = useRef<{ x: number; id: string } | null>(null);
  // 实时位移存 ref：pointerup 的闭包可能落后于最后一次 move 的 setState
  const dxLive = useRef(0);
  const THRESHOLD = 64;
  const onDown = (e: RPointerEvent, id: string) => {
    // preventDefault：让这次手势不再合成 click，拖拽松手时不会误触别的元素
    e.preventDefault();
    dxLive.current = 0;
    start.current = { x: e.clientX, id };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* 捕获失败时退化为普通监听，不影响拖拽 */
    }
  };
  const onMove = (e: RPointerEvent, id: string) => {
    if (!start.current || start.current.id !== id) return;
    // 钳制到 -80（= 按钮宽度）：滑得再远也不会露出按钮右侧的深色空隙
    const next = Math.min(0, Math.max(-80, e.clientX - start.current!.x));
    dxLive.current = next;
    setDx((d) => ({ ...d, [id]: next }));
  };
  const onUp = (id: string) => {
    // 必须有配对的 pointerdown 才处理：指针落在滑出的红色条上时不会触发 onDown，
    // 若不清空 dxLive，残留的 -80 会让下一次松手误删别的行——连环删光的根源
    if (!start.current || start.current.id !== id) return;
    const offset = dxLive.current;
    dxLive.current = 0;
    start.current = null;
    // 滑过阈值直接删除，否则弹回 0——不做「常开的删除按钮」，避免拖拽结束的 click 误触
    setDx((d) => ({ ...d, [id]: 0 }));
    if (offset <= -THRESHOLD) setItems((l) => l.filter((x) => x !== id));
  };
  return (
    <ul className="w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {items.map((it) => (
        <li key={it} className="relative overflow-hidden border-b border-zinc-100 last:border-0 dark:border-zinc-800">
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-600 text-white">
            <Icon.Trash />
          </span>
          <div
            onPointerDown={(e) => onDown(e, it)}
            onPointerMove={(e) => onMove(e, it)}
            onPointerUp={() => onUp(it)}
            onPointerCancel={() => onUp(it)}
            style={{ transform: `translateX(${dx[it] ?? 0}px)` }}
            className={cn("relative flex touch-pan-y select-none items-center gap-3 bg-white px-4 py-3.5 text-sm dark:bg-zinc-900", start.current?.id !== it && "transition-transform duration-200")}
          >
            <span className="h-4 w-4 rounded border border-zinc-300 dark:border-zinc-600" />
            {it}
            <span className="ml-auto text-xs text-zinc-400">← 左滑到底删除</span>
          </div>
        </li>
      ))}
      {items.length === 0 && (
        <li className="flex flex-col items-center gap-3 py-8">
          <span className="text-sm text-zinc-400">全部完成 🎉</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setItems(INITIAL_ITEMS);
              setDx({});
              start.current = null;
            }}
          >
            恢复列表
          </Button>
        </li>
      )}
    </ul>
  );
}

/* View transition theme toggle */
function ThemeToggleDemo() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const ob = new MutationObserver(() => setDark(document.documentElement.classList.contains("dark")));
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => ob.disconnect();
  }, []);
  const toggle = (e: React.MouseEvent) => {
    const apply = () => document.documentElement.classList.toggle("dark");
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition) return apply();
    const x = e.clientX, y = e.clientY;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = doc.startViewTransition(apply);
    // 标签页切后台等场景会跳过转场并 reject，需要捕获避免 unhandled rejection
    t.ready
      .then(() => {
        document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 500, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" });
      })
      .catch(() => {});
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <button onClick={toggle} className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:scale-105 dark:border-zinc-700 dark:bg-zinc-900" aria-label="切换主题">
        {dark ? <Icon.Sun size={20} /> : <Icon.Moon size={20} />}
      </button>
      <span className="text-xs text-zinc-400">从点击位置圆形扩散切换整站主题（View Transitions API）</span>
    </div>
  );
}

/* Clock */
function ClockDemo() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const s = t.getSeconds(), m = t.getMinutes() + s / 60, h = (t.getHours() % 12) + m / 60;
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
      <div className="relative h-40 w-40 rounded-full border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="absolute left-1/2 top-1/2 h-[68px] w-px origin-top" style={{ transform: `translate(-50%, -100%) rotate(${i * 30}deg)`, transformOrigin: "bottom" }}>
            <span className={cn("block w-px bg-zinc-900 dark:bg-white", i % 3 === 0 ? "h-3" : "h-1.5 opacity-40")} />
          </span>
        ))}
        <span className="absolute left-1/2 top-1/2 h-11 w-1 rounded-full bg-zinc-900 dark:bg-white" style={{ transform: `translate(-50%,-100%) rotate(${h * 30}deg)`, transformOrigin: "50% 100%" }} />
        <span className="absolute left-1/2 top-1/2 h-16 w-0.5 origin-bottom rounded-full bg-zinc-900 dark:bg-white" style={{ transform: `translate(-50%,-100%) rotate(${m * 6}deg)`, transformOrigin: "50% 100%" }} />
        <span className="absolute left-1/2 top-1/2 h-[68px] w-px origin-bottom bg-red-500" style={{ transform: `translate(-50%,-100%) rotate(${s * 6}deg)`, transformOrigin: "50% 100%" }} />
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900 dark:bg-white" />
      </div>
      <div className="font-mono text-4xl font-semibold tabular-nums tracking-tight">
        {t.toLocaleTimeString("zh-CN", { hour12: false })}
      </div>
    </div>
  );
}

/* Expanding gallery */
function GalleryDemo() {
  const [a, setA] = useState(1);
  const items = ["极简", "秩序", "留白", "节奏", "对比"];
  return (
    <div className="flex h-48 w-full max-w-lg gap-2">
      {items.map((t, i) => (
        <div key={t} onMouseEnter={() => setA(i)} onClick={() => setA(i)} className={cn("relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 transition-[flex] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] dark:border-zinc-800 dark:bg-zinc-900", a === i ? "flex-[4]" : "flex-1")}>
          <div className="absolute inset-0 bg-dots opacity-60" />
          <span className={cn("absolute bottom-3 left-3 whitespace-nowrap text-sm font-medium transition-all duration-300", a === i ? "opacity-100" : "translate-y-2 opacity-0")}>{t}</span>
          <span className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-zinc-400 [writing-mode:vertical-rl] transition-opacity", a === i ? "opacity-0" : "opacity-100")}>{t}</span>
        </div>
      ))}
    </div>
  );
}

/* Word reveal on scroll */
function WordRevealDemo() {
  const text = "好的界面不是没有东西可加，而是没有东西可减。每一个像素都应该有存在的理由。";
  const words = text.split("");
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const ticking = useRef(false);
  const onScroll = () => {
    // rAF 节流：scroll 每帧触发，38 个 span 的重渲染没必要跟着跑满帧率
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      const el = ref.current!;
      setP(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight));
    });
  };
  return (
    <div ref={ref} onScroll={onScroll} className="h-56 w-full max-w-md overflow-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="sticky top-0 flex h-56 items-center px-8">
        <p className="text-xl font-medium leading-9 tracking-tight">
          {words.map((w, i) => (
            <span key={i} className="transition-colors duration-200" style={{ color: i / words.length < p * 1.15 ? undefined : "rgb(161 161 170 / 0.4)" }}>
              {w}
            </span>
          ))}
        </p>
      </div>
      <div className="h-72" />
    </div>
  );
}

/* Resizable */
function ResizableDemo() {
  const [w, setW] = useState(() => {
    try {
      const s = localStorage.getItem("resizable-w");
      if (s) return Math.max(20, Math.min(80, +s));
    } catch {
      /* ignore */
    }
    return 40;
  });
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  useEffect(() => () => {
    // 拖拽中卸载时恢复全局光标
    document.body.style.cursor = "";
  }, []);
  const onDown = (e: RPointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.cursor = "col-resize";
  };
  const onMove = (e: RPointerEvent) => {
    if (!dragging.current) return;
    const r = ref.current!.getBoundingClientRect();
    setW(Math.max(20, Math.min(80, ((e.clientX - r.left) / r.width) * 100)));
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.cursor = "";
    setW((v) => {
      try {
        localStorage.setItem("resizable-w", String(Math.round(v)));
      } catch {
        /* ignore */
      }
      return v;
    });
  };
  return (
    <div ref={ref} className="flex h-40 w-full max-w-lg select-none overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div style={{ width: `${w}%` }} className="flex items-center justify-center bg-zinc-50 text-sm text-zinc-500 dark:bg-zinc-950/50">
        {Math.round(w)}%
      </div>
      <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} className="group relative w-px cursor-col-resize touch-none bg-zinc-200 dark:bg-zinc-800">
        <span className="absolute inset-y-0 -left-1 w-2" />
        <span className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-300 transition-colors group-hover:bg-zinc-900 dark:bg-zinc-700 dark:group-hover:bg-white" />
      </div>
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">{Math.round(100 - w)}%</div>
    </div>
  );
}

/* Noise */
function NoiseDemo() {
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-4">
      <div className="relative h-40 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <span className="absolute bottom-3 left-3 text-xs text-zinc-500">无噪点</span>
      </div>
      <div className="noise relative h-40 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <span className="absolute bottom-3 left-3 text-xs text-zinc-500">SVG feTurbulence 噪点</span>
      </div>
    </div>
  );
}

export default function Advanced() {
  return (
    <section>
      <SectionHeader
        id="advanced"
        index="08"
        title="文字、滚动与高级模式"
        en="Text · Scroll · Advanced Patterns"
        intro="跑马灯、打字机、数字滚动这类文字动效，滚动驱动的显现与堆叠，以及拖拽排序、左滑删除、主题切换转场等高级交互模式。它们大多数只需要几十行代码，但能显著提升产品的「完成度」。"
        icon={<Icon.Type />}
      />

      <Showcase id="marquee" title="无限跑马灯" en="Marquee" description="Logo 墙 / 用户评价的水平无限滚动。把内容复制一份首尾相接，用 translateX(−50%) 循环，两侧用 mask 渐隐。悬停暂停。" usage={["客户 Logo、评价、标签云、新闻快讯。"]} points={["内容渲染两份：每份包在自己的 flex 组里并带 pr（等于 gap 值），组宽完全一致，translateX(−50%) 恰好移动一份的宽度，接缝不跳变；直接 [...logos, ...logos] + gap 会在接缝处差半个 gap。", "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] 边缘淡出。", "group-hover:[animation-play-state:paused]。", "反向：animation-direction: reverse；两行速度不同更有层次。"]} code={`<div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
  <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
    {[...logos, ...logos].map((l, i) => <Logo key={i} />)}
  </div>
</div>

@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}>
        <MarqueeDemo />
      </Showcase>

      <Showcase id="typewriter" title="打字机" en="Typewriter" description="逐字输入、停顿、逐字删除、切换下一个词，配合闪烁光标。" usage={["Hero 标题的动态词、AI 输出效果。"]} points={["状态：当前词索引 wi、已显示文本 txt、是否删除中 del。", "useEffect 依赖 [txt, del, wi]，每次 setTimeout 处理一个字符；输入 110ms / 删除 50ms。", "输入完整后停 1200ms 再开始删除。", "光标：w-0.5 + animation: caret 1s step-end infinite。"]} code={`useEffect(() => {
  const w = words[wi];
  const t = setTimeout(() => {
    if (!del) {
      setTxt(w.slice(0, txt.length + 1));
      if (txt.length + 1 === w.length) setTimeout(() => setDel(true), 1200);
    } else {
      setTxt(w.slice(0, txt.length - 1));
      if (txt.length - 1 === 0) { setDel(false); setWi((wi + 1) % words.length); }
    }
  }, del ? 50 : 110);
  return () => clearTimeout(t);
}, [txt, del, wi]);`}>
        <TypewriterDemo />
      </Showcase>

      <Showcase id="scramble" title="文字乱码解码" en="Text Scramble" level="进阶" description="黑客风格的字符随机跳变后逐个「解码」为目标字符。" usage={["Hover 标题、加载完成的揭示、极客风品牌。"]} points={["setInterval 每 40ms 一帧；第 i 个字符在 frame > i×2 后固定。", "未固定的位置显示随机符号。", "用等宽字体避免宽度跳动。"]} code={`const id = setInterval(() => {
  frame++;
  setOut(target.split("").map((c, i) =>
    frame > i * 2 ? c : chars[Math.floor(Math.random() * chars.length)]).join(""));
  if (frame > total) clearInterval(id);
}, 40);`}>
        <ScrambleDemo />
      </Showcase>

      <Showcase id="countup" title="数字滚动" en="Count Up" description="数字从 0 以缓出曲线增长到目标值，支持小数与千分位。进入视口时触发效果最佳。" usage={["数据统计区、成就展示、仪表盘。"]} points={["requestAnimationFrame + easeOutCubic：e = 1 − (1 − p)³。", "toLocaleString 格式化千分位与小数位。", "tabular-nums 防止宽度抖动。", "Num 组件要定义在组件外——放在函数体内每次渲染都是新组件类型，子树会整棵重建、动画反复重放。", "进入视口才启动：本站的 Showcase 已对预览做懒挂载；独立页面可自己加 IntersectionObserver。"]} code={`const tick = (now) => {
  const p = Math.min(1, (now - start) / 1400);
  const e = 1 - Math.pow(1 - p, 3);
  setV(to * e);
  if (p < 1) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);`}>
        <CountUpDemo />
      </Showcase>

      <Showcase id="reveal" title="滚动显现" en="Scroll Reveal" description="元素进入视口时淡入上浮，同一行的元素交错延迟。用 IntersectionObserver 加 data 属性，CSS 负责动画。" usage={["落地页各区块、图片墙、列表。", "只播放一次，避免上下滚动反复闪。"]} points={["初始 opacity-0 translate-y-6；命中后设置 data-shown，用 data-[shown=true]: 变体切换到终态。", "threshold 0.3 表示露出 30% 时触发；触发后 unobserve。", "transitionDelay 按索引 × 80ms 交错。", "现代浏览器可用 animation-timeline: view() 纯 CSS 实现。"]} code={`const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.dataset.shown = "true"; io.unobserve(e.target); }
}), { threshold: 0.3 });

<div data-reveal style={{ transitionDelay: \`\${i * 80}ms\` }}
  className="opacity-0 translate-y-6 transition-all duration-700 ease-out
             data-[shown=true]:opacity-100 data-[shown=true]:translate-y-0" />`}>
        <RevealDemo />
      </Showcase>

      <Showcase id="stack" title="堆叠卡片" en="Sticky Stacking Cards" level="进阶" description="滚动时卡片依次粘在顶部并层叠，后面的卡片盖住前面的。纯 CSS：每张卡片 position: sticky，top 值递增。" usage={["流程步骤、作品集项目、功能介绍。"]} points={["每张卡片 sticky，top = 基础值 + index × 12px 形成错落。", "卡片之间用大 margin-bottom 提供滚动距离。", "可加 scale 递减增强透视。", "最后留出空白让最后一张能滚上去。"]} code={`{cards.map((c, i) => (
  <div key={c} className="sticky px-4" style={{ top: 12 + i * 12 }}>
    <div className="mb-40 h-44 rounded-xl border bg-white p-5 shadow-lg">{c}</div>
  </div>
))}`}>
        <StackDemo />
      </Showcase>

      <Showcase id="infinite" title="无限滚动" en="Infinite Scroll" level="进阶" description="列表底部放一个哨兵元素，进入视口时加载下一页。到达末尾显示「没有更多了」。" usage={["信息流、评论、搜索结果。", "需要能到达页脚的页面用「加载更多」按钮。"]} points={["IntersectionObserver 观察哨兵，rootMargin 80px 提前触发。", "loading 锁防止重复请求；依赖里包含 items 以在追加后重新观察。", "长列表配合虚拟化（@tanstack/react-virtual）。", "保存滚动位置以支持返回。"]} code={`useEffect(() => {
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !loading && hasMore) loadMore();
  }, { rootMargin: "80px" });
  io.observe(sentinel.current);
  return () => io.disconnect();
}, [items, loading]);

<div ref={sentinel} className="h-12">{loading && <Spinner />}</div>`}>
        <InfiniteDemo />
      </Showcase>

      <Showcase id="sortable" title="拖拽排序列表" en="Sortable List" level="进阶" description="拖动列表项到新位置重排。Pointer Events 实现（触屏也能拖），目标位置高亮。" usage={["优先级排序、自定义菜单顺序、播放列表。"]} points={["onPointerDown 记录起始索引并 setPointerCapture；onPointerMove 里比对每项的 getBoundingClientRect 找到目标位置。", "onPointerUp 时从 from splice 移除、在 to 插入完成重排。", "over 项 border 加深 + scale-[1.02] 提示落点；被拖项 opacity-50。", "列表项加 touch-none 防止触摸时触发滚动；平滑动画、键盘排序请用 @dnd-kit/sortable。"]} code={`onPointerDown={(e) => { dragIdx.current = i; e.currentTarget.setPointerCapture(e.pointerId); }}
onPointerMove={(e) => {
  const hit = itemRefs.current.findIndex(el => {
    const r = el.getBoundingClientRect();
    return e.clientY >= r.top && e.clientY <= r.bottom;
  });
  setOver(hit);
}}
onPointerUp={() => {
  const l = [...list];
  const [m] = l.splice(from, 1);
  l.splice(over, 0, m);
  setList(l);
}}`}>
        <SortableDemo />
      </Showcase>

      <Showcase id="confetti" title="纸屑庆祝" en="Confetti" level="进阶" description="Canvas 粒子系统：120 片纸屑从底部中央喷出，受重力下落、旋转、淡出。使用灰阶配色保持克制。" usage={["完成任务、支付成功、达成里程碑。", "一次性、短暂（≈2s）。"]} points={["每片纸屑：位置、速度、旋转、尺寸、颜色、生命值。", "每帧 vy += 重力，vx *= 阻力，life −= 衰减。", "ctx.save / translate / rotate / fillRect / restore 画矩形。", "全部死亡后停止循环并清空画布。", "生产环境可用 canvas-confetti 库。"]} code={`ps.forEach(p => {
  p.vy += 0.25; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 0.008;
  ctx.save();
  ctx.globalAlpha = p.life;
  ctx.translate(p.x, p.y); ctx.rotate(p.r);
  ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
  ctx.restore();
});`}>
        <ConfettiDemo />
      </Showcase>

            <Showcase
        id="swipe"
        title="左滑删除"
        en="Swipe to Delete"
        level="高级"
        description="iOS 列表的经典手势：左滑露出红色删除区，滑过阈值松手直接删除，未过阈值弹回。使用 Pointer Events 同时支持鼠标与触摸。"
        usage={["移动端列表：邮件、待办、通知。"]}
        points={["onPointerDown setPointerCapture 保证移出元素仍能收到事件；pointerdown 里 preventDefault 让手势不合成 click。", "位移钳制在 [−80, 0]（−80 正好等于按钮宽度，滑过头会露出深色空隙）。", "松手判定在 onPointerUp：位移 ≤ −64px 直接从数据里删除该项，否则弹回 0。", "不要做「常开的删除按钮」：拖拽结束合成的 click 会落在露出的按钮上，是连环误删的根源；删除按钮在拖动过程中仅作视觉提示。", "touch-pan-y 让垂直滚动仍然可用；拖动中不加 transition，松手后加 200ms 过渡。"]}
        a11y={["删除是不可逆操作：提供恢复入口（本例为「恢复列表」按钮），或做撤销 Toast。"]}
        code={`onPointerDown={e => { e.preventDefault(); start.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); }}
onPointerMove={e => start.current !== null && setDx(Math.min(0, Math.max(-80, e.clientX - start.current)))}
onPointerUp={() => {
  // 滑过阈值直接删除，否则弹回
  if (dxLive.current <= -64) removeItem(id);
  else setDx(0);
}}
style={{ transform: \`translateX(\${dx}px)\` }}`}>
        <SwipeDemo />
      </Showcase>

      <Showcase id="theme-toggle" title="主题切换转场" en="Theme Toggle with View Transitions" level="高级" description="切换深浅色时，新主题从点击位置以圆形扩散覆盖全屏。使用 View Transitions API，不支持的浏览器直接切换。这个按钮会真的切换本站主题。" usage={["深浅色切换、任何全局状态的戏剧性切换。"]} points={["document.startViewTransition(() => toggle class)。", "在 t.ready 后对 ::view-transition-new(root) 做 clip-path circle 动画。", "半径 = 到最远角的距离 Math.hypot(max(x, w−x), max(y, h−y))。", "需要 CSS 关闭默认的淡入淡出：::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }。"]} code={`const toggle = (e) => {
  const apply = () => document.documentElement.classList.toggle("dark");
  if (!document.startViewTransition) return apply();
  const x = e.clientX, y = e.clientY;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = document.startViewTransition(apply);
  t.ready.then(() => document.documentElement.animate(
    { clipPath: [\`circle(0 at \${x}px \${y}px)\`, \`circle(\${r}px at \${x}px \${y}px)\`] },
    { duration: 500, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }));
};`}>
        <ThemeToggleDemo />
      </Showcase>

      <Showcase id="clock" title="时钟" en="Analog & Digital Clock" description="指针式时钟 + 数字时钟。指针角度由当前时间换算，分针和时针带小数保证连续移动。" usage={["仪表盘、世界时钟、屏保。"]} points={["时针角度 = (h % 12 + m/60) × 30；分针 = (m + s/60) × 6；秒针 = s × 6。", "指针用 absolute + transform-origin: 50% 100% 从底部旋转。", "刻度 12 个，每 3 个加长。", "数字时钟 tabular-nums + 等宽字体。"]} code={`const s = t.getSeconds(), m = t.getMinutes() + s / 60, h = (t.getHours() % 12) + m / 60;
<span className="absolute left-1/2 top-1/2 h-16 w-0.5 bg-zinc-900"
  style={{ transform: \`translate(-50%,-100%) rotate(\${m * 6}deg)\`, transformOrigin: "50% 100%" }} />`}>
        <ClockDemo />
      </Showcase>

      <Showcase id="gallery" title="伸缩画廊" en="Expanding Gallery" level="进阶" description="悬停的面板扩展，其余收缩。用 flex 数值的过渡实现，标题在展开时浮现，收起时竖排显示。" usage={["作品展示、产品系列、团队成员。"]} points={["激活项 flex-[4]，其他 flex-1，transition-[flex] 500ms。", "标题两种状态：展开时底部横排，收起时 writing-mode: vertical-rl 居中。", "onMouseEnter 与 onClick 都触发以兼容触屏。"]} code={`<div className={cn("relative overflow-hidden rounded-xl transition-[flex] duration-500",
  active === i ? "flex-[4]" : "flex-1")} onMouseEnter={() => setActive(i)}>
  <img … />
  <span className={cn("absolute bottom-3 left-3 transition-all", active === i ? "opacity-100" : "translate-y-2 opacity-0")}>{title}</span>
</div>`}>
        <GalleryDemo />
      </Showcase>

      <Showcase id="word-reveal" title="滚动逐字点亮" en="Scroll Text Reveal" level="进阶" description="文本固定在视口中，随滚动进度逐字从淡灰变为实色。常见于产品宣言 / 品牌故事区。" usage={["落地页的 manifesto、长文导语。"]} points={["外层可滚动，内层 sticky top-0 固定文字。", "进度 p = scrollTop / (scrollHeight − clientHeight)。", "第 i 个字：i / total < p 时为实色，否则 40% 透明度灰。", "transition-colors 200ms 让变化柔和。"]} code={`{chars.map((c, i) => (
  <span key={i} className="transition-colors duration-200"
    style={{ color: i / chars.length < progress ? undefined : "rgb(161 161 170 / 0.4)" }}>{c}</span>
))}`}>
        <WordRevealDemo />
      </Showcase>

      <Showcase id="resizable" title="可拖拽分栏" en="Resizable Panes" level="进阶" description="拖动中间的分割条改变左右面板宽度，限制在 20%–80% 之间，宽度刷新后仍然保留。" usage={["编辑器 + 预览、文件树 + 内容、对比视图。"]} points={["分割条 onPointerDown + setPointerCapture，move 里按 (clientX − 容器左缘) / 容器宽 换算百分比。", "拖动期间 body cursor: col-resize，select-none 防选中；卸载时要记得恢复。", "分割条视觉 1px，但用一个 8px 的透明命中区扩大可拖范围；加 touch-none 触屏才能拖。", "宽度存 localStorage 记忆（try/catch 包裹，隐私模式会抛错）。"]} code={`const onDown = (e) => {
  dragging.current = true;
  e.currentTarget.setPointerCapture(e.pointerId);
  document.body.style.cursor = "col-resize";
};
const onMove = (e) => {
  if (!dragging.current) return;
  const r = ref.current.getBoundingClientRect();
  setW(Math.max(20, Math.min(80, ((e.clientX - r.left) / r.width) * 100)));
};
const onUp = () => {
  dragging.current = false;
  document.body.style.cursor = "";
  localStorage.setItem("resizable-w", String(Math.round(w)));
};`}>
        <ResizableDemo />
      </Showcase>

      <Showcase id="noise" title="噪点纹理" en="Noise / Grain" description="给纯色背景叠一层极淡的噪点，消除「塑料感」，让极简界面更有质感。用内联 SVG feTurbulence 生成，无需图片。" usage={["Hero 背景、卡片、深色区块。", "透明度 3%–8% 即可，多了显脏。"]} points={["::after 伪元素 + background-image: url(data:image/svg+xml;...feTurbulence...)。", "mix-blend-mode: multiply（浅色）/ screen（深色）。", "baseFrequency 0.6–0.9 控制颗粒大小。", "pointer-events-none 不影响交互。"]} code={`.noise::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .35;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
}`} codeLang="css">
        <NoiseDemo />
      </Showcase>
    </section>
  );
}
