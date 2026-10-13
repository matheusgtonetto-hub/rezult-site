/* Agenda do Cal.com em pop-up.
 *
 * Arquivo próprio, e não um trecho do main.js, porque a home não carrega o
 * main.js: ela tem o home.js. Como os links de agenda vivem nas duas folhas de
 * script, o código que os governa não podia morar em nenhuma das duas.
 *
 * Incluir em toda página que tenha link para a agenda. Em páginas sem link ele
 * sai pela porta logo na primeira linha, sem carregar nada do Cal.com.
 */
/* ── Agenda do Cal.com, em pop-up sobre a página ────────────────────────────
 *
 * Todo link para a página de agendamento vira um gatilho de pop-up, e o `href`
 * continua sendo a página de verdade. Isso é proposital nas duas pontas:
 *
 *   . com o embed carregado, o calendário abre POR CIMA de onde a pessoa está,
 *     sem perder a rolagem nem o argumento que acabou de convencê-la;
 *   . sem o embed (JavaScript falhou, rede caiu, bloqueador), o clique leva à
 *     `demonstracao.html`, que tem o mesmo calendário embutido.
 *
 * A `demonstracao.html` continua existindo, então, por dois motivos: é a rede
 * de segurança acima e é o endereço que um anúncio pode usar como destino,
 * coisa que um pop-up não pode ser.
 *
 * O embed só é carregado em páginas que têm algum link de agenda, e nunca na
 * própria `demonstracao.html`, que já monta o calendário embutido -- duas
 * instâncias do mesmo namespace brigariam pelo mesmo espaço.
 */
(function () {
  var SELETOR = 'a[href^="demonstracao.html"], a[href^="/demonstracao"]';
  if (document.getElementById("cal-demonstracao")) return;

  var gatilhos = document.querySelectorAll(SELETOR);
  if (!gatilhos.length) return;

  var LINK_DO_EVENTO = "rezult-crm/demonstracao";
  var CONFIG = { layout: "month_view", useSlotsViewOnSmallScreen: "true" };

  /* Abrimos o modal pela API, em vez de deixar o `data-cal-link` fazer isso.
   *
   * O embed do Cal.com só intercepta o clique sozinho em elementos SEM `href`
   * (botões, spans). Nos nossos links ele não cancela a navegação, e o teste ao
   * vivo de 13/10/2026 mostrou a página indo para a `demonstracao.html` com o
   * embed inteiramente carregado. Os atributos `data-cal-*` ficavam no HTML
   * prometendo um comportamento que não acontecia.
   *
   * A guarda do `pronto()` é o que preserva o plano B: enquanto o `embed.js`
   * não terminou de carregar, NÃO cancelamos nada e o clique segue o `href`
   * para a página, que tem o mesmo calendário. Cancelar antes da hora deixaria
   * o botão morto nesse intervalo. */
  function pronto() {
    return !!(window.Cal && window.Cal.loaded && window.Cal.ns && window.Cal.ns.demonstracao);
  }

  Array.prototype.forEach.call(gatilhos, function (a) {
    a.addEventListener("click", function (ev) {
      if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
      if (!pronto()) return;
      ev.preventDefault();
      Cal.ns.demonstracao("modal", { calLink: LINK_DO_EVENTO, config: CONFIG });
    });
  });

  // Carregador oficial do Cal.com.
  (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", "demonstracao", { origin: "https://app.cal.com" });

  // Leva as UTMs da URL atual para dentro do Cal.com. É o que faz a reserva
  // saber de qual anúncio veio, do lado de lá.
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;

  Cal.ns.demonstracao("ui", {
    hideEventTypeDetails: false,
    layout: "month_view",
    cssVarsPerTheme: { light: { "cal-brand": "#0F7A5B" }, dark: { "cal-brand": "#01D8A4" } },
  });

  /* O evento de conversão.
   *
   * `bookingSuccessfulV2`, e não o `bookingSuccessful` antigo: aquele foi
   * substituído na API do Cal.com e não dispara mais, embora ainda apareça na
   * maioria dos tutoriais.
   *
   * O `uid` da reserva vira o `eventID`, que é o que permitirá mandar o MESMO
   * evento pelo servidor depois (webhook do Cal.com para a Conversions API)
   * sem a Meta contar duas vezes. Mesmo desenho do StartTrial no app. */
  Cal.ns.demonstracao("on", {
    action: "bookingSuccessfulV2",
    callback: function (e) {
      var d = (e && e.detail && e.detail.data) || {};
      if (typeof fbq !== "function") return;
      fbq("track", "Schedule", { content_name: "Diagnostico Comercial" },
          d.uid ? { eventID: "demo_" + d.uid } : undefined);
    },
  });
})();
