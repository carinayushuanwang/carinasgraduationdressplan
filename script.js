async function loadProgress() {
  const res = await fetch("data.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load data.json");
  const data = await res.json();

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

function setupZelleCopy() {
  const btn = document.getElementById("copy-zelle");
  const note = document.getElementById("zelle-note");
  const text = document.getElementById("zelle-text");

  if (!btn || !note || !text) return;

  btn.addEventListener("click", async () => {
    const value = text.textContent.trim();
    if (!value || value === "YOUR ZELLE EMAIL OR PHONE") {
      alert("Add your Zelle email or phone in index.html first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      note.classList.remove("micro-text--hidden");
      setTimeout(() => note.classList.add("micro-text--hidden"), 2200);
    } catch {
      alert("Copy failed. You can manually select and copy the Zelle recipient text.");
    }
  });
}

loadProgress().catch(console.error);
setupZelleCopy();
