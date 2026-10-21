# codepad

A small inline code editor that Claude renders in chat. Syntax colors, auto-indent, line numbers, comments on selected code, and Send to Claude for review. Works in the web and mobile Claude apps wherever inline widgets render.

Languages: Python, JavaScript, SQL (SQLite), Java.

| Language | Where it runs |
| --- | --- |
| Python | In the cell, on your device (Skulpt) |
| JavaScript | In the cell, in a Web Worker with a time limit |
| SQL | In the cell, SQLite via sql.js in a Web Worker with a time limit (falls back to the main thread with no limit if workers or WebAssembly are blocked) |
| Java | Run asks Claude to compile and run it with javac in its workspace; the verdict comes back as a new cell |

Load it from a widget:

```html
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/gh/OmarOzalp/codepad@<commit-sha>/codepad.js"></script>
<script>
CodePad.mount(document.getElementById("app"), { sandbox: true, lang: "python" });
</script>
```

Always pin a commit SHA, never a branch. jsDelivr caches branches for hours.

## Modes

Editor only: `{ sandbox: true, lang: "python" }`. Shows a language picker, Run, Comment on selection, Reset, and Send to Claude. Optional `starter` or `code` to preload.

Practice problem: `title`, `description`, `starter`, `tests`, and optionally `difficulty`, `examples`, `hints`, `solution`, `limit` (ms). Adds Problem and Scratchpad tabs, Submit with a LeetCode-style verdict, and hints.

## Tests

Tests are `[name, body]`. A third element `true` hides the test until Submit.

- Python: `assert cond, 'message'` statements, unindented.
- JavaScript: `assert(cond, msg)` and `deepEqual(a, b)`.
- SQL: the body is either a JavaScript check using `rows`, `cols`, `assert`, `deepEqual`, or an object `{ cols, rows, ordered, setup }`. `setup` is extra SQL run before the query, so a test can use different data. Use `lang: "sql"`, a `setup` string for the starting schema and data, and `schema` for the text shown to the learner.
- Java: Java statements with `assertEquals`, `assertTrue`, `assertThrows` in scope. They run through `scripts/run_java.py` in the skill, not in the cell.

## Other config

- `notes`: line-by-line feedback, `{ line, type: "issue" | "praise" | "tip", text }`.
- `code`: a saved attempt to load instead of the starter.
- `result`: a finished run to display, `{ verdict, pass, total, ms, error, stdout, mode, tests: [{ name, ok, ran, msg, hidden }] }`. This is what `run_java.py` prints.
- `className`: the Java class the tests call (default `Solution`, `Main` in editor-only mode).

Keep non-ASCII characters out of `codepad.js` (use `·` style escapes).

## Phone keyboards (v2.1)

The editor is a transparent textarea over a colored layer, so both must use identical text metrics. On load (and on resize and font load) it measures both layers and matches them, which fixes the cursor drifting to the right of the text on phones where text auto-sizing changes one layer. If they cannot be matched it falls back to a plain editor without colors, so the cursor is always where the text is. Enter from a phone keyboard auto-indents once, and autocorrect and autocapitalize are off. Set `plain: true` to force the plain editor.
