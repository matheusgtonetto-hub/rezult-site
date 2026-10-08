import { createRoot } from 'react-dom/client';
import PainelWhatsapp from './PainelWhatsapp';
import PainelAutomacao from './PainelAutomacao';
import PainelPipeline from './PainelPipeline';
import PainelDisparos from './PainelDisparos';
import PainelDashboards from './PainelDashboards';

/* Entrada do bundle. Monta cada ilha React no slot que já existe no HTML.
 *
 * Os slots eram preenchidos por MK.whatsapp e MK.automation em mockups.js;
 * aqueles blocos foram removidos e os slots ficaram vazios para o React
 * assumir. Os <div> continuam sendo os mesmos da página, com a classe
 * .feature-visual que define o meio da linha.
 *
 * Os painéis são position: absolute para não influenciar a altura da linha do
 * grid. A classe dá ao slot o position: relative que ancora esse absolute e, no
 * celular, a altura que ele não teria de outro jeito. Vai daqui e não do HTML
 * para o estilo só existir quando o React de fato montou: slot com a classe e
 * sem painel dentro seria um buraco escuro na página.
 *
 * O if em cada um existe porque as outras páginas (planos, politica, termo)
 * carregam este mesmo bundle sem ter os slots, e createRoot em null quebraria o
 * console delas.
 */
const ILHAS = [
  { id: 'featWhatsapp', classe: 'tem-painel-wpp', Painel: PainelWhatsapp },
  { id: 'featDisparos', classe: 'tem-painel-disparos', Painel: PainelDisparos },
  { id: 'featAutomation', classe: 'tem-painel-automacao', Painel: PainelAutomacao },
  { id: 'featPipelines', classe: 'tem-painel-pipeline', Painel: PainelPipeline },
  { id: 'featDashboards', classe: 'tem-painel-dashboards', Painel: PainelDashboards },
];

ILHAS.forEach(({ id, classe, Painel }) => {
  const slot = document.getElementById(id);
  if (!slot) return;
  /* Slot que JÁ tem conteúdo é captura de tela, e o React não entra nele.
   *
   * Desde 08/10/2026 a home mostra o produto de verdade nos cinco recursos, em
   * <img> escrita no HTML. As outras páginas com estes mesmos ids (agentes,
   * ab2, black) seguem com os painéis, e é por isso que a lista acima continua
   * inteira: tirar as entradas daqui apagaria os painéis DELAS junto.
   *
   * A pergunta "tem filho?" é o que separa os dois casos sem precisar de uma
   * lista por página. Slot vazio é do React; slot com imagem é do HTML. */
  if (slot.children.length > 0) return;
  slot.classList.add(classe);
  createRoot(slot).render(<Painel />);
});
