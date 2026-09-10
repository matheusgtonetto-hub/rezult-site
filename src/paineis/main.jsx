import { createRoot } from 'react-dom/client';
import PainelWhatsapp from './PainelWhatsapp';

/* Entrada do bundle. Monta cada ilha React no slot que já existe no HTML.
 *
 * #featWhatsapp era preenchido por MK.whatsapp em mockups.js; aquele bloco foi
 * removido e o slot ficou vazio para o React assumir. O <div> continua sendo o
 * mesmo da página, com a classe .feature-visual que define o meio da linha.
 *
 * O if existe porque as outras páginas (planos, politica, termo) carregam este
 * mesmo bundle sem ter o slot, e createRoot em null quebraria o console delas.
 */
const slot = document.getElementById('featWhatsapp');
if (slot) {
  /* O painel é position: absolute para não influenciar a altura da linha do
   * grid. A classe dá ao slot o position: relative que ancora esse absolute e,
   * no celular, a altura que ele não teria de outro jeito. Vai daqui e não do
   * HTML para o estilo só existir quando o React de fato montou: slot com a
   * classe e sem painel dentro seria um buraco escuro na página. */
  slot.classList.add('tem-painel-wpp');
  createRoot(slot).render(<PainelWhatsapp />);
}
