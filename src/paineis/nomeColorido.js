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
const CORES_CLIENTE = [
  '#1D4ED8', // azul
  '#6D28D9', // roxo
  '#0369A1', // azul petróleo
  '#0F766E', // teal
  '#4338CA', // índigo
];

const CORES_ATENDENTE = [
  '#128A68', // verde da marca
  '#B45309', // âmbar escuro
  '#BE185D', // rosa escuro
  '#C2410C', // laranja queimado
  '#9F1239', // vinho
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
