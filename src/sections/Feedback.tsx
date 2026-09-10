import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Showcase, SectionHeader } from "../components/Showcase";
import { Button, Icon, inputCls, Label } from "../components/primitives";
import { cn } from "../utils/cn";

/* Toast */
type Toast = { id: number; title: string; desc?: string; type: "default" | "success" | "error"; leaving?: boolean };
function ToastDemo() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const push = (t: Omit<Toast, "id">) => {
    const id = ++nextId.current;
    setToasts((ts) => [...ts, { ...t, id }].slice(-3));
    timers.current.push(
      window.setTimeout(() => setToasts((ts) => ts.map((x) => (x.id === id ? { ...x, leaving: true } : x))), 3000),
      window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 3300),
    );
  };
  // 手动关闭也走两段式，和自动消失的表现保持一致
  const close = (id: number) => {
    setToasts((ts) => ts.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    timers.current.push(window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 300));
  };
  return (
    <div className="relative flex h-64 w-full max-w-lg items-center justify-center gap-2">
      <Button variant="outline" size="sm" onClick={() => push({ title: "已保存草稿", desc: "将在 5 分钟后自动同步", type: "default" })}>
        默认
      </Button>
      <Button variant="outline" size="sm" onClick={() => push({ title: "发布成功", type: "success" })}>
        成功
      </Button>
      <Button variant="outline" size="sm" onClick={() => push({ title: "网络错误", desc: "请检查连接后重试", type: "error" })}>
        错误
      </Button>
      {/* Toast 固定到视口右下角：portal 到 body，避免被预览容器裁切 */}
      {toasts.length > 0 &&
        createPortal(
          <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
            {toasts.map((t) => (
              <div key={t.id} role="status" className={cn("pointer-events-auto flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg transition-all duration-300 dark:border-zinc-700 dark:bg-zinc-900", t.leaving ? "translate-x-4 opacity-0" : "animate-fade-up")}>
                {t.type === "success" && <Icon.Check className="mt-0.5 text-emerald-600" />}
                {t.type === "error" && <Icon.Alert className="mt-0.5 text-red-600" />}
                {t.type === "default" && <Icon.Info className="mt-0.5 text-zinc-500" />}
                <div className="flex-1 text-sm">
                  <div className="font-medium">{t.title}</div>
                  {t.desc && <div className="text-zinc-500">{t.desc}</div>}
                </div>
                <button onClick={() => close(t.id)} className="rounded p-0.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white" aria-label="关闭">
                  <Icon.X size={14} />
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

/* Modal */
/** 轻量焦点陷阱：打开时聚焦面板内第一个控件，Tab 循环限制在面板内，关闭后焦点归还触发按钮 */
function useDialogFocus(open: boolean, panelRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const prev = document.activeElement as HTMLElement | null;
    const sel = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
    panel?.querySelector<HTMLElement>(sel)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panel) return;
      const els = Array.from(panel.querySelectorAll<HTMLElement>(sel));
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, panelRef]);
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, panelRef);
  useDialogFocus(confirm, confirmRef);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setConfirm(false);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open || confirm ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, confirm]);
  return (
    <div className="flex gap-3">
      <Button onClick={() => setOpen(true)}>打开对话框</Button>
      <Button variant="danger" onClick={() => setConfirm(true)}>
        删除项目
      </Button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
          <div ref={panelRef} role="dialog" aria-modal aria-labelledby="dlg-title" onClick={(e) => e.stopPropagation()} className="w-full max-w-md animate-scale-in rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <div>
                <h3 id="dlg-title" className="text-lg font-semibold">
                  编辑资料
                </h3>
                <p className="mt-1 text-sm text-zinc-500">修改后点击保存生效。</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white" aria-label="关闭">
                <Icon.X />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <Label>显示名称</Label>
                <input className={inputCls} defaultValue="Li Hua" autoFocus />
              </div>
              <div>
                <Label>简介</Label>
                <textarea className={cn(inputCls, "h-20 resize-none py-2")} defaultValue="产品设计师，专注 B 端体验。" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setOpen(false)}>保存</Button>
            </div>
          </div>
        </div>,
        document.body,
      )}
      {confirm &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setConfirm(false)}>
          <div ref={confirmRef} role="alertdialog" aria-modal aria-labelledby="dlg-confirm-title" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm animate-scale-in rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50">
              <Icon.Trash size={20} />
            </div>
            <h3 id="dlg-confirm-title" className="mt-4 text-center text-lg font-semibold">删除「设计系统 v2」？</h3>
            <p className="mt-1 text-center text-sm text-zinc-500">此操作不可撤销，所有文件与历史记录将被永久删除。</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setConfirm(false)}>
                取消
              </Button>
              <Button variant="danger" onClick={() => setConfirm(false)}>
                确认删除
              </Button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

/* Drawer & Bottom sheet */
function DrawerDemo() {
  const [side, setSide] = useState<null | "right" | "bottom">(null);
  // 底部面板手势下拉：进入动画结束后（onAnimationEnd）接管 transform，跟随手指、超过阈值关闭
  const [entered, setEntered] = useState(false);
  const [dy, setDy] = useState(0);
  const drag = useRef<{ y: number } | null>(null);
  useEffect(() => {
    setEntered(false);
    setDy(0);
    drag.current = null;
  }, [side]);
  useEffect(() => {
    if (!side) return;
    const ow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => e.key === "Escape" && setSide(null);
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = ow;
      window.removeEventListener("keydown", k);
    };
  }, [side]);
  const onHandleDown = (e: React.PointerEvent) => {
    drag.current = { y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onHandleMove = (e: React.PointerEvent) => {
    if (drag.current) setDy(Math.max(0, e.clientY - drag.current.y));
  };
  const onHandleUp = () => {
    if (dy > 80) setSide(null);
    setDy(0);
    drag.current = null;
  };
  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={() => setSide("right")}>
        右侧抽屉
      </Button>
      <Button variant="outline" onClick={() => setSide("bottom")}>
        底部面板
      </Button>
      {side &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setSide(null)}>
            <div
              onClick={(e) => e.stopPropagation()}
              onAnimationEnd={() => setEntered(true)}
              style={side === "bottom" && entered ? { transform: `translateY(${dy}px)`, transition: drag.current ? "none" : "transform 0.25s cubic-bezier(0.32,0.72,0,1)" } : undefined}
              className={cn(
                "absolute bg-white shadow-2xl dark:bg-zinc-900",
                side === "right" && "inset-y-0 right-0 w-full max-w-sm animate-slide-in-right border-l border-zinc-200 dark:border-zinc-800",
                side === "bottom" && cn("inset-x-0 bottom-0 rounded-t-2xl border-t border-zinc-200 dark:border-zinc-800", !entered && "animate-slide-up"),
              )}
            >
              {side === "bottom" && (
                <div className="flex cursor-grab touch-none justify-center py-2.5 active:cursor-grabbing" onPointerDown={onHandleDown} onPointerMove={onHandleMove} onPointerUp={onHandleUp} onPointerCancel={onHandleUp}>
                  <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
              )}
              <div className="flex items-center justify-between p-5 pt-1">
                <h3 className="font-semibold">{side === "right" ? "筛选条件" : "分享到"}</h3>
                <button onClick={() => setSide(null)} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="关闭">
                  <Icon.X />
                </button>
              </div>
              <div className="space-y-2 px-5 pb-8">
                {["微信", "微博", "复制链接", "生成海报"].map((t) => (
                  <button key={t} className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
                    {t} <Icon.ChevronRight size={14} className="text-zinc-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/* Alerts */
function AlertDemo() {
  const alerts = [
    ["info", Icon.Info, "提示", "新版本 2.4 已发布，查看更新日志了解详情。", "border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"],
    ["success", Icon.Check, "已完成", "你的付款已成功处理，发票已发送至邮箱。", "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"],
    ["warning", Icon.Alert, "注意", "你的存储空间即将用尽（已使用 92%）。", "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"],
    ["error", Icon.X, "出错了", "无法连接到服务器，请稍后重试。", "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"],
  ] as const;
  return (
    <div className="w-full max-w-lg space-y-3">
      {alerts.map(([k, I, t, d, c]) => (
        <div key={k} role="status" className={cn("flex gap-3 rounded-lg border p-4 text-sm", c)}>
          <I className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-medium">{t}</div>
            <div className="mt-0.5 opacity-80">{d}</div>
          </div>
          <button className="opacity-50 hover:opacity-100" aria-label="关闭">
            <Icon.X size={14} />
          </button>
        </div>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm text-white dark:bg-white dark:text-zinc-900">
        <span>我们使用 Cookie 改善体验。继续浏览即表示同意。</span>
        <div className="flex gap-2">
          <button className="rounded-md px-3 py-1 text-xs hover:bg-white/10 dark:hover:bg-black/10">拒绝</button>
          <button className="rounded-md bg-white px-3 py-1 text-xs font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white">接受</button>
        </div>
      </div>
    </div>
  );
}

/* Progress */
function ProgressDemo() {
  const [p, setP] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  // 只在预览滚入视口时推进度，离屏即停，避免常驻 60ms interval 空转
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let t: number | undefined;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(t);
      if (e.isIntersecting) t = window.setInterval(() => setP((x) => (x >= 100 ? 0 : x + 1)), 60);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(t);
    };
  }, []);
  const r = 28, c = 2 * Math.PI * r;
  return (
    <div ref={rootRef} className="grid w-full max-w-lg grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div className="space-y-5">
        <div>
          <div className="mb-2 flex justify-between text-xs">
            <span>上传中</span>
            <span className="font-mono tabular-nums text-zinc-500">{p}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800" role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-zinc-900 transition-[width] duration-100 dark:bg-white" style={{ width: `${p}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs">不确定进度</div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div className="absolute h-full w-1/3 rounded-full bg-zinc-900 dark:bg-white" style={{ animation: "indeterminate 1.4s ease-in-out infinite" }} />
          </div>
          <style>{`@keyframes indeterminate{0%{left:-33%}100%{left:100%}}`}</style>
        </div>
        <div>
          <div className="mb-2 text-xs">分段进度</div>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i < Math.floor(p / 20) ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800")} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-8">
        <div className="relative">
          <svg width="72" height="72" className="-rotate-90">
            <circle cx="36" cy="36" r={r} strokeWidth="6" className="fill-none stroke-zinc-200 dark:stroke-zinc-800" />
            <circle cx="36" cy="36" r={r} strokeWidth="6" strokeLinecap="round" className="fill-none stroke-zinc-900 transition-[stroke-dashoffset] duration-100 dark:stroke-white" strokeDasharray={c} strokeDashoffset={c - (c * p) / 100} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-sm tabular-nums">{p}</span>
        </div>
        <div className="relative">
          <svg width="90" height="56" viewBox="0 0 90 56">
            <path d="M8 50 A37 37 0 0 1 82 50" strokeWidth="8" strokeLinecap="round" className="fill-none stroke-zinc-200 dark:stroke-zinc-800" />
            <path d="M8 50 A37 37 0 0 1 82 50" strokeWidth="8" strokeLinecap="round" className="fill-none stroke-zinc-900 transition-[stroke-dashoffset] duration-100 dark:stroke-white" strokeDasharray={116} strokeDashoffset={116 - (116 * p) / 100} />
          </svg>
          <span className="absolute inset-x-0 bottom-0 text-center font-mono text-xs text-zinc-500">仪表</span>
        </div>
      </div>
    </div>
  );
}

/* Loading */
function LoadingDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-8 md:grid-cols-4">
      <div className="flex flex-col items-center gap-3">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
        <span className="text-xs text-zinc-500">Spinner</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-6 items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 animate-dot rounded-full bg-zinc-900 dark:bg-white" style={{ animationDelay: `${i * 0.16}s` }} />
          ))}
        </span>
        <span className="text-xs text-zinc-500">Dots</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-6 items-end gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="w-1 rounded-full bg-zinc-900 dark:bg-white" style={{ animation: "bars 1s ease-in-out infinite", animationDelay: `${i * 0.1}s`, height: 8 }} />
          ))}
        </span>
        <style>{`@keyframes bars{0%,100%{height:8px}50%{height:24px}}`}</style>
        <span className="text-xs text-zinc-500">Bars</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="relative flex h-6 w-6">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-900 opacity-40 dark:bg-white" />
          <span className="relative inline-flex h-6 w-6 rounded-full bg-zinc-900 dark:bg-white" />
        </span>
        <span className="text-xs text-zinc-500">Pulse</span>
      </div>
      <div className="col-span-2 space-y-3 md:col-span-4">
        <div className="text-center text-xs text-zinc-500">Skeleton 骨架屏</div>
        <div className="mx-auto flex max-w-md gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="skeleton h-12 w-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2.5">
            <div className="skeleton h-3.5 w-1/3 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Empty state */
function EmptyDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-700">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <Icon.Folder size={22} className="text-zinc-400" />
      </div>
      <h4 className="mt-4 font-medium">还没有项目</h4>
      <p className="mt-1 max-w-xs text-sm text-zinc-500">创建你的第一个项目来开始协作，或者从模板快速开始。</p>
      <div className="mt-5 flex gap-2">
        <Button size="sm">
          <Icon.Plus /> 新建项目
        </Button>
        <Button size="sm" variant="outline">
          浏览模板
        </Button>
      </div>
    </div>
  );
}

/* Popover */
function PopoverDemo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("keydown", k);
    };
  }, []);
  return (
    <div ref={ref} className="relative">
      <Button variant="outline" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon.Settings /> 显示设置
      </Button>
      {open && (
        <div className="absolute left-1/2 z-20 mt-2 w-64 -translate-x-1/2 animate-scale-in rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900" />
          <h4 className="text-sm font-medium">尺寸</h4>
          <p className="mt-0.5 text-xs text-zinc-500">设置画布的显示尺寸。</p>
          <div className="mt-3 grid grid-cols-3 items-center gap-2 text-sm">
            <label className="text-zinc-500">宽度</label>
            <input className={cn(inputCls, "col-span-2 h-8")} defaultValue="1280" />
            <label className="text-zinc-500">高度</label>
            <input className={cn(inputCls, "col-span-2 h-8")} defaultValue="800" />
          </div>
        </div>
      )}
    </div>
  );
}

function FabDemo() {
  const [open, setOpen] = useState(false);
  const actions = [["新建文档", Icon.File], ["上传图片", Icon.Image], ["扫描", Icon.Search]] as const;
  return (
    <div className="relative flex h-64 w-full items-end justify-center pb-4">
      <div className="relative">
        {open && (
          <div className="absolute bottom-[4.5rem] left-1/2 flex w-max -translate-x-1/2 flex-col items-stretch gap-2">
            {/* w-max：绝对定位容器的可用宽度只有容器右半边，不收缩会导致文字被挤成竖排 */}
            {actions.map(([t, I], k) => (
              <button
                key={t}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${k * 40}ms` }}
                className="flex animate-fade-up items-center gap-2.5 whitespace-nowrap rounded-full border border-zinc-200 bg-white py-2.5 pl-4 pr-5 text-sm font-medium shadow-lg transition-transform hover:scale-[1.03] dark:border-zinc-700 dark:bg-zinc-900"
              >
                <I size={15} className="text-zinc-500" /> {t}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="快捷操作"
          className="grid h-14 w-14 place-items-center rounded-full bg-zinc-900 text-white shadow-xl transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-zinc-900"
        >
          <Icon.Plus className={cn("transition-transform duration-200", open && "rotate-45")} />
        </button>
      </div>
      <span className="absolute bottom-0 left-0 right-0 text-center text-xs text-zinc-400">点击主按钮展开快捷操作</span>
    </div>
  );
}

export default function Feedback() {
  return (
    <section>
      <SectionHeader
        id="feedback"
        index="05"
        title="反馈与覆盖层"
        en="Feedback & Overlays"
        intro="反馈让用户知道「系统听到了、正在处理、结果如何」。从轻到重：Toast（不打断）→ Alert / Banner（页面内）→ Popover（局部）→ Drawer（侧边）→ Modal（必须处理）。选择最轻的能完成任务的方式。"
        icon={<Icon.Bell />}
      />

      <Showcase
        id="toast"
        title="轻提示"
        en="Toast"
        level="进阶"
        description="右下角堆叠的临时通知，3 秒后自动消失，也可手动关闭。最多同时显示 3 条，新的把旧的挤出。"
        usage={["操作成功 / 失败的即时反馈。", "后台任务完成通知。", "不要用于需要用户决策的信息。"]}
        points={[
          "用数组管理队列，每条含 id；push 时 slice(-3) 限制数量。",
          "两段式移除：先标记 leaving 触发退出动画，300ms 后真正删除；手动关闭也走同一流程。",
          "容器 pointer-events-none，单条 pointer-events-auto，避免遮挡下方内容。",
          "要固定到视口角落且不被任何容器裁切，用 createPortal 渲染到 document.body（本站预览容器带 overflow-hidden，示例即如此实现）。",
          "悬停暂停倒计时需要自己维护每条的剩余时间，sonner 等库已内置。",
          "生产环境推荐 sonner 库。",
        ]}
        a11y={["role=\"status\" + aria-live=\"polite\"；错误用 aria-live=\"assertive\"。", "自动消失时长 ≥ 3s，有链接的要更长或不自动消失。"]}
        code={`const push = (t) => {
  const id = Date.now();
  setToasts(ts => [...ts, { ...t, id }].slice(-3));
  setTimeout(() => setToasts(ts => ts.map(x => x.id === id ? { ...x, leaving: true } : x)), 3000);
  setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 3300);
};

<div className="pointer-events-none fixed bottom-4 right-4 flex w-80 flex-col gap-2">
  {toasts.map(t => (
    <div key={t.id} role="status"
      className={cn("pointer-events-auto rounded-lg border bg-white p-3 shadow-lg transition-all duration-300",
        t.leaving ? "translate-x-4 opacity-0" : "animate-fade-up")}>…</div>
  ))}
</div>`}
      >
        <ToastDemo />
      </Showcase>

      <Showcase
        id="modal"
        title="对话框 · 确认框"
        en="Modal · Alert Dialog"
        description="居中弹出、遮罩背景、阻断其他操作的容器。普通对话框用于表单编辑；确认框（Alert Dialog）用于不可逆操作的二次确认，图标 + 标题 + 描述 + 两个等宽按钮。"
        usage={["需要用户完成后才能继续的任务。", "危险操作确认。", "内容超过一屏的不要用 Modal，改用页面或 Drawer。"]}
        points={[
          "遮罩 bg-black/40 + 可选 backdrop-blur；点击遮罩关闭，面板 stopPropagation。",
          "进入动画 scale 0.96→1 + 淡入；退出可省略或更快。",
          "打开时锁定 body 滚动（overflow: hidden），关闭时恢复。",
          "Esc 关闭；确认框的危险按钮不要默认聚焦。",
          "若挂载在带 overflow / transform 的容器内，fixed 层会被裁切成容器大小——用 createPortal 渲染到 document.body 再 fixed，就能像 ⌘K 命令面板一样覆盖全屏（本站示例即如此）。",
          "原生 <dialog> 元素 + showModal() 自带焦点陷阱与 Esc，值得优先考虑。",
        ]}
        a11y={["role=\"dialog\" / \"alertdialog\" + aria-modal=\"true\" + aria-labelledby。", "焦点陷阱：Tab 循环在对话框内；关闭后焦点回到触发按钮。"]}
        code={`{open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={close}>
    <div role="dialog" aria-modal aria-labelledby="title" onClick={e => e.stopPropagation()}
      className="w-full max-w-md animate-scale-in rounded-2xl border bg-white p-6 shadow-2xl">
      <h3 id="title" className="text-lg font-semibold">标题</h3>
      …
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={close}>取消</Button>
        <Button onClick={save}>保存</Button>
      </div>
    </div>
  </div>
)}

// 锁定滚动
useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);`}
      >
        <ModalDemo />
      </Showcase>

      <Showcase
        id="drawer"
        title="抽屉 · 底部面板"
        en="Drawer · Bottom Sheet"
        level="进阶"
        description="从屏幕边缘滑入的面板。桌面端从右侧滑入（筛选、详情）；移动端从底部滑入（分享、操作列表），顶部带拖拽把手。"
        usage={["不离开当前页面查看 / 编辑详情。", "移动端的操作菜单（Action Sheet）。", "复杂筛选面板。"]}
        points={["右侧：inset-y-0 right-0 + translateX(100%→0)；底部：inset-x-0 bottom-0 + translateY(100%→0) + rounded-t-2xl。", "缓动 cubic-bezier(0.32,0.72,0,1) 300ms。", "打开时锁定 body 滚动、Esc 关闭，与 Modal 一致。", "抽屉浮层也要 createPortal 到 document.body，否则会被预览容器 overflow 裁切，无法真正铺满屏幕。", "底部面板手势下拉关闭：把手上 pointerdown + setPointerCapture，move 跟随位移，松手超过阈值（80px）关闭，否则回弹；进入动画结束后再接管 transform，避免和 keyframes 打架。", "vaul 是 React 生态最好的 Bottom Sheet 库。"]}
        code={`<div className="fixed inset-0 z-50 bg-black/40" onClick={close}>
  <div onClick={e => e.stopPropagation()}
    className={cn("absolute bg-white shadow-2xl",
      side === "right"  && "inset-y-0 right-0 w-full max-w-sm animate-slide-in-right",
      side === "bottom" && "inset-x-0 bottom-0 rounded-t-2xl animate-slide-up")}>
    {side === "bottom" && <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-zinc-300" />}
    …
  </div>
</div>

@keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
@keyframes slideUp      { from { transform: translateY(100%) } to { transform: translateY(0) } }`}
      >
        <DrawerDemo />
      </Showcase>

      <Showcase
        id="alert"
        title="警告条 · 横幅"
        en="Alert · Banner"
        description="页面内嵌的静态提示，四种语义色 + 图标 + 标题 + 描述 + 可选关闭。横幅（Banner）横跨页面顶部或底部，用于 Cookie、公告等。"
        usage={["表单提交后的整体错误摘要。", "系统公告、版本更新、配额警告。", "Cookie 同意、浏览器兼容提示。"]}
        points={["浅底 + 同色系深字 + 同色系边框，图标与标题对齐。", "信息类可用纯灰阶，减少颜色噪音。", "横幅用反色（深底白字）从页面中区分出来。", "可关闭的横幅要记住关闭状态（localStorage）。"]}
        a11y={["role=\"alert\" 用于重要即时信息；一般提示用 role=\"status\"。"]}
        code={`<div role="alert" className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
  <AlertIcon className="mt-0.5 shrink-0" />
  <div className="flex-1">
    <div className="font-medium">注意</div>
    <div className="mt-0.5 opacity-80">你的存储空间即将用尽。</div>
  </div>
  <button aria-label="关闭"><XIcon size={14} /></button>
</div>`}
      >
        <AlertDemo />
      </Showcase>

      <Showcase
        id="progress"
        title="进度指示"
        en="Progress · Radial · Gauge"
        level="进阶"
        description="线性进度条、不确定进度、分段进度、环形进度、半圆仪表盘。环形进度用 SVG 的 stroke-dasharray / dashoffset 技巧实现。"
        usage={["上传 / 下载、任务完成度、配额使用、多步流程。", "不确定时长用不确定进度（滑动条）而不是假进度。"]}
        points={[
          "线性：外层 overflow-hidden rounded-full，内层 width 百分比 + transition-[width]。",
          "环形：circumference = 2πr；dasharray = c；dashoffset = c − c × p%；svg 旋转 −90° 让起点在顶部。",
          "仪表：用 SVG path 画半圆弧，同样的 dashoffset 技巧，dasharray 为弧长。",
          "分段：n 个等宽条，前 floor(p / (100/n)) 个填充。",
        ]}
        a11y={["role=\"progressbar\" + aria-valuenow / min / max；不确定进度省略 aria-valuenow。"]}
        code={`const r = 28, c = 2 * Math.PI * r;
<svg width="72" height="72" className="-rotate-90">
  <circle cx="36" cy="36" r={r} strokeWidth="6" className="fill-none stroke-zinc-200" />
  <circle cx="36" cy="36" r={r} strokeWidth="6" strokeLinecap="round"
    className="fill-none stroke-zinc-900 transition-[stroke-dashoffset]"
    strokeDasharray={c} strokeDashoffset={c - (c * p) / 100} />
</svg>`}
      >
        <ProgressDemo />
      </Showcase>

      <Showcase
        id="loading"
        title="加载态"
        en="Spinner · Dots · Skeleton"
        description="Spinner 用于短暂等待（< 1s 可不显示）；骨架屏用于页面 / 列表首次加载，保持布局稳定；跳动点用于聊天「正在输入」。"
        usage={["按钮内：Spinner。", "内容区：Skeleton，形状与真实内容一致。", "全屏：避免，改为局部加载。"]}
        points={[
          "Spinner：圆形边框 + border-t 不同色 + animate-spin。",
          "Dots：三个圆 animation-delay 依次 0 / 160 / 320ms。",
          "Skeleton：灰底 + 从左到右扫过的高光（background-size 200% + background-position 动画）。",
          "加载超过 300ms 才显示 loading，避免闪烁（延迟显示）。",
        ]}
        code={`/* Skeleton 微光 */
.skeleton {
  background: #e4e4e7;
  background-image: linear-gradient(90deg, transparent, rgb(255 255 255 / .6), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.6s linear infinite;
}
@keyframes shimmer { from { background-position: -200% 0 } to { background-position: 200% 0 } }

/* Dots */
<span className="h-2 w-2 rounded-full bg-zinc-900 animate-dot" style={{ animationDelay: "160ms" }} />`}
        codeLang="css"
      >
        <LoadingDemo />
      </Showcase>

      <Showcase
        id="empty"
        title="空状态"
        en="Empty State"
        description="没有数据时不要留白，而是解释「为什么是空的」并给出下一步行动。图标 + 标题 + 描述 + 主次两个按钮，虚线边框暗示这是一个占位。"
        usage={["首次使用、搜索无结果、筛选后为空、清空后。", "不同原因的空状态文案要不同。"]}
        points={["图标放在有边框的白色小方块里，比裸图标更精致。", "描述限制在 2 行内，max-w-xs。", "搜索无结果时提供「清除筛选」按钮。"]}
        code={`<div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center">
  <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-white shadow-sm">
    <FolderIcon className="text-zinc-400" />
  </div>
  <h4 className="mt-4 font-medium">还没有项目</h4>
  <p className="mt-1 max-w-xs text-sm text-zinc-500">创建你的第一个项目来开始协作。</p>
  <Button className="mt-5">新建项目</Button>
</div>`}
      >
        <EmptyDemo />
      </Showcase>

      <Showcase
        id="popover"
        title="气泡卡片"
        en="Popover"
        description="点击触发、带箭头的浮层，可以放置表单等交互内容（与 Tooltip 的区别）。点击外部关闭。"
        usage={["快捷设置、日期选择、颜色选择、用户信息卡。"]}
        points={["箭头用旋转 45° 的正方形 + 左上两条边框，覆盖在浮层顶边。", "居中：left-1/2 -translate-x-1/2。", "复杂定位（翻转、偏移、碰撞）用 Floating UI。"]}
        a11y={["触发器 aria-expanded + aria-controls。", "浮层内第一个可聚焦元素自动聚焦，Esc 关闭。"]}
        previewClassName="overflow-visible"
        code={`<div className="absolute left-1/2 mt-2 w-64 -translate-x-1/2 rounded-xl border bg-white p-4 shadow-lg">
  {/* 箭头 */}
  <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t bg-white" />
  …
</div>`}
      >
        <PopoverDemo />
      </Showcase>

      <Showcase
        id="fab"
        title="悬浮操作按钮"
        en="FAB · Speed Dial"
        level="进阶"
        description="Material 风格的悬浮按钮（FAB）及其展开形态（Speed Dial）：点击主按钮向上弹出 3 个快捷操作，+ 旋转 45° 变为关闭。"
        usage={["移动端页面的主创建动作（新建、发布）。", "Speed Dial 收纳 3–4 个次级操作；更多请用底部面板。"]}
        points={["主按钮 rounded-full h-14 w-14 shadow-xl；动作项从 bottom 全距 + left-1/2 -translate-x-1/2 向上排布。", "展开动画复用 animate-fade-up，配合每项 animationDelay 40ms 逐个出现。", "+ 图标 rotate-45 过渡为 ×，不换图标。", "移动端注意避开底部安全区：bottom = 16px + env(safe-area-inset-bottom)。"]}
        a11y={["主按钮 aria-expanded；动作面板打开时焦点移入第一项，Esc 关闭。", "只保留一个 FAB——多个悬浮球会互相打架。"]}
        code={`<div className="relative">
  {open && (
    <div className="absolute bottom-[4.5rem] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
      {actions.map(([label, Icon], k) => (
        <button key={label} style={{ animationDelay: \`\${k * 40}ms\` }}
          className="animate-fade-up flex items-center gap-2 rounded-full border bg-white py-2 shadow-lg">
          <Icon size={14} /> {label}
        </button>
      ))}
    </div>
  )}
  <button aria-expanded={open} aria-label="快捷操作"
    className="grid h-14 w-14 place-items-center rounded-full bg-zinc-900 text-white shadow-xl">
    <Plus className={cn("transition-transform duration-200", open && "rotate-45")} />
  </button>
</div>`}
      >
        <FabDemo />
      </Showcase>
    </section>
  );
}
