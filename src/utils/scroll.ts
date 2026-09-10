/**
 * 固定时长的快速滚动：超长页面用原生 smooth 会越来越慢，且懒挂载会改变页面高度导致停不准。
 * 每帧重读目标位置（自动跟随懒挂载造成的高度变化），easeInOutCubic 起停都柔和。
 *
 * 结束阶段不再用 scrollIntoView 校正：它会把元素的 scroll-margin 与容器的 scroll-padding
 * 叠加（本站 article 是 scroll-mt-24=96px，html 是 scroll-padding-top=80px），
 * 结果落点整体上移 96px，看起来就像停在了"上一个内容"上。
 * 改为按与动画一致的 headerOffset 精确滚动，并做几轮延迟校正：
 * content-visibility 的离屏元素用估算高度（contain-intrinsic-size），滚动过程中
 * 页面总高度随渲染持续变化，一次校正可能不够；若用户已接管滚动则自动放弃。
 */
export function smoothScrollTo(el: HTMLElement, duration = 520) {
  const headerOffset = 80;
  const start = window.scrollY;
  const startTime = performance.now();
  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  // 目标绝对位置：当前视口 top + 已滚距离 - 头部偏移，每帧重读以跟随懒挂载的布局变化
  const targetTop = () => el.getBoundingClientRect().top + window.scrollY - headerOffset;

  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = easeInOutCubic(t);
    window.scrollTo({ top: start + (targetTop() - start) * eased, behavior: "instant" });
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      settle(el, headerOffset);
    }
  };
  requestAnimationFrame(step);
}

/**
 * 落地后的延迟校正：最多 5 轮、每轮间隔 160ms。每轮先强制一次同步布局
 * （读取 offsetHeight 触发 reflow，让 content-visibility 元素按当前视口重算），
 * 再平滑吸附到精确落点；一旦发现用户已自己滚动就停止。
 */
function settle(el: HTMLElement, headerOffset: number) {
  let checks = 0;
  let lastUserY = window.scrollY;
  const check = () => {
    if (checks >= 5) return;
    checks++;
    void document.body.offsetHeight; // 强制同步布局，刷新 content-visibility 估算高度
    const target = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    const cur = window.scrollY;
    const drifting = Math.abs(cur - lastUserY) < 2; // 用户没有在滚动（动画/吸附均不算）
    lastUserY = window.scrollY;
    if (Math.abs(target - cur) > 4 && (drifting || checks === 1)) {
      window.scrollTo({ top: target, behavior: "smooth" });
      window.setTimeout(check, 160);
    }
  };
  window.setTimeout(check, 60);
}
