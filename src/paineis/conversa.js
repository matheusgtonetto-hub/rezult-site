/* O roteiro encenado no card "WhatsApp Oficial".
 *
 * Nomes ficam aqui em cima, soltos, e não espalhados pelas falas: trocar quem
 * atende ou quem é atendido é editar duas linhas, não caçar ocorrências.
 */
export const AGENTE = 'Sônia';
export const LEAD = 'Marina Duarte';

/* O rótulo da linha conectada, na pill do cabeçalho. É o que faz o card honrar
 * o "Oficial" do título: quem usa API não oficial não tem linha nomeada. */
export const LINHA = 'WhatsApp Comercial';

/* Quanto tempo cada turno leva, dos três pontinhos até a mensagem entrar.
 *
 * Um valor por lado, e não uma fórmula sobre o número de caracteres: as falas
 * da agente são consistentemente longas e as da lead consistentemente curtas,
 * então dois números dizem a mesma coisa que a fórmula dizia, sem esconder o
 * ritmo dentro de uma conta. Mudar o ritmo passa a ser editar o número que se
 * quer mudar. */
export const MS_POR_LADO = {
  agente: 3000,
  lead: 2000,
};

export function msDigitando(de) {
  return MS_POR_LADO[de] ?? MS_POR_LADO.lead;
}

/* Respiro antes de os três pontinhos aparecerem. É o tempo de ler o que chegou
 * antes de começar a escrever: sem ele os dois lados parecem estar digitando
 * desde antes de a mensagem anterior existir. Sai de dentro do turno, não se
 * soma a ele, então não alonga a volta. */
export const MS_ANTES_DE_DIGITAR = 400;

/* Respiro no fim, com a conversa completa parada, antes de recomeçar.
 *
 * O tempo não está sobrando: durante a encenação as mensagens passam e as
 * antigas saem por cima, então esta é a única janela em que dá para ler a
 * conversa inteira de uma vez, com o desfecho à vista. E parado não quer dizer
 * travado: o ponto do "Agente ativo" continua pulsando no cabeçalho.
 *
 * Conta da volta: oito falas por MS_POR_LADO (quatro da agente, quatro da lead)
 * mais esta pausa. Cada 100ms em MS_POR_LADO rende 800ms na volta. */
export const MS_ANTES_DE_REINICIAR = 8000;

/* O roteiro.
 *
 * Cada mensagem tem um trabalho, e nenhuma está ali só para encher a tela. A
 * cena existe para quem está avaliando o produto ver, na prática, um lead
 * entrando frio e saindo com reunião marcada e CRM preenchido:
 *
 *   1. A lead abre pela DOR, não por "como funciona". É assim que um lead real
 *      chega, e é o que faz quem lê se reconhecer na cena.
 *   2. A agente não despeja preço: faz uma pergunta de diagnóstico. Consultiva,
 *      não vendedora.
 *   3. A lead admite o número ruim. Sem essa confissão a dor fica abstrata.
 *   4. A agente nomeia a causa e emenda a pergunta de qualificação. Duas
 *      funções numa mensagem só, como um bom atendente faz.
 *   5. O dado de qualificação entra na conversa.
 *   6. A agente derruba a objeção de "vou ter que contratar mais gente" e já
 *      oferece DOIS horários. Fechamento por alternativa, não por sim ou não.
 *   7. A lead escolhe. O compromisso é dela.
 *   8. O desfecho fecha o ciclo inteiro: reunião marcada, CRM preenchido e
 *      convite enviado, sem ninguém do time ter tocado na conversa.
 *
 * Nota sobre a fala 4: "lead que espera mais de 5 minutos esfria" é qualitativo
 * de propósito. A versão com número ("converte 8x mais") circula muito, mas as
 * fontes divergem e isto vai num site público, onde um número desses é um claim
 * que alguém pode cobrar. Se você tiver um dado próprio, do seu funil, ele vale
 * mais que qualquer estatística de mercado.
 *
 * As horas sobem de minuto em minuto: oito mensagens carimbadas no mesmo
 * horário denunciariam o mockup. */
export const ROTEIRO = [
  {
    de: 'lead',
    hora: '14:32',
    texto: 'Oi! Vi o anúncio de vocês. A gente perde muito lead no WhatsApp, dá pra resolver isso?',
  },
  {
    de: 'agente',
    hora: '14:32',
    texto: 'Oi, Marina! Dá sim. A perda quase sempre começa na demora da primeira resposta. Quanto tempo vocês levam pra responder um lead novo?',
  },
  {
    de: 'lead',
    hora: '14:33',
    texto: 'Sinceramente? Às vezes só no dia seguinte 😬',
  },
  {
    de: 'agente',
    hora: '14:33',
    texto: 'É o padrão do mercado. Lead que espera mais de 5 minutos esfria. Quantos vendedores atendem hoje?',
  },
  {
    de: 'lead',
    hora: '14:34',
    texto: 'Somos 4',
  },
  {
    de: 'agente',
    hora: '14:34',
    texto: 'Com 4 dá pra resolver sem contratar ninguém. Quer ver funcionando numa call de 20 minutos? Tenho amanhã às 10h ou às 15h.',
  },
  {
    de: 'lead',
    hora: '14:35',
    texto: '15h fica melhor',
  },
  {
    de: 'agente',
    hora: '14:35',
    texto: 'Agendado, Marina. Amanhã às 15h. Já registrei tudo no CRM e te mandei o convite por e-mail.',
  },
];
