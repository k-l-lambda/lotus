
## TODO
	track-measure lilypond section editor
		duration checker
	MIDI post processing
		arpeggio
	lyrics in music normalization
	lyrics hilighting
		match chord with voice in the same staff
	excludeChordTracksFromMIDI issue
	staffSvg
		fix partial measures
			add partial on standalone block
		treble_8
		system splitting, chord mode symbol affiliation



*	2021.1.7

	+	sheet-live.md: refined statusMap for overlapped href elements.

	+	notation.ts: fixed overlapped id problem in matching.

	+	sheetDocuemnt.ts: enhanced alignTokensWithNotation to fix overlapped token ids (phonet q).


*	2020.12.31

	+	lilyTerms.ts: connect pitches in clarifiedChord.

	+	lilyTerms.ts: replace by rest for tied pitches in clarifiedChord.


*	2020.12.28

	+	lilyTerms.ts: MusicBlock.clarifyHead added.

	+	lilyTerms.ts: fixed Chord.clarifiedChord.


*	2020.12.25

	+	lilyParser: fixed Chord.clarifiedChord octave problem.

	+	lilyParser: MusicBlock.fromTerms added.


*	2020.12.21

	+	lilyInterpreter.ts: fixed MusicTrack.isLyricMode.


*	2020.12.18

	+	lilyNotation: added measure range data in toPerformingNotationWithEvents.


*	2020.12.16

	+	sheet-live.vue: added slots of system & page.


*	2020.12.8

	+	sheet-live.vue: added null protection for setNoteStatus.


*	2020.11.23

	+	batchMarkup.ts: markup of spacing-16 added.


*	2020.11.19

	+	sheetDocument.ts: added optional argument of 'partial' for alignTokensWithNotation.


*	2020.11.16

	+	lilyInterpreter.ts: fixed post_events missing issue for MusicTrack.splitLongRests.

	+	lilyInterpreter.ts: append tail chunk in applyMeasureLayout.

	+	lilyInterpreter.ts: reserved 'r' rest in MusicTrack.splitLongRests.

	+	lilyInterpreter.ts: validate layout in applyMeasureLayout.

	+	batchMarkup.ts: markup of merge-single-volta added.

	+	playground.vue: mergeSingleVoltaMLayout added.


*	2020.11.13

	+	lilyDocument.ts: method of LilyDocument.markup added.

	+	notation.ts: added method of Notation.setTempo.


*	2020.11.12

	+	lilyDocument.ts: refined global attributes.

	+	scoreBundle.ts: classDict exported.


*	2020.11.11

	+	lilyTerms.ts: Tempo.fromNoteBpm added.


*	2020.11.10

	+	lilyNotation: assign staffTrack in toPerformingNotationWithEvents.


*	2020.11.8

	+	playground.vue: apply measure layout code on original lily document.

	+	lilyTerms.ts: constructMusicFromMeasureLayout implemented.

	+	playground.vue: UI for measure layout code added.


*	2020.11.7

	+	lilyInterpreter.ts: enhanced MusicTrack.flatten to spread music blocks.


*	2020.11.6

	+	lilyInterpreter.ts: reservedVariables added.

	+	advancedEngraver.ts: refined output stream in callbacks.

	+	pianoRhythm.ts: fixed for interpreter.mainScore.

	+	lilyDocument.ts: relocate from source text implemented.


*	2020.11.5

	+	lilyDocument.ts: added markup method of abstractMainScore.

	+	lilyInterpreter.ts: added main score to unify separated layoutMusic & midiMusic.


*	2020.11.4

	+	scoreBundle.ts: ScoreBundle.fromJSON added.


*	2020.11.3

	+	advancedEngraver.ts: rectify sheet document in backend.

	+	advancedEngraver.ts: added options of input lilyNotation.


*	2020.11.2

	+	advancedEngraver.ts: added option of withLilyNotation.

	+	profiler.vue: constructSheetFromStream added.

	+	backend: service handler of advanced-engrave added.

	+	backend/advancedEngraver.ts created.

	+	inc/streamParser.ts created.

	+	lilyAddon.ts: removed midi output in engraveSvgWithStream.

	+	lilyInterpreter.ts: measureLayoutCode property on MusicPerformance added.


*	2020.11.1

	+	measureLayout.ts: property of code on MeasureLayout classes added.

	+	measureLayout.jison: range grammar added, allow to ignore prefix 'i:'.

	+	tests/measuresParser.ts created.

	+	backend/loadJisonParserNode.ts created.

	+	remote-file.vue: convert CRLF to LF to avoid href errors on Windows.


*	2020.10.30

	+	staffSvg: added type of HashTable.

	+	flex-engraver.vue: exportSourceList added.


*	2020.10.26

	+	index.ts: export constants.

	+	lilyAddon.ts: fixed stream blocking problem in engraveSvgWithStream.


*	2020.10.22

	+	lilyAddon.ts: engraveSvgWithStream added.


*	2020.10.21

	+	backend/lilyAddon.ts created.


*	2020.10.20

	+	flex-engraver.vue: fixed systemCount for fixed staff size.


*	2020.10.10

	+	staffSvg: adjusted to compatible with lilypond 2.21.


*	2020.10.7

	+	lilyCommands.ts: engraveSVG by lilypond addon added.


*	2020.9.26

	+	lilyTerms.ts: SimultaneousList.measureLayout added.


*	2020.9.21

	+	lilyTerms.ts: ContextedMusic.measureLayout added.

	+	lilyInterpreter.ts: enhanced TrackContext.execute for ContextedMusic.
	+	lilyInterpreter.ts: enhanced LilyInterpreter.execute for Variable.

	+	lilyTerms.ts: added bad duration protection in MusicBlock.redivide.

	+	lilyInterpreter.ts: fixed anchor pitch initialization in MusicTrack.spreadRelativeBlocks.

	+	batchMarkup.ts: added markup process of redivide-interpret.


*	2020.9.20

	+	lilyInterpreter.ts: fixed MusicTrack.spreadRelativeBlocks.

	+	lilyInterpreter.ts: execute SimultaneousList in TrackContext.

	+	lilyParser: term class of ParallelMusic added.


*	2020.9.19

	+	lilyParser.ts: enhanced music block redivide by measure heads.


*	2020.9.17

	+	lilyDocument.ts: markup method of appendMIDIInstrumentsFromName added.

	+	lilyTerms.ts: ContextedMusic.withClause added.

	+	notation.ts: fixed track matching.

	+	lilyInterpreter.ts: set note channel according to instrument.

	+	sheetConstants.css: use CSS variables.


*	2020.9.16

	+	notation.ts: added parameter of trackList on notation output methods.

	+	scoreBundle.ts: refined matchedIds generation.


*	2020.9.15

	+	scoreJSON: added field of trackInfos on ScoreMeta.

	+	source-editor.vue: refined style to solve line height inconsistent issue.

	+	sheet-token.vue: added data-track on DOM.

	+	playground.vue: added controls of chromatic mode.

	+	lilyInterpreter.ts: fix music track anchro pitch for single chord non-relative music block.


*	2020.9.14

	+	sheetDocument.ts: assign track in SheetDocument.alignTokensWithNotation.

	+	notation.ts: added protection on endOfTrack's deltaTime to prevent negative deltaTime.

	+	lilypond.jison: added command syntax of articulate.

	+	batchScoreMaker.ts: added argument of includeFolders.

	+	batchScoreMaker.ts: added default argument as inputLyDir on argv.

	+	matcher.ts: refined definition of trackMap.

	+	notation.ts: use track value from parser.


*	2020.9.13

	+	notation.ts: fixed note duration issue in Notation.assignMatcher.

	+	notation.ts: refined note assignment for afterGrace.

	+	notation.ts: append note events in toPerformingNotationWithEvents.

	+	notation.ts: sub notes on MeasureNote added.

	+	playground.vue: refined exportScore for v0.6.

	+	notation.ts: refined output midi notation tracks.

	+	matcher.ts: match notes with track map.


*	2020.9.12

	+	scheduler.ts: fixed repeat problem by measure index from notes.

	+	notation.ts: added Notation.getMeasureIndices.

	+	sheetDocument.ts: SheetDocument.getTokenMap added.

	+	scheduler.ts: refined Scheduler.createFromNotation for multiple notes - 1 token match.


*	2020.9.11

	*	Notation calling hierarchy:
		*	LilyInterpreter.getNotation
			*	MusicTrack.generateStaffTracks
			*	LilyStaffContext.executeTerm
			*	LilyNotation.fromAbsoluteNotes
		*	matcher.matchWithExactMIDI
			*	LilyNotation.toPerformingNotation
				*	LilyNotation.toAbsoluteNotes
				*	Notation.performAbsoluteNotes
			*	LilyNotation.assignMatcher
				*	assignNotationEventsIds
		*	LilyNotation.toPerformingNotationWithEvents
			*	LilyNotation.toPerformingMIDI
			*	assignNotationNoteDataFromEvents
		*	LilyNotation.getContextGroup
			*	LilyNotation.toPerformingNotation
			*	PitchContextTable.createPitchContextGroup

	+	measureLayout.ts: fixed ABAMLayout.serialize.

	+	notations-matcher.vue: refined link lines.


*	2020.9.10

	+	matcher.ts: shift MIDI ticks with trackTickBias.

	+	notation.ts: Notation.trackTickBias added.

	+	scheduler.ts: refined Scheduler.lookupTick to allow row head area.

	+	ly/articulate-lotus.ly created.

	+	scoreBundle.ts: bundle version checking added.

	+	scoreBundle.ts: fixed bundle json parsing.

	+	scoreMaker.ts: replaced midi, noteLinkings, pitchContextGroup by lilyNotation in score bundle.

	+	scoreMaker.ts: added version field in score bundle.

	+	tools/batchMarkup.ts created.

	+	lilyDocument.ts: markup method of removeInvalidExpressionsOnRests.

	*	Post event of . ! _ on rest result in duration error in lilypond output MIDI.


*	2020.9.9

	+	lilyNotationMatch.ts: added argv of articulate.

	+	lilyDocument.ts: markup method of articulateMIDIOutput added.

	+	measureLayout.ts: refined BlockMLayout.trimSeq to avoid backwards sequence.

	+	lilyInterpreter.ts: fixed after grace measure index issue.

	+	matcher.ts: fuzzy matching in matchWithExactMIDI added.

	+	matcher.ts: alignNotationTicks added.


*	2020.9.8

	+	matcher.vue: implicit notes matching added.

	+	playground.vue: engrave option of articulateMIDI added.

	+	lilyParser.ts: implicit type parsing added.

	+	lilyInterpreter.ts: refined grace duration factor.

	+	notations-matcher.vue: property of softIndexAsX added.

	+	playground.vue: highlight source when click matcher note added.


*	2020.9.7

	+	lilyNotation/notation.ts: assign events for independent MIDI events by tick range.

	+	lilyInterpreter.ts: exclude lyric and chordmode track for MusicPerformance.mainTrack.

	+	lilyInterpreter.ts: MusicPerformance.mainTrack added.

	+	lilyTerms.ts: AfterGrace.measureLayout added.

	+	lilyTerms.ts: Command.measureLayout added.

	+	lilyInterpreter.ts: check incomplete measure at begin of repeat block.

	+	playground.vue: pruneStemDirections & redivide measures setting buttons added.

	+	lilyInterpreter.ts: truncate the incomplete measure at alternative blocks in repeat.

	+	lilyNotation/notation.ts: enhanced robustness for ill score.


*	2020.9.6

	+	measureLayout.ts: ABAMLayout.serialize implemented.

	+	notation.ts: output option of measure layout type.

	+	measureLayout.ts: VoltaMLayout.serialize implemented.

	+	lilyNotation/measureLayout.ts created.

	+	lilyTerms.ts: fixed measures-crossed MusicEvent measures issue.

	+	lilyTerms.ts: refined MusicBlock.measures.

	+	playground.vue: use env variable to determine sourceEditorEnabled.


*	2020.9.5

	+	notation.ts: Notation.toPerformingNotationWithEvents implemented.

	+	lilyNotation: Notation.toAbsoluteNotes implemented.


*	2020.9.4

	+	lilyNotation: class of Notation added.

	+	lilyNotation: added measureHeads on Notation.

	+	lilyNotation: added field of measure on Note.

	+	scoreMaker.ts: makeArticulatedMIDI added.

	+	lilyDocument.ts: markup method of removeRepeats added.

	+	lilyDocument.ts: markup method of pruneStemDirections added.


*	2020.9.3

	+	playground.vue: parse SCM code by liyad.

	+	lilyCommands.ts: engraveScm added.

	+	lilyDocument.ts: markup method of convertStaffToPianoStaff added.

	+	playground.vue: protect connected remote file from mutation by dropping.

	+	dir-browser.vue: property of compactFolders added.


*	2020.9.2

	+	app/components/dir-browser.vue created.


*	2020.9.1

	+	lilyInterpreter.ts: parsed tied chord elements for notation.

	+	scoreBundle.ts: updateMatchedTokens added in loadNotation.

	+	sheetDocument.ts: SheetDocument.pruneForBakingMode added.


*	2020.8.31

	+	staffSvg: turnRawSvgWithSheetDocument implemented.

	+	scoreMaker.ts: turnRawSvgWithSheetDocument added.

	+	lilyInterpreter.ts: fixed TrackContext.processGrace duration factor.


*	2020.8.30

	+	lilyNotationMatch.ts: statStorage writing added.


*	2020.8.28

	+	scoreMaker.ts: option of baking added.

	+	lilyTerms.ts: Root.reorder added.

	+	lilyDocument.ts: LilyDocument.formalize implemented.

	+	sheet-live.vue: token click event added.


*	2020.8.27

	+	playground.vue: highlightSourcePosition implemented.

	+	source-editor.vue: upgraded prism component.

	+	playground.vue: home button on source dir added.

	+	playground.vue: source loading status added.

	+	app/components/remote-file.vue created.

	+	backend/dirServer.ts created.


*	2020.8.26

	+	playground.vue: source directory file choose added.

	+	playground.vue: source directory view added.

	+	main.ts: source editor service added.


*	2020.8.24

	+	scoreMaker.ts: makeScoreV4, based on LilyNotation, added.

	+	lilyInterpreter.ts: added empty string as staff name for anonymous staff.

	+	lilyInterpreter.ts: multiple scores block supporting added.

	+	lilyInterpreter.ts: class of MusicPerformance added.

	+	lilyInterpreter.ts: fixed LilyInterpreter.getNotation for anonymous staff track.


*	2020.8.23

	+	lilyInterpreter.ts: accidental alters on pitch context added.

	+	lilyInterpreter.ts: pitch context terms of key signature & octave shift added.

	+	lilyNotation/matcher.ts: scaled pitch context group ticks.

	+	lilyInterpreter.ts: LilyStaffContext added.


*	2020.8.22

	+	lilyInterpreter.ts: added clef field on pitch context.


*	2020.8.21

	+	sheet-list.vue: added alter color in pitch context marks.
	+	sheet-list.vue: pitch context marks added.

	+	pitchContext.ts: PitchConfig.yToPitchName added.

	+	pitchContext.ts: class of PitchConfig added.

	+	lilyNotation/matcher.ts: merge note ids.

	+	lilyNotation: added rest field on note.

	+	lilyInterpreter.ts: refined LilyInterpreter.getNotation.

	+	lilyNotation/matcher.ts: use hard matching for first pass.

	+	notations-matcher.vue: cloned notation data inner.


*	2020.8.20

	+	lilyNotation/matcher.ts created.

	+	lilyNotation: extracted assignNotationEventsIds from staffNotation to lilyNotation.

	+	lilyInterpreter.ts: MusicTrack.generateStaffTracks added.

	+	lilyInterpreter.ts: added staff term in TrackContext.declarations.

	+	lilyInterpreter.ts: pitch transposition on TrackContext added.

	+	lilyInterpreter.ts: context dictionary on TrackContext added.

	+	inc/pitchContext.ts: extracted from staffSvg/staffNotation.ts.

	+	lilyNotationMatch.ts: log added.

	+	Folder of inc/lilyNotation created.


*	2020.8.19

	+	lilyInterpreter.ts: added staccato on StaffContext.

	+	lilyInterpreter.ts: added language term.

	+	lilyCommands.ts: added option of language on xml2ly.

	+	tests/lilyNotationMatch.ts created.

	+	sheetDocument.ts: alignTokensWithNotation added.

	+	inc/lilyNotation.ts created.


*	2020.8.18

	+	lilyDocument.ts: markup method of mergeContinuousEmptyAfterGraces added.

	+	staffSvg: added note head type of diamond.

	+	tokenHrefChecking.ts: omit href checking added.
	+	tokenHrefChecking.ts: note collision checking added.

	+	tests/tokenHrefChecking.ts created.

	+	sheetDocument.ts: SheetDocument.getNoteHeads added.

	+	lilyInterpreter.ts: LilyInterpreter.getNotation added.
	+	lilyInterpreter.ts: MusicTrack.getNotationNotes added.

	+	lilyTerms.ts: pitch value property on ChordElement added.

	+	lilyParser/idioms.ts: created.


*	2020.8.17

	+	staffSvg: fixed note tied marking.

	+	organizeTokens.ts: refined parseTokenRow by staff lines.


*	2020.8.15

	+	lilyTerms.ts: fixed absolute cache issue by clear pitch cache in updateChordAnchors.

	+	sheet-live.vue: refined note status updating by SchedulePool.

	+	staffNotation.ts: fixed channel matching in assignNotationEventsIds.

	+	scoreMaker.ts: added postProcessSheetDocument in makeSheetNotation.

	+	staffSvg: postProcessSheetDocument added.

	+	lilyDocument.ts: append assignment table on globalAttributes.

	+	sheetDocument.ts: refined fitPageViewbox by token coordinates.


*	2020.8.14

	+	batchScoreMaker.ts: added argv of scorePostfix.


*	2020.8.12

	+	sheet-live.vue: refined status map updating in updatePageVisibility.

	+	sheet-live.vue: event of cursorRowShift added.

	+	sheetDocument.ts: added verticalCrop option on fitPageViewbox method.

	+	lilyDocument.ts: added new global attributes of printPageNumber.

	+	sheet-live.vue: partial visible implemented.

	+	lilyDocument.ts: added new global attributes of raggedBottom, raggedLastBottom.


*	2020.8.10

	+	lilyTerms.ts: added cache for ChordElement.absolutePitch to avoid call stack overflow.

	+	jisonWrapper.ts: added method of generate.


*	2020.8.9

	+	canvasEngraver.ts: packing images added.

	+	tests\canvasEngraver.ts created.

	+	sheet-live.vue: property of showPagesProgressively added.


*	2020.8.8

	+	playground.vue: added xml post processing option of midiChannelMapping.

	+	playground.vue: midi2ly by file dropping added.

	+	lilyTerms.ts: added measure comments after divide in MusicBlock.redivide.


*	2020.8.7

	+	lilyDocument.ts: markup method of useMidiInstrumentChannelMapping added.


*	2020.8.6

	+	lilyCommands.ts: fixed svg loading index order error.

	+	lilyCommands.ts: fixed multiple log lines issue in engraveSvg.

	+	batchScoreMaker.ts: added time string in log file name.

	+	playground.vue: added engraver option of enabledFuzzyMatcher.

	+	staffNotation.ts: fuzzyMatchNotations implemented.
	+	staffNotation.ts: fuzzyMatchNotations added.

	+	staffSvg: refined alter token parsing.


*	2020.8.5

	+	lilyParser: removed jison wrapper methods.

	+	loadLilyParser.js: refined by worker.

	+	batchScoreMaker.ts: option of skipNonExist added.


*	2020.8.4

	+	profiler.vue: load score from URL added.

	+	playground.vue: packed baking images into score bundle.

	+	playground.vue: export score bundle in zip package.

	+	xmlTools.ts: added option of removeInvalidClef.

	+	xmlTools.ts: added option of fixRepeatBarline.

	+	xmlTools.ts: added option of fixChordVoice.

	+	xmlTools.ts: separated preprocessXml from lilyCommands.ts.


*	2020.8.3

	+	lilyCommands.ts: XML preprocessing option of removeInvalidHarmonies added.

	+	organizeTokens.ts: adjusted page tile range in tokensRowsSplit.

	+	lilyDocument.ts: LilyDocument.interpret added.

	+	lilyTerms.ts: Chord.pitchElements added.

	+	lilyDocument.ts: added comment on MIDI output block in excludeChordTracksFromMIDI.

	+	staffNotation.ts: trace back column when location missed.


*	2020.8.2

	+	scoreMaker.ts: correct notation time by location-tick table from lily document.

	+	lilyInterpreter.ts: processGrace added.

	+	staffNotation.ts: assignTickByLocationTable added.

	+	lilyInterpreter.ts: fixed splitLongRests for default duration.

	+	lilyDocument.ts: getLocationTickTable added.


*	2020.7.31

	+	lilyInterpreter.ts: inherit name in sliceMeasures.

	+	staffSvg: added text color attribute.

	+	scoreMaker.ts: added option of includeFolders. 

	+	pianoRhythm.ts: number track added.


*	2020.7.30

	+	pianoRhythm.ts: added color option.

	+	sheet-live.vue: markings for non-baking mode added.

	+	lilyInterpreter.ts: splitLongRests added.

	+	lilyParser: fixed pitch anchor issue.


*	2020.7.29

	*	Long zero_command syntax result in lily parser loading large cost.

	+	lilyParserProfiler.ts: parser loading cost test added.


*	2020.7.28

	+	sheetDocument.ts: fitPageViewbox added.

	+	sheet-live.vue: added custom class on measures.

	+	sheet-live.vue: measure mark rect added.

	+	sheet-live.vue: refined mark graph.

	+	lilyParser: refined measures redivide.


*	2020.7.26

	+	lilyCommands.ts: refined file path resolving.

	+	lilyParser: added more comment line registers.

	+	lilyParser: comments parsing added.


*	2020.7.25

	+	playground.vue: turn player cursor by pointer click added.

	+	sheet-live.vue: tick lookup for pointer added.

	+	sheet-live.vue: measure index lookup for pointer added.

	+	sheet-live.vue: pointer pad added.


*	2020.7.20

	+	lilyInterpreter.ts: added AfterGrace for StaffContext.execute.

	+	scoreMaker.ts: use getTiedNoteLocations2 by LilyInterpreter.


*	2020.7.19

	+	lilyTerms.ts: Chord.notes added.

	+	pianoRhythm.ts: refined by LilyInterpreter.

	+	lilyInterpreter.ts: MusicTrack.sliceMeasures added.

	+	lilyInterpreter.ts: MusicTrack.flatten added.
	+	lilyInterpreter.ts: MusicTrack.spreadRepeatBlocks added.
	+	lilyInterpreter.ts: MusicTrack.spreadRelativeBlocks added.

	+	lilyInterpreter.ts: MusicTrack.unfoldDurationMultipliers added.

	+	lilyInterpreter.ts: MusicTrack added.

	+	lilyInterpreter.ts: saved global status.


*	2020.7.18

	+	lilyInterpreter.ts: update pitch tied in StaffContext.

	+	lilyParser/lilyInterpreter.ts created.

	+	lilyParser: separated lilyTerms from lilyDocument.

	+	lilyDocument.ts: term class of Partial added.

	+	pianoRhythm.ts: refined times fraction value.


*	2020.7.17

	+	pianoRhythm.ts: createPianoRhythmTrack implemented.

	+	lilyDocument.ts: added term class of Grace.

	+	inc/lilyParser/pianoRhythm.ts created.

	+	lilyDocument.ts: appendIncludeFile added.

	+	lilyCommands.ts: added include folders for engrave command.

	+	lilyDocument.ts: LilyDocument.noteDurationSubdivider added.

	+	lilyDocument.ts: refined MusicBlock.sliceMeasures by StaffContext.

	+	playground.vue: sliceMeasures added.

	+	lilyDocument.ts: MusicBlock.clone added, to keep anchorPitch constant when clone.


*	2020.7.16

	+	lilyDocument.ts: LilyDocument.sliceMeasures added.

	+	lilyDocument.ts: MusicBlock.allocateMeasures implemented.

	+	lilyDocument.ts: normalizeMusic implemented.

	+	inc/romanNumeral.ts created.


*	2020.7.15

	+	lilyDocument.ts: refined MusicBlock.unfoldDurationMultipliers by break rest duration.

	+	lilyDocument.ts: term class of TimeSignature added.

	+	lilyDocument.ts: MusicBlock.spreadRelativeBlocks implemented.

	+	lilyDocument.ts: term class of Relative added.

	+	lilyDocument.ts: term of MusicEvent added.

	+	lilyDocument.ts: Chord.absolutePitch implemented.


*	2020.7.14

	+	lilyDocument.ts: MusicBlock.expandVariables added.

	+	lilyDocument.ts: refined getMusicTracks by score block content.

	+	lilyDocument.ts: MusicBlock.toUnfoldRepeatsBlock implemented.

	+	lilyDocument.ts: term class of Repeat added.


*	2020.7.13

	+	tests/lilyVariables.ts created.

	+	lilyDocument.ts: added term of Variable.

	+	lilyDocument.ts: markup method of unfoldDurationMultipliers.

	+	lilyDocument.ts: term clone method added.


*	2020.7.11

	+	lilyDocument.ts: fixed default staff size value.


*	2020.7.10

	*	Rythm lyric characters:
			dotW = \markup { \char ##x25cb }
			dotB = \markup { \char ##x25cf }

	+	lilypond.jison: added syntax of book_block.

	+	lilyDocument.ts: added globalAttributes item of midiTempo.

	+	package.json: added extern dependencies of jison & xmldom for backend usage client package.


*	2020.7.8

	+	playground.vue: source log status button added.

	+	midiChecker.ts: stat store added.


*	2020.7.7

	+	tracksDurationChecker.ts: stat store added.

	+	lilyDocument.ts: enhanced getTiedNoteLocations by MusicBlock.voices.

	+	lilyDocument.ts: MusicBlock.voices added.

	+	lilyCommands.ts: refined xml preprocess of removeTrivialRests.

	+	tests/tracksDurationChecker.ts created.

	+	lilyDocument.ts: added property of durationMagnitude on term classes.


*	2020.7.6

	+	lilyDocument.ts: duration magnitude property added.

	+	lilyParser: term of duration added.

	+	lilyDocument.ts: class of MusicChunk added.

	+	lilyDocument.ts: markup method of removeAloneSpacer added.

	+	lilyDocument.ts: term method of musicChunks added.

	+	midiChecker.ts: cache flush added.

	+	staffToken.ts: added logicOffsetY for directional post event token.

	+	midiChecker.ts: added argv option of fixNestedRepeat.


*	2020.7.5

	+	midiChecker.ts: dump issues in log file.

	+	midiChecker.ts: matchMIDI implemented.

	+	scoreMaker.ts: makeMIDI added.

	+	lilyParser: exported LilyTerms.


*	2020.7.3

	+	lilyDocument.ts: term class of ChordElement added.


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
