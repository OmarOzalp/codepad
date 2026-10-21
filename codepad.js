(function (global) {
  var SK = ["https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js", "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js"];
  var skP = null;
  function loadSk() {
    if (typeof Sk !== "undefined" && Sk.builtinFiles) return Promise.resolve();
    if (skP) return skP;
    skP = new Promise(function (ok, bad) {
      (function add(i) {
        if (i >= SK.length) return ok();
        var s = document.createElement("script");
        s.src = SK[i]; s.onload = function () { add(i + 1); };
        s.onerror = function () { skP = null; bad(new Error("skulpt")); };
        document.head.appendChild(s);
      })(0);
    });
    return skP;
  }
  var VERSION = "2.0";
  var SQL_URL = "https://cdn.jsdelivr.net/npm/sql.js@1.15.1/dist/sql-asm.js";
  var SQL_WASM_URL = "https://cdn.jsdelivr.net/npm/sql.js@1.15.1/dist/sql-wasm-inline.js";
  var LANGS = {
    python: { label: "Python", k: "py" },
    javascript: { label: "JavaScript", k: "js" },
    sql: { label: "SQL (SQLite)", k: "sql" },
    java: { label: "Java", k: "java" }
  };
  function normLang(l) {
    l = String(l || "python").toLowerCase();
    if (l === "py") return "python";
    if (l === "js") return "javascript";
    return LANGS[l] ? l : "python";
  }
  var CSS = ".cp{--bg:var(--surface-1,#f5f4ed);--card:var(--surface-2,#fff);--fg:var(--text-primary,#1f1e1d);--mut:var(--text-secondary,#6b6a68);--ln:var(--border-strong,#d9d6cc);--hair:var(--border,#e6e3da);--clay:#c6613f;--okb:var(--bg-success,#e6f3df);--ok:var(--text-success,#2f6b1c);--erb:var(--bg-danger,#fbe5e1);--er:var(--text-danger,#a8321f);--inb:var(--bg-accent,#e3eefb);--in:var(--text-accent,#1f5aa6);--wb:var(--bg-warning,#fbf0cf);--w:var(--text-warning,#7a5a00);--mono:var(--font-mono,ui-monospace,Menlo,Consolas,monospace);color:var(--fg);font-size:14px;line-height:1.55;display:flex;flex-direction:column;gap:10px}" +
    ".cp [hidden]{display:none!important}.cp *{box-sizing:border-box}" +
    ".cp-head{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.cp-title{font-size:16px;font-weight:500}" +
    ".cp-pill{font-size:12px;padding:2px 9px;border-radius:999px;background:var(--bg);border:0.5px solid var(--ln);color:var(--mut)}" +
    ".cp-pill.ok{background:var(--okb);color:var(--ok);border-color:transparent}.cp-pill.er{background:var(--erb);color:var(--er);border-color:transparent}.cp-pill.run{background:var(--wb);color:var(--w);border-color:transparent}" +
    ".cp-desc{background:var(--bg);border-radius:var(--radius,8px);padding:10px 12px}.cp-desc p{margin:0 0 8px}.cp-desc p:last-child{margin:0}" +
    ".cp-ex{font:12.5px/1.5 var(--mono);background:var(--card);border:0.5px solid var(--hair);border-radius:6px;padding:6px 9px;margin:6px 0 0;white-space:pre-wrap}" +
    ".cp-ed{display:flex;border:0.5px solid var(--ln);border-radius:var(--radius,8px);overflow:hidden;background:var(--card)}" +
    ".cp-g{flex:none;width:44px;overflow:hidden;background:var(--bg);border-right:0.5px solid var(--hair);padding:10px 0;font:12.5px/20px var(--mono);color:var(--mut);text-align:right;user-select:none}" +
    ".cp-ln{padding:0 8px 0 4px;height:20px;cursor:default}.cp-ln.n-issue{background:var(--erb);color:var(--er);cursor:pointer}.cp-ln.n-praise{background:var(--okb);color:var(--ok);cursor:pointer}.cp-ln.n-tip{background:var(--inb);color:var(--in);cursor:pointer}.cp-ln.c{box-shadow:inset 3px 0 0 var(--clay)}" +
    ".cp-ta{flex:1;min-width:0;border:0;outline:0;resize:none;background:transparent;color:var(--fg);font:13px/20px var(--mono);padding:10px 12px;white-space:pre;overflow:auto;tab-size:4}" +
    ".cp-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.cp-bar .sp{flex:1}" +
    ".cp button.cp-b{font:inherit;font-size:13px;padding:6px 12px;border-radius:var(--radius,8px);border:0.5px solid var(--ln);background:transparent;color:var(--fg);cursor:pointer}.cp button.cp-b:hover{background:var(--bg)}" +
    ".cp button.cp-b.go{background:var(--clay);border-color:var(--clay);color:#fff}.cp button.cp-b.go:hover{opacity:.92}" +
    ".cp-in{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:var(--bg);border-radius:var(--radius,8px);padding:8px 10px}.cp-in input{flex:1;min-width:140px}" +
    ".cp-card{border-radius:var(--radius,8px);padding:8px 12px;background:var(--bg);margin:0}.cp-card p{margin:0}.cp-card .t{font-size:12px;color:var(--mut);margin:0 0 2px;display:flex;justify-content:space-between;align-items:center}.cp>button{align-self:flex-start}" +
    ".cp-card.n-issue{background:var(--erb)}.cp-card.n-praise{background:var(--okb)}.cp-card.n-tip{background:var(--inb)}.cp-card.on{outline:1.5px solid var(--clay)}" +
    ".cp-stack{display:flex;flex-direction:column;gap:6px}.cp-sum{font-size:15px;font-weight:500;display:flex;gap:10px;flex-wrap:wrap;align-items:baseline}.cp-sum span{font-size:13px;font-weight:400;color:var(--mut)}" +
    ".cp-r{display:flex;gap:10px;align-items:flex-start;padding:6px 10px;border-radius:var(--radius,8px);background:var(--bg);font-size:13.5px}.cp-r b{flex:none;font-size:11.5px;font-weight:500;padding-top:2px}.cp-r.p{background:var(--okb);color:var(--ok)}.cp-r.f{background:var(--erb);color:var(--er)}" +
    ".cp-r code{display:block;font:12.5px/1.45 var(--mono);margin-top:2px;overflow-wrap:anywhere}" +
    ".cp-pre{margin:0;padding:9px 11px;border-radius:var(--radius,8px);background:var(--bg);font:12.5px/1.5 var(--mono);white-space:pre-wrap;overflow:auto}.cp-pre.er{background:var(--erb);color:var(--er)}" +
    ".cp-x{border:0;background:transparent;color:var(--mut);cursor:pointer;font-size:16px;line-height:1;padding:0 4px}" +
    ".cp{--sk:#b4457c;--ss:#2f7a3f;--sn:#b86a00;--sc:#8a877d;--sd:#1f5aa6;--sb:#7a4fb0;--sf:#2a6f97;--sa:#c6613f}" +
    "@media (prefers-color-scheme:dark){:root:not([data-mode=\"light\"]) .cp{--sk:#e58ac0;--ss:#8fd19e;--sn:#f0b45a;--sc:#8b8a85;--sd:#7db3f0;--sb:#b79cf0;--sf:#7fc4e8;--sa:#e8916f}}" +
    "[data-mode=\"dark\"] .cp{--sk:#e58ac0;--ss:#8fd19e;--sn:#f0b45a;--sc:#8b8a85;--sd:#7db3f0;--sb:#b79cf0;--sf:#7fc4e8;--sa:#e8916f}" +
    ".cp .t-k{color:var(--sk)}.cp .t-s{color:var(--ss)}.cp .t-n{color:var(--sn)}.cp .t-c{color:var(--sc);font-style:italic}.cp .t-d{color:var(--sd)}.cp .t-b{color:var(--sb)}.cp .t-f{color:var(--sf)}.cp .t-a{color:var(--sa)}" +
    ".cp-wrap{position:relative;flex:1;min-width:0}.cp-hl{position:absolute;top:0;left:0;right:0;bottom:0;margin:0;padding:10px 12px;font:13px/20px var(--mono);white-space:pre;overflow:hidden;pointer-events:none;color:var(--fg);tab-size:4}" +
    ".cp-wrap .cp-ta{display:block;width:100%;position:relative;background:transparent;color:transparent;caret-color:var(--fg)}.cp-wrap .cp-ta::selection{background:rgba(198,97,63,.28);color:transparent}" +
    ".cp-mut{color:var(--mut);font-size:12.5px}.cp-tabs{display:flex;gap:4px;border-bottom:0.5px solid var(--hair)}.cp button.cp-tab{font:inherit;font-size:13px;border:0;background:transparent;color:var(--mut);padding:5px 12px;border-bottom:2px solid transparent;cursor:pointer;border-radius:0}.cp button.cp-tab.on{color:var(--fg);border-bottom-color:var(--clay)}" +
    ".cp-tw{overflow:auto;max-height:260px;border:0.5px solid var(--hair);border-radius:var(--radius,8px);background:var(--card)}.cp-tbl{border-collapse:collapse;font:12.5px/1.4 var(--mono);width:100%}.cp-tbl th,.cp-tbl td{padding:4px 10px;text-align:left;border-bottom:0.5px solid var(--hair);white-space:nowrap}.cp-tbl th{background:var(--bg);font-weight:500;position:sticky;top:0}.cp-tbl td.nul{color:var(--mut);font-style:italic}" +
    ".cp select.cp-sel{font:inherit;font-size:12px;padding:2px 8px;border-radius:999px;border:0.5px solid var(--ln);background:var(--bg);color:var(--mut)}";
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function prog(code, tests) {
    var p = code.replace(/\s+$/, "") + "\n\ndef _t(n, f):\n    try:\n        f()\n        print('@@P|' + n)\n    except AssertionError as e:\n        print('@@F|' + n + '|' + (str(e) or 'assertion failed'))\n    except Exception as e:\n        print('@@F|' + n + '|' + e.__class__.__name__ + ': ' + str(e))\n\n";
    tests.forEach(function (t, i) {
      p += "def _t" + i + "():\n" + t[1].split("\n").map(function (l) { return "    " + l; }).join("\n") + "\n_t(" + JSON.stringify(t[0]) + ", _t" + i + ")\n\n";
    });
    return p;
  }
  function runSk(code, tests, limit) {
    var buf = [], t0;
    Sk.configure({ output: function (t) { buf.push(t); }, read: function (x) {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) throw "File not found: '" + x + "'";
      return Sk.builtinFiles["files"][x]; }, __future__: Sk.python3, execLimit: limit || 4000 });
    t0 = performance.now();
    return Sk.misceval.asyncToPromise(function () { return Sk.importMainWithBody("<stdin>", false, prog(code, tests), true); })
      .then(function () { return { out: buf.join(""), err: null, ms: performance.now() - t0 }; },
            function (e) { return { out: buf.join(""), err: String(e), ms: performance.now() - t0 }; });
  }
  function jsProg(code, tests) {
    var p = code + "\n;var __out=[];function __t(n,f){try{f();__out.push('@@P|'+n)}catch(e){__out.push('@@F|'+n+'|'+((e&&e.name==='AssertionError')?e.message:((e&&e.name)||'Error')+': '+(e&&e.message)))}}\nfunction assert(c,m){if(!c){var e=new Error(m||'assertion failed');e.name='AssertionError';throw e}}\nfunction deepEqual(a,b){return JSON.stringify(a)===JSON.stringify(b)}\n";
    tests.forEach(function (t) { p += "__t(" + JSON.stringify(t[0]) + ", function(){\n" + t[1] + "\n});\n"; });
    return p + "return __out.join('\\n');";
  }
  function jsMain(src) {
    var buf = [], con = { log: function () { buf.push([].slice.call(arguments).join(" ")); } };
    try { var r = new Function("console", src)(con); return { out: buf.join("\n") + "\n" + (r || ""), err: null }; }
    catch (x) { return { out: buf.join("\n"), err: String(x) }; }
  }
  function runJs(code, tests, limit) {
    var t0 = performance.now(), src = jsProg(code, tests);
    return new Promise(function (done) {
      function fin(o) { o.ms = performance.now() - t0; done(o); }
      var w = null;
      try {
        var body = "onmessage=function(e){var buf=[];var console={log:function(){buf.push([].slice.call(arguments).join(' '))}};try{var r=new Function('console',e.data)(console);postMessage({out:buf.join('\\n')+'\\n'+(r||''),err:null})}catch(x){postMessage({out:buf.join('\\n'),err:String(x)})}}";
        w = new Worker(URL.createObjectURL(new Blob([body], { type: "text/javascript" })));
      } catch (e) { w = null; }
      if (!w) return fin(jsMain(src));
      var to = setTimeout(function () { w.terminate(); fin({ out: "", err: "TimeLimitError: Program exceeded run time limit." }); }, limit || 4000);
      w.onmessage = function (e) { clearTimeout(to); w.terminate(); fin(e.data); };
      w.onerror = function () { clearTimeout(to); w.terminate(); fin(jsMain(src)); };
      w.postMessage(src);
    });
  }
  function sqlJob(SQL, job) {
    var out = [], mainRes = null;
    function norm(v) { return typeof v === "number" ? Math.round(v * 1e6) / 1e6 : v; }
    function exec(extra) {
      var db = new SQL.Database(), r;
      try {
        if (job.setup) db.exec(job.setup);
        if (extra) db.exec(extra);
        var res = db.exec(job.code);
        r = res.length ? res[res.length - 1] : { columns: [], values: [] };
      } finally { db.close(); }
      return r;
    }
    function show(rows) { var s = JSON.stringify(rows); return s.length > 200 ? s.slice(0, 200) + "..." : s; }
    try { mainRes = exec(""); } catch (e) { return { out: "", err: String(e && e.message || e), table: null }; }
    job.tests.forEach(function (t) {
      var name = t[0], spec = t[1], msg = null;
      try {
        var res = (typeof spec === "object" && spec.setup) ? exec(spec.setup) : mainRes;
        var rows = res.values.map(function (r) { return r.map(norm); }), cols = res.columns;
        if (typeof spec === "string") {
          (new Function("rows", "cols", "assert", "deepEqual", spec))(rows, cols,
            function (c, m) { if (!c) throw new Error(m || "assertion failed"); },
            function (a, b) { return JSON.stringify(a) === JSON.stringify(b); });
        } else {
          if (spec.cols) {
            var lc = cols.map(function (c) { return String(c).toLowerCase(); }), ec = spec.cols.map(function (c) { return String(c).toLowerCase(); });
            if (JSON.stringify(lc) !== JSON.stringify(ec)) throw new Error("Expected columns " + JSON.stringify(spec.cols) + " but got " + JSON.stringify(cols));
          }
          var want = spec.rows.map(function (r) { return r.map(norm); });
          var a = rows.map(function (r) { return JSON.stringify(r); }), b = want.map(function (r) { return JSON.stringify(r); });
          if (!spec.ordered) { a.sort(); b.sort(); }
          if (a.length !== b.length) throw new Error("Expected " + b.length + " rows but got " + a.length + ". Got: " + show(rows));
          for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) throw new Error("Rows differ. Expected: " + show(want) + " Got: " + show(rows));
        }
      } catch (e) { msg = String(e && e.message || e); }
      out.push(msg === null ? "@@P|" + name : "@@F|" + name + "|" + msg.replace(/\n/g, " "));
    });
    return { out: out.join("\n"), err: null, table: { cols: mainRes.columns, rows: mainRes.values.slice(0, 50), total: mainRes.values.length } };
  }
  var sqW = null, sqP = null;
  function loadSqlMain() {
    if (sqP) return sqP;
    sqP = new Promise(function (ok, bad) {
      function ready() {
        if (typeof initSqlJs === "function") initSqlJs().then(ok, function (e) { sqP = null; bad(e); });
        else { sqP = null; bad(new Error("sqljs")); }
      }
      if (typeof initSqlJs === "function") return ready();
      var s = document.createElement("script"); s.src = SQL_URL; s.onload = ready;
      s.onerror = function () { sqP = null; bad(new Error("sqljs")); };
      document.head.appendChild(s);
    });
    return sqP;
  }
  function sqlWorker() {
    if (sqW) return sqW;
    sqW = new Promise(function (ok, bad) {
      var w;
      try {
        var src = "var sqlJob=" + sqlJob.toString() + ";var SQLDB=null;\n" +
          "try{importScripts(" + JSON.stringify(SQL_WASM_URL) + ")}catch(x){postMessage({boot:'fail',err:String(x)})}\n" +
          "if(typeof initSqlJs==='function'){initSqlJs().then(function(S){SQLDB=S;postMessage({boot:'ok'})},function(x){postMessage({boot:'fail',err:String(x)})})}\n" +
          "onmessage=function(e){try{postMessage(sqlJob(SQLDB,e.data))}catch(x){postMessage({out:'',err:String(x&&x.message||x),table:null})}}";
        w = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
      } catch (e) { sqW = null; return bad(e); }
      var t = setTimeout(function () { w.terminate(); sqW = null; bad(new Error("boot timeout")); }, 20000);
      w.onmessage = function (e) {
        if (e.data && e.data.boot === "ok") { clearTimeout(t); ok(w); }
        else if (e.data && e.data.boot === "fail") { clearTimeout(t); w.terminate(); sqW = null; bad(new Error(e.data.err)); }
      };
      w.onerror = function () { clearTimeout(t); w.terminate(); sqW = null; bad(new Error("worker")); };
    });
    return sqW;
  }
  function runSql(code, setup, tests, limit) {
    var job = { code: code, setup: setup || "", tests: tests };
    return sqlWorker().then(function (w) {
      return new Promise(function (done) {
        var t0 = performance.now();
        var to = setTimeout(function () { w.terminate(); sqW = null; done({ out: "", err: "TimeLimitError: Query exceeded the run time limit.", ms: performance.now() - t0, table: null }); }, limit || 4000);
        w.onmessage = function (e) { clearTimeout(to); var r = e.data; r.ms = performance.now() - t0; done(r); };
        w.onerror = function () { clearTimeout(to); w.terminate(); sqW = null; done({ out: "", err: "Error: the SQL worker stopped unexpectedly.", ms: performance.now() - t0, table: null }); };
        w.postMessage(job);
      });
    }, function () {
      return loadSqlMain().then(function (SQL) {
        var t0 = performance.now(), r;
        try { r = sqlJob(SQL, job); } catch (x) { r = { out: "", err: String(x && x.message || x), table: null }; }
        r.ms = performance.now() - t0; r.noLimit = true; return r;
      });
    });
  }
  function mk(a) { var o = {}; a.forEach(function (x) { o[x] = 1; }); return o; }
  var KW = {
    py: mk("def class return if elif else for while in not and or is None True False pass break continue import from as try except finally raise with lambda yield global nonlocal assert del async await".split(" ")),
    js: mk("function const let var return if else for while do in of new class extends import export from async await try catch finally throw switch case break continue default typeof instanceof null undefined true false void delete".split(" ")),
    java: mk("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized throw throws transient try void volatile while var record null true false".split(" ")),
    sql: mk("select from where group by order having limit offset join left right inner outer full cross on as and or not in is null like glob between exists distinct union all except intersect insert into values update set delete create table drop alter add column primary key foreign references default unique index view case when then else end with recursive over partition asc desc if begin commit rollback true false autoincrement check constraint using natural".split(" "))
  };
  var BI = {
    py: mk("print len range enumerate sorted min max sum abs str int float list dict set tuple bool isinstance super zip map filter any all reversed open input type".split(" ")),
    js: mk("console Math Map Set Array Object JSON Number String Promise Date Error parseInt parseFloat isNaN".split(" ")),
    java: mk("String System Math List ArrayList LinkedList Map HashMap TreeMap LinkedHashMap Set HashSet TreeSet Integer Long Double Boolean Character Object Arrays Collections Optional Deque ArrayDeque Queue PriorityQueue Stack Iterator Exception RuntimeException IllegalArgumentException IllegalStateException StringBuilder Scanner Comparable Comparator Runnable".split(" ")),
    sql: mk("count sum avg min max round coalesce ifnull nullif length upper lower substr substring trim ltrim rtrim replace abs date time datetime strftime julianday row_number rank dense_rank lag lead ntile first_value last_value cast group_concat typeof random integer int text real blob numeric varchar char boolean".split(" "))
  };
  var RX = {
    py: /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|[rRbBfFuU]{0,2}"(?:\\.|[^"\\\n])*"|[rRbBfFuU]{0,2}'(?:\\.|[^'\\\n])*')|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_]\w*)/g,
    js: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\[\s\S]|[^`\\])*`)|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_$][\w$]*)/g,
    java: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?[lLfFdD]?\b)|(@?[A-Za-z_$][\w$]*)/g,
    sql: /(--[^\n]*|\/\*[\s\S]*?\*\/)|('(?:''|[^'])*'|"(?:""|[^"])*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g
  };
  function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function highlight(code, k) {
    var re = RX[k], out = "", last = 0, m, prev = "";
    re.lastIndex = 0;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index)); last = re.lastIndex;
      var t = m[0], cls = "";
      if (m[1] !== undefined) { cls = "c"; prev = ""; }
      else if (m[2] !== undefined) { cls = "s"; prev = ""; }
      else if (m[3] !== undefined) { cls = "n"; prev = ""; }
      else {
        var w = k === "sql" ? t.toLowerCase() : t;
        if (KW[k][w]) cls = "k";
        else if (t === "self" || t === "cls" || t === "this") cls = "a";
        else if (t.charAt(0) === "@") cls = "a";
        else if (BI[k][w]) cls = "b";
        else if (prev === "def" || prev === "class" || prev === "function" || prev === "interface" || prev === "enum" || prev === "record") cls = "d";
        else if (k === "sql" && (prev === "from" || prev === "join" || prev === "into" || prev === "table" || prev === "update" || prev === "view")) cls = "d";
        else if (code.charAt(last) === "(") cls = "f";
        else if (k === "java" && /^[A-Z][A-Za-z0-9_]*$/.test(t) && !/^[A-Z0-9_]+$/.test(t)) cls = "b";
        prev = w;
      }
      out += cls ? '<span class="t-' + cls + '">' + esc(t) + "</span>" : esc(t);
    }
    return out + esc(code.slice(last));
  }
  function attach(ta, o, onRun, onChange) {
    var IND = o.ind, py = !!o.colon;
    function setv(v, a, b) { ta.value = v; ta.selectionStart = a; ta.selectionEnd = b == null ? a : b; onChange(); }
    ta.addEventListener("keydown", function (e) {
      var v = ta.value, s = ta.selectionStart, en = ta.selectionEnd;
      if (e.key === "Enter") {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) return onRun();
        var ls = v.lastIndexOf("\n", s - 1) + 1, before = v.slice(ls, s), ind = before.match(/^[ \t]*/)[0], code = before.replace(/\s+$/, ""), extra = "", tail = "";
        var closer = { "{": "}", "(": ")", "[": "]" }[code.slice(-1)];
        if (closer) { extra = IND; if (v.charAt(en) === closer) tail = "\n" + ind; }
        else if (py) {
          var nc = code.replace(/\s+#[^"']*$/, "");
          if (/:$/.test(nc)) extra = IND;
          else if (/^(return|pass|break|continue|raise)\b/.test(code.trim()) && ind.length >= IND.length) ind = ind.slice(IND.length);
        }
        var ins = "\n" + ind + extra;
        setv(v.slice(0, s) + ins + tail + v.slice(en), s + ins.length);
      } else if (e.key === "Tab") {
        e.preventDefault();
        var multi = v.slice(s, en).indexOf("\n") >= 0;
        if (!e.shiftKey && !multi) { setv(v.slice(0, s) + IND + v.slice(en), s + IND.length); return; }
        var a = v.lastIndexOf("\n", s - 1) + 1, block = v.slice(a, en), re = new RegExp("^ {1," + IND.length + "}");
        var nb = block.split("\n").map(function (l) { return e.shiftKey ? l.replace(re, "") : IND + l; }).join("\n");
        if (s === en) setv(v.slice(0, a) + nb + v.slice(en), Math.max(a, s - (block.length - nb.length)));
        else setv(v.slice(0, a) + nb + v.slice(en), a, a + nb.length);
      } else if (e.key === "Backspace" && s === en) {
        var ls2 = v.lastIndexOf("\n", s - 1) + 1, pre = v.slice(ls2, s);
        if (pre.length && /^ +$/.test(pre)) { var del = pre.length % IND.length || IND.length; e.preventDefault(); setv(v.slice(0, s - del) + v.slice(s), s - del); }
      }
    });
  }
  var DEF = {
    python: "print(\"hello\")\n",
    javascript: "console.log(\"hello\");\n",
    sql: "CREATE TABLE people (id INTEGER, name TEXT, age INTEGER);\nINSERT INTO people VALUES (1, 'Ada', 36), (2, 'Linus', 54), (3, 'Grace', 45);\n\nSELECT name, age FROM people ORDER BY age DESC;\n",
    java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"hello\");\n    }\n}\n"
  };
  var SCR = {
    python: DEF.python, javascript: DEF.javascript,
    sql: "-- the problem's tables are already loaded, try any query\nSELECT 1;\n",
    java: DEF.java
  };
  function tbl(t) {
    var w = el("div", "cp-tw"), tb = el("table", "cp-tbl"), h = el("tr");
    t.cols.forEach(function (c) { h.appendChild(el("th", "", String(c))); }); tb.appendChild(h);
    t.rows.forEach(function (r) {
      var tr = el("tr");
      r.forEach(function (v) { tr.appendChild(el("td", v === null ? "nul" : "", v === null ? "NULL" : String(v))); });
      tb.appendChild(tr);
    });
    w.appendChild(tb); return w;
  }
  function mount(root, cfg) {
    if (!document.getElementById("cp-css")) { var st = el("style"); st.id = "cp-css"; st.textContent = CSS; document.head.appendChild(st); }
    var L = normLang(cfg.lang), K = LANGS[L].k, LB = LANGS[L].label, JAVA = L === "java", SANDBOX = !!cfg.sandbox;
    var store = cfg._store || (cfg._store = {});
    var attOpts = { ind: (K === "py" || K === "java") ? "    " : "  ", colon: K === "py" };
    if (L === "python") loadSk().catch(function () {});
    if (L === "sql") sqlWorker().catch(function () {});
    root.innerHTML = ""; root.className = "cp";
    var tests = cfg.tests || [], hints = cfg.hints || [], notes = cfg.notes || [], comments = [], shown = 0, busy = false, last = null, solAsk = false;
    var starter = cfg.starter != null ? cfg.starter : DEF[L];
    var snap = cfg.code != null ? cfg.code : starter;
    var cls = cfg.className || (SANDBOX ? "Main" : "Solution");
    var title = cfg.title || (SANDBOX ? "Code editor" : "Code");
    var head = el("div", "cp-head"), titleEl = el("span", "cp-title", title), diff = el("span", "cp-pill", cfg.difficulty || ""), status = el("span", "cp-pill", "Ready"), langEl, ta, hl;
    if (SANDBOX) {
      langEl = el("select", "cp-sel"); langEl.setAttribute("aria-label", "Language");
      ["python", "javascript", "sql", "java"].forEach(function (l) { var o = el("option", "", LANGS[l].label); o.value = l; if (l === L) o.selected = true; langEl.appendChild(o); });
      langEl.onchange = function () {
        store[L] = ta.value;
        var c2 = {}, p; for (p in cfg) c2[p] = cfg[p];
        c2.lang = langEl.value; c2.starter = store[langEl.value] != null ? store[langEl.value] : DEF[langEl.value];
        c2.code = null; c2.result = null; c2.notes = [];
        mount(root, c2);
      };
    } else langEl = el("span", "cp-pill", LB);
    var sp = el("span", "sp"); sp.style.flex = "1";
    head.appendChild(titleEl); if (cfg.difficulty) head.appendChild(diff); head.appendChild(langEl); head.appendChild(sp); head.appendChild(status);
    var desc = el("div", "cp-desc");
    (cfg.description || "").split("\n\n").forEach(function (p) { if (p) desc.appendChild(el("p", "", p)); });
    if (cfg.schema) desc.appendChild(el("div", "cp-ex", "Schema:\n" + cfg.schema));
    (cfg.examples || []).forEach(function (x) { desc.appendChild(el("div", "cp-ex", "Input: " + x.input + "\nOutput: " + x.output + (x.why ? "\n" + x.why : ""))); });
    if (!desc.firstChild) desc.hidden = true;
    var ed = el("div", "cp-ed"), gut = el("div", "cp-g"), wrap = el("div", "cp-wrap");
    ta = el("textarea", "cp-ta"); hl = el("pre", "cp-hl");
    ta.spellcheck = false; ta.setAttribute("aria-label", LB + " code"); ta.value = snap;
    wrap.appendChild(hl); wrap.appendChild(ta); ed.appendChild(gut); ed.appendChild(wrap);
    var noteBox = el("div", "cp-stack");
    var tabs = el("div", "cp-tabs"), tP = el("button", "cp-tab on", "Problem"), tS = el("button", "cp-tab", "Scratchpad");
    tabs.appendChild(tP); tabs.appendChild(tS);
    var scratch = el("div", "cp-stack"); scratch.hidden = true;
    var sta = el("textarea", "cp-ta"), shl = el("pre", "cp-hl"), swrap = el("div", "cp-wrap");
    sta.spellcheck = false; sta.value = SCR[L]; sta.style.height = "180px"; sta.className += " ov";
    swrap.style.flex = "none"; swrap.style.border = "0.5px solid var(--ln)"; swrap.style.borderRadius = "var(--radius,8px)"; swrap.style.overflow = "hidden"; swrap.appendChild(shl); swrap.appendChild(sta);
    function sRefresh() { shl.innerHTML = highlight(sta.value, K) + "\n"; shl.scrollTop = sta.scrollTop; shl.scrollLeft = sta.scrollLeft; }
    sta.addEventListener("input", sRefresh); sta.addEventListener("scroll", sRefresh); sRefresh();
    var sOut = el("div", "cp-stack"); sOut.hidden = true;
    var sRow = el("div", "cp-bar"), sRun = el("button", "cp-b go", JAVA ? "Run scratchpad with Claude" : "Run scratchpad");
    function renderOut(box, r) {
      box.innerHTML = ""; box.hidden = false;
      var o = String(r.out || "").replace(/\s+$/, ""), hasT = r.table && r.table.cols.length;
      if (hasT) { box.appendChild(el("div", "cp-mut", r.table.total + " row" + (r.table.total === 1 ? "" : "s") + (r.table.total > r.table.rows.length ? " (first " + r.table.rows.length + " shown)" : ""))); box.appendChild(tbl(r.table)); }
      if (o) box.appendChild(el("pre", "cp-pre", o));
      if (r.err) box.appendChild(el("pre", "cp-pre er", r.err));
      if (!o && !r.err && !hasT) box.appendChild(el("pre", "cp-pre", L === "sql" ? "Ran with no rows to show." : "(no output)"));
      box.appendChild(el("div", "cp-mut", Math.round(r.ms || 0) + " ms" + (r.noLimit ? ". Ran without a time limit in this view, so avoid endless queries." : "")));
    }
    function engine(code, ts, limit) {
      if (L === "javascript") return runJs(code, ts, limit);
      if (L === "sql") return runSql(code, cfg.setup, ts, limit);
      return loadSk().then(function () { return new Promise(function (ok) { setTimeout(ok, 20); }); }).then(function () { return runSk(code, ts, limit); });
    }
    var failMsg = "The code engine could not load in this view. You can still send the code to Claude for review.";
    sRun.onclick = function () {
      if (JAVA) return askJava("main", sta.value, "Main");
      sOut.hidden = false; sOut.innerHTML = ""; sOut.appendChild(el("pre", "cp-pre", "Running..."));
      engine(sta.value, [], 4000).then(function (r) { renderOut(sOut, r); }, function () { sOut.innerHTML = ""; sOut.appendChild(el("pre", "cp-pre er", failMsg)); });
    };
    sRow.appendChild(sRun); sRow.appendChild(el("span", "cp-mut", "Free practice. No tests, just run and see the output."));
    scratch.appendChild(swrap); scratch.appendChild(sRow); scratch.appendChild(sOut);
    attach(sta, attOpts, function () { sRun.click(); }, sRefresh);
    var bar = el("div", "cp-bar");
    function btn(label, c, fn) { var b = el("button", "cp-b " + (c || ""), label); b.onclick = fn; return b; }
    var bRun = btn(JAVA ? "Run with Claude" : "Run", SANDBOX ? "go" : "", function () { SANDBOX ? execute([], "main") : execute(tests.filter(function (t) { return !t[2]; }), "run"); });
    var bSub = btn(JAVA ? "Submit with Claude" : "Submit", "go", function () { execute(tests, "submit"); });
    var bHint = btn("Hint", "", showHint);
    var bCmt = btn("Comment on selection", "", openComment);
    var bReset = btn("Reset", "", function () { ta.value = starter; res.innerHTML = ""; setStatus("Ready", ""); sync(); });
    var bSend = btn("Send to Claude", "", send);
    (SANDBOX ? [bRun, bCmt, bReset] : [bRun, bSub, bHint, bCmt, bReset]).forEach(function (b) { bar.appendChild(b); }); bar.appendChild(el("span", "sp")); bar.appendChild(bSend);
    var cIn = el("div", "cp-in"); cIn.hidden = true;
    var cLab = el("span", "cp-mut", ""), cTxt = el("input"); cTxt.placeholder = "What do you want to ask or note about this part?"; cTxt.setAttribute("aria-label", "Comment");
    var cAdd = btn("Add", "", addComment), cAddS = btn("Add and send to Claude", "go", function () { if (addComment()) send(); }), cCan = btn("Cancel", "", function () { cIn.hidden = true; });
    [cLab, cTxt, cAdd, cAddS, cCan].forEach(function (x) { cIn.appendChild(x); });
    var cList = el("div", "cp-stack"), hBox = el("div", "cp-stack"), solBtn = btn("Show solution", "", showSol); solBtn.hidden = true;
    var res = el("div", "cp-stack"), sendBox = el("div", "cp-stack");
    var main = el("div", "cp-stack");
    [desc, ed, bar, cIn, noteBox, cList, hBox, solBtn, res, sendBox].forEach(function (x) { main.appendChild(x); });
    tP.onclick = function () { main.hidden = false; scratch.hidden = true; tP.className = "cp-tab on"; tS.className = "cp-tab"; };
    tS.onclick = function () { main.hidden = true; scratch.hidden = false; tS.className = "cp-tab on"; tP.className = "cp-tab"; };
    root.appendChild(head); if (!SANDBOX) root.appendChild(tabs); root.appendChild(main); if (!SANDBOX) root.appendChild(scratch);
    var pending = null;
    function lineAt(i) { return ta.value.slice(0, i).split("\n").length; }
    function sync() {
      var n = ta.value.split("\n").length;
      ta.style.height = Math.min(Math.max(n, 8), 24) * 20 + 20 + "px"; gut.style.height = ta.style.height;
      hl.innerHTML = highlight(ta.value, K) + "\n"; hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft;
      gut.innerHTML = "";
      var inner = el("div"); gut.appendChild(inner);
      for (var i = 1; i <= n; i++) {
        var d = el("div", "cp-ln", String(i)), kind = null;
        notes.forEach(function (nt) { if (nt.line === i) kind = nt.type || "tip"; });
        if (kind) { d.className += " n-" + kind; (function (ln) { d.onclick = function () { var c = noteBox.querySelectorAll(".cp-card"); for (var k = 0; k < c.length; k++) c[k].classList.toggle("on", c[k].getAttribute("data-l") === String(ln)); }; })(i); }
        if (comments.some(function (c) { return i >= c.a && i <= c.b; })) d.className += " c";
        inner.appendChild(d);
      }
      inner.style.marginTop = -ta.scrollTop + "px";
      renderNotes();
    }
    function renderNotes() {
      noteBox.innerHTML = "";
      if (!notes.length) return;
      noteBox.appendChild(el("div", "cp-mut", "Claude's notes" + (ta.value !== snap ? " (you've edited the code since, so line numbers may have moved)" : "")));
      notes.forEach(function (nt) {
        var c = el("div", "cp-card n-" + (nt.type || "tip")); c.setAttribute("data-l", String(nt.line));
        c.appendChild(el("p", "t", "Line " + nt.line + " \u00b7 " + (nt.type || "tip")));
        c.appendChild(el("p", "", nt.text)); noteBox.appendChild(c);
      });
    }
    ta.addEventListener("scroll", function () { var f = gut.firstChild; if (f) f.style.marginTop = -ta.scrollTop + "px"; hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; });
    ta.addEventListener("input", sync);
    attach(ta, attOpts, function () { bRun.click(); }, sync);
    function setStatus(t, k) { status.textContent = t; status.className = "cp-pill " + k; }
    function showHint() {
      if (!hints.length) { hBox.innerHTML = ""; hBox.appendChild(el("div", "cp-mut", "No hints for this one.")); return; }
      if (shown < hints.length) { shown++; var c = el("div", "cp-card"); c.appendChild(el("p", "t", "Hint " + shown + " of " + hints.length)); c.appendChild(el("p", "", hints[shown - 1])); hBox.appendChild(c); }
      else if (!hBox.querySelector(".end")) hBox.appendChild(el("div", "cp-mut end", "That's every hint."));
      bHint.textContent = "Hint (" + shown + "/" + hints.length + ")";
      if (shown === hints.length && cfg.solution) solBtn.hidden = false;
    }
    function showSol() {
      if (!solAsk) { solAsk = true; solBtn.textContent = "Really show it? Click again"; return; }
      solBtn.hidden = true; var c = el("div", "cp-stack"); c.appendChild(el("div", "cp-mut", "Reference solution")); c.appendChild(el("pre", "cp-pre", cfg.solution)); hBox.appendChild(c);
    }
    function openComment() {
      var a = ta.selectionStart, b = ta.selectionEnd;
      if (a === b) { cLab.textContent = "Select some code in the editor first, then click again."; cTxt.hidden = true; cAdd.hidden = true; cAddS.hidden = true; cIn.hidden = false; return; }
      var end = ta.value.charAt(b - 1) === "\n" ? b - 1 : b;
      pending = { a: lineAt(a), b: lineAt(end), snip: ta.value.slice(a, b).replace(/\s+/g, " ").slice(0, 70) };
      cLab.textContent = pending.a === pending.b ? "Line " + pending.a : "Lines " + pending.a + "-" + pending.b;
      cTxt.hidden = false; cAdd.hidden = false; cAddS.hidden = false; cTxt.value = ""; cIn.hidden = false; cTxt.focus();
    }
    function addComment() {
      var v = cTxt.value.trim(); if (!v || !pending) { cTxt.focus(); return false; }
      pending.text = v; comments.push(pending); pending = null; cIn.hidden = true; renderComments(); sync(); return true;
    }
    function renderComments() {
      cList.innerHTML = "";
      comments.forEach(function (c, i) {
        var d = el("div", "cp-card"), t = el("p", "t", (c.a === c.b ? "Line " + c.a : "Lines " + c.a + "-" + c.b) + " \u00b7 " + c.snip);
        var x = el("button", "cp-x", "\u00d7"); x.setAttribute("aria-label", "Remove comment"); x.onclick = function () { comments.splice(i, 1); renderComments(); sync(); };
        t.appendChild(x); d.appendChild(t); d.appendChild(el("p", "", c.text)); cList.appendChild(d);
      });
    }
    function sendOut(m) {
      sendBox.innerHTML = "";
      if (typeof global.sendPrompt === "function") { global.sendPrompt(m); setStatus("Sent to Claude", "ok"); }
      else { var t = el("textarea", "cp-ta"); t.value = m; t.style.height = "140px"; t.style.border = "0.5px solid var(--ln)"; sendBox.appendChild(el("div", "cp-mut", "Copy this and paste it into the chat:")); sendBox.appendChild(t); t.select(); }
    }
    function askJava(mode, code, cn) {
      var what = mode === "main" ? "compile and run the main method of" : mode === "submit" ? "compile and run all the tests (including hidden ones) for" : "compile and run the sample tests for";
      sendOut("Please run my Java code: " + what + " this" + (cfg.title && !SANDBOX && mode !== "main" ? " (\"" + cfg.title + "\")" : "") + ".\n\nClass name: " + cn + "\nMode: " + mode + "\n\n```java\n" + code + "\n```\n\nCompile and run it with javac in your workspace, then show the result in a new cell with this same code. If you cannot run Java here, say so plainly instead of guessing the output.");
    }
    function classify(r) {
      if (!r.err) return null;
      if (/TimeLimit/.test(r.err)) return "Time limit exceeded";
      var re = L === "sql" ? /syntax error|incomplete input|unrecognized token/i : /Syntax|Indentation|Token/i;
      return re.test(r.err) ? "Compile error" : "Runtime error";
    }
    function paint(o) {
      setStatus(o.verdict, o.kind);
      res.innerHTML = "";
      var sum = el("div", "cp-sum", o.verdict);
      sum.appendChild(el("span", "", (o.total ? o.pass + " of " + o.total + " tests \u00b7 " : "") + Math.round(o.ms || 0) + " ms")); res.appendChild(sum);
      if (o.table && o.table.cols.length) {
        res.appendChild(el("div", "cp-mut", "Your query returned " + o.table.total + " row" + (o.table.total === 1 ? "" : "s") + (o.table.total > o.table.rows.length ? " (first " + o.table.rows.length + " shown)" : "") + ":"));
        res.appendChild(tbl(o.table));
      }
      if (o.error) res.appendChild(el("pre", "cp-pre er", o.error + (o.verdict === "Time limit exceeded" ? "\n\nToo slow for this input. Look for a loop inside a loop, or a lookup that scans a list." : "")));
      o.rows.forEach(function (t) {
        var d = el("div", "cp-r" + (t.ran ? (t.ok ? " p" : " f") : ""));
        d.appendChild(el("b", "", t.ran ? (t.ok ? "PASS" : "FAIL") : "NOT RUN"));
        var w = el("div", "", (t.hidden && o.mode === "submit" && t.ok ? "Hidden test" : t.name));
        if (t.ran && !t.ok) w.appendChild(el("code", "", t.msg)); d.appendChild(w); res.appendChild(d);
      });
      if (o.stdout) res.appendChild(el("pre", "cp-pre", "output:\n" + o.stdout));
      if (o.noLimit) res.appendChild(el("div", "cp-mut", "Ran without a time limit in this view, so avoid endless queries."));
    }
    function execute(ts, mode) {
      if (JAVA) return askJava(mode, ta.value, cls);
      if (busy) return; busy = true; setStatus("Running...", "run");
      engine(ta.value, ts, cfg.limit)
        .then(function (r) { busy = false; if (mode === "main") reportMain(r); else report(r, ts, mode); })
        .catch(function () { busy = false; setStatus("Engine failed to load", "er"); res.innerHTML = ""; res.appendChild(el("div", "cp-pre er", failMsg)); });
    }
    function reportMain(r) {
      var ce = classify(r), v = ce || "Finished";
      setStatus(v, ce ? "er" : "ok"); renderOut(res, r);
      last = { v: v, pass: 0, n: 0, ms: Math.round(r.ms), mode: "run", first: null, err: r.err };
    }
    function report(r, ts, mode) {
      var st = {}, printed = [], pass = 0, first = null;
      String(r.out || "").split("\n").forEach(function (l) {
        if (l.indexOf("@@P|") === 0) st[l.slice(4)] = [1, ""];
        else if (l.indexOf("@@F|") === 0) { var q = l.slice(4), k = q.indexOf("|"); st[q.slice(0, k)] = [0, q.slice(k + 1)]; }
        else if (l.length) printed.push(l);
      });
      var rows = ts.map(function (t) {
        var s = st[t[0]]; if (s && s[0]) pass++; else if (!first) first = t[0];
        return { name: t[0], ok: !!(s && s[0]), ran: !!s, msg: s ? s[1] : "", hidden: !!t[2] };
      });
      var ce = classify(r), v, k = "er";
      if (ce) v = ce;
      else if (pass === ts.length) { v = mode === "submit" ? "Accepted" : "Sample tests passed"; k = "ok"; }
      else v = "Wrong answer";
      paint({ verdict: v, kind: k, pass: pass, total: ts.length, ms: r.ms, error: r.err, rows: rows, stdout: printed.join("\n"), table: r.table, noLimit: r.noLimit, mode: mode });
      last = { v: v, pass: pass, n: ts.length, ms: Math.round(r.ms), mode: mode, first: first, err: r.err };
    }
    function fromResult(x) {
      var rows = (x.tests || []).map(function (t) { return { name: t.name, ok: !!t.ok, ran: t.ran !== false, msg: t.msg || "", hidden: !!t.hidden }; });
      var v = x.verdict || "Finished", k = /^(Accepted|Sample tests passed|Finished)$/.test(v) ? "ok" : "er", total = x.total != null ? x.total : rows.length, pass = x.pass || 0, first = null;
      rows.forEach(function (t) { if (!t.ok && !first) first = t.name; });
      paint({ verdict: v, kind: k, pass: pass, total: total, ms: x.ms || 0, error: x.error, rows: rows, stdout: x.stdout, table: null, mode: x.mode });
      last = { v: v, pass: pass, n: total, ms: Math.round(x.ms || 0), mode: x.mode || "run", first: first, err: x.error };
    }
    function send() {
      var m = SANDBOX ? "Please review my " + LB + " code from the editor.\n\n" : "Please review my code for \"" + title + "\".\n\n";
      m += "```" + L + "\n" + ta.value + "\n```\n\n";
      m += last ? "Last " + last.mode + ": " + last.v + (last.n ? ", " + last.pass + " of " + last.n + " tests" : "") + ", " + last.ms + " ms" + (last.first ? ". First failing test: " + last.first : "") + (last.err ? ". Error: " + last.err : "") + ".\n" : "I haven't run it yet.\n";
      if (!SANDBOX) m += "Hints used: " + shown + " of " + hints.length + ".\n";
      if (comments.length) { m += "\nMy comments:\n"; comments.forEach(function (c) { m += "- " + (c.a === c.b ? "Line " + c.a : "Lines " + c.a + "-" + c.b) + " (" + c.snip + "): " + c.text + "\n"; }); }
      m += "\nPlease answer my comments, then show my code again in a new cell with line-by-line notes (what is good, what is wrong, what to tweak). Do not write the full solution.";
      sendOut(m);
    }
    sync();
    if (cfg.result) fromResult(cfg.result);
    return { getCode: function () { return ta.value; } };
  }
  global.CodePad = { mount: mount, version: VERSION, languages: ["python", "javascript", "sql", "java"] };
})(window);
