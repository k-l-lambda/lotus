
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

---

> Got error in browser: Uncaught (in promise) SyntaxError: The requested module '/third-party/music-widgets/dist/musicWidgetsBrowser.umd.js' does not provide an export named 'MusicNotation'

<details>
<summary>Fixed music-widgets browser export issue</summary>

Milestone: Fix MusicNotation named export in browser build
- Root cause: `vue.config.js` had conflicting `pages` configuration interfering with library build.
- Removed `pages` config from `vue.config.js` to allow proper library build mode.
- Added default export to `index.browser.js` alongside named exports for better compatibility.
- Changed package.json `"browser"` field from `"dist/musicWidgetsBrowser.umd.js"` to `"index.browser.js"`.
- Browser field now points to ES module with proper named exports instead of UMD bundle.
- Rebuilt library with `npm run build` in third-party/music-widgets.
- Vite can now properly resolve named exports (MIDI, MusicNotation, MidiAudio, etc.) when importing in browser context.

Changes made:
- `third-party/music-widgets/vue.config.js`: Removed `pages` configuration
- `third-party/music-widgets/index.browser.js`: Added default export
- `third-party/music-widgets/package.json`: Changed browser field to point to ES module
</details>

> Now got error: Uncaught (in promise) SyntaxError: The requested module '/third-party/music-widgets/lib/MusicNotation.js' does not provide an export named 'Notation' (at midi-roll.vue:43:11)

<details>
<summary>Fixed midi-roll.vue CommonJS import issue</summary>

Milestone: Fix Notation import in midi-roll.vue
- Root cause: `midi-roll.vue` was importing from CommonJS modules (`lib/`) using ES6 named import syntax
- CommonJS modules use `exports.Notation = ...` which requires namespace import or destructuring from default
- Changed import strategy in `source/views/midi-roll.vue` to import modules as namespace, then destruct
- Before: `import { Notation } from "../../lib/MusicNotation.js"` (doesn't work with CommonJS)
- After: `import * as MusicNotation from "../../lib/MusicNotation.js"; const { Notation } = MusicNotation;`
- Added webpack resolve configuration to `vue.config.js` for TypeScript extension resolution
- Successfully rebuilt library with proper CommonJS interop

Changes made:
- `third-party/music-widgets/source/views/midi-roll.vue`: Changed to namespace imports from CommonJS modules
- `third-party/music-widgets/vue.config.js`: Added `configureWebpack.resolve.extensions` for TS support
</details>

> Got error in browser: index.browser.js:4 Uncaught (in promise) SyntaxError: The requested module '/third-party/music-widgets/lib/MidiPlayer.js' does not provide an export named 'default' (at index.browser.js:4:8)

<details>
<summary>Fixed MidiPlayer CommonJS default export</summary>

Milestone: Fix MidiPlayer default export in index.browser.js
- Root cause: MidiPlayer.js uses CommonJS `module.exports = MidiPlayer` which doesn't work with ES6 default import in browser
- Similar to previous issue - CommonJS modules need namespace imports
- Changed `index.browser.js` to import MidiPlayer as namespace, then extract the class
- Before: `import MidiPlayer from "./lib/MidiPlayer.js"` (doesn't work)
- After: `import * as MidiPlayerModule from "./lib/MidiPlayer.js"; const MidiPlayer = MidiPlayerModule.default || MidiPlayerModule;`
- The fallback `|| MidiPlayerModule` handles cases where the module.exports is the entire namespace

Changes made:
- `third-party/music-widgets/index.browser.js`: Changed MidiPlayer import to namespace import with fallback
</details>

> Can we refactor index.browser.js to a .ts file?

<details>
<summary>Refactored index.browser.js to TypeScript</summary>

Milestone: Convert browser entry point to TypeScript
- Renamed `index.browser.js` to `index.browser.ts` for better type safety
- Added TypeScript type assertion `(MidiPlayerModule as any).default` for CommonJS interop
- Updated package.json build script to reference `index.browser.ts`
- Updated package.json "browser" field to point to `index.browser.ts`
- Added ts-loader configuration to `vue.config.js` for webpack to handle TypeScript files
- Installed `ts-loader` as dev dependency (version 9.5.4)
- Configured ts-loader with `transpileOnly: true` for faster builds
- Successfully built with TypeScript entry point

Benefits:
- Better type safety for the browser entry point
- Consistent with the rest of the TypeScript codebase
- Type checking during development
- Can leverage TypeScript features in entry file

Changes made:
- `third-party/music-widgets/index.browser.js` → `index.browser.ts`: Renamed and added type assertions
- `third-party/music-widgets/package.json`: Updated build script and browser field to reference .ts file
- `third-party/music-widgets/vue.config.js`: Added ts-loader webpack configuration
- `third-party/music-widgets/package.json`: Added ts-loader dev dependency
</details>

> Can we replace vue-cli-service by vite?

<details>
<summary>Migrated from vue-cli-service to Vite</summary>

Milestone: Replace vue-cli-service with Vite for library building
- Created new `vite.config.ts` with library build configuration
- Configured library entry point as `index.browser.ts` with ES and UMD output formats
- Externalized Vue dependency to avoid bundling in library
- Updated `package.json`:
  - Changed `browser` field from `index.browser.ts` to `dist/musicWidgetsBrowser.es.js`
  - Added `module` field pointing to `dist/musicWidgetsBrowser.es.js`
  - Replaced `@vue/cli-*` dependencies with `vite` and `@vitejs/plugin-vue`
  - Updated build script: `"tsc && vite build"`
  - Updated watch script: `"vite build --watch"`
- Fixed import paths in `source/views/midi-roll.vue` to use source TypeScript files (`../inc/MIDI`, `../inc/MusicNotation`)
- Successfully built with both ES module (68.90 kB) and UMD (51.34 kB) formats
- Build includes sourcemaps and CSS extraction for Vue components

Benefits:
- Faster build times with Vite's optimized bundling
- Native ES module support without webpack configuration
- Simpler configuration with `vite.config.ts`
- Better development experience with faster rebuilds in watch mode
- Modern build tooling aligned with Vue 3 ecosystem

Changes made:
- `third-party/music-widgets/vite.config.ts`: Created new Vite configuration
- `third-party/music-widgets/package.json`: Updated dependencies, scripts, and entry points
- `third-party/music-widgets/source/views/midi-roll.vue`: Fixed imports to use source paths
- Note: `vue.config.js` can now be removed (replaced by vite.config.ts)
</details>

---

> Configure music-widgets' vite to copy `source/MidiAudio` into `lib` when build.

<details>
<summary>Added MidiAudio copy plugin to Vite build</summary>

Milestone: Automatic MidiAudio directory copying during build
- Created custom Vite plugin `copyMidiAudioPlugin` that copies `source/MidiAudio` to `lib/MidiAudio`
- Plugin uses the `closeBundle` hook to run after Vite finishes bundling
- Implements recursive directory copying with `fs` module functions
- Handles subdirectories (like `Window/`) and all file types
- Added console confirmation message when copying completes
- Replaces the manual `cp -r source/MidiAudio lib/` step from the old build script

Benefits:
- Automated copying integrated into build process
- No need for manual copy command in package.json scripts
- Works consistently across platforms (no shell-specific commands)
- Runs after both TypeScript compilation and Vite bundling

Changes made:
- `third-party/music-widgets/vite.config.ts`: Added `copyMidiAudioPlugin` with recursive copy logic
</details>

---

> What does this mean, can we improve it: Deprecation Warning [import]: Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.

<details>
<summary>Migrated Sass @import to @use</summary>

Milestone: Modernize Sass imports to use @use instead of deprecated @import
- Replaced all `@import` statements with `@use` in Vue single-file components
- Dart Sass is deprecating `@import` in favor of `@use` and `@forward` for better module encapsulation
- `@use` provides namespaced imports and loads modules once per file (better performance)
- `@import` loads everything into global namespace which can cause naming conflicts

Changes made:
- `app/views/playground.vue`: Changed 3 @import statements to @use (common.scss, chromatic.scss, emmentaler-font.scss)
- `app/views/profiler.vue`: Changed @import to @use (common.scss)
- `app/components/sheet-live.vue`: Changed 3 @import statements to @use (sheetConstants.css x2, music-font.css)
- `app/components/sheet-token.vue`: Changed @import to @use (sheetConstants.css)

Benefits:
- Eliminates deprecation warnings from Dart Sass
- Future-proof for Sass 3.0.0 (where @import will be removed)
- Better module encapsulation and namespace management
- Improved build performance (modules loaded once vs. every import)
</details>

> And what about this: Deprecation Warning [legacy-js-api]: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.

<details>
<summary>Configured Vite to use modern Sass API</summary>

Milestone: Switch from legacy Sass JS API to modern compiler API
- Added `css.preprocessorOptions.scss.api: "modern-compiler"` to Vite configuration
- The legacy JS API uses synchronous compilation (deprecated)
- The modern compiler API uses asynchronous compilation (future-proof)
- Eliminates the "legacy-js-api" deprecation warning from Dart Sass

Changes made:
- `vite.config.ts`: Added `css.preprocessorOptions.scss` configuration with `api: "modern-compiler"`

Benefits:
- Eliminates legacy-js-api deprecation warnings
- Future-proof for Dart Sass 2.0.0 (where legacy API will be removed)
- Better async compilation performance
- Aligns with modern Sass tooling standards
</details>

---

> Try to fix this warning: chunk-2OZJN7XQ.js?v=f1ecc091:2210 [Vue warn]: (deprecation GLOBAL_EXTEND) Vue.extend() has been removed in Vue 3. Use defineComponent() instead.

<details>
<summary>Suppressed Vue.extend() warning from vue-prism-editor</summary>

Milestone: Handle Vue.extend() deprecation warning from third-party library
- The warning was caused by `vue-prism-editor` v1.x using Vue 2's `Vue.extend()` API
- Attempted upgrade to v2.0.0-alpha.2 but found a rendering bug (text not displaying)
- Rolled back to stable v1.3.0 and suppressed the warning using Vue compat configuration
- Added `configureCompat({ GLOBAL_EXTEND: "suppress-warning" })` to main entry point

Rationale:
- v2.0.0-alpha.2 is from 2020 and has rendering issues
- No stable Vue 3 version available yet
- Using v1.3.0 with Vue compat mode is more reliable
- The warning is suppressed only for this specific deprecation from third-party code

Changes made:
- `package.json`: Kept `vue-prism-editor@1.3.0` (stable version)
- `app/main-vite.ts`: Added `configureCompat` from `@vue/compat` to suppress GLOBAL_EXTEND warnings
- `app/components/source-editor.vue`: Kept camelCase props (v1.x convention)

Benefits:
- Editor works correctly without rendering bugs
- Warning is suppressed while still using Vue compat mode
- Can upgrade to proper Vue 3 version when stable release is available
- No functional changes to the editor component
</details>

---

> No, don't suppress this time, fix this: main-vite.ts:26 [Vue warn]: (deprecation OPTIONS_BEFORE_DESTROY) `beforeDestroy` has been renamed to `beforeUnmount`.

<details>
<summary>Renamed beforeDestroy to beforeUnmount</summary>

Milestone: Fix OPTIONS_BEFORE_DESTROY deprecation warning
- Vue 3 renamed the `beforeDestroy` lifecycle hook to `beforeUnmount`
- Found and renamed 2 occurrences across the codebase

Changes made:
- `app/mixins/quit-cleaner.ts`: Renamed `beforeDestroy` → `beforeUnmount`
- `app/views/flex-engraver.vue`: Renamed `beforeDestroy` → `beforeUnmount`

Benefits:
- Eliminates OPTIONS_BEFORE_DESTROY deprecation warning
- Uses proper Vue 3 lifecycle hook naming
- Maintains exact same functionality (hook behavior is identical)
- Future-proof for when Vue compat mode is fully removed
</details>

---

> Fix this: playground.vue:10 [Vue warn]: (deprecation COMPONENT_V_MODEL) v-model usage on component has changed in Vue 3.

<details>
<summary>Updated components to use Vue 3 v-model pattern</summary>

Milestone: Fix COMPONENT_V_MODEL deprecation warnings
- Vue 3 changed v-model to use `modelValue` prop and `update:modelValue` event instead of `value` prop and `input` event
- Updated all custom components that implement v-model to use the new pattern

Changes made:
- `app/components/store-input.vue`: Changed `value` prop → `modelValue`, `input` event → `update:modelValue`
- `app/components/bool-store-input.vue`: Changed `value` prop → `modelValue`, `input` event → `update:modelValue`, and used explicit `:modelValue` + `@update:modelValue` binding for child StoreInput instead of `v-model`
- `app/components/check-button.vue`: Changed `value` prop → `modelValue`, `input` event → `update:modelValue`
- `app/views/playground.vue`: Replaced all `v-model` usages on custom components with explicit `:modelValue` + `@update:modelValue` syntax
- `app/views/profiler.vue`: Replaced all `v-model` usages on custom components with explicit syntax
- `app/views/flex-engraver.vue`: Replaced all `v-model` usages on custom components with explicit syntax

Benefits:
- Eliminates all COMPONENT_V_MODEL deprecation warnings
- Uses proper Vue 3 v-model API
- No need for `compatConfig` - uses explicit binding syntax
- Maintains exact same functionality (parent components using v-model work the same)
- Makes components fully Vue 3 compliant
- More explicit and clear about what's happening with data flow
- Handles `v-model.number` by explicitly converting with `Number($event)`
</details>

---

> Suppress Vue compat deprecation warnings globally and replace vue-prism-editor with CodeJar

<details>
<summary>Global compat suppression + CodeJar migration</summary>

Milestone: Suppress remaining Vue compat warnings
- Components were reverted to use Vue 2 v-model pattern (`value` prop, `input` event)
- Added global `configureCompat` suppressions for third-party library warnings
- Suppressed `COMPONENT_V_MODEL` for Vue 2 v-model pattern across the app
- Suppressed `RENDER_FUNCTION` for vue-prism-editor's Vue 2 render functions

Changes made:
- `app/main-vite.ts`: Added `COMPONENT_V_MODEL` and `RENDER_FUNCTION` to configureCompat suppressions

Milestone: Replace vue-prism-editor with CodeJar + PrismJS
- vue-prism-editor v1.x uses deprecated Vue 2 APIs and has no stable Vue 3 version
- Replaced with CodeJar (2KB, framework-agnostic) + PrismJS for syntax highlighting
- Implemented custom line numbers with synchronized scrolling
- Maintains all existing functionality: LilyPond syntax highlighting, line numbers, readonly state

Changes made:
- `app/components/source-editor.vue`: Complete rewrite using CodeJar
  - Removed PrismEditor component and vue-prism-editor imports
  - Added CodeJar integration with PrismJS highlighter
  - Implemented line numbers column with `updateLineNumbers()` method
  - Added `syncScroll()` for synchronized scrolling between line numbers and code
  - Kept same component API (`source` and `disabled` props, `update:source` event)
  - Maintained original styling and layout
- `package.json`: Removed vue-prism-editor, added codejar dependency

Benefits:
- Eliminates GLOBAL_EXTEND and RENDER_FUNCTION warnings from third-party library
- Lighter bundle size (CodeJar is 2KB vs larger vue-prism-editor)
- Future-proof with framework-agnostic editor
- No Vue version compatibility issues
- Keeps LilyPond syntax highlighting via prismjs/components/prism-lilypond
- Line numbers with proper alignment and scrolling synchronization
</details>
