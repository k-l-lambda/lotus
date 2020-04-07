
TODO:
	refined sheet-token classes.
	tied note ids
	staffSvg
		tempo note head symbol
	source editor
		cursor position
		line numbers



*	2020.4.7

	+	staffSvg: mark tied notes.

	+	staffToken.ts: added source property.

	+	sheet-live.vue: parse sheet notation outside.

	+	staffSvg: added slur points parsing.


*	2020.4.3

	+	staffSvg: fixed line rendering styles.

	+	System - system spacing option in lilypond:
			system-system-spacing = #'((basic-distance . 1000))

	+	sheet-live.vue: added note matching status on notehead token.

	+	svgSymbols.ts: added postSymbolize.

	+	Enabled compile option of esModuleInterop in tsconfig.node.json.

	+	svg-path-enumeration.ts: enumerate implemented.
	+	svg-path-enumeration.ts: dumpSymbolTests added.


*	2020.4.2

	+	tools/svg-path-enumeration.ts created.

	+	staffSvg: added 2nd stroke width parsing.

	+	staffSvg: added stroke width parsing.

	+	tools/ly-svg-survey.ts created.


*	2020.4.1

	+	staffToken.ts: added double alter symbol values.

	+	notations-matcher.vue: added view width.

	+	lilyCommands.ts: fixed svg files sorting.


*	2020.3.31

	+	lilyCommands.ts: added option of tupletReplace.

	+	organizeTokens.ts: merge crossed staves connections.

	+	staffSvg: updated size precision to 0.05.

	+	lilyCommands.ts: added options of removeBreak, removePageBreak on postProcessLy.

	+	playground.vue: sliceSource implemented.

	+	lilyCommands.ts: midi2ly added.


*	2020.3.30

	+	lilyParser.ts: ScopedBlock.measures added.

	+	inc/lilyParser.ts created.


*	2020.3.28

	+	staffNotation.ts: fixed octave shift missing.

	+	organizeTokens.ts: refined tokensRowsSplit by page tile.

	+	lilyCommands.ts: added ly post processing.

	+	lilyCommands.ts: added env variable of LILYPOND_DIR.

	+	playground.vue: added shortcut for engraving.

	+	app/components/notations-matcher.vue: created.


*	2020.3.27

	+	inc/logRecorder.ts created.

	+	playground.vue: MIDI import by drop added.

	+	lilyCommands.ts: postProcessSvg added.

	+	Renamed: structureTokens -> organizeTokens.


*	2020.3.26

	+	structureTokens.ts: refined tokensRowsSplit by row Y tile.

	+	structureTokens.ts: fixed bug of numbers sort.

	+	sheet-live.vue: added debug marks.

	+	playground.vue: added width property for MIDI roll.

		CSS trick to prevent flex item overflow:
			min-width: 0;

	+	svgSymbols.ts: added more symbol rules.


*	2020.3.25

	+	structureTokens.ts: fixed single row splitting.

	+	sheet-live.vue: separated pages to multiple SVG.

	+	staffSvg: parse svg viewBox.

	+	sheet-live.vue: updated token status when cursor turned.

	+	sheet-live.vue: set cursor height.

	+	structureTokens.ts: sift out null elements.

	+	sheet-live.vue: added cursor.

	+	scheduler.ts: lookupPosition implemented.

	+	inc/staffSvg/scheduler.ts created.

	+	Renamed sheet content to sheet document.


*	2020.3.24

	+	inc/staffSvg/SheetDocument.ts created.

	+	structureToken.ts: added row relative coordinate.

	+	playground.vue: added control of MIDI roll visible.

	+	playground.vue: MIDI roll view added.

	+	playground.vue: MIDI player added.

	+	svgSymbols.ts: enhanced symbol identification.

	+	playground.vue: added chromatic symbols switch.


*	2020.3.23

	+	sheet-live.vue: notations loading added.

	+	sheet-live.vue: added linkedTokens.

	+	structureTokens.ts: added staff level tokens in parseTokenStaff.

	+	jsonRecovery.ts created.

	+	sheet-live.vue: svg document from token contents added.

	+	app/components/sheet-live.vue created.

	+	lilyCommands.ts: load MIDI data in engraveSvg.

	+	tokenizeElements.ts: separated token x, y from rounded x, y.

	+	staffSvg: fixed some parsing issues.


*	2020.3.20

	+	playground.vue: staff tokenize option added.

	+	backend/lilyCommands.ts created.

	+	inc/staffSvg added.

	+	playground.vue: auto engraving added.

	+	playground.vue: display multiple svg pages for original staff document.

	+	playground.vue: source store in browser added.

	+	playground.vue: dots loading animation added.

	+	Vue component of sheet created.

	+	backend: handle of engrave added.


*	2020.3.19

	+	backend: handle of musicxml2ly added.

	+	Nodejs server added.

	+	playground.vue: multiple drag types supported.

	+	Component of source-editor created.


*	2020.3.18

	+	App view of playground added.

	+	index.vue: ly text load from drag-drop added.

	+	Favicon created.

	+	Vue cli config setup.

	+	npm package config setup.

	+	changelog.md created.
	+	README.md created.

---
#	Lotus ChangeLog
