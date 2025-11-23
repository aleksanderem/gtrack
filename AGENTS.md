# Repository Guidelines

## Project Structure & Module Organization
The Vue 3 app lives in `src/`, with `main.js` wiring PrimeVue, the Lara Blue preset, Tailwind, and Leaflet assets. Feature code sits under `src/components/gtrack`, split by surface (`map/`, `sidebar/`, top-level panels) to mirror the Location Detail layout. Use `styles.css` for shared utility overrides. Static comparison artifacts (`LocationDetail*.html`, `screens/`, `screenshots/`) track design studies; refresh them after UI updates. The `example/` directory is the canonical PrimeVue implementation—treat it as core: review and mirror its patterns before introducing new components or layouts. Investigation scripts and visual tests live as root-level `*.mjs` files.

## Build, Test, and Development Commands
- `npm install` – install Vue, PrimeVue, Leaflet, and Vite dependencies.
- `npm run dev` – start the Vite dev server on localhost for interactive work.
- `npm run build` – emit a production bundle under `dist/` for static hosting checks.
- `npm run preview` – serve the built bundle locally to validate production output.
- `node test-visual-quick.mjs` (or any `test-*.mjs`) – launch Playwright scripts that render HTML snapshots into `screenshots/`. Run `npx playwright install` once per machine to provision browsers.

## Coding Style & Naming Conventions
Follow Vue SFCs with `<script setup>` and Composition API. Component files use `PascalCase.vue`, while subdirectories stay lowercase (`map`, `sidebar`). Default to two-space indentation, prefer Tailwind utilities before bespoke CSS, and place shared tweaks in `styles.css`. When adding UI, base structure and imports on the matching `example/**` snippet, then adapt as needed. Register new PrimeVue components or directives centrally in `main.js`, and extend the Lara preset via `definePreset` when adjusting theme tokens.

## Testing Guidelines
Automated coverage comes from the Playwright mini-scenarios (`test-*.mjs`). Mirror the naming pattern, keep each script focused, and point it at the relevant HTML artifact or Vite dev URL. Add console or screenshot checks where practical, and commit resulting reference images under `screenshots/` to track regressions. When touching map interactions, smoke-test `visual-diff.mjs` to confirm cluster overlays render correctly.

## Commit & Pull Request Guidelines
Use concise, imperative commit messages (`Fix carousel dots`, `Add design document`) as seen in `git log`. Each PR should describe the user-facing impact, list affected routes or HTML artifacts, and attach before/after captures from `screenshots/` or `LocationDetail.html` when UI changes are involved. Link to any relevant planning notes such as `screens/LOCATIONS_BUSINESS_FLOW_PLAN.md` or `VISUAL_TEST_REPORT.md`, call out required follow-up scripts, and ensure Vite builds and key Playwright scripts pass before requesting review.
