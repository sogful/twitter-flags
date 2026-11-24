(function () {
  "use strict";

  const entry = "/i/oauth2/authorize";
  const marker = "#twitterflags=";
  const rawmarker = "#twitterflags-path=";
  if (location.origin !== "https://x.com" || location.pathname !== entry || location.search) return;
  const raw = location.hash.startsWith(rawmarker);
  if (!raw && !location.hash.startsWith(marker)) return;

  let target;
  try {
    const path = raw ? location.hash.slice(rawmarker.length) : decodeURIComponent(location.hash.slice(marker.length));
    target = new URL(path, location.origin);
  }
  catch {return}
  if (target.origin !== location.origin || /^\/(?:i\/oauth|i\/flow|login|logout|account\/access)/i.test(target.pathname)) return;

  function findrouter() {
    const visited = new Set();
    for (const element of [document, document.querySelector("main"), document.querySelector("article")]) {
      if (!element) continue;
      for (const key of Object.keys(element)) {
        if (!/^__react(?:Fiber|Container)\$/.test(key)) continue;
        let root = element[key];
        while (root?.return) root = root.return;
        const stack = [root?.stateNode?.current];
        while (stack.length) {
          const fiber = stack.pop();
          if (!fiber || visited.has(fiber)) continue;
          visited.add(fiber);
          for (const router of [fiber.memoizedProps?.router, fiber.memoizedProps?.value]) {
            if (typeof router?.navigate === "function" && router.options?.context?.relayEnvironment) return router;
          }
          stack.push(fiber.sibling, fiber.child);
        }
      }
    }
    return null;
  }

  const deadline = Date.now() + 15000;

  function fallback() {
    if (location.pathname !== entry) return;
    target.searchParams.set("twitterflags-default", "1");
    location.replace(target.href);
  }

  async function open() {
    const router = findrouter();
    if (!router) {
      if (Date.now() >= deadline) fallback();
      else setTimeout(open, 120);
      return;
    }
    if (!router.options.context.isAuthenticated) {fallback(); return}
    const timer = setTimeout(fallback, Math.max(0, deadline - Date.now()));
    try {
      const options = {to: target.pathname, replace: true};
      if (target.search) options.search = router.options.parseSearch(target.search);
      if (target.hash) options.hash = target.hash.slice(1);
      await router.navigate(options);
      if (location.pathname === entry) fallback();
      else sessionStorage.removeItem("twitterflags.clientattempt");
    } catch {fallback()} finally {clearTimeout(timer)}
  }

  void open();
})();
