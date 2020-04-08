<template>
	<div>
		<header class="controls">
			<input type="file" @change="onScoreChange" />
			<button @click="homePlayer">&#x23ee;</button>
			<button @click="togglePlayer" :disabled="!midiPlayer">{{midiPlayer && midiPlayer.isPlaying ? "&#x23f8;" : "&#x25b6;"}}</button>
		</header>
		<main>
			<SheetSigns v-if="svgHashTable" v-show="false" :hashTable="svgHashTable" />
			<SheetLive v-if="sheetDocument" ref="sheet"
				:doc="sheetDocument"
				:sheetNotation="sheetNotation"
				:midi="midi"
				:midiPlayer.sync="midiPlayer"
				@midi="onMidi"
			/>
		</main>
	</div>
</template>

<script>
	import "../utils.js";
	import * as StaffNotation from "../../inc/staffSvg/staffNotation.ts";
	import {recoverJSON} from "../../inc/jsonRecovery.ts";
	import StaffToken from "../../inc/staffSvg/staffToken.ts";
	import SheetDocument from "../../inc/staffSvg/sheetDocument.ts";

	import SheetLive from "../components/sheet-live.vue";
	import SheetSigns from "../components/sheet-signs.vue";



	export default {
		name: "profiler",


		components: {
			SheetLive,
			SheetSigns,
		},


		data () {
			return {
				sheetDocument: null,
				sheetNotation: null,
				svgHashTable: null,
				midi: null,
				midiPlayer: null,
			};
		},


		methods: {
			async onScoreChange (event) {
				//console.log("onScoreChange:", event);
				const file = event.target.files[0];
				if (!file)
					return;

				switch (file.type) {
				case "application/json":
					const text = await file.readAs("Text");
					const data = recoverJSON(text, {StaffToken, SheetDocument});
					//console.log("data:", data);

					this.sheetDocument = data.doc;
					this.svgHashTable = data.hashTable;
					this.midi = data.midi;

					if (this.sheetDocument)
						this.sheetNotation = StaffNotation.parseNotationFromSheetDocument(this.sheetDocument);

					break;
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
		},
	};
</script>

<style lang="scss">
	@import "../css/common.scss";
</style>
