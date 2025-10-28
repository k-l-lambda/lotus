
## 2025/10/28


> Modernize this project from Vue 2 to Vite + Vue3 with typescript. Following the original coding style and project structure.

<details>
<summary>Initial Vite + Vue 3 scaffolding</summary>

Milestone: Initial Vite + Vue 3 scaffolding
- Added `vite.config.ts` with Vue 3 compat alias and env loading.
- Added `index.html` and `app/main-vite.ts` to mount existing `app/index.vue`.
- Updated `package.json` scripts to use Vite (`yarn dev`, `yarn build`).
- Replaced Vue 2 APIs (`Vue.set`, `Vue.extend`) in key components.
- Kept backend/tools intact; `build:lib` remains for Node/lib and Jison generation.

Cleanup:
- Removed unused Vue CLI files: `app/html/CommonTemplate.html`, `vue.config.js`.
</details>

> Run develop server, and fix issues if present.

<details>
<summary>Dev server, proxies, and Jison parsers</summary>

Milestone: Run Vite dev server alongside backend
- Vite serves on `PORT+1`; backend Express stays on `PORT`.
- Proxy only API routes (no `/` catch-all) to avoid homepage proxy loop.

Milestone: Browser-safe Jison parser loading
- Avoided compiling Jison in browser (compat issues under Vite).
- Added prebuild step output to `public/lib/` via `tools/buildJisonParser.ts`.
- Client loader `app/loadJisonParser.js` now fetches `/lib/*.js` and evaluates CommonJS output with a stub `require`.
- Documented `yarn build:lib` as required before running the app.

Fixes:
- Converted several value imports to `import type` (e.g., `ScoreJSON`, `SheetMeasure`).
- Replaced Vue 2‑only patterns (v‑model on props) with `update:x` emit.
</details>
