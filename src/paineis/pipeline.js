/* O kanban encenado no card "CRM Automatizado".
 *
 * Reproduz a tela de Pipeline do CRM. O card traz, na ordem em que aparecem lá:
 * avatar com iniciais na cor da coluna, nome, número do negócio à direita,
 * responsável com foto, valor em verde, data de criação com ícone de calendário,
 * o botão redondo do WhatsApp e, abaixo de um divisor, as tags com o ícone de
 * etiqueta na ponta.
 *
 * A cena mostra o que o texto do card promete ao lado: "Movimentação automática
 * entre etapas". Ninguém arrasta nada: o responsável de todo negócio já é o
 * agente, os cards andam sozinhos e as tags entram sozinhas.
 */

/* Geometria do quadro, em pixels do desenho. A escala final sai da razão entre
 * a largura disponível e a LARGURA_QUADRO. */
export const LARGURA_COLUNA = 168;
const VAO_COLUNA = 10;
export const ALTURA_CARD = 142;
const VAO_CARD = 8;
export const ALTURA_CABECALHO = 46;

export const LARGURA_QUADRO = LARGURA_COLUNA * 3 + VAO_COLUNA * 2;

export function xDaColuna(i) {
  return i * (LARGURA_COLUNA + VAO_COLUNA);
}
export function yDaPosicao(i) {
  return ALTURA_CABECALHO + i * (ALTURA_CARD + VAO_CARD);
}

/* Altura total do quadro: cabeçalho mais três cards. Exportada porque a escala
 * precisa caber o quadro na ALTURA também, e não só na largura -- foi por olhar
 * só a largura que as colunas estouravam a borda de cima do card. */
export const ALTURA_QUADRO = yDaPosicao(3) + 4;

/* Etapas e cores como no funil real: a faixa colorida no topo da coluna e a
 * bolinha ao lado do nome saem da mesma cor. */
export const COLUNAS = [
  { nome: 'Novo lead', cor: '#F59E0B' },
  { nome: 'Qualificado', cor: '#F97316' },
  { nome: 'Reunião agendada', cor: '#EF4444' },
];

/* Todo negócio já nasce com o agente como responsável: a automação não assume o
 * card no meio do caminho, ela é quem atende desde a entrada do lead. */
export const AGENTE = 'Rezult Atendimento';

/* Seis negócios, todos entrando por "Novo lead". A coluna tem três lugares à
 * vista, então os três últimos começam abaixo da dobra e sobem conforme os da
 * frente avançam -- que é o que uma coluna de kanban faz quando tem mais cards
 * do que altura. */
export const CARDS = [
  { id: 'c1', nome: 'Marina',            numero: 1391, valor: 'R$ 2.370,00', data: '05/07/2026' },
  { id: 'c2', nome: 'Rafael',            numero: 1390, valor: 'R$ 890,00',   data: '05/07/2026' },
  { id: 'c3', nome: 'Carla',             numero: 1389, valor: 'R$ 0,00',     data: '05/07/2026' },
  { id: 'c4', nome: 'Diego',             numero: 1388, valor: 'R$ 1.240,00', data: '04/07/2026' },
  { id: 'c5', nome: 'Patrícia',          numero: 1387, valor: 'R$ 640,00',   data: '04/07/2026' },
  { id: 'c6', nome: 'Irelany',           numero: 1386, valor: 'R$ 3.100,00', data: '04/07/2026' },
];

/* Cores das tags, como no CRM: pílula branca sobre a cor cadastrada na tag. */
export const COR_DA_TAG = {
  'Meta ads': '#38BDF8',
  Qualificado: '#0F766E',
  Demonstração: '#22C55E',
  'Sem orçamento': '#B45309',
};

/* O roteiro. Uma coisa por etapa, para o olho conseguir seguir: ou o card anda
 * de coluna, ou recebe uma tag.
 *
 * Como o agente já é o responsável desde a entrada, é a própria movimentação que
 * conta a automação: ninguém arrasta nada e as tags entram sozinhas.
 *
 * A ordem alterna avanços entre as três colunas de propósito. Empurrar quatro
 * cards seguidos para "Qualificado" a encheria enquanto "Novo lead" esvazia, e o
 * quadro passaria metade do ciclo desequilibrado.
 *
 * NENHUM card passa de duas tags, contando a "Meta ads" que todos já trazem.
 * O card tem altura fixa, então a terceira quebraria a linha das tags e sairia
 * cortada pelo pé. Por isso o Diego recebe "Demonstração" e não "Qualificado" +
 * "Demonstração": uma tag por card, além da de origem.
 *
 * Carla Bispo fica parada com "Sem orçamento" -- automação que só produz caso de
 * sucesso não convence ninguém que já tocou um funil de verdade. */
export const ROTEIRO = [
  { tipo: 'move', card: 'c1', coluna: 1 },
  { tipo: 'tag', card: 'c1', tag: 'Qualificado' },
  { tipo: 'move', card: 'c2', coluna: 1 },
  { tipo: 'move', card: 'c1', coluna: 2 },
  { tipo: 'tag', card: 'c2', tag: 'Qualificado' },
  { tipo: 'move', card: 'c3', coluna: 1 },
  { tipo: 'move', card: 'c2', coluna: 2 },
  { tipo: 'tag', card: 'c3', tag: 'Sem orçamento' },
  { tipo: 'move', card: 'c4', coluna: 1 },
  { tipo: 'move', card: 'c4', coluna: 2 },
  { tipo: 'tag', card: 'c4', tag: 'Demonstração' },
];

export const MS_POR_ETAPA = 1500;

/* Respiro no fim, com o quadro cheio à vista, antes de voltar ao começo. Mesmo
 * valor dos outros dois painéis, para os cards da página respirarem junto. */
export const MS_ANTES_DE_REINICIAR = 8000;

/* O estado do quadro depois de `passo` etapas.
 *
 * Derivado do roteiro a cada render em vez de guardado e mutado: com o estado
 * derivado, voltar ao começo é zerar um número, e não desfazer dez alterações na
 * ordem inversa. A posição dentro da coluna sai da ordem dos próprios cards, o
 * que mantém a pilha estável quando um deles sai do meio. */
export function estadoDoQuadro(passo) {
  const base = CARDS.map((c) => ({ ...c, coluna: 0, tags: ['Meta ads'] }));
  const porId = Object.fromEntries(base.map((c) => [c.id, c]));

  ROTEIRO.slice(0, passo).forEach((e) => {
    const card = porId[e.card];
    if (!card) return;
    if (e.tipo === 'move') card.coluna = e.coluna;
    if (e.tipo === 'tag' && !card.tags.includes(e.tag)) card.tags.push(e.tag);
  });

  /* A posição vertical sai da ordem dos cards dentro da coluna. Quem cai numa
   * posição abaixo da terceira fica fora do recorte do quadro, e sobe sozinho
   * quando um da frente sai. */
  const contagem = [0, 0, 0];
  base.forEach((c) => {
    c.posicao = contagem[c.coluna];
    contagem[c.coluna] += 1;
  });

  return base;
}

/* Total por coluna, para o subtítulo "R$ x · N negócios" do cabeçalho. Somado a
 * partir dos cards que estão lá agora, então acompanha a movimentação. */
export function resumoDaColuna(cards, i) {
  const naColuna = cards.filter((c) => c.coluna === i);
  const total = naColuna.reduce((s, c) => s + Number(c.valor.replace(/[^\d,]/g, '').replace(',', '.')), 0);
  const formatado = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `R$ ${formatado} · ${naColuna.length} ${naColuna.length === 1 ? 'negócio' : 'negócios'}`;
}
