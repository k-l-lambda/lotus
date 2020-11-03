<template>
	<div>
		<meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.5">
		<header class="controls">
			<StoreInput v-if="!disableStore" v-show="false" v-model="sourceText" sessionKey="lotus-profilerSourceText" />
			<input type="file" @change="onScoreChange" />
			<button @click="homePlayer">&#x23ee;</button>
			<button @click="togglePlayer" :disabled="!midiPlayer">{{midiPlayer && midiPlayer.isPlaying ? "&#x23f8;" : "&#x25b6;"}}</button>
			<CheckButton content="&#xa56f;" v-model="showCursor" />
			<CheckButton content="&#x2669;" v-model="noteHighlight" />
			<CheckButton content="&#x1f35e;" v-model="bakingSheet" />
			<span v-if="fps" class="fps"><em>{{fps.toFixed(1)}}</em>fps</span>
		</header>
		<main @scroll="onScroll">
			<SheetSigns v-if="!bakingSheet && svgHashTable" v-show="false" ref="signs" :hashTable="svgHashTable" />
			<SheetLive v-if="sheetDocument" ref="sheet"
				:doc="sheetDocument"
				:midiNotation="midiNotation"
				:pitchContextGroup="pitchContextGroup"
				:midiPlayer.sync="midiPlayer"
				:showCursor="showCursor"
				:noteHighlight="noteHighlight"
				:bakingMode="bakingSheet"
				:backgroundImages="bakingSheet ? bakingImages : null"
				:showPagesProgressively="showPagesProgressively"
				@midi="onMidi"
			/>
		</main>
		<canvas v-show="false" ref="canvas" />
	</div>
</template>

<script>
	import url from "url";
	import debounce from "lodash/debounce";

	import "../utils.js";
	import {animationDelay} from "../delay.js";
	import ScoreBundle from "../scoreBundle.ts";
	import StreamParser from "../../inc/streamParser";
	import * as staffSvg from "../../inc/staffSvg";
	import * as LilyNotation from "../../inc/lilyNotation";
	import {recoverJSON} from "../../inc/jsonRecovery";

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
				sourceBakingImages: null,
				fps: null,
				disableStore: false,
				showPagesProgressively: true,
			};
		},


		async created () {
			this.logTime("created");

			window.$main = this;

			this.watchFps();

			const hash = url.parse(location.hash.substr(1), true);
			if (hash.query.score) {
				this.disableStore = true;
				this.loadScoreFromURL(hash.query.score);
			}
			if (hash.query.nobake)
				this.bakingSheet = false;
		},


		methods: {
			logTime (message) {
				console.log("[PROFILER]", message, performance.now());
			},


			onScoreChange (event) {
				//console.log("onScoreChange:", event);
				const file = event.target.files[0];
				if (!file)
					return;

				return this.loadScoreFile(file);
			},


			onScroll: debounce(function () {
				//console.log("onScroll", this);
				this.$refs.sheet.updatePageVisibility();
			}, 60, {leading: true}),


			async loadScoreFile (file) {
				this.logTime("file loading begin");

				switch (file.type) {
				case "application/json":
					this.sourceText = await file.readAs("Text");

					break;
				case "application/zip":
				case "application/x-zip-compressed": {
						this.sourceText = null;
						await this.$nextTick();

						const {default: JSZip} = await import("jszip");
						const pack = await JSZip.loadAsync(file);

						this.sourceBakingImages = null;
						for (let i = 0; true; ++i) {
							const file = pack.file(`baking${i}.png`);
							if (!file)
								break;

							const blob = await file.async("blob");
							const url = URL.createObjectURL(blob);

							this.sourceBakingImages = this.sourceBakingImages || [];
							this.sourceBakingImages.push(url);
						}

						if(this.sourceBakingImages)
							this.logTime(`baking images loaded [${this.sourceBakingImages.length}]`);

						this.sourceText = await pack.file("score.json").async("text");
						this.logTime("sourceText loaded.");
					}

					break;
				case "text/x-lilypond":
				case "text/lilypond-source": {
						const source = await file.readAs("Text");

						const body = new FormData();
						body.append("source", source);
						//body.append("withMIDI", 1);
						//body.append("withNotation", 1);
						//body.append("withLilyDoc", 1);
						body.append("withLilyNotation", 1);
						//body.append("log", 1);

						const response = await fetch("/advanced-engrave", {
							method: "POST",
							body,
						});
						if (!response.ok) {
							this.error = await response.text();
							console.warn("advanced-engrave failed:", this.error);

							return;
						}

						const parser = new StreamParser(response.body.getReader());
						this.constructSheetFromStream(parser);
					}

					break;
				default:
					console.log("unsupported type:", file.type);
				}
			},


			async loadScoreFromURL (url) {
				this.logTime("URL fetching begin");

				const response = await fetch(url);
				if (!response.ok) {
					console.warn("URL load failed:", await response.text());
					return;
				}
				this.logTime("network responsed");

				const blob = await response.blob();

				return this.loadScoreFile(blob);
			},


			async loadSheet () {
				this.sheetDocument = null;
				this.midiNotation = null;
				this.pitchContextGroup = null;
				this.bakingImages = null;

				if (this.sourceText) {
					this.showPagesProgressively = true;

					const scoreBundle = new ScoreBundle(this.sourceText, {onStatus: message => this.logTime(message)});
					this.sheetDocument = scoreBundle.scoreJSON.doc;
					this.pitchContextGroup = scoreBundle.pitchContextGroup;
					this.midiNotation = scoreBundle.midiNotation;
					this.svgHashTable = scoreBundle.scoreJSON.hashTable;

					this.logTime("bundle parsed");

					// wait the initial frame before baking
					await this.$nextTick();

					this.logTime("rendering initialized");

					if (this.sourceBakingImages) {
						this.bakingImages = this.sourceBakingImages;
						this.sourceBakingImages = null;
					}
					else if (this.bakingSheet) {
						this.bakingImages = [];
						const baker = scoreBundle.bakeSheet(this.$refs.canvas);
						this.logTime("baker loaded");
						for await (const url of baker)
							this.bakingImages.push(url);

						this.logTime("baking finished");
					}

					await this.$nextTick();
					this.logTime("rendering finished");

					this.$refs.sheet.updatePageVisibility();
				}
			},


			async constructSheetFromStream (parser) {
				this.sheetDocument = null;
				this.midiNotation = null;
				this.pitchContextGroup = null;
				this.bakingImages = null;
				this.svgHashTable = {};

				this.showPagesProgressively = false;
				this.bakingSheet = false;

				const pages = [];
				let lilyNotation;
				let midiNotation;
				let pitchContextGroup;

				parser.on("data", json => {
					const data = recoverJSON(json, {...staffSvg, LilyNotation: LilyNotation.Notation, ...LilyNotation.MLayoutClasses});
					console.log("data:", data);

					if (data.page !== undefined) {
						pages[data.page] = data.structure;
						//Object.assign(this.svgHashTable, data.hashTable);
						this.svgHashTable = {...this.svgHashTable, ...data.hashTable};

						this.sheetDocument = new staffSvg.SheetDocument({pages});
					}

					/*if (data.lilyDocument) {
						lilyDocument = new lilyParser.LilyDocument(data.lilyDocument);
						lilyNotation = lilyDocument.interpret().getNotation();
					}*/

					/*if (data.midi) {
						LilyNotation.matchWithExactMIDI(lilyNotation, data.midi).then(() => {
							const measureIndices = lilyNotation.getMeasureIndices(LilyNotation.LayoutType.Full);
							this.midiNotation = lilyNotation.toPerformingNotationWithEvents(measureIndices);
							this.pitchContextGroup = lilyNotation.getContextGroup(measureIndices);
						});
					}*/

					if (data.lilyNotation) {
						lilyNotation = data.lilyNotation;

						const measureIndices = lilyNotation.getMeasureIndices(LilyNotation.LayoutType.Full);
						midiNotation = lilyNotation.toPerformingNotationWithEvents(measureIndices);
						pitchContextGroup = lilyNotation.getContextGroup(measureIndices);
					}
				});

				await parser.read();

				if (lilyNotation && this.sheetDocument) {
					this.sheetDocument.alignTokensWithNotation(lilyNotation);
					this.sheetDocument.updateMatchedTokens(lilyNotation.idSet);

					this.midiNotation = midiNotation;
					this.pitchContextGroup = pitchContextGroup;
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
				background-size: 100%;
			}

			.cursor
			{
				fill: lightblue;
			}
		}
	}
</style>
