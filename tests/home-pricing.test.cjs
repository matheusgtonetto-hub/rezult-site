const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const plansPage = fs.readFileSync(path.join(root, 'planos.html'), 'utf8');
const data = JSON.parse(home.match(/<script type="application\/json" id="rz-pricing-data">([\s\S]*?)<\/script>/)[1]);

test('a home preserva os nove preços e totais da página de planos', () => {
  for (const plan of data.plans) {
    const start = plansPage.indexOf('<div class="pname">' + plan.name + '</div>');
    assert.ok(start > -1, plan.name);
    const markup = plansPage.slice(start, plansPage.indexOf('</ul>', start));
    const price = markup.match(/class="pprice" data-de="(\d+)" data-m="(\d+)" data-stotal="(\d+)" data-atotal="(\d+)"/);
    const amounts = markup.match(/class="amt" data-m="(\d+)" data-s="(\d+)" data-a="(\d+)"/);
    assert.equal(plan.reference, Number(price[1]));
    assert.deepEqual(plan.prices, {
      mensal: { monthly: Number(amounts[1]), total: Number(price[2]) },
      semestral: { monthly: Number(amounts[2]), total: Number(price[3]) },
      anual: { monthly: Number(amounts[3]), total: Number(price[4]) }
    });
  }
});

test('os limites comerciais e as etapas por pipeline não mudam', () => {
  const capacities = data.plans.map(({ id, users, leads, automations, connections, pipelines, stages, webhooks }) =>
    ({ id, users, leads, automations, connections, pipelines, stages, webhooks }));
  assert.deepEqual(capacities, [
    { id: 'silver', users: '4', leads: '5 mil', automations: '8', connections: '3', pipelines: '5', stages: 8, webhooks: '3' },
    { id: 'platinum', users: '15', leads: '100 mil', automations: '20', connections: '10', pipelines: '20', stages: 15, webhooks: '15' },
    { id: 'emerald', users: 'Ilimitados', leads: 'Ilimitados', automations: 'Ilimitadas', connections: 'Ilimitadas', pipelines: 'Ilimitados', stages: 25, webhooks: 'Ilimitadas' }
  ]);
});

test('preço aproximado não substitui o total contratado', () => {
  for (const plan of data.plans) {
    for (const [period, months] of [['semestral', 6], ['anual', 12]]) {
      assert.equal(plan.prices[period].monthly, Math.round(plan.prices[period].total / months));
    }
  }
  assert.equal(data.plans[0].prices.semestral.total, 1209);
  assert.notEqual(data.plans[0].prices.semestral.total, data.plans[0].prices.semestral.monthly * 6);
});

test('os três planos ficam visíveis e apenas o período precisa ser escolhido', () => {
  const section = home.slice(home.indexOf('<!-- DOBRA · PLANOS -->'), home.indexOf('<!-- faq -->'));
  assert.deepEqual([...section.matchAll(/data-pricing-plan="([^"]+)"/g)].map(match => match[1]), ['silver', 'platinum', 'emerald']);
  assert.doesNotMatch(section, /name="rz-pricing-plan"/);
  assert.match(section, /<details class="rz-pricing-compare">/);
  assert.match(section, /rz-plan-card-featured" data-pricing-plan="platinum"/);
});

test('o ciclo inicial, o teste grátis e as integrações existentes são preservados', () => {
  assert.equal(data.defaultPeriod, 'mensal');
  assert.match(home, /name="rz-pricing-period" value="mensal" checked/);
  assert.doesNotMatch(home, /name="rz-pricing-period" value="semestral" checked/);
  const section = home.slice(home.indexOf('<!-- DOBRA · PLANOS -->'), home.indexOf('<!-- faq -->'));
  const registerLinks = section.match(/href="https:\/\/app\.rezultcrm\.com\/register"/g);
  assert.equal(registerLinks.length, 6);
  assert.match(section, /Sem cartão de crédito/);
  assert.match(section, /href="planos\.html"/);
  assert.match(home, /src="rastreio\.js"/);
  assert.match(home, /src="home-pricing\.js\?[^\"]+" defer/);
});

test('cada checklist destaca usuários e preserva os seis limites do plano', () => {
  const lists = [...home.matchAll(/<ul class="rz-plan-features" role="list">([\s\S]*?)<\/ul>/g)];
  assert.equal(lists.length, 3);
  lists.forEach(([, list], index) => {
    assert.equal([...list.matchAll(/<li(?:\s|>)/g)].length, 6);
    assert.match(list, /<li class="rz-plan-user-limit">/);
    assert.doesNotMatch(list, /rz-plan-bundle/);
    const users = index === 2 ? 'Usuários ilimitados' : data.plans[index].users + ' usuários';
    assert.ok(list.includes('data-capacity="users">' + users));
    assert.ok(list.includes('com até ' + data.plans[index].stages + ' etapas'));
    assert.match(list, /via Webhook/);
  });
});

test('WhatsApp Oficial e Agentes aparece acima de Capacidade incluída nos três planos', () => {
  const blocks = [...home.matchAll(/<div class="rz-plan-included">\s*<div class="rz-plan-bundle"><img src="logos\/meta\.svg" alt="Meta"[^>]*><span>WhatsApp Oficial e Agentes inclusos<\/span><\/div>\s*<h4>Capacidade incluída<\/h4>/g)];
  assert.equal(blocks.length, 3);
});

test('a primeira renderização já mostra preços e cobrança mensais', () => {
  const cards = [...home.matchAll(/<article class="rz-plan-card[^\"]*" data-pricing-plan="[^\"]+"[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, 3);
  cards.forEach(([card], index) => {
    const plan = data.plans[index];
    assert.ok(card.includes('data-monthly-price>' + plan.prices.mensal.monthly + '<'));
    assert.ok(card.includes('>−R$' + (plan.reference - plan.prices.mensal.monthly) + '</strong>'));
    assert.doesNotMatch(card, /rz-pricing-total|data-billing-description|data-total-price/);
    assert.doesNotMatch(card, /data-price-approx|≈/);
    assert.doesNotMatch(card, /rz-pricing-savings|data-savings-amount|Economize/);
    assert.match(card, /data-payment-note>Cobrança mensal sem carência</);
    assert.doesNotMatch(card, /Sem cartão de crédito/);
    const discount = Math.round((1 - plan.prices.mensal.total / plan.reference) * 100);
    assert.ok(card.includes('data-discount-percent>' + discount + '% OFF<'));
    assert.ok(card.indexOf('class="rz-pricing-discount"') < card.indexOf('class="rz-pricing-reference"'));
  });
});

test('o comparativo volta abaixo dos cards com os três planos', () => {
  const compare = home.match(/<details class="rz-pricing-compare">([\s\S]*?)<\/details>/)[1];
  assert.ok(home.indexOf('rz-pricing-compare') > home.indexOf('id="rz-plan-emerald"'));
  assert.equal([...compare.matchAll(/<th scope="row">/g)].length, 7);
  for (const plan of data.plans) {
    assert.equal([...compare.matchAll(new RegExp('data-compare-plan="' + plan.id + '"', 'g'))].length, 8);
    assert.ok(compare.includes('Até ' + plan.stages + ' etapas'));
  }
});

test('os botões dos cards e do comparativo exibem Escolher plano', () => {
  const section = home.slice(home.indexOf('<!-- DOBRA · PLANOS -->'), home.indexOf('<!-- faq -->'));
  const links = [...section.matchAll(/<a[^>]+href="https:\/\/app\.rezultcrm\.com\/register"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.equal(links.length, 6);
  for (const link of links) {
    assert.equal(link[1].replace(/<[^>]+>/g, '').trim(), 'Escolher plano');
    assert.match(link[0], /aria-label="Escolher plano (Silver|Platinum|Emerald)"/);
  }
});
