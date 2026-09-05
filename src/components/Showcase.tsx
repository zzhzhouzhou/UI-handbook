import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { copyText } from "../utils/copy";
import { highlight, type HlClass } from "../utils/highlight";

/** 代码高亮配色：在 zinc 灰阶底上用低饱和色区分语法，注释保持中性 */
const HL_CLS: Record<HlClass, string> = {
  kw: "text-violet-400",
  tag: "text-emerald-300",
  attr: "text-sky-300",
  num: "text-orange-300",
  str: "text-amber-200/90",
  cmt: "text-zinc-600 italic",
};

export function Highlighted({ code }: { code: string }) {
  return (
    <>
      {highlight(code).map((tok, i) =>
        tok.c ? (
          <span key={i} className={HL_CLS[tok.c]}>
            {tok.t}
          </span>
        ) : (
          tok.t
        ),
      )}
    </>
  );
}

export type Level = "基础" | "进阶" | "高级";

export interface ShowcaseProps {
  id: string;
  title: string;
  en: string;
  level?: Level;
  description: string;
  /** 什么时候用 / 用途 */
  usage?: string[];
  /** 实现要点 */
  points?: string[];
  /** 无障碍与细节 */
  a11y?: string[];
  /** 常见错误 */
  pitfalls?: string[];
  code?: string;
  codeLang?: string;
  children: ReactNode;
  /** 预览容器附加 class */
  previewClassName?: string;
  /** 是否使用点阵背景 */
  dotted?: boolean;
}

const levelStyle: Record<Level, string> = {
  基础: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
  进阶: "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100",
  高级: "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white",
};

export function Showcase({
  id,
  title,
  en,
  level = "基础",
  description,
  usage,
  points,
  a11y,
  pitfalls,
  code,
  codeLang = "tsx",
  children,
  previewClassName,
  dotted = true,
}: ShowcaseProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");
  const [key, setKey] = useState(0);
  // 懒挂载：全站几十个 demo 同时挂载时，定时器/RAF/CSS 动画都在跑；
  // 首次滚近视口（提前 200px）才渲染预览内容，离屏的 demo 不产生任何运行时开销
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || mounted) return;
    let io: IntersectionObserver | null = null;
    let ioFired = false;
    let raf = 0;
    let fallbackTimer = 0;
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + 200 && r.bottom > -200) {
        setMounted(true);
        cleanup();
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        check();
      });
    };
    const cleanup = () => {
      io?.disconnect();
      io = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(fallbackTimer);
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    io = new IntersectionObserver(
      (entries) => {
        ioFired = true;
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          cleanup();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    // 少数内嵌 / 无头环境的 IntersectionObserver 不可靠：800ms 内一次回调都没有就退回 scroll + rect 检测
    fallbackTimer = window.setTimeout(() => {
      if (ioFired) return;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      check();
    }, 800);
    return cleanup;
  }, [mounted]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const copy = async () => {
    if (!code) return;
    const ok = await copyText(code);
    setCopyState(ok ? "ok" : "fail");
    if (ok) {
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopyState("idle"), 1400);
    }
  };

  return (
    <article ref={rootRef} id={id} className="scroll-mt-24 border-t border-zinc-200 py-14 first:border-t-0 [content-visibility:auto] [contain-intrinsic-size:auto_900px] dark:border-zinc-800">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            <span className="font-mono text-xs text-zinc-400">{en}</span>
          </div>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-zinc-600 [overflow-wrap:anywhere] dark:text-zinc-400">{description}</p>
        </div>
        <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", levelStyle[level])}>{level}</span>
      </header>

      {/* Preview / Code */}
      <div className={cn("rounded-xl border border-zinc-200 dark:border-zinc-800", previewClassName?.match(/overflow-[\w-]+/)?.[0] ?? "overflow-hidden")}>
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex gap-1">
            {(["preview", "code"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  tab === t
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
                  t === "code" && !code && "hidden",
                )}
              >
                {t === "preview" ? "预览" : "代码"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setKey((k) => k + 1)}
              className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              title="重新播放"
              aria-label="重新播放"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 3v6h6" />
              </svg>
            </button>
            {code && (
              <button
                onClick={copy}
                className="rounded-md px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                {copyState === "ok" ? "已复制 ✓" : copyState === "fail" ? "复制失败" : "复制代码"}
              </button>
            )}
          </div>
        </div>

        {tab === "preview" ? (
          <div
            key={key}
            className={cn(
              "relative flex min-h-[180px] items-center justify-center overflow-hidden bg-white p-4 sm:min-h-[220px] sm:p-8 dark:bg-zinc-950",
              dotted && "bg-dots",
              previewClassName,
            )}
          >
            {mounted ? children : null}
          </div>
        ) : (
          <pre className="max-h-[480px] min-h-[200px] overflow-auto bg-zinc-950 p-5 text-xs leading-6 text-zinc-300 sm:text-[12.5px]">
            <code data-lang={codeLang}>
              <Highlighted code={code ?? ""} />
            </code>
          </pre>
        )}
      </div>

      {/* Docs：极淡底色 + 双列瀑布流——矮块不会被高块顶下去，无障碍/常见错误紧跟上一块 */}
      <div className="mt-6 rounded-xl bg-zinc-50 p-5 md:columns-2 md:gap-x-8 dark:bg-zinc-900/40 [&>*]:break-inside-avoid [&>*+*]:mt-5">
        {usage && <InfoList title="用途 · 什么时候用" items={usage} />}
        {points && <InfoList title="实现要点" items={points} numbered />}
        {a11y && <InfoList title="无障碍与细节" items={a11y} />}
        {pitfalls && <InfoList title="常见错误" items={pitfalls} warn />}
      </div>
    </article>
  );
}

function InfoList({ title, items, numbered, warn }: { title: string; items: string[]; numbered?: boolean; warn?: boolean }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            <span className={cn("mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full", warn ? "bg-red-500" : "bg-zinc-900 dark:bg-zinc-100", numbered && "hidden")} />
            {numbered && <span className="w-4 shrink-0 font-mono text-xs leading-6 text-zinc-400">{i + 1}.</span>}
            <span className="[overflow-wrap:anywhere]">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 章节标题 */
export function SectionHeader({ id, index, title, en, intro, icon }: { id: string; index: string; title: string; en: string; intro: string; icon?: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 border-b border-zinc-900 pb-10 pt-28 first:pt-0 md:pt-36 dark:border-zinc-100">
      <div className="mb-3 font-mono text-xs text-zinc-400">{index}</div>
      <h2 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-3xl font-semibold tracking-tight md:text-4xl">
        {icon && (
          <span className="text-zinc-900 [&_svg]:h-7 [&_svg]:w-7 dark:text-white">
            {icon}
          </span>
        )}
        {title} <span className="text-lg font-normal text-zinc-400">{en}</span>
      </h2>
      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-zinc-600 dark:text-zinc-400">{intro}</p>
    </div>
  );
}
