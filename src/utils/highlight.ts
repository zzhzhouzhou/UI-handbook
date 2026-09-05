/**
 * 轻量代码高亮：单遍正则分词，输出带类别标记的文本片段，由调用方映射为样式类。
 * 配色保持全站统一的 zinc 灰阶：注释最暗（斜体）、字符串收进、关键词与标签加亮。
 */

export type HlClass = "kw" | "str" | "cmt" | "tag" | "num" | "attr";
export type HlToken = { t: string; c?: HlClass };

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue",
  "import", "export", "from", "default", "new", "class", "extends", "type", "interface", "enum", "implements",
  "as", "await", "async", "of", "in", "typeof", "instanceof", "delete", "void", "this", "super", "yield",
  "null", "undefined", "true", "false", "try", "catch", "finally", "throw", "static", "get", "set", "public", "private", "readonly",
]);

// 顺序即优先级：注释 → 字符串 → 标签/at规则 → 数字 → 标识符
const RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)|(`(?:[^`\\]|\\.)*`|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(<\/?[A-Za-z][\w.]*|\/>|@[\w-]+)|(\d+(?:\.\d+)?)|([A-Za-z_$][\w$-]*)/g;

export function highlight(code: string): HlToken[] {
  const out: HlToken[] = [];
  let last = 0;
  for (const m of code.matchAll(RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: code.slice(last, i) });
    const [full, cmt, str, tag, num, ident] = m;
    if (cmt) out.push({ t: full, c: "cmt" });
    else if (str) out.push({ t: full, c: "str" });
    else if (tag) out.push({ t: full, c: "tag" });
    else if (num) out.push({ t: full, c: "num" });
    else if (ident) {
      if (KEYWORDS.has(ident)) {
        out.push({ t: full, c: "kw" });
      } else {
        // 标识符后紧跟冒号 → CSS 属性 / 对象键；大写开头 → 组件名
        let j = i + full.length;
        while (j < code.length && code[j] === " ") j++;
        const c = code[j] === ":" ? "attr" : /^[A-Z]/.test(ident) ? ("tag" as const) : undefined;
        out.push({ t: full, c });
      }
    }
    last = i + full.length;
  }
  if (last < code.length) out.push({ t: code.slice(last) });
  return out;
}
