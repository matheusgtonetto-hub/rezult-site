/* O fluxo encenado no card "Automações Avançadas".
 *
 * Reproduz o template "Lead Formulário Webhook" que existe no CRM
 * (rezult-crm/src/pages/AutomacoesPage.tsx), reduzido aos quatro passos que
 * contam a história: chega uma requisição HTTP, o telefone é analisado, o lead
 * é criado e um responsável é atribuído. Rótulos, descrições e as opções das
 * telas de seleção são os do produto, não inventados.
 */

/* Geometria do canvas, em pixels do desenho (não da tela).
 *
 * A câmera mostra dois nós por vez e desliza para acompanhar a montagem, então o
 * nó não precisa mais encolher para caber quatro na largura do card: 210px
 * contra os 280px do CRM, já sem o botão "+ Adicionar" e o rodapé de métricas,
 * que são de quem edita. */
export const LARGURA_NO = 210;
const VAO = 24;
const PASSO_X = LARGURA_NO + VAO;

/* O que a câmera enquadra: dois nós e o vão entre eles, mais uma folga lateral
 * para o nó da ponta não encostar na borda do card. */
export const LARGURA_VIEWPORT = LARGURA_NO * 2 + VAO + 40;

/* Os quatro nós, com posição no canvas. x e y são dados, e não um cálculo
 * embutido no componente, para o arranjo poder mudar sem tocar no desenho. */
export const NOS = [
  {
    id: 'inicio',
    tipo: 'inicio',
    x: PASSO_X * 0,
    y: 0,
    titulo: 'Início',
    chip: {
      titulo: 'Requisição HTTP (Webhook)',
      descricao: 'Quando uma requisição HTTP é recebida',
    },
    porta: 'Quando o evento ocorrer, então',
  },
  {
    id: 'campos',
    tipo: 'campos',
    x: PASSO_X * 1,
    y: 0,
    titulo: 'Operações de campos',
    chip: { icone: 'telefone', titulo: 'Análise de telefone' },
    picker: {
      titulo: 'Adicionar operação',
      categorias: ['Telefone', 'Mapeamento', 'Texto'],
      catAtiva: 0,
      opcoes: [
        { titulo: 'Análise de telefone', descricao: 'Analisa um número de telefone', escolhida: true },
        { titulo: 'Mapeamento de campo', descricao: 'Guarda um valor num campo do lead' },
      ],
    },
  },
  {
    id: 'criar',
    tipo: 'acoes',
    x: PASSO_X * 2,
    y: 0,
    titulo: 'Ação',
    chip: { icone: 'lead', titulo: 'Criar lead' },
    picker: {
      titulo: 'Adicionar ação',
      categorias: ['Leads', 'Negócios', 'Tags'],
      catAtiva: 0,
      opcoes: [
        { titulo: 'Criar lead', descricao: 'Cria o lead com as informações da sessão', escolhida: true },
        { titulo: 'Criar negócio', descricao: 'Cria um novo negócio para o lead' },
      ],
    },
  },
  {
    id: 'responsavel',
    tipo: 'acoes',
    x: PASSO_X * 3,
    y: 0,
    titulo: 'Ação',
    chip: { icone: 'responsavel', titulo: 'Transferir um atendente ao lead' },
    picker: {
      titulo: 'Adicionar ação',
      categorias: ['Leads', 'Negócios', 'Tags'],
      catAtiva: 0,
      opcoes: [
        { titulo: 'Transferir um atendente ao lead', descricao: 'Transferir o atendente responsável do lead', escolhida: true },
        { titulo: 'Remover atendente do lead', descricao: 'Remove o atendente responsável do lead' },
      ],
    },
  },
];

/* Largura total do desenho, medida a partir dos próprios nós em vez de escrita à
 * mão: reposicionar um nó não deixa este número para trás. */
export const LARGURA_FLUXO = Math.max(...NOS.map((n) => n.x)) + LARGURA_NO;

/* A montagem, passo a passo, na ordem exata de quem monta a automação no CRM:
 *
 *   mouse    o cursor chega na bolinha azul do nó anterior e pressiona
 *   arrasta  puxa a linha até onde o nó novo vai nascer
 *   picker   solta, e abre a tela de seleção do que criar ali
 *   clique   escolhe a opção e a tela fecha
 *   no       o nó nasce
 *   chip     a operação escolhida cai dentro dele
 *
 * O primeiro nó não tem porta de origem de onde ser puxado, então entra com dois
 * tempos apenas. */
export const ETAPAS = NOS.flatMap((no, i) =>
  (i === 0
    ? ['no', 'chip']
    : ['mouse', 'arrasta', 'picker', 'clique', 'no', 'chip']
  ).map((parte) => ({ no: no.id, parte })),
);

export const MS_POR_PARTE = {
  mouse: 700,
  arrasta: 900,
  picker: 1100,
  clique: 600,
  no: 400,
  chip: 1000,
};

/* Deslize da câmera entre um par de nós e o seguinte. Sai da mesma constante
 * usada na transição de CSS, então mudar aqui muda os dois. */
export const MS_CAMERA = 700;

/* Respiro no fim, com o último par à vista, antes de recomeçar. Mesmo valor do
 * painel de WhatsApp, para os dois cards da página respirarem no mesmo compasso. */
export const MS_ANTES_DE_REINICIAR = 8000;

export function msDaEtapa(parte) {
  return MS_POR_PARTE[parte] ?? MS_POR_PARTE.no;
}
