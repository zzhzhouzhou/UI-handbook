import { forwardRef, type ButtonHTMLAttributes, type SVGProps } from "react";
import { cn } from "../utils/cn";

/* ------------------------------ Icons ------------------------------ */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };
const base = (p: IconProps) => ({
  width: p.size ?? 16,
  height: p.size ?? 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const Icon = {
  Check: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  X: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  ChevronDown: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  ChevronRight: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  ChevronLeft: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  Search: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Minus: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M5 12h14" />
    </svg>
  ),
  Layers: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="m12 2 10 5-10 5L2 7l10-5Z" />
      <path d="m2 12 10 5 10-5" />
      <path d="m2 17 10 5 10-5" />
    </svg>
  ),
  Grid: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Compass: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z" />
    </svg>
  ),
  BarChart: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-3" />
    </svg>
  ),
  Pointer: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="m4 4 7.07 17 2.51-7.39L21 11.07Z" />
    </svg>
  ),
  Type: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </svg>
  ),
  Layout: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  ClipboardCheck: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  ),
  GitHub: (p: IconProps) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.66.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  ),
  Globe: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  Eye: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="m2 2 20 20" />
      <path d="M6.7 6.7A10.9 10.9 0 0 0 2 12s3.5 7 10 7c2.1 0 4-.6 5.6-1.7M9.9 4.3A10.9 10.9 0 0 1 22 12s-1.2 2.5-3.3 4.3" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  ),
  Sun: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  Moon: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ),
  Info: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  Alert: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  Bell: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </svg>
  ),
  Mail: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  ),
  Trash: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  ),
  Copy: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Upload: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  ),
  Star: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
    </svg>
  ),
  Home: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="m3 11 9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z" />
    </svg>
  ),
  Settings: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),
  User: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Arrow: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Play: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M6 4l14 8-14 8V4Z" />
    </svg>
  ),
  Pause: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ),
  Grip: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" />
    </svg>
  ),
  Image: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  ),
  Folder: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.2 3.9A2 2 0 0 0 7.5 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  ),
  File: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  Heart: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
    </svg>
  ),
  ArrowUp: (p: IconProps) => (
    <svg {...base(p)} className={p.className}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  Loader: (p: IconProps) => (
    <svg {...base(p)} className={cn("animate-spin", p.className)}>
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </svg>
  ),
};

/* ------------------------------ Button ------------------------------ */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
  outline: "border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  link: "bg-transparent text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100 px-0",
};
const sizes: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5",
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-base gap-2",
  icon: "h-9 w-9 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center justify-center whitespace-nowrap rounded-lg font-medium transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950",
        "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading && <Icon.Loader size={14} />}
      {children}
    </button>
  );
});

/* ------------------------------ Input ------------------------------ */
export const inputCls =
  "h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-shadow focus:border-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50";

/* ------------------------------ Misc ------------------------------ */
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-0 items-center justify-center rounded border border-zinc-300 bg-zinc-50 px-1.5 font-mono text-[11px] font-medium text-zinc-600 shadow-[inset_0_-1px_0_rgb(0_0_0/0.15)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 [&>svg]:h-3 [&>svg]:w-3">
      {children}
    </kbd>
  );
}

export function Avatar({ name, size = 36, src }: { name: string; size?: number; src?: string }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 font-medium text-zinc-700 ring-2 ring-white dark:bg-zinc-700 dark:text-zinc-100 dark:ring-zinc-950"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </span>
  );
}

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
      {children}
    </label>
  );
}
