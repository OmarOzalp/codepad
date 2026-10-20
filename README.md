# codepad

A small LeetCode-style practice editor (Run, Submit, hints, scratchpad, comments on selected code, syntax colors, auto-indent) that Claude renders inline in chat. Python runs in the browser with Skulpt. JavaScript runs in a Web Worker.

Load it from a widget:

```html
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/gh/OmarOzalp/codepad@<commit-sha>/codepad.js"></script>
<script>
CodePad.mount(document.getElementById("app"), {
  title: "1. Two Sum", difficulty: "Easy", lang: "python",
  description: "...", starter: "def two_sum(nums, target):\n    pass\n",
  hints: ["..."], tests: [["name", "assert ..."]]
});
</script>
```

Tests are `[name, body]` (a third `true` marks a hidden test that only runs on Submit). Python tests use `assert`. JavaScript tests use the built-in `assert(cond, msg)` and `deepEqual(a, b)`.

Optional config: `examples`, `notes` (line-by-line feedback: `{line, type: "issue"|"praise"|"tip", text}`), `code` (a saved attempt to load), `solution`, `limit` (ms).
