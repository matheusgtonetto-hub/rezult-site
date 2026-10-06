import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ETAPAS,
  LARGURA_FLUXO,
  LARGURA_NO,
  LARGURA_VIEWPORT,
  MS_ANTES_DE_REINICIAR,
  MS_CAMERA,
  MS_POR_PARTE,
  NOS,
  msDaEtapa,
} from './fluxo';

/* Réplica do canvas de automações do CRM (rezult-crm,
 * src/pages/AutomacoesPage.tsx). Vieram de lá o fundo pontilhado de 20px, o nó
 * branco com borda #D1D5DB e raio 12, o chip verde #F0FDF4/#86EFAC do gatilho, o
 * laranja #FFF7ED/#FED7AA das ações, a bolinha azul #378ADD da porta de saída, a
 * linha ortogonal tracejada #CBD5E1 e a tela de seleção de duas colunas com a
 * barra lateral de categorias e os cards de opção que acendem em #F0FDF4.
 *
 * Atributos em camelCase e className: o Preact aceita as duas formas, o React só
 * esta. Escrever na forma restrita mantém o componente válido como React puro. */

const COR = { inicio: '#00B873', campos: '#22C55E', acoes: '#F97316' };

/* Altura, medida do topo do nó, em que a linha entra e sai. É o meio do
 * cabeçalho: o nó aqui não tem o rodapé de métricas que o do CRM tem. */
const Y_DA_PORTA = 30;

function Icone({ nome }) {
  /* Traçado no padrão do lucide-react, que é a biblioteca de ícones do CRM:
   * viewBox 24, stroke 2, pontas e junções arredondadas. */
  const c = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  if (nome === 'inicio') return <svg {...c} fill="currentColor" stroke="none"><path d="M6 4l14 8-14 8z" /></svg>;
  if (nome === 'campos') return <svg {...c}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>;
  if (nome === 'acoes') return <svg {...c}><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></svg>;
  if (nome === 'telefone') return <svg {...c}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>;
  if (nome === 'lead') return <svg {...c}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  if (nome === 'responsavel') return <svg {...c}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>;
  if (nome === 'seta') return <svg {...c}><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
  return null;
}

/* Mesma construção do buildOrthPath do CRM: segue na horizontal, vira com um
 * canto arredondado, desce ou sobe, vira de novo e entra no nó seguinte sempre
 * pela esquerda. Com os nós na mesma altura o caminho vira um traço reto. */
function caminho(x1, y1, x2, y2) {
  const dy = y2 - y1;
  if (Math.abs(dy) < 2) return `M ${x1} ${y1} H ${x2}`;

  const vx = Math.min((x1 + x2) / 2, x2 - 28);
  const sy = dy > 0 ? 1 : -1;
  const s1 = vx >= x1 ? 1 : -1;
  const r1 = Math.max(0, Math.min(12, Math.abs(vx - x1) - 0.5, Math.abs(dy / 2) - 0.5));
  const r2 = Math.max(0, Math.min(12, Math.abs(x2 - vx) - 0.5, Math.abs(dy / 2) - 0.5));
  if (r1 < 0.5 || r2 < 0.5) return `M ${x1} ${y1} H ${vx} V ${y2} H ${x2}`;

  return `M ${x1} ${y1} H ${vx - s1 * r1} Q ${vx} ${y1} ${vx} ${y1 + sy * r1} V ${y2 - sy * r2} Q ${vx} ${y2} ${vx + r2} ${y2} H ${x2}`;
}

/* O ponteiro. Vive dentro do canvas, então desliza junto com a câmera: ele é
 * parte do desenho, e não um cursor do sistema por cima dele. A ponta do ícone
 * fica no canto superior esquerdo do viewBox, por isso left/top recebem a
 * coordenada exata do alvo, sem compensação. */
function Cursor({ x, y, pressionado, ms }) {
  return (
    <div
      className={'pa-cursor' + (pressionado ? ' pa-cursor-pressionado' : '')}
      style={{ left: x, top: y, transitionDuration: `${ms}ms` }}
      aria-hidden="true"
    >
      <span className="pa-cursor-anel" />
      <svg viewBox="0 0 24 24" className="pa-cursor-seta">
        <path
          d="M5 2.5 5 19.2 9.3 15.2 12.1 21.4 15.1 20 12.3 13.9 18.2 13.6z"
          fill="#111111"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* A tela de seleção que abre quando a linha é solta. Versão compacta do diálogo
 * do CRM (620x480, duas colunas): barra lateral de categorias à esquerda, cards
 * de opção à direita. `acesa` marca a opção sob o ponteiro, que no CRM é o
 * estado de hover -- borda no verde da marca e fundo #F0FDF4. */
function Picker({ picker, x, y, acesa }) {
  return (
    <div className="pa-picker" style={{ left: x, top: y }}>
      <div className="pa-picker-lado">
        <div className="pa-picker-titulo">{picker.titulo}</div>
        {picker.categorias.map((cat, i) => (
          <div key={cat} className={'pa-picker-cat' + (i === picker.catAtiva ? ' pa-picker-cat-ativa' : '')}>
            {cat}
          </div>
        ))}
      </div>
      <div className="pa-picker-lista">
        {picker.opcoes.map((op, i) => (
          <div key={op.titulo} className={'pa-picker-op' + (acesa && i === 0 ? ' pa-picker-op-acesa' : '')}>
            <span className="pa-picker-seta"><Icone nome="seta" /></span>
            <span className="pa-picker-txt">
              <span className="pa-picker-op-titulo">{op.titulo}</span>
              <span className="pa-picker-op-desc">{op.descricao}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function No({ no, mostrarChip }) {
  const cor = COR[no.tipo];
  const doGatilho = no.tipo === 'inicio';

  return (
    <div className="pa-no" style={{ left: no.x, top: no.y, width: LARGURA_NO }}>
      <div className="pa-no-topo">
        <span className="pa-no-ico" style={{ color: cor }}><Icone nome={no.tipo} /></span>
        <span className="pa-no-titulo">{no.titulo}</span>
      </div>

      <div className="pa-no-corpo">
        {mostrarChip ? (
          <div className={'pa-chip ' + (doGatilho ? 'pa-chip-gatilho' : 'pa-chip-' + no.tipo)}>
            {doGatilho ? (
              <>
                <div className="pa-chip-titulo">{no.chip.titulo}</div>
                <div className="pa-chip-desc">{no.chip.descricao}</div>
              </>
            ) : (
              <>
                <span className="pa-chip-ico" style={{ color: cor }}><Icone nome={no.chip.icone} /></span>
                <span className="pa-chip-txt">{no.chip.titulo}</span>
              </>
            )}
          </div>
        ) : (
          /* Guarda a altura do chip que vai entrar. Sem isso o nó cresceria no
             instante em que o chip cai e sacudiria a linha já desenhada. */
          <div className={'pa-chip-vazio' + (doGatilho ? ' pa-chip-vazio-alto' : '')} />
        )}

        {/* A bolinha azul fica em TODO nó, e não só no Início: é dela que o
            ponteiro puxa o passo seguinte, e é o que o CRM mostra. O rótulo
            "Quando o evento ocorrer, então" só existe no gatilho. */}
        <div className={'pa-porta' + (no.porta ? '' : ' pa-porta-nua')}>
          {no.porta && <span>{no.porta}</span>}
          <span className="pa-porta-ponto" />
        </div>
      </div>
    </div>
  );
}

/* Mede a largura disponível para descobrir o quanto o enquadramento precisa
 * encolher. ResizeObserver e não container queries em CSS: é uma conta só,
 * funciona em qualquer navegador que rode o resto do site, e o número medido
 * fica disponível para o componente. */
function useEscala(ref) {
  const [escala, setEscala] = useState(1);

  useLayoutEffect(() => {
    const alvo = ref.current;
    if (!alvo) return undefined;

    const medir = () => {
      const w = alvo.clientWidth;
      if (!w) return;
      /* Nunca amplia: num slot largo demais o canvas fica no tamanho autorado em
       * vez de esticar e borrar as bordas de 1px. */
      setEscala(Math.min(1, w / LARGURA_VIEWPORT));
    };

    medir();
    if (typeof ResizeObserver !== 'function') return undefined;
    const obs = new ResizeObserver(medir);
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [ref]);

  return escala;
}

/* Só encena enquanto o card está na tela, como no painel de WhatsApp: sem isso o
 * loop giraria fora de vista e quem rolasse até aqui pegaria o fluxo no meio. */
function useNaTela(ref) {
  const [naTela, setNaTela] = useState(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo) return undefined;
    if (typeof IntersectionObserver !== 'function') {
      setNaTela(true);
      return undefined;
    }
    const obs = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { threshold: 0.25 });
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [ref]);

  return naTela;
}

export default function PainelAutomacao() {
  const caixa = useRef(null);
  const palco = useRef(null);
  const naTela = useNaTela(caixa);
  const escala = useEscala(palco);

  const [passo, setPasso] = useState(0);

  const menosMovimento =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    /* Menos movimento: o último par de nós montado, parado. */
    if (menosMovimento) {
      setPasso(ETAPAS.length);
      return undefined;
    }
    if (!naTela) return undefined;

    if (passo >= ETAPAS.length) {
      const t = window.setTimeout(() => setPasso(0), MS_ANTES_DE_REINICIAR);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => setPasso((p) => p + 1), msDaEtapa(ETAPAS[passo].parte));
    return () => window.clearTimeout(t);
  }, [passo, naTela, menosMovimento]);

  /* O slice vai até passo + 1: cada coisa aparece no INÍCIO da sua etapa e a
   * duração dela é quanto tempo fica à vista antes da próxima. Terminando no
   * `passo`, a etapa em curso seria tempo morto e o elemento surgiria só no fim
   * dela -- a linha ficaria desenhada apontando para um nó que ainda não existe. */
  const feitas = new Set(ETAPAS.slice(0, passo + 1).map((e) => `${e.no}:${e.parte}`));
  const jaTem = (id, parte) => feitas.has(`${id}:${parte}`);

  const emCurso = ETAPAS[Math.min(passo, ETAPAS.length - 1)];
  const iAtual = NOS.findIndex((n) => n.id === emCurso.no);
  const noAtual = NOS[iAtual];
  const anterior = NOS[iAtual - 1];

  /* A câmera enquadra o par (anterior, atual). Enquanto o primeiro nó é montado
   * não há anterior, então ela fica no começo do canvas. */
  const cameraX = anterior ? anterior.x : 0;

  const abrindoPicker = emCurso.parte === 'picker';
  const clicando = emCurso.parte === 'clique';
  const pressionando = emCurso.parte === 'mouse';
  const arrastando = emCurso.parte === 'arrasta';
  const pickerAberto = abrindoPicker || clicando;

  /* Onde o ponteiro está em cada tempo: na bolinha do nó anterior ao pressionar,
   * no ponto de entrada do nó novo ao arrastar, e sobre a opção escolhida
   * enquanto a tela de seleção está aberta. A transição de CSS entre elas é que
   * faz o trajeto. */
  let cursor = null;
  if (anterior && noAtual) {
    const naPorta = { x: anterior.x + LARGURA_NO, y: anterior.y + Y_DA_PORTA };
    const naSolta = { x: noAtual.x, y: noAtual.y + Y_DA_PORTA };
    if (pressionando) cursor = naPorta;
    else if (arrastando) cursor = naSolta;
    else if (pickerAberto) cursor = { x: noAtual.x + 118, y: noAtual.y + 62 };
  }

  const msCursor = arrastando ? MS_POR_PARTE.arrasta : MS_POR_PARTE.picker;
  const alturaFluxo = Math.max(...NOS.map((n) => n.y)) + 168;

  return (
    <div className="painel-automacao" ref={caixa}>
      <div className="pa-palco" ref={palco}>
        {/* A câmera recorta o enquadramento; o fluxo desliza dentro dela. */}
        <div
          className="pa-camera"
          style={{ width: LARGURA_VIEWPORT, height: alturaFluxo, transform: `scale(${escala})` }}
        >
          <div
            className="pa-fluxo"
            style={{
              width: LARGURA_FLUXO,
              height: alturaFluxo,
              transform: `translateX(${20 - cameraX}px)`,
              transitionDuration: `${MS_CAMERA}ms`,
            }}
          >
            {/* A linha se desenha por recorte, e não por stroke-dashoffset: o
                traço é tracejado (5,5, como no CRM) e o dashoffset já está
                ocupado pelo próprio tracejado. transform-box: fill-box faz o
                scaleX(0) colapsar o retângulo no seu canto esquerdo, que é onde
                a linha começa. */}
            <svg className="pa-linhas" width={LARGURA_FLUXO} height={alturaFluxo} aria-hidden="true">
              <defs>
                {NOS.slice(1).map((no, i) => {
                  const x1 = NOS[i].x + LARGURA_NO;
                  return (
                    <clipPath key={no.id} id={`pa-corte-${no.id}`} clipPathUnits="userSpaceOnUse">
                      <rect
                        className={'pa-corte' + (jaTem(no.id, 'arrasta') ? ' pa-corte-feito' : '')}
                        x={x1}
                        y={0}
                        width={Math.max(1, no.x - x1)}
                        height={alturaFluxo}
                        /* Mesma duração da etapa de arrasto, da mesma constante
                           que move o cursor: é o que faz a ponta da linha e o
                           ponteiro chegarem juntos. */
                        style={{ transitionDuration: `${MS_POR_PARTE.arrasta}ms` }}
                      />
                    </clipPath>
                  );
                })}
              </defs>

              {NOS.slice(1).map((no, i) => {
                const ant = NOS[i];
                const d = caminho(ant.x + LARGURA_NO, ant.y + Y_DA_PORTA, no.x, no.y + Y_DA_PORTA);
                return <path key={no.id} d={d} className="pa-linha" clipPath={`url(#pa-corte-${no.id})`} />;
              })}
            </svg>

            {NOS.map((no) =>
              jaTem(no.id, 'no') ? <No key={no.id} no={no} mostrarChip={jaTem(no.id, 'chip')} /> : null,
            )}

            {pickerAberto && noAtual?.picker && (
              <Picker picker={noAtual.picker} x={noAtual.x} y={noAtual.y + 14} acesa={clicando} />
            )}

            {cursor && (
              <Cursor x={cursor.x} y={cursor.y} pressionado={pressionando || clicando} ms={msCursor} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
