
## TODO
	batch MIDI match checking
	measures clipping, playground.sliceSource
	measure notes in Notation parsing
	music duration parsing
		parse measure ticks from ly
	staffSvg
		treble_8
		system splitting, chord mode symbol affiliation
		staffNotation.ts: clusterize factor issue
		remove empty track	(6.1 落叶.ly)
		fix partial measures
	source editor
		cursor position column



*	2020.7.2

	+	organizeTokens.ts: mark key alters in parseTokenStaff.

	+	staffSvg: refined function of parseSvgPage.

	+	organizeTokens.ts: refined tied notes marking by tied locations parsing.

	+	lilyDocument.ts: getTiedNoteLocations added.


*	2020.7.1

	+	lilyDocument.ts: refined redivide to remove divide at tail.

	+	batchScoreMaker.ts: added argv of flushCacheInterval.


*	2020.6.30

	+	lilyDocument.ts: markup method of removeEmptyContextedStaff added.

	+	organizeTokens.ts: affiliate alters to notes.

	+	organizeTokens.ts: refined staves splitting by line stacks.

	+	organizeTokens.ts: LineStack added.


*	2020.6.28

	+	batchScoreMaker.ts: argument of qualityThreshold added.

	+	staffToken.ts: refined logicOffsetY for OCTAVE tokens.

	+	lilyDocument.ts: markup method of excludeChordTracksFromMIDI implemented.

	+	lilyDocument.ts: added proto field in term's JSON object.


*	2020.6.27

	+	lilyDocument.ts: redivide added.

	+	sheetDocument.ts: getLocationTable added.


*	2020.6.26

	+	lilyDocument.ts: refined location data in terms.

	+	scheduler.ts: refined endX for measure leap.

	+	lilyCommands.ts: fixed xml2ly command line for Windows.

	+	sheetDocument.ts: saved measure index in sheet document.


*	2020.6.25

	+	playground.vue: unfoldRepeats implemented.

	+	playground.vue: added markup field of topMarkupSpacing.

	+	playground.vue: markup function UI added.


*	2020.6.24

	+	lilyCommands.ts: enhanced file ready lock for 'warning' child process output.

	+	staffSvg: added symbols of 15ma & 15mb.

	+	lilyDocument.ts: markup method of fixEmptyContextedStaff added.


*	2020.6.23

	+	lilyDocument.ts: markup method of fixNestedRepeat added.

	+	staffNotation.ts: ignored invalid alters.


*	2020.6.22

	+	lilyDocument.ts: fixInvalidMarkupWords added.

	+	lilyDocument.ts: fixInvalidBriefChords added.

	+	lilyDocument.ts: fixInvalidKeys added.

	+	lilyDocument.ts: mergeContinuousGraces added.

	+	lilyCommands.ts: skip error messages in command line when checking files.

	+	batchScoreMaker.ts: log file added.


*	2020.6.21

	+	lilyDocument.ts: makeScoreV3 implemented.


*	2020.6.20

	+	lilyDocument.ts: containsRepeat added.

	+	lilyDocument.ts: unfoldRepeats added.

	+	scoreMaker.ts: makeSheetNotation added.


*	2020.6.19

	+	batchScoreMaker.ts: fixed skipExist option for score making.

	+	organizeTokens.ts: fixed measure headX shifting by alters.

	+	organizeTokens.ts: refined tied note parsing by source position.

	+	organizeTokens.ts: refined parseChordsByStems to avoid tempo note stem bald checking failure.


*	2020.6.18

	+	lilyParser: fixed serilization for music identifier.

	+	lilyCommands.ts: preprocessXml option of removeBadMetronome added.

	+	lilyCommands.ts: preprocessXml option of fixBackSlashes added.

	+	lilyCommands.ts: preprocessXml option of removeTrivialRests added.


*	2020.6.17

	+	lilyCommands.ts: preprocessXml option of escapedWordsDoubleQuotation added.

	+	lilyCommands.ts: preprocessXml option of roundTempo added.

	+	lilyCommands.ts: preprocessXml option of fixCreditWords added.

	+	lilyCommands.ts: preprocessXml option of fixHeadMarkup added.

	+	lilyCommands.ts: preprocessXml option of removeNullDynamics added.


*	2020.6.16

	+	organizeTokens.ts: added protection for staff without measure separators.

	+	staffSvg: token staves splitting by additional indcies 2D map implemented.

	+	organizeTokens.ts: fixed note stem row splitting.

	+	organizeTokens.ts: use stemY for staves splitting for notes.

	+	staffSvg: deduce note logic X by note stem.


*	2020.6.15

	+	lilyDocument.ts: scoreBreakBefore added.

	+	staffSvg: added element properties of font-style & text-anchor.

	+	staffSvg: page level text tokens added.

	+	staffSvg: added element property of font-weight.

	+	staffSvg: music font note offsets added.

	+	svgSymbols.ts: added scale property for notehead token.

	+	svgSymbols.ts: refined symbol of LARGE_RECT.


*	2020.6.14

	+	scoreBundle.ts: method of loadNotation added.


*	2020.6.13

	+	scoreMaker.ts: refined makeScore by SingleLock.

	+	inc/mutex.ts created.

	+	lilyCommands.ts: engraveSvgWithStream added.

	+	scoreMaker.ts: optimized markScoreV2.


*	2020.6.12

	+	scoreMaker.ts: markScoreParallelly implemented.

	+	lilyCommands.ts: report file read in progressing.

	+	lilyDocument.ts: added term classes of MarkupCommand, LiteralString.

	+	scoreMaker.ts: markup command list added.

	+	lilyDocument.ts: removeBreaks, removePageBreaks added.

	+	playground.vue: inspect lily button added.


*	2020.6.11

	+	lilyDocument.ts: Chord.toJSON added.

	+	scoreMaker.ts: export page count & staff size into score json.


*	2020.6.10

	+	sheetBaker.ts: added DTD on svg document for canvas image to avoid entity parsing issues.

	+	scoreBundle.ts: added option of jsonHandle.

	+	scoreMaker.ts: externalize lily parser.

	*	When tsconfig.target set to es5, class extends from native classes may have wrong behavior.

	+	tools/buildLilyParser.ts created.


*	2020.6.9

	+	backend: added function of setEnvironment.

	+	scoreMaker.ts: copyMarkup added.

	+	scoreMaker.ts: added meta data in score bundle.

	+	playground.vue: exported meta data in score bundle.

	+	playground.vue: saved title from lily document.

	+	sheet-live.vue: event of cursor page shift added.


*	2020.6.8

	+	lilyParser: added chordmode grammar.

	+	lilyCommands.ts: added option of replaceEncoding for preprocessXml.

	+	scoreMaker.ts: convert UTF-16 encodeing xml file.

	+	organizeTokens.ts: preprocessed tempo noteheads.

	+	batchScoreMaker.ts: option of pauseOnError added.


*	2020.6.5

	+	staffSvg: allow empty staff page.

	+	batchScoreMaker.ts: added switch of skipExist.

	+	staffSvg: fixed octave close line Y offset issue.

	+	staffNotation.ts: added NaN protection for pitch deduce.

	+	staffSvg: added symbol for note head type of cross.


*	2020.6.4

	+	organizeTokens.ts: shift fore measure headX by alter tokens.

	+	staffNotation.ts: refined note time, use x rather than rx.

	+	organizeTokens.ts: fixed parseTokenRow to avoid wrong staves split by fake MEASURE_SEPARATOR.

	+	organizeTokens.ts: fixed tokensRowsSplit to avoid too low boundary value.

	+	organizeTokens.ts: fixed tokensRowsSplit row range expanding by additional lines.

	+	batchScoreMaker.ts: MIDI file loading added.

	+	batchScoreMaker.ts: score bundling added.

	+	scoreMaker.ts: added matcher coverage statistics.

	+	profiler.vue: restore non-baking mode.

	+	scoreMaker.ts: markScore implemented.

	+	lilyCommands.ts: XML preprocessing added.


*	2020.6.3

	+	lilyDocument.ts: added grammar of lyric_element_music.

	+	batchScoreMaker.ts: batch xml to ly added.

	+	backend/scoreMaker.ts created.

	+	playground.vue: exportMarkupLily added.

	+	staffNotation.ts: refined clusterizeNotes by note head type.


*	2020.6.2

	+	staffNotation.ts: exclude tempo note heads out of notation.

	+	staffNotation.ts: reset old key alters in one staff.

	+	organizeTokens.ts: fixed token judgment of tie.

	+	staffNotation.ts: clusterize SVG notation time to refine notation matching.

	+	organizeTokens.ts: refined tied note search.

	+	app/mixins/quit-cleaner.ts created.

	+	sheet-token.vue: add tooltips on token.


*	2020.5.28

	+	staffNotation.ts: fixed alter array minus index serilization issue.

	+	inc/DictArray.ts created.

	+	organizeTokens.ts: refined head X for measure.

	+	organizeTokens.ts: added head width on sheet document staff.

	+	staffNotation.ts: append more logs in notation parsing.


*	2020.5.27

	+	staffNotation.ts: fixed alters reseting bug.

	+	lilyDocument.ts: added null paper protection for globalAttributes.


*	2020.5.21

	+	sheet-live.vue: clear note status when document changed.

	+	sheet-live.vue: added protection for notes without ids.

	+	sheet-live.vue: return marking for add marking methods.

	+	staffNotation.ts: fixed Infinity JSON serilization issue.

	+	sheet-live.vue: fixed status map updating.


*	2020.5.20

	+	app/scoreBundle.ts created.

	+	sheetBaker.ts: construct SheetSignsComponent inside bakeLiveSheetGen.

	+	profiler.vue: refined matchedIds computing.


*	2020.5.19

	+	profiler.vue: refined data processing.

	+	playground.vue: refined exportScore.

	+	sheet-live.vue: methods of add/remove marking implemented.

	+	staffNotation.ts: PitchContext.pitchToY implemented.

	+	sheet-live.vue: simplified data preprocessing.

	+	staffNotation.ts: PitchContextTable added.

	+	staffNotation.ts: pitch contexts on NotationTrack added.


*	2020.5.18

	+	sheetDocument.ts: yRoundOffset on sheet staff added.

	+	sheetDocument.ts: addMarking added.


*	2020.5.15

	+	sheet-live.vue: clearNoteStatus added.

	+	sheet-live.vue: setNoteStatus added.

	+	sheet-live.vue: statusMap added.


*	2020.5.14

	+	Upgrade web-widgets to 0.3.17.

	+	vue.config.js: added webpack config externals.


*	2020.5.13

	+	staffSvg: added recoverScoreJSON.


*	2020.5.11

	+	staffNotation.ts: assignIds added.

	+	playground.vue: export note ids in score json.

	+	staffNotation.ts: refined MIDI notation events ids assignment.


*	2020.5.10

	+	profilter.vue: bake sheet by generator.

	+	lilyCommands.ts: added env variable of MIDI_FILE_EXTEND.
			Lilypond on Windows platform use mid instead of midi.


*	2020.5.9

	+	package.json: added library target building script.

	+	lilyDocument.ts: added method of removeTrillSpans.

	+	sheet-live.vue: added token status class for bake mode.

	+	sheet-live.vue: added music font.

	+	sheet-live.vue: added baking mode.


*	2020.5.8

	+	profiler.vue: added option of bakingSheet.

	+	profiler.vue: added FPS statistics.


*	2020.5.7

	+	profiler.vue: sheet baking added.

	+	sheetBaker.ts: added bakeLiveSheet.

	+	sheetBaker.ts: remove matched tokens in bakeRawSvg.
	+	sheetBaker.ts: remove lilypond engraving signature in bakeRawSvg.

	+	sheet-live.vue: added property of background images.

	+	app/sheetBaker.ts created.

	+	sheet-live.vue: added property of showActiveOnly.

	+	path-symbols.json: fixed time signature token name of CUT_C.

	+	lilyDocument.ts: added method of removeStaffGroup.


*	2020.5.6

	+	lilyDocument.ts: refined pop in serialization join.

	*	Lilypond parser may fail to parse brace close '}' without a leading space, in double angle << >>.

	+	flex-engraver.vue: source copy button added.


*	2020.5.5

	+	flex-engraver.vue: refined staff size viewers.

	+	flex-engraver.vue: added fit staff size slider.


*	2020.5.3

	+	flex-engraver.vue: added option of fix staff size.

	+	flex-engraver.vue: refined fitContainer by gauged system spacing.

	+	flex-engraver.vue: added system spacing gauge.


*	2020.4.30

	+	flex-engraver.vue: score json exporting added.

	+	tests/ly/flex: added flex lilypond samples.

	+	flex-engraver.vue: staff samples added.

	+	flex-engraver.vue: loading icon added.

	+	flex-engraver.vue: container svg sheet added.


*	2020.4.29

	+	flex-engraver.vue: flexible staff size computing added.

	+	flex-engraver.vue: gauge natural size implemented.
	+	flex-engraver.vue: gauge method added.

	+	flex-engraver.vue: source edition implemented.

	+	flex-engraver.vue: import source by dropping implemented.

	+	flex-engraver.vue: resizable container added.

	+	App view of flex-engraver added.

	+	lilyDocument.ts: added global attribute of raggedLast.


*	2020.4.28

	+	lilyDocument.ts: added global attribute of system spacing.

	+	playground.vue: added option of engraveWithLogs.

	+	lilypond.jison: parsing test of test-5.ly passed.

	+	lilyDocument.ts: added terms for scheme.

	+	lilypond.jison: refined syntax of scheme_expression.


*	2020.4.27

	+	package.json: added script of build-node.

	+	tools/batchXml2Ly.ts created.

	+	backend/walkDir.ts created.


*	2020.4.26

	+	playground.vue: auto page size implemented.

	+	playground.vue: markup staff size updating implemented.

	+	backend/loadLilyParserNode.ts: created.
	+	lilyDocument.ts: LilyDocument.globalAttributes added.

	+	lilyDocument.ts: refined getField.

	+	lilyDocument.ts: Root.getBlock added.


*	2020.4.24

	+	lilyDocument.ts: BaseTerm.getField added.

	+	lilySerializationValidator.ts: mimatched documents comparing added.

	+	tests/lilySerializationValidator.ts created.

	+	lilyDocument.ts: term of PostEvent added.
	+	lilyDocument.ts: term of Tempo added.
	+	lilyDocument.ts: term of ContextedMusic added.
	+	lilyDocument.ts: term of SimultaneousList added.

	+	lilyDocument.ts: Chord.serilize implemented.

	+	lilyDocument.ts: term of MusicBlock added.


*	2020.4.23

	+	lilyDocument.ts: BaseTerm.join implemented.

	+	lilyDocument.ts: root term added.

	+	lilyDocument.ts: term classes added.


*	2020.4.22

	+	inc/lilyParser/lilyDocument.ts created.

	+	playground.vue: lily markup button added.

	+	app/loadLilyParser.js created.

	+	lilypond.jison: added syntax of mode_changed_music.

	+	lyParser.ts: directory walking implemented.


*	2020.4.21

	+	lyParser.ts: multiple source testing added.

	+	lilypond.jison: syntax for scheme expression.

	+	lilypond.jison: syntax of context music added.

	+	lilypond.jison: enhanced grammar.


*	2020.4.20

	+	lilypond.jison: syntax term of scm_identifier added.

	+	lilypond.jison: syntax of output_def added.

	+	lilypond.jison: markup syntax rules added.

	+	lilypond.jison: syntax of property_path added.

	+	Lilypond symbol 'SCM' = scheme


*	2020.4.18

	+	lilypond.jison: test-2.ly passed.


*	2020.4.17

	+	lilypond.jison: chord formula implemented.

	+	lyParser.ts: added source file name argument.


*	2020.4.16

	+	lilypond.jison: fixed confliction by command formation.


*	2020.4.15

	+	lilypond.jison: added basic lexel rules.


*	2020.4.14

	+	Lilypond parser based on jison created.


*	2020.4.13

	+	lilyParser.ts: escapeComments added.

	+	source-editor.vue: enhanced by vue-prism-editor.

	+	playground.vue: added settings panel.


*	2020.4.11

	+	app/components/dialog.vue created.


*	2020.4.9

	+	profiler.vue: added options of cursor & note hightlight.

	+	sheet-live.vue: added property of showMark.

	+	index.ts created.


*	2020.4.8

	+	profiler.vue: store source text.

	+	sheet-live.vue: refined token status updating.

	+	profiler.vue: added player controls.

	+	profiler.vue: live sheet & sheet signs added.

	+	index.vue: multiple views supporting added.

	+	playground.vue: score.json exporting implemented.

	+	app/components/sheet-signs.vue created.

	+	organizeTokens.ts: separate measure ranges before staff parsing.

	+	staffSvg: row splitting for single staff implemented.


*	2020.4.7

	+	organizeToken.ts: refined row top & bottom.

	+	staffNotations.ts: append tied note id in sheet notation.

	+	sheet-live.vue: refined token classes.

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
