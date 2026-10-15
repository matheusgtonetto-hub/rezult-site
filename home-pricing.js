/* Os três planos ficam visíveis. Apenas o ciclo de cobrança é interativo.
 * Preços e totais vêm da oferta existente; rastreio.js mantém a atribuição. */
(function () {
  'use strict';

  var root = document.querySelector('[data-pricing-root]');
  if (!root) return;
  var source = root.querySelector('#rz-pricing-data');
  if (!source) return;
  var data;
  try { data = JSON.parse(source.textContent); } catch (error) { return; }

  var periods = {
    mensal: { name: 'Mensal', months: 1, billing: 'Cobrado mensalmente', saving: 'no mês' },
    semestral: { name: 'Semestral', months: 6, billing: 'Cobrado a cada 6 meses', saving: 'no semestre' },
    anual: { name: 'Anual', months: 12, billing: 'Cobrado a cada 12 meses', saving: 'no ano' }
  };
  var currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var transitions = [];

  function setText(scope, selector, value) {
    scope.querySelector(selector).textContent = value;
  }

  function cancelTransitions() {
    transitions.forEach(function (animation) { animation.cancel(); });
    transitions = [];
  }

  function render(announce) {
    var checked = root.querySelector('input[name="rz-pricing-period"]:checked');
    var periodId = checked ? checked.value : data.defaultPeriod;
    var period = periods[periodId];
    if (!period) return;
    var approximate = period.months > 1;
    root.dataset.selectedPeriod = periodId;
    cancelTransitions();

    data.plans.forEach(function (plan) {
      var card = root.querySelector('[data-pricing-plan="' + plan.id + '"]');
      if (!card) return;
      var price = plan.prices[periodId];
      // O equivalente mensal é arredondado na oferta original.
      // Preservar o total contratado: nunca multiplicar o valor arredondado.
      setText(card, '[data-monthly-price]', integer.format(price.monthly));
      card.querySelector('[data-price-approx]').hidden = !approximate;
      setText(card, '[data-equivalent-note]', approximate ? 'Equivalente mensal aproximado' : 'Valor da assinatura mensal');
      setText(card, '[data-billing-description]', period.billing);
      setText(card, '[data-total-price]', currency.format(price.total));
      setText(card, '[data-savings-amount]', currency.format(plan.reference * period.months - price.total));
      setText(card, '[data-savings-period]', period.saving);

      var investment = card.querySelector('.rz-plan-investment');
      if (announce && !reduceMotion.matches && investment.animate) {
        transitions.push(investment.animate([{ opacity: .7 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' }));
      }
    });
    root.querySelector('[data-rounding-note]').hidden = !approximate;

    if (announce) {
      var prices = data.plans.map(function (plan) {
        return plan.name + ': ' + currency.format(plan.prices[periodId].monthly);
      }).join('; ');
      setText(root, '[data-pricing-status]', 'Ciclo ' + period.name.toLowerCase() + '. Valores mensais' +
        (approximate ? ' aproximados' : '') + ': ' + prices + '. Total cobrado informado em cada plano.');
    }
  }

  root.addEventListener('change', function (event) {
    if (event.target.matches('input[name="rz-pricing-period"]')) render(true);
  });
  reduceMotion.addEventListener('change', function (event) {
    if (event.matches) cancelTransitions();
  });
  render(false);
})();
