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
          <div class="mk-col-h"><span class="dot" style="background:#00E599"></span><span class="n">Qualificação</span></div>
          ${card("Felipe Costa","#00E599","R$ 21.000")}
          ${card("Marina Souza","#00E599","R$ 9.200")}
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

// ---- Automation flow (feature) ----
MK.automation = `
<div style="padding:28px;min-height:340px;position:relative;background:radial-gradient(circle at 20% 20%, rgba(0,229,153,0.06), transparent 60%);">
  <div style="position:absolute;inset:0;background-image:radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);background-size:20px 20px;opacity:0.5;"></div>
  <div style="position:relative;display:flex;flex-direction:column;gap:14px;">
    ${flowNode("#00E599","GATILHO","Lead Ad · Meta Ads","Campanha 'Logística PRO'", '<path d="M3 12c1-5 4-7 6-7 3 0 5 3 6 6 1-3 3-6 6-6" stroke-linecap="round"/>')}
    ${flowConnector()}
    ${flowNode("#F59E0B","CONDIÇÃO","Se score > 60","Qualificação por IA", '<path d="M3 6h18l-7 8v6l-4-2v-4L3 6z" stroke-linejoin="round"/>')}
    ${flowConnector()}
    ${flowNode("#3B82F6","AÇÃO","Sofia inicia conversa","WhatsApp · template oi-traf", '<rect x="5" y="6" width="14" height="12" rx="3"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/>')}
  </div>
</div>`;

function flowNode(color, kind, title, sub, icon) {
  return `<div style="display:flex;align-items:center;gap:12px;background:var(--surface-2);border:1px solid ${color}40;border-radius:12px;padding:13px 16px;box-shadow:0 0 20px ${color}18;">
    <div style="width:34px;height:34px;border-radius:9px;background:${color}22;display:flex;align-items:center;justify-content:center;color:${color};flex-shrink:0;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${icon}</svg></div>
    <div style="flex:1;min-width:0;"><div style="font-family:var(--mono);font-size:9px;letter-spacing:0.14em;color:${color};text-transform:uppercase;">${kind}</div><div style="font-size:13px;font-weight:500;margin-top:2px;letter-spacing:-0.01em;">${title}</div><div style="font-size:11px;color:var(--text-subtle);">${sub}</div></div>
  </div>`;
}
function flowConnector() {
  return `<div style="display:flex;justify-content:center;color:var(--text-subtle);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.6"><path d="M12 5v14M6 13l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
}

// ---- WhatsApp inbox (feature) ----
MK.whatsapp = `
<div style="padding:0;min-height:340px;display:flex;flex-direction:column;">
  <div style="padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:11px;background:var(--surface-2);">
    <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#00E599,#00B87A);display:flex;align-items:center;justify-content:center;color:var(--on-primary);font-weight:600;font-size:12px;">FC</div>
    <div style="flex:1;"><div style="font-size:13px;font-weight:600;letter-spacing:-0.01em;">Felipe Costa</div><div style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:6px;"><span style="width:6px;height:6px;border-radius:50%;background:#00E599;"></span>online · FC Logística</div></div>
    <span style="font-family:var(--mono);font-size:9px;background:rgba(0,229,153,0.14);color:var(--primary);padding:4px 9px;border-radius:100px;letter-spacing:0.06em;">IA ATIVA</span>
  </div>
  <div style="flex:1;padding:18px;display:flex;flex-direction:column;gap:10px;">
    ${bubble("agent","Oi Felipe! Vi que você baixou nosso material. Posso ajudar com alguma dúvida?","Sofia · IA")}
    ${bubble("lead","Sim! Quero entender a parte de WhatsApp.")}
    ${bubble("agent","A gente centraliza tudo num inbox e o agente IA responde no primeiro contato. Qual o tamanho do seu time?","Sofia · IA")}
    ${bubble("lead","Somos 24, 6 no comercial.")}
    <div style="align-self:center;font-family:var(--mono);font-size:9px;background:rgba(0,229,153,0.12);color:var(--primary);padding:4px 12px;border-radius:100px;text-transform:uppercase;letter-spacing:0.08em;">✦ Score atualizado: 94 · hot lead</div>
  </div>
</div>`;

function bubble(who, text, name) {
  const agent = who === "agent";
  return `<div style="align-self:${agent ? "flex-start" : "flex-end"};max-width:75%;">
    ${name ? `<div style="font-family:var(--mono);font-size:8px;letter-spacing:0.1em;color:var(--primary);text-transform:uppercase;margin-bottom:3px;margin-left:4px;">${name}</div>` : ""}
    <div style="background:${agent ? "var(--surface-2)" : "var(--primary)"};color:${agent ? "var(--text)" : "var(--on-primary)"};border:${agent ? "1px solid var(--border)" : "none"};padding:9px 13px;border-radius:13px;border-top-${agent ? "left" : "right"}-radius:4px;font-size:12.5px;line-height:1.45;">${text}</div>
  </div>`;
}

// ---- Agent config (feature) ----
MK.agent = `
<div style="padding:24px;min-height:340px;position:relative;background:radial-gradient(circle at 80% 10%, rgba(0,229,153,0.07), transparent 55%);">
  <div style="display:flex;align-items:center;gap:13px;padding:16px;background:var(--surface-2);border:1px solid var(--border-active);border-radius:14px;margin-bottom:16px;">
    <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#00E599,#00B87A);display:flex;align-items:center;justify-content:center;color:var(--on-primary);font-weight:700;font-size:18px;box-shadow:0 0 20px var(--glow-soft);">S</div>
    <div style="flex:1;"><div style="font-size:15px;font-weight:600;letter-spacing:-0.02em;">Sofia</div><div style="font-size:12px;color:var(--text-muted);">Qualificadora · Tráfego pago</div></div>
    <span style="font-family:var(--mono);font-size:9px;background:rgba(0,229,153,0.14);color:var(--primary);padding:4px 9px;border-radius:100px;letter-spacing:0.04em;">847 RESP.</span>
  </div>
  ${agentField("Persona","Consultiva, direta, PT-BR informal. Trata o lead pelo nome.")}
  ${agentField("Objetivo","Qualificar em 3 mensagens e agendar demo.")}
  ${agentField("Escalar pro humano","Se pedir desconto > 20% ou citar concorrente.")}
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:14px;">
    ${agentStat("Resp. hoje","127")}
    ${agentStat("Conversões","18")}
    ${agentStat("Qualif.","62%")}
  </div>
</div>`;

function agentField(label, val) {
  return `<div style="margin-bottom:10px;"><div style="font-family:var(--mono);font-size:9px;letter-spacing:0.14em;color:var(--primary);text-transform:uppercase;margin-bottom:5px;">${label}</div><div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:12.5px;color:var(--text);line-height:1.45;">${val}</div></div>`;
}
function agentStat(label, val) {
  return `<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:10px;"><div style="font-family:var(--mono);font-size:8px;letter-spacing:0.1em;color:var(--text-subtle);text-transform:uppercase;">${label}</div><div style="font-size:17px;font-weight:600;letter-spacing:-0.03em;margin-top:3px;">${val}</div></div>`;
}

// ---- Integrações & API (feature) ----
MK.integrations = `
<div style="padding:24px;min-height:340px;position:relative;background:radial-gradient(circle at 80% 15%, rgba(0,229,153,0.07), transparent 55%);">
  <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
    ${intgRow("#25D366","WhatsApp Business","conectado",'<path d="M5 19l1.4-3.5A7 7 0 1 1 9 18.5L5 19z" stroke-linejoin="round"/>')}
    ${intgRow("#3B82F6","Meta Ads","conectado",'<path d="M3 12c1-5 4-7 6-7 3 0 5 3 6 6 1-3 3-6 6-6" stroke-linecap="round"/>')}
    ${intgRow("#A855F7","Webhook · pedidos","ativo",'<circle cx="12" cy="7" r="3"/><path d="M9 9l-3 6m6-6 3 6M7 17h10" stroke-linecap="round" stroke-linejoin="round"/>')}
  </div>
  <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.14em;color:var(--primary);text-transform:uppercase;margin-bottom:8px;">API · exemplo</div>
  <div style="background:var(--bg-deep);border:1px solid var(--border);border-radius:10px;padding:14px;font-family:var(--mono);font-size:11px;line-height:1.7;">
    <div style="color:var(--text-subtle);">POST /v1/leads</div>
    <div style="color:var(--text-muted);">{ <span style="color:var(--primary);">"nome"</span>: "Felipe Costa",</div>
    <div style="color:var(--text-muted);">&nbsp;&nbsp;<span style="color:var(--primary);">"origem"</span>: "meta_ads",</div>
    <div style="color:var(--text-muted);">&nbsp;&nbsp;<span style="color:var(--primary);">"valor"</span>: 21000 }</div>
    <div style="color:#25D366;margin-top:6px;">✓ 201 Created · score 94</div>
  </div>
</div>`;

function intgRow(color, name, status, icon) {
  return `<div style="display:flex;align-items:center;gap:12px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:12px 14px;">
    <div style="width:34px;height:34px;border-radius:9px;background:${color}22;display:flex;align-items:center;justify-content:center;color:${color};flex-shrink:0;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${icon}</svg></div>
    <span style="flex:1;font-size:13px;font-weight:500;letter-spacing:-0.01em;">${name}</span>
    <span style="font-family:var(--mono);font-size:9px;background:rgba(0,229,153,0.14);color:var(--primary);padding:4px 9px;border-radius:100px;letter-spacing:0.04em;text-transform:uppercase;">${status}</span>
    <span style="width:30px;height:17px;border-radius:100px;background:var(--primary);position:relative;flex-shrink:0;box-shadow:0 0 10px var(--glow-soft);"><span style="position:absolute;top:2px;left:15px;width:13px;height:13px;border-radius:50%;background:#fff;"></span></span>
  </div>`;
}

// ---- Pipelines avançados (feature) ----
MK.pipelines = `
<div style="padding:20px;min-height:340px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
    <div style="font-size:14px;font-weight:600;letter-spacing:-0.02em;">Funil · Comercial B2B</div>
    <div style="font-family:var(--mono);font-size:10px;color:var(--text-subtle);">5 etapas</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
    ${pipeCol("Novo","#3B82F6","R$ 28k",["Diego R.","Patricia M."])}
    ${pipeCol("Qualificado","#00E599","R$ 41k",["Felipe C.","Marina S.","João P."])}
    ${pipeCol("Proposta","#F59E0B","R$ 19k",["Bruna L."])}
  </div>
  <div style="display:flex;align-items:center;gap:8px;margin-top:14px;padding:11px 14px;background:var(--surface-2);border:1px dashed var(--border-active);border-radius:10px;">
    <div style="width:26px;height:26px;border-radius:7px;background:rgba(0,229,153,0.14);display:flex;align-items:center;justify-content:center;color:var(--primary);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4v4m0 8v4M4 12h4m8 0h4" stroke-linecap="round"/><circle cx="12" cy="12" r="3"/></svg></div>
    <span style="font-size:11.5px;color:var(--text-muted);">Automação ativa · move pra "Proposta" ao receber resposta</span>
  </div>
</div>`;

function pipeCol(name, color, total, leads) {
  return `<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:8px;">
    <div style="display:flex;align-items:center;gap:6px;padding:2px 4px 8px;"><span style="width:6px;height:6px;border-radius:50%;background:${color};"></span><span style="font-size:10px;font-weight:600;">${name}</span></div>
    <div style="font-family:var(--mono);font-size:9px;color:var(--text-subtle);padding:0 4px 8px;">${total}</div>
    ${leads.map(l => `<div style="background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:7px 8px;margin-bottom:5px;font-size:9.5px;font-weight:500;display:flex;align-items:center;gap:6px;"><span style="width:16px;height:16px;border-radius:4px;background:${color};display:flex;align-items:center;justify-content:center;font-size:6px;color:#fff;font-weight:700;">${l.split(" ").map(w=>w[0]).join("")}</span>${l}</div>`).join("")}
  </div>`;
}

// ---- Dashboards completos (feature) ----
MK.dashboards = `
<div style="padding:22px;min-height:340px;">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
    ${dashKpi("LTV","R$ 8.4k","+12%")}
    ${dashKpi("CAC","R$ 184","-8%")}
    ${dashKpi("Conversão","32%","+4pp")}
  </div>
  <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:10px;">
    <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-subtle);margin-bottom:14px;">Receita por mês</div>
    <div style="display:flex;align-items:flex-end;gap:8px;height:90px;">
      ${[42,58,51,74,68,89].map((h,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;"><div style="width:100%;height:${h}%;background:${i===5?'linear-gradient(180deg,#00E599,#00B87A)':'var(--surface-3)'};border-radius:5px 5px 0 0;${i===5?'box-shadow:0 0 14px var(--glow-soft);':''}"></div><span style="font-family:var(--mono);font-size:8px;color:var(--text-subtle);">${['N','D','J','F','M','A'][i]}</span></div>`).join("")}
    </div>
  </div>
  <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:14px;">
    <div style="font-family:var(--mono);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-subtle);margin-bottom:10px;">Conversão por origem</div>
    ${dashBar("Meta Ads",78)}
    ${dashBar("Google",62)}
    ${dashBar("Indicação",91)}
  </div>
</div>`;

function dashKpi(label, val, delta) {
  return `<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:11px;"><div style="font-family:var(--mono);font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-subtle);">${label}</div><div style="display:flex;align-items:baseline;gap:5px;margin-top:4px;"><span style="font-size:16px;font-weight:600;letter-spacing:-0.03em;">${val}</span><span style="font-family:var(--mono);font-size:8.5px;color:var(--primary);">${delta}</span></div></div>`;
}
function dashBar(label, pct) {
  return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;"><span style="font-size:10px;color:var(--text-muted);width:64px;flex-shrink:0;">${label}</span><div style="flex:1;height:7px;background:var(--surface-3);border-radius:100px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#00E599,#00B87A);box-shadow:0 0 8px var(--glow-soft);"></div></div><span style="font-family:var(--mono);font-size:9.5px;font-weight:600;color:var(--primary);width:26px;text-align:right;">${pct}%</span></div>`;
}

// ---- Inject ----
function injectMockups() {
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  ["mockupSlotB", "mockupSlotC"].forEach(id => set(id, MK.dashboard));
  set("featAutomation", MK.automation);
  set("featWhatsapp", `<img src="Rezult WPP.png" alt="Rezult CRM WhatsApp" style="width:100%;height:100%;object-fit:contain;display:block;">`);
  set("featAgent", MK.agent);
  set("featIntegrations", MK.integrations);
  set("featPipelines", MK.pipelines);
  set("featDashboards", MK.dashboards);
  set("demoShowcase", MK.dashboard);
}
if (document.readyState !== "loading") injectMockups();
else document.addEventListener("DOMContentLoaded", injectMockups);
