# Devnov - Tech Stack

## Architecture
- React 19 + Vite 7, JavaScript JSX, client-side single-page static site.
- Tailwind CSS v4 with the first-party Vite plugin and `@theme` design tokens.
- `framer-motion` for restrained interaction and reveal animation.
- `lucide-react` for icons.
- `src/data/agencyData.js` is the single static content store; no backend or database.
- Production output: `dist/` (deployable to static hosting).

## Planned integrations - not enabled in Module 1
- Web3Forms or EmailJS, subject to user selection and verified credentials.
- Calendly booking link if one is supplied.

## Design tokens
- Page: `#090D16`
- Surface: `#111827`
- Brand indigo: `#6366F1`
- Positive green: `#10B981`
- Text: `#F9FAFB`
- Secondary text: `#9CA3AF`
- Font: Inter, falling back to system sans-serif.

## Publishing policy
- No invented testimonials, customer logos, awards, analytics figures or project results.
- Replace the empty `projects`, `team`, `testimonials` arrays with genuine content only.
- Do not commit API secrets; client-exposed Vite variables are public.
## Module 02 implementation
- Reusable sticky `Navbar.jsx` with responsive menu, Escape-to-close, skip link and reduced-motion support.
- Clean `Footer.jsx` with Devnov branding and current-year copyright (full footer can be expanded later).
- `Hero.jsx` contains copy, ethical labelled demo illustration, motion-enhanced entrance and technology chips.
- `App.jsx` includes three capability previews and short process section, ensuring active navigation links have real destinations.
- CTAs are conditional: HTTPS booking link or verified email when provided; otherwise navigate to implemented on-page content.
- No backend, live data, fabricated case studies, testimonials or counters.
## Module 03 implementation
- Static case studies live in `src/data/projects.json` and can be managed interactively with Node CLI `scripts/manage-projects.mjs`.
- Legacy entries in `src/data/agencyData.js` remain compatible and untouched; duplicate project slugs are disallowed.
- UI components: `FeaturedWork.jsx`, `ProjectCard.jsx`, `CaseStudyDialog.jsx`.
- Category filters, responsive image cards, conditional valid external links, accessible details modal with focus management and reduced-motion handling.
- Public screenshots are copied to `public/projects/`, then included in the Vite static build.
- No backend, no database, no admin login and no fabricated social proof.

## Module 4
- Complete services and technology band
- Static React/Vite implementation; source files and checks are tracked in the project.

## Module 5
- Full process and why Devnov
- Static React/Vite implementation; source files and checks are tracked in the project.

## Module 6
- FAQ and consent-first team manager
- Static React/Vite implementation; source files and checks are tracked in the project.

## Module 7
- Web3Forms-ready contact and final footer
- Static React/Vite implementation; source files and checks are tracked in the project.

## Module 8
- SEO, metadata, favicon and deployment guide
- Static React/Vite implementation; source files and checks are tracked in the project.

## Module 9
- Final release audit and QA workflows
- Static React/Vite implementation; source files and checks are tracked in the project.

## Module 10 - Public company content CLI and settings overrides
- Static React + Vite; CLI manager / QA scripts; no new runtime services or database.

## Module 11 - Offline content QA, fallback 404 and browser checklist
- Static React + Vite; CLI manager / QA scripts; no new runtime services or database.

## Module 12 - Launch readiness report, checklist and consolidated QA
- Static React + Vite; CLI manager / QA scripts; no new runtime services or database.

## DevNov reference redesign
Approved visual style: white #FFFFFF, orange #FF4B16, charcoal #101B27, elevated pale cards. Existing React/Vite/Tailwind/Framer Motion/Lucide and JSON managers retained.

