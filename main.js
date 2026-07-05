/* ============================================================
   Rezult CRM Site — interactions
   ============================================================ */

// ---- Nav scroll state ----
const nav = document.getElementById("nav");
function onScroll() {
  if (window.scrollY > 12) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---- Mobile menu ----
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
if (burger) {
  burger.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));
}

// ---- Scroll reveal ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---- Integrations marquee ----
(function () {
  const mq = document.getElementById("intgMarquee");
  if (!mq) return;
  const tools = [
    { nm: "WhatsApp", img: "logos/whatsapp.svg", c: "#25D366" },
    { nm: "Instagram", img: "logos/instagram.svg", c: "#E1306C" },
    { nm: "Meta", img: "logos/meta.svg", c: "#0081FB" },
    { nm: "Meet", bg: "rgba(0,172,71,0.15)", c: "#00AC47", svg: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3" stroke-linejoin="round"/>' },
    { nm: "Google Calendário", img: "logos/google-calendar.svg", c: "#4285F4" },
    { nm: "Webhook", bg: "rgba(168,85,247,0.15)", c: "#A855F7", svg: '<circle cx="12" cy="7" r="3"/><path d="M9 9l-3 6m6-6 3 6M7 17h10" stroke-linecap="round" stroke-linejoin="round"/>' },
  ];
  const itemHTML = (t) => {
    const icoStyle = t.img ? "" : ` style="background:${t.bg}"`;
    const icoContent = t.img
      ? `<img src="${t.img}" alt="${t.nm}" />`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="${t.c}" stroke-width="1.8">${t.svg}</svg>`;
    return `<div class="mq-item" style="--accent:${t.c}"><span class="ico"${icoStyle}>${icoContent}</span><span class="nm">${t.nm}</span></div>`;
  };
  const seq = tools.concat(tools);
  const track = document.createElement("div");
  track.className = "marquee-track";
  track.innerHTML = seq.map(itemHTML).join("");
  mq.appendChild(track);
})();

// ---- Benefits carousel ----
(function () {
  const track = document.getElementById("benTrack");
  if (!track) return;
  const cards = Array.from(track.children);
  const dotsWrap = document.getElementById("benDots");
  const prev = document.getElementById("benPrev");
  const next = document.getElementById("benNext");
  let index = 0;
  let timer = null;

  function perView() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  }
  function maxIndex() { return Math.max(0, cards.length - perView()); }

  function buildDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i++) {
      const d = document.createElement("span");
      d.className = "carousel-dot" + (i === index ? " active" : "");
      d.addEventListener("click", () => { go(i); reset(); });
      dotsWrap.appendChild(d);
    }
  }
  function go(i) {
    index = Math.max(0, Math.min(i, maxIndex()));
    const card = cards[0];
    const gap = 20;
    const step = card.getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-index * step}px)`;
    dotsWrap.querySelectorAll(".carousel-dot").forEach((d, di) => d.classList.toggle("active", di === index));
  }
  function nextSlide() { index = index >= maxIndex() ? 0 : index + 1; go(index); }
  function prevSlide() { index = index <= 0 ? maxIndex() : index - 1; go(index); }
  function reset() { clearInterval(timer); timer = setInterval(nextSlide, 4000); }

  next.addEventListener("click", () => { nextSlide(); reset(); });
  prev.addEventListener("click", () => { prevSlide(); reset(); });
  window.addEventListener("resize", () => { buildDots(); go(index); });

  // ---- Drag to slide ----
  let dragging = false, startX = 0, startOffset = 0, dragDelta = 0;

  function currentOffset() {
    const gap = 20;
    const step = cards[0].getBoundingClientRect().width + gap;
    return -index * step;
  }

  track.addEventListener("pointerdown", (e) => {
    dragging = true; dragDelta = 0;
    startX = e.clientX;
    startOffset = currentOffset();
    track.classList.add("dragging");
    track.setPointerCapture(e.pointerId);
    clearInterval(timer);
  });
  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dragDelta = e.clientX - startX;
    track.style.transform = `translateX(${startOffset + dragDelta}px)`;
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("dragging");
    const threshold = 60;
    if (dragDelta <= -threshold) nextSlide();
    else if (dragDelta >= threshold) prevSlide();
    else go(index);
    reset();
  }
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  buildDots(); go(0); reset();
  track.closest(".carousel").addEventListener("mouseenter", () => clearInterval(timer));
  track.closest(".carousel").addEventListener("mouseleave", reset);
})();

// ---- Pricing toggle ----
function brl(n) {
  return "R$ " + n.toLocaleString("pt-BR") + ",00";
}
function wirePricingToggle(toggleId) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;
  toggle.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const period = btn.dataset.period;
      toggle.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
      document.querySelectorAll(".amt").forEach(amt => {
        const val = period === "anual" ? amt.dataset.a : period === "semestral" ? amt.dataset.s : amt.dataset.m;
        if (val) animateNumber(amt, parseInt(amt.textContent.replace(/\D/g, "")) || 0, parseInt(val));
      });
      document.querySelectorAll(".pprice .pperiod").forEach(tag => {
        tag.textContent = period === "anual" ? "Anual" : period === "semestral" ? "Semestral" : "Mensal";
      });
      document.querySelectorAll(".pprice").forEach(pp => {
        const savingsEl = pp.previousElementSibling;
        const recurringEl = pp.nextElementSibling;
        if (!savingsEl || !savingsEl.classList.contains("pprice-savings")) return;
        if (!recurringEl || !recurringEl.classList.contains("pprice-recurring")) return;
        const m = parseInt(pp.dataset.m);
        if (period === "mensal") {
          savingsEl.innerHTML = "";
          recurringEl.textContent = "Cobrança mensal recorrente";
          return;
        }
        const months = period === "anual" ? 12 : 6;
        const total = parseInt(period === "anual" ? pp.dataset.atotal : pp.dataset.stotal);
        const savings = m * months - total;
        const fullPrice = m * months;
        savingsEl.innerHTML = `<s>${brl(fullPrice)}</s> Economize ${brl(savings)}`;
        recurringEl.textContent = `Cobrança ${period} de ${brl(total)}`;
      });
    });
  });
}
function animateNumber(el, from, to) {
  const dur = 350, start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
wirePricingToggle("priceTogglePreview");
wirePricingToggle("priceToggle");


// ---- Metrics counter animation ----
(function () {
  const metrics = document.querySelector(".metrics");
  if (!metrics) return;

  function parseValue(str) {
    const num = parseFloat(str.replace(/[^0-9.]/g, ""));
    const prefix = /^[+-]/.test(str) ? str[0] : "";
    const suffix = str.replace(/^[+-]?[0-9.]+/, "");
    return { num, prefix, suffix };
  }

  function animateCounter(el, from, to, prefix, suffix) {
    const dur = 1400, start = performance.now();
    const isFloat = !Number.isInteger(to);
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = from + (to - from) * eased;
      el.textContent = prefix + (isFloat ? cur.toFixed(1) : Math.round(cur)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.querySelectorAll(".v").forEach(el => {
        const { num, prefix, suffix } = parseValue(el.textContent.trim());
        animateCounter(el, 0, num, prefix, suffix);
      });
    });
  }, { threshold: 0.4 });

  io.observe(metrics);
})();

// ---- Entregáveis timeline — scroll-driven animation (reversível) ----
(function () {
  const items = document.querySelectorAll("#entregaveis .tl-item");
  if (!items.length) return;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function map(v, inA, inB) { return clamp01((v - inA) / (inB - inA)); }

  function tick() {
    const vh = window.innerHeight;
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const num  = item.querySelector(".tl-num");
      const fill = item.querySelector(".tl-line-fill");

      // Número ilumina conforme o item chega ao meio da tela (top: vh*0.7 → vh*0.5)
      const nP = map(rect.top, vh * 0.7, vh * 0.5);
      if (num) {
        num.style.transition = "none";
        num.style.color = `rgba(0, 229, 153, ${0.3 + 0.7 * nP})`;
        num.style.transform = `scale(${0.92 + 0.08 * nP})`;
      }

      // Linha preenche enquanto o item percorre a metade inferior da tela
      if (fill) {
        const lP = map(rect.top, vh * 0.5, -(item.offsetHeight * 0.5));
        fill.style.transition = "none";
        fill.style.height = (lP * 100) + "%";
      }
    });
  }

  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
  tick();
})();

// ---- FAQ accordion ----
document.querySelectorAll(".faq-item").forEach(item => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  q.addEventListener("click", () => {
    const open = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach(i => {
      i.classList.remove("open");
      i.querySelector(".faq-a").style.maxHeight = null;
    });
    if (!open) {
      item.classList.add("open");
      a.style.maxHeight = a.scrollHeight + "px";
    }
  });
});
