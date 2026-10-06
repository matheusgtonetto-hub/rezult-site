import { useEffect, useRef, useState } from 'react';
import { corDoNome, iniciais } from './nomeColorido';

/* Réplica da tela de disparos do CRM (rezult-crm, src/pages/DisparosPage.tsx e
 * src/data/disparos.ts). Vieram de lá os quatro ritmos de envio com as mesmas
 * legendas e cadências, os status de item com os pares de cor exatos do
 * ITEM_STATUS_META (#FEF9C3/#854D0E para criado, #DBEAFE/#1E40AF para em
 * execução, #DCFCE7/#166534 para concluído) e a ideia central do recurso: o
 * disparo sai de um filtro sobre os leads que já estão no CRM, não de uma
 * lista importada.
 *
 * Atributos em camelCase e className: o Preact aceita as duas formas, o React
 * só esta. Escrever na forma restrita mantém o componente válido como React
 * puro. */

/* Só encena enquanto o card está na tela, mesmo motivo dos outros painéis:
 * fora de vista o loop só gastaria bateria, e quem rolasse até aqui pegaria a
 * animação no meio em vez de vê-la começar. */
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

/* Os mesmos quatro ritmos do RHYTHMS do CRM, nas mesmas cadências. "Humano" é
 * o que diferencia o recurso de um disparador comum, então é ele que fica
 * selecionado no painel. */
const RITMOS = [
  { id: 'lento', label: 'Lento', hint: '20/s' },
  { id: 'normal', label: 'Normal', hint: '50/s' },
  { id: 'turbo', label: 'Turbo', hint: '80/s' },
  { id: 'humano', label: 'Humano', hint: '6/min' },
];

const RITMO_ATIVO = 'humano';

/* Os três status vinham do ITEM_STATUS_META do CRM em amarelo, azul e verde.
 * Em cinza eles não podem se distinguir por matiz, então se distinguem por
 * VALOR, e o valor segue a ordem do processo: criado é o mais claro, em
 * execução um degrau abaixo, e concluído é o único preenchido em charcoal com
 * tinta branca. Lido de cima para baixo, o chip escurece conforme o envio
 * anda, o que diz a mesma coisa que as três cores diziam.
 *
 * Contrastes medidos: 4,69:1, 9,15:1 e 13,41:1. */
const STATUS = {
  criado: { label: 'Criado', bg: '#F2F2F2', fg: '#6C6C6C' },
  execucao: { label: 'Em execução', bg: '#E7E7E7', fg: '#3A3A3E' },
  concluido: { label: 'Concluído', bg: '#2D2F33', fg: '#FFFFFF' },
};

const LEADS = [
  { nome: 'Marina Alves', fone: '(11) 9 8842-1190' },
  { nome: 'Rodrigo Pinto', fone: '(21) 9 9713-4408' },
  { nome: 'Camila Duarte', fone: '(31) 9 9254-7731' },
  { nome: 'Thiago Moreira', fone: '(41) 9 8806-2254' },
];

const TOTAL_FILTRADO = 318;
const MS_POR_LEAD = 900;
const MS_ANTES_DE_REINICIAR = 2600;

function Icone({ nome }) {
  /* Traçado no padrão do lucide-react, a biblioteca de ícones do CRM. */
  const c = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  if (nome === 'filtro') return <svg {...c}><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></svg>;
  if (nome === 'relogio') return <svg {...c}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
  if (nome === 'enviar') return <svg {...c}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg>;
  return null;
}

function Avatar({ nome }) {
  return (
    <span className="pd-avatar" style={{ background: corDoNome(nome, 'cliente') }} aria-hidden="true">
      {iniciais(nome)}
    </span>
  );
}

export default function PainelDisparos() {
  const caixa = useRef(null);
  const naTela = useNaTela(caixa);
  const menosMovimento = useMenosMovimento();
  const [enviados, setEnviados] = useState(0);

  useEffect(() => {
    if (menosMovimento) {
      setEnviados(LEADS.length);
      return undefined;
    }
    if (!naTela) return undefined;

    if (enviados >= LEADS.length) {
      const t = window.setTimeout(() => setEnviados(0), MS_ANTES_DE_REINICIAR);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => setEnviados((n) => n + 1), MS_POR_LEAD);
    return () => window.clearTimeout(t);
  }, [enviados, naTela, menosMovimento]);

  /* O contador do cabeçalho acompanha a fila: sobe junto com os itens que
   * mudam para concluído, para o número não ser enfeite. */
  const concluidos = TOTAL_FILTRADO - LEADS.length + enviados;

  return (
    <div className="painel-disparos" ref={caixa}>
      <header className="pd-topo">
        <div className="pd-topo-txt">
          <div className="pd-titulo">Clientes inativos há 60 dias</div>
          <span className="pd-filtro">
            <Icone nome="filtro" />
            {TOTAL_FILTRADO} leads do seu CRM
          </span>
        </div>
        <span className="pd-status">
          <span className="pd-status-ponto" />
          Em andamento
        </span>
      </header>

      <div className="pd-ritmos" role="group" aria-label="Ritmo de envio">
        {RITMOS.map((r) => (
          <span
            key={r.id}
            className={`pd-ritmo${r.id === RITMO_ATIVO ? ' ativo' : ''}`}
          >
            {r.id === RITMO_ATIVO && <Icone nome="relogio" />}
            {r.label}
            <small>{r.hint}</small>
          </span>
        ))}
      </div>

      <div className="pd-progresso">
        <div className="pd-progresso-txt">
          <span><strong>{concluidos}</strong> de {TOTAL_FILTRADO} enviados</span>
          <span className="pd-progresso-pct">
            {Math.round((concluidos / TOTAL_FILTRADO) * 100)}%
          </span>
        </div>
        <div className="pd-barra" aria-hidden="true">
          <i style={{ width: `${(concluidos / TOTAL_FILTRADO) * 100}%` }} />
        </div>
      </div>

      <ul className="pd-fila">
        {LEADS.map((lead, i) => {
          const chave = i < enviados ? 'concluido' : i === enviados ? 'execucao' : 'criado';
          const s = STATUS[chave];
          return (
            <li key={lead.fone} className={`pd-item${chave === 'execucao' ? ' ativo' : ''}`}>
              <Avatar nome={lead.nome} />
              <span className="pd-item-txt">
                <strong>{lead.nome}</strong>
                <small>{lead.fone}</small>
              </span>
              <span className="pd-chip" style={{ background: s.bg, color: s.fg }}>
                {chave === 'execucao' && <Icone nome="enviar" />}
                {s.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
