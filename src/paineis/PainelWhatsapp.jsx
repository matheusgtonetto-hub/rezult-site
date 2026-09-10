import { useEffect, useRef, useState } from 'react';
import { corDoNome, iniciais } from './nomeColorido';
import {
  AGENTE,
  LEAD,
  LINHA,
  MS_ANTES_DE_REINICIAR,
  MS_ANTES_DE_DIGITAR,
  PASSO_INICIAL,
  ROTEIRO,
  msDigitando,
} from './conversa';

/* Réplica da coluna de conversa do Multiatendimento (rezult-crm,
 * src/pages/MultiatendimentoPage.tsx). Cores, raios e tamanhos vieram de lá:
 * bolha do agente #128A68 à direita com raio 16/4/16/16, bolha do lead branca
 * à esquerda com 4/16/16/16 e borda #EEE, fundo #FAFAFA, cabeçalho branco com
 * borda #E5E5E5.
 *
 * Atributos em camelCase e className: o Preact aceita as duas formas, o React
 * só esta. Escrever na forma restrita mantém o componente válido como React
 * puro, o que permite trocar o preact/compat pelo React real sem reescrever. */

/* Só encena enquanto o card está na tela. Sem isto o loop giraria o tempo todo
 * no meio de uma página longa, gastando bateria fora de vista, e quem rolasse
 * até aqui pegaria a conversa no meio em vez de vê-la do começo. */
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

function IconeWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" className="pw-ico-wpp" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#FFF"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      />
    </svg>
  );
}

function AvatarLead({ tamanho }) {
  return (
    <span
      className="pw-avatar"
      style={{
        width: tamanho,
        height: tamanho,
        fontSize: tamanho <= 28 ? 10 : 11,
        background: corDoNome(LEAD, 'cliente'),
      }}
      aria-hidden="true"
    >
      {iniciais(LEAD)}
    </span>
  );
}

/* O logo da Rezult à direita das falas do agente. É um acréscimo do site, não
 * uma cópia do CRM: no Multiatendimento só o lead tem avatar, porque lá quem
 * responde é quem está olhando a tela. Aqui a cena precisa dizer, em cada
 * mensagem, que do outro lado não tem ninguém digitando.
 *
 * logo-rezult-preto.png e não logo-rezult.png: aquele tem 1080px, fundo branco
 * chapado (RGB, sem canal alfa) e folga em volta da marca, o que dentro de um
 * círculo de 28px renderia um R minúsculo cercado de branco. Este tem 100px,
 * fundo transparente e recorte justo.
 *
 * O caminho é relativo à página, e não ao bundle: o navegador resolve src de
 * <img> a partir do documento, então "logo-rezult-preto.png" da raiz vale
 * mesmo com o script servido de build/. */
function AvatarAgente({ tamanho }) {
  return (
    <span
      className="pw-avatar pw-avatar-agente"
      style={{ width: tamanho, height: tamanho }}
      aria-hidden="true"
    >
      <img src="logo-rezult-preto.png" alt="" width="100" height="100" />
    </span>
  );
}

function Mensagem({ msg }) {
  const doAgente = msg.de === 'agente';
  const quem = doAgente ? AGENTE : LEAD;

  /* Cada lado com o seu avatar, e cada um do lado de fora da sua bolha: a lead
   * à esquerda, o robô à direita. */
  return (
    <div className={'pw-linha' + (doAgente ? ' pw-linha-agente' : '')}>
      {!doAgente && <AvatarLead tamanho={28} />}
      <div className="pw-bloco">
        <div className="pw-quem">
          <span style={{ color: corDoNome(quem, doAgente ? 'atendente' : 'cliente') }}>{quem}</span>
          <span className="pw-hora"> • {msg.hora}</span>
        </div>
        <div className={'pw-bolha' + (doAgente ? ' pw-bolha-agente' : '')}>{msg.texto}</div>
      </div>
      {doAgente && <AvatarAgente tamanho={28} />}
    </div>
  );
}

/* Os três pontinhos aparecem dos dois lados, cada um com a bolha do seu dono:
 * verde à direita para a agente, branca à esquerda (com avatar) para a lead.
 * Sem isto a lead respondia instantaneamente enquanto só a agente "pensava", e
 * a cena denunciava que o outro lado era roteiro. */
function Digitando({ de }) {
  const doAgente = de === 'agente';

  return (
    <div className={'pw-linha' + (doAgente ? ' pw-linha-agente' : '')}>
      {!doAgente && <AvatarLead tamanho={28} />}
      <div className="pw-bloco">
        <div className={'pw-bolha pw-digitando' + (doAgente ? ' pw-bolha-agente' : '')}>
          <span className="pw-ponto" />
          <span className="pw-ponto" />
          <span className="pw-ponto" />
        </div>
      </div>
      {doAgente && <AvatarAgente tamanho={28} />}
    </div>
  );
}

export default function PainelWhatsapp() {
  const caixa = useRef(null);
  const naTela = useNaTela(caixa);

  /* Quantas mensagens já entraram. A próxima a entrar é ROTEIRO[passo].
   * Começa em PASSO_INICIAL para a fala de abertura da lead já estar na tela
   * no primeiro render, sem piscar um chat vazio antes. */
  const [passo, setPasso] = useState(PASSO_INICIAL);
  /* Quem está digitando agora: 'lead', 'agente' ou ninguém. Era um booleano
   * quando só a agente digitava. */
  const [digitando, setDigitando] = useState(null);

  const menosMovimento =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    /* Quem pediu menos movimento recebe a conversa inteira parada: mesma
     * informação, sem loop nem pontinhos piscando. */
    if (menosMovimento) {
      setDigitando(null);
      setPasso(ROTEIRO.length);
      return undefined;
    }

    /* Fora da tela a encenação congela onde está. Voltar a aparecer retoma dali,
     * e o reinício continua sendo o fim do roteiro. */
    if (!naTela) return undefined;

    if (passo >= ROTEIRO.length) {
      const t = window.setTimeout(() => setPasso(PASSO_INICIAL), MS_ANTES_DE_REINICIAR);
      return () => window.clearTimeout(t);
    }

    /* Cada turno tem dois tempos dentro do mesmo intervalo: um respiro em
     * silêncio, que é quem vai falar lendo o que chegou, e os três pontinhos
     * até a mensagem entrar. O respiro sai de dentro da duração e não se soma a
     * ela, então mudar MS_ANTES_DE_DIGITAR não altera o tamanho da volta. */
    const proxima = ROTEIRO[passo];
    const duracao = msDigitando(proxima.de);

    setDigitando(null);
    const tPontinhos = window.setTimeout(() => setDigitando(proxima.de), MS_ANTES_DE_DIGITAR);
    const tMensagem = window.setTimeout(() => {
      setDigitando(null);
      setPasso((p) => p + 1);
    }, duracao);

    return () => {
      window.clearTimeout(tPontinhos);
      window.clearTimeout(tMensagem);
    };
  }, [passo, naTela, menosMovimento]);

  return (
    <div className="painel-wpp" ref={caixa}>
      <header className="pw-topo">
        <AvatarLead tamanho={32} />
        <div className="pw-topo-txt">
          <div className="pw-topo-nome">{LEAD}</div>
          <span className="pw-pill">
            <IconeWhatsapp />
            {LINHA}
          </span>
        </div>
        <span className="pw-status">
          <span className="pw-status-ponto" />
          Agente ativo
        </span>
      </header>

      {/* Coluna ancorada embaixo: quando as mensagens passam da altura do card,
          as mais antigas sobem e são cortadas pelo overflow, como num chat de
          verdade. Sem medir nada, sem remover nó do DOM na mão. */}
      <div className="pw-msgs">
        {ROTEIRO.slice(0, passo).map((msg, i) => (
          <Mensagem key={`${msg.hora}-${i}`} msg={msg} />
        ))}
        {digitando && <Digitando de={digitando} />}
      </div>
    </div>
  );
}
