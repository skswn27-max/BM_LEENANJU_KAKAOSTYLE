(() => {
  "use strict";
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("main-nav");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function syncTheme() {
    const dark = root.dataset.theme === "dark";
    if (themeButton) {
      themeButton.setAttribute(
        "aria-label",
        dark ? "라이트 모드로 전환" : "다크 모드로 전환",
      );
      themeButton.setAttribute("aria-pressed", String(dark));
    }
  }
  themeButton?.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = theme;
    try {
      localStorage.setItem("nanju-theme", theme);
    } catch (_) {
      /* Local storage can be unavailable. */
    }
    syncTheme();
  });
  syncTheme();

  function closeMenu(restoreFocus = false) {
    menu?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (restoreFocus) menuButton?.focus();
  }
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menu?.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
  menu
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      menuButton?.getAttribute("aria-expanded") === "true"
    )
      closeMenu(true);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-header")) closeMenu();
  });
  window
    .matchMedia("(min-width: 601px)")
    .addEventListener("change", () => closeMenu());

  const articles = [...document.querySelectorAll(".case-article")];
  if (articles.length) {
    function showCase() {
      let id;
      try {
        id = decodeURIComponent(location.hash.slice(1)) || "olivebe";
      } catch (_) {
        id = "olivebe";
      }
      const target = document.getElementById(id);
      const article = target?.closest(".case-article") || articles[0];
      articles.forEach((a) => {
        a.hidden = a !== article;
      });
      document.querySelectorAll(".case-nav a").forEach((a) => {
        if (a.hash === "#" + article.id) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
      const current = document.querySelector(
        '.case-nav a[aria-current="page"]',
      );
      if (current) {
        const rail = current.parentElement;
        rail.scrollTo({
          left:
            current.offsetLeft - rail.clientWidth / 2 + current.offsetWidth / 2,
          behavior: "instant",
        });
      }
      const heading = article.querySelector("h1");
      if (heading) document.title = heading.textContent + " | 이난주";
      requestAnimationFrame(() => {
        if (target && target !== article && target.closest(".case-article")) {
          target.scrollIntoView({
            block: "start",
            behavior: reducedMotion ? "instant" : "smooth",
          });
        } else window.scrollTo({ top: 0, behavior: "instant" });
      });
    }
    window.addEventListener("hashchange", showCase);
    document.querySelectorAll(".case-nav a, .case-pager a").forEach((a) => {
      a.addEventListener("click", () => {
        if (a.hash === location.hash) showCase();
      });
    });
    showCase();
  }
})();
