/**
 * 固定时长的快速滚动：超长页面用原生 smooth 会越来越慢，且懒挂载会改变页面高度导致停不准。
 * 每帧重读目标位置（自动跟随懒挂载造成的高度变化），easeInOutCubic 起停都柔和，
 * 结束时用一次原生 smooth 微调落点，避免生硬吸附。
 */
export function smoothScrollTo(el: HTMLElement, duration = 520) {
  const start = window.scrollY;
  const startTime = performance.now();
  const headerOffset = 80;
  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = easeInOutCubic(t);
    const targetTop = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: start + (targetTop - start) * eased, behavior: "instant" });
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      // 落地后轻微校正：懒挂载的相邻内容可能仍在改变布局高度
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };
  requestAnimationFrame(step);
}
