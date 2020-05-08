<template>
	<div>
		<header class="controls">
			<StoreInput v-show="false" v-model="sourceText" sessionKey="lotus-profilerSourceText" />
			<input type="file" @change="onScoreChange" />
			<button @click="homePlayer">&#x23ee;</button>
			<button @click="togglePlayer" :disabled="!midiPlayer">{{midiPlayer && midiPlayer.isPlaying ? "&#x23f8;" : "&#x25b6;"}}</button>
			<CheckButton content="cursor" v-model="showCursor" />
			<CheckButton content="note highlight" v-model="noteHighlight" />
			<span v-if="fps" class="fps"><em>{{fps.toFixed(1)}}</em>fps</span>
		</header>
		<main>
			<SheetSigns v-if="svgHashTable" ref="signs" v-show="false" :hashTable="svgHashTable" />
			<SheetLive v-if="sheetDocument" ref="sheet"
				:doc="sheetDocument"
				:sheetNotation="sheetNotation"
				:midi="midi"
				:midiPlayer.sync="midiPlayer"
				:showCursor="showCursor"
				:noteHighlight="noteHighlight"
				:showActiveOnly="true"
				:backgroundImages="bakingImages"
				@midi="onMidi"
				@update:matcherNotations="bakeSheet"
			/>
		</main>
		<canvas v-show="false" ref="canvas" />
	</div>
</template>

<script>
	import "../utils.js";
	import {animationDelay} from "../delay.js";
	import * as StaffNotation from "../../inc/staffSvg/staffNotation.ts";
	import {recoverJSON} from "../../inc/jsonRecovery.ts";
	import StaffToken from "../../inc/staffSvg/staffToken.ts";
	import SheetDocument from "../../inc/staffSvg/sheetDocument.ts";
	import * as SheetBaker from "../sheetBaker.ts";

	import SheetLive from "../components/sheet-live.vue";
	import SheetSigns from "../components/sheet-signs.vue";
	import StoreInput from "../components/store-input.vue";
	import CheckButton from "../components/check-button.vue";



	export default {
		name: "profiler",


		components: {
			SheetLive,
			SheetSigns,
			StoreInput,
			CheckButton,
		},


		data () {
			return {
				sourceText: null,
				sheetDocument: null,
				sheetNotation: null,
				svgHashTable: null,
				midi: null,
				midiPlayer: null,
				showCursor: true,
				noteHighlight: true,
				bakingImages: null,
				fps: null,
			};
		},


		async created () {
			window.$main = this;

			this.watchFps();
		},


		methods: {
			async onScoreChange (event) {
				//console.log("onScoreChange:", event);
				const file = event.target.files[0];
				if (!file)
					return;

				switch (file.type) {
				case "application/json":
					this.sourceText = await file.readAs("Text");

					break;
				}
			},


			loadSheet () {
				this.sheetDocument = null;
				this.svgHashTable = null;
				this.midi = null;

				if (this.sourceText) {
					const data = recoverJSON(this.sourceText, {StaffToken, SheetDocument});
					//console.log("data:", data);

					this.sheetDocument = data.doc;
					this.svgHashTable = data.hashTable;
					this.midi = data.midi;

					if (this.sheetDocument)
						this.sheetNotation = StaffNotation.parseNotationFromSheetDocument(this.sheetDocument);
				}
			},


			onMidi (/*data, timestamp*/) {
				//console.log("onMidi:", data, timestamp);
			},


			homePlayer () {
				if (this.midiPlayer)
					this.midiPlayer.turnCursor(0);
			},


			togglePlayer () {
				if (this.midiPlayer) {
					if (this.midiPlayer.isPlaying)
						this.midiPlayer.pause();
					else
						this.midiPlayer.play();
				}
			},


			async bakeSheet () {
				console.assert(this.sheetDocument, "sheetDocument is null.");
				console.assert(this.$refs.signs, "signs is null.");
				console.assert(this.$refs.sheet, "sheet is null.");

				this.bakingImages = await SheetBaker.bakeLiveSheet(this.sheetDocument, this.$refs.signs, this.$refs.sheet && this.$refs.sheet.matchedIds, this.$refs.canvas);
			},


			async watchFps () {
				let lastTime = performance.now();
				let frames = 0;

				while (true) {
					await animationDelay();

					++frames;
					const now = performance.now();
					if (now - lastTime > 1e+3) {
						this.fps = frames * 1e+3 / (now - lastTime);

						frames = 0;
						lastTime = now;
					}
				}
			},
		},


		watch: {
			sourceText: "loadSheet",
		},
	};
</script>

<style lang="scss">
	@import "../css/common.scss";


	header
	{
		.fps
		{
			display: inline-block;
			margin: 0 1em;
			color: #aaa;

			em
			{
				color: black;
				display: inline-block;
				margin: 0 .2em;
			}
		}
	}

	main
	{
		width: 100%;
		overflow: auto;

		.sheet.live
		{
			white-space: nowrap;
			display: inline-block;

			.page
			{
				display: inline-block;
				margin: 1em;
			}

			.cursor
			{
				fill: lightblue;
			}
		}
	}
</style>
