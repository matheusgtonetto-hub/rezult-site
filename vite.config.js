import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

/* Vite em library mode, e não como dono do site.
 *
 * O rezult-site é estático: a Vercel serve os arquivos da raiz direto
 * (outputDirectory ".") e as cinco páginas HTML não passam por bundler nenhum.
 * Trazer o Vite para gerenciar tudo isso significaria mexer em cada página que
 * já está no ar. Em library mode ele compila só os painéis, num arquivo único
 * que o index.html carrega com um <script src> comum, igual já faz com o
 * mockups.js e o main.js. Nada mais do site muda.
 *
 * outDir é "build" e não ".": com a raiz como saída, um emptyOutDir ligado por
 * engano apagaria o repositório inteiro. "build" já está no .gitignore, então
 * o bundle não entra em commit -- quem o gera é o `vercel-build`.
 *
 * O preset do Preact aponta react e react-dom para preact/compat. O código dos
 * painéis é React de verdade (mesmo JSX, mesmos hooks); o que muda é que ele
 * chega ao navegador em ~4KB em vez de ~45KB, o que importa numa landing page
 * onde o LCP é a métrica. Trocar para o React real é remover este plugin e
 * instalar react + react-dom, sem tocar em nenhum componente.
 */
export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    // Alvos alinhados com o resto do site, que não usa transpilação nenhuma.
    target: 'es2019',
    lib: {
      entry: 'src/paineis/main.jsx',
      formats: ['iife'],
      name: 'RezultPaineis',
      fileName: () => 'paineis.js',
    },
  },
});
