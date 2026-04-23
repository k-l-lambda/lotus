# Lotus

**Lotus** is a sheet music toolset built as a modern extension of [LilyPond](http://lilypond.org/). It bridges LilyPond's high-quality engraving engine with contemporary web technology, providing a complete stack for score parsing, rendering, format conversion, and playback alignment.

Lotus was started in 2020 with the goal of giving LilyPond the web infrastructure it lacked — a browser-ready environment with interactive SVG display, MIDI playback, and a programmable API for score data. It later became the foundation for the score rendering pipeline in the [Starry OMR project](https://github.com/k-l-lambda/starry), supplying the training-data generation system with high-quality annotated score images.


## [Online demo](https://huggingface.co/spaces/k-l-lambda/lotus)

Available at [Lotus Space](https://huggingface.co/spaces/k-l-lambda/lotus) on 🤗 HuggingFace Spaces. An online LilyPond editor and player — write LilyPond source, engrave it in the browser, and play it back with a synchronized score cursor.


## What Lotus Does

### Format conversion hub

Lotus supports round-trip conversion between the major sheet music formats:

```
LilyPond source (.ly)
  ↕  parse / serialize
Abstract Syntax Tree (AST)
  ↕  interpret / generate
Notation data (measures, tracks, notes)
  ↕  render / extract
SVG score pages  ←→  MIDI
```

Starting from LilyPond source, Lotus can:
- Parse it into a fully editable, serializable AST
- Call the LilyPond binary to produce SVG pages and a MIDI file
- Tokenize and semantically annotate every symbol in the SVG (notehead, stem, beam, clef, dynamics, etc.)
- Align the SVG tokens with the Notation data to support interactive highlighting and playback cursor
- Match an external MIDI recording against the score for performance analysis

Going the other direction, it can also import MusicXML (via `musicxml2ly`) and MIDI (via `midi2ly`), converting them to LilyPond for further processing.

### Interactive score viewer

The `playground` and `flex-engraver` front-end views render the processed SVG as a live, interactive score. Clicking a symbol highlights its corresponding source range in the editor; the MIDI player drives a cursor that tracks the current note in real time.

### Programmable score API

Because the LilyPond AST is fully serializable, score transformations can be scripted: transposition, tempo changes, paper size adjustments, markup injection, and more — all preserving the original source formatting.


## Architecture

```
Frontend (Vue.js + TypeScript)
├── app/views/playground.vue      — editor + live score + MIDI player
└── app/views/profiler.vue        — performance profiling view

Core library (inc/)
├── lilyParser/                   — Jison-based LilyPond parser → AST
├── staffSvg/                     — LilyPond SVG → semantic token layer
└── lilyNotation/                 — Notation data model and MIDI alignment

Backend (Node.js / Express)
├── scoreMaker.ts                 — full score pipeline: parse → engrave → tokenize → match
└── lilyCommands.ts               — LilyPond / musicxml2ly / midi2ly process management

Grammar
├── jison/lilypond.jison          — ~2000-line LilyPond grammar
└── jison/measureLayout.jison     — repeat / volta layout grammar
```

### Key design principles

**Bidirectional AST.** Every node in the AST can serialize back to LilyPond source, preserving formatting. This makes the AST suitable for programmatic editing followed by re-engraving without round-trip loss.

**Semantic SVG analysis.** LilyPond produces "dumb" vector graphics with no musical metadata. Lotus's tokenizer uses geometric analysis (path shapes, bounding boxes) and a glyph hash table to classify every SVG path into a typed token (notehead, stem, beam, rest, clef, etc.), then links each token back to its source location via LilyPond's built-in `href` annotations.

**Fuzzy MIDI matching.** Human MIDI performances contain timing imprecision, extra notes, and omissions. The fuzzy matcher uses a dynamic-programming navigation algorithm to align a live MIDI recording to the score, enabling real-time cursor tracking and post-hoc performance evaluation.


## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 4.9 |
| UI framework | Vue 3.5 (with `@vue/compat` migration layer) |
| Build tool | Vite 5 |
| Grammar engine | Jison 0.4.18 |
| Score rendering | LilyPond (external) |
| Backend server | Node.js + Express 4 |
| XML processing | xmldom |
| Syntax highlighting | Prism.js |
| Music widgets | @k-l-lambda/music-widgets |


## Usage

### Production

```sh
yarn build
yarn start
```

### Development

```sh
# Backend API server
yarn dev

# Frontend dev server (separate terminal)
yarn serve
```

### With a remote engraving service

Run LilyPond in a dedicated Docker container, useful when LilyPond is not installed locally:

```sh
sudo docker run -d --ipc=host --net=host --name lotus -e PORT=8133 kllambda/lotus:v2

# Validate
sudo docker logs lotus
```

Then set `ENGRAVE_SERVICE_BASE` in `.env.local`:

```ini
ENGRAVE_SERVICE_BASE=http://localhost:8133
```

Start the backend as usual with `yarn dev`.

### Verify the API

```sh
curl -X POST http://localhost:8130/engrave \
  -F "source=\relative c' { \key g \major \time 3/4 d'4 ( \p g,8 [ a8 b8 c8 ] }" \
  -F "tokenize=true" \
  -w "\nHTTP Status: %{http_code}\n"
```

A `200` response with JSON body confirms the engraving pipeline is working.


## Local Environment Variables

Edit `.env.local` to configure the server:

Variable                      | Default          | Description
:-----------------------------|:-----------------|:---
`HOST`                        | `127.0.0.1`      | Bind address
`PORT`                        | `8080`           | HTTP port
`LILYPOND_DIR`                | *(empty)*        | Path to LilyPond binary directory
`TEMP_DIR`                    | `./temp/`        | Temporary file directory
`MIDI_FILE_EXTEND`            | `midi`           | Extension for MIDI output files
`MUSICXML2LY_BY_PYTHON`       | `false`          | Use Python musicxml2ly wrapper
`SOURCE_EDITOR_DIR`           |                  | Directory for saved source files
`LILYPOND_ADDON`              |                  | Path to LilyPond addon package
`MOBILE_MODE`                 | `false`          | Enable mobile-optimized layout
`LILYPOND_ADDON_ASSETS_DIR`   |                  | Assets directory for addon
`ENGRAVE_SERVICE_BASE`        |                  | URL of remote engraving service


## Background

Lotus was created in 2020 to address LilyPond's main limitation: despite being the most rigorous score typesetting system available — the only one that defines its own language alongside a full rendering engine — it had no viable path into browser environments or modern web pipelines.

The project's role expanded when it became the rendering infrastructure for the Starry OMR system. Starry's training data pipeline uses Lotus to generate annotated score images at scale: a random score generator produces diverse musical notation structures, which Lotus then renders to pixel-accurate SVG and synthesizes into ground-truth training samples. This bootstrapped a deep learning OMR system without large-scale manual annotation — using a generated score library as the closed data loop between analysis (OMR recognition) and synthesis (score rendering).

The LilyPond grammar in `jison/lilypond.jison` (~2000 lines) represents one of the most complete open-source Jison implementations of the LilyPond language, covering music events, chords, rests, grace notes, repeats, tuplets, scheme expressions, and context-sensitive commands.
