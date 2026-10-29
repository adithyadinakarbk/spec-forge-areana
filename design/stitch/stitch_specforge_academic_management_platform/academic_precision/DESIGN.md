---
name: Academic Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#43474e'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f87'
  primary: '#022448'
  on-primary: '#ffffff'
  primary-container: '#1e3a5f'
  on-primary-container: '#8aa4cf'
  inverse-primary: '#adc8f5'
  secondary: '#006b5d'
  on-secondary: '#ffffff'
  secondary-container: '#80f3dd'
  on-secondary-container: '#006f61'
  tertiary: '#142538'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a3a4f'
  on-tertiary-container: '#94a4bd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#adc8f5'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#2d486d'
  secondary-fixed: '#83f6e0'
  secondary-fixed-dim: '#65dac4'
  on-secondary-fixed: '#00201b'
  on-secondary-fixed-variant: '#005046'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
  code-tabular:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-dense: 0.75rem
  margin: 2rem
  margin-compact: 1.25rem
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system establishes an authoritative, focused, and frictionless authoring environment tailored for university faculty, department chairs, and curriculum accreditation boards. Course specification authoring is dense, cognitively demanding, and subject to rigid institutional compliance. The interface departs from cumbersome legacy higher-education portals by balancing bureaucratic rigor with contemporary editorial clarity.

The visual direction combines **Modern Corporate Minimalism** with structured **Information Architecture**. The visual tone evokes institutional prestige, clarity, and uncompromising precision. Chrome and interface ornamentation are suppressed to foreground structured content: learning outcomes, credit distribution, syllabus modules, and accreditation mapping matrices. High visual quietness reduces fatigue during prolonged documentation sessions, while crisp accent points signal validation states, version milestones, and structural completeness.

## Colors

The palette balances administrative authority with clean analytical functionality:

- **Primary (`#1E3A5F` - Deep Navy):** Anchors primary brand touchpoints, top-level navigation shells, primary action triggers, and authoritative structural headers.
- **Secondary / Accent (`#0F9D8A` - Vibrant Teal):** Used intentionally for active interactive states, inline completion indicators, affirmative validations, progress metrics, and key authoring callouts.
- **Surface Canvas (`#F5F7FA` - Soft Grey):** A low-strain, warm-neutral desktop background that eliminates stark glare during prolonged authoring.
- **Surface Layer (`#FFFFFF` - Crisp White):** Dedicated to document canvases, data grids, modal panels, and content cards.
- **Text & Hierarchy:** `#1F2937` (Charcoal) handles high-contrast body and heading copy, while `#64748B` (Slate) demotes structural metadata, field labels, and secondary table parameters.
- **Borders & Dividers:** `#E2E8F0` (Light Grey) establishes hairline discipline across dense cell grids, panel boundaries, and input perimeters without visual noise.
- **Status Semantics:**
  - *Success / Accredited:* `#16A34A` (Emerald Green) paired with a 10% tint background (`#DCFCE7`).
  - *Warning / Pending Revision:* `#D97706` (Amber) paired with a 10% tint background (`#FEF3C7`).
  - *Error / Non-Compliant:* `#DC2626` (Crimson Red) paired with a 10% tint background (`#FEE2E2`).

## Typography

The typographic hierarchy combines **Plus Jakarta Sans** for structural section titles and editorial document banners with **Inter** for data tables, operational forms, and analytical interfaces.

1. **Academic Scannability:** Headlines use tighter negative tracking (`-0.025em` to `-0.01em`) to maintain a clean, compact posture suitable for dense workspace layouts.
2. **Tabular Numerics:** All numeric figures in data tables, credit units, ECTS counts, contact hours, and scoring rubrics must enforce OpenType tabular figures (`font-feature-settings: "tnum" 1, "cv05" 1`). This prevents jagged column misalignment across dense matrices.
3. **Micro-Labels & Status:** All tertiary meta-tags, field requirements, and status badges utilize `label-md` and `label-sm` with slight uppercase kerning (`0.02em` to `0.04em`) to ensure legibility at compact dimensions.

## Layout & Spacing

The layout is built around an enterprise desktop-first philosophy, prioritizing multi-column workflows, persistent side-rail validation, and wide data mapping surfaces:

- **Desktop Authoring Grid:** Primary viewport operates on a structured 12-column or 16-column layout with a fixed left workspace rail (64px collapsed, 240px expanded) and an optional contextual inspection sidebar (320px–380px) for real-time validation checks.
- **Rhythm & Padding:** Component spacing adheres to a strict 4px/8px modular base. Data-intensive authoring tables employ compact internal cell heights (36px–40px) to maximize visible matrix content, while top-level structural containers use `space-xl` and `space-2xl` to establish clear section boundaries.
- **Multi-pane Reflow:**
  - *Large Desktop (≥1440px):* Three-column view (Navigation tree, active authoring canvas, validation & compliance matrix rail).
  - *Standard Desktop / Laptop (1024px–1439px):* Two-column view with the validation panel collapsed into an overlay drawer or docked bottom sheet.
  - *Tablet / Review Mode (768px–1023px):* Single authoring column with horizontal scroll affordances for cross-credit mapping tables.

## Elevation & Depth

This design system avoids heavy shadows, artificial skeuomorphism, and hazy blurs in favor of flat structural clarity and crisp architectural layering:

- **Flat Baseline (Level 0):** Canvas background (`#F5F7FA`) provides the ground layer.
- **Structured Surface (Level 1):** Main document sheets, data grids, and form containers sit at Level 1, delineated by a razor-sharp 1px border (`#E2E8F0`) with no drop shadow.
- **Contextual Popovers & Dropdowns (Level 2):** Context menus, taxonomy lookups, and auto-suggest modals feature a restrained shadow: `0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)` over a 1px `#E2E8F0` border.
- **Modal Dialogues & Inspection Drawers (Level 3):** Accreditation validation flyouts and deep audit dialogs use: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Active Structural Focus:** Selection states and keyboard focuses avoid glowing diffusions, employing instead a crisp 2px solid ring (`#0F9D8A`) with a 2px offset.

## Shapes

The geometric framework is categorized as **Soft (Level 1)**, conveying professional sobriety and institutional structure:

- **Core Interactive Elements:** Buttons, text fields, select inputs, and dropdown panels use an exact radius of `0.25rem` (4px).
- **Cards, Panels & Data Containers:** Large card surfaces and table wrappers leverage `rounded-lg` (`0.5rem` / 8px) to cleanly define contained workspaces without soft or playful distractions.
- **Status Badges & Mapping Cells:** Compact tags and inline indicator chips maintain a controlled `0.25rem` (4px) corner radius. Full pill radii are strictly prohibited to avoid casual consumer aesthetics.

## Components

### 1. Buttons & Triggers
- **Primary:** Background `#1E3A5F`, text `#FFFFFF`, radius 4px, height 36px (compact) or 40px (standard). Hover: `#152A45`. Active: `#0F1D30`.
- **Secondary / Action:** Border 1px `#1E3A5F`, background transparent, text `#1E3A5F`. Hover: background `#F1F5F9`.
- **Subtle / Ghost:** Border transparent, text `#64748B`. Hover: background `#E2E8F0`, text `#1F2937`.
- **Destructive:** Border 1px `#DC2626`, background transparent, text `#DC2626`. Hover: background `#FEE2E2`.

### 2. Form Inputs & Inline Validation
- **Standard Field:** Background `#FFFFFF`, border 1px `#E2E8F0`, radius 4px, text `#1F2937`, placeholder `#94A3B8`. Height 38px.
- **Focus State:** Border 1px `#0F9D8A`, outline 2px solid `#0F9D8A` with 2px offset.
- **Inline Validation Feedback:** Fields display a 1px border colored by state (`#DC2626` for errors, `#16A34A` for valid compliance). Error text appears directly beneath the input with an inline alert icon in 12px (`label-md`).

### 3. Academic Tables & Mapping Grids
- **Header:** Background `#F8FAFC`, text `#64748B`, font `label-md`, uppercase, border-bottom 1px `#E2E8F0`. Height 36px.
- **Data Rows:** Background `#FFFFFF`, alternating hover state `#F8FAFC`, border-bottom 1px `#E2E8F0`. Compact vertical padding (8px top/bottom).
- **Alignment Matrix Cells:** Bidirectional mapping check-cells (e.g., Program Learning Outcomes vs. Course Learning Outcomes) feature centered interactive toggle nodes with high-contrast active states (`#0F9D8A` fill) and keyboard arrow navigation.

### 4. Status Badges & Role Chips
- **Role Chips:** Background `#EDF2F7`, border 1px `#CBD5E1`, text `#1E3A5F`, font `label-md`, radius 4px, padding 2px 8px.
- **Compliance Badges:**
  - *Valid / Approved:* Background `#DCFCE7`, border 1px `#86EFAC`, text `#15803D`.
  - *Needs Review:* Background `#FEF3C7`, border 1px `#FCD34D`, text `#B45309`.
  - *Missing Prerequisite / Error:* Background `#FEE2E2`, border 1px `#FCA5A5`, text `#B91C1C`.

### 5. Validation Banners & Alerts
- **Layout:** Edge-to-edge within content blocks or persistent sticky banners at document tops. Left accent border 4px wide.
- **Colors:**
  - *Error Banner:* Background `#FEF2F2`, border-left `#DC2626`, header text `#991B1B`.
  - *Warning Banner:* Background `#FFFBEB`, border-left `#D97706`, header text `#92400E`.
  - *Validation Passed:* Background `#F0FDF4`, border-left `#16A34A`, header text `#166534`.

### 6. Progress Steppers & Accreditation Stages
- **Track:** Horizontal rule 2px `#E2E8F0` connecting discrete stage nodes.
- **Completed Nodes:** Circle 24px, fill `#1E3A5F`, white checkmark glyph.
- **Current Active Node:** Circle 24px, border 2px `#0F9D8A`, white interior with 8px `#0F9D8A` center core dot.
- **Upcoming Nodes:** Circle 24px, border 1px `#CBD5E1`, background `#FFFFFF`, text `#94A3B8`.