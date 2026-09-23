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

// ---- Comparação CRM passivo x ativo ----
// A entrada dos cartões usa o reveal acima; a inclinação responde apenas a
// mouse/trackpad e é desativada quando a pessoa prefere menos movimento.
const tiltPermitido = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
document.querySelectorAll("#passivo-ativo .vs-card").forEach(card => {
  let frame = 0;
  card.addEventListener("pointermove", event => {
    if (!tiltPermitido.matches) return;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty("--vs-tilt-x", `${(-y * 7).toFixed(2)}deg`);
      card.style.setProperty("--vs-tilt-y", `${(x * 7).toFixed(2)}deg`);
      frame = 0;
    });
  });
  card.addEventListener("pointerleave", () => {
    if (frame) cancelAnimationFrame(frame);
    card.style.removeProperty("--vs-tilt-x");
    card.style.removeProperty("--vs-tilt-y");
    frame = 0;
  });
});

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
      document.querySelectorAll(".price-toggle").forEach(group => {
        group.querySelectorAll("button").forEach(b => {
          b.classList.toggle("active", b.dataset.period === period);
        });
      });
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
wirePricingToggle("priceToggleFinal");
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

  // Cenas ilustrativas, uma por agente. O texto é inserido com textContent;
  // o desenho e a estrutura são os mesmos em todas as abas.
  const cenas = [
    { agente: "Atendente", mensagens: ["Oi! Cheguei pelo anúncio. Ainda atendem?", "Atendemos sim. Como posso ajudar?", "Quero agendar uma demonstração."], resultado: "Conversa registrada no CRM", detalhe: "Primeiro atendimento iniciado" },
    { agente: "SDR", mensagens: ["Temos 12 vendedores e muitos leads por semana.", "Entendi. Qual é a maior dificuldade do time hoje?", "Responder rápido e saber quem está pronto."], resultado: "Lead qualificado e sinalizado", detalhe: "Próximo passo organizado" },
    { agente: "Closer", mensagens: ["Gostei, mas preciso entender o investimento.", "Claro. Posso enviar a proposta para sua equipe?", "Pode mandar, vamos analisar."], resultado: "Proposta enviada e etapa atualizada", detalhe: "Negociação acompanhada" },
    { agente: "Pós-venda", mensagens: ["Como foi sua primeira semana com o Rezult?", "Boa! Só tenho uma dúvida sobre o funil.", "Vou chamar o time com o contexto da conversa."], autores: ["ia", "lead", "ia"], resultado: "Suporte acionado com histórico", detalhe: "Cliente acompanhado" },
    { agente: "Conversa do time", status: "Registro automático", mensagens: ["Quero falar do plano para 12 pessoas.", "Claro. Podemos conversar amanhã às 10h?", "Pode sim."], resultado: "Contato e funil atualizados", detalhe: "Sem preenchimento manual" },
  ];
  const robo = `<svg viewBox="0 0 180 210" fill="none" aria-hidden="true"><path d="M90 37V22" stroke="#047857" stroke-width="7" stroke-linecap="round"/><circle cx="90" cy="15" r="10" fill="#00B873"/><path d="M38 156c-19 7-22 24-13 30 9 6 22-5 31-18" fill="#E8F8EF" stroke="#CBE9D8" stroke-width="2"/><path d="M142 156c19 7 22 24 13 30-9 6-22-5-31-18" fill="#E8F8EF" stroke="#CBE9D8" stroke-width="2"/><ellipse cx="90" cy="159" rx="51" ry="39" fill="white" stroke="#CBE9D8" stroke-width="2"/><ellipse cx="90" cy="151" rx="25" ry="6" fill="#00B873" opacity=".75"/><rect x="20" y="38" width="140" height="112" rx="56" fill="white" stroke="#CBE9D8" stroke-width="2"/><rect x="34" y="53" width="112" height="80" rx="37" fill="#102820"/><path d="M53 92c6-12 16-12 22 0m30 0c6-12 16-12 22 0" stroke="#B9F1D4" stroke-width="5" stroke-linecap="round"/><path d="M79 108c7 7 15 7 22 0" stroke="#B9F1D4" stroke-width="4" stroke-linecap="round"/></svg>`;

  paineis.forEach((painel, i) => {
    const cena = cenas[i];
    const visual = document.createElement("div");
    visual.className = "ag-demo";
    visual.setAttribute("aria-hidden", "true");
    visual.innerHTML = `<span class="ag-demo-label">Simulação ilustrativa</span><div class="ag-chat"><div class="ag-chat-head"><span class="ag-chat-mark">R</span><span><strong>Rezult · <span class="ag-chat-role"></span></strong><small>Online agora</small></span></div><div class="ag-chat-bubbles"><p class="ag-bolha ag-bolha--lead"></p><p class="ag-bolha ag-bolha--ia"></p><p class="ag-bolha ag-bolha--lead"></p></div><div class="ag-chat-result"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12l5 5L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span></div></div><div class="ag-bot">${robo}</div><div class="ag-demo-note"><strong></strong><span></span></div>`;
    visual.querySelector(".ag-chat-role").textContent = cena.agente;
    if (cena.status) visual.querySelector(".ag-chat-head small").textContent = cena.status;
    visual.querySelectorAll(".ag-bolha").forEach((bolha, n) => {
      bolha.textContent = cena.mensagens[n];
      if (cena.autores) {
        bolha.classList.toggle("ag-bolha--lead", cena.autores[n] === "lead");
        bolha.classList.toggle("ag-bolha--ia", cena.autores[n] === "ia");
      }
    });
    visual.querySelector(".ag-chat-result span").textContent = cena.resultado;
    visual.querySelector(".ag-demo-note strong").textContent = cena.detalhe;
    visual.querySelector(".ag-demo-note span").textContent = "Atualizado no CRM";
    painel.append(visual);
  });

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
    // Limita o intervalo em vez de descartar o quadro inteiro. O teste antigo
    // `dt < 0.1` congelava a faixa quando o navegador caía para 10 fps ou
    // menos, porque todos os quadros passavam a ser ignorados. O limite evita
    // saltos ao voltar de outra aba e mantém o avanço em dispositivos lentos.
    const dt = ultimoQuadro ? Math.min((agora - ultimoQuadro) / 1000, 0.1) : 0;
    ultimoQuadro = agora;
    const emGesto = segurando || agora <= inerciaAte;
    // O reposicionamento que fecha o ciclo nunca roda durante um gesto: mexer
    // em scrollLeft no meio dele cancela a inércia e trava a rolagem.
    if (!emGesto) normalizar();
    if (!emGesto && !document.hidden && dt > 0) {
      esteira.scrollLeft += VELOCIDADE * dt;
    }
    marcarPonto();
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);

  // Ao restaurar a aba ou a página pelo cache de navegação, descarta o tempo
  // em segundo plano e libera qualquer gesto que tenha ficado sem pointerup.
  function retomarMovimento() {
    ultimoQuadro = performance.now();
    segurando = false;
    inerciaAte = 0;
    esteira.classList.remove("arrastando");
    normalizar();
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) retomarMovimento();
  });
  window.addEventListener("pageshow", retomarMovimento);
  window.addEventListener("blur", () => {
    segurando = false;
    esteira.classList.remove("arrastando");
  });

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
  esteira.addEventListener("lostpointercapture", () => {
    segurando = false;
    inerciaAte = performance.now() + INERCIA;
    esteira.classList.remove("arrastando");
  });
  // A imagem do card é arrastável por padrão e sequestraria o gesto.
  esteira.addEventListener("dragstart", e => e.preventDefault());

  pontos.forEach((ponto, i) => {
    ponto.addEventListener("click", () => {
      esteira.scrollLeft = larguraConjunto() + i * larguraCard();
    });
  });
})();
