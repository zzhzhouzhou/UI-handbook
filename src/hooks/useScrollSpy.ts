import { useEffect, useRef, useState } from "react";

/**
 * 阅读位置滚动侦测（scroll spy）。
 *
 * 观察一组**按文档顺序排列**的目标 id，返回"当前应高亮"的目标 id：
 * 取最后一个"顶边越过阅读线（距视口顶部 line px）"的元素；若一个都没越过
 * （停留在页面顶部区域），返回第一个目标。
 *
 * 相比 IntersectionObserver 窄带方案：直接按阅读线判定"读到哪了"，
 * 不会因快速滚动时多个元素同时进出窄带而抖动，切换时机也更符合直觉
 * （下一个章节标题一顶到阅读线就切换）。
 *
 * 触发时机：scroll / resize（rAF 合并为每帧一次）+ IntersectionObserver 作为
 * "布局唤醒"信号（懒挂载 / 字体加载会改变页面高度但不触发 scroll）+ 挂载后的
 * 延迟重算（等章节懒加载落地、高度稳定后校正一次）。
 */
export function useScrollSpy(ids: string[], line = 150): string {
  const [active, setActive] = useState(ids[0] ?? "");
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (ids.length === 0) return;
    let raf = 0;

    const compute = () => {
      raf = 0;
      // 文档顺序中最后一个顶边越过阅读线的目标；ids 与文档顺序一致，越过后即可中断
      let lastAbove = -1;
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) lastAbove = i;
        else break;
      }
      const next = ids[lastAbove >= 0 ? lastAbove : 0];
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // 懒挂载 / 图片字体加载会改变页面高度但不触发 scroll：IO 只做"唤醒"重算
    const io = new IntersectionObserver(schedule, { rootMargin: "0px 0px -66% 0px" });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    schedule();
    // 章节是懒加载的：首帧时元素可能还没挂载，挂载落地后再补两次校正
    const t1 = window.setTimeout(schedule, 300);
    const t2 = window.setTimeout(schedule, 1200);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      io.disconnect();
    };
  }, [ids, line]);

  return active;
}
