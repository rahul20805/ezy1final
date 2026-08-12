# Design Brief: Ezy1

**Direction**: Vibrant, maximalist-optimistic super app celebrating India's hyperlocal abundance. Energetic trust through bold color, generous affordances, and warm micro-interactions.

**Tone**: Approachable yet reliable. Not sterile, not playful — confidently connecting millions across urban and rural India with one platform.

**Palette** (OKLCH):

| Name | Light | Dark | Intent |
| --- | --- | --- | --- |
| Primary (Saffron) | 0.62 0.24 71 | 0.68 0.23 71 | Energy, trust, India heritage |
| Secondary (Teal) | 0.52 0.21 188 | 0.58 0.2 188 | Innovation, discovery, growth |
| Accent (Deep Indigo) | 0.3 0.18 262 | 0.45 0.22 262 | Stability, expertise, confidence |
| Background | 0.98 0.01 56 | 0.12 0.01 262 | Warm cream (light), deep indigo (dark) |
| Foreground | 0.2 0.02 245 | 0.95 0.01 56 | High contrast, readable hierarchy |

**Typography**:

- Display: Bricolage Grotesque (bold, friendly, craft-inspired)
- Body: DM Sans (clean, accessible, modern)
- Mono: Geist Mono (technical precision)

**Shape Language**: 12px border-radius throughout (generous, friendly, not clinical). Layered card hierarchy with `shadow-subtle` and `shadow-elevated`.

**Structural Zones**:

| Zone | Treatment | Intent |
| --- | --- | --- |
| Header | Saffron accent bar + cream background; sticky navigation | Authority, directional clarity |
| Hero | Saffron-to-teal gradient; large, bold display text | Emotional hook, India-forward |
| Cards | Cream/white with subtle shadows; saffron accents on CTA | Trust, legibility, action clarity |
| Footer | Deep indigo background; cream text | Foundation, stability |
| Alternating Sections | Muted backgrounds (teal-tinted, cream) | Rhythm, visual rest |

**Spacing & Rhythm**: 8px baseline grid. Generous padding on mobile (16–24px), tighter on desktop (32px containers). Compact form inputs, spacious card stacks.

**Component Patterns**:

- **Buttons**: Primary (saffron BG), Secondary (teal outline), Destructive (red). All use `transition-smooth` for 0.3s hover state.
- **Cards**: `shadow-subtle` default, `shadow-elevated` on hover/active.
- **Forms**: Teal focus ring; muted background inputs; saffron success state.
- **Navigation**: Hamburger on mobile (primary color); horizontal menu on desktop with teal underline for active.

**Motion**:

- `fade-in` (0.4s): Hero, modals, lazy-loaded sections
- `slide-down` (0.3s): Dropdown menus, alerts, notifications
- `transition-smooth`: All interactive state changes (hover, focus, active)

**Constraints**:

- No gradients except primary/hero hero sections (anti-generic).
- OKLCH tokens only (no hex, no rgb literals).
- Mobile-first responsive breakpoints: sm (640px), md (768px), lg (1024px).
- Minimum text contrast AA+ in both light and dark modes.
- No more than 3 font weights per family; prefer 400/600/700.

**Signature Detail**: Saffron accent bar on header + warm micro-interactions (smooth transitions, subtle shadows) create a cohesive, confidence-building experience. Every interaction feels intentional and trustworthy.

**Accessibility**: Clear hierarchy through size + color, high contrast text, focus states on all interactive elements, semantic HTML, touch-friendly targets (min 44px).
