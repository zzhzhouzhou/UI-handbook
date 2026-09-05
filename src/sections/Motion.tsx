import { useEffect, useRef, useState, type MouseEvent as RMouseEvent } from "react";
import { Showcase, SectionHeader } from "../components/Showcase";
import { Button, Icon } from "../components/primitives";
import { cn } from "../utils/cn";

/* 1. 鼠标跟随聚光灯背景 */
function SpotlightBgDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: RMouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
    ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className="group relative h-64 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" style={{ ["--x" as string]: "50%", ["--y" as string]: "50%" }}>
      {/* 底层淡网格 */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      {/* 跟随鼠标的高亮网格：用 mask 只显示鼠标附近 */}
      <div
        className="absolute inset-0 text-zinc-900/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-white/50"
        style={{
          backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: "radial-gradient(180px circle at var(--x) var(--y), black, transparent)",
          maskImage: "radial-gradient(180px circle at var(--x) var(--y), black, transparent)",
        }}
      />
      {/* 柔光 */}
      <div className="pointer-events-none absolute inset-0 text-zinc-900/[0.06] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-white/10" style={{ background: "radial-gradient(240px circle at var(--x) var(--y), currentColor, transparent 70%)" }} />
      <div className="relative flex h-full flex-col items-center justify-center gap-2 text-center">
        <span className="text-2xl font-semibold tracking-tight">移动鼠标</span>
        <span className="text-sm text-zinc-500">网格与柔光会跟随光标位置</span>
      </div>
    </div>
  );
}

/* 2. 鼠标视差 */
function ParallaxDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const layers = useRef<HTMLDivElement[]>([]);
  const onMove = (e: RMouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    layers.current.forEach((el, i) => {
      const depth = (i + 1) * 12;
      el.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
  };
  const reset = () => layers.current.forEach((el) => (el.style.transform = "translate(0,0)"));
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="relative h-64 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) layers.current[i] = el;
          }}
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out"
        >
          {i === 0 && <div className="h-40 w-40 rounded-full border border-zinc-300 dark:border-zinc-700" />}
          {i === 1 && <div className="h-24 w-24 rounded-2xl border border-zinc-400 bg-white shadow-sm dark:border-zinc-600 dark:bg-zinc-800" />}
          {i === 2 && <div className="text-3xl font-semibold tracking-tight">视差</div>}
        </div>
      ))}
      <span className="absolute bottom-3 left-0 right-0 text-center text-xs text-zinc-400">三层以不同深度跟随鼠标</span>
    </div>
  );
}

/* 3. 音乐律动条（Web Audio API + AnalyserNode） */
function VisualizerDemo() {
  const BARS = 40;
  const [playing, setPlaying] = useState(false);
  const bars = useRef<HTMLDivElement[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const raf = useRef<number>(0);
  const timer = useRef<number>(0);

  const stop = () => {
    cancelAnimationFrame(raf.current);
    clearInterval(timer.current);
    ctxRef.current?.close();
    ctxRef.current = null;
    bars.current.forEach((b) => (b.style.height = "4px"));
    setPlaying(false);
  };

  const start = async () => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(analyser);
    analyser.connect(ctx.destination);

    // 简单合成的节拍：底鼓 + 贝斯 + 高帽
    const noise = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const bassNotes = [55, 55, 65.4, 49];
    let step = 0;
    const bpm = 112, beat = 60 / bpm;
    const schedule = () => {
      const t = ctx.currentTime + 0.05;
      const s16 = step % 16;
      // kick
      if (s16 % 4 === 0) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
        g.gain.setValueAtTime(1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 0.3);
      }
      // hihat
      if (s16 % 2 === 1) {
        const src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        src.buffer = noise;
        f.type = "highpass";
        f.frequency.value = 6000;
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        src.connect(f).connect(g).connect(master);
        src.start(t);
      }
      // bass
      if (s16 % 4 === 2 || s16 % 8 === 0) {
        const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type = "sawtooth";
        o.frequency.value = bassNotes[Math.floor(step / 16) % 4];
        f.type = "lowpass";
        f.frequency.setValueAtTime(800, t);
        f.frequency.exponentialRampToValueAtTime(120, t + 0.25);
        g.gain.setValueAtTime(0.35, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.connect(f).connect(g).connect(master);
        o.start(t);
        o.stop(t + 0.3);
      }
      // lead pluck
      if (s16 === 6 || s16 === 14 || s16 === 11) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = [440, 523.25, 659.25][step % 3];
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 0.2);
      }
      step++;
    };
    schedule();
    timer.current = window.setInterval(schedule, (beat / 4) * 1000);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const draw = () => {
      analyser.getByteFrequencyData(data);
      for (let i = 0; i < BARS; i++) {
        // 对数取样，让低频不至于占满
        const idx = Math.floor(Math.pow(i / BARS, 1.6) * data.length * 0.6);
        const v = data[idx] / 255;
        bars.current[i].style.height = `${Math.max(4, v * 96)}px`;
      }
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    setPlaying(true);
  };

  useEffect(() => () => stop(), []);

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6">
      <div className="flex h-28 items-end justify-center gap-[3px]">
        {Array.from({ length: BARS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) bars.current[i] = el;
            }}
            className={cn("w-1.5 rounded-full bg-zinc-900 transition-[height] duration-75 dark:bg-white", !playing && "animate-pulse")}
            style={{ height: 4, animationDelay: `${i * 30}ms` }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={playing ? stop : start} size="sm">
          {playing ? <Icon.Pause size={14} /> : <Icon.Play size={14} />} {playing ? "停止" : "播放合成节拍"}
        </Button>
        <span className="text-xs text-zinc-400">使用 Web Audio API 实时合成并分析频谱</span>
      </div>
    </div>
  );
}

/* 4. 磁性按钮 */
function MagneticDemo() {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: RMouseEvent) => {
    const el = ref.current!, r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    (el.firstChild as HTMLElement).style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };
  const reset = () => {
    ref.current!.style.transform = "";
    (ref.current!.firstChild as HTMLElement).style.transform = "";
  };
  return (
    <div className="flex h-40 w-40 items-center justify-center" onMouseMove={onMove} onMouseLeave={reset}>
      <button ref={ref} className="h-14 rounded-full bg-zinc-900 px-8 text-sm font-medium text-white transition-transform duration-200 ease-out will-change-transform dark:bg-white dark:text-zinc-900">
        <span className="inline-block transition-transform duration-200 ease-out">磁性按钮</span>
      </button>
    </div>
  );
}

/* 5. 3D 倾斜卡片 */
function TiltDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: RMouseEvent) => {
    const el = ref.current!, r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(800px) rotateX(${(0.5 - py) * 16}deg) rotateY(${(px - 0.5) * 16}deg) scale3d(1.02,1.02,1.02)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const reset = () => (ref.current!.style.transform = "perspective(800px) rotateX(0) rotateY(0)");
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="group relative h-56 w-full max-w-80 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-transform duration-150 ease-out [transform-style:preserve-3d] dark:border-zinc-700 dark:bg-zinc-900">
      {/* pointer-events-none 的元素收不到 hover，必须用父级 group + group-hover 触发 */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(300px circle at var(--gx,50%) var(--gy,50%), rgb(255 255 255 / 0.5), transparent 60%)" }} />
      <div className="flex h-full flex-col justify-between [transform:translateZ(40px)]">
        <div className="flex items-center justify-between">
          <span className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-white" />
          <span className="font-mono text-xs text-zinc-400">•••• 4242</span>
        </div>
        <div>
          <div className="text-lg font-semibold tracking-tight">3D 倾斜卡片</div>
          <div className="text-sm text-zinc-500">内容层 translateZ 产生浮起感</div>
        </div>
      </div>
    </div>
  );
}

/* 6. 边框聚光灯卡片 */
function SpotlightCardDemo() {
  const onMove = (e: RMouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-4">
      {["自动补全", "实时协作"].map((t) => (
        <div key={t} onMouseMove={onMove} className="group relative rounded-xl bg-zinc-200 p-px dark:bg-zinc-800">
          {/* 边框高亮层 */}
          <div className="absolute inset-0 rounded-xl text-zinc-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-white" style={{ background: "radial-gradient(200px circle at var(--x,50%) var(--y,50%), currentColor, transparent 70%)" }} />
          <div className="relative h-36 rounded-[11px] bg-white p-5 dark:bg-zinc-950">
            <div className="absolute inset-0 rounded-[11px] text-zinc-900/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-white/[0.06]" style={{ background: "radial-gradient(200px circle at var(--x,50%) var(--y,50%), currentColor, transparent 70%)" }} />
            <div className="relative">
              <Icon.Star className="text-zinc-400" />
              <div className="mt-6 font-medium">{t}</div>
              <div className="text-sm text-zinc-500">悬停时边框随光标发亮</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 7. 自定义光标 */
function CursorDemo() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const hoverRef = useRef(false);
  const pos = useRef({ x: 0, y: 0 }), ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const running = useRef(false);
  const start = () => {
    if (running.current) return;
    running.current = true;
    const loop = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      if (ring.current) ring.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%,-50%) scale(${hoverRef.current ? 2.2 : 1})`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };
  const stop = () => {
    running.current = false;
    cancelAnimationFrame(raf.current);
  };
  useEffect(() => {
    // 离开视口暂停 RAF，回来再恢复；hover 状态走 ref，避免循环随 state 重建
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    if (root.current) io.observe(root.current);
    return () => {
      stop();
      io.disconnect();
    };
  }, []);
  const updateHover = (v: boolean) => {
    hoverRef.current = v;
    setHover(v);
  };
  const onMove = (e: RMouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    pos.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (dot.current) dot.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`;
  };
  return (
    <div ref={root} onMouseMove={onMove} className="relative flex h-56 w-full max-w-lg cursor-none items-center justify-center gap-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div ref={ring} className={cn("pointer-events-none absolute left-0 top-0 h-8 w-8 rounded-full border border-zinc-900 transition-[background-color,border-color] duration-200 [@media(hover:none)]:hidden dark:border-white", hover && "border-transparent bg-zinc-900/10 dark:bg-white/20")} />
      <div ref={dot} className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-zinc-900 [@media(hover:none)]:hidden dark:bg-white" />
      {["链接一", "链接二"].map((t) => (
        <span key={t} onMouseEnter={() => updateHover(true)} onMouseLeave={() => updateHover(false)} className="text-lg font-medium underline-offset-4 hover:underline">
          {t}
        </span>
      ))}
      <span className="absolute bottom-3 text-xs text-zinc-400">环形光标带延迟跟随，悬停可交互元素时放大</span>
    </div>
  );
}

/* 8. 粒子连线背景 */
function ParticlesDemo() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    let w = (c.width = c.offsetWidth * devicePixelRatio), h = (c.height = c.offsetHeight * devicePixelRatio);
    const N = 60;
    const pts = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 }));
    const mouse = { x: -1e3, y: -1e3 };
    const onMove = (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * devicePixelRatio;
      mouse.y = (e.clientY - r.top) * devicePixelRatio;
    };
    const onLeave = () => (mouse.x = mouse.y = -1e3);
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
    let raf = 0;
    const dark = () => document.documentElement.classList.contains("dark");
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const col = dark() ? "255,255,255" : "24,24,27";
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 120 * devicePixelRatio) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }
        ctx.fillStyle = `rgba(${col},0.6)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 110 * devicePixelRatio) {
            ctx.strokeStyle = `rgba(${col},${(1 - d / (110 * devicePixelRatio)) * 0.25})`;
            ctx.lineWidth = devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const ro = new ResizeObserver(() => {
      w = c.width = c.offsetWidth * devicePixelRatio;
      h = c.height = c.offsetHeight * devicePixelRatio;
    });
    ro.observe(c);
    // 离开视口时暂停 O(N²) 的绘制循环，回到视口再恢复
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(draw);
    });
    io.observe(c);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <canvas ref={ref} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 text-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80">鼠标会推开粒子</span>
      </div>
    </div>
  );
}

/* 9. 涟漪按钮 */
function RippleDemo() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; s: number }[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const onClick = (e: RMouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const s = Math.max(r.width, r.height);
    const id = ++nextId.current;
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left - s / 2, y: e.clientY - r.top - s / 2, s }]);
    timers.current.push(window.setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 600));
  };
  return (
    <button onClick={onClick} className="relative h-12 overflow-hidden rounded-lg bg-zinc-900 px-8 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
      点击产生涟漪
      {ripples.map((r) => (
        <span key={r.id} className="pointer-events-none absolute animate-ripple rounded-full bg-white/40 dark:bg-zinc-900/30" style={{ left: r.x, top: r.y, width: r.s, height: r.s }} />
      ))}
    </button>
  );
}

/* 10. 旋钮 */
function KnobDemo() {
  const [v, setV] = useState(0.6);
  const knobRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; v: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    drag.current = { y: e.clientY, v };
    // 捕获后 move/up 都派发到旋钮，拖出元素也不会丢
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setV(Math.max(0, Math.min(1, drag.current.v + (drag.current.y - e.clientY) / 150)));
  };
  const onUp = () => (drag.current = null);
  useEffect(() => {
    const el = knobRef.current;
    if (!el) return;
    // React 的 onWheel 是 passive 监听，preventDefault 无效；需原生监听并关闭 passive
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setV((x) => Math.max(0, Math.min(1, x - e.deltaY / 1000)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  const angle = -135 + v * 270;
  const r = 34, c = 2 * Math.PI * r, arc = c * 0.75;
  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={knobRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} className="relative h-24 w-24 cursor-ns-resize touch-none select-none">
        <svg width="96" height="96" className="rotate-[135deg]">
          <circle cx="48" cy="48" r={r} strokeWidth="4" className="fill-none stroke-zinc-200 dark:stroke-zinc-800" strokeDasharray={`${arc} ${c}`} strokeLinecap="round" />
          <circle cx="48" cy="48" r={r} strokeWidth="4" className="fill-none stroke-zinc-900 dark:stroke-white" strokeDasharray={`${arc * v} ${c}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-4 rounded-full border border-zinc-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900" style={{ transform: `rotate(${angle}deg)` }}>
          <span className="absolute left-1/2 top-2 h-3 w-0.5 -translate-x-1/2 rounded-full bg-zinc-900 dark:bg-white" />
        </div>
      </div>
      <span className="font-mono text-sm tabular-nums">{Math.round(v * 100)}</span>
      <span className="text-xs text-zinc-400">上下拖动或滚轮</span>
    </div>
  );
}

/* 11. 毛玻璃 */
function GlassDemo() {
  return (
    <div className="relative h-56 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-zinc-900 dark:bg-white" />
      <div className="absolute right-10 bottom-6 h-16 w-40 rounded-2xl bg-zinc-400 dark:bg-zinc-600" />
      <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 rounded-2xl border border-white/60 bg-white/50 p-5 shadow-xl backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-zinc-900/50">
        <div className="text-sm font-medium">毛玻璃面板</div>
        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">backdrop-blur-xl + 半透明背景 + 半透明边框，能透出下方的形状与颜色。</div>
      </div>
    </div>
  );
}

/* 12. 边框光束 */
function BeamDemo() {
  return (
    <div className="relative w-full max-w-72 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="pointer-events-none absolute inset-0 rounded-xl [mask-image:linear-gradient(black,black)]">
        <span className="absolute h-2 w-2 rounded-full bg-zinc-900 shadow-[0_0_12px_2px_rgb(24_24_27/0.6)] dark:bg-white dark:shadow-[0_0_12px_2px_rgb(255_255_255/0.8)]" style={{ offsetPath: "rect(0 100% 100% 0 round 12px)", animation: "beam 4s linear infinite" } as React.CSSProperties} />
      </div>
      <div className="text-sm font-medium">边框光束</div>
      <div className="mt-1 text-xs text-zinc-500">一个光点沿着卡片边缘循环运动（CSS offset-path）。</div>
    </div>
  );
}

export default function Motion() {
  return (
    <section>
      <SectionHeader
        id="motion"
        index="07"
        title="指针交互与背景"
        en="Pointer Interactions & Backgrounds"
        intro="这一章是「让界面活起来」的部分：跟随鼠标的背景、音频律动条、磁性按钮、3D 倾斜、粒子场……它们的共同原则是：用 CSS 变量传递坐标、直接操作 DOM style 而不是 setState、只动 transform / opacity、用 requestAnimationFrame 节流。装饰性动效要克制，一个页面最多一两处。"
        icon={<Icon.Pointer />}
      />

      <Showcase id="spotlight-bg" title="背景随鼠标移动（聚光灯网格）" en="Mouse Spotlight Background" level="高级" description="鼠标所到之处，网格线变亮并伴随一圈柔光。核心技巧是用 CSS mask-image 的径向渐变裁剪一层高亮网格，中心位置由 CSS 变量 --x / --y 控制，JS 只负责更新这两个变量。" usage={["落地页 Hero 区、登录页背景、404 页。", "任何需要「科技感」但又不想用彩色渐变的场合。"]} points={["onMouseMove 中计算相对坐标，el.style.setProperty('--x', ...)。不经过 React state，60fps 无压力。", "两层网格：底层淡、上层深；上层用 mask-image: radial-gradient(180px circle at var(--x) var(--y), black, transparent) 只露出鼠标附近。", "可选加一层 radial-gradient 柔光（透明度 6% 即可）。", "group-hover 控制整体 opacity，鼠标离开淡出。"]} pitfalls={["用 useState 存坐标导致整棵组件树每帧重渲染。", "mask 忘记加 -webkit- 前缀（Safari）。"]} code={`const ref = useRef(null);
const onMove = (e) => {
  const r = ref.current.getBoundingClientRect();
  ref.current.style.setProperty("--x", \`\${e.clientX - r.left}px\`);
  ref.current.style.setProperty("--y", \`\${e.clientY - r.top}px\`);
};

<div ref={ref} onMouseMove={onMove} className="group relative overflow-hidden">
  <div className="absolute inset-0 bg-grid opacity-60" />
  <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
    style={{
      backgroundImage: "linear-gradient(to right, rgb(24 24 27 / .35) 1px, transparent 1px), linear-gradient(to bottom, rgb(24 24 27 / .35) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
      maskImage: "radial-gradient(180px circle at var(--x) var(--y), black, transparent)",
      WebkitMaskImage: "radial-gradient(180px circle at var(--x) var(--y), black, transparent)",
    }} />
  {children}
</div>`}>
        <SpotlightBgDemo />
      </Showcase>

      <Showcase id="parallax" title="鼠标视差" en="Mouse Parallax" level="进阶" description="多个图层按不同系数跟随鼠标偏移，产生景深。离用户越近的层移动越多。" usage={["Hero 插图、卡片内的装饰元素、3D 感的产品展示。"]} points={["归一化鼠标位置到 −0.5 ~ 0.5。", "每层 translate = (dx × depth, dy × depth)，depth 递增。", "transition-transform 200ms ease-out 抹平抖动。", "滚动视差用 scroll 事件或 CSS scroll-driven animations。"]} code={`const onMove = (e) => {
  const r = ref.current.getBoundingClientRect();
  const dx = (e.clientX - r.left) / r.width - 0.5;
  const dy = (e.clientY - r.top) / r.height - 0.5;
  layers.current.forEach((el, i) => {
    const depth = (i + 1) * 12;
    el.style.transform = \`translate(\${dx * depth}px, \${dy * depth}px)\`;
  });
};`}>
        <ParallaxDemo />
      </Showcase>

      <Showcase id="visualizer" title="音乐律动条（频谱可视化）" en="Audio Visualizer" level="高级" description="用 Web Audio API 的 AnalyserNode 获取实时频谱数据，映射成 40 根柱子的高度。示例中的音乐是用振荡器实时合成的节拍，无需任何音频文件。同样的方法可以接麦克风（getUserMedia）或 <audio> 元素。" usage={["音乐播放器、播客、语音输入状态、录音界面。", "静态装饰可以用 CSS 动画的随机高度柱子。"]} points={["AudioContext 必须在用户手势（click）后创建。", "createAnalyser()，fftSize=256 → frequencyBinCount=128 个频段；smoothingTimeConstant 0.8 让跳动更柔和。", "音源 → analyser → destination。每帧 getByteFrequencyData(Uint8Array)。", "低频能量大，用幂函数 (i/N)^1.6 取样让分布更均匀。", "直接改 DOM 的 style.height，配合 transition 75ms。", "接 <audio>：ctx.createMediaElementSource(audioEl)；接麦克风：ctx.createMediaStreamSource(stream)。"]} code={`const ctx = new AudioContext();
const analyser = ctx.createAnalyser();
analyser.fftSize = 256;
analyser.smoothingTimeConstant = 0.8;

// 音源：<audio> 元素 / 麦克风 / 振荡器
const source = ctx.createMediaElementSource(audioEl);
source.connect(analyser);
analyser.connect(ctx.destination);

const data = new Uint8Array(analyser.frequencyBinCount);
const draw = () => {
  analyser.getByteFrequencyData(data);
  bars.forEach((bar, i) => {
    const idx = Math.floor(Math.pow(i / bars.length, 1.6) * data.length * 0.6);
    bar.style.height = \`\${Math.max(4, (data[idx] / 255) * 96)}px\`;
  });
  requestAnimationFrame(draw);
};
draw();`}>
        <VisualizerDemo />
      </Showcase>

      <Showcase id="magnetic" title="磁性按钮" en="Magnetic Button" level="进阶" description="鼠标进入按钮周围区域时，按钮像被磁铁吸引一样朝鼠标偏移，文字再多偏移一点，离开后弹回。" usage={["落地页 CTA、作品集导航。", "只用于 1–2 个关键按钮。"]} points={["外层一个比按钮大的感应区（h-40 w-40）监听 mousemove。", "偏移 = (鼠标 − 按钮中心) × 0.35；内部文字 × 0.15 形成两层。", "transition-transform 200ms ease-out；离开时清空 transform 弹回。", "更弹的效果用 framer-motion useSpring。"]} code={`const onMove = (e) => {
  const el = ref.current, r = el.getBoundingClientRect();
  const x = e.clientX - r.left - r.width / 2;
  const y = e.clientY - r.top - r.height / 2;
  el.style.transform = \`translate(\${x * 0.35}px, \${y * 0.35}px)\`;
  el.firstChild.style.transform = \`translate(\${x * 0.15}px, \${y * 0.15}px)\`;
};
<div className="h-40 w-40" onMouseMove={onMove} onMouseLeave={reset}>
  <button ref={ref} className="transition-transform duration-200 ease-out"><span>按钮</span></button>
</div>`}>
        <MagneticDemo />
      </Showcase>

      <Showcase id="tilt" title="3D 倾斜卡片" en="3D Tilt Card" level="进阶" description="根据鼠标在卡片内的位置绕 X / Y 轴旋转，内容层 translateZ 浮起，再叠一层跟随鼠标的高光。" usage={["会员卡、产品卡、NFT / 收藏品展示。"]} points={["perspective(800px) rotateX((0.5−py)×16deg) rotateY((px−0.5)×16deg)。", "父级 transform-style: preserve-3d，子元素 translateZ(40px) 产生分层。", "高光：radial-gradient 白色 50% 透明度，中心跟随 --gx / --gy。", "角度不要超过 ±20°。"]} code={`const onMove = (e) => {
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  el.style.transform = \`perspective(800px) rotateX(\${(0.5 - py) * 16}deg) rotateY(\${(px - 0.5) * 16}deg)\`;
};
<div ref={el} onMouseMove={onMove} onMouseLeave={reset}
  className="transition-transform duration-150 [transform-style:preserve-3d]">
  <div className="[transform:translateZ(40px)]">内容</div>
</div>`}>
        <TiltDemo />
      </Showcase>

      <Showcase id="spotlight-card" title="边框聚光卡片" en="Spotlight Border Card" level="高级" description="悬停时卡片边框在鼠标附近亮起。实现原理：外层是 1px padding 的「边框层」，其上叠一个跟随鼠标的径向渐变，内层白色卡片盖住中间。" usage={["功能特性网格、定价卡片。", "深色主题下效果最佳。"]} points={["外层 p-px bg-zinc-200；边框高亮层 absolute inset-0 + radial-gradient at var(--x) var(--y)。", "内层 rounded 比外层小 1px（rounded-[11px] vs rounded-xl）。", "多张卡片共享一个 onMouseMove，用 e.currentTarget 设置各自的变量。", "可再加一层内部微光。"]} code={`<div onMouseMove={onMove} className="group relative rounded-xl bg-zinc-200 p-px">
  <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
    style={{ background: "radial-gradient(200px circle at var(--x) var(--y), rgb(24 24 27), transparent 70%)" }} />
  <div className="relative rounded-[11px] bg-white p-5">内容</div>
</div>`}>
        <SpotlightCardDemo />
      </Showcase>

      <Showcase id="cursor" title="自定义光标" en="Custom Cursor" level="高级" description="隐藏原生光标，用一个小圆点 + 一个带延迟跟随的圆环代替；悬停可交互元素时圆环放大并填充。" usage={["创意作品集、品牌站。", "工具型产品不要用。"]} points={["容器 cursor-none。", "小圆点直接跟随；圆环用 rAF 每帧向目标插值 15%（lerp）产生拖尾感。", "悬停状态用 state 切换 scale 和填充。", "移动端不显示（@media (hover: none)）。"]} code={`const loop = () => {
  ringPos.x += (pos.x - ringPos.x) * 0.15;   // lerp
  ringPos.y += (pos.y - ringPos.y) * 0.15;
  ring.style.transform = \`translate(\${ringPos.x}px, \${ringPos.y}px) translate(-50%,-50%) scale(\${hover ? 2.2 : 1})\`;
  requestAnimationFrame(loop);
};`}>
        <CursorDemo />
      </Showcase>

      <Showcase id="particles" title="粒子连线背景" en="Particle Network" level="高级" description="Canvas 上 60 个缓慢漂移的点，距离近的点之间画线，鼠标靠近时把点推开。" usage={["科技类落地页、数据产品背景。", "注意性能：粒子数 ≤ 100，移动端可关闭。"]} points={["canvas 尺寸乘以 devicePixelRatio 防模糊。", "每帧：更新位置（边界反弹）→ 画点 → 双重循环画线（透明度随距离衰减）。", "鼠标斥力：d < 阈值 时 p -= (mouse − p) × 0.01。", "ResizeObserver 监听尺寸变化；组件卸载时 cancelAnimationFrame。", "读取 html.dark 切换颜色。"]} code={`for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
  const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
  if (d < 110) {
    ctx.strokeStyle = \`rgba(24,24,27,\${(1 - d / 110) * 0.25})\`;
    ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
  }
}`}>
        <ParticlesDemo />
      </Showcase>

      <Showcase id="ripple" title="涟漪点击" en="Ripple Effect" description="Material 风格的点击涟漪：在点击位置生成一个圆，从 0 放大到 4 倍并淡出。" usage={["按钮、列表项、卡片的点击反馈，尤其是触屏。"]} points={["按钮 relative overflow-hidden。", "涟漪尺寸 = max(width, height)，位置 = 点击点 − size/2。", "@keyframes ripple { from { scale:0; opacity:.35 } to { scale:4; opacity:0 } } 600ms。", "动画结束后从数组移除。"]} code={`const onClick = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  const s = Math.max(r.width, r.height), id = Date.now();
  setRipples(rs => [...rs, { id, x: e.clientX - r.left - s / 2, y: e.clientY - r.top - s / 2, s }]);
  setTimeout(() => setRipples(rs => rs.filter(x => x.id !== id)), 600);
};
{ripples.map(r => <span key={r.id} className="absolute animate-ripple rounded-full bg-white/40"
  style={{ left: r.x, top: r.y, width: r.s, height: r.s }} />)}`}>
        <RippleDemo />
      </Showcase>

      <Showcase id="knob" title="旋钮" en="Dial Knob" level="进阶" description="音频软件风格的旋钮：上下拖动或滚轮改变数值，270° 弧形轨道显示进度，指针旋转指示。" usage={["音量、EQ、参数微调、智能家居温控。"]} points={["pointerdown 记录初始 y 和 value，pointermove 时 value = v0 + (y0 − y) / 150。", "setPointerCapture 后 move/up 都派发到旋钮本身，拖出元素不丢，无需 window 监听。", "旋钮区域加 touch-none，触屏拖动才不会被页面滚动打断。", "滚轮要用原生 addEventListener('wheel', fn, { passive: false }) 才能 preventDefault，否则调值时页面跟着滚。", "弧形轨道：SVG circle + strokeDasharray = 周长 × 0.75，整体 rotate(135deg)。", "指针角度 = −135° + v × 270°。"]} code={`const arc = 2 * Math.PI * r * 0.75;
// 触屏可用的拖动：pointerdown + setPointerCapture
<div className="touch-none cursor-ns-resize"
  onPointerDown={(e) => { drag.current = { y: e.clientY, v }; e.currentTarget.setPointerCapture(e.pointerId); }}
  onPointerMove={(e) => drag.current && setV(clamp(drag.current.v + (drag.current.y - e.clientY) / 150))}
  onPointerUp={() => (drag.current = null)}>
  <svg className="rotate-[135deg]">
    <circle r={r} strokeDasharray={\`\${arc} \${c}\`} className="stroke-zinc-200 fill-none" />
    <circle r={r} strokeDasharray={\`\${arc * v} \${c}\`} className="stroke-zinc-900 fill-none" />
  </svg>
  <div style={{ transform: \`rotate(\${-135 + v * 270}deg)\` }}>指针</div>
</div>`}>
        <KnobDemo />
      </Showcase>

      <Showcase id="glass" title="毛玻璃" en="Glassmorphism" description="半透明背景 + 背景模糊 + 半透明白色边框。在极简界面里适度使用于粘性头部、浮层、控制面板。" usage={["粘性导航栏、播放器控制条、地图上的信息卡。", "下方必须有内容（形状 / 图片）才有意义。"]} points={["bg-white/50 backdrop-blur-xl backdrop-saturate-150 border-white/60。", "深色：bg-zinc-900/50 border-white/10。", "backdrop-filter 开销大，避免大面积和滚动中频繁重绘。", "Safari 需要 -webkit-backdrop-filter（Tailwind 已处理）。"]} code={`<div className="rounded-2xl border border-white/60 bg-white/50 p-5 shadow-xl
  backdrop-blur-xl backdrop-saturate-150
  dark:border-white/10 dark:bg-zinc-900/50">
  毛玻璃面板
</div>`}>
        <GlassDemo />
      </Showcase>

      <Showcase id="beam" title="边框光束" en="Border Beam" level="高级" description="一个发光的点沿卡片边框循环运动。使用 CSS Motion Path（offset-path: rect(...)）实现，不需要 JS，也不需要渐变旋转。" usage={["强调「正在进行」「新功能」的卡片。", "AI 生成中的状态框。"]} points={["offset-path: rect(0 100% 100% 0 round 12px) 定义路径为容器的圆角矩形。", "@keyframes beam { from { offset-distance: 0% } to { offset-distance: 100% } }。", "光点用 box-shadow 发光。", "旧方案：conic-gradient 旋转 + mask 只留边框，但那是渐变。"]} code={`<span className="absolute h-2 w-2 rounded-full bg-zinc-900 shadow-[0_0_12px_2px_rgb(24_24_27/0.6)]"
  style={{ offsetPath: "rect(0 100% 100% 0 round 12px)", animation: "beam 4s linear infinite" }} />

@keyframes beam { from { offset-distance: 0% } to { offset-distance: 100% } }`}>
        <BeamDemo />
      </Showcase>
    </section>
  );
}
