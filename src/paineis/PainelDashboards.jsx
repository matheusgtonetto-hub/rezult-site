import { useEffect, useRef, useState } from 'react';

/* Réplica do dashboard do CRM (rezult-crm, src/pages/DashboardPage.tsx).
 * Vieram de lá o título "Desempenho geral do seu negócio", o seletor de
 * período, os KPIs do topo (Leads entraram, Ganhos, Conversão) e o gráfico de
 * funil com a conversão por etapa, que no produto é o FunnelChart de
 * src/components/ui/funnel-chart.tsx.
 *
 * Atributos em camelCase e className: o Preact aceita as duas formas, o React
 * só esta. Escrever na forma restrita mantém o componente válido como React
 * puro. */

/* Só encena enquanto o card está na tela, mesmo motivo dos painéis irmãos. */
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

const KPIS = [
  { rotulo: 'Leads entraram', valor: 412, variacao: '+18%' },
  { rotulo: 'Ganhos', valor: 64, variacao: '+9%' },
  { rotulo: 'Conversão', valor: 15.5, sufixo: '%', variacao: '+2,4 p.p.' },
];

/* Etapas de um funil comercial comum, com a conversão desde o início, que é
 * uma das duas leituras que o funil do CRM mostra ("Conv. desde o início"). */
const ETAPAS = [
  { nome: 'Entrada', qtd: 412, pct: 100 },
  { nome: 'Qualificado', qtd: 236, pct: 57 },
  { nome: 'Reunião', qtd: 118, pct: 29 },
  { nome: 'Proposta', qtd: 81, pct: 20 },
  { nome: 'Ganho', qtd: 64, pct: 16 },
];

const MS_DEGRAU = 620;

function formata(n, sufixo) {
  if (sufixo === '%') return `${n.toFixed(1).replace('.', ',')}%`;
  return n.toLocaleString('pt-BR');
}

/* Conta do zero até o valor em passos iguais. Sem biblioteca: o painel inteiro
 * precisa caber no bundle que já serve os outros três. */
function useContagem(alvo, ativo, ms = 900) {
  const [n, setN] = useState(ativo ? alvo : 0);

  useEffect(() => {
    if (!ativo) { setN(0); return undefined; }
    const inicio = performance.now();
    let id = 0;
    const passo = (agora) => {
      const t = Math.min((agora - inicio) / ms, 1);
      /* easeOutCubic: começa rápido e assenta, em vez de parar seco. */
      setN(alvo * (1 - Math.pow(1 - t, 3)));
      if (t < 1) id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [alvo, ativo, ms]);

  return n;
}

function Kpi({ dado, anima }) {
  const n = useContagem(dado.valor, anima);
  return (
    <div className="pdb-kpi">
      <span className="pdb-kpi-rotulo">{dado.rotulo}</span>
      <strong className="pdb-kpi-valor">
        {formata(anima ? n : dado.valor, dado.sufixo)}
      </strong>
      <span className="pdb-kpi-var">{dado.variacao}</span>
    </div>
  );
}

export default function PainelDashboards() {
  const caixa = useRef(null);
  const naTela = useNaTela(caixa);
  const menosMovimento = useMenosMovimento();
  const [degrau, setDegrau] = useState(0);

  const anima = naTela && !menosMovimento;

  /* As barras do funil entram uma a uma, de cima para baixo, e o conjunto
   * reinicia quando o card volta à tela. */
  useEffect(() => {
    if (!anima) { setDegrau(ETAPAS.length); return undefined; }
    if (degrau >= ETAPAS.length) return undefined;
    const t = window.setTimeout(() => setDegrau((d) => d + 1), MS_DEGRAU / 2);
    return () => window.clearTimeout(t);
  }, [degrau, anima]);

  useEffect(() => {
    if (!naTela) setDegrau(0);
  }, [naTela]);

  return (
    <div className="painel-dashboards" ref={caixa}>
      <header className="pdb-topo">
        <div>
          <div className="pdb-titulo">Desempenho geral do seu negócio</div>
          <span className="pdb-sub">Atualizado automaticamente</span>
        </div>
        <span className="pdb-periodo">Este mês</span>
      </header>

      <div className="pdb-kpis">
        {KPIS.map((k) => <Kpi key={k.rotulo} dado={k} anima={anima} />)}
      </div>

      <div className="pdb-funil">
        <div className="pdb-funil-cab">
          <span>Conversão do funil</span>
          <span className="pdb-funil-leg">desde o início</span>
        </div>
        <ul className="pdb-etapas">
          {ETAPAS.map((e, i) => (
            <li key={e.nome} className="pdb-etapa">
              <span className="pdb-etapa-nome">{e.nome}</span>
              <span className="pdb-trilho" aria-hidden="true">
                <i style={{ width: i < degrau ? `${e.pct}%` : '0%' }} />
              </span>
              <span className="pdb-etapa-num">{e.qtd}</span>
              <span className="pdb-etapa-pct">{e.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
