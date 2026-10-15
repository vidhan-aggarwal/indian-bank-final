/* ============================================================
   Loan Calculators — EMI / Car Loan / Gold Loan
   Lazy-loaded when the widget scrolls into view.
   ============================================================ */

(() => {
  const widget = document.querySelector(".widget--calc");
  if (!widget) return;

  const boot = () => {
    if (widget.dataset.ready) return;
    widget.dataset.ready = "1";

    const CALCS = {
      emi: {
        title: "EMI Calculator",
        emoji: "🧮",
        rate: 10.5,
        amountLabel: "Loan Amount",
        ltv: null,
      },
      car: {
        title: "Car Loan Calculator",
        emoji: "🚗",
        rate: 8.8,
        amountLabel: "Car Loan Amount",
        ltv: null,
      },
      gold: {
        title: "Gold Loan Calculator",
        emoji: "🪙",
        rate: 9.25,
        amountLabel: "Gold Value",
        ltv: 0.75,
      },
    };

    const el = (id) => document.getElementById(id);
    const tabs = document.querySelectorAll(".calc-tab");
    const chips = document.querySelectorAll(".calc-chips .chip");
    const slider = el("amount");
    const customBox = el("calc-custom");
    const customMonths = el("custom-months");
    if (!slider) return;

    let activeCalc = "emi";
    let months = 6;

    const formatINR = (n) => "₹ " + Math.round(n).toLocaleString("en-IN");
    const trim = (x) => (Math.round(x * 100) / 100).toString();
    const amountWords = (n) => {
      if (n >= 1e7) return trim(n / 1e7) + " Crore";
      if (n >= 1e5) return trim(n / 1e5) + " Lakh";
      return trim(n / 1e3) + " Thousand";
    };

    const getMonths = () => {
      if (months !== "custom") return months;
      const m = parseInt(customMonths.value, 10);
      return Number.isFinite(m) ? Math.min(Math.max(m, 3), 360) : 12;
    };

    const calculate = () => {
      const cfg = CALCS[activeCalc];
      const amount = Number(slider.value);
      const n = getMonths();
      const principal = cfg.ltv ? amount * cfg.ltv : amount;
      const r = cfg.rate / 12 / 100;
      const factor = Math.pow(1 + r, n);
      const emi = (principal * r * factor) / (factor - 1);
      const total = emi * n;

      el("calc-amount-val").textContent = formatINR(amount);
      el("calc-amount-words").textContent = amountWords(amount);
      el("res-emi").textContent = formatINR(emi);
      el("res-interest").textContent = formatINR(total - principal);
      el("res-total").textContent = formatINR(total);
      el("res-eligible-box").hidden = !cfg.ltv;
      if (cfg.ltv) el("res-eligible").textContent = formatINR(principal);
    };

    const setCalc = (key) => {
      activeCalc = key;
      const cfg = CALCS[key];
      tabs.forEach((t) =>
        t.classList.toggle("calc-tab--active", t.dataset.calc === key)
      );
      el("calc-title").textContent = cfg.title;
      el("calc-emoji").textContent = cfg.emoji;
      el("calc-rate").textContent = cfg.rate.toFixed(2) + "% p.a.";
      el("calc-amount-label").textContent = cfg.amountLabel;
      el("calc-note").hidden = !cfg.ltv;
      calculate();
    };

    tabs.forEach((tab) =>
      tab.addEventListener("click", () => setCalc(tab.dataset.calc), {
        passive: true,
      })
    );

    chips.forEach((chip) =>
      chip.addEventListener(
        "click",
        () => {
          chips.forEach((c) => c.classList.remove("chip--active"));
          chip.classList.add("chip--active");
          const v = chip.dataset.months;
          months = v === "custom" ? "custom" : parseInt(v, 10);
          customBox.hidden = months !== "custom";
          calculate();
        },
        { passive: true }
      )
    );

    slider.addEventListener("input", () => {
      if (slider._raf) cancelAnimationFrame(slider._raf);
      slider._raf = requestAnimationFrame(calculate);
    });
    customMonths.addEventListener("input", () => {
      if (customMonths._raf) cancelAnimationFrame(customMonths._raf);
      customMonths._raf = requestAnimationFrame(calculate);
    });

    setCalc("emi");
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          boot();
          io.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(widget);
  } else {
    boot();
  }
})();
