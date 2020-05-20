<template>
	<div>
		<header class="controls">
			<StoreInput v-show="false" v-model="sourceText" sessionKey="lotus-profilerSourceText" />
			<input type="file" @change="onScoreChange" />
			<button @click="homePlayer">&#x23ee;</button>
			<button @click="togglePlayer" :disabled="!midiPlayer">{{midiPlayer && midiPlayer.isPlaying ? "&#x23f8;" : "&#x25b6;"}}</button>
			<CheckButton content="&#xa56f;" v-model="showCursor" />
			<CheckButton content="&#x2669;" v-model="noteHighlight" />
			<CheckButton content="&#x1f35e;" v-model="bakingSheet" />
			<span v-if="fps" class="fps"><em>{{fps.toFixed(1)}}</em>fps</span>
		</header>
		<main>
			<SheetLive v-if="sheetDocument" ref="sheet"
				:doc="sheetDocument"
				:midi="midi"
				:midiNotation="midiNotation"
				:pitchContextGroup="pitchContextGroup"
				:midiPlayer.sync="midiPlayer"
				:showCursor="showCursor"
				:noteHighlight="noteHighlight"
				:bakingMode="bakingSheet"
				:backgroundImages="bakingSheet ? bakingImages : null"
				@midi="onMidi"
			/>
		</main>
		<canvas v-show="false" ref="canvas" />
	</div>
</template>

<script>
	import {MusicNotation} from "@k-l-lambda/web-widgets";

	import "../utils.js";
	import {animationDelay} from "../delay.js";
	import * as StaffNotation from "../../inc/staffSvg/staffNotation.ts";
	import {recoverJSON} from "../../inc/jsonRecovery.ts";
	import {StaffToken, SheetDocument, PitchContext} from "../../inc/staffSvg";
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
				svgHashTable: null,
				midi: null,
				midiNotation: null,
				pitchContextGroup: null,
				midiPlayer: null,
				showCursor: true,
				noteHighlight: true,
				bakingSheet: true,
				bakingImages: null,
				fps: null,
			};
		},


		async created () {
			console.log("t0:", performance.now());
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
				this.bakingImages = null;
				this.matchedIds = null;

				if (this.sourceText) {
					const data = recoverJSON(this.sourceText, {StaffToken, SheetDocument, PitchContext});
					//console.log("data:", data);

					this.sheetDocument = data.doc;
					this.svgHashTable = data.hashTable;
					this.midi = data.midi;
					this.pitchContextGroup = data.pitchContextGroup;

					if (!this.midi)
						console.warn("No midi data, baking will fail.");

					console.log("t0.1:", performance.now());

					if (this.midi) {
						const midiNotation = MusicNotation.Notation.parseMidi(this.midi);

						if (data.noteLinkings) {
							data.noteLinkings.forEach((fields, i) => Object.assign(midiNotation.notes[i], fields));

							this.matchedIds = data.noteLinkings.reduce((ids, note) => (note.ids && note.ids.forEach(id => ids.add(id)), ids), new Set());

							StaffNotation.assignNotationEventsIds(midiNotation);
						}

						this.midiNotation = midiNotation;
					}

					console.log("t0.2:", performance.now());

					this.$nextTick().then(() => {
						this.bakeSheet();

						console.log("t7.1:", performance.now());
					});
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
				console.assert(this.svgHashTable, "svgHashTable is null.");
				console.assert(this.matchedIds, "matchedIds is null.");

				console.log("t7:", performance.now());

				this.bakingImages = [];
				const baker = SheetBaker.bakeLiveSheetGen({
					sheetDocument: this.sheetDocument,
					//signs: this.$refs.signs,
					hashTable: this.svgHashTable,
					matchedIds: this.matchedIds,
					canvas: this.$refs.canvas,
				});
				for await (const url of baker)
					this.bakingImages.push(url);

				console.log("t8:", performance.now());
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
	@import "../styles/common.scss";


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
