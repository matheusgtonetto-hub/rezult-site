# Rezult CRM Landing Page — Estratégia de Copywriting

**Data:** 2026-05-31  
**Projeto:** rezult-landing  
**Abordagem escolhida:** Transformação primeiro

---

## Contexto

Landing page do Rezult CRM (Next.js 15, Tailwind v4, Framer Motion). Objetivo: refinar todo o copy da página para aumentar conversão de demo agendada.

---

## Audiência

Mix de três perfis simultâneos:

- **Frio** — chegou por ads ou SEO, nunca ouviu falar do produto. Precisa entender o problema e a solução.
- **Morno** — foi indicado ou viu nas redes. Está comparando opções e quer saber se pode confiar.
- **Quente** — buscou o nome diretamente. Quer confirmar preço e detalhes antes de assinar.

---

## Principais Objeções

1. **Preço/ROI** — "Parece caro, não sei se justifica." Resolve com ancoragem de ROI e linguagem de resultado.
2. **Confiança** — "Nunca ouvi falar, como sei que é confiável?" Resolve com logos de clientes e depoimentos reais posicionados cedo na página.

> As duas objeções se reforçam: sem prova social, o preço parece mais alto. Resolver B resolve parte do A.

---

## Diferencial Central

Combinação de dois eixos:
- **Tudo em um lugar** — pipeline + WhatsApp + IA + automações funcionando nativamente, sem depender de Zapier ou API externa para funcionar. Integrações (Z-API, webhooks) existem e são um ponto forte, mas como extensão — não como requisito.
- **Começa no mesmo dia** — sem onboarding complexo, setup rápido, consultoria gratuita incluída.

---

## Hierarquia de CTAs

Válida para todo o site (Hero, CTA final, cards de Nicho):

| Posição | Texto | Ação |
|---------|-------|------|
| Primário | `CONSULTAR PLANOS →` | Ancora na seção Preços |
| Secundário | `Agendar demo` | Abre `DemoModal` existente (`src/components/DemoModal.tsx`) |

Em **Pricing**, os botões de cada plano mantêm `Começar grátis` — o visitante já está na etapa de decisão.

> Trial: **7 dias grátis** (atualizado de 14 dias em toda a LP).

---

## Arco Narrativo — 6 Atos

Ordem das seções na página:

```
Hero
  ↓
Logos de clientes (novo — sobe para cá)
  ↓
Funcionalidades
  ↓
Comparativo
  ↓
Depoimentos (novo — substitui SocialProof atual)
  ↓
Nichos
  ↓
Preços
  ↓
FAQ
  ↓
CTA Final
  ↓
Footer
```

---

## Copy por Seção

### Hero

**Tag pill:**
```
7 DIAS GRÁTIS · SEM CARTÃO · CONSULTORIA GRATUITA
```

**Headline:**
```
Do primeiro contato
ao contrato assinado.
```

**Subheadline:**
```
CRM com WhatsApp, pipeline e automações inteligentes.
Seu time começa a vender no mesmo dia.
```

**CTAs:**
- Primário: `CONSULTAR PLANOS →`
- Secundário (link): `Agendar demo`

---

### Logos de Clientes *(seção nova)*

Faixa horizontal logo abaixo do Hero com logos de empresas que usam o Rezult. Sem título — a presença dos logos fala por si.

Requisito: mínimo 4–5 logos autorizados. Fundo escuro com logos em branco/cinza (PNG ou SVG com `filter: brightness(0) invert(1)`).

Implementar como `LogosBar.tsx` com scroll automático horizontal infinito via Framer Motion `animate={{ x }}` — mesmo padrão do `Comparison.tsx`. Se menos de 4 logos disponíveis, usar layout estático centralizado sem scroll.

---

### Funcionalidades (BentoFeatures)

**Header da seção:**
- Atual: *"Mais que tecnologia. Você ganha visão, ritmo e controle."*
- Novo: **"O que acontece quando tudo funciona junto?"**

**Títulos dos cards (feature → resultado):**

| Card | Atual | Novo |
|------|-------|------|
| 1 | Pipeline visual | Kanbans avançados e automatizados |
| 2 | Pilot IA integrado | Rezult-Pilot integrado aos fluxos |
| 3 | Automações inteligentes | Fluxos de automação inteligentes |
| 4 | WhatsApp no centro | Multiatendimento conectado |
| 5 | BI interno e relatórios | BI interno e controle total |
| 6 | Multiatendimento | Integrações e API avançada |

**Descrições aprovadas pelo produto:**

1. **Kanbans avançados e automatizados** — No RezultCRM, cada etapa do seu funil ganha vida com Kanbans inteligentes que se adaptam ao seu processo comercial.
2. **Rezult-Pilot integrado aos fluxos** — Detecte intenção de compra, sentimento e comportamento, e tome decisões automáticas com base em dados reais.
3. **Fluxos de automação inteligentes** — Organize leads e clientes em jornadas reais. Automatize mensagens, tarefas, condições e ações por etapa.
4. **Multiatendimento conectado** — WhatsApp, Instagram, Facebook e mais tudo num só lugar, com distribuição inteligente, fila, SLAs e métricas.
5. **BI interno e controle total** — Visualize seu funil com dados de verdade: LTV, CAC, tempo por etapa, taxa de conversão por origem, vendedor e produto.
6. **Integrações e API avançada** — O limite é a sua criatividade. Conecte qualquer coisa, automatize tudo.

---

### Comparativo

**Headline:**
```
Enquanto em outros CRMs você precisa de várias ferramentas paralelas,
com o Rezult você tem tudo integrado.
```

**Sub-headline:**
```
IA, automações, dados, atendimento e jornadas integradas
tudo funcionando junto, no seu ritmo.
```

---

### Depoimentos *(seção nova — substitui SocialProof atual)*

**Assets disponíveis:** depoimentos com nome, cargo e empresa + logos de clientes.

**Requisitos mínimos:**
- 3 depoimentos reais com foto, nome completo, cargo e empresa
- Ideal: 5–6 cobrindo segmentos diferentes (agência, e-commerce, SaaS, consultoria)
- Formato: cards em grid ou carrossel horizontal

---

### Preços

**Linha de ancoragem de ROI** *(antes da tabela de preços):*
```
Quantos negócios seu time perde por semana sem um follow-up automático?
Um negócio a mais por mês já paga o plano inteiro.
```

Trial: **7 dias grátis**, sem cartão de crédito.

---

### CTA Final

**Headline:**
```
Leve seu negócio para o próximo nível
```

**Subheadline:**
```
Mergulhe nas vantagens da nossa plataforma de CRM
e testemunhe o impacto no seu negócio.
```

**CTAs:**
- Primário: `CONSULTAR PLANOS →`
- Secundário: `Agendar demo`

---

## Prova Social — Assets a Coletar

Antes de implementar, garantir:

- [ ] Lista de logos de clientes com autorização para uso público
- [ ] Mínimo 3 depoimentos escritos com: nome completo, cargo, empresa, foto (200×200px+)
- [ ] Números da plataforma (opcional para versão futura): empresas ativas, negócios fechados

---

## O que NÃO muda

- Estrutura técnica das seções (componentes, animações, layout)
- Seção Nichos — copy já adequado
- Seção FAQ — copy já adequado
- Pricing — valores e features dos planos permanecem
- Identidade visual — cores, tipografia, dark theme

---

## Implementação

Escopo de mudanças de código:

1. **Hero.tsx** — tag pill, headline, subheadline, CTAs (ordem + textos)
2. **BentoFeatures.tsx** — header da seção + 6 títulos e descrições dos cards
3. **Comparison.tsx** — headline + subheadline
4. **SocialProof.tsx** — renomear para `Testimonials.tsx` e reescrever completamente com dados reais (array de depoimentos com `name`, `role`, `company`, `avatar`, `text`)
5. **Pricing.tsx** — adicionar linha de ancoragem de ROI; atualizar "14 dias" → "7 dias"
6. **CTA.tsx** — headline, subheadline, CTAs
7. **Criar `LogosBar.tsx`** — faixa de logos abaixo do Hero
8. **page.tsx** — inserir `<LogosBar />` entre `<Hero />` e `<BentoFeatures />`; subir prova social na ordem
9. **Busca global por "14 dias"** → substituir por "7 dias" em toda a LP
