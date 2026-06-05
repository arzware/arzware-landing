# Arzware landing page implementation plan

## Architecture
- Convert the static repo into a production-buildable Next.js single-page site.
- Use `app/page.tsx` for the landing page, `app/layout.tsx` for SEO metadata, `app/globals.css` for the full design system and responsive behavior, and `app/components/ArzwareLanding.tsx` for client-side navigation, reveals, and form handling.

## Content flow
1. Premium sticky navigation: Work, Systems, Process, Packages, Contact, with one primary booking CTA.
2. Cinematic hero: “More than a better website. A better digital system behind it.” with system showroom visual.
3. Problem framing: scattered tools, manual WhatsApp follow-up, spreadsheets, unclear operations.
4. Build categories: websites, software, dashboards, CRM-lite, automation, AI-assisted tools, mobile only when justified.
5. Website + system narrative: front door + connected backend operations.
6. Process: diagnose, design, build, connect, launch.
7. Packages/starting points: audit, website modernization, website + systems.
8. Responsible AI/trust: senior-led, privacy-conscious, human-approved commitments.
9. Contact/discovery form: accessible local inquiry preparation, no fake backend claims.

## Design system
- Premium calm palette: warm ivory surfaces, deep ink text, indigo/green accents, dark cinematic showroom panels.
- Typography: Inter via Next/font with tight premium display scale and readable body measure.
- Motion: CSS scroll reveals, subtle ambient gradients, transforms/opacity only, full reduced-motion fallback.
- Accessibility/SEO: semantic headings, skip link, focus states, labels, metadata, Open Graph, JSON-LD.

## Verification
- Run `npm run lint`, `npm run typecheck`, and `npm run build`.
- Fix build/type/lint issues, then perform browser smoke QA for console errors and responsive layout.