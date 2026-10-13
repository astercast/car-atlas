/* fleet-commons · honest-fallback v1.0.0 — deadline layer (runtime).
   Copy verbatim, do not fork. Source of truth: trend-machine wave 30
   (VP-0001) at c687d5f — assets/js/app.js fetchDeadline + watchdog,
   assets/js/oracle.js getJSON, assets/js/makeover.js withDeadline.
   The three idioms are the source's; only the packaging (one
   namespace, parameterized deadlines) is canonical. Fixes belong
   in fleet-commons; sites re-copy, never fork quietly.

   The law: a fetch that never settles must still reach a terminal
   state. Every load below races a deadline. */
(function () {
  "use strict";

  /* Canonical default deadline. Trend ships 10000 on its board and
     hero loaders, 12000 on the Oracle — the value is per-loader
     configuration; that every loader has one is the pattern. */
  var DEFAULT_DEADLINE_MS = 12000;

  /* Required data (app.js form): race the raw fetch against a
     rejecting deadline. The rejection — Error("deadline " + url) —
     flows into the caller's normal failure chain (next URL, static
     fallback, error banner), exactly like a network failure. */
  function fetchDeadline(url, ms) {
    var got = fetch(url);
    var deadline = new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error("deadline " + url));
      }, ms || DEFAULT_DEADLINE_MS);
    });
    return Promise.race([got, deadline]);
  }

  /* JSON data (oracle.js form): fetch + ok-check + parse under the
     same deadline. An `optional` load converts every failure —
     network, HTTP, parse, deadline — to null (best-effort data
     must never take the page down). A required load rethrows so
     the caller's fallback/error path engages. */
  function getJSON(url, opts) {
    opts = opts || {};
    var got = fetch(url).then(function (r) {
      if (!r.ok) { throw new Error(url); }
      return r.json();
    });
    var deadline = new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error("deadline " + url));
      }, opts.ms || DEFAULT_DEADLINE_MS);
    });
    return Promise.race([got, deadline]).catch(function () {
      if (opts.optional) { return null; }
      throw new Error(url);
    });
  }

  /* Enhancement over baked content (makeover.js form): race to
     RESOLVE null on deadline instead of rejecting. For loads whose
     only job is to replace already-honest baked values with live
     ones — if the fetch hangs, the baked snapshot simply stays on
     screen. No error state exists for this class, by design. */
  function withDeadline(p, ms) {
    return Promise.race([p, new Promise(function (res) {
      setTimeout(function () { res(null); }, ms || DEFAULT_DEADLINE_MS);
    })]);
  }

  /* Page-level backstop (app.js watchdog): arm at start with a
     delay LONGER than any single deadline. If the page is not live
     when it fires, force the terminal state (the site's fallback /
     alarm UI) even if some attempt is still pending. A late success
     clears the alarm through the site's normal live path. Returns
     a cancel function. */
  function armWatchdog(opts) {
    var timer = setTimeout(function () {
      if (!opts.isLive()) { opts.onStuck(); }
    }, opts.ms || 15000);
    return function () { clearTimeout(timer); };
  }

  window.HonestFetch = {
    DEFAULT_DEADLINE_MS: DEFAULT_DEADLINE_MS,
    fetchDeadline: fetchDeadline,
    getJSON: getJSON,
    withDeadline: withDeadline,
    armWatchdog: armWatchdog
  };
})();
