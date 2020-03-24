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
				<button @click="engrave" :class="{working: engraving}" title="engrave">&#x1f3bc;</button>
			</fieldset>
			<fieldset>
				<BoolStoreInput v-show="false" v-model="tokenizeStaff" sessionKey="lotus-tokenizeStaff" />
				<CheckButton content="&#x1f3b9;" v-model="tokenizeStaff" title="live staff" />
				<CheckButton content="&#x1f3a8;" v-model="chromaticSymbols" title="chromatic symbols" />
				<button @click="togglePlayer" :disabled="!midiPlayer">{{midiPlayer && midiPlayer.isPlaying ? "pause" : "play"}}</button>
			</fieldset>
		</header>
		<main>
			<div class="source-container" :class="{loading: converting}">
				<SourceEditor :source.sync="lilySource" :disabled="converting" />
				<Loading v-show="converting" />
			</div>
			<div class="sheet-container" :class="{loading: engraving, dirty: engraverDirty, chromatic: chromaticSymbols}">
				<SheetSimple v-if="svgDocuments && !tokenizeStaff" :documents="svgDocuments" />
				<SheetLive v-if="tokenizeStaff && sheetContent"
					:content="sheetContent"
					:hashTable="svgHashTable"
					:midi="midi"
					:midiPlayer.sync="midiPlayer"
					@midi="onMidi"
				/>
				<Loading v-show="engraving" />
			</div>
		</main>
	</div>
</template>

<script>
	import "../utils.js";
	import {mutexDelay} from "../delay.js";
	import {recoverJSON} from "../../inc/jsonRecovery.ts";
	import StaffToken from "../../inc/staffSvg/staffToken.ts";
	import {MidiAudio} from "@k-l-lambda/web-widgets";

	import SourceEditor from "../components/source-editor.vue";
	import SheetSimple from "../components/sheet-simple.vue";
	import SheetLive from "../components/sheet-live.vue";
	import Loading from "../components/loading-dots.vue";
	import StoreInput from "../components/store-input.vue";
	import BoolStoreInput from "../components/bool-store-input.vue";
	import CheckButton from "../components/check-button.vue";



	export default {
		name: "playground",


		components: {
			SourceEditor,
			SheetSimple,
			SheetLive,
			Loading,
			StoreInput,
			BoolStoreInput,
			CheckButton,
		},


		data () {
			return {
				dragHover: null,
				lilySource: null,
				converting: false,
				engraving: false,
				svgDocuments: null,
				engraverLogs: null,
				engraverDirty: false,
				autoEngrave: true,
				tokenizeStaff: true,
				sheetContent: null,
				svgHashTable: null,
				midi: null,
				chromaticSymbols: false,
				midiPlayer: null,
			};
		},


		created () {
			window.$main = this;

			if (MidiAudio.WebAudio.empty())
				MidiAudio.loadPlugin({soundfontUrl: "/soundfont/", api: "webaudio"}).then(() => console.log("Soundfont loaded."));
		},


		async mounted () {
			await this.$nextTick();

			this.watchEngrave();
		},


		methods: {
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

						break;
					case "text/xml":
						const xml = await file.readAs("Text");
						//console.log("xml:", xml);
						this.lilySource = await this.musicxml2ly(xml);

						break;
					}
				}
			},


			onMidi (data, timestamp) {
				//console.log("onMidi:", data, timestamp);
				switch (data.subtype) {
				case "noteOn":
					MidiAudio.noteOn(data.channel, data.noteNumber, data.velocity, timestamp);

					break;
				case "noteOff":
					MidiAudio.noteOff(data.channel, data.noteNumber, timestamp);

					break;
				}
			},


			async musicxml2ly (xml) {
				this.converting = true;

				const body = new FormData();
				body.append("xml", xml);

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

				if (this.tokenizeStaff)
					body.append("tokenize", this.tokenizeStaff);

				const response = await fetch("/engrave", {
					method: "POST",
					body,
				});
				if (!response.ok) {
					console.warn("Engraving failed:", await response.text());
					this.svgDocuments = null;
					this.sheetContent = null;
					this.midi = null;
				}
				else {
					const result = await response.json();
					console.log("Engraving accomplished.");

					this.engraverLogs = result.logs;
					this.svgDocuments = result.svgs;

					if (this.tokenizeStaff) {
						//console.log("structure:", result.structure, result.hashTable);
						this.sheetContent = recoverJSON(result.structure, {StaffToken});
						this.svgHashTable = result.hashTable;
						this.midi = result.midi;
					}
					else {
						this.sheetContent = null;
						this.svgHashTable = null;
						this.midi = null;
					}

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
				if (value && this.lilySource && !this.sheetContent)
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

			.sheet-container
			{
				flex-grow: 1;
				overflow: auto;

				&.loading > .sheet
				{
					filter: blur(8px);
				}

				&.dirty
				{
					outline: #fc0a 1px solid;
					background-color: #fc01;
				}
			}
		}
	}
</style>
