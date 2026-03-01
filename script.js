console.log("script.js loaded");

async function loadProgress() {
  const res = await fetch(`data.json?v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load data.json");

  const data = await res.json();
  console.log("Loaded donation data:", data);

  const goal = Number(data.goal ?? 0);
  const raised = Number(data.raised ?? 0);
  const symbol = data.currencySymbol ?? "$";

  const pct = goal > 0 ? Math.max(0, Math.min(100, (raised / goal) * 100)) : 0;

  document.querySelectorAll("[data-goal-scale]").forEach((root) => {
    const raisedEl = root.querySelector(".goal-scale__raised strong");
    const metaEl = root.querySelector(".goal-scale__meta");
    const fill = root.querySelector(".progress__fill");
    const knob = root.querySelector(".progress__knob");
    const bar = root.querySelector(".progress");

    if (raisedEl) raisedEl.textContent = `${symbol}${raised}`;
    if (metaEl) metaEl.textContent = `of ${symbol}${goal} goal`;

    if (fill) fill.style.width = `${pct}%`;
    if (knob) knob.style.left = `${pct}%`;

    if (bar) {
      bar.setAttribute("aria-valuemax", String(goal));
      bar.setAttribute("aria-valuenow", String(raised));
    }
  });
}

function setupActiveNav() {
  const navLinks = Array.from(document.querySelectorAll(".topnav__link"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (navLinks.length === 0 || sections.length === 0) return;

  function setActiveById(id) {
    navLinks.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("topnav__link--active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  navLinks.forEach((a) => {
    a.addEventListener("click", () => {
      const id = a.getAttribute("href").slice(1);
      setActiveById(id);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveById(visible.target.id);
    },
    {
      root: null,
      rootMargin: "-40% 0px -55% 0px",
      threshold: [0.1, 0.25, 0.4, 0.6]
    }
  );

  sections.forEach((sec) => observer.observe(sec));

  const initial = sections.find((sec) => {
    const r = sec.getBoundingClientRect();
    return r.top < window.innerHeight * 0.45 && r.bottom > window.innerHeight * 0.45;
  });

  setActiveById((initial || sections[0]).id);
}

loadProgress().catch((err) => console.error(err));
setupActiveNav();
