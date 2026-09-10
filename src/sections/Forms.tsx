import { useEffect, useRef, useState, type FormEvent } from "react";
import { Showcase, SectionHeader } from "../components/Showcase";
import { Button, Icon, inputCls, Kbd, Label } from "../components/primitives";
import { cn } from "../utils/cn";

/* ---------------- Demos ---------------- */

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


function SearchDemo() {
  const [v, setV] = useState("");
  return (
    <div className="w-full max-w-sm">
      <div className="relative">
        <Icon.Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input value={v} onChange={(e) => setV(e.target.value)} className={cn(inputCls, "pl-9 pr-16")} placeholder="搜索组件、文档…" aria-label="搜索" />
        {v ? (
          <button onClick={() => setV("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white" aria-label="清空搜索">
            <Icon.X size={14} />
          </button>
        ) : (
          <span className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-zinc-400">{v ? `搜索「${v}」— 按 Esc 清空` : "有内容时快捷键提示变为清空按钮"}</p>
    </div>
  );
}

function PasswordDemo() {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const strength = [pwd.length >= 8, /[A-Z]/.test(pwd), /\d/.test(pwd), /[^A-Za-z0-9]/.test(pwd)].filter(Boolean).length;
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="pwd-demo">密码</Label>
      <div className="relative">
        <input
          id="pwd-demo"
          type={show ? "text" : "password"}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className={cn(inputCls, "pr-10")}
          placeholder="至少 8 位，含大小写字母与数字"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          aria-label={show ? "隐藏密码" : "显示密码"}
          aria-pressed={show}
        >
          {show ? <Icon.EyeOff size={16} /> : <Icon.Eye size={16} />}
        </button>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < strength ? (strength <= 1 ? "bg-red-500" : strength <= 2 ? "bg-amber-500" : "bg-emerald-500") : "bg-zinc-200 dark:bg-zinc-800")} />
        ))}
      </div>
      <p className="text-xs text-zinc-500">右侧眼睛切换明文；强度实时反馈，帮用户在提交前就改好密码。</p>
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


function SelectDemo() {
  const [v, setV] = useState("");
  return (
    <div className="w-full max-w-sm">
      <Label htmlFor="sel-demo">分配给</Label>
      <div className="relative">
        <select
          id="sel-demo"
          value={v}
          onChange={(e) => setV(e.target.value)}
          className={cn(inputCls, "appearance-none pr-9", !v && "text-zinc-400")}
        >
          <option value="" disabled>选择一位成员…</option>
          <option>Li Hua</option>
          <option>Wang Fang</option>
          <option>Zhang Wei</option>
          <option>Chen Jing</option>
        </select>
        <Icon.ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
      <p className="mt-2 text-xs text-zinc-400">{v ? `已选择：${v}` : "原生 select + appearance-none 定制箭头，移动端唤起原生选择器"}</p>
    </div>
  );
}

function ColorSwatchesDemo() {
  const colors = ["#fafafa", "#e4e4e7", "#a1a1aa", "#71717a", "#3f3f46", "#27272a", "#18181b", "#09090b"];
  const [c, setC] = useState(colors[4]);
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {colors.map((x) => (
          <button
            key={x}
            onClick={() => setC(x)}
            aria-label={`选择颜色 ${x}`}
            aria-pressed={c === x}
            className={cn("h-9 w-9 rounded-lg border border-zinc-300 transition-transform dark:border-zinc-700", c === x && "scale-110 ring-2 ring-zinc-900 ring-offset-2 dark:ring-white dark:ring-offset-zinc-950")}
            style={{ background: x }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        当前 <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{c}</span>
      </div>
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

/* ---------------- Section ---------------- */

export default function Forms() {
  return (
    <section>
      <SectionHeader
        id="forms"
        index="03"
        title="表单与输入"
        en="Forms & Inputs"
        intro="表单是转化率的关键，也是细节密度最高的地方：统一的焦点环、即时的校验反馈、清晰的错误提示、正确的移动端键盘。这里覆盖从单行输入、滑块、验证码到日期选择与文件上传的全部输入场景。共同原则只有一条：保留原生控件的全部能力——键盘操作、自动填充、无障碍语义，只在视觉层做定制。"
        icon={<Icon.File />}
      />

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
        id="search"
        title="搜索框"
        en="Search Input"
        description="带图标、快捷键提示与一键清空的搜索输入。有内容时右侧的 ⌘K 提示自动变为清空按钮，同一位置永远只有一个元素。"
        usage={["站内搜索、列表筛选、命令面板的触发入口。"]}
        points={["图标绝对定位 + pointer-events-none，输入区加 pl-9。", "value 非空时渲染清空按钮，否则渲染快捷键提示。", "清空后把焦点还给输入框，方便连续输入。", "放大版可以做成点击后展开为全宽的搜索栏。"]}
        a11y={["输入框加 aria-label 或关联 label；清空按钮有独立 aria-label。", "搜索结果变化用 aria-live=\"polite\" 播报结果数量。"]}
        code={`<div className="relative">
  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
  <input className="h-9 w-full rounded-lg pl-9 pr-16 text-sm outline-none" placeholder="搜索…" />
  {value ? (
    <button aria-label="清空" onClick={clear} className="absolute right-2 top-1/2 -translate-y-1/2"><XIcon size={14} /></button>
  ) : (
    <span className="absolute right-2 top-1/2 -translate-y-1/2"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
  )}
</div>`}
      >
        <SearchDemo />
      </Showcase>

      <Showcase
        id="password"
        title="密码输入"
        en="Password Input"
        description="密码框三件套：明文 / 密文切换、实时强度条、自动填充支持。强度反馈帮助用户在提交前就把密码改好，而不是提交后被拒绝。"
        usage={["注册、修改密码、API 密钥输入。", "登录页通常不需要强度条，但保留显隐切换。"]}
        points={["type 在 text / password 间切换；眼睛图标用 aria-pressed 表达当前状态。", "强度 = 长度、大写、数字、符号四个条件的命中数，分四段展示。", "autoComplete=\"new-password\" / \"current-password\" 让密码管理器正确工作。", "强度规则放在输入时实时提示，不要等提交才校验。"]}
        a11y={["切换按钮用 aria-label 区分「显示密码 / 隐藏密码」。", "强度变化可用 aria-live=\"polite\" 播报。"]}
        code={`const [show, setShow] = useState(false);
const strength = [pwd.length >= 8, /[A-Z]/.test(pwd), /\d/.test(pwd),
  /[^A-Za-z0-9]/.test(pwd)].filter(Boolean).length;

<div className="relative">
  <input type={show ? "text" : "password"} className="pr-10" autoComplete="new-password" />
  <button aria-label={show ? "隐藏密码" : "显示密码"} aria-pressed={show}
    onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2">
    {show ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
</div>`}
      >
        <PasswordDemo />
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
        id="select"
        title="下拉选择"
        en="Select"
        description="选项在 4–10 个、无需搜索时的默认选择。用原生 <select> 换取移动端原生选择器与完整键盘支持，只定制外观。"
        usage={["表单里的单选场景：分类、负责人、状态。", "选项超过 10 个或需要搜索时改用 Combobox。"]}
        points={["appearance-none 移除原生外观，右侧绝对定位自绘箭头。", "未选择时文字用 zinc-400，与已选值区分。", "原生 select 自动拥有键盘导航、type-ahead 与移动端滚轮选择器。", "选项分组用 <optgroup label>；多选场景改用 Checkbox 列表。"]}
        a11y={["label 用 htmlFor 关联；占位 option 加 disabled + value=\"\"。"]}
        code={`<div className="relative">
  <select className="h-9 w-full appearance-none rounded-lg pr-9 text-sm"
    onChange={e => setV(e.target.value)}>
    <option value="" disabled>选择一位成员…</option>
    {members.map(m => <option key={m}>{m}</option>)}
  </select>
  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
</div>`}
      >
        <SelectDemo />
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
        id="color-swatches"
        title="颜色选择"
        en="Color Swatches"
        description="色板 + 选中环的颜色选择器。限定可选颜色比自由取色器更常见——品牌色本来就是有限的几个。"
        usage={["主题色选择、标签颜色、画笔颜色、标记分类。"]}
        points={["色块用 style={{ background }} 内联，因为颜色集合是动态数据。", "选中态 scale-110 + ring-2 + ring-offset 从色板中「浮起」。", "需要自由取色时叠加原生 <input type=\"color\">，或引入 react-colorful。", "色块本身就是按钮，天然支持键盘与触屏。"]}
        a11y={["每个色块加 aria-label（颜色值或名称）与 aria-pressed。", "仅靠选中环传达选中不够——对色觉障碍用户再加勾选图标更稳妥。"]}
        code={`{colors.map(c => (
  <button key={c} aria-pressed={selected === c} aria-label={\`选择颜色 \${c}\`}
    onClick={() => setSelected(c)}
    className={cn("h-9 w-9 rounded-lg border transition-transform",
      selected === c && "scale-110 ring-2 ring-zinc-900 ring-offset-2")}
    style={{ background: c }} />
))}`}
      >
        <ColorSwatchesDemo />
      </Showcase>

      <Showcase
        id="multi-select"
        title="多选下拉"
        en="Multi Select"
        level="进阶"
        description="可多选的下拉选择：点击展开选项列表，已选项以标签（chip）形式显示在输入框内，可单独移除；自带过滤与清空。"
        usage={["筛选条件多选、标签分类、邀请成员。", "选项超过 6 个时比 Checkbox 列表更省空间。"]}
        points={["已选 chips 内联在按钮里，带聚焦态；每个 chip 上的 × 用 stopPropagation 防止触发外层 toggle。", "面板 absolute 对齐输入框，role=\"listbox\" + aria-multiselectable，选项 role=\"option\" + aria-selected。", "点击外部 / Esc 关闭；面板内保留输入框做即时过滤。", "选项行用 checkbox 图形表达选中，色觉障碍用户也能分辨。"]}
        a11y={["chip 的移除按钮 aria-label=\"移除 X\"；已选数量在下方用文字同步展示。", "过滤输入框要有 placeholder 且面板打开时自动聚焦（示例略，可加 autoFocus）。"]}
        previewClassName="overflow-visible"
        code={`const [selected, setSelected] = useState(["React"]);
const toggle = (f) => setSelected(s => s.includes(f) ? s.filter(x => x !== f) : [...s, f]);

<button aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}
  className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border p-1.5">
  {selected.map(s => (
    <span key={s} className="inline-flex items-center gap-1 rounded-md bg-zinc-100 py-1 pl-2 pr-1 text-xs">
      {s}
      <button aria-label={\`移除 \${s}\`} onClick={e => { e.stopPropagation(); toggle(s); }}><X /></button>
    </span>
  ))}
</button>
{open && (
  <ul role="listbox" aria-multiselectable="true" className="absolute inset-x-0 top-full rounded-lg border bg-white p-1 shadow-xl">
    {filtered.map(f => (
      <li key={f} role="option" aria-selected={selected.includes(f)}>
        <button onClick={() => toggle(f)}>{f}</button>
      </li>
    ))}
  </ul>
)}`}
      >
        <MultiSelectDemo />
      </Showcase>

      <Showcase
        id="date-range"
        title="日期范围选择"
        en="Date Range Picker"
        level="高级"
        description="选择起止日期：先点开始日，再点结束日；第二次点击会重新开始。悬停时预览区间，范围中间用浅底、两端用实心标记。"
        usage={["筛选报表区间、预订入住 / 离店日期、行程规划。"]}
        points={["三段式状态机：无选择 → 选开始 → 选结束；start 与 end 都有时再点 = 重新开始。", "落在 start 之前的日期当成新 start，避免反向区间。", "区间预览：end 未定时用 hover 日期与 start 构造预览区间。", "月份切换用 new Date(y, m ± 1, 1) 自动处理跨年；周头固定「日一…六」。", "区间中间浅色、两端实心，需要 hover/键盘也能区分 start 与 end（可用圆角半连接）。"]}
        a11y={["每个日期按钮保留文本（几号），aria-label 用完整日期（2026-03-12）。", "状态行以文字说明当前处于哪一步（示例下方有 tabular-nums 状态条）。"]}
        code={`const pick = (d) => {
  if (!start || (start && end)) { setStart(d); setEnd(null); }   // 第一步 / 重新开始
  else if (d < start) setStart(d);                               // 反向：当作新开始
  else setEnd(d);
};
const inRange = (d) => start && end && d > start && d < end;

<button onClick={() => pick(date)}
  className={cn("grid h-8 w-8 place-items-center rounded-md",
    isStart || isEnd ? "bg-zinc-900 text-white" : "hover:bg-zinc-100")}>{d}</button>`}
      >
        <DateRangeDemo />
      </Showcase>

      <Showcase
        id="form-validation"
        title="表单校验"
        en="Form Validation"
        level="进阶"
        description="前端校验的三件套：实时反馈（失焦后校验）、错误内联展示（红色 + aria）、提交时全量校验。错误信息紧贴对应字段，而不是集中堆在顶部。"
        usage={["任何有输入规则的表单：登录、注册、设置、下单。", "服务端校验仍要有——前端只负责「体验」。"]}
        points={["一个纯函数 validate() 输出错误对象，input 变化、失焦、提交三处复用，保证逻辑单一来源。", "touched 状态区分「还没碰过的字段」：失焦后才显示错误，避免一进页面就满屏红。", "错误行用 id 关联 aria-describedby，input 加 aria-invalid，读屏软件能播报。", "aria-live 区域播报提交结果；成功时给出明确反馈。", "noValidate 关掉浏览器默认气泡，风格统一由自己控制。"]}
        code={`const validate = (v) => {
  const e = {};
  if (!v.email.trim()) e.email = "请输入邮箱";
  else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.email)) e.email = "邮箱格式不正确";
  if (v.pw.length < 6) e.pw = "密码至少 6 位";
  return e;
};
const blur = (k) => { setTouched(t => ({ ...t, [k]: true })); setErrors(validate()); };
const submit = (ev) => { ev.preventDefault(); setTouched(all); setErrors(validate()); };

<input aria-invalid={!!err} aria-describedby={err ? \`err-\${k}\` : undefined}
  onBlur={() => blur(k)} onChange={e => set(k, e.target.value)} />
{err && <p id={\`err-\${k}\`} className="text-xs text-red-600">{err}</p>}`}
      >
        <FormValidationDemo />
      </Showcase>

    </section>
  );
}

/* ---------------- Multi Select ---------------- */
const FRAMEWORKS = ["React", "Vue", "Svelte", "Angular", "Solid", "Preact", "Qwik", "Astro", "Alpine"];
function MultiSelectDemo() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>(["React", "Vue"]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filtered = FRAMEWORKS.filter((f) => f.toLowerCase().includes(q.trim().toLowerCase()));
  const toggle = (f: string) => setSelected((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));

  return (
    <div className="w-full max-w-md">
      <div ref={ref} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-lg border border-zinc-300 bg-white p-1.5 text-left text-sm transition-shadow focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-white/10"
        >
          {selected.length === 0 && <span className="px-1.5 text-zinc-400">选择框架…</span>}
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-md bg-zinc-100 py-1 pl-2 pr-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
              {s}
              <button
                type="button"
                aria-label={`移除 ${s}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(s);
                }}
                className="grid h-4 w-4 place-items-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-white"
              >
                <Icon.X size={10} />
              </button>
            </span>
          ))}
          <span className="ml-auto pr-1 text-zinc-400">
            <Icon.ChevronDown size={13} className={cn("transition-transform duration-200", open && "rotate-180")} />
          </span>
        </button>

        {open && (
          <div className="absolute inset-x-0 top-full z-20 mt-1.5 animate-scale-in overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="border-b border-zinc-100 p-2 dark:border-zinc-800">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="过滤…"
                className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-sm outline-none transition focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-white"
              />
            </div>
            <ul role="listbox" aria-multiselectable="true" className="max-h-56 overflow-y-auto p-1">
              {filtered.map((f) => {
                const on = selected.includes(f);
                return (
                  <li key={f} role="option" aria-selected={on}>
                    <button
                      type="button"
                      onClick={() => toggle(f)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                        on ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white" : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60",
                      )}
                    >
                      <span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded border", on ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900" : "border-zinc-300 dark:border-zinc-600")}>
                        {on && <Icon.Check size={10} />}
                      </span>
                      {f}
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && <li className="px-2.5 py-4 text-center text-xs text-zinc-400">无匹配项</li>}
            </ul>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-zinc-400">
        已选 {selected.length} 项：{selected.join("、") || "（空）"}
      </p>
    </div>
  );
}

/* ---------------- Date Range ---------------- */
const fmtD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const WEEK = ["日", "一", "二", "三", "四", "五", "六"];
function DateRangeDemo() {
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);

  const days = new Date(view.y, view.m + 1, 0).getDate();
  const first = new Date(view.y, view.m, 1).getDay();
  const cells = [...Array.from({ length: first }, () => null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const shift = (dm: number) =>
    setView((v) => {
      const d = new Date(v.y, v.m + dm, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const pick = (d: Date) => {
    if (!start || (start && end)) {
      setStart(d);
      setEnd(null);
    } else if (d < start) setStart(d);
    else setEnd(d);
  };
  const inRange = (d: Date) => !!start && !!end && d > start && d < end;
  const preview = hover && start && !end ? (hover < start ? { lo: hover, hi: start } : { lo: start, hi: hover }) : null;
  const status = start ? (end ? `${fmtD(start)} → ${fmtD(end)}` : `开始 ${fmtD(start)} · 再选结束日期`) : "请选择开始日期";

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      <div className="flex w-full items-center justify-between">
        <button type="button" aria-label="上个月" onClick={() => shift(-1)} className="grid h-8 w-8 place-items-center rounded-md border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
          <Icon.ChevronLeft size={14} />
        </button>
        <span className="text-sm font-medium tabular-nums">
          {view.y} 年 {view.m + 1} 月
        </span>
        <button type="button" aria-label="下个月" onClick={() => shift(1)} className="grid h-8 w-8 place-items-center rounded-md border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
          <Icon.ChevronRight size={14} />
        </button>
      </div>
      <div className="grid w-full grid-cols-7 gap-y-0.5 text-center text-xs">
        {WEEK.map((w) => (
          <div key={w} className="py-1 text-zinc-400">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const date = new Date(view.y, view.m, d);
          const isStart = sameDay(date, start);
          const isEnd = sameDay(date, end);
          const mid = inRange(date);
          const prev = preview && date >= preview.lo && date <= preview.hi && !isStart && !isEnd;
          return (
            <div key={i} className={cn("py-0.5", (mid || prev) && "bg-zinc-100 dark:bg-zinc-800/70")}>
              <button
                type="button"
                aria-label={`${view.y} 年 ${view.m + 1} 月 ${d} 日`}
                onClick={() => pick(date)}
                onMouseEnter={() => setHover(date)}
                className={cn(
                  "mx-auto grid h-8 w-8 place-items-center rounded-md text-sm transition-colors",
                  isStart || isEnd ? "bg-zinc-900 font-medium text-white dark:bg-white dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                )}
              >
                {d}
              </button>
            </div>
          );
        })}
      </div>
      <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-center font-mono text-xs tabular-nums text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        {status}
      </div>
    </div>
  );
}

/* ---------------- Form Validation ---------------- */
type Field = "name" | "email" | "pw" | "pw2";
type Errors = Partial<Record<Field, string>>;
const FIELDS: { key: Field; label: string; type: string; placeholder: string }[] = [
  { key: "name", label: "用户名", type: "text", placeholder: "至少 2 个字符" },
  { key: "email", label: "邮箱", type: "email", placeholder: "name@example.com" },
  { key: "pw", label: "密码", type: "password", placeholder: "至少 6 位" },
  { key: "pw2", label: "确认密码", type: "password", placeholder: "再次输入密码" },
];
function FormValidationDemo() {
  const [v, setV] = useState<Record<Field, string>>({ name: "", email: "", pw: "", pw2: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [done, setDone] = useState(false);

  const validate = (vals: Record<Field, string> = v): Errors => {
    const e: Errors = {};
    if (!vals.name.trim()) e.name = "请输入用户名";
    else if (vals.name.trim().length < 2) e.name = "用户名至少 2 个字符";
    if (!vals.email.trim()) e.email = "请输入邮箱";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email.trim())) e.email = "邮箱格式不正确";
    if (!vals.pw) e.pw = "请输入密码";
    else if (vals.pw.length < 6) e.pw = "密码至少 6 位";
    if (vals.pw2 !== vals.pw) e.pw2 = "两次输入的密码不一致";
    return e;
  };

  const set = (k: Field, val: string) => {
    const next = { ...v, [k]: val };
    setV(next);
    setDone(false);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: Field) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate());
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, pw: true, pw2: true });
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) setDone(true);
  };

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-sm space-y-4">
      {done && (
        <div role="status" className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
          <Icon.Check size={15} className="shrink-0 text-zinc-900 dark:text-white" /> 校验通过，表单已提交（示例）
        </div>
      )}
      {FIELDS.map((f) => {
        const err = touched[f.key] ? errors[f.key] : undefined;
        return (
          <div key={f.key}>
            <Label htmlFor={`fv-${f.key}`}>{f.label}</Label>
            <input
              id={`fv-${f.key}`}
              type={f.type}
              value={v[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              onBlur={() => blur(f.key)}
              aria-invalid={!!err}
              aria-describedby={err ? `fv-${f.key}-err` : undefined}
              placeholder={f.placeholder}
              className={cn(inputCls, err && "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500 dark:focus:border-red-500")}
            />
            {err ? (
              <p id={`fv-${f.key}-err`} className="mt-1 text-xs text-red-600 dark:text-red-400">
                {err}
              </p>
            ) : (
              <p className="mt-1 h-4 text-xs text-zinc-400">{f.placeholder}</p>
            )}
          </div>
        );
      })}
      <Button type="submit" className="w-full">
        提交
      </Button>
    </form>
  );
}
