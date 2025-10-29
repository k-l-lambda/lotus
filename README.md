# Lotus

**Lotus** is a sheet music toolset, an enhancement of [LilyPond](http://lilypond.org/).


## [Online demo](https://huggingface.co/spaces/k-l-lambda/lotus)

Thanks to 🤗HuggingFace Spaces,
the online demo is available at [Lotus Space](https://huggingface.co/spaces/k-l-lambda/lotus).

This is an online Lilypond editor and player.


## Usage

* For production:
  ```sh
  yarn build
  yarn start
  ```

* For development:
  ```
  # Run backend
  yarn dev

  # Run frontend
  yarn serve
  ```

### Run with a lotus engraving service

1. Start up engraving service by docker:
    ```sh
    sudo docker run -d --ipc=host --net=host --name lotus -e PORT=8133 kllambda/lotus:v2

    # Validate status
    sudo docker logs lotus
    ```

1. Configure environment variable `ENGRAVE_SERVICE_BASE` in `.env.local`.
    ```ini
    ENGRAVE_SERVICE_BASE=http://localhost:8133
    ```

1. Run backend:
    ```sh
    yarn dev
    ```

1. Check API availibility:
    ```sh
    curl -X POST http://localhost:8130/engrave \
      -F "source=\relative c' { \key g \major \time 3/4 \ottava #0 \clef treble \stemDown d'4 ( \p \stemUp g,8 [ a8 b8 c8 ] }" \
      -F "tokenize=true" \
      -w "\nHTTP Status: %{http_code}\n"
    ```
    If it works you will get `HTTP Status: 200` in response.

### Local Environment Variables

Edit local enviroment variables in file `.env.local`.

Variable Name                 | Default Value
:--                           | :--
HOST                          | *127.0.0.1*
PORT                          | *8080*
LILYPOND_DIR                  | *(empty)*
TEMP_DIR                      | `./temp/`
MIDI_FILE_EXTEND              | `midi`
MUSICXML2LY_BY_PYTHON         | *false*
SOURCE_EDITOR_DIR             |
LILYPOND_ADDON                |
MOBILE_MODE                   | *false*
LILYPOND_ADDON_ASSETS_DIR     |
ENGRAVE_SERVICE_BASE          |
