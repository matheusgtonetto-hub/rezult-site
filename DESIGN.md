---
version: "2.2"
name: "Rezult CRM Marketing Site"
description: "Light, conversion-focused Rezult CRM marketing system with emerald accents, operational typography, and product-led proof."
defaultMode: "light"
supportsDark: scoped   # ver mode_rule: escopos escuros existem, tema escuro global nao
archetype: "Operational SaaS · Emerald on warm white"
chips:
  - "Inter"
  - "Emerald #00B873"
  - "Light surfaces"
  - "Lucide 1.75"

consumer_contract:
  standalone: true
  goal: "Generate Rezult CRM marketing interfaces that remain visually compatible with rezult-site."
  priority_order:
    - "Use the site semantic tokens before raw colors."
    - "Reuse existing component classes before creating new variants."
    - "Use Lucide-compatible icons only, with the Rezult stroke and size rules."
    - "Keep conversion content direct, operational, and evidence-led."
  mode_rule: "The marketing site is light-first and greyscale. Dark surfaces are scoped, never global: product mockups and intentional proof islands. Scoped dark blocks must redefine the tokens inside a container class, as .mockup does. All five pages carry body.ds-crm, which adds the Rezult Design System structure layer (type roles for the fine print, radii, elevation, motion, focus ring); the palette itself lives in the :root of styles.css and home.css. See greyscale_rule."
  dark_ink_rule: "Dark scopes follow the rezult-crm sales surface, whose canonical palette is the VENDA object in rezult-crm/src/lib/superficie-de-venda.ts. Surfaces #05080A / #0C1115 / #131A1E (the same three blacks this site already has in --dark-bg, --dark-surface, --dark-surface-2). Ink on a dark surface is #F4F6F4 or lighter. No glow: VENDA zeroes brilhoSuave and brilhoVerde on purpose, the standout comes from card-versus-canvas contrast, not from a halo."
  greyscale_rule: "The whole site uses black, white and grey only, no green anywhere, as of 05/10/2026. They keep the full Rezult Design System structure from rezult-crm/docs/design-system/rezult-design-system.md: the eleven type roles, the six radii, the four shadows, the comfortable density. Only the hue is dropped. Translation of the green roles: highlight surface (button, pill, active toggle, badge) becomes --neutral-900 with WHITE ink, inverted because charcoal on charcoal is unreadable; emphasis ink (green text, check icon, savings) becomes --neutral-900; tinted surfaces become --neutral-50 / --neutral-100 / --neutral-200; the struck anchor price becomes --neutral-600, since in greyscale the strike carries the meaning, not the hue; testimonial stars become --neutral-700. Over the inverted footer the filled button flips to white with charcoal ink. The green tokens of :root (--primary, --green-text, --green-cta, --verde-titulo, --border-active, --glow*) keep their names and now point at the neutral ramp: 30-plus rules read them, so repointing beats renaming. Token names that say green and resolve to charcoal are intentional; the value is what counts.

    Where a colour carried meaning, the greyscale translation uses VALUE, not hue, and the direction matters: on light surfaces weak is lighter and strong is darker, and inside the dark #passivo-ativo block it inverts. Mapping purely by luminance would have made the active column lighter than the passive one, because red is darker than green. Specific scales: the three Disparos status chips go pale / light / filled-charcoal so the chip darkens as the send progresses; the pipeline stage colours go --neutral-600/700/800 so a deal that advances gets darker; the automation block categories go 900/700/500; the nomeColorido palettes split into two disjoint value bands, dark for the customer and mid for the agent, so the two sides still never collide.

    Third-party brand colours are the only hue left, and they are identification, not palette: #25D366 (WhatsApp), #0668E1 (Meta) and the integration-marquee logos in home.js and main.js (Instagram, Meta, Meet, Google Calendar, Hotmart, Kiwify). Do not grey them.

    Two hand-tuned display scales are deliberately NOT governed by the DS type roles: .hero h1 in home.css (48px / 700 / 1.10 / -2.5px) and .h2 (40px / -1.2px). They were dialled in by the owner value by value; the Display role would loosen the tracking and tighten the leading."
  font_rule: "Use Inter for UI and editorial copy; JetBrains Mono only for identifiers and compact technical labels."
  asset_rule: "Use the existing Rezult logo and product imagery. Do not recolor or synthesize replacement brand marks."
  accessibility_rule: "Ship WCAG AA contrast, visible focus rings, keyboard-operable controls, and no body text below 16px."

colors:
  primary: "#00B873"
  primary-foreground: "#04140D"
  secondary: "#07100D"
  secondary-foreground: "#FFFFFF"
  background: "#FBFBFB"
  foreground: "#000000"
  card: "#F6F6F6"
  card-foreground: "#07100D"
  popover: "#FFFFFF"
  popover-foreground: "#07100D"
  muted: "#EFEFEF"
  muted-foreground: "#575757"
  accent: "#00B873"
  accent-foreground: "#04140D"
  destructive: "#EF4444"
  destructive-foreground: "#FFFFFF"
  border: "#DDDDDD"
  input: "#E9E9E9"
  ring: "#00B873"
  surface-container-low: "#FBFBFB"
  surface-container: "#F6F6F6"
  surface-container-high: "#EFEFEF"
  surface-container-highest: "#E7E7E7"
  surface-bright: "#FFFFFF"
  surface-dim: "#E7E7E7"
  surface-inverse: "#05080A"
  surface-inverse-foreground: "#F4F6F4"
  emerald: "#00B873"
  emerald-hover: "#33CC96"
  emerald-pressed: "#009A60"
  ink-green: "#07100D"
  body-grey: "#575757"
  icon-default: "#575757"
  icon-strong: "#07100D"

fonts:
  sans: "Inter, Helvetica Neue, Helvetica, Arial, sans-serif"
  serif: "Inter, Helvetica Neue, Helvetica, Arial, sans-serif"
  mono: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  display: "Inter, Helvetica Neue, Helvetica, Arial, sans-serif"

typography:
  display:
    fontFamily: "Inter"
    fontSize: "2.625rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0em"
  heading:
    fontFamily: "Inter"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  body-large:
    fontFamily: "Inter"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0em"
  caption:
    fontFamily: "Inter"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0em"
  overline:
    fontFamily: "Inter"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.08em"
  mono:
    fontFamily: "JetBrains Mono"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"

spacing:
  "0": "0px"
  "1": "2px"
  "2": "4px"
  "3": "6px"
  "4": "8px"
  "5": "10px"
  "6": "12px"
  "7": "14px"
  "8": "16px"
  "9": "20px"
  "10": "24px"
  "11": "28px"
  "12": "32px"
  "14": "40px"
  "16": "48px"
  "20": "64px"
  "24": "80px"
  section-mobile: "70px"
  section-desktop: "120px"

rounded:
  none: "0px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  "2xl": "20px"
  "3xl": "28px"
  full: "9999px"
  button: "10px"
  card: "20px"
  input: "10px"
  icon-tile: "10px"

shadows:
  xs: "0 1px 2px rgba(7,16,13,0.05)"
  sm: "0 2px 8px rgba(7,16,13,0.07)"
  md: "0 10px 28px rgba(7,16,13,0.09)"
  lg: "0 18px 50px rgba(7,16,13,0.12)"
  xl: "0 28px 80px rgba(7,16,13,0.16)"

motion:
  duration-faster: "80ms"
  duration-fast: "120ms"
  duration-normal: "180ms"
  duration-gentle: "260ms"
  duration-slow: "400ms"
  duration-slower: "650ms"
  easing-standard: "cubic-bezier(0.2, 0, 0, 1)"
  easing-decelerate: "cubic-bezier(0.16, 1, 0.3, 1)"
  easing-accelerate: "cubic-bezier(0.4, 0, 1, 1)"

elevation:
  flat: "none"
  raised: "0 1px 2px rgba(7,16,13,0.05), 0 4px 16px rgba(7,16,13,0.05)"
  floating: "0 4px 8px rgba(7,16,13,0.06), 0 12px 30px rgba(7,16,13,0.08)"
  overlay: "0 12px 40px rgba(7,16,13,0.14)"
  modal: "0 24px 70px rgba(7,16,13,0.18)"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.button}"
    padding: "12px 30px"
    typography: "16px / 1 600"
  button-primary-hover:
    backgroundColor: "{colors.emerald-pressed}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.button}"
    padding: "12px 30px"
    typography: "16px / 1 600"
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.card}"
    padding: "{spacing.9}"
  input-text:
    backgroundColor: "{colors.surface-bright}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.input}"
    height: "44px"
  badge-default:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.sm}"
    padding: "5px 10px"
  nav-header:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    height: "70px"
  icon:
    backgroundColor: "{colors.background}"
    textColor: "{colors.icon-default}"
    size: "20px"
    width: "20px"
    height: "20px"
  icon-tile:
    backgroundColor: "{colors.card}"
    textColor: "{colors.icon-default}"
    rounded: "{rounded.icon-tile}"
    size: "48px"
    width: "48px"
    height: "48px"
  hero-benefit:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "15px / 1.3 500"

pattern_tokens:
  motion:
    duration-fast: "{motion.duration-fast}"
    easing-standard: "{motion.easing-standard}"
  focus:
    outline: "3px solid rgba(0,184,115,0.35)"
    outline_offset: "2px"
  elevation:
    raised: "{elevation.raised}"
    modal: "{elevation.modal}"
  z_index_scale:
    navigation: "90"
    overlay: "100"
    modal: "300"
    tooltip: "500"

preview_tokens:
  surface_bg: "{colors.background}"
  surface_fg: "{colors.foreground}"
  cta_bg: "{colors.primary}"
  cta_fg: "{colors.primary-foreground}"

brand_primitives:
  marketing-emerald: "{colors.primary}"
  heading-ink: "{colors.ink-green}"
  dark-product-island: "{colors.surface-inverse}"
  icon-library: "Lucide"
  icon-stroke: "1.75"

aliases:
  green-text: "primary"
  green-cta: "primary"
  ink: "ink-green"
  bg: "background"
  surface: "card"
  text-muted: "muted-foreground"

assets:
  logo:
    path: "logos/logo-rezult.png"
    usage: "Navigation and branded site surfaces"
  favicon:
    path: "Favicon.png"
    usage: "Browser identity"

showcase:
  headline: "O lead chega às 22h. O Rezult atende, qualifica e agenda."
  headlineHtml: "O lead chega às 22h. O Rezult atende, qualifica e agenda."
  kicker: "100% Integrado com Inteligência Artificial"
  lead: "Seu time vende. O Rezult trabalha 24 horas para que nenhuma oportunidade fique esperando."
  layout: "centered"
  ctas:
    - label: "Teste grátis"
      href: "https://app.rezultcrm.com/register"
      variant: "primary"
    - label: "Ver planos"
      href: "planos.html"
      variant: "secondary"
---

## 1. Visual Theme & Atmosphere

Rezult CRM uses a light, operational SaaS language: warm-white canvases, quiet grey cards, black-green headings, and one emerald accent. The page should feel precise and active, with the product and commercial evidence doing more work than decoration.

The marketing site may use dark product islands to frame screenshots or operational simulations. Those islands are exceptions; the global canvas remains light and should not drift into a dark-theme aesthetic.

## 2. Color Palette & Roles

Emerald `#00B873` is the only brand accent on the marketing site. Use it for primary actions, selected states, focus, small status cues, and limited emphasis. Do not introduce purple, generic blue gradients, or unrelated decorative hues.

Headings use the green-black `#07100D`; body text uses `#575757`; large reading surfaces use `#FBFBFB`, `#F6F6F6`, and `#EFEFEF`. The border tokens convert the site's translucent black borders against its light canvas into stable hex values for this specification.

Red, amber, blue, and purple exist in the CSS only for semantic data displays. They are not available as decorative marketing accents. The benefit icons therefore use neutral icon ink and a neutral tile rather than turning every glyph emerald.

## 3. Typography Rules

Inter is the only editorial and interface family. Display text is bold and direct; section headings use Semibold; paragraphs use Regular. Negative tracking is reserved for headings at 18px and above.

JetBrains Mono is limited to identifiers, measurements, small technical labels, and operational mockups. It should not be used for promotional paragraphs or buttons.

## 4. Components

Primary buttons use emerald with dark ink and a 10px radius. Secondary actions are transparent with an emerald hairline. Cards sit on quiet grey surfaces and use spacing, borders, and restrained elevation instead of decorative color.

Icons use Lucide-compatible glyphs only. Standard stroke is `1.75`; sizes are 16px in controls, 18px in navigation and headers, and 20px in supporting marketing tiles. Do not use emoji, Unicode symbols, or hand-drawn SVG paths.

Non-interactive icon tiles use a 48px square, 10px radius, quiet surface, hairline border, and neutral icon ink. The tile may accompany text but should not resemble a clickable button.

## 4b. Patterns

Focus uses an emerald ring with visible offset. Motion uses fast color changes and gentle enter transitions, with no bounce, spring, or parallax.

Elevated cards combine a subtle border with a cool shadow. Dark product mockups stay visually separate from light proof cards rather than blending through translucent glass effects.

## 5. Layout Principles

The site uses a 1200px maximum wrapper with 32px desktop gutters and 22px mobile gutters. Major sections use 120px vertical spacing on desktop and 70px on mobile.

Content should reflow instead of disappearing. Three-column proof rows may collapse to one column on phones, while preserving icon-to-label alignment and consistent rhythm.

## 6. Depth & Elevation

Most surfaces are flat or minimally raised. Borders and tonal differences establish hierarchy before shadows; large shadows are reserved for overlays, product previews, and intentional floating surfaces.

Do not add frosted glass or colored glows to routine cards. The emerald glow token is restricted to primary conversion emphasis and must remain subtle on the light canvas.

## 7. Do's and Don'ts

Do:

- Use emerald as the single decorative brand accent.
- Use Lucide-compatible icons with 1.75 stroke.
- Keep icons neutral at rest and dark when emphasized.
- Use Inter with clear weight contrast.
- Reuse existing wrappers, cards, and responsive breakpoints.
- Preserve all information across desktop, tablet, and mobile.
- Pair cards with a hairline before adding a shadow.
- Keep commercial copy short, concrete, and operational.

Don't:

- Do not introduce purple or generic blue gradients.
- Do not use emoji or Unicode characters as functional icons.
- Do not draw custom glyphs when Lucide has a semantic equivalent.
- Do not color every icon emerald.
- Do not use pure decorative color without a semantic or brand role.
- Do not round every surface into a pill.
- Do not remove proof or functionality on mobile.
- Do not hardcode a new brand color inside a component.

## 8. Responsive Behavior

Desktop and tablet retain multi-column structures when labels remain readable. At 560px and below, proof and benefit groups stack into one column, align left, and preserve the icon-to-text relationship.

Headline line breaks may be editorially fixed above the phone breakpoint and natural on phones. Controls remain finger-sized, content remains present, and horizontal product surfaces may scroll rather than compress illegibly.

## 9. Agent Prompt Guide

### Quick Color Reference

- Primary CTA: Rezult emerald (`#00B873`)
- Brand accent: Rezult emerald (`#00B873`)
- Surface canvas: warm white (`#FBFBFB`)

### Example Component Prompts

Generate a Rezult CRM proof row with a light operational layout. Use:

- Background: `{colors.background}`
- Heading: `{typography.heading}` in `{colors.ink-green}`
- Lead: `{typography.body}` in `{colors.muted-foreground}`
- Primary CTA: `{components.button-primary}`
- Supporting icons: `{components.icon}` inside `{components.icon-tile}`

### Iteration Guide

1. Confirm that every new color maps to an existing token.
2. Confirm that every functional glyph maps to Lucide.
3. Verify mobile, tablet, and desktop before delivery.

## 10. Fidelity Notes

shadows_detected: true
fonts_proprietary: []
icons_not_captured: false
photography_not_captured: false
alpha_lost: ["border rgba(0,0,0,.12) mapped to #DDDDDD on #FBFBFB", "border-2 rgba(0,0,0,.07) mapped to #E9E9E9 on #FBFBFB"]

The production marketing site is the primary source for colors, typography, spacing, and responsive behavior. The Rezult CRM Design System package is the primary source for iconography: Lucide, 1.75 stroke, neutral ink, and no hand-drawn glyphs.

## 11. Implementation

Stack: static HTML/CSS/JavaScript + Preact 10 panels + Vite 7 library build. The marketing pages are served directly; Vite compiles only the embedded product panels.

Token source of truth: `home.css` for the marketing surface, `site-typography.css` for the shared typography primitives, and this `DESIGN.md` for usage rules. Components root: `index.html` and `src/paineis/`. Regenerate by re-extracting those files and the canonical Rezult design package; do not create independent color values.

Tailwind config: not used. shadcn/ui: not used. The token layers are primitive CSS values, semantic aliases in `:root`, and component classes consuming those aliases.

### Token → CSS mapping

| Token | CSS usage |
|---|---|
| `colors.primary` | `var(--primary)` / `var(--green-text)` |
| `colors.background` | `var(--bg)` |
| `colors.card` | `var(--surface)` |
| `colors.muted` | `var(--surface-2)` |
| `rounded.button` | `var(--r-sm)` |
| `rounded.card` | `var(--r-lg)` |
| `spacing.8` | `16px` gaps |

Icons are embedded as Lucide-compatible SVG markup so the static site does not add a runtime CDN dependency. Each icon keeps `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.75"`, rounded caps, and rounded joins.
