
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

---

> The root cause of problem in `BaseTerm` is derived class's member initializer will overwrite that field which assigned in base class, fix this by append `declare` like what I do in `class Command`.

<details>
<summary>Vue 3 compat + parser/runtime fixes</summary>

Milestone: Vue 3 compatibility fixes
- Replaced remaining Vue 2 patterns: fixed `v-model` on child prop in `app/components/remote-file.vue` to use `update:filePath`.
- Switched client env to Vite: replaced `process.env.VUE_APP_*` with `import.meta.env.VITE_*`.
- Converted value imports to `import type` (e.g., `ScoreJSON`, `SheetMeasure`).

Milestone: Jison parser loading reliability
- Stopped browser Jison compilation; load prebuilt CommonJS parsers from `public/lib/*`.
- Hardened client loader to fetch + evaluate CommonJS modules and detect HTML responses.

Milestone: Lily terms construction robustness
- Root cause: subclass field initializers overwrote BaseTerm assignments.
- Applied `declare` to all derived class fields in `inc/lilyParser/lilyTerms.ts` to avoid runtime initializers.
- Made `entries` getters return safe arrays (`[]`) across base and root.
</details>

---

<details>
<summary>Submodule + Dev Link, Backend Fixes</summary>

Milestone: Add and link submodule
- Added `third-party/music-widgets` submodule (develop) per `.gitmodules`.
- Installed deps with proxy, built library, and ran `yarn link` in submodule.
- Linked in main repo via `yarn link @k-l-lambda/music-widgets`.

Milestone: Backend server compatibility
- Avoided package root import that re-exports browser-only `MidiAudio`.
- Backend now imports Node-safe modules directly: `@k-l-lambda/music-widgets/source/inc/MIDI`.
- Enabled ts-node flags: `TS_NODE_SKIP_IGNORE=1` and `TS_NODE_TRANSPILE_ONLY=1` for smoother TypeScript interop.
- Identified remaining transitive imports (e.g., `inc/staffSvg/staffNotation.ts`) that should use source/inc paths to prevent browser code on server.
 </details>

---

<details>
<summary>Submodule build + local link; backend run status</summary>

Milestone: Build and link `@k-l-lambda/music-widgets`
- Built submodule to `lib/` and `dist/`; adjusted `index.ts` for CJS default export of `MidiPlayer`.
- Linked submodule into main project via `yarn link`.

Milestone: Backend compatibility with linked package
- Continued to avoid browser-only imports; backend uses `source/inc/MIDI` only.
- Note: `inc/staffSvg/staffNotation.ts` still imports package root; plan to point it to `source/inc/*` to avoid loading `MidiAudio` on server.

Current blocker
- Native `canvas` module binary mismatch (NODE_MODULE_VERSION 72 vs 120). Backend fails to start.
- Next: rebuild `canvas` for current Node (e.g., `yarn add --force canvas` or `npm rebuild canvas`).
</details>

---

## 2025/10/29


> Refactor `backend/lilyCommands.ts`, when an env variable `ENGRAVE_SERVICE_BASE` set, pipe the engraving request to that service instead of local lilypond process.
> So there are 3 modes in total now: engrave service, lilypond addon, lilypond CLI.

<details>
<summary>Dynamic import for canvas + External engraving service support</summary>

Milestone: Convert canvas to dynamic import
- Changed `backend/canvas.ts` to use dynamic import for the `canvas` module.
- Import only happens when `svgToPng` is called and not in MOBILE_MODE.
- Converted `PNGStream` import to type-only import to avoid runtime loading.
- Improves bundle size and startup time by loading canvas on-demand.

Milestone: Three-mode engraving architecture
- Added HTTP/HTTPS support for external engraving service requests.
- Implemented `engraveSvgService` function to POST engraving requests to remote service.
- Implemented `engraveSvgWithStreamService` for streaming SVG output from service.
- Updated routing logic with priority: Service mode → Addon mode → CLI mode.
- Service mode activates when `ENGRAVE_SERVICE_BASE` environment variable is set.
- Service expects JSON response with `logs`, `svgs`, `midi` (base64), and `errorLevel`.
- Maintains compatibility with existing callbacks (`onMidiRead`, `onSvgRead`, `onProcStart`).

Supported modes:
1. **Engrave Service**: External HTTP/HTTPS service (when `ENGRAVE_SERVICE_BASE` set)
2. **LilyPond Addon**: Native addon (when `LILYPOND_ADDON` set)
3. **LilyPond CLI**: Command-line lilypond process (default)
</details>

> Write a curl test case for `/engrave` handler, refer to use case in `app/views/playground.vue`.
> The example lilypond code: `\relative c' { \key g \major \time 3/4 \ottava #0 \clef "treble" \stemDown d'4 ( \p \stemUp g,8 [ a8 b8 c8 ]  }`

<details>
<summary>Engrave endpoint test script</summary>

Milestone: Curl test cases for /engrave endpoint
- Created `test-engrave.sh` bash script with three test scenarios.
- Test 1: Basic engrave without tokenization (returns logs, svgs, midi).
- Test 2: Engrave with tokenization (adds doc and hashTable to response).
- Test 3: Engrave with logging enabled (includes logger data).
- All tests use the provided G major example LilyPond source.
- Script saves responses to `/tmp/` for inspection.
- Created `test-engrave.README.md` with usage documentation.
- Script supports custom HOST environment variable for testing different servers.

Test execution:
```bash
./test-engrave.sh              # Test against localhost:3000
HOST=http://service:8080 ./test-engrave.sh  # Test against custom host
```
</details>
