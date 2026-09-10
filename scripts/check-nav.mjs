/**
 * 目录一致性校验：nav.ts（站点目录数据源）与各章节文件的 SectionHeader / Showcase id 必须一一对应。
 * 用法：npm run check:nav（build 前会自动执行）
 * - nav 里每个 id（10 个章节 + 115 个组件）都必须在某个章节文件渲染
 * - 章节文件里每个组件 id 都必须在 nav 中登记（漏登记 = 侧边栏点不到 / 搜索找不到）
 * 新增组件只需：nav.ts 加条目 + 章节文件加 <Showcase id="...">，剩余由本脚本兜底；
 * 不会误报 demo 内部 HTML 元素的 id（如 id="dlg-title"）。
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const navSrc = readFileSync(join(root, "src", "nav.ts"), "utf8");
const navIds = new Set([...navSrc.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]));

const shown = new Set();
const headers = new Set();
for (const f of readdirSync(join(root, "src", "sections"))) {
  if (!f.endsWith(".tsx")) continue;
  const s = readFileSync(join(root, "src", "sections", f), "utf8");
  for (const m of s.matchAll(/<SectionHeader\b[^>]*\bid="([^"]+)"/g)) headers.add(m[1]);
  for (const m of s.matchAll(/<Showcase\b[^>]*\bid="([^"]+)"/g)) shown.add(m[1]);
}

const errors = [];
for (const id of navIds) {
  if (!shown.has(id) && !headers.has(id)) errors.push(`nav.ts 中登记了「${id}」但没有任何章节文件渲染它（检查 src/sections/*.tsx 的 <Showcase id="${id}">）`);
}
for (const id of shown) {
  if (!navIds.has(id)) errors.push(`章节文件渲染了「${id}」但 nav.ts 没有登记（侧边栏 / ⌘K 搜索将找不到它）`);
}

const n = navIds.size - headers.size; // 组件数 = nav 总数 − 章节数
console.log(`✔ 目录校验：${headers.size} 个章节 / ${n} 个组件 ↔ 章节文件 ${shown.size} 个 Showcase、${headers.size} 个 SectionHeader`);
if (errors.length) {
  console.error(`✘ ${errors.length} 处不一致：`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log("✔ nav.ts 与章节文件完全一致");