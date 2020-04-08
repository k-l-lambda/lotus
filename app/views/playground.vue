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
				<button @click="saveSource" title="save source">&#x1f4be;</button>
			</fieldset>
			<fieldset>
				<span>
					<BoolStoreInput v-model="autoEngrave" sessionKey="lotus-autoEngrave" />auto
				</span>
				<span class="dirty-badge" :class="{dirty: engraverDirty}"></span>
				<button @click="engrave" :class="{working: engraving}" style="zoom: 160%" title="engrave">&#x1f3bc;</button>
				<button :disabled="!sheetDocument" @click="exportScore">.json</button>
			</fieldset>
			<fieldset>
				<BoolStoreInput v-show="false" v-model="tokenizeStaff" sessionKey="lotus-tokenizeStaff" />
				<BoolStoreInput v-show="false" v-model="rollVisible" sessionKey="lotus-rollVisible" />
				<BoolStoreInput v-show="false" v-model="showNotationsMatcher" sessionKey="lotus-showNotationsMatcher" />
				<BoolStoreInput v-show="false" v-model="enabledMidiAudio" sessionKey="lotus-enabledMidiAudio" />
				<CheckButton content="&#x1f3b9;" v-model="tokenizeStaff" title="live staff" />
				<fieldset v-show="tokenizeStaff">
					<CheckButton content="&#x1f3a8;" v-model="chromaticSymbols" :disabled="!sheetDocument" title="chromatic symbols" />
					<CheckButton content="&#x2633;" v-model="rollVisible" :disabled="!midiPlayer" title="show MIDI roll" />
					<CheckButton content="c|s" v-model="showNotationsMatcher" :disabled="!matcherNotations" title="show notations matcher" />
					<CheckButton content="&#x1f50a;" v-model="enabledMidiAudio" title="MIDI Audio" />
					<button @click="togglePlayer" :disabled="!midiPlayer">{{midiPlayer && midiPlayer.isPlaying ? "&#x23f8;" : "&#x25b6;"}}</button>
				</fieldset>
			</fieldset>
		</header>
		<main>
			<div class="source-container" :class="{loading: converting}">
				<SourceEditor :source.sync="lilySource" :disabled="converting" />
				<Loading v-show="converting" />
			</div>
			<div class="build-container" ref="buildContainer" v-resize="onResize" :class="{
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
				<div class="sheet-container">
					<SheetSimple v-if="svgDocuments && !tokenizeStaff" :documents="svgDocuments" />
					<SheetSigns v-if="svgHashTable" v-show="false" :hashTable="svgHashTable" />
					<SheetLive v-if="tokenizeStaff && sheetDocument" ref="sheet"
						:doc="sheetDocument"
						:sheetNotation="sheetNotation"
						:midi="midi"
						:midiPlayer.sync="midiPlayer"
						:matcherNotations.sync="matcherNotations"
						@midi="onMidi"
					/>
				</div>
				<Loading v-show="engraving" />
			</div>
		</main>
	</div>
</template>

<script>
	import resize from "vue-resize-directive";
	import {MIDI, MidiAudio} from "@k-l-lambda/web-widgets";
	import {sliceMidi} from "@k-l-lambda/web-widgets/source/inc/MidiUtils.js";

	import {downloadUrl} from "../utils.js";
	import {mutexDelay} from "../delay.js";
	import {recoverJSON} from "../../inc/jsonRecovery.ts";
	import StaffToken from "../../inc/staffSvg/staffToken.ts";
	import SheetDocument from "../../inc/staffSvg/sheetDocument.ts";
	import * as LilyParser from "../../inc/lilyParser.ts";
	import LogRecorder from "../../inc/logRecorder.ts";
	import * as StaffNotation from "../../inc/staffSvg/staffNotation.ts";

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



	export default {
		name: "playground",


		directives: {
			resize,
		},


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
		},


		data () {
			return {
				buildContainerSize: {
					width: 100,
					height: 100,
				},
				dragHover: null,
				lilySource: null,
				converting: false,
				engraving: false,
				svgDocuments: null,
				engraverLogs: null,
				engraverDirty: false,
				autoEngrave: true,
				tokenizeStaff: true,
				sheetDocument: null,
				sheetNotation: null,
				svgHashTable: null,
				midi: null,
				chromaticSymbols: false,
				midiPlayer: null,
				rollVisible: false,
				matcherNotations: null,
				showNotationsMatcher: false,
				enabledMidiAudio: true,
			};
		},


		created () {
			window.$main = this;

			if (MidiAudio.WebAudio.empty())
				MidiAudio.loadPlugin({soundfontUrl: "/soundfont/", api: "webaudio"}).then(() => console.log("Soundfont loaded."));
		},


		async mounted () {
			document.addEventListener("keydown", event => {
				switch (event.code) {
				case "F8":
					this.engrave();

					break;
				}

				//if (["INPUT", "TEXTAREA"].includes(document.activeElement.nodeName))
				//	return;
			});

			await this.$nextTick();
			this.watchEngrave();
		},


		methods: {
			onResize () {
				this.buildContainerSize.width = this.$refs.buildContainer.clientWidth;
				this.buildContainerSize.height = this.$refs.buildContainer.clientHeight;
			},


			onDragOver (event) {
				const item = event.dataTransfer.items[0];
				if (item)
					this.dragHover = item.type;
			},


			async onDropFile (event) {
				this.dragHover = null;
				//console.log("onDropFile:", event.dataTransfer.files[0]);

				const file = event.dataTransfer.files[0];
				if (file) {
					switch (file.type) {
					case "text/x-lilypond":
						this.lilySource = await file.readAs("Text");
						//console.log("content:", content);

						this.clearSheet();

						this.engrave();

						break;
					case "text/xml":
						const xml = await file.readAs("Text");
						//console.log("xml:", xml);
						this.lilySource = await this.musicxml2ly(xml);

						this.clearSheet();

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


			clearSheet () {
				this.sheetDocument = null;
				this.sheetNotation = null;
				this.svgHashTable = null;
				this.midi = null;
				this.midiPlayer = null;
				this.matcherNotations = null;
			},


			async musicxml2ly (xml) {
				this.converting = true;

				const body = new FormData();
				body.append("xml", xml);
				body.append("options", JSON.stringify({
					removeBreak: true,
					removePageBreak: true,
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

					return result;
				}

				this.converting = false;
			},


			async engrave () {
				this.engraving = true;

				const body = new FormData();
				body.append("source", this.lilySource);
				body.append("log", true);	// TODO: add control for log

				if (this.tokenizeStaff)
					body.append("tokenize", this.tokenizeStaff);

				const response = await fetch("/engrave", {
					method: "POST",
					body,
				});
				if (!response.ok) {
					console.warn("Engraving failed:", await response.text());

					this.clearSheet();
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

				const filename = prompt("Input your file name:", "lotus-editor.ly");
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


			parseSource () {
				const result = LilyParser.parse(this.lilySource);
				console.log("source parsing:", result);
			},


			async sliceSource (startTick, endTick) {
				if (!this.midi)
					return null;

				const partMidi = sliceMidi(this.midi, startTick, endTick);
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
				if (this.sheetDocument) {
					const logger = new LogRecorder({enabled: true});
					this.sheetNotation = StaffNotation.parseNotationFromSheetDocument(this.sheetDocument, {logger});

					console.log("sheet notation parsed:", logger.toJSON());
				}
			},


			exportScore () {
				const data = {
					doc: this.sheetDocument,
					midi: this.midi,
					hashTable: this.svgHashTable,
				};
				const blob = new Blob([JSON.stringify(data)]);
				downloadUrl(URL.createObjectURL(blob), "score.json");
			},
		},


		watch: {
			lilySource () {
				this.engraverDirty = true;
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
		},
	};
</script>

<style lang="scss">
	@import "../css/common.scss";
	@import "../css/chromaticSymbols.scss";

	
	.drag-hover
	{
		.source-container
		{
			outline: 4px #4f4 dashed;
		}

		&[data-hover-type="text/x-lilypond"]
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

		& > header
		{
			padding: 1em;
			text-align: center;
			background-color: #fffa;

			button
			{
				font-size: 24px;
			}

			.dirty-badge
			{
				width: 1em;

				&.dirty::before
				{
					content: "*";
				}
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

			.source-container > *
			{
				height: 100%;
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
	}
</style>
