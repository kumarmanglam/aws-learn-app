// ============================================================
// Prism syntax highlighting helper.
//
// Central place that loads the Prism core + the language grammars we use and
// maps our loose language strings (e.g. "js", "python3", "java") to a Prism
// grammar. Used by the editable code editor (react-simple-code-editor) so code
// examples — Java included — get a proper, standard color theme.
//
// NOTE: prism-java depends on prism-clike, so clike is imported first.
// ============================================================
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";

/** Map our language labels to a Prism grammar key. */
export function prismLang(language: string): string {
  const l = language.toLowerCase();
  if (l === "js" || l === "javascript" || l === "node" || l === "nodejs")
    return "javascript";
  if (l === "ts" || l === "typescript") return "typescript";
  if (l === "py" || l === "python" || l === "python3") return "python";
  if (l === "java") return "java";
  if (l === "sql" || l === "sqlite" || l === "mysql") return "sql";
  if (l === "json") return "json";
  if (l === "bash" || l === "sh" || l === "shell") return "bash";
  return "clike";
}

/** Highlight a code string to Prism-token HTML. Falls back to plain text
 *  (HTML-escaped by Prism) when a grammar is unavailable. */
export function highlightCode(code: string, language: string): string {
  const key = prismLang(language);
  const grammar = Prism.languages[key] ?? Prism.languages.clike;
  return Prism.highlight(code, grammar, key);
}
