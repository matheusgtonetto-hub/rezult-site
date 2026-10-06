/* Porte de src/lib/nomeColorido.ts do rezult-crm.
 *
 * Copiado em vez de reinventado para o painel do site mostrar exatamente as
 * cores que o cliente vai encontrar no Multiatendimento depois de assinar. Se
 * as paletas mudarem lá, mudam aqui: são dois repositórios separados, e não há
 * import possível entre eles.
 *
 * Duas paletas sem interseção, uma por lado da conversa, para cliente e
 * atendente nunca caírem na mesma cor por coincidência do hash.
 */
/* Em cinza as duas paletas não podem mais se separar por MATIZ (frios para quem
 * escreve de fora, quentes para quem atende). Separam-se por FAIXA DE VALOR: o
 * cliente ocupa os tons escuros, o atendente os médios, e as duas faixas não se
 * tocam (o mais claro do cliente é 0,043 de luminância, o mais escuro do
 * atendente é 0,060). O hash continua garantindo que a mesma pessoa mantenha a
 * mesma cor entre recarregamentos.
 *
 * Todos os dez valores foram medidos nos dois usos que a cor tem: fundo de
 * avatar com as iniciais em branco, e o nome como texto sobre o #FAFAFA do
 * chat. O pior caso é 5,03:1, e o mínimo do AA é 4,5:1. */
const CORES_CLIENTE = [
  '#2D2F33', // charcoal
  '#1B1B1B', // quase preto
  '#3A3A3E',
  '#242629',
  '#333539',
];

const CORES_ATENDENTE = [
  '#525154',
  '#6C6C6C',
  '#5C5B5E',
  '#646366',
  '#464548',
];

/* djb2: barato, determinístico e espalha bem nomes curtos e parecidos. O hash
 * é o que garante que a mesma pessoa mantenha a mesma cor entre recarregamentos
 * -- sorteio não informaria nada. */
function hash(texto) {
  let h = 5381;
  for (let i = 0; i < texto.length; i += 1) h = ((h << 5) + h + texto.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function corDoNome(nome, lado) {
  const limpo = (nome ?? '').trim().toLowerCase();
  const paleta = lado === 'cliente' ? CORES_CLIENTE : CORES_ATENDENTE;
  if (!limpo) return '#767676';
  return paleta[hash(limpo) % paleta.length];
}

/* Iniciais para o avatar, como o ConvAvatar do CRM. Duas letras no máximo:
 * "Marina Duarte" vira MD, "Sônia" vira S. */
export function iniciais(nome) {
  const partes = (nome ?? '').trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
