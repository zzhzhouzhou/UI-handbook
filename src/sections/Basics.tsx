import { useEffect, useRef, useState } from "react";
import { Showcase, SectionHeader } from "../components/Showcase";
import { Button, Icon, inputCls, Kbd, Avatar, Label } from "../components/primitives";
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

function InputsDemo() {
  const [v, setV] = useState("");
  return (
    <div className="grid w-full max-w-lg gap-5">
      <div>
        <Label htmlFor="i1">邮箱</Label>
        <input id="i1" className={inputCls} placeholder="you@example.com" />
        <p className="mt-1.5 text-xs text-zinc-500">我们不会向第三方分享你的邮箱。</p>
      </div>
      <div>
        <Label htmlFor="i2">带图标 + 快捷键</Label>
        <div className="relative">
          <Icon.Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input id="i2" className={cn(inputCls, "pl-9 pr-14")} placeholder="搜索…" />
          <span className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </div>
      </div>
      <div>
        <Label htmlFor="i3">错误状态</Label>
        <input id="i3" aria-invalid className={cn(inputCls, "border-red-500 focus:border-red-500 focus:ring-red-500/15")} defaultValue="abc" />
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <Icon.Alert size={12} /> 请输入有效的用户名（至少 4 个字符）
        </p>
      </div>
      <div>
        <Label htmlFor="i4">带前后缀</Label>
        <div className="flex">
          <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">https://</span>
          <input id="i4" className={cn(inputCls, "rounded-none")} placeholder="yoursite" />
          <span className="inline-flex items-center rounded-r-lg border border-l-0 border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">.com</span>
        </div>
      </div>
      <div>
        <Label htmlFor="i5">多行文本（字数统计）</Label>
        <textarea id="i5" value={v} onChange={(e) => setV(e.target.value.slice(0, 120))} rows={3} className={cn(inputCls, "h-auto resize-none py-2")} placeholder="写点什么…" />
        <div className="mt-1 text-right font-mono text-[11px] text-zinc-400">{v.length}/120</div>
      </div>
    </div>
  );
}

function FloatingLabelDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      {["姓名", "公司"].map((l) => (
        <div key={l} className="relative">
          <input
            id={`fl-${l}`}
            placeholder=" "
            className="peer h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 pt-4 text-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white dark:focus:ring-white/10"
          />
          <label
            htmlFor={`fl-${l}`}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 transition-all peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-900 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] dark:peer-focus:text-white"
          >
            {l}
          </label>
        </div>
      ))}
    </div>
  );
}

function SelectionDemo() {
  const [checked, setChecked] = useState([true, false, false]);
  const [radio, setRadio] = useState("pro");
  const [sw, setSw] = useState(true);
  const [sw2, setSw2] = useState(false);
  return (
    <div className="grid w-full max-w-2xl gap-8 md:grid-cols-3">
      <div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">Checkbox</div>
        {["接收邮件通知", "订阅产品更新", "参与用户研究"].map((l, i) => (
          <label key={l} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
            {/* 真实的 input 承担状态与键盘交互，span 只负责绘制，点击文字经 label 转发到 input */}
            <input
              type="checkbox"
              className="peer sr-only"
              checked={checked[i]}
              onChange={() => setChecked((c) => c.map((x, j) => (j === i ? !x : x)))}
            />
            <span
              aria-hidden
              className={cn(
                "flex h-4.5 w-4.5 items-center justify-center rounded border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-900 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-white dark:peer-focus-visible:ring-offset-zinc-950",
                checked[i] ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900" : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900",
              )}
            >
              {checked[i] && <Icon.Check size={12} strokeWidth={3} />}
            </span>
            {l}
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">Radio Card</div>
        {[
          ["free", "免费版", "¥0 / 月"],
          ["pro", "专业版", "¥29 / 月"],
        ].map(([k, t, p]) => (
          <button
            key={k}
            onClick={() => setRadio(k)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
              radio === k ? "border-zinc-900 ring-1 ring-zinc-900 dark:border-white dark:ring-white" : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700",
            )}
          >
            <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border", radio === k ? "border-zinc-900 dark:border-white" : "border-zinc-300 dark:border-zinc-600")}>
              {radio === k && <span className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-white" />}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">{t}</span>
              <span className="block text-xs text-zinc-500">{p}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">Switch</div>
        {[
          ["深色模式", sw, setSw],
          ["自动更新", sw2, setSw2],
        ].map(([l, on, set]) => (
          <div key={l as string} className="flex items-center justify-between text-sm">
            <span>{l as string}</span>
            <button
              role="switch"
              aria-checked={on as boolean}
              onClick={() => (set as (v: boolean) => void)(!(on as boolean))}
              className={cn(
                "relative h-6 w-10 rounded-full transition-colors duration-200 after:absolute after:-inset-2 after:rounded-full after:content-['']",
                on ? "bg-zinc-900 dark:bg-white" : "bg-zinc-300 dark:bg-zinc-700",
              )}
            >
              <span className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 dark:bg-zinc-900", on && "translate-x-4")} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SliderDemo() {
  const [v, setV] = useState(40);
  const [range, setRange] = useState<[number, number]>([20, 70]);
  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <div className="mb-3 flex justify-between text-sm">
          <span>音量</span>
          <span className="font-mono tabular-nums text-zinc-500">{v}%</span>
        </div>
        <div className="relative h-5">
          <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div className="h-full rounded-full bg-zinc-900 dark:bg-white" style={{ width: `${v}%` }} />
          </div>
          <input type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} className="absolute inset-0 w-full cursor-pointer opacity-0" aria-label="音量" />
          <div className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-900 bg-white shadow dark:border-white dark:bg-zinc-900" style={{ left: `${v}%` }} />
        </div>
      </div>
      <div>
        <div className="mb-3 flex justify-between text-sm">
          <span>价格区间</span>
          <span className="font-mono tabular-nums text-zinc-500">¥{range[0]} – ¥{range[1]}</span>
        </div>
        <div className="relative h-5">
          <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div className="absolute h-full rounded-full bg-zinc-900 dark:bg-white" style={{ left: `${range[0]}%`, width: `${range[1] - range[0]}%` }} />
          </div>
          <input type="range" min={0} max={100} value={range[0]} onChange={(e) => setRange([Math.min(+e.target.value, range[1] - 5), range[1]])} className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent opacity-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none" />
          <input type="range" min={0} max={100} value={range[1]} onChange={(e) => setRange([range[0], Math.max(+e.target.value, range[0] + 5)])} className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent opacity-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none" />
          {range.map((r, i) => (
            <div key={i} className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-900 bg-white shadow dark:border-white dark:bg-zinc-900" style={{ left: `${r}%` }} />
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

function OtpDemo() {
  const [vals, setVals] = useState(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const onChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...vals];
    next[i] = v;
    setVals(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !vals[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };
  const onPaste = (e: React.ClipboardEvent) => {
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (t) {
      setVals(t.split("").concat(Array(6 - t.length).fill("")));
      refs.current[Math.min(t.length, 5)]?.focus();
      e.preventDefault();
    }
  };
  const done = vals.every(Boolean);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2" onPaste={onPaste}>
        {vals.map((v, i) => (
          <span key={i} className="contents">
            {i === 3 && <span className="self-center text-zinc-300">—</span>}
            <input
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={v}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              onFocus={(e) => e.target.select()}
              className={cn("h-12 w-8 rounded-lg border text-center font-mono text-lg outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 sm:w-10 dark:bg-zinc-900 dark:focus:border-white dark:focus:ring-white/10", done ? "border-emerald-500" : "border-zinc-300 dark:border-zinc-700")}
            />
          </span>
        ))}
      </div>
      <p className="text-xs text-zinc-500">{done ? "✓ 验证码已填写完整" : "支持直接粘贴 6 位数字"}</p>
    </div>
  );
}

function RatingDemo() {
  const [v, setV] = useState(3);
  const [h, setH] = useState(0);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex" onMouseLeave={() => setH(0)} role="radiogroup" aria-label="评分">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} onMouseEnter={() => setH(i)} onClick={() => setV(i)} className="rounded p-1 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950" role="radio" aria-checked={v === i} aria-label={`${i} 星`}>
            <Icon.Star size={26} className={cn("transition-colors", i <= (h || v) ? "fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" : "text-zinc-300 dark:text-zinc-700")} />
          </button>
        ))}
      </div>
      <span className="text-xs text-zinc-500">{["", "很差", "较差", "一般", "不错", "非常好"][h || v]}</span>
    </div>
  );
}

function DropzoneDemo() {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: number; p: number }[]>([]);
  const [err, setErr] = useState("");
  const uploading = files.some((f) => f.p < 100);
  useEffect(() => {
    if (!uploading) return;
    const t = setInterval(() => setFiles((fs) => fs.map((f) => ({ ...f, p: Math.min(100, f.p + 8) }))), 120);
    return () => clearInterval(t);
  }, [uploading]);
  const add = (list: FileList | null) => {
    if (!list) return;
    const ok: File[] = [];
    for (const x of Array.from(list)) {
      if (!/^(image\/png|image\/jpeg|application\/pdf)$/.test(x.type) || x.size > 10 * 1024 * 1024) setErr(`${x.name}：仅支持 PNG/JPG/PDF，且不超过 10MB`);
      else ok.push(x);
    }
    if (ok.length) {
      setErr("");
      setFiles((f) => [...f, ...ok.map((x) => ({ name: x.name, size: x.size, p: 0 }))]);
    }
  };
  return (
    <div className="w-full max-w-md space-y-3">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={cn("flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors", over ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-900" : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700")}
      >
        {/* pointer-events-none：拖拽经过内部文字/图标时不会反复触发 dragleave 造成高亮闪烁 */}
        <span className="pointer-events-none flex flex-col items-center gap-2">
          <Icon.Upload size={22} className="text-zinc-400" />
          <span className="text-sm">
            拖拽文件到此处，或 <span className="font-medium underline underline-offset-2">点击上传</span>
          </span>
          <span className="text-xs text-zinc-400">PNG、JPG、PDF，最大 10MB</span>
        </span>
        <input type="file" multiple accept=".png,.jpg,.jpeg,.pdf" className="sr-only" onChange={(e) => add(e.target.files)} />
      </label>
      {err && <p className="text-xs text-red-600">{err}</p>}
      {files.map((f, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <Icon.File className="text-zinc-400" />
          <div className="min-w-0 flex-1">
            <div className="flex justify-between text-xs">
              <span className="truncate">{f.name}</span>
              <span className="text-zinc-400">{(f.size / 1024).toFixed(0)} KB</span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div className="h-full rounded-full bg-zinc-900 transition-all dark:bg-white" style={{ width: `${f.p}%` }} />
            </div>
          </div>
          {f.p >= 100 ? <Icon.Check className="text-emerald-600" /> : <span className="font-mono text-[11px] text-zinc-400">{f.p}%</span>}
        </div>
      ))}
    </div>
  );
}

function ComboboxDemo() {
  const all = ["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "西安", "南京", "重庆"];
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState("");
  const [idx, setIdx] = useState(0);
  const list = all.filter((c) => c.includes(q));
  return (
    <div className="relative w-full max-w-64">
      <Label>城市</Label>
      <input
        role="combobox"
        aria-expanded={open}
        value={open ? q : sel || q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setIdx(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") setIdx((i) => Math.min(i + 1, list.length - 1));
          if (e.key === "ArrowUp") setIdx((i) => Math.max(i - 1, 0));
          if (e.key === "Enter" && list[idx]) {
            setSel(list[idx]);
            setQ("");
            setOpen(false);
          }
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="输入搜索…"
        className={inputCls}
      />
      <Icon.ChevronDown className="pointer-events-none absolute right-3 top-[34px] text-zinc-400" />
      {open && (
        <ul role="listbox" className="absolute z-20 mt-1.5 max-h-48 w-full overflow-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg animate-scale-in dark:border-zinc-700 dark:bg-zinc-900">
          {list.length === 0 && <li className="px-3 py-6 text-center text-sm text-zinc-400">无匹配结果</li>}
          {list.map((c, i) => (
            <li
              key={c}
              role="option"
              aria-selected={sel === c}
              onMouseEnter={() => setIdx(i)}
              onMouseDown={() => {
                setSel(c);
                setQ("");
                setOpen(false);
              }}
              className={cn("flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-sm", i === idx && "bg-zinc-100 dark:bg-zinc-800")}
            >
              {c}
              {sel === c && <Icon.Check size={14} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DatePickerDemo() {
  const [cur, setCur] = useState(() => new Date());
  const [sel, setSel] = useState<Date | null>(null);
  const y = cur.getFullYear(), m = cur.getMonth();
  const now = new Date();
  const isToday = (d: number | null) => !!d && d === now.getDate() && m === now.getMonth() && y === now.getFullYear();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return (
    <div className="w-full max-w-72 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => setCur(new Date(y, m - 1, 1))} className="grid h-8 w-8 place-items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="上个月">
          <Icon.ChevronLeft />
        </button>
        <span className="text-sm font-medium">
          {y} 年 {m + 1} 月
        </span>
        <button onClick={() => setCur(new Date(y, m + 1, 1))} className="grid h-8 w-8 place-items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="下个月">
          <Icon.ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] text-zinc-400">
        {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
        {cells.map((d, i) => {
          const isSel = d && sel && sel.getFullYear() === y && sel.getMonth() === m && sel.getDate() === d;
          return (
            <button key={i} disabled={!d} onClick={() => d && setSel(new Date(y, m, d))} className={cn("mx-auto h-9 w-9 rounded-md transition-colors sm:h-8 sm:w-8", !d && "invisible", isSel ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800", isToday(d) && !isSel && "font-semibold underline decoration-2 underline-offset-4")}>
              {d}
            </button>
          );
        })}
      </div>
      <div className="mt-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800">已选：{sel ? sel.toLocaleDateString("zh-CN") : "—"}</div>
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

export default function Basics() {
  return (
    <section>
      <SectionHeader
        id="basics"
        index="02"
        title="基础组件与表单"
        en="Basics & Forms"
        intro="按钮、输入框、选择器是出现频率最高的组件，也是最能体现细节功力的地方：一致的高度（32 / 36 / 44）、一致的圆角、一致的焦点环、一致的错误反馈。以下每个组件都以最克制的黑白灰实现，你可以把 zinc-900 替换成任何品牌色。"
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
        id="input"
        title="输入框"
        en="Input · Textarea"
        description="输入框由标签、输入区、帮助文字、错误信息四部分组成。焦点态用边框加深 + 4px 淡色外发光（ring）表示，比单纯改边框颜色更柔和。前后缀、内嵌图标、快捷键提示都是常见增强。"
        usage={["表单字段、搜索框、行内编辑。", "帮助文字放在下方，错误信息替换帮助文字而不是叠加。", "字数限制的多行文本显示实时计数。"]}
        points={[
          "统一高度 36px（h-9），与按钮同高，方便并排。",
          "focus:ring-4 ring-zinc-900/10 + focus:border-zinc-900 组成柔和焦点态。",
          "错误态：border-red-500 + aria-invalid + 红色错误文字 + 图标。",
          "内嵌图标用绝对定位 + pointer-events-none，输入区加 pl-9。",
          "textarea 用 resize-none + 自动高度（onInput 时 el.style.height = el.scrollHeight）。",
        ]}
        a11y={["label 用 htmlFor 关联；帮助文字用 aria-describedby 关联。", "错误文字加 role=\"alert\" 让读屏软件即时播报。", "placeholder 不能替代 label。"]}
        code={`<div>
  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">邮箱</label>
  <div className="relative">
    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
    <input
      id="email"
      aria-describedby="email-help"
      className="h-9 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-sm
                 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none
                 focus:ring-4 focus:ring-zinc-900/10 aria-invalid:border-red-500"
    />
  </div>
  <p id="email-help" className="mt-1.5 text-xs text-zinc-500">帮助文字</p>
</div>`}
      >
        <InputsDemo />
      </Showcase>

      <Showcase
        id="floating-label"
        title="浮动标签"
        en="Floating Label"
        level="进阶"
        description="标签初始在输入框内充当占位，聚焦或有值时缩小并上移到顶部。纯 CSS 实现，依赖 :placeholder-shown 伪类和 peer 选择器。"
        usage={["表单空间紧凑、需要节省垂直空间的场景（登录、注册）。", "Material Design 风格界面。"]}
        points={[
          "input 设置 placeholder=\" \"（一个空格），这样 :placeholder-shown 才能正确判断是否为空。",
          "label 绝对定位，用 peer-focus 和 peer-[:not(:placeholder-shown)] 两个条件触发上移。",
          "input 加 pt-4 给上移后的 label 留出空间。",
          "transition-all 让位置与字号同时过渡。",
        ]}
        pitfalls={["忘记 placeholder=\" \"，导致有值时 label 掉回去。", "label 没有 pointer-events-none，遮挡点击。"]}
        code={`<div className="relative">
  <input id="name" placeholder=" "
    className="peer h-12 w-full rounded-lg border border-zinc-300 px-3 pt-4 text-sm
               focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 outline-none" />
  <label htmlFor="name"
    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 transition-all
               peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-zinc-900
               peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0
               peer-[:not(:placeholder-shown)]:text-[10px]">
    姓名
  </label>
</div>`}
      >
        <FloatingLabelDemo />
      </Showcase>

      <Showcase
        id="selection"
        title="复选框 · 单选卡片 · 开关"
        en="Checkbox · Radio · Switch"
        description="三者语义不同：Checkbox 多选、Radio 单选（互斥）、Switch 即时生效的开/关。单选卡片（Radio Card）是 Radio 的增强形式，把选项做成可点击的整块卡片，适合方案 / 套餐选择。"
        usage={["Checkbox：多选、条款同意、批量选择表格行。", "Radio：2–5 个互斥选项且都需要可见。超过 5 个用 Select。", "Switch：设置项，切换后立即生效，无需提交按钮。"]}
        points={[
          "自定义样式：隐藏原生 input（sr-only），用 span 绘制，状态由 aria-checked 控制。",
          "Switch 滑块：translate-x 过渡 200ms；轨道颜色同步变化。",
          "Radio Card 选中态用 ring-1 + 边框同色，而不是加粗边框（会导致布局跳动）。",
          "整个 label 可点击，扩大命中区域（最小 44×44）。",
        ]}
        a11y={["Switch 用 role=\"switch\" + aria-checked。", "Radio 组用 role=\"radiogroup\" 包裹并支持方向键切换。", "半选（indeterminate）状态用于父子级勾选。"]}
        code={`// Switch
<button role="switch" aria-checked={on} onClick={() => setOn(!on)}
  className={cn("relative h-6 w-10 rounded-full transition-colors",
    on ? "bg-zinc-900" : "bg-zinc-300")}>
  <span className={cn("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
    on && "translate-x-4")} />
</button>

// Radio Card
<button onClick={() => setPlan("pro")}
  className={cn("w-full rounded-lg border p-3 text-left transition-all",
    plan === "pro" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200 hover:border-zinc-400")}>
  …
</button>`}
      >
        <SelectionDemo />
      </Showcase>

      <Showcase
        id="slider"
        title="滑块 · 区间滑块"
        en="Slider · Range"
        level="进阶"
        description="用于在连续区间内选值。原生 input[type=range] 样式难以自定义，常见做法是把原生 input 透明覆盖在自绘轨道上，保留原生的键盘与触摸行为。区间滑块叠加两个 input。"
        usage={["音量、亮度、价格区间、进度拖动。", "需要即时反馈的数值调整。"]}
        points={[
          "原生 input 绝对定位 + opacity-0，负责交互；轨道和滑块用 div 绘制，位置由 value 百分比计算。",
          "区间滑块：两个 input 设置 pointer-events-none，只让 thumb 可点击（WebKit 用 [&::-webkit-slider-thumb]:pointer-events-auto，Firefox 用 ::-moz-range-thumb）。",
          "限制两个滑块不交叉：min(value, max - step)。",
          "显示当前值用 tabular-nums 防止宽度跳动。",
        ]}
        a11y={["保留原生 input 就自动拥有方向键、Home/End 支持。", "添加 aria-label 或 aria-labelledby。"]}
        code={`<div className="relative h-5">
  <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-zinc-200">
    <div className="h-full rounded-full bg-zinc-900" style={{ width: \`\${v}%\` }} />
  </div>
  <input type="range" min={0} max={100} value={v}
    onChange={(e) => setV(+e.target.value)}
    className="absolute inset-0 w-full cursor-pointer opacity-0" />
  <div className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2
                  rounded-full border-2 border-zinc-900 bg-white shadow"
       style={{ left: \`\${v}%\` }} />
</div>`}
      >
        <SliderDemo />
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
        id="otp"
        title="验证码输入"
        en="OTP Input"
        level="进阶"
        description="6 个独立单元格，输入后自动跳到下一格，退格回到上一格，支持整体粘贴。填写完整后高亮边框。"
        usage={["短信 / 邮件验证码、两步验证、PIN 码。"]}
        points={[
          "每格 maxLength=1 + inputMode=\"numeric\" 唤起数字键盘。",
          "onChange 校验为单个数字后写入并 focus 下一格。",
          "onKeyDown 监听 Backspace：当前格为空时回到上一格；ArrowLeft / ArrowRight 移动光标。",
          "onPaste 拦截剪贴板内容，去掉非数字后分发到各格。",
          "autoComplete=\"one-time-code\" 让 iOS 自动填充短信验证码。",
        ]}
        code={`const onChange = (i, v) => {
  if (!/^\\d?$/.test(v)) return;
  const next = [...vals]; next[i] = v; setVals(next);
  if (v && i < 5) refs.current[i + 1]?.focus();
};
const onKeyDown = (i, e) => {
  if (e.key === "Backspace" && !vals[i] && i > 0) refs.current[i - 1]?.focus();
};
const onPaste = (e) => {
  const t = e.clipboardData.getData("text").replace(/\\D/g, "").slice(0, 6);
  setVals(t.split("").concat(Array(6 - t.length).fill("")));
  e.preventDefault();
};`}
      >
        <OtpDemo />
      </Showcase>

      <Showcase
        id="rating"
        title="评分"
        en="Rating"
        description="星级评分组件，悬停预览、点击确定，同时显示文字描述。"
        usage={["商品评价、满意度调查、内容打分。"]}
        points={["维护两个状态：value（已选）和 hover（预览），渲染时取 hover || value。", "容器 onMouseLeave 重置 hover。", "hover:scale-110 给每颗星一点弹性。", "只读模式支持半星：用 overflow-hidden 的容器裁剪一半宽度。"]}
        a11y={["用 role=\"radiogroup\" + 每颗星 role=\"radio\" aria-checked。", "或者用真实的 input[type=radio] 隐藏实现。"]}
        code={`const [v, setV] = useState(3);
const [h, setH] = useState(0);
<div onMouseLeave={() => setH(0)}>
  {[1,2,3,4,5].map(i => (
    <button key={i} onMouseEnter={() => setH(i)} onClick={() => setV(i)}>
      <Star className={i <= (h || v) ? "fill-zinc-900" : "text-zinc-300"} />
    </button>
  ))}
</div>`}
      >
        <RatingDemo />
      </Showcase>

      <Showcase
        id="dropzone"
        title="文件上传区"
        en="Dropzone"
        level="进阶"
        description="虚线边框的拖放区域，支持拖拽与点击选择，拖入时高亮，上传后显示文件列表与进度条。"
        usage={["头像上传、附件、批量导入。"]}
        points={[
          "用 <label> 包裹隐藏的 input[type=file]，整块区域可点击。",
          "onDragOver 必须 preventDefault，否则 onDrop 不触发。",
          "dragenter / dragleave 会在子元素间反复触发，可以用计数器或 pointer-events-none 子元素避免闪烁。",
          "上传进度用 XHR 的 upload.onprogress 或 fetch + ReadableStream。",
          "校验类型与大小，错误时在文件行显示红色提示。",
        ]}
        code={`<label
  onDragOver={(e) => { e.preventDefault(); setOver(true); }}
  onDragLeave={() => setOver(false)}
  onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }}
  className={cn("flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed p-8",
    over ? "border-zinc-900 bg-zinc-50" : "border-zinc-300")}>
  <UploadIcon />
  <span>拖拽文件到此处，或点击上传</span>
  <input type="file" multiple className="sr-only" onChange={(e) => handle(e.target.files)} />
</label>`}
      >
        <DropzoneDemo />
      </Showcase>

      <Showcase
        id="combobox"
        title="可搜索下拉 / 组合框"
        en="Combobox"
        level="进阶"
        description="输入即过滤的下拉选择，支持方向键高亮、Enter 选中、Esc 关闭。比原生 select 灵活得多，是复杂表单的标配。"
        usage={["选项超过 7 个的选择场景。", "城市、国家、用户、标签等需要搜索的数据。"]}
        points={[
          "input 承担搜索，列表根据 query 过滤。",
          "activeIndex 状态跟随方向键与鼠标 hover，Enter 选中。",
          "onBlur 关闭需要 setTimeout 延迟，否则点击选项前列表就消失了；或者在选项上用 onMouseDown。",
          "列表最大高度 + overflow-auto，选中项需 scrollIntoView({ block: 'nearest' })。",
          "空结果给出明确提示，可附“创建 xxx”操作。",
        ]}
        a11y={["input 加 role=\"combobox\" aria-expanded aria-controls；列表 role=\"listbox\"；选项 role=\"option\" aria-selected。", "aria-activedescendant 指向高亮项的 id。"]}
        previewClassName="overflow-visible"
        code={`<input role="combobox" aria-expanded={open}
  value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }}
  onKeyDown={(e) => {
    if (e.key === "ArrowDown") setIdx(i => Math.min(i + 1, list.length - 1));
    if (e.key === "ArrowUp")   setIdx(i => Math.max(i - 1, 0));
    if (e.key === "Enter")     select(list[idx]);
    if (e.key === "Escape")    setOpen(false);
  }} />
{open && (
  <ul role="listbox" className="absolute mt-1.5 w-full rounded-lg border bg-white p-1 shadow-lg">
    {list.map((c, i) => (
      <li key={c} role="option" aria-selected={sel === c}
        onMouseEnter={() => setIdx(i)} onMouseDown={() => select(c)}
        className={cn("rounded-md px-2.5 py-1.5 text-sm", i === idx && "bg-zinc-100")}>{c}</li>
    ))}
  </ul>
)}`}
      >
        <ComboboxDemo />
      </Showcase>

      <Showcase
        id="datepicker"
        title="日期选择器"
        en="Date Picker"
        level="进阶"
        description="日历网格由「月首日是星期几」和「当月天数」两个数字推算出来。示例是最小可用实现，生产环境建议用 date-fns 处理时区与国际化。"
        usage={["生日、预约、筛选时间范围。", "范围选择需要 start / end 两个状态并高亮中间区间。"]}
        points={[
          "cells = 前置空格 (first = new Date(y, m, 1).getDay()) + 1..days。",
          "grid-cols-7 排列；每格 h-8 w-8 保证对齐。",
          "选中态实心，今天用下划线点标记，禁用日期 opacity-30。",
          "月份切换用 new Date(y, m ± 1, 1) 自动处理跨年。",
        ]}
        code={`const first = new Date(y, m, 1).getDay();
const days  = new Date(y, m + 1, 0).getDate();
const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

<div className="grid grid-cols-7 gap-y-1 text-center text-sm">
  {cells.map((d, i) => (
    <button key={i} disabled={!d} onClick={() => d && setSel(new Date(y, m, d))}
      className={cn("mx-auto h-8 w-8 rounded-md", !d && "invisible",
        isSelected(d) ? "bg-zinc-900 text-white" : "hover:bg-zinc-100")}>
      {d}
    </button>
  ))}
</div>`}
      >
        <DatePickerDemo />
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
