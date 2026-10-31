import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { iniciais } from './nomeColorido';

/* Motion do recurso "WhatsApp Oficial" (dono, 30/10/2026).
 *
 * Ilustração, e não réplica de tela. Até aqui este card mostrava a coluna de
 * conversa do Multiatendimento: mostrava a tela, mas não o que o recurso
 * resolve. O pedido foi um motion que se entenda sem ler a lista ao lado, com
 * duas ideias, nesta ordem:
 *
 *   1. A conexão é a API Oficial da Meta, então o número não corre o risco de
 *      bloqueio das conexões não oficiais. A cena abre no "antes" (API não
 *      oficial, número bloqueado) e vira para o "depois".
 *   2. As conversas que chegam nesse número se dividem por departamento e,
 *      dentro de cada um, por responsável.
 *
 * A cena é desenhada num quadro fixo de 380 x 400 e escalada para caber no
 * slot (useEscala). Assim os fios, a bolha e a ficha usam coordenadas fixas,
 * e o mesmo desenho serve no desktop (~1,26x) e no celular (~0,92x). Os
 * números de posição que aparecem aqui (SAIDA, centroDoCliente, x de cada
 * departamento) têm par no CSS (.pwo-*), e os dois precisam andar juntos.
 *
 * O tempo é um relógio só (requestAnimationFrame), e o estado da cena sai de
 * uma função pura do instante (quadroEm). Pausar fora da tela, recomeçar e
 * mostrar o quadro final para quem pediu menos movimento são a mesma função
 * lida em instantes diferentes, sem cadeia de setTimeout para desmontar.
 *
 * Atributos em camelCase e className: o Preact aceita as duas formas, o React
 * só esta. Escrever na forma restrita mantém o componente válido como React
 * puro. */

const LARGURA = 380;
const ALTURA = 400;
/* Teto da escala: num slot muito largo e alto a cena não deve virar pôster. */
const ESCALA_MAXIMA = 1.4;

/* De onde saem os fios: o meio da borda de baixo do card do número
 * (top 92 + 92 de altura, no CSS). */
const SAIDA = { x: 190, y: 184 };
/* Onde eles chegam: o topo dos cards de departamento. */
const TOPO_DOS_DEPARTAMENTOS = 276;

/* Cores da PALETA_DO_APP do rezult-crm (src/lib/paleta-do-app.ts), a lista de
 * onde o cliente escolhe a cor de cada departamento. `fundo` é o tom claro que
 * marca a pessoa que acabou de receber a conversa. `abertas` é quantas
 * conversas cada um já tem antes da volta começar: com todo mundo em zero, a
 * divisão pareceria a primeira do dia e não o trabalho de sempre. */
const DEPARTAMENTOS = [
  {
    id: 'comercial',
    nome: 'Comercial',
    cor: '#196CF4',
    fundo: '#E8F0FE',
    x: 66,
    pessoas: [
      { id: 'ana', nome: 'Ana', abertas: 3 },
      { id: 'diego', nome: 'Diego', abertas: 2 },
    ],
  },
  {
    id: 'suporte',
    nome: 'Suporte',
    cor: '#C35305',
    fundo: '#FCEEE4',
    x: 190,
    pessoas: [
      { id: 'bruno', nome: 'Bruno', abertas: 4 },
      { id: 'lia', nome: 'Lia', abertas: 1 },
    ],
  },
  {
    id: 'financeiro',
    nome: 'Financeiro',
    cor: '#6D28D9',
    fundo: '#F1EAFD',
    x: 314,
    pessoas: [
      { id: 'carla', nome: 'Carla', abertas: 2 },
      { id: 'igor', nome: 'Igor', abertas: 3 },
    ],
  },
];
const DEPARTAMENTO = Object.fromEntries(DEPARTAMENTOS.map((d) => [d.id, d]));

const CLIENTES = ['Marina Duarte', 'Paulo Souza', 'Júlia Lima', 'Rafael Alves'];

/* Centro de cada avatar de cliente no quadro. A fileira começa em 160 (left
 * 106 + rótulo de 46 + 2 + vão de 6, no CSS) e anda de 30 em 30: avatar de 24
 * mais 6 de vão. A bolha nasce embaixo do avatar de quem escreveu. */
const centroDoCliente = (i) => 172 + i * 30;

/* Quatro assuntos que qualquer empresa reconhece, cada um caindo no
 * departamento que o resolve. A última volta ao Comercial e cai em OUTRA
 * pessoa: é ela que mostra que o departamento tem mais de um responsável. */
const MENSAGENS = [
  { cliente: 0, texto: 'Quero um orçamento', dep: 'comercial', pessoa: 'ana' },
  { cliente: 1, texto: 'Meu pedido atrasou', dep: 'suporte', pessoa: 'bruno' },
  { cliente: 2, texto: 'Preciso da 2ª via do boleto', dep: 'financeiro', pessoa: 'carla' },
  { cliente: 3, texto: 'Vocês parcelam?', dep: 'comercial', pessoa: 'diego' },
];

/* Uma volta, em ms a partir do começo. */
const T = {
  virada: 2000, // o número sai da API não oficial e entra na oficial
  varredura: 700, // o brilho que atravessa o card na virada
  rede: 3300, // clientes e departamentos acendem, e os fios se desenham
  primeira: 4000, // nasce a primeira mensagem
  intervalo: 1800, // de uma mensagem para a seguinte
  some: 13600, // a cena apaga
  volta: 14100, // e recomeça do "antes"
};

/* Dentro de cada mensagem, contado a partir do nascimento dela. */
const M = {
  cliente: 900, // o avatar de quem escreveu fica marcado
  bolha: 1300, // vida da bolha; é a duração da animação pwo-bolha no CSS
  entra: 1100, // a bolha chega no número: pulso no card, e a ficha aparece
  sai: 1250, // a ficha deixa o número
  viagem: 700, // até o departamento
  destaque: 900, // a pessoa que recebeu fica marcada
};
const CHEGADA = M.sai + M.viagem;

/* O estado da cena num instante da volta. Função pura: tudo o que a tela
 * mostra sai daqui, menos a posição da ficha, que muda a cada quadro e vai
 * direto para o DOM (moverFicha) em vez de passar por render. */
function quadroEm(ms) {
  const q = {
    oficial: ms >= T.virada,
    virando: ms >= T.virada && ms < T.virada + T.varredura,
    rede: ms >= T.rede,
    saindo: ms >= T.some,
    // Primeiros instantes da volta: o CSS desliga as transições para tudo
    // pular de volta ao "antes" de uma vez, e não animando ao contrário.
    reinicio: ms < 60,
    recebendo: false,
    cliente: null,
    bolha: null,
    ficha: false,
    // A mensagem da ficha continua valendo depois da chegada, para ela sumir
    // com a cor e o nome do departamento em vez de esvaziar antes de apagar.
    fichaDe: null,
    progresso: 0,
    destaque: null,
    entregues: 0,
  };

  MENSAGENS.forEach((_, i) => {
    const t = ms - (T.primeira + i * T.intervalo);
    if (t < 0) return;
    if (t < M.cliente) q.cliente = MENSAGENS[i].cliente;
    if (t < M.bolha) q.bolha = i;
    if (t >= M.entra && t < M.entra + 350) q.recebendo = true;
    if (t >= M.entra) q.fichaDe = i;
    if (t >= M.entra && t < CHEGADA) {
      q.ficha = true;
      q.progresso = Math.max(0, (t - M.sai) / M.viagem);
    }
    if (t >= CHEGADA) q.entregues = i + 1;
    if (t >= CHEGADA && t < CHEGADA + M.destaque) q.destaque = i;
  });

  return q;
}

/* Quem pediu menos movimento vê a cena resolvida: número oficial, fios
 * desenhados e as quatro conversas já entregues. Mesma informação, parada. */
const QUADRO_PARADO = { ...quadroEm(T.some - 1), reinicio: true };

/* O que, mudando, pede um novo render. O progresso fica de fora: ele muda a
 * cada quadro e só move a ficha. */
const chaveDo = (q) =>
  [
    q.oficial,
    q.virando,
    q.rede,
    q.saindo,
    q.reinicio,
    q.recebendo,
    q.cliente,
    q.bolha,
    q.ficha,
    q.fichaDe,
    q.destaque,
    q.entregues,
  ].join('|');

/* Sai do número na vertical, abre para o lado do departamento e chega no card
 * de novo na vertical. No do meio os quatro pontos ficam na mesma coluna, e a
 * curva vira reta. */
const caminhoAte = (x) =>
  `M${SAIDA.x} ${SAIDA.y} C${SAIDA.x} 232 ${x} 228 ${x} ${TOPO_DOS_DEPARTAMENTOS}`;

/* Acelera na saída e freia na chegada, como algo que é levado e entregue. */
const suave = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

const DESCRICAO =
  'Animação: o número da empresa sai de uma conexão não oficial, bloqueada, ' +
  'para a API Oficial da Meta, sem risco de bloqueio. Depois, as mensagens dos ' +
  'clientes chegam nesse número e se dividem entre os departamentos Comercial, ' +
  'Suporte e Financeiro, cada conversa com o seu responsável.';

/* Só encena enquanto o card está na tela, mesmo motivo dos painéis irmãos:
 * fora de vista o loop só gastaria bateria, e quem rolasse até aqui pegaria a
 * cena no meio em vez de vê-la começar pelo "antes". */
function useNaTela(ref) {
  const [naTela, setNaTela] = useState(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo) return undefined;
    if (typeof IntersectionObserver !== 'function') {
      setNaTela(true);
      return undefined;
    }

    const obs = new IntersectionObserver(
      ([entrada]) => setNaTela(entrada.isIntersecting),
      { threshold: 0.25 },
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [ref]);

  return naTela;
}

function useMenosMovimento() {
  const [menos, setMenos] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMenos(mq.matches);
    const ouvir = (e) => setMenos(e.matches);
    mq.addEventListener?.('change', ouvir);
    return () => mq.removeEventListener?.('change', ouvir);
  }, []);

  return menos;
}

/* Quanto o quadro de 380 x 400 precisa crescer ou encolher para caber no
 * slot. Layout effect, e não effect: medido antes da primeira pintura, a cena
 * não aparece um instante no tamanho errado. clientWidth e não o retângulo
 * da tela, que viria distorcido pelo transform do .reveal em volta. */
function useEscala(ref) {
  const [escala, setEscala] = useState(1);

  useLayoutEffect(() => {
    const alvo = ref.current;
    if (!alvo) return undefined;

    const medir = () => {
      const largura = alvo.clientWidth;
      const altura = alvo.clientHeight;
      if (!largura || !altura) return;
      setEscala(Math.min(largura / LARGURA, altura / ALTURA, ESCALA_MAXIMA));
    };

    medir();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', medir);
      return () => window.removeEventListener('resize', medir);
    }
    const obs = new ResizeObserver(medir);
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [ref]);

  return escala;
}

/* Ícones no traço do Lucide, desenhados inline como no resto do site. */
function Icone({ children, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const CONTORNO_DO_ESCUDO =
  'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z';

function IconeWhatsapp({ tamanho }) {
  return (
    <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#FFF"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      />
    </svg>
  );
}

/* O selo de verificado ao lado de "API Oficial da Meta": verde cheio com o
 * visto em branco, o mesmo desenho do badge-check do Lucide. */
function SeloVerificado() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#128A68"
        d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      />
      <path
        d="m9 12 2 2 4-4"
        fill="none"
        stroke="#FFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Numero({ cena }) {
  let classe = 'pwo-numero';
  if (cena.oficial) classe += ' oficial';
  if (cena.virando) classe += ' virando';
  if (cena.recebendo) classe += ' recebendo';

  return (
    <div className={classe}>
      <span className="pwo-numero-logo">
        <IconeWhatsapp tamanho={34} />
      </span>

      <div className="pwo-numero-txt">
        <strong>Seu número</strong>
        <span className="pwo-par">
          <span className="pwo-antes">
            <Icone>
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </Icone>
            API não oficial
          </span>
          <span className="pwo-depois">
            <img src="logos/meta.svg" alt="" width="15" height="10" />
            API Oficial da Meta
            <SeloVerificado />
          </span>
        </span>
      </div>

      <span className="pwo-escudo pwo-par">
        <Icone className="pwo-antes">
          <path d={CONTORNO_DO_ESCUDO} fill="currentColor" fillOpacity=".12" />
          <path d="m14.5 9.5-5 5" />
          <path d="m9.5 9.5 5 5" />
        </Icone>
        <Icone className="pwo-depois">
          <path d={CONTORNO_DO_ESCUDO} fill="currentColor" fillOpacity=".12" />
          <path d="m9 12 2 2 4-4" />
        </Icone>
      </span>

      <span className="pwo-status pwo-par">
        <span className="pwo-antes">
          <Icone>
            <circle cx="12" cy="12" r="10" />
            <path d="m4.9 4.9 14.2 14.2" />
          </Icone>
          Número bloqueado
        </span>
        <span className="pwo-depois">
          <Icone>
            <path d="M20 6 9 17l-5-5" />
          </Icone>
          Sem risco de bloqueio
        </span>
      </span>
    </div>
  );
}

/* A mensagem nasce embaixo do avatar de quem escreveu e viaja até o número.
 * O movimento é todo do CSS (pwo-bolha); daqui só saem o ponto de partida e o
 * quanto falta até o meio do card. A key no uso remonta o elemento a cada
 * mensagem, e é isso que reinicia a animação. */
function Bolha({ mensagem }) {
  const x = centroDoCliente(mensagem.cliente);

  return (
    <div className="pwo-bolha" style={{ '--x': `${x}px`, '--dx': `${SAIDA.x - x}px` }}>
      {mensagem.texto}
    </div>
  );
}

function Departamento({ dep, ordem, cena }) {
  const emDestaque = cena.destaque !== null ? MENSAGENS[cena.destaque] : null;
  const entregues = MENSAGENS.slice(0, cena.entregues);

  return (
    <div
      className={'pwo-dep' + (emDestaque?.dep === dep.id ? ' chegou' : '')}
      style={{
        left: dep.x - 56,
        '--cor': dep.cor,
        '--fundo': dep.fundo,
        // Os três acendem em cascata, depois que os fios começam a descer.
        '--atraso': `${0.3 + ordem * 0.08}s`,
      }}
    >
      <div className="pwo-dep-topo">
        <span className="pwo-dep-ponto" />
        {dep.nome}
      </div>

      {dep.pessoas.map((pessoa) => {
        const abertas = pessoa.abertas + entregues.filter((m) => m.pessoa === pessoa.id).length;

        return (
          <div
            key={pessoa.id}
            className={'pwo-pessoa' + (emDestaque?.pessoa === pessoa.id ? ' ativa' : '')}
          >
            <span className="pwo-pessoa-av">{pessoa.nome[0]}</span>
            <span className="pwo-pessoa-nome">{pessoa.nome}</span>
            {/* key no número: cada conversa nova remonta o contador, e a
                animação de entrada dele é o "+1" que se vê. */}
            <span key={abertas} className="pwo-pessoa-n">
              {abertas}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function PainelWhatsapp() {
  const caixa = useRef(null);
  const ficha = useRef(null);
  /* Os fios coloridos, um por departamento. É sobre eles que a ficha anda: a
   * posição sai de getPointAtLength, então ficha e traço chegam juntos. */
  const fios = useRef({});

  const naTela = useNaTela(caixa);
  const menosMovimento = useMenosMovimento();
  const escala = useEscala(caixa);
  const [cena, setCena] = useState(() => quadroEm(0));

  useEffect(() => {
    if (menosMovimento) {
      setCena(QUADRO_PARADO);
      return undefined;
    }

    /* Fora da tela a cena congela onde está. Ao voltar, recomeça do zero:
     * o "antes" é metade do argumento, e pegar a volta no meio o esconderia. */
    if (!naTela) return undefined;

    const moverFicha = (i, progresso) => {
      const el = ficha.current;
      const fio = fios.current[MENSAGENS[i].dep];
      if (!el || !fio || typeof fio.getTotalLength !== 'function') return;

      const total = fio.getTotalLength();
      const andado = total * suave(Math.min(Math.max(progresso, 0), 1));
      const ponto = fio.getPointAtLength(andado);
      el.style.transform = `translate(${ponto.x}px, ${ponto.y}px)`;
      fio.style.strokeDasharray = `${total} ${total}`;
      fio.style.strokeDashoffset = String(total - andado);
    };

    let ms = 0;
    let anterior = null;
    let ultimaChave = '';
    let pedido = 0;

    const aCadaQuadro = (agora) => {
      // Passo limitado a 100ms: com a aba em segundo plano o navegador segura o
      // rAF, e na volta a cena não deve saltar metade da história de uma vez.
      if (anterior !== null) ms = (ms + Math.min(agora - anterior, 100)) % T.volta;
      anterior = agora;

      const q = quadroEm(ms);
      const chave = chaveDo(q);
      if (chave !== ultimaChave) {
        ultimaChave = chave;
        setCena(q);
      }
      if (q.ficha) moverFicha(q.fichaDe, q.progresso);

      pedido = window.requestAnimationFrame(aCadaQuadro);
    };

    pedido = window.requestAnimationFrame(aCadaQuadro);
    return () => window.cancelAnimationFrame(pedido);
  }, [naTela, menosMovimento]);

  let classeDaCena = 'pwo-cena';
  // Só com a cena andando: o tremor do "antes" é animação de CSS, e sem esta
  // classe ele rodaria no carregamento da página, com o card ainda fora da
  // tela, e a primeira volta que o visitante vê chegaria parada.
  if (naTela && !menosMovimento) classeDaCena += ' rodando';
  if (cena.rede) classeDaCena += ' rede';
  if (cena.saindo) classeDaCena += ' saindo';
  if (cena.reinicio) classeDaCena += ' reinicio';

  const depDaFicha = cena.fichaDe !== null ? DEPARTAMENTO[MENSAGENS[cena.fichaDe].dep] : null;

  return (
    <div className="painel-wpp pwo" ref={caixa} role="img" aria-label={DESCRICAO}>
      <div className={classeDaCena} style={{ transform: `scale(${escala})` }} aria-hidden="true">
        <div className="pwo-clientes">
          <span className="pwo-rotulo">Clientes</span>
          {CLIENTES.map((nome, i) => (
            <span key={nome} className={'pwo-cliente' + (cena.cliente === i ? ' ativo' : '')}>
              {iniciais(nome)}
            </span>
          ))}
        </div>

        {cena.bolha !== null && <Bolha key={cena.bolha} mensagem={MENSAGENS[cena.bolha]} />}

        <svg
          className="pwo-fios"
          width={LARGURA}
          height={ALTURA}
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          aria-hidden="true"
        >
          {DEPARTAMENTOS.map((d) => (
            <path key={d.id} className="pwo-fio" d={caminhoAte(d.x)} pathLength="1" />
          ))}
          {DEPARTAMENTOS.map((d) => (
            <path
              key={`ativo-${d.id}`}
              ref={(el) => {
                fios.current[d.id] = el;
              }}
              className={'pwo-fio-ativo' + (cena.ficha && depDaFicha?.id === d.id ? ' ativo' : '')}
              d={caminhoAte(d.x)}
              style={{ stroke: d.cor }}
            />
          ))}
        </svg>

        <Numero cena={cena} />

        {/* Sempre no DOM, para o JS ter onde escrever a posição desde o
            primeiro quadro da viagem; aparece e some pela classe. */}
        <span className={'pwo-ficha' + (cena.ficha ? ' voando' : '')} ref={ficha}>
          {depDaFicha && (
            <span className="pwo-ficha-in" style={{ '--cor': depDaFicha.cor }}>
              <span className="pwo-ficha-ic">
                <Icone>
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </Icone>
              </span>
              {depDaFicha.nome}
            </span>
          )}
        </span>

        {DEPARTAMENTOS.map((d, i) => (
          <Departamento key={d.id} dep={d} ordem={i} cena={cena} />
        ))}
      </div>
    </div>
  );
}
