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
			<SheetSigns v-if="!bakingSheet && svgHashTable" v-show="false" :hashTable="svgHashTable" />
			<SheetLive v-if="sheetDocument" ref="sheet"
				:doc="sheetDocument"
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
	import "../utils.js";
	import {animationDelay} from "../delay.js";
	import ScoreBundle from "../scoreBundle.ts";

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
			this.logTime("created");

			window.$main = this;

			this.watchFps();
		},


		methods: {
			logTime (message) {
				console.log("[PROFILER]", message, performance.now());
			},


			async onScoreChange (event) {
				//console.log("onScoreChange:", event);
				const file = event.target.files[0];
				if (!file)
					return;

				switch (file.type) {
				case "application/json":
					this.sourceText = await file.readAs("Text");

					break;
				case "application/zip": {
						const {default: JSZip} = await import("jszip");
						const pack = await JSZip.loadAsync(file);
						this.sourceText = await pack.file("score.json").async("text");
					}

					break;
				default:
					console.log("unsupported type:", file.type);
				}
			},


			async loadSheet () {
				this.sheetDocument = null;
				this.midiNotation = null;
				this.pitchContextGroup = null;
				this.bakingImages = null;

				if (this.sourceText) {
					const scoreBundle = new ScoreBundle(this.sourceText, {onStatus: message => this.logTime(message)});
					this.sheetDocument = scoreBundle.scoreJSON.doc;
					this.pitchContextGroup = scoreBundle.scoreJSON.pitchContextGroup;
					this.midiNotation = scoreBundle.midiNotation;
					this.svgHashTable = scoreBundle.scoreJSON.hashTable;

					this.logTime("bundle parsed");

					// wait the initial frame before baking
					await this.$nextTick();

					this.logTime("rendering initialized");

					this.bakingImages = [];
					const baker = scoreBundle.bakeSheet(this.$refs.canvas);
					this.logTime("baker loaded");
					for await (const url of baker)
						this.bakingImages.push(url);

					this.logTime("baking finished");
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
