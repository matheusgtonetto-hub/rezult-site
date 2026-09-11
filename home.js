/* ============================================================
   Rezult CRM Site — interactions
   ============================================================ */

// ---- Nav scroll state ----
// A barra é fixa e fica sempre visível. O scroll só liga a classe .scrolled;
// não existe mais o recolhe-ao-descer, e com ele saiu o lastScrollY, que servia
// apenas para descobrir a direção do movimento.
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
// A classe no body serve só ao CSS: com o menu aberto a navbar sai do estado
// flutuante e volta a colar no topo, e esse seletor precisa de um ancestral
// comum, porque o painel vem depois da nav no DOM.
function alternarMenu(aberto) {
  mobileMenu.classList.toggle("open", aberto);
  document.body.classList.toggle("menu-aberto", aberto);
}
if (burger) {
  burger.addEventListener("click", () => alternarMenu(!mobileMenu.classList.contains("open")));
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => alternarMenu(false)));
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
    { nm: "Hotmart", img: "logos/hotmart-logo.svg", c: "#FF4000" },
    { nm: "Hubla", img: "logos/hubla-site.svg", c: "#0D0D0D" },
    { nm: "Kiwify", img: "logos/kiwify-logo.webp", c: "#00C47A" },
  ];
  const itemHTML = (t) => {
    const icoStyle = t.img ? "" : ` style="background:${t.bg}"`;
    const icoContent = t.img
      ? `<img src="${t.img}" alt="${t.nm}" />`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="${t.c}" stroke-width="1.8">${t.svg}</svg>`;
    // Sem o nome escrito ao lado, o logo passa a ser a única identificação:
    // aria-label devolve esse nome para leitor de tela e para o img sem alt.
    return `<div class="mq-item"><span class="ico" role="img" aria-label="${t.nm}"${icoStyle}>${icoContent}</span></div>`;
  };
  // Estático: uma faixa só, cada ferramenta aparecendo uma vez. As duas faixas
  // que rolavam em sentidos opostos precisavam da lista duplicada para o loop
  // não mostrar buraco; paradas, a duplicata viraria logo repetido na tela.
  const track = document.createElement("div");
  track.className = "marquee-track";
  track.innerHTML = tools.map(itemHTML).join("");
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
        // Risca a MENSALIDADE cheia, não o total do ciclo. As duas linhas ficam
        // na mesma unidade (R$ 237 riscado, R$ 202/mês abaixo) e a comparação
        // se lê sem conta nenhuma. O total do ciclo continua na linha de
        // cobrança logo abaixo, onde há espaço para dizer o que ele é.
        // Mesmo critério do OfertaDeContratacao do app.
        savingsEl.innerHTML = `<s>${brl(m)}</s> Economize ${brl(savings)}`;
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

// ---- Hero mockup scroll rotation ----
(function () {
  const img = document.querySelector('.hero-mockup-img');
  if (!img || window.innerWidth > 768) return;

  const scrollRange = 500;
  let ticking = false;

  function update() {
    if (window.innerWidth > 768) { img.style.transform = ''; return; }
    const startAngle = -35;
    const progress = Math.min(window.scrollY / scrollRange, 1);
    const eased = 1 - Math.pow(1 - progress, 2);
    const angle = startAngle * (1 - eased);
    img.style.transform = `perspective(1400px) rotateX(${angle}deg)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
})();

// ---- Abas dos agentes de IA ----
(function () {
  const abas = Array.from(document.querySelectorAll(".ag-abas .ag-aba"));
  if (!abas.length) return;
  const paineis = abas.map(a => document.getElementById(a.getAttribute("aria-controls")));

  function mostrar(indice, focar) {
    abas.forEach((aba, i) => {
      const ativa = i === indice;
      aba.classList.toggle("ativa", ativa);
      aba.setAttribute("aria-selected", ativa ? "true" : "false");
      // Só a aba ativa fica na ordem de tabulação: dentro de um tablist quem
      // navega entre as abas são as setas, não o Tab. O Tab sai do grupo.
      aba.tabIndex = ativa ? 0 : -1;
      paineis[i].hidden = !ativa;
      paineis[i].classList.toggle("ativo", ativa);
    });
    if (focar) abas[indice].focus();
  }

  abas.forEach((aba, i) => {
    aba.addEventListener("click", () => mostrar(i, false));
    aba.addEventListener("keydown", e => {
      const passo = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (passo) {
        e.preventDefault();
        mostrar((i + passo + abas.length) % abas.length, true);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        mostrar(e.key === "Home" ? 0 : abas.length - 1, true);
      }
    });
  });
})();

// ---- Esteira de cases (hero) ----
// Anda sozinha para a esquerda e para enquanto o usuário está em cima dela,
// igual à esteira de depoimentos (que faz o mesmo por CSS, com :hover). Aqui
// precisa ser em JS porque o avanço é feito em scrollLeft, não em animação.
//
// Não respeita prefers-reduced-motion, por decisão de produto: era essa regra
// que deixava as faixas estáticas em máquina com "Reduzir movimento" ligado.
(function () {
  const esteira = document.querySelector(".hero-cases");
  const linha = esteira && esteira.querySelector(".cases-linha");
  if (!esteira || !linha) return;
  const pontos = Array.from(document.querySelectorAll(".cases-ponto"));

  const CONJUNTOS = 3;    // precisa bater com o HTML gerado
  const VELOCIDADE = 43;  // px por segundo
  // Só depois do toque, para a inércia do dedo terminar. Sem esta folga o
  // avanço volta a escrever em scrollLeft no meio do deslize e mata o impulso.
  const INERCIA = 600;    // ms

  let inerciaAte = 0;
  let segurando = false;
  let ultimoQuadro = 0;
  let xInicial = 0;
  let scrollInicial = 0;
  let pontoAtual = -1;

  const larguraConjunto = () => linha.scrollWidth / CONJUNTOS;
  // Medido do DOM em vez de constante: no celular o card e a margem mudam.
  const larguraCard = () => {
    const [a, b] = linha.children;
    return b ? b.offsetLeft - a.offsetLeft : 320;
  };

  // Começa no conjunto do meio. Partindo de zero o usuário bateria numa parede
  // ao arrastar para a esquerda, porque scrollLeft não fica negativo.
  esteira.scrollLeft = larguraConjunto();

  // O conteúdo se repete a cada conjunto, então somar ou subtrair um conjunto
  // recoloca o scroll no card equivalente sem que nada mude na tela.
  function normalizar() {
    const c = larguraConjunto();
    if (c <= 0) return;
    if (esteira.scrollLeft > c * 1.5) esteira.scrollLeft -= c;
    else if (esteira.scrollLeft < c * 0.5) esteira.scrollLeft += c;
  }

  function marcarPonto() {
    if (!pontos.length) return;
    const i = Math.round(esteira.scrollLeft / larguraCard()) % pontos.length;
    if (i === pontoAtual) return;
    pontoAtual = i;
    pontos.forEach((p, n) => {
      p.classList.toggle("ativo", n === i);
      if (n === i) p.setAttribute("aria-current", "true");
      else p.removeAttribute("aria-current");
    });
  }

  function quadro(agora) {
    const dt = ultimoQuadro ? (agora - ultimoQuadro) / 1000 : 0;
    ultimoQuadro = agora;
    const emGesto = segurando || agora <= inerciaAte;
    // O reposicionamento que fecha o ciclo nunca roda durante um gesto: mexer
    // em scrollLeft no meio dele cancela a inércia e trava a rolagem.
    if (!emGesto) normalizar();
    if (!emGesto) {
      // dt acima de 0.1s é a aba voltando do segundo plano: sem o corte a
      // esteira daria um salto proporcional ao tempo em que ficou escondida.
      if (dt > 0 && dt < 0.1) esteira.scrollLeft += VELOCIDADE * dt;
    }
    marcarPonto();
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);

  // Sem pausa no hover, ao contrario do :hover dos depoimentos: a esteira e
  // decorativa e deve andar sempre. Passar o mouse por cima nao e intencao de
  // parar, e quem so atravessa a tela com o cursor via a faixa congelar sem
  // ter pedido nada.

  // Dedo encostado na tela: cede o controle até soltar, mais a folga de inércia.
  const soltarDedo = () => { segurando = false; inerciaAte = performance.now() + INERCIA; };
  esteira.addEventListener("touchstart", () => { segurando = true; }, { passive: true });
  esteira.addEventListener("touchend", soltarDedo, { passive: true });
  esteira.addEventListener("touchcancel", soltarDedo, { passive: true });
  // Trackpad e roda horizontal também são gesto: mesma folga de inércia.
  esteira.addEventListener("wheel", () => { inerciaAte = performance.now() + INERCIA; }, { passive: true });

  // Arrasto com o mouse. Dedo e trackpad já rolam nativamente; isto é para quem
  // usa mouse de roda, que sozinho não rola na horizontal.
  esteira.addEventListener("pointerdown", e => {
    if (e.pointerType === "touch") return;
    segurando = true;
    xInicial = e.clientX;
    scrollInicial = esteira.scrollLeft;
    esteira.classList.add("arrastando");
    esteira.setPointerCapture(e.pointerId);
  });
  esteira.addEventListener("pointermove", e => {
    if (!segurando || e.pointerType === "touch") return;
    esteira.scrollLeft = scrollInicial - (e.clientX - xInicial);
  });
  function soltar(e) {
    if (!segurando) return;
    segurando = false;
    esteira.classList.remove("arrastando");
    if (e.pointerId != null && esteira.hasPointerCapture(e.pointerId)) {
      esteira.releasePointerCapture(e.pointerId);
    }
  }
  esteira.addEventListener("pointerup", soltar);
  esteira.addEventListener("pointercancel", soltar);
  // A imagem do card é arrastável por padrão e sequestraria o gesto.
  esteira.addEventListener("dragstart", e => e.preventDefault());

  pontos.forEach((ponto, i) => {
    ponto.addEventListener("click", () => {
      esteira.scrollLeft = larguraConjunto() + i * larguraCard();
    });
  });
})();
