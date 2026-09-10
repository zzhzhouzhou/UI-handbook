import { useEffect, useMemo, useRef, useState, type KeyboardEvent as RKeyboardEvent } from "react";
import { NAV, type NavItem } from "../nav";
import { Icon, Kbd } from "./primitives";
import { cn } from "../utils/cn";
import { smoothScrollTo } from "../utils/scroll";

/** 从任意位置打开全局命令面板（章节里的 demo 按钮也用它） */
export function openCommandPalette() {
  window.dispatchEvent(new Event("uih:open-command"));
}

type FlatItem = NavItem & { groupId: string; groupIndex: string; groupTitle: string };

function useFilter(q: string) {
  return useMemo(() => {
    if (!q.trim()) return NAV;
    const s = q.trim().toLowerCase();
    return NAV.map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(s) || i.en.toLowerCase().includes(s) || g.title.includes(s)) })).filter((g) => g.items.length);
  }, [q]);
}

function useFlat(filtered: ReturnType<typeof useFilter>): FlatItem[] {
  return useMemo(
    () => filtered.flatMap((g) => g.items.map((it) => ({ ...it, groupId: g.id, groupIndex: g.index, groupTitle: g.title }))),
    [filtered],
  );
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useFilter(q);
  const flat = useFlat(filtered);

  // 打开时：重置搜索、聚焦输入、锁定背景滚动
  useEffect(() => {
    if (!open) return;
    setQ("");
    setIdx(0);
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  if (!open) return null;

  const jump = (id: string) => {
    onClose();
    // 等浮层卸载后再滚动，避免动画期间布局抖动
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) smoothScrollTo(el);
    });
  };

  const onKeyDown = (e: RKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = flat[idx];
      if (it) jump(it.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onMouseDown={onClose}>
      {/* 全屏毛玻璃遮罩 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="命令面板"
        onMouseDown={(e) => e.stopPropagation()}
        className="relative z-10 flex max-h-[min(560px,70dvh)] w-full max-w-lg animate-scale-in flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
      >
        {/* 输入行 */}
        <div className="flex shrink-0 items-center gap-2.5 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Icon.Search className="shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="搜索组件…"
            autoComplete="off"
            className="h-14 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-zinc-400"
          />
          <Kbd>Esc</Kbd>
        </div>

        {/* 结果列表 */}
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {flat.length === 0 && <div className="py-10 text-center text-sm text-zinc-400">没有找到 “{q}” 的组件</div>}
          {filtered.map((g) => {
            if (!g.items.length) return null;
            return (
              <div key={g.id} className="mb-1 last:mb-0">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  {g.index} · {g.title}
                </div>
                {g.items.map((it) => {
                  const i = flat.findIndex((f) => f.id === it.id);
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onMouseEnter={() => setIdx(i)}
                      onClick={() => jump(it.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                        i === idx ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white" : "text-zinc-600 dark:text-zinc-300",
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{it.label}</span>
                      <span className="shrink-0 font-mono text-[11px] text-zinc-400">{it.en}</span>
                      {it.level && (
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-1.5 py-px text-[10px]",
                            it.level === "高级" ? "border-zinc-900 text-zinc-900 dark:border-white dark:text-white" : "border-zinc-300 text-zinc-500 dark:border-zinc-600 dark:text-zinc-400",
                          )}
                        >
                          {it.level}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* 底部快捷键提示 */}
        <div className="flex shrink-0 items-center gap-4 border-t border-zinc-200 px-4 py-2.5 text-[11px] text-zinc-400 dark:border-zinc-800">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> 导航
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd> 跳转
          </span>
          <span className="ml-auto tabular-nums">{flat.length} 个组件</span>
        </div>
      </div>
    </div>
  );
}