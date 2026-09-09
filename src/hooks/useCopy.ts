import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "../utils/copy";

export type CopyState = "idle" | "ok" | "fail";

/**
 * 复制文本并短暂显示反馈状态，自动在 1.4s 后复位。
 * 供 Showcase 的「复制代码」与 DataDisplay 的代码块复用。
 */
export function useCopy() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async (text: string) => {
    if (!text) return;
    const ok = await copyText(text);
    setState(ok ? "ok" : "fail");
    if (ok) {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState("idle"), 1400);
    }
  }, []);

  return { state, copy };
}
