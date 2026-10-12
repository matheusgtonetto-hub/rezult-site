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
  { rotulo: 'Total de negócios', valor: 'R$ 10.890', apoio: '312 negócios' },
  { rotulo: 'Total em vendas', valor: 'R$ 7.130', apoio: '9 negócios' },
  { rotulo: 'Total perdidos', valor: 'R$ 200', apoio: '98 negócios' },
  { rotulo: 'Em aberto', valor: 'R$ 3.560', apoio: '205 negócios' },
];

export default function PainelDashboards() {
  const caixa = useRef(null);
  const naTela = useNaTela(caixa);
  const menosMovimento = useMenosMovimento();
  const anima = naTela && !menosMovimento;

  return (
    <div className={`painel-dashboards${anima ? ' pdb-animar' : ''}`} ref={caixa}>
      <header className="pdb-topo">
        <div>
          <div className="pdb-titulo">Dashboards</div>
          <span className="pdb-sub">Aqui, 1 Jan 26 · Sáb, 10 Out 26</span>
        </div>
        <span className="pdb-periodo">⌄&nbsp; Selecione o período</span>
      </header>

      <div className="pdb-filtros" aria-label="Visualizações do dashboard">
        <span className="ativo">◔&nbsp; Performance Geral</span>
        <span>▽&nbsp; Por Pipeline</span>
        <span>♧&nbsp; Da Equipe</span>
      </div>

      <div className="pdb-kpis">
        {KPIS.map((k) => (
          <div className="pdb-kpi" key={k.rotulo}>
            <span className="pdb-kpi-rotulo">{k.rotulo}</span>
            <strong className="pdb-kpi-valor">{k.valor}</strong>
            <span className="pdb-kpi-var">novo ↗</span>
            <small>{k.apoio}</small>
          </div>
        ))}
      </div>

      <div className="pdb-resultados">
        <div className="pdb-grafico">
          <div className="pdb-bloco-cab">
            <div><strong>Resultado no período</strong><span>A evolução das suas vendas no período</span></div>
            <span className="pdb-medida">Quantidade</span>
          </div>
          <svg viewBox="0 0 390 132" role="img" aria-label="Gráfico de resultado no período">
            <path className="pdb-grade" d="M20 18H374M20 51H374M20 84H374M20 117H374" />
            <path className="pdb-linha pdb-linha--escura" d="M22 19C87 21 127 28 183 39C228 48 244 61 269 91C291 116 313 116 374 65" />
            <path className="pdb-linha pdb-linha--coral" d="M22 63C81 87 127 102 183 114C228 119 286 117 374 117" />
            <path className="pdb-linha pdb-linha--verde" d="M22 117C70 107 101 104 137 108C175 113 221 117 374 117" />
            <g className="pdb-eixos"><text x="20" y="130">Jun</text><text x="104" y="130">Jul</text><text x="190" y="130">Ago</text><text x="277" y="130">Set</text><text x="355" y="130">Out</text></g>
          </svg>
        </div>

        <div className="pdb-responsavel">
          <div className="pdb-bloco-cab"><div><strong>Resultado por responsável</strong><span>Veja os ganhos por pessoa</span></div></div>
          <div className="pdb-donut"><b>9</b><span>ganhos</span></div>
        </div>
      </div>
    </div>
  );
}
