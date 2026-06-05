# Arzware Landing Page

Premium Next.js landing page for Arzware: a senior-led software and digital systems company building websites, dashboards, automations, CRM-lite systems, internal tools, and AI-assisted workflows.

## Stack

- Next.js App Router
- TypeScript
- CSS design system in `app/globals.css`
- Local client-side form inquiry preparation
- SEO metadata and JSON-LD structured data

## Local development

```bash
npm install
npm run dev
```

Open the local URL shown by Next.js.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Project structure

- `app/layout.tsx` — metadata, viewport, font setup
- `app/page.tsx` — page entry
- `app/components/ArzwareLanding.tsx` — full landing page content and interactions
- `app/globals.css` — responsive design system, layout, motion, reduced-motion support
- `IMPLEMENTATION_PLAN.md` — concise implementation plan and architecture

## Live form note

The current form prepares an inquiry summary locally and attempts to copy it to the clipboard. Connect it to the approved email, booking, CRM-lite, or automation workflow before production lead capture.
