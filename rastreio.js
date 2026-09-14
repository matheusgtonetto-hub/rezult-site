/* Rastreio de aquisição do site.
 *
 * Faz duas coisas, e só elas.
 *
 * 1. Guarda as UTMs e o fbclid com que a pessoa chegou e os repassa para o
 *    app.rezultcrm.com/register quando ela clica num CTA de cadastro. Sem isso
 *    a UTM morre no site: os links são fixos, e o app nunca sabe de qual
 *    anúncio (nem de qual variante do teste de Big Idea) veio a conta.
 *
 * 2. Dispara TrialStartClick com a seção onde o clique aconteceu. Os CTAs da
 *    home dizem todos "Começar os 7 dias grátis" e até aqui não emitiam evento
 *    nenhum; com `section` dá para saber qual dobra converte.
 *
 * O evento que a campanha otimiza NÃO é este. É o StartTrial, disparado no app
 * quando a empresa é criada (pixel e Conversions API, com o mesmo event_id).
 * Clique no site é diagnóstico, não conversão.
 *
 * sessionStorage, e não cookie: a atribuição vale para a visita. O cookie _fbc
 * que o próprio pixel grava em .rezultcrm.com já carrega o clique do Meta entre
 * o site e o app.
 */
(function () {
  var CHAVES = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
  var DESTINO = "https://app.rezultcrm.com/register";
  var ARMAZEM = "rz_atribuicao";

  function ler() {
    try { return JSON.parse(sessionStorage.getItem(ARMAZEM) || "{}"); } catch (e) { return {}; }
  }

  // A última chegada com parâmetro vence: quem volta por outro anúncio na mesma
  // aba passa a ser atribuído a ele. Chegada SEM parâmetro não apaga nada, para
  // que uma navegação interna não zere a origem.
  (function capturar() {
    var busca = new URLSearchParams(window.location.search);
    var novo = {};
    var achou = false;
    CHAVES.forEach(function (k) {
      var v = busca.get(k);
      if (v) { novo[k] = v; achou = true; }
    });
    if (!achou) return;
    try { sessionStorage.setItem(ARMAZEM, JSON.stringify(novo)); } catch (e) {}
  })();

  function secaoDe(el) {
    // O menu mobile é uma div fora de qualquer seção; sem esta linha o CTA dele
    // chegava ao app como "desconhecida".
    if (el.closest(".mobile-menu")) return "menu-mobile";
    var alvo = el.closest("section[id], header[id]");
    if (alvo) return alvo.id;
    if (el.closest("nav")) return "nav";
    if (el.closest("footer")) return "rodape";
    return "desconhecida";
  }

  function comParametros(url, secao) {
    try {
      var u = new URL(url, window.location.href);
      var guardado = ler();
      CHAVES.forEach(function (k) {
        if (guardado[k] && !u.searchParams.has(k)) u.searchParams.set(k, guardado[k]);
      });
      if (secao) u.searchParams.set("rz_secao", secao);
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  // Exposto para o formulário de intenção do agentes.html, que navega por
  // window.location em vez de por link.
  window.rzComParametros = comParametros;

  // Fase de captura (terceiro argumento true): o href precisa estar trocado
  // ANTES de o navegador seguir o link. A troca é no clique, e não no
  // carregamento, porque a seção só é conhecida no clique.
  document.addEventListener("click", function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="' + DESTINO + '"]') : null;
    if (!a) return;
    var secao = secaoDe(a);
    a.href = comParametros(a.getAttribute("href"), secao);
    if (typeof fbq === "function") {
      fbq("trackCustom", "TrialStartClick", { section: secao });
    }
  }, true);
})();
