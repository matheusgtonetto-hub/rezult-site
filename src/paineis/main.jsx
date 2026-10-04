import { createRoot } from 'react-dom/client';
import PainelWhatsapp from './PainelWhatsapp';
import PainelAutomacao from './PainelAutomacao';
import PainelPipeline from './PainelPipeline';

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
  { id: 'featAutomation', classe: 'tem-painel-automacao', Painel: PainelAutomacao },
  { id: 'featPipelines', classe: 'tem-painel-pipeline', Painel: PainelPipeline },
];

ILHAS.forEach(({ id, classe, Painel }) => {
  const slot = document.getElementById(id);
  if (!slot) return;
  slot.classList.add(classe);
  createRoot(slot).render(<Painel />);
});
