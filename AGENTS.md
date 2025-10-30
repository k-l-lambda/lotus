# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Vue 2 UI (SFCs in `app/components/`, views in `app/views/`, styles in `app/styles/`).
- `backend/`: Node/TS backend utilities (engraving, XML, MIDI, storage).
- `inc/`: Core TypeScript library (parsers, notation, staff SVG, utils).
- `tools/`: Dev/CLI tools (Jison build, batch converters), assets in `tools/assets/`.
- `tests/`: Scripted TS tests and `.ly` fixtures under `tests/ly/**`.
- `jison/`: Grammar sources. `ly/`: LilyPond addons. `public/`: static assets.
- Entrypoints: `main.ts` (node), `index.ts` (lib), `index.browser.ts` (UMD).

## Build, Test, and Development Commands
- `yarn` — install dependencies.
- `yarn serve` — run Vite dev server (`HOST:PORT` from `.env.local`).
- `yarn dev` — run `main.ts` with hot‑reload via ts-node-dev.
- `yarn start` — run `main.ts` once (no watch).
- `yarn build` — build the Vue app.
- `yarn build:lib` — build browser UMD and Node library, then generate parsers.
 - `yarn build:lib` — build Node library and prebuild Jison parsers into `lib/`. Required before running the app.
- Lint: use your editor’s ESLint integration; Vue CLI tooling removed.

## Coding Style & Naming Conventions
- TypeScript and Vue 2; use tabs for indentation; prefer explicit types; avoid `any`.
- Names: camelCase for variables/functions, PascalCase for classes/types and Vue component names, kebab-case for `.vue` filenames.
- Keep modules focused; avoid large files; colocate helpers under the relevant folder.

## Testing Guidelines
- Tests are executable TS scripts (no test runner). Run with:
  - `npm run ts-run tests/engraveWithStream.ts`
- Place LilyPond fixtures under `tests/ly/**`. Name tests descriptively (e.g., `lilyVariables.ts`).
- Add targeted tests near changed modules; no coverage threshold enforced.

## Commit & Pull Request Guidelines
- Commits: concise, imperative summary; optionally prefix with touched area (e.g., `backend:` or `inc/lilyParser:`).
- PRs: clear description, reproduction steps, expected/actual behavior; link issues; include screenshots/gifs for UI changes (`app/views/**`).
- Update `changelog.md` for user-visible changes; document new env vars in `README.md`.

## Security & Configuration Tips
- Configure via `.env.local` (do not commit). Key vars: `HOST`, `PORT`, `LILYPOND_DIR`, `TEMP_DIR`, `MOBILE_MODE`.
- Ensure `LILYPOND_DIR` points to a trusted installation; avoid exposing temp or source directories publicly.

## Agent-Specific Instructions
- Keep changes minimal and scoped; do not reformat or rename unrelated files.
- Follow the structure above when adding modules; prefer small, reviewable PRs.


## Meta-Instructions

**Important constraints to remember**:
1. Learn the development history from `agentlog.md` firstly.
1. Update `agentlog.md` when a mini-milestone is accomplished.
    agentlog should include both user's prompt and agent's response, agent's response should be enclosed inside a foldable `<details>`.
    The content should be summarized concisely if the original text is too redundance.
    Fix typos in prompt text if present.
1. Use tabs for indentation for all code file formats.
1. Following further instuctions in `AGENTS.local.md` if present.
