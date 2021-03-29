<template>
	<div class="playground"
		:class="{'drag-hover': dragHover}"
		:data-hover-type="dragHover"
		@dragover.prevent="onDragOver"
		@dragleave="dragHover = null"
		@drop.prevent="onDropFile"
	>
		<header class="controls" :class="{buzy: operating}">
			<StoreInput v-show="false" v-model="lilySource" sessionKey="lotus-lilySource" />
			<fieldset>
				<span v-if="title" class="title">{{title}}</span>
			</fieldset>
			<fieldset>
				<button @click="saveSource" title="save source">&#x1f4be;</button>
				<button @click="settingPanelVisible = true">&#x2699;</button>
				<button v-show="lilyMarkups.enabled" @click="markupSource" title="markup lilypond source" :disabled="loadingLilyParser">{}</button>
			</fieldset>
			<fieldset>
				<span>
					<BoolStoreInput v-model="autoEngrave" sessionKey="lotus-autoEngrave" />auto
				</span>
				<span class="dirty-badge" :class="{dirty: engraverDirty}"></span>
				<button @click="engrave" :class="{working: engraving}" style="zoom: 160%" title="engrave (F8)">&#x1f3bc;</button>
				<button :disabled="!sheetDocument" @click="exportScore">&#x1f4e6;</button>
			</fieldset>
			<fieldset>
				<BoolStoreInput v-show="false" v-model="tokenizeStaff" sessionKey="lotus-tokenizeStaff" />
				<BoolStoreInput v-show="false" v-model="rollVisible" sessionKey="lotus-rollVisible" />
				<BoolStoreInput v-show="false" v-model="showNotationsMatcher" sessionKey="lotus-showNotationsMatcher" />
				<BoolStoreInput v-show="false" v-model="enabledMidiAudio" sessionKey="lotus-enabledMidiAudio" />
				<BoolStoreInput v-show="false" v-model="showCursor" sessionKey="lotus-playground.showCursor" />
				<StoreInput v-show="false" v-model="chromaticMode" localKey="lotus-playground.chromaticMode" />
				<CheckButton content="&#x1f3b9;" v-model="tokenizeStaff" title="live staff" />
				<fieldset v-show="tokenizeStaff">
					<CheckButton content="&#x1f3a8;" v-model="enabledChromatic" :disabled="!sheetDocument" title="chromatic mode" />
					<select v-show="enabledChromatic" v-model="chromaticMode">
						<option value="symbols">symbols</option>
						<option value="pitch">pitch</option>
						<option value="track">track</option>
					</select>
					<CheckButton content="&#x2633;" v-model="rollVisible" :disabled="!midiPlayer" title="show MIDI roll" />
					<CheckButton content="c|s" v-model="showNotationsMatcher" :disabled="!matcherNotations" title="show notations matcher" />
					<CheckButton content="&#x1f50a;" v-model="enabledMidiAudio" title="MIDI Audio" />
					<CheckButton content="&#xa56f;" v-model="showCursor" title="show cursor" />
					<button @click="togglePlayer" :disabled="!midiPlayer">{{midiPlayer && midiPlayer.isPlaying ? "&#x23f8;" : "&#x25b6;"}}</button>
				</fieldset>
			</fieldset>
			<fieldset v-show="tokenizeStaff">
				<BoolStoreInput v-show="false" v-model="bakingSheet" sessionKey="lotus-bakingSheet" />
				<CheckButton content="&#x5b57;" v-model="enabledMusicFont" title="enabled music font" />
				<CheckButton content="&#x1f35e;" v-model="bakingSheet" title="baking sheet" />
				<CheckButton v-show="bakingSheet" content="&#x1f9b2;" v-model="hideBakingImages" title="hide baking images" />
			</fieldset>
			<fieldset v-show="tokenizeStaff">
				<BoolStoreInput v-show="false" v-model="enabledPointer" sessionKey="lotus-enabledPointer" />
				<CheckButton content="&#x2196;" v-model="enabledPointer" />
				<span class="pointer-info" v-if="enabledPointer">
					<span v-if="pointerData">
						<span>m: <em>{{pointerData.measureIndex}}</em></span>
						<span v-if="Number.isFinite(pointerData.tick)">t: <em>{{Math.round(pointerData.tick)}}</em></span>
					</span>
				</span>
			</fieldset>
			<fieldset>
				<button @click="updateMeasureLayoutCode" title="update measure layout code" :disabled="loadingLilyParser">*[]</button>
				<input v-if="measureLayoutCode || measureLayoutCode===''" class="measure-layout-code" type="text"
					:class="{error: measureLayoutCodeError, dirty: measureLayoutCodeDirty}"
					v-model="measureLayoutCode"
					:title="measureLayoutCodeError"
					@input="validateMeasureLayoutCode"
					@change="measureLayoutCodeDirty = true"
				/>
				<button v-if="measureLayoutCodeDirty && !measureLayoutCodeError" class="apply"
					:disabled="loadingLilyParser"
					@click="applyUpdateMeasureLayoutCode"
				>apply</button>
			</fieldset>
		</header>
		<main>
			<div class="source-container" :class="{loading: sourceIsLoading, 'drag-hover': sourceDragHover, connected: sourceEditorConnected}"
				@dragover.prevent="sourceDragHover = true"
				@dragleave="sourceDragHover = null"
				@drop.prevent.stop="onDropFile($event, {source: true})"
				@focusin="showSourceDir = false"
			>
				<SourceEditor ref="sourceEditor" :source.sync="lilySource" :disabled="sourceIsLoading" />
				<span class="corner">
					<button class="inspect" @click="inspectLily">&#x1f4d5;</button>
					<button class="log" :class="engraverLogStatus" v-show="engraverLogStatus"
						:title="engraverLogs"
						@click="showEngraverLog"
					></button>
					<Loading v-show="loadingLilyParser" />
				</span>
				<Loading v-show="sourceIsLoading" />
			</div>
			<div class="build-container" ref="buildContainer"
				:class="{
					loading: engraving, dirty: engraverDirty, chromatic: enabledChromatic, inspecting: showNotationsMatcher,
				}"
				:data-chromatic="chromaticMode"
			>
				<MidiRoll v-if="tokenizeStaff && midiPlayer" v-show="rollVisible"
					:player="midiPlayer"
					:timeScale="16e-3"
					:height="120"
					:width="buildContainerSize.width"
				/>
				<NotationsMatcher v-if="showNotationsMatcher && matcherNotations"
					:criterion="matcherNotations && matcherNotations.criterion"
					:sample="matcherNotations && matcherNotations.sample"
					:path="matcherNotations && matcherNotations.path"
					:softIndexAsX="enabledSheetNotation"
					@clickCNote="onClickMatcherNote"
					@clickSNote="onClickMatcherNote"
				/>
				<div class="sheet-container" ref="sheetContainer" v-resize="onResize"
					:style="{'--music-font-family': 'Emmentaler-26', '--music-font-size': '4px'}"
				>
					<SheetSimple v-if="svgDocuments && !tokenizeStaff"
						:documents="svgDocuments"
						@linkClick="onSheetLink"
					/>
					<SheetSigns v-if="svgHashTable" v-show="false"
						:hashTable="svgHashTable"
						:enabledFont="enabledMusicFont"
					/>
					<SheetLive v-if="tokenizeStaff && sheetDocument" ref="sheet"
						:doc="sheetDocument"
						:midiNotation="midiNotation"
						:pitchContextGroup="pitchContextGroup"
						:midiPlayer.sync="midiPlayer"
						:showMark="true"
						:enablePointer="enabledPointer"
						:showCursor="showCursor"
						:bakingMode="bakingSheet"
						:backgroundImages="hideBakingImages ? null : bakingImages"
						:scheduler.sync="scheduler"
						:enabledFont="enabledMusicFont"
						@midi="onMidi"
						@cursorPageShift="onCursorPageShift"
						@pointerUpdate="onPointerUpdate"
						@pointerClick="onPointerClick"
						@click-token="onClickToken"
					>
						<template v-slot:system="slot">
							<g v-if="enabledChromatic">
								<g class="staff" v-for="(staff, iii) of slot.system.staves" :key="iii"
									:transform="`translate(${staff.x}, ${staff.y})`"
								>
									<g v-if="chromaticMode === 'symbols'" class="locator">
										<rect class="head" :x="0" :y="-2" :width="staff.headWidth" :height="4" />
										<circle />
										<line v-if="Number.isFinite(staff.top)" :x1="0" :y1="staff.top" :x2="slot.system.width" :y2="staff.top" />
										<g class="measure" v-for="(measure, i4) of staff.measures" :key="i4" :class="measure.class">
											<rect :x="measure.lineX" :y="-2" :width="measure.noteRange.end - measure.lineX" :height="4"/>
											<text :x="measure.headX">'{{measure.index}}</text>
										</g>
									</g>
									<g v-if="chromaticMode === 'pitch' && pitchContextMarks[slot.system.index] && pitchContextMarks[slot.system.index][iii]" class="pitch-context">
										<g v-for="(item, i4) of pitchContextMarks[slot.system.index][iii]" :key="i4" :transform="`translate(${item.x}, 0)`">
											<line class="base-line" x1="0" x2="0" y1="-3" y2="3" />
											<g transform="translate(0.2, 0.5)">
												<g v-for="(pitch, i5) of item.names[0]" :key="i5" class="pitch"
													:transform="`translate(0, ${pitch.y})`"
													:class="{
														sharp: pitch.alter > 0,
														flat: pitch.alter < 0,
													}"
												>
													<rect class="bg" />
													<text>{{pitch.name}}</text>
												</g>
											</g>
											<g transform="translate(1.6, 0.5)">
												<g v-for="(pitch, i5) of item.names[1]" :key="i5" class="pitch"
													:transform="`translate(0, ${pitch.y})`"
													:class="{
														sharp: pitch.alter > 0,
														flat: pitch.alter < 0,
													}"
												>
													<rect class="bg" />
													<text>{{pitch.name}}</text>
												</g>
											</g>
										</g>
									</g>
								</g>
							</g>
						</template>
						<template v-slot:staff="staffSlot">
							<g v-if="enabledChromatic && chromaticMode === 'symbols'">
								<g v-if="staffTopToken(staffSlot.staff)">
									<g class="staff-peak" :transform="`translate(${staffTopToken(staffSlot.staff).x}, ${staffTopToken(staffSlot.staff).y})`">
										<path d="M-1.2,0 L1.2,0 M-0.9,0.6 L0,0 L0.9,0.6" />
										<line :x1="0" :x2="0" :y1="0" :y2="-staffTopToken(staffSlot.staff).y" />
										<circle />
									</g>
									<g class="staff-peak" :transform="`translate(${staffBottomToken(staffSlot.staff).x}, ${staffBottomToken(staffSlot.staff).y})`">
										<path d="M-1.2,0 L1.2,0 M-0.9,-0.6 L0,0 L0.9,-0.6" />
										<line :x1="0" :x2="0" :y1="0" :y2="-staffBottomToken(staffSlot.staff).y" />
										<circle />
									</g>
								</g>
							</g>
						</template>
					</SheetLive>
				</div>
				<Loading v-show="engraving" />
			</div>
			<div class="source-editor-controls" v-if="sourceEditorEnabled">
				<button class="folder" @click="showSourceDir = !showSourceDir; $refs.sourceDir.reload()">{{"\ud83d\udcc1"}}</button>
				<StoreInput v-show="false" v-model="sourceEditorHost" localKey="lotus-sourceEditorHost" />
				<StoreInput v-show="false" v-model="sourceEditorFilePath" sessionKey="lotus-sourceEditorFilePath" />
				<RemoteFile v-show="sourceEditorFilePath" ref="remoteFile"
					:host="sourceEditorHost"
					:filePath="sourceEditorFilePath"
					:filePathReadOnly="true"
					:content.sync="lilySource"
					:connected.sync="sourceEditorConnected"
					:loading.sync="sourceEditorLoading"
				/>
				<DirBrowser ref="sourceDir"
					homeURL="/source-dir/"
					:shown.sync="showSourceDir"
					:handlePattern="/\.ly$/"
					:compactFolders="true"
					@pickFile="onSourceDirPick"
				/>
			</div>
		</main>
		<Dialog :visible.sync="settingPanelVisible">
			<datalist id="lily-markups">
				<option v-for="(method, i) of lilyMarkupMethods" :key="i" :value="method" />
			</datalist>
			<table class="settings">
				<tbody>
					<tr>
						<th>MusicXML to Lilypond</th>
						<td><hr /></td>
					</tr>
					<tr>
						<td>Remove Breaks</td>
						<td><BoolStoreInput v-model="xml2lyOptions.removeBreaks" localKey="lotus-xml2lyOptions.removeBreaks" /></td>
					</tr>
					<tr>
						<td>Remove Staff Group</td>
						<td><BoolStoreInput v-model="xml2lyOptions.removeStaffGroup" localKey="lotus-xml2lyOptions.removeStaffGroup" /></td>
					</tr>
					<tr>
						<td>Merge Continuous Graces</td>
						<td><BoolStoreInput v-model="xml2lyOptions.mergeContinuousGraces" localKey="lotus-xml2lyOptions.mergeContinuousGraces" /></td>
					</tr>
					<tr>
						<td>Exclude Chord Tracks from MIDI</td>
						<td><BoolStoreInput v-model="xml2lyOptions.excludeChordTracksFromMIDI" localKey="lotus-xml2lyOptions.excludeChordTracksFromMIDI" /></td>
					</tr>
					<tr>
						<td>Use MIDI Instrument as Channel Mapping</td>
						<td><BoolStoreInput v-model="xml2lyOptions.midiChannelMapping" localKey="lotus-xml2lyOptions.midiChannelMapping" /></td>
					</tr>
					<tr>
						<td>Remove Trill Spans</td>
						<td><button @click="removeTrillSpans" :disabled="loadingLilyParser">remove</button></td>
					</tr>
					<tr>
						<td>Prune Stem Directions</td>
						<td><button @click="executeMarkup('pruneStemDirections')" :disabled="loadingLilyParser">prune</button></td>
					</tr>
					<tr>
						<td>Redivide Measures</td>
						<td><button @click="redivideLilyDocument" :disabled="loadingLilyParser">redivide</button></td>
					</tr>
					<tr>
						<th>Engrave</th>
						<td><hr /></td>
					</tr>
					<tr>
						<td>Logger Recorder</td>
						<td><BoolStoreInput v-model="engraveWithLogs" localKey="lotus-engraveWithLogs" /></td>
					</tr>
					<tr>
						<td>Use Sheet Notation</td>
						<td><BoolStoreInput v-model="enabledSheetNotation" localKey="lotus-enabledSheetNot" /></td>
					</tr>
					<tr v-show="enabledSheetNotation">
						<td>Fuzzy Notation Matcher</td>
						<td><BoolStoreInput v-model="enabledFuzzyMatcher" localKey="lotus-enabledFuzzyMatcher" /></td>
					</tr>
					<tr>
						<td>Measure Repeat Type</td>
						<td>
							<StoreInput v-show="false" v-model="measureLayoutType" localKey="lotus-measureLayoutType" />
							<select v-model="measureLayoutType">
								<option value="ordinary">Ordinary</option>
								<option value="full">Full</option>
								<option value="conservative">Conservative</option>
								<option value="once">Once</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>Articulate MIDI</td>
						<td>
							<BoolStoreInput v-model="articulateMIDI" localKey="lotus-articulateMIDI" />
						</td>
					</tr>
					<tr>
						<th>Lilypond Markups</th>
						<td><hr /></td>
					</tr>
					<tr>
						<td>Enabled</td>
						<td><BoolStoreInput v-model="lilyMarkups.enabled" localKey="lotus-lilyMarkups.enabled" /></td>
					</tr>
					<tr>
						<td>Staff Size</td>
						<td><StoreInput type="number" v-model.number="lilyMarkups.staffSize" localKey="lotus-lilyMarkups.staffSize" /></td>
					</tr>
					<tr>
						<td>Auto Paper Size</td>
						<td><BoolStoreInput v-model="lilyMarkups.autoPaperSize" localKey="lotus-lilyMarkups.autoPaperSize" /></td>
					</tr>
					<tr>
						<td>Page Count</td>
						<td><StoreInput type="number" v-model.number="lilyMarkups.pageCount" localKey="lotus-lilyMarkups.pageCount" /></td>
					</tr>
					<tr>
						<td>System-System Spacing</td>
						<td><StoreInput type="number" v-model.number="lilyMarkups.systemSpacing" localKey="lotus-lilyMarkups.systemSpacing" /></td>
					</tr>
					<tr>
						<td>Top Markup Spacing</td>
						<td><StoreInput type="number" v-model.number="lilyMarkups.topMarkupSpacing" localKey="lotus-lilyMarkups.topMarkupSpacing" /></td>
					</tr>
					<tr>
						<td>Ragged Last</td>
						<td><BoolStoreInput v-model="lilyMarkups.raggedLast" localKey="lotus-lilyMarkups.raggedLast" /></td>
					</tr>
					<tr>
						<td>Export a Markup File</td>
						<td><button @click="exportMarkupLily">export .ly</button></td>
					</tr>
					<tr>
						<td>Execute Function</td>
						<td>
							<input type="text" list="lily-markups" v-model="chosenLilyMarkupMethod" />
							<button @click="executeMarkup(chosenLilyMarkupMethod); chosenLilyMarkupMethod = null" :disabled="!chosenLilyMarkupMethod">
								{{chosenLilyMarkupMethod ? "Call" : "Done"}}
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</Dialog>
		<canvas v-show="false" ref="canvas" />
	</div>
</template>

<script>
	import _ from "lodash";
	import resize from "vue-resize-directive";
	import {MIDI, MidiAudio, MidiUtils, MusicNotation} from "@k-l-lambda/web-widgets";

	import {downloadUrl} from "../utils.js";
	import {mutexDelay, animationDelay} from "../delay.js";
	import {recoverJSON} from "../../inc/jsonRecovery.ts";
	import StaffToken from "../../inc/staffSvg/staffToken.ts";
	import SheetDocument from "../../inc/staffSvg/sheetDocument.ts";
	import * as LilyNotation from "../../inc/lilyNotation";
	import LogRecorder from "../../inc/logRecorder.ts";
	import * as StaffNotation from "../../inc/staffSvg/staffNotation.ts";
	import loadJisonParser from "../loadJisonParser.js";
	import {LilyDocument, replaceSourceToken, createPianoRhythm, LilyTerms} from "../../inc/lilyParser";
	import {MusicTrack} from "../../inc/lilyParser/lilyInterpreter";
	import {CM_TO_PX} from "../../inc/constants.ts";
	import TextSource from "../../inc/textSource.ts";
	import * as SheetBaker from "../sheetBaker.ts";
	import {PitchContextTable} from "../../inc/pitchContext.ts";
	import * as measureLayout from "../../inc/measureLayout";
	import npmPackage from "../../package.json";

	import {MidiRoll} from "@k-l-lambda/web-widgets";
	import SourceEditor from "../components/source-editor.vue";
	import SheetSimple from "../components/sheet-simple.vue";
	import SheetLive from "../components/sheet-live.vue";
	import SheetSigns from "../components/sheet-signs.vue";
	import Loading from "../components/loading-dots.vue";
	import StoreInput from "../components/store-input.vue";
	import BoolStoreInput from "../components/bool-store-input.vue";
	import CheckButton from "../components/check-button.vue";
	import NotationsMatcher from "../components/notations-matcher.vue";
	import Dialog from "../components/dialog.vue";
	import RemoteFile from "../components/remote-file.vue";
	import DirBrowser from "../components/dir-browser.vue";

	import QuitClearner from "../mixins/quit-cleaner";




	export default {
		name: "playground",


		directives: {
			resize,
		},


		mixins: [
			QuitClearner,
		],


		components: {
			SourceEditor,
			SheetSimple,
			SheetLive,
			SheetSigns,
			Loading,
			StoreInput,
			BoolStoreInput,
			CheckButton,
			MidiRoll,
			NotationsMatcher,
			Dialog,
			RemoteFile,
			DirBrowser,
		},


		data () {
			return {
				buildContainerSize: {
					width: 100,
					height: 100,
				},
				sheetContainerSize: {
					width: 100,
					height: 100,
				},
				dragHover: null,
				sourceDragHover: false,
				lilySource: "",
				converting: false,
				engraving: false,
				svgDocuments: null,
				engraverLogs: null,
				engraverDirty: false,
				autoEngrave: true,
				tokenizeStaff: true,
				sheetDocument: null,
				title: null,
				svgHashTable: null,
				midi: null,
				midiNotation: null,
				scheduler: null,
				pitchContextGroup: null,
				enabledChromatic: false,
				chromaticMode: "symbols",
				midiPlayer: null,
				rollVisible: false,
				matcherNotations: null,
				showNotationsMatcher: false,
				enabledMidiAudio: true,
				showCursor: true,
				settingPanelVisible: false,
				xml2lyOptions: {
					removeBreaks: true,
					removeStaffGroup: true,
					mergeContinuousGraces: true,
					excludeChordTracksFromMIDI: true,
					midiChannelMapping: false,
				},
				engraveWithLogs: false,
				enabledFuzzyMatcher: true,
				enabledSheetNotation: false,
				lilyMarkups: {
					enabled: true,
					staffSize: null,
					autoPaperSize: true,
					pageCount: 2,
					systemSpacing: -1,
					topMarkupSpacing: -1,
					raggedLast: true,
				},
				lilyParser: null,
				measuresParser: null,
				lilyDocumentDirty: false,
				lilyTextSourceDirty: false,
				bakingSheet: false,
				bakingImages: null,
				enabledMusicFont: false,
				hideBakingImages: false,
				lilyMarkupMethods: Object.getOwnPropertyNames(LilyDocument.prototype),
				chosenLilyMarkupMethod: null,
				operating: false,
				loadingLilyParser: false,
				enabledPointer: false,
				pointerData: null,
				sourceEditorEnabled: !!process.env.VUE_APP_USE_SOURCE_EDITOR,
				showSourceDir: false,
				sourceEditorHost: `ws://${location.host}`,
				sourceEditorFilePath: null,
				sourceEditorConnected: false,
				sourceEditorLoading: false,
				measureLayoutType: "ordinary",
				measureLayoutCode: null,
				measureLayoutCodeDirty: false,
				measureLayoutCodeError: null,
				articulateMIDI: false,
			};
		},


		computed: {
			markupValueHash () {
				const {enabled, ...fields} = this.lilyMarkups;
				void(enabled);

				return JSON.stringify(fields);
			},


			autoPageSize () {
				return {
					width: this.sheetContainerSize.width / this.lilyMarkups.pageCount - 34,
					height: this.sheetContainerSize.height - 38,
				};
			},


			engraverLogStatus () {
				if (!this.engraverLogs)
					return null;

				if (/error:/i.test(this.engraverLogs))
					return "error";

				if (/warning:/i.test(this.engraverLogs))
					return "warning";

				return "info";
			},


			sourceIsLoading () {
				return this.converting || this.sourceEditorLoading;
			},


			/*
				[	system
					[	staff
						[context]
					]
				]
			*/
			pitchContextMarks () {
				//const scheduler = this.$refs.sheet && this.$refs.sheet.scheduler;
				if (!this.pitchContextGroup || !this.scheduler)
					return [];

				return this.pitchContextGroup.map(table => table.items.map(item => {
					const context = item.context;
					const yToName = y => ({y, alter: context.alterOnNote(context.yToNote(y)), name: context.yToPitchName(y)});

					const {system, x} = this.scheduler.lookupPosition(item.tick);
					const names = [
						[-2, -1, 0, 1, 2].map(yToName),
						[-1.5, -0.5, 0.5, 1.5].map(yToName),
					];

					return {system, x, names};
				})).reduce((result, table, staff) => (table.forEach(({system, ...item}) => {
					result[system] = result[system] || [];
					result[system][staff] = result[system][staff] || [];
					result[system][staff].push(item);
				}), result), []);
			},
		},


		async created () {
			window.$main = this;

			/*if (!window.$liyad) {
				Object.defineProperty(window, "$liyad", {
					get: async () => {
						window.liyad = await import("liyad");
						console.log("liyad:", window.liyad);

						return window.liyad;
					},
				});
			}*/

			if (MidiAudio.WebAudio.empty())
				MidiAudio.loadPlugin({soundfontUrl: "/soundfont/", api: "webaudio"}).then(() => console.log("Soundfont loaded."));

			loadJisonParser(import("../../jison/measureLayout.jison")).then(parser => {
				this.measuresParser = parser;
				console.debug("measureLayout parser loaded.");
			});

			this.loadingLilyParser = true;
			this.lilyParser = await loadJisonParser(import("../../jison/lilypond.jison"));
			this.loadingLilyParser = false;
			console.debug("lily parser loaded.");

			this.updateLilyDocument();
		},


		async mounted () {
			const keyDownHandler = event => {
				switch (event.code) {
				case "F8":
					this.engrave();

					event.preventDefault();

					break;
				}

				//if (["INPUT", "TEXTAREA"].includes(document.activeElement.nodeName))
				//	return;
			};
			document.addEventListener("keydown", keyDownHandler);
			this.appendCleaner(() => document.removeEventListener("keydown", keyDownHandler));

			await this.$nextTick();
			this.watchEngrave();
		},


		methods: {
			onResize () {
				this.buildContainerSize.width = this.$refs.buildContainer.clientWidth;
				this.buildContainerSize.height = this.$refs.buildContainer.clientHeight;

				this.sheetContainerSize.width = this.$refs.sheetContainer.clientWidth;
				this.sheetContainerSize.height = this.$refs.sheetContainer.clientHeight;
			},


			onDragOver (event) {
				const item = event.dataTransfer.items[0];
				if (item)
					this.dragHover = item.type;
			},


			async onDropFile (event, {source} = {}) {
				this.dragHover = null;
				this.sourceDragHover = false;
				//console.log("onDropFile:", event.dataTransfer.items[0], source);

				if (this.sourceEditorConnected) {
					if (window.confirm("Break the edidtor file connection and continue loading?"))
						this.$refs.remoteFile.disconnect();
					else
						return;
				}

				const file = event.dataTransfer.files[0];
				if (file) {
					switch (file.type) {
					case "text/x-lilypond":
					case "text/lilypond-source":
						this.lilySource = await file.readAs("Text");
						//console.log("content:", content);

						this.engraverLogs = null;
						this.clearSheet();

						await this.updateLilyDocument();

						this.engrave();

						break;
					case "text/xml":
						this.converting = true;

						try {
							const xml = await file.readAs("Text");
							//console.log("xml:", xml);
							this.lilySource = await this.musicxml2ly(xml);
							this.engraverLogs = null;
						}
						catch (err) {
							console.warn("musicxml2ly failed:", err);
						}
						this.converting = false;

						this.clearSheet();

						await this.updateLilyDocument();

						if (this.lilySource)
							this.engrave();

						break;
					case "audio/midi":
					case "audio/mid":
						if (source) {
							this.converting = true;

							try {
								this.lilySource = await this.midi2ly(file);
								this.engraverLogs = null;
							}
							catch (err) {
								console.warn("musicxml2ly failed:", err);
							}
							this.converting = false;

							this.clearSheet();

							await this.updateLilyDocument();

							if (this.lilySource)
								this.engrave();
						}
						else {
							const buffer = await file.readAs("ArrayBuffer");
							this.midi = MIDI.parseMidiData(buffer);
						}

						break;
					default:
						console.warn("unsupported file type:", file.type);
					}
				}
				/*else {
					const item = event.dataTransfer.items[0];
					if (item) {
						switch (item.type) {
						case "text/plain":
							this.lilySource = await new Promise(resolve => item.getAsString(resolve));

							this.clearSheet();

							this.updateLilyDocument();
							this.engrave();

							break;
						}
					}
				}*/
			},


			onMidi (data, timestamp) {
				//console.log("onMidi:", data, timestamp);
				if (this.enabledMidiAudio) {
					switch (data.subtype) {
					case "noteOn":
						MidiAudio.noteOn(data.channel, data.noteNumber, data.velocity, timestamp);

						break;
					case "noteOff":
						MidiAudio.noteOff(data.channel, data.noteNumber, timestamp);

						break;
					}
				}
			},


			onCursorPageShift (pageIndex) {
				console.log("onCursorPageShift:", pageIndex);
			},


			onPointerUpdate (point) {
				//console.log("onPointerUpdate:", point);
				this.pointerData = point;
			},


			async onPointerClick (point, event) {
				if (!event.ctrlKey && Number.isFinite(point.tick)) {
					const isPlaying = this.midiPlayer.isPlaying;
					if (isPlaying) {
						this.midiPlayer.pause();
						await animationDelay();
					}

					this.midiPlayer.progressTicks = point.tick;

					if (isPlaying)
						this.midiPlayer.play();
				}
			},


			clearSheet () {
				this.title = null;
				this.sheetDocument = null;
				this.sheetNotation = null;
				this.svgHashTable = null;
				this.lilyNotation = null;
				this.midi = null;
				this.midiNotation = null;
				this.scheduler = null;
				this.pitchContextGroup = null;
				this.midiPlayer = null;
				this.matcherNotations = null;
				this.bakingImages = null;
			},


			async musicxml2ly (xml) {
				const body = new FormData();
				body.append("xml", xml);
				body.append("options", JSON.stringify({
					removeBreak: this.xml2lyOptions.removeBreaks,
					removePageBreak: this.xml2lyOptions.removeBreaks,
				}));

				const response = await fetch("/musicxml2ly", {
					method: "POST",
					body,
				});
				if (!response.ok) {
					const reason = await response.text();
					console.warn("musicxml2ly failed:", reason);

					throw new Error(reason);
				}
				else  {
					const result = await response.text();
					console.debug("musicxml2ly accomplished.");

					return this.postProcessSource(result);
				}
			},


			async midi2ly (midi) {
				const body = new FormData();
				body.append("midi", midi);
				body.append("options", JSON.stringify({removeInstrumentName: true, tupletReplace: true}));

				const response = await fetch("/midi2ly", {
					method: "POST",
					body,
				});
				if (!response.ok) {
					console.warn("MIDI to ly failed:", await response.text());

					return;
				}

				return response.text();
			},


			async engrave () {
				if (this.engraving) {
					console.warn("already engraving, cancelled.");
					return;
				}

				this.engraving = true;
				await this.$nextTick();
				await animationDelay();
				await animationDelay();

				if (this.tokenizeStaff) {
					try {
						await this.updateLilyDocument();
						if (this.lilyDocument)
							this.lilyDocument.interpret({useCached: false});
					}
					catch (err) {
						console.warn("lilydocument parsing failed:", err);
					}
				}

				const body = new FormData();
				body.append("source", this.lilySource);
				if (this.engraveWithLogs)
					body.append("log", this.engraveWithLogs);
				if (this.tokenizeStaff)
					body.append("tokenize", this.tokenizeStaff);

				const response = await fetch("/engrave", {
					method: "POST",
					body,
				});
				if (!response.ok) {
					this.engraverLogs = await response.text();
					//console.warn("Engraving failed:", await response.text());

					this.clearSheet();
					this.svgDocuments = null;
				}
				else {
					const result = await response.json();
					console.log("Engraving accomplished.");

					this.engraverLogs = result.logs;
					this.engraverLogger = result.logger;
					this.svgDocuments = result.svgs;

					if (this.tokenizeStaff) {
						//console.log("doc:", result.doc, result.hashTable);
						this.sheetDocument = recoverJSON(result.doc, {StaffToken, SheetDocument});
						this.svgHashTable = result.hashTable;

						if (this.articulateMIDI)
							this.midi = await this.engraveMIDI();
						else
							this.midi = result.midi;

						if (this.enabledSheetNotation)
							this.updateSheetNotation();

						if (this.midi)
							this.matchNotations(this.midi);
					}
					else
						this.clearSheet();

					this.engraving = false;
				}

				this.engraverDirty = false;
				this.engraving = false;
			},


			async engraveScm () {
				const body = new FormData();
				body.append("source", this.lilySource);

				const response = await fetch("/engraveScm", {
					method: "POST",
					body,
				});
				if (!response.ok) {
					console.warn("engraveScm error:", await response.text());
					return;
				}

				const result = await response.json();
				this.engraverLogs = result.logs;

				const liyad = await import("liyad");
				const scmObj = liyad.S(result.scm);
				console.log("SCM:", scmObj);
			},


			async engraveMIDI ({articulate = true} = {}) {
				const body = new FormData();
				body.append("source", this.lilySource);
				if (articulate)
					body.append("articulate", "1");

				const response = await fetch("/engraveMIDI", {
					method: "POST",
					body,
				});
				if (!response.ok) {
					console.warn("engraveMIDI error:", await response.text());
					return;
				}

				const buffer = await response.arrayBuffer();
				return MIDI.parseMidiData(buffer);
			},


			saveSource () {
				const sourceFile = new Blob([this.lilySource], {type: "text/x-lilypond"});

				const link = document.createElement("a");
				link.href = URL.createObjectURL(sourceFile);

				const filename = prompt("Input your file name:", `${this.title || "lotus-editor"}.ly`);
				if (filename) {
					link.download = /\.\w+/.test(filename) ? filename : filename + ".ly";
					link.click();
				}
			},


			watchEngrave () {
				if (this.autoEngrave && this.engraverDirty && !this.engraving) 
					this.engrave();
			},


			togglePlayer () {
				if (this.midiPlayer) {
					if (this.midiPlayer.isPlaying)
						this.midiPlayer.pause();
					else
						this.midiPlayer.play();
				}
			},


			async sliceSource (startTick, endTick) {
				if (!this.midi)
					return null;

				const partMidi = MidiUtils.sliceMidi(this.midi, startTick, endTick);
				console.log("partMidi:", partMidi);

				const midi = new Blob([MIDI.encodeMidiFile(partMidi)], {type: "audio/midi"});
				const ly = this.midi2ly(midi);
				console.log("ly:", ly);
			},


			updateSheetNotation () {
				this.sheetNotation = null;
				this.matcherNotations = null;

				if (this.sheetDocument) {
					const logger = new LogRecorder({enabled: true});
					this.sheetNotation = StaffNotation.parseNotationFromSheetDocument(this.sheetDocument, {logger});

					if (this.lilyDocument) {
						const tickTable = this.lilyDocument.getLocationTickTable();
						StaffNotation.assignTickByLocationTable(this.sheetNotation, tickTable);
					}
					else
						console.warn("lilyDocument is null, assignTickByLocationTable skipped.");

					console.log("sheet notation parsed:", logger.toJSON());
				}
			},


			async matchNotations (midi) {
				console.assert(midi, "midi is null.");
				if (this.enabledSheetNotation) {
					console.assert(this.sheetNotation, "sheetNotation is null.");

					const midiNotation = MusicNotation.Notation.parseMidi(midi);

					this.matcherNotations = await StaffNotation.matchNotations(midiNotation, this.sheetNotation, {enableFuzzy: this.enabledFuzzyMatcher});

					this.midiNotation = midiNotation;

					this.pitchContextGroup = PitchContextTable.createPitchContextGroup(this.sheetNotation.pitchContexts, this.midiNotation);

					this.matchedIds = new Set();
					this.midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => this.matchedIds.add(id)));
				}
				else {
					this.lilyNotation = this.lilyDocument.interpret().getNotation();
					this.matcherNotations = await LilyNotation.matchWithExactMIDI(this.lilyNotation, midi);

					const measureIndices = this.lilyNotation.getMeasureIndices(this.measureLayoutType);
					this.midiNotation = this.lilyNotation.toPerformingNotationWithEvents(measureIndices);
					this.pitchContextGroup = this.lilyNotation.getContextGroup(measureIndices);

					this.matchedIds = this.lilyNotation.idSet;

					this.scheduler = LilyNotation.Scheduler.createFromNotation(this.lilyNotation.toPerformingNotation(measureIndices, {withRestTied: true}), this.sheetDocument.getTokenMap());
				}

				this.sheetDocument.updateMatchedTokens(this.matchedIds);

				if (this.bakingSheet)
					this.bakeSheet();
			},


			async exportScore () {
				console.assert(this.sheetDocument, "sheetDocument is null.");
				console.assert(this.pitchContextGroup, "pitchContextGroup is null.");
				console.assert(this.midiNotation, "midiNotation is null.");

				await this.updateLilyDocument();
				const attributes = this.lilyDocument.globalAttributes({readonly: true});

				const midiMusic = this.lilyDocument.interpret().midiMusic;

				const meta = {
					title: attributes.title && attributes.title.toString(),
					composer: attributes.composer && attributes.composer.toString(),
					pageSize: this.sheetDocument.pageSize,
					pageCount: this.sheetDocument.pages.length,
					staffSize: attributes.staffSize,
					trackInfos: midiMusic && midiMusic.trackContextDicts,
				};

				//const noteLinkings = this.midiNotation.notes.map(note => _.pick(note, ["ids", "staffTrack", "contextIndex"]));

				const data = {
					version: npmPackage.version + " -playground",
					meta,
					doc: this.sheetDocument,
					//midi: this.midi,
					hashTable: this.bakingSheet ? null : this.svgHashTable,
					//noteLinkings,
					lilyNotation: this.lilyNotation,
					//pitchContextGroup: this.pitchContextGroup,
				};
				const score = new Blob([JSON.stringify(data)], {type: "application/json"});

				const {default: JSZip} = await import("jszip");
				const pack = new JSZip();
				pack.file("score.json", score);

				if (this.bakingSheet && this.bakingImages) {
					await Promise.all(this.bakingImages.map(async (url, index) => {
						const img = await (await fetch(url)).blob();
						pack.file(`baking${index}.png`, img);
						console.log("img:", img);
					}));
				}

				const blob = await pack.generateAsync({type: "blob", compression: "DEFLATE", compressionOptions: {level: 5}});
				downloadUrl(URL.createObjectURL(blob), `${this.title || ""}.zip`);
			},


			async updateLilyDocument () {
				if ((!this.lilyDocument || this.lilyDocumentDirty) && this.lilyParser) {
					const raw = await this.lilyParser.parse(this.lilySource);
					this.lilyDocument = new LilyDocument(raw);

					const titleExp = this.lilyDocument.globalAttributes({readonly: true}).title;
					this.title = titleExp && titleExp.toString();

					//console.log("lily document", this.lilyDocument);
					//console.log(this.lilyDocument.toString());

					this.lilyDocumentDirty = false;
				}
			},


			updateLilyTextSource () {
				if (this.lilyTextSourceDirty) {
					this.lilyTextSource = new TextSource(this.lilySource);

					this.lilyTextSourceDirty = false;
				}
			},


			markupLilyDocument (doc) {
				doc.formalize();

				const globalAttributes = doc.globalAttributes();

				if (this.lilyMarkups.staffSize)
					globalAttributes.staffSize.value = this.lilyMarkups.staffSize;

				if (this.lilyMarkups.autoPaperSize) {
					globalAttributes.paperWidth.value.set({number: this.autoPageSize.width / CM_TO_PX, unit: "\\cm"});
					globalAttributes.paperHeight.value.set({number: this.autoPageSize.height / CM_TO_PX, unit: "\\cm"});
				}

				if (this.lilyMarkups.systemSpacing >= 0)
					globalAttributes.systemSpacing.value = this.lilyMarkups.systemSpacing;

				if (this.lilyMarkups.topMarkupSpacing >= 0)
					globalAttributes.topMarkupSpacing.value = this.lilyMarkups.topMarkupSpacing;

				if (typeof this.lilyMarkups.raggedLast === "boolean")
					globalAttributes.raggedLast.value = this.lilyMarkups.raggedLast;
			},


			async markupSource () {
				await this.updateLilyDocument();

				console.assert(this.lilyDocument, "lilyDocument is null.");

				this.markupLilyDocument(this.lilyDocument);

				this.lilySource = this.lilyDocument.toString();

				await this.$nextTick();
				this.engraverLogs = null;
			},


			async postProcessSource (source) {
				const lilyDocument = new LilyDocument(await this.lilyParser.parse(source));

				if (this.xml2lyOptions.removeStaffGroup)
					lilyDocument.removeStaffGroup();

				if (this.xml2lyOptions.mergeContinuousGraces)
					lilyDocument.mergeContinuousGraces();

				if (this.xml2lyOptions.excludeChordTracksFromMIDI)
					lilyDocument.excludeChordTracksFromMIDI();

				if (this.xml2lyOptions.midiChannelMapping)
					lilyDocument.useMidiInstrumentChannelMapping();

				return lilyDocument.toString();
			},


			removeTrillSpans () {
				return this.executeMarkup("removeTrillSpans");
			},


			async exportMarkupLily () {
				const lilyDocument = new LilyDocument(await this.lilyParser.parse("\\version \"2.20.0\""));
				this.markupLilyDocument(lilyDocument);

				const blob = new Blob([lilyDocument.toString()]);

				return downloadUrl(URL.createObjectURL(blob), "markup.ly");
			},


			async bakeSheet () {
				console.assert(this.svgDocuments, "svgDocuments is null.");
				console.assert(this.matchedIds, "matchedIds is null.");

				this.bakingImages = await SheetBaker.bakeRawSvgs(this.svgDocuments, this.matchedIds, this.$refs.canvas);
			},


			async inspectLily () {
				await this.updateLilyDocument();
				this.updateLilyTextSource();

				console.log(this.lilyDocument);
			},


			showEngraverLog () {
				console.log(this.engraverLogs);
			},


			async executeMarkup (func) {
				await this.updateLilyDocument();
				if (!this.lilyDocument)
					console.log("lilyDocument parsing failed.");

				if (!this.lilyDocument[func])
					console.warn("Markup function not found:", func, this.lilyDocument);

				this.lilyDocument[func]();

				this.lilySource = this.lilyDocument.toString();
			},


			async unfoldRepeats () {
				this.operating = true;

				try {
					await this.updateLilyDocument();

					if (!this.lilyDocument)
						throw new Error("lilyDocument is null.");

					this.lilyDocument.unfoldRepeats();
					this.lilySource = this.lilyDocument.toString();

					await this.engrave();

					this.lilySource = replaceSourceToken(this.lilySource, "\\unfoldRepeats");

					this.engraving = true;

					const body = new FormData();
					body.append("source", this.lilySource);
					if (this.engraveWithLogs)
						body.append("log", this.engraveWithLogs);
					body.append("tokenize", true);

					const response = await fetch("/engrave", {
						method: "POST",
						body,
					});
					if (!response.ok) {
						const reason = await response.text();
						throw new Error(reason);
					}
					else {
						const result = await response.json();

						this.engraverLogs = result.logs;
						this.svgDocuments = result.svgs;

						this.sheetDocument = recoverJSON(result.doc, {StaffToken, SheetDocument});
						this.svgHashTable = result.hashTable;

						this.sheetDocument.updateMatchedTokens(this.matchedIds);
						this.$refs.sheet.preparePlayer();
					}
				}
				catch (err) {
					console.warn("unfoldRepeats failed:", err);
				}


				this.engraverDirty = false;
				this.engraving = false;
				this.operating = false;
			},


			async redivideLilyDocument ({reconstruct = false} = {}) {
				await this.updateLilyDocument();
				const interpreter = this.lilyDocument.interpret({useCached: false});

				if (reconstruct) {
					interpreter.layoutMusic.musicTracks.forEach(track => track.redivide());

					this.lilyDocument = interpreter.toDocument();
					this.lilySource = this.lilyDocument.toString();
				}
				else {
					this.lilyDocument.root.forEachTopTerm(LilyTerms.Assignment, assign => {
						if (assign.value && typeof assign.value === "object" && assign.value.isMusic) {
							const key = assign.key.toString();
							const track = interpreter.layoutMusic.musicTracks.find(track => track.contextDict.Voice === key);
							const block = assign.value.findFirst(LilyTerms.MusicBlock);
							//console.log("track:", key, track, block);

							block.redivide({measureHeads: track.measureHeads});
						}
					});
					this.lilySource = this.lilyDocument.toString();
				}

				//this.executeMarkup("redivide");
			},


			async sliceMeasures (start, count) {
				await this.updateLilyDocument();

				const interpreter = this.lilyDocument.interpret({useCached: false});
				interpreter.sliceMeasures(start, count);
				this.lilyDocument = interpreter.toDocument();
				this.lilySource = this.lilyDocument.toString();
			},


			async createPianoRhythm (options) {
				await this.updateLilyDocument();

				const interpreter = this.lilyDocument.interpret({useCached: false});
				createPianoRhythm(interpreter, options);

				this.lilyDocument = interpreter.toDocument();
				this.lilySource = this.lilyDocument.toString();

				await this.$nextTick();
				this.lilyDocumentDirty = false;
			},


			async testInterpreter ({flatten = false} = {}) {
				await this.updateLilyDocument();

				const interpreter = this.lilyDocument.interpret({useCached: false});

				const lilyNotation = interpreter.getNotation();

				if (flatten)
					interpreter.layoutMusic.musicTracks.forEach(track => track.flatten({spreadRepeats: true}));
				const newDoc = interpreter.toDocument();

				console.log("INTERPRETER:", interpreter);
				console.log("DOC:", newDoc);
				console.log("NOTATION:", lilyNotation);
			},


			onSourceDirPick (filePath) {
				//console.log("onSourceDirPick:", filePath);
				this.sourceEditorFilePath = filePath;
				this.$nextTick(() => {
					if (this.$refs.remoteFile)
						this.$refs.remoteFile.connect();
				});
			},


			highlightSourcePosition (position) {
				this.updateLilyTextSource();

				if (position.length >= 2) {
					const textarea = this.$el.querySelector(".prism-editor__textarea");
					if (!textarea) {
						console.warn(".prism-editor__textarea is not found.");
						return;
					}

					const startChars = this.lilyTextSource.positionToChars([position[0], position[1]]);
					const endChars = position.length >= 3 ? this.lilyTextSource.positionToChars([position[0], position[2]]) : startChars;

					//console.log("highlightSourcePosition:", position, textarea, startChars, endChars);
					textarea.setSelectionRange(startChars, endChars);
					textarea.focus();

					const wrapper = this.$el.querySelector(".prism-editor-wrapper");

					//console.log("scroll:", (position[2] || position[1]) * 9.7 - textarea.clientWidth, position[0] * 19 - this.$refs.sourceEditor.$el.clientHeight);
					const idealPos = {
						left: position[1] * 9.7,
						right: ((position[2] || position[1]) + 2) * 9.7,
						top: (position[0] - 1) * 19,
						bottom: (position[0] + 2) * 19,
					};
					wrapper.scrollLeft = Math.max(idealPos.right + 50 - wrapper.clientWidth, wrapper.scrollLeft);
					wrapper.scrollLeft = Math.min(idealPos.left, wrapper.scrollLeft);
					wrapper.scrollTop = Math.max(idealPos.bottom - wrapper.clientHeight, wrapper.scrollTop);
					wrapper.scrollTop = Math.min(idealPos.top, wrapper.scrollTop);
				}
			},


			onSheetLink (event, href) {
				event.preventDefault();

				//console.log("onSheetLink:", href);
				const position = href.match(/\d+/g);
				if (position)
					this.highlightSourcePosition(position.map(Number));
			},


			onClickToken (token, event) {
				//console.log("onClickToken:", token, event);
				if (event.ctrlKey && token.href) {
					const position = token.href.match(/\d+/g);
					if (position)
						this.highlightSourcePosition(position.map(Number));
				}
				else
					console.log("token:", token);
			},


			onClickMatcherNote (note) {
				console.log("matcher note:", {...note});

				if (note.id) {
					const position = note.id.match(/\d+/g);
					if (position)
						this.highlightSourcePosition(position.map(Number));
				}
			},


			async updateMeasureLayoutCode () {
				await this.updateLilyDocument();
				this.measureLayoutCode = this.lilyDocument.interpret().layoutMusic.measureLayoutCode;
				this.measureLayoutCodeDirty = false;
			},


			async validateMeasureLayoutCode () {
				this.measureLayoutCodeError = null;

				if (!this.measureLayoutCode)
					return;

				try {
					/*const result =*/ await this.measuresParser.parse(this.measureLayoutCode);
					//const measures = recoverJSON(result.data, measureLayout);
					//console.log("measures:", measures);

					// TODO: validate measure indices
				}
				catch (err) {
					//console.warn("measure layout code parse error:", err);
					this.measureLayoutCodeError = err;
				}
			},


			async applyUpdateMeasureLayoutCode () {
				if (!this.measureLayoutCode)
					return;

				try {
					const result = await this.measuresParser.parse(this.measureLayoutCode);
					const layout = recoverJSON(result.data, measureLayout);

					await this.updateLilyDocument();
					/*const interpreter = this.lilyDocument.interpret();

					interpreter.layoutMusic.applyMeasureLayout(layout);
					this.lilySource = interpreter.toDocument().toString();*/
					this.lilyDocument.interpret();

					this.applyMeasureLayout(layout);

					this.measureLayoutCodeDirty = false;
				}
				catch (err) {
					this.measureLayoutCodeError = err;
					console.error(err);
				}
			},


			applyMeasureLayout (layout) {
				const tracks = this.lilyDocument.root.sections.filter(section =>
					section instanceof LilyTerms.Assignment && section.value instanceof LilyTerms.Relative && section.value.measureLayout)
					.map(assignment => assignment.value.args)
					.map(args => MusicTrack.fromBlockAnchor(args[1], args[0]));
				tracks.forEach(track => track.applyMeasureLayout(layout));

				this.lilySource = this.lilyDocument.toString();
			},


			async flattenTracks () {
				await this.updateLilyDocument();
				this.lilyDocument.interpret();

				const tracks = this.lilyDocument.root.sections.filter(section =>
					section instanceof LilyTerms.Assignment && section.value instanceof LilyTerms.Relative && section.value.measureLayout)
					.map(assignment => assignment.value.args)
					.map(args => MusicTrack.fromBlockAnchor(args[1], args[0]));
				tracks.forEach(track => track.flatten({spreadRepeats: true}));

				this.lilySource = this.lilyDocument.toString();
			},


			// 's: 1 n*[x]' => 's: n*[x+1]'
			async mergeSingleVoltaMLayout () {
				await this.updateLilyDocument();
				const interpreter = this.lilyDocument.interpret();

				const layout = interpreter.layoutMusic.mainTrack.block.measureLayout;
				let index = 1;
				for (; index < layout.seq.length - 1; ++index) {
					const found = !(layout.seq[index - 1] instanceof measureLayout.SingleMLayout)
						&& layout.seq[index] instanceof measureLayout.SingleMLayout
						&& layout.seq[index + 1] instanceof measureLayout.VoltaMLayout;

					if (found)
						break;
				}

				if (index < layout.seq.length - 1) {
					const [single] = layout.seq.splice(index, 1);
					const volta = layout.seq[index];
					volta.body.unshift(single);
					//console.log("code:", layout.code);

					this.applyMeasureLayout(layout);

					return true;
				}

				return false;
			},


			staffTopToken (staff) {
				const tokens = [].concat(...staff.measures.map(measure => measure.tokens));
				return tokens.reduce((top, token) => !top || token.y < top.y ? token : top, null);
			},


			staffBottomToken (staff) {
				const tokens = [].concat(...staff.measures.map(measure => measure.tokens));
				return tokens.reduce((bottom, token) => !bottom || token.y > bottom.y ? token : bottom, null);
			},
		},


		watch: {
			lilySource () {
				this.engraverDirty = true;
				this.lilyDocumentDirty = true;
				this.lilyTextSourceDirty = true;
				this.engraverLogs = null;
				this.measureLayoutCode = null;
				this.measureLayoutCodeError = null;

				if (!this.sourceEditorConnected)
					this.sourceEditorFilePath = null;
			},


			markupValueHash () {
				if (this.lilyParser && this.lilyMarkups.enabled)
					this.markupSource();
			},


			engraverDirty (value) {
				if (value && this.autoEngrave)
					mutexDelay("autoEngrave", 5e+3).then(valid => !valid || this.watchEngrave());
			},


			autoEngrave: "watchEngrave",


			tokenizeStaff (value) {
				if (value && this.lilySource && !this.sheetDocument)
					this.engraverDirty = true;
			},


			bakingSheet (value) {
				if (value) {
					if (this.svgDocuments && this.matchedIds)
						this.bakeSheet();
				}
				else
					this.bakingImages = null;
			},
		},
	};
</script>

<style lang="scss">
	@import "../styles/common.scss";
	@import "../styles/chromatic.scss";

	@import "../styles/emmentaler-font.scss";


	.drag-hover
	{
		&[data-hover-type="text/x-lilypond"], &[data-hover-type="text/lilypond-source"]
		{
			background-color: #cfc;
		}

		&[data-hover-type="text/xml"]
		{
			background-color: #ffc;
		}

		&[data-hover-type="audio/midi"], &[data-hover-type="audio/mid"]
		{
			background-color: #cff;
		}
	}

	.playground
	{
		position: absolute;
		display: flex;
		flex-direction: column;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;

		header
		{
			.title
			{
				font-weight: bold;
			}

			&.buzy
			{
				background-color: #ffc;
			}

			.pointer-info
			{
				display: inline-block;
				width: 8em;

				& > span > span + span
				{
					display: inline-block;
					margin-left: .6em;
				}
			}

			.measure-layout-code
			{
				width: 22em;
				font-size: 20px;

				&.error
				{
					border: red 1px solid;
					background-color: #fcc;
				}

				&.dirty
				{
					outline: black 2px solid;
				}
			}

			.apply
			{
				font-size: 70%;
			}
		}

		& > main
		{
			flex: 1 1 0;
			min-height: 0;
			position: relative;
			width: 100%;
			display: flex;
			flex-direction: row;

			& > *
			{
				height: 100%;
				position: relative;
			}

			.source-container
			{
				& > div
				{
					height: 100%;
				}

				&.drag-hover
				{
					outline: 4px #4f4 dashed;
				}

				.corner
				{
					position: absolute;
					top: .2em;
					right: .2em;

					button
					{
						border: 0;
						outline: 0;
						cursor: pointer;
						vertical-align: top;
					}

					.inspect
					{
						background: transparent;
						font-size: 200%;
						opacity: .01;

						&:hover
						{
							opacity: 1;
						}
					}

					.log
					{
						border-radius: 1em;
						font-weight: bold;

						&.info
						{
							color: green;

							&::before
							{
								content: "\24d8";
							}
						}

						&.warning
						{
							font-size: 160%;
							color: darkorange;
							background: lightyellow;

							&::before
							{
								content: "\26a0";
							}
						}

						&.error
						{
							font-size: 160%;
							color: red;
							background: pink;

							&::before
							{
								content: "\24d4";
							}
						}
					}
				}

				&.connected
				{
					.source-editor 
					{
						outline: 2px solid #0006;

						.prism-editor-wrapper
						{
							background-color: #f0f6f0;
						}
					}
				}
			}

			.build-container
			{
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				min-width: 0;

				&.loading > .sheet-container
				{
					filter: blur(8px);
				}

				&.dirty
				{
					outline: #fc0a 1px solid;
					background-color: #fc01;
				}

				.sheet-container
				{
					flex: 1 1 0;
					overflow: auto;
					width: 100%;
				}

				// sheet custom styles
				.sheet.live
				{
					white-space: nowrap;
					display: inline-block;

					.page
					{
						display: inline-block;
						margin: 1em;
						background: #f6fffa;
						border-radius: 1em;
					}

					.cursor
					{
						fill: lightblue;
					}

					.token.tied
					{
						text, use
						{
							fill-opacity: 0.6;
						}
					}

					.staff-peak
					{
						pointer-events: none;

						path
						{
							stroke-width: 0.1;
							stroke: #f00a;
							fill: none;
						}

						line
						{
							stroke-width: 0.1;
							stroke: #f00a;
							stroke-dasharray: 0.2 0.2;
						}

						circle
						{
							r: 0.6;
							fill: #f004;
						}
					}
				}

				&.inspecting
				{
					.token.mismatched use
					{
						fill: red;
					}

					.token.tied use
					{
						fill: goldenrod;
					}
				}
			}

			.source-editor-controls
			{
				position: absolute;
				top: 0;
				left: 0;
				height: unset;
				transform: translate(0, -100%);

				.folder
				{
					font-size: 140%;
					width: 2em;
					margin-right: 1em;
				}

				.dir-browser
				{
					position: absolute;
					left: 0;
					top: 100%;
					height: calc(100vh - 8em);
					width: 600px;
					border: 0;
					box-shadow: 10px 10px 20px #0006;
					background-color: #fffa;
				}

				.file-path
				{
					width: 40em;
					color: #777;
					font-style: italic;
					border: 0;
				}

				.connected
				{
					.file-path
					{
						font-weight: bold;
					}
				}
			}
		}

		.settings
		{
			font-family: Verdana, Arial;
			font-size: 20px;

			hr
			{
				border-width: .2px;
			}

			th
			{
				text-transform: uppercase;
				padding: 1em;
				font-size: 120%;
			}

			td
			{
				text-align: left;
				padding: .2em 1em;
				white-space: nowrap;

				&:first-child
				{
					text-align: right;
				}
			}
		}
	}
</style>
