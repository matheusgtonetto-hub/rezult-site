/* ============================================================
   Rezult CRM Site — mockups (injected HTML, brand-styled)
   ============================================================ */

const MK = {};

// ---- Pipeline dashboard (hero + demo) ----
MK.dashboard = `
<div class="mockup">
  <div class="mockup-glow"></div>
  <div class="mockup-bar">
    <span class="mockup-dot" style="background:#FF5F57"></span>
    <span class="mockup-dot" style="background:#FEBC2E"></span>
    <span class="mockup-dot" style="background:#28C840"></span>
    <span class="addr">app.rezult.com.br/pipeline</span>
  </div>
  <div class="mockup-body">
    <div class="mk-rail">
      <div class="mk-logo">RZ</div>
      <div class="mk-nav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg></div>
      <div class="mk-nav on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6h16M4 12h12M4 18h8" stroke-linecap="round"/></svg></div>
      <div class="mk-nav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg></div>
      <div class="mk-nav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="6" width="14" height="12" rx="3"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg></div>
      <div class="mk-nav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 19l1.4-3.5A7 7 0 1 1 9 18.5L5 19z" stroke-linejoin="round"/></svg></div>
    </div>
    <div class="mk-main">
      <div class="mk-head">
        <div><div class="mk-title">Pipeline Comercial</div><div class="mk-sub">Rezult CRM · 11 negócios</div></div>
        <div class="mk-btn">+ Novo lead</div>
      </div>
      <div class="mk-kpis">
        <div class="mk-kpi"><div class="l">Negócios</div><div class="v">R$ 84.2k</div><div class="d">+18%</div></div>
        <div class="mk-kpi"><div class="l">Fechamento</div><div class="v">32%</div><div class="d">+4pp</div></div>
        <div class="mk-kpi"><div class="l">ROAS</div><div class="v">3.42x</div><div class="d">+0.6x</div></div>
      </div>
      <div class="mk-board">
        <div class="mk-col">
          <div class="mk-col-h"><span class="dot" style="background:#3B82F6"></span><span class="n">Novos Leads</span></div>
          ${card("Diego Ramos","#3B82F6","R$ 12.000")}
          ${card("Patricia M.","#3B82F6","R$ 4.800")}
        </div>
        <div class="mk-col">
          <div class="mk-col-h"><span class="dot" style="background:#00B873"></span><span class="n">Qualificação</span></div>
          ${card("Felipe Costa","#00B873","R$ 21.000")}
          ${card("Marina Souza","#00B873","R$ 9.200")}
        </div>
        <div class="mk-col">
          <div class="mk-col-h"><span class="dot" style="background:#22C55E"></span><span class="n">Ganhos</span></div>
          ${card("Joana Reis","#22C55E","R$ 6.700")}
        </div>
      </div>
    </div>
  </div>
</div>`;

function card(name, color, val) {
  const init = name.split(" ").map(w => w[0]).join("").slice(0,2);
  return `<div class="mk-card">
    <div class="row1"><span class="mk-av" style="background:${color}">${init}</span><span class="nm">${name}</span></div>
    <span class="vl">${val}</span>
  </div>`;
}

// ---- Agent config (feature) ----
MK.agent = `
<div id="agentMock" style="padding:20px 24px;height:340px;overflow:hidden;position:relative;background:radial-gradient(circle at 80% 10%, rgba(0,184,115,0.07), transparent 55%);">
  <div style="display:flex;align-items:center;gap:13px;padding:14px 16px;background:var(--surface-2);border:1px solid var(--border-active);border-radius:14px;margin-bottom:14px;">
    <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#00B873,#00B87A);display:flex;align-items:center;justify-content:center;color:var(--on-primary);font-weight:700;font-size:16px;box-shadow:0 0 20px var(--glow-soft);">S</div>
    <div style="flex:1;"><div style="font-size:14px;font-weight:600;letter-spacing:-0.02em;">Sofia</div><div style="font-size:11px;color:var(--text-muted);">Qualificadora · Tráfego pago</div></div>
    <span style="font-family:var(--mono);font-size:9px;background:rgba(0,184,115,0.14);color:var(--primary);padding:4px 9px;border-radius:100px;letter-spacing:0.04em;"><span id="agentCounter">127</span> resp.</span>
  </div>
  <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.14em;color:var(--primary);text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:6px;"><span style="width:6px;height:6px;border-radius:50%;background:#00B873;display:inline-block;animation:wppDot 1.5s infinite;"></span>Atividade ao vivo</div>
  <div id="agentFeed" style="display:flex;flex-direction:column;gap:7px;"></div>
</div>`;

// ---- Agent live animation ----
function animateAgent() {
  const feedEl = document.getElementById("agentFeed");
  const counterEl = document.getElementById("agentCounter");
  if (!feedEl || !counterEl) return;

  let count = 127;
  let idx = 0;

  const leads = [
    { name: "Felipe Costa",   camp: "Logística PRO",   score: 89, qual: true },
    { name: "Marina Silva",   camp: "Tráfego pago",    score: 74, qual: true },
    { name: "Bruno Lopes",    camp: "Educação Online",  score: 23, qual: false },
    { name: "Patricia Melo",  camp: "Meta · PME",      score: 91, qual: true },
    { name: "Carlos Ramos",   camp: "B2B Indústria",   score: 68, qual: true },
    { name: "Juliana Dias",   camp: "E-commerce",      score: 19, qual: false },
  ];

  function initials(name) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2);
  }

  function processNext() {
    const lead = leads[idx % leads.length];
    idx++;

    const item = document.createElement("div");
    item.style.cssText = "display:flex;align-items:center;gap:10px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;opacity:0;transition:opacity .35s,border-color .4s;";

    const statusEl = document.createElement("div");
    statusEl.style.flexShrink = "0";
    statusEl.innerHTML = `<span style="font-family:var(--mono);font-size:9px;color:var(--text-muted);">analisando...</span>`;

    item.innerHTML = `<div style="width:28px;height:28px;border-radius:50%;background:rgba(0,184,115,0.15);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--primary);flex-shrink:0;">${initials(lead.name)}</div>
      <div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:500;letter-spacing:-0.01em;">${lead.name}</div><div style="font-size:10px;color:var(--text-subtle);">${lead.camp}</div></div>`;
    item.appendChild(statusEl);

    if (feedEl.children.length >= 3) {
      const oldest = feedEl.firstElementChild;
      oldest.style.opacity = "0";
      setTimeout(() => oldest.remove(), 320);
    }

    feedEl.appendChild(item);
    requestAnimationFrame(() => requestAnimationFrame(() => { item.style.opacity = "1"; }));

    setTimeout(() => {
      const color = lead.qual ? "#00B873" : "#EF4444";
      const label = lead.qual ? `✓ qualificado · ${lead.score}` : `✗ descartado · ${lead.score}`;
      statusEl.innerHTML = `<span style="font-family:var(--mono);font-size:9px;background:${color}1a;color:${color};padding:3px 8px;border-radius:100px;white-space:nowrap;">${label}</span>`;
      item.style.borderColor = color + "45";
      if (lead.qual) { count++; counterEl.textContent = count; }
    }, 1400);

    setTimeout(processNext, 2200);
  }

  setTimeout(processNext, 500);
}

// ---- Integrações & API (feature) ----
MK.integrations = `
<div style="height:340px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
  <img src="dados-api.png" alt="APIs e Webhooks Rezult" style="width:100%;height:100%;object-fit:cover;display:block;" />
</div>`;

/* placeholder para manter referência sem animação */
MK.integrations_disabled = `
<div id="intgMock" style="padding:20px 24px;height:340px;overflow:hidden;position:relative;background:radial-gradient(circle at 80% 15%, rgba(0,184,115,0.07), transparent 55%);">
  <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:12px;">
    <div id="intgRow0" style="display:flex;align-items:center;gap:12px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:10px 14px;transition:border-color .3s,box-shadow .3s;">
      <div style="width:30px;height:30px;border-radius:9px;background:#25D36622;display:flex;align-items:center;justify-content:center;color:#25D366;flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 19l1.4-3.5A7 7 0 1 1 9 18.5L5 19z" stroke-linejoin="round"/></svg></div>
      <span style="flex:1;font-size:12px;font-weight:500;letter-spacing:-0.01em;">WhatsApp Business</span>
      <span style="font-family:var(--mono);font-size:9px;background:rgba(0,184,115,0.14);color:var(--primary);padding:3px 8px;border-radius:100px;letter-spacing:0.04em;text-transform:uppercase;">conectado</span>
    </div>
    <div id="intgRow1" style="display:flex;align-items:center;gap:12px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:10px 14px;transition:border-color .3s,box-shadow .3s;">
      <div style="width:30px;height:30px;border-radius:9px;background:#3B82F622;display:flex;align-items:center;justify-content:center;color:#3B82F6;flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12c1-5 4-7 6-7 3 0 5 3 6 6 1-3 3-6 6-6" stroke-linecap="round"/></svg></div>
      <span style="flex:1;font-size:12px;font-weight:500;letter-spacing:-0.01em;">Meta Ads</span>
      <span style="font-family:var(--mono);font-size:9px;background:rgba(0,184,115,0.14);color:var(--primary);padding:3px 8px;border-radius:100px;letter-spacing:0.04em;text-transform:uppercase;">conectado</span>
    </div>
    <div id="intgRow2" style="display:flex;align-items:center;gap:12px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:10px 14px;transition:border-color .3s,box-shadow .3s;">
      <div style="width:30px;height:30px;border-radius:9px;background:#A855F722;display:flex;align-items:center;justify-content:center;color:#A855F7;flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="7" r="3"/><path d="M9 9l-3 6m6-6 3 6M7 17h10" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <span style="flex:1;font-size:12px;font-weight:500;letter-spacing:-0.01em;">Webhook · pedidos</span>
      <span style="font-family:var(--mono);font-size:9px;background:rgba(0,184,115,0.14);color:var(--primary);padding:3px 8px;border-radius:100px;letter-spacing:0.04em;text-transform:uppercase;">ativo</span>
    </div>
  </div>
  <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.14em;color:var(--primary);text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px;"><span style="width:6px;height:6px;border-radius:50%;background:#00B873;display:inline-block;animation:wppDot 1.5s infinite;"></span>API · ao vivo</div>
  <div id="intgCode" style="background:var(--bg-deep);border:1px solid var(--border);border-radius:10px;padding:12px 14px;font-family:var(--mono);font-size:11px;line-height:1.8;min-height:80px;transition:border-color .3s;"></div>
</div>`;

// ---- Integrations animation ----
function animateIntegrations() {
  const codeEl = document.getElementById("intgCode");
  if (!codeEl) return;

  const ROWS = [
    { idx: 0, color: "#25D366" },
    { idx: 1, color: "#3B82F6" },
    { idx: 2, color: "#A855F7" },
  ];

  const calls = [
    { row: 1, lines: [
        `<span style="color:var(--text-subtle);">POST /v1/leads</span>`,
        `<span style="color:var(--text-muted);">{ <span style="color:var(--primary);">"nome"</span>: "Felipe Costa",</span>`,
        `<span style="color:var(--text-muted);">&nbsp;&nbsp;<span style="color:var(--primary);">"origem"</span>: "meta_ads",</span>`,
        `<span style="color:var(--text-muted);">&nbsp;&nbsp;<span style="color:var(--primary);">"valor"</span>: 21000 }</span>`,
      ], resp: "✓ 201 Created · score 94" },
    { row: 0, lines: [
        `<span style="color:var(--text-subtle);">POST /v1/messages</span>`,
        `<span style="color:var(--text-muted);">{ <span style="color:var(--primary);">"to"</span>: "+55119...",</span>`,
        `<span style="color:var(--text-muted);">&nbsp;&nbsp;<span style="color:var(--primary);">"template"</span>: "oi-traf" }</span>`,
      ], resp: "✓ 200 OK · mensagem enviada" },
    { row: 2, lines: [
        `<span style="color:var(--text-subtle);">POST /webhook/pedidos</span>`,
        `<span style="color:var(--text-muted);">{ <span style="color:var(--primary);">"evento"</span>: "pedido_aprovado",</span>`,
        `<span style="color:var(--text-muted);">&nbsp;&nbsp;<span style="color:var(--primary);">"valor"</span>: 4200 }</span>`,
      ], resp: "✓ 200 OK · lead atualizado" },
  ];

  let idx = 0;

  function highlightRow(rowIdx, on) {
    const el = document.getElementById("intgRow" + rowIdx);
    if (!el) return;
    const color = ROWS[rowIdx].color;
    el.style.borderColor = on ? color : "var(--border)";
    el.style.boxShadow = on ? `0 0 14px ${color}30` : "none";
  }

  function runCall() {
    const call = calls[idx % calls.length];
    idx++;

    // Reset all rows
    ROWS.forEach(r => highlightRow(r.idx, false));
    highlightRow(call.row, true);

    // Clear code block
    codeEl.innerHTML = "";
    codeEl.style.borderColor = "var(--border)";

    // Type lines one by one
    let delay = 0;
    call.lines.forEach(line => {
      setTimeout(() => {
        const el = document.createElement("div");
        el.innerHTML = line;
        el.style.cssText = "opacity:0;transition:opacity .25s;";
        codeEl.appendChild(el);
        requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = "1"; }));
      }, delay);
      delay += 280;
    });

    // Show response
    setTimeout(() => {
      const resp = document.createElement("div");
      resp.innerHTML = `<span style="color:#25D366;">${call.resp}</span>`;
      resp.style.cssText = "margin-top:4px;opacity:0;transition:opacity .25s;";
      codeEl.appendChild(resp);
      codeEl.style.borderColor = "#25D36660";
      requestAnimationFrame(() => requestAnimationFrame(() => { resp.style.opacity = "1"; }));
    }, delay + 300);

    // Next call after pause
    setTimeout(() => {
      highlightRow(call.row, false);
      runCall();
    }, delay + 2000);
  }

  setTimeout(runCall, 600);
}

// ---- Dashboards completos (feature) ----
MK.dashboards = `
<div id="dashMock" style="padding:20px 22px;height:340px;overflow:hidden;">
  <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px;">
    <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:10px;overflow:hidden;"><div style="font-family:var(--mono);font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-subtle);">LTV</div><div style="display:flex;align-items:baseline;gap:3px;margin-top:4px;overflow:hidden;"><span id="dashV0" style="font-size:15px;font-weight:600;letter-spacing:-0.03em;white-space:nowrap;">R$ 0</span><span style="font-family:var(--mono);font-size:8px;color:var(--primary);flex-shrink:0;">+12%</span></div></div>
    <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:10px;overflow:hidden;"><div style="font-family:var(--mono);font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-subtle);">CAC</div><div style="display:flex;align-items:baseline;gap:3px;margin-top:4px;overflow:hidden;"><span id="dashV1" style="font-size:15px;font-weight:600;letter-spacing:-0.03em;white-space:nowrap;">R$ 0</span><span style="font-family:var(--mono);font-size:8px;color:var(--primary);flex-shrink:0;">-8%</span></div></div>
    <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:10px;overflow:hidden;"><div style="font-family:var(--mono);font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-subtle);">Conversão</div><div style="display:flex;align-items:baseline;gap:3px;margin-top:4px;overflow:hidden;"><span id="dashV2" style="font-size:15px;font-weight:600;letter-spacing:-0.03em;white-space:nowrap;">0%</span><span style="font-family:var(--mono);font-size:8px;color:var(--primary);flex-shrink:0;">+4pp</span></div></div>
  </div>
  <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:10px;">
    <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-subtle);margin-bottom:10px;">Receita por mês</div>
    <div style="display:flex;align-items:flex-end;gap:6px;height:66px;">
      ${[42,58,51,74,68,89].map((h,i)=>`<div style="flex:1;height:${Math.round(h*66/100)}px;transform:scaleY(0);transform-origin:bottom;transition:transform 1.1s cubic-bezier(0.4,0,0.2,1);background:${i===5?'linear-gradient(180deg,#00B873,#00B87A)':'var(--surface-3)'};border-radius:5px 5px 0 0;${i===5?'box-shadow:0 0 12px var(--glow-soft);':''}" id="dashBar${i}"></div>`).join("")}
    </div>
    <div style="display:flex;gap:6px;margin-top:6px;">
      ${['N','D','J','F','M','A'].map(l=>`<div style="flex:1;text-align:center;font-family:var(--mono);font-size:8px;color:var(--text-subtle);">${l}</div>`).join("")}
    </div>
  </div>
  <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:12px 14px;">
    <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-subtle);margin-bottom:10px;">Conversão por origem</div>
    ${[["Meta Ads",78],["Google",62],["Indicação",91]].map(([l,p],i)=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px;"><span style="font-size:10px;color:var(--text-muted);width:60px;flex-shrink:0;">${l}</span><div style="flex:1;height:7px;background:var(--surface-3);border-radius:100px;overflow:hidden;"><div id="dashHBar${i}" style="width:0%;height:100%;background:linear-gradient(90deg,#00B873,#00B87A);box-shadow:0 0 8px var(--glow-soft);transition:width 1.1s cubic-bezier(0.4,0,0.2,1);"></div></div><span id="dashHVal${i}" style="font-family:var(--mono);font-size:9px;font-weight:600;color:var(--primary);width:24px;text-align:right;">0%</span></div>`).join("")}
  </div>
</div>`;

// ---- Dashboards animation ----
function animateDashboards() {
  const VBARS  = [42,58,51,74,68,89];
  const HBARS  = [78,62,91];
  const KPIS   = [
    { el:"dashV0", target:8.4,  fmt: v => "R$ " + v.toFixed(1) + "k" },
    { el:"dashV1", target:184,  fmt: v => "R$ " + Math.round(v) },
    { el:"dashV2", target:32,   fmt: v => Math.round(v) + "%" },
  ];
  const STEPS = 40, DUR = 1100;

  function counter(id, target, fmt) {
    const el = document.getElementById(id);
    if (!el) return;
    let s = 0;
    const iv = setInterval(() => {
      s++;
      el.textContent = fmt(target * s / STEPS);
      if (s >= STEPS) clearInterval(iv);
    }, DUR / STEPS);
  }

  function run() {
    // Reset bars instantly (no transition)
    for (let i = 0; i < 6; i++) {
      const b = document.getElementById("dashBar" + i);
      if (b) { b.style.transition = "none"; b.style.transform = "scaleY(0)"; }
    }
    for (let i = 0; i < 3; i++) {
      const h = document.getElementById("dashHBar" + i);
      const v = document.getElementById("dashHVal" + i);
      if (h) { h.style.transition = "none"; h.style.width = "0%"; }
      if (v) v.textContent = "0%";
    }
    KPIS.forEach(k => { const el = document.getElementById(k.el); if (el) el.textContent = k.fmt(0); });

    setTimeout(() => {
      // Re-enable transitions and animate
      for (let i = 0; i < 6; i++) {
        const b = document.getElementById("dashBar" + i);
        if (b) { b.style.transition = `transform 1.1s cubic-bezier(0.4,0,0.2,1) ${i * 60}ms`; b.style.transform = "scaleY(1)"; }
      }
      for (let i = 0; i < 3; i++) {
        const h = document.getElementById("dashHBar" + i);
        const v = document.getElementById("dashHVal" + i);
        if (h) { h.style.transition = `width 1.1s cubic-bezier(0.4,0,0.2,1) ${i * 100}ms`; h.style.width = HBARS[i] + "%"; }
        if (v) setTimeout(() => counter("dashHVal" + i, HBARS[i], w => Math.round(w) + "%"), i * 100);
      }
      KPIS.forEach((k, i) => setTimeout(() => counter(k.el, k.target, k.fmt), i * 80));
    }, 150);

    setTimeout(run, 2000);
  }

  run();
}

// ---- Inject ----
function injectMockups() {
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  ["mockupSlotB", "mockupSlotC"].forEach(id => set(id, MK.dashboard));
  // #featWhatsapp, #featAutomation e #featPipelines saíram daqui: quem os
  // preenche agora são as ilhas React em src/paineis/, montadas por
  // build/paineis.js.
  set("featAgent", MK.agent);
  animateAgent();
  set("featIntegrations", MK.integrations);
  set("featDashboards", MK.dashboards);
  animateDashboards();
  set("demoShowcase", MK.dashboard);
}
if (document.readyState !== "loading") injectMockups();
else document.addEventListener("DOMContentLoaded", injectMockups);
