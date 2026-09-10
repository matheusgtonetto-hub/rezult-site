import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AGENTE,
  ALTURA_CABECALHO,
  ALTURA_QUADRO,
  ALTURA_CARD,
  COLUNAS,
  COR_DA_TAG,
  LARGURA_COLUNA,
  LARGURA_QUADRO,
  MS_ANTES_DE_REINICIAR,
  MS_POR_ETAPA,
  ROTEIRO,
  estadoDoQuadro,
  resumoDaColuna,
  xDaColuna,
  yDaPosicao,
} from './pipeline';
import { iniciais } from './nomeColorido';

/* Réplica do kanban do Pipeline do CRM (rezult-crm/src/pages/PipelinePage.tsx).
 *
 * Atributos em camelCase e className: o Preact aceita as duas formas, o React só
 * esta. Escrever na forma restrita mantém o componente válido como React puro. */

const traco = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function IconeCalendario() {
  return <svg {...traco}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function IconeEtiqueta() {
  return <svg {...traco}><path d="M12.6 2.6a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.6 8.6a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8z" /><circle cx="7" cy="7" r="1.2" fill="currentColor" /></svg>;
}
/* O mesmo ícone do WhatsAppIcon.tsx do CRM, o que aparece na sidebar.
 *
 * Ele é autocontido: o círculo verde e o fone branco vivem no mesmo viewBox de
 * 24. Foi por isso que as duas tentativas anteriores saíram tortas -- eu extraía
 * só o caminho do fone e desenhava o círculo no CSS. Além de descentralizar o
 * fone (que sozinho ocupa menos da metade do viewBox), o círculo do CSS era um
 * item flex e podia ser achatado, virando o oval. Com o desenho inteiro dentro
 * do SVG, a proporção não tem como escapar. */
function IconeWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#FFFFFF"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      />
    </svg>
  );
}
function IconeMais() {
  return <svg {...traco}><circle cx="5" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="19" cy="12" r="1.4" fill="currentColor" /></svg>;
}

/* Os cards são posicionados em coordenadas absolutas, e não empilhados dentro
 * das colunas com o fluxo normal.
 *
 * A razão é o movimento: com o card dentro da coluna, mudar de etapa seria
 * removê-lo de um pai e inseri-lo em outro, o que o navegador não tem como
 * animar -- ele sumiria de um lado e apareceria no outro. Em posição absoluta a
 * mudança de coluna é só um par de números novo, e a transição de CSS faz o
 * trajeto. É a mesma razão pela qual bibliotecas de kanban recorrem a FLIP. */
function Card({ card }) {
  return (
    <div
      className="pp-card"
      style={{
        left: xDaColuna(card.coluna),
        top: yDaPosicao(card.posicao),
        width: LARGURA_COLUNA,
        height: ALTURA_CARD,
      }}
    >
      <div className="pp-card-topo">
        <span className="pp-avatar" style={{ background: COLUNAS[card.coluna].cor }}>
          {iniciais(card.nome)}
        </span>
        <span className="pp-card-nome">{card.nome}</span>
        <span className="pp-card-num">#{card.numero}</span>
      </div>

      {/* Responsável: o agente, desde a entrada do lead. O campo já existe no
          produto e já diz quem está com a caneta, então ele conta a automação
          sem inventar elemento que o CRM não tem. */}
      <div className="pp-resp">
        <span className="pp-resp-foto">
          <img src="logo-rezult-preto.png" alt="" width="100" height="100" />
        </span>
        <span className="pp-resp-nome">{AGENTE}</span>
      </div>

      <div className="pp-valor">{card.valor}</div>

      <div className="pp-data">
        <span className="pp-data-ico"><IconeCalendario /></span>
        {card.data}
      </div>

      <div className="pp-wpp"><IconeWhatsapp /></div>

      <div className="pp-rodape">
        <div className="pp-tags">
          {card.tags.map((tg) => (
            <span key={tg} className="pp-tag" style={{ background: COR_DA_TAG[tg] ?? '#888888' }}>
              {tg}
            </span>
          ))}
        </div>
        <span className="pp-etiqueta"><IconeEtiqueta /></span>
      </div>
    </div>
  );
}

/* Mede a largura disponível para descobrir o quanto o quadro precisa encolher.
 * ResizeObserver e não container queries em CSS: é uma conta só e funciona em
 * qualquer navegador que rode o resto do site. */
function useEscala(ref) {
  const [escala, setEscala] = useState(1);

  useLayoutEffect(() => {
    const alvo = ref.current;
    if (!alvo) return undefined;
    const medir = () => {
      const w = alvo.clientWidth;
      const h = alvo.clientHeight;
      if (!w || !h) return;
      /* Cabe na largura E na altura. Olhando só a largura, num slot baixo o
       * quadro estourava a borda de cima do card e as colunas apareciam
       * encostadas no topo, cortadas pelo overflow do painel.
       *
       * Nunca amplia: num slot folgado o quadro fica no tamanho autorado em vez
       * de esticar e borrar as bordas de 1px. */
      setEscala(Math.min(1, w / LARGURA_QUADRO, h / ALTURA_QUADRO));
    };
    medir();
    if (typeof ResizeObserver !== 'function') return undefined;
    const obs = new ResizeObserver(medir);
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [ref]);

  return escala;
}

/* Só encena enquanto o card está na tela, como nos outros dois painéis. */
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

export default function PainelPipeline() {
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
    /* Menos movimento: o quadro no estado final, parado. */
    if (menosMovimento) {
      setPasso(ROTEIRO.length);
      return undefined;
    }
    if (!naTela) return undefined;

    const espera = passo >= ROTEIRO.length ? MS_ANTES_DE_REINICIAR : MS_POR_ETAPA;
    const t = window.setTimeout(
      () => setPasso((p) => (p >= ROTEIRO.length ? 0 : p + 1)),
      espera,
    );
    return () => window.clearTimeout(t);
  }, [passo, naTela, menosMovimento]);

  const cards = estadoDoQuadro(passo);

  return (
    <div className="painel-pipeline" ref={caixa}>
      <div className="pp-palco" ref={palco}>
        <div
          className="pp-quadro"
          style={{ width: LARGURA_QUADRO, height: ALTURA_QUADRO, transform: `scale(${escala})` }}
        >
          {COLUNAS.map((col, i) => (
            <div
              key={col.nome}
              className="pp-coluna"
              style={{ left: xDaColuna(i), width: LARGURA_COLUNA, height: ALTURA_QUADRO }}
            >
              {/* Faixa colorida no topo da coluna, como no funil real. */}
              <span className="pp-coluna-faixa" style={{ background: col.cor }} />
              <div className="pp-coluna-topo" style={{ height: ALTURA_CABECALHO }}>
                <div className="pp-coluna-linha">
                  <span className="pp-coluna-ponto" style={{ background: col.cor }} />
                  <span className="pp-coluna-nome">{col.nome}</span>
                  <span className="pp-coluna-mais"><IconeMais /></span>
                </div>
                <div className="pp-coluna-resumo">{resumoDaColuna(cards, i)}</div>
              </div>
            </div>
          ))}

          {/* Os cards ficam fora das colunas no DOM, justamente para poderem
              atravessar de uma para a outra sem trocar de pai. */}
          {cards.map((c) => (
            <Card key={c.id} card={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
