<template>
	<div class="playground"
		:class="{'drag-hover': dragHover}"
		:data-hover-type="dragHover"
		@dragover.prevent="onDragOver"
		@dragleave="dragHover = null"
		@drop.prevent="onDropFile"
	>
		<header class="controls">
			<StoreInput v-show="false" v-model="lilySource" sessionKey="lotus-lilySource" />
			<fieldset>
				<span v-if="title" class="title">{{title}}</span>
			</fieldset>
			<fieldset>
				<button @click="saveSource" title="save source">&#x1f4be;</button>
				<button @click="settingPanelVisible = true">&#x2699;</button>
				<button v-show="lilyMarkups.enabled" @click="markupSource" title="markup lilypond source">{}</button>
			</fieldset>
			<fieldset>
				<span>
					<BoolStoreInput v-model="autoEngrave" sessionKey="lotus-autoEngrave" />auto
				</span>
				<span class="dirty-badge" :class="{dirty: engraverDirty}"></span>
				<button @click="engrave" :class="{working: engraving}" style="zoom: 160%" title="engrave">&#x1f3bc;</button>
				<button :disabled="!sheetDocument" @click="exportScore">json</button>
			</fieldset>
			<fieldset>
				<BoolStoreInput v-show="false" v-model="tokenizeStaff" sessionKey="lotus-tokenizeStaff" />
				<BoolStoreInput v-show="false" v-model="rollVisible" sessionKey="lotus-rollVisible" />
				<BoolStoreInput v-show="false" v-model="showNotationsMatcher" sessionKey="lotus-showNotationsMatcher" />
				<BoolStoreInput v-show="false" v-model="enabledMidiAudio" sessionKey="lotus-enabledMidiAudio" />
				<BoolStoreInput v-show="false" v-model="showCursor" sessionKey="lotus-playground.showCursor" />
				<CheckButton content="&#x1f3b9;" v-model="tokenizeStaff" title="live staff" />
				<fieldset v-show="tokenizeStaff">
					<CheckButton content="&#x1f3a8;" v-model="chromaticSymbols" :disabled="!sheetDocument" title="chromatic symbols" />
					<CheckButton content="&#x2633;" v-model="rollVisible" :disabled="!midiPlayer" title="show MIDI roll" />
					<CheckButton content="c|s" v-model="showNotationsMatcher" :disabled="!matcherNotations" title="show notations matcher" />
					<CheckButton content="&#x1f50a;" v-model="enabledMidiAudio" title="MIDI Audio" />
					<CheckButton content="&#xa56f;" v-model="showCursor" title="show cursor" />
					<button @click="togglePlayer" :disabled="!midiPlayer">{{midiPlayer && midiPlayer.isPlaying ? "&#x23f8;" : "&#x25b6;"}}</button>
				</fieldset>
			</fieldset>
			<fieldset>
				<BoolStoreInput v-show="false" v-model="bakingSheet" sessionKey="lotus-bakingSheet" />
				<CheckButton content="&#x1f35e;" v-model="bakingSheet" title="baking sheet" />
				<CheckButton v-show="bakingSheet" content="&#x1f9b2;" v-model="hideBakingImages" title="hide baking images" />
			</fieldset>
		</header>
		<main>
			<div class="source-container" :class="{loading: converting}">
				<SourceEditor :source.sync="lilySource" :disabled="converting" />
				<button class="inspect" @click="inspectLily">&#x1f4d5;</button>
				<Loading v-show="converting" />
			</div>
			<div class="build-container" ref="buildContainer" :class="{
				loading: engraving, dirty: engraverDirty, chromatic: chromaticSymbols, inspecting: showNotationsMatcher,
			}">
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
				/>
				<div class="sheet-container" ref="sheetContainer" v-resize="onResize">
					<SheetSimple v-if="svgDocuments && !tokenizeStaff" :documents="svgDocuments" />
					<SheetSigns v-if="svgHashTable" v-show="false" :hashTable="svgHashTable" />
					<SheetLive v-if="tokenizeStaff && sheetDocument" ref="sheet"
						:doc="sheetDocument"
						:midiNotation="midiNotation"
						:pitchContextGroup="pitchContextGroup"
						:midiPlayer.sync="midiPlayer"
						:showMark="true"
						:showCursor="showCursor"
						:bakingMode="bakingSheet"
						:backgroundImages="hideBakingImages ? null : bakingImages"
						@midi="onMidi"
						@cursorPageShift="onCursorPageShift"
					/>
				</div>
				<Loading v-show="engraving" />
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
						<td>Remove Trill Spans</td>
						<td><button @click="removeTrillSpans">remove</button></td>
					</tr>
					<tr>
						<th>Engrave</th>
						<td><hr /></td>
					</tr>
					<tr>
						<td>Logs</td>
						<td><BoolStoreInput v-model="engraveWithLogs" localKey="lotus-engraveWithLogs" /></td>
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
	import {mutexDelay} from "../delay.js";
	import {recoverJSON} from "../../inc/jsonRecovery.ts";
	import StaffToken from "../../inc/staffSvg/staffToken.ts";
	import SheetDocument from "../../inc/staffSvg/sheetDocument.ts";
	import LogRecorder from "../../inc/logRecorder.ts";
	import * as StaffNotation from "../../inc/staffSvg/staffNotation.ts";
	import loadLilyParser from "../loadLilyParser.js";
	import {LilyDocument} from "../../inc/lilyParser";
	import {CM_TO_PX} from "../../inc/constants.ts";
	import * as SheetBaker from "../sheetBaker.ts";

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
				pitchContextGroup: null,
				chromaticSymbols: false,
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
				},
				engraveWithLogs: false,
				lilyMarkups: {
					enabled: false,
					staffSize: null,
					autoPaperSize: true,
					pageCount: 2,
					systemSpacing: -1,
					topMarkupSpacing: -1,
					raggedLast: true,
					standaloneTitle: false, // TODO: not implemented
				},
				lilyParser: null,
				lilyDocumentDirty: false,
				bakingSheet: false,
				bakingImages: null,
				hideBakingImages: false,
				lilyMarkupMethods: Object.getOwnPropertyNames(LilyDocument.prototype),
				chosenLilyMarkupMethod: null,
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
		},


		async created () {
			window.$main = this;

			if (MidiAudio.WebAudio.empty())
				MidiAudio.loadPlugin({soundfontUrl: "/soundfont/", api: "webaudio"}).then(() => console.log("Soundfont loaded."));

			this.lilyParser = await loadLilyParser();
			console.log("lily parser loaded.");

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


			async onDropFile (event) {
				this.dragHover = null;
				//console.log("onDropFile:", event.dataTransfer.items[0]);

				const file = event.dataTransfer.files[0];
				if (file) {
					switch (file.type) {
					case "text/x-lilypond":
					case "text/lilypond-source":
						this.lilySource = await file.readAs("Text");
						//console.log("content:", content);

						this.clearSheet();

						this.updateLilyDocument();

						this.engrave();

						break;
					case "text/xml":
						const xml = await file.readAs("Text");
						//console.log("xml:", xml);
						this.lilySource = await this.musicxml2ly(xml);

						this.clearSheet();

						this.updateLilyDocument();

						if (this.lilySource)
							this.engrave();

						break;
					case "audio/midi":
					case "audio/mid":
						const buffer = await file.readAs("ArrayBuffer");
						this.midi = MIDI.parseMidiData(buffer);

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


			clearSheet () {
				this.title = null;
				this.sheetDocument = null;
				this.sheetNotation = null;
				this.svgHashTable = null;
				this.midi = null;
				this.midiNotation = null;
				this.pitchContextGroup = null;
				this.midiPlayer = null;
				this.matcherNotations = null;
				this.bakingImages = null;
			},


			async musicxml2ly (xml) {
				this.converting = true;

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
				if (!response.ok)
					console.warn("musicxml2ly failed:", await response.text());
				else  {
					const result = await response.text();
					console.log("musicxml2ly accomplished.");

					this.converting = false;

					return this.postProcessSource(result);
				}

				this.converting = false;
			},


			async engrave () {
				if (this.engraving) {
					console.warn("already engraving, cancelled.");
					return;
				}

				this.engraving = true;

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
					console.warn("Engraving failed:", await response.text());

					this.clearSheet();
					this.svgDocuments = null;
				}
				else {
					const result = await response.json();
					console.log("Engraving accomplished.");

					this.engraverLogs = result.logs;
					this.svgDocuments = result.svgs;

					if (this.tokenizeStaff) {
						//console.log("doc:", result.doc, result.hashTable);
						this.sheetDocument = recoverJSON(result.doc, {StaffToken, SheetDocument});
						this.svgHashTable = result.hashTable;
						this.midi = result.midi;

						this.updateSheetNotation();

						if (this.midi) {
							const midiNotation = MusicNotation.Notation.parseMidi(this.midi);
							this.matchNotations(midiNotation);
						}
					}
					else
						this.clearSheet();

					this.engraving = false;
				}

				this.engraverDirty = false;
				this.engraving = false;
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

				const body = new FormData();
				const midi = new Blob([MIDI.encodeMidiFile(partMidi)], {type: "audio/midi"});
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

				const ly = await response.text();
				console.log("ly:", ly);
			},


			updateSheetNotation () {
				this.sheetNotation = null;
				this.matcherNotations = null;

				if (this.sheetDocument) {
					const logger = new LogRecorder({enabled: true});
					this.sheetNotation = StaffNotation.parseNotationFromSheetDocument(this.sheetDocument, {logger});

					console.log("sheet notation parsed:", logger.toJSON());
				}
			},


			async matchNotations (midiNotation) {
				console.assert(midiNotation, "midiNotation is null.");
				console.assert(this.sheetNotation, "sheetNotation is null.");

				this.matcherNotations = await StaffNotation.matchNotations(midiNotation, this.sheetNotation);

				this.matchedIds = new Set();
				midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => this.matchedIds.add(id)));

				this.sheetDocument.updateMatchedTokens(this.matchedIds);

				this.midiNotation = midiNotation;

				this.pitchContextGroup = StaffNotation.createPitchContextGroup(this.sheetNotation.pitchContexts, this.midiNotation);

				if (this.bakingSheet)
					this.bakeSheet();
			},


			exportScore () {
				console.assert(this.sheetDocument, "sheetDocument is null.");
				console.assert(this.pitchContextGroup, "pitchContextGroup is null.");
				console.assert(this.midiNotation, "midiNotation is null.");

				this.updateLilyDocument();
				const attributes = this.lilyDocument.globalAttributes({readonly: true});

				const meta = {
					title: attributes.title,
					composer: attributes.composer,
					pageSize: this.sheetDocument.pageSize,
					pageCount: this.sheetDocument.pages.length,
					staffSize: attributes.staffSize,
				};

				const noteLinkings = this.midiNotation.notes.map(note => _.pick(note, ["ids", "staffTrack", "contextIndex"]));

				const data = {
					meta,
					doc: this.sheetDocument,
					midi: this.midi,
					hashTable: this.svgHashTable,
					noteLinkings,
					pitchContextGroup: this.pitchContextGroup,
				};
				const blob = new Blob([JSON.stringify(data)]);

				downloadUrl(URL.createObjectURL(blob), `${this.title || ""}.score.json`);
			},


			updateLilyDocument () {
				if ((!this.lilyDocument || this.lilyDocumentDirty) && this.lilyParser) {
					this.lilyDocument = new LilyDocument(this.lilyParser.parse(this.lilySource));

					const titleExp = this.lilyDocument.globalAttributes({readonly: true}).title;
					this.title = titleExp && titleExp.toString();

					//console.log("lily document", this.lilyDocument);
					//console.log(this.lilyDocument.toString());

					this.lilyDocumentDirty = false;
				}
			},


			markupLilyDocument (doc) {
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
				this.updateLilyDocument();

				console.assert(this.lilyDocument, "lilyDocument is null.");

				this.markupLilyDocument(this.lilyDocument);

				this.lilySource = this.lilyDocument.toString();

				await this.$nextTick();
				this.lilyDocumentDirty = false;
			},


			postProcessSource (source) {
				const lilyDocument = new LilyDocument(this.lilyParser.parse(source));

				if (this.xml2lyOptions.removeStaffGroup)
					lilyDocument.removeStaffGroup();

				return lilyDocument.toString();
			},


			async removeTrillSpans () {
				this.updateLilyDocument();

				this.lilyDocument.removeTrillSpans();

				this.lilySource = this.lilyDocument.toString();

				await this.$nextTick();
				this.lilyDocumentDirty = false;
			},


			exportMarkupLily () {
				const lilyDocument = new LilyDocument(this.lilyParser.parse("\\version \"2.20.0\""));
				this.markupLilyDocument(lilyDocument);

				const blob = new Blob([lilyDocument.toString()]);

				return downloadUrl(URL.createObjectURL(blob), "markup.ly");
			},


			async bakeSheet () {
				console.assert(this.svgDocuments, "svgDocuments is null.");
				console.assert(this.matchedIds, "matchedIds is null.");

				this.bakingImages = await SheetBaker.bakeRawSvgs(this.svgDocuments, this.matchedIds, this.$refs.canvas);
			},


			inspectLily () {
				this.updateLilyDocument();
				console.log(this.lilyDocument);
			},


			executeMarkup (func) {
				this.updateLilyDocument();
				if (!this.lilyDocument)
					console.log("lilyDocument parsing failed.");

				if (!this.lilyDocument[func])
					console.warn("Markup function not found:", func, this.lilyDocument);

				this.lilyDocument[func]();

				this.lilySource = this.lilyDocument.toString();
			},
		},


		watch: {
			lilySource () {
				this.engraverDirty = true;
				this.lilyDocumentDirty = true;
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
	@import "../styles/chromaticSymbols.scss";

	
	.drag-hover
	{
		.source-container
		{
			outline: 4px #4f4 dashed;
		}

		&[data-hover-type="text/x-lilypond"], &[data-hover-type="text/lilypond-source"]
		{
			background-color: #cfc;
		}

		&[data-hover-type="text/xml"]
		{
			background-color: #ffc;
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

				.inspect
				{
					position: absolute;
					top: 0;
					right: .4em;
					background: transparent;
					border: 0;
					outline: 0;
					cursor: pointer;
					font-size: 200%;
					opacity: .01;

					&:hover
					{
						opacity: 1;
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
