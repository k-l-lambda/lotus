<template>
	<div class="sheet live" v-resize="onResize">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			:width="600"
			:viewBox="svgViewBox"
		>
			<defs>
				<g class="sign" v-for="sign of signs" :key="sign.id" :id="`sign-${sign.id}`"
					:transform="sign.def.scale && `scale(${sign.def.scale.x}, ${sign.def.scale.y})`"
				>
					<path v-if="sign.def.type === 'path'" :d="sign.def.d" />
					<rect v-if="sign.def.type === 'rect'"
						x="0" y="0"
						:width="sign.def.width"
						:height="sign.def.height"
					/>
					<line v-if="sign.def.type === 'line'"
						x1="0" y1="0"
						:x2="sign.def.width"
						:y2="sign.def.height"
						:stroke-width="sign.def['stroke-width']"
						:stroke-dasharray="sign.def['stroke-dasharray']"
					/>
					<polygon v-if="sign.def.type === 'polygon'"
						:points="sign.def.points"
						:stroke-width="sign.def['stroke-width']"
					/>
					<text v-if="sign.def.type === 'text'" :font-size="sign.def['font-size']">
						<tspan>{{sign.def.text}}</tspan>
					</text>
				</g>
			</defs>
			<g class="document">
				<g class="page" v-for="(page, i) of doc.pages" :key="i">
					<rect class="pad" x="0" y="0" :width="page.width" :height="page.height" />
					<g class="row" v-for="(row, ii) of page.rows" :key="ii"
						:transform="`translate(${row.x}, ${row.y})`"
					>
						<rect v-if="cursorPosition && cursorPosition.row === ii" class="cursor"
							:x="cursorPosition.x" :y="-2" width="1" :height="16"
						/>
						<g>
							<SheetToken v-for="(token, i5) of row.tokens" :key="i5" :token="token" />
						</g>
						<g class="staff" v-for="(staff, iii) of row.staves" :key="iii"
							:transform="`translate(${staff.x}, ${staff.y})`"
						>
							<g>
								<SheetToken v-for="(token, i5) of staff.tokens" :key="i5" :token="token" />
							</g>
							<g class="measure" v-for="(measure, i4) of staff.measures" :key="i4">
								<SheetToken v-for="(token, i5) of measure.tokens" :key="i5" :token="token" />
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>

<script>
	import Vue from "vue";
	import resize from "vue-resize-directive";
	import {MusicNotation, MidiPlayer} from "@k-l-lambda/web-widgets";

	import * as StaffNotation from "../../inc/staffSvg/staffNotation.ts";
	import SheetScheduler from "../../inc/staffSvg/scheduler.ts";

	import SheetToken from "./sheet-token.vue";



	export default {
		name: "sheet-live",


		directives: {
			resize,
		},


		components: {
			SheetToken,
		},


		props: {
			doc: Object,
			hashTable: Object,
			midi: Object,
		},


		data () {
			return {
				size: {
					width: 100,
					height: 100,
				},
				midiPlayer: null,
				scheduler: null,
			};
		},


		computed: {
			svgViewBox () {
				// TODO:
				return "0 0 60 80";
			},


			signs () {
				if (!this.hashTable)
					return [];

				return Object.entries(this.hashTable).map(([id, def]) => ({id, def}));
			},


			linkedTokens () {
				if (!this.doc)
					return null;

				const tokens = new Map();
				this.doc.pages.forEach(
					page => page.rows.forEach(
						row => row.staves.forEach(
							staff => staff.measures.forEach(
								measure => measure.tokens.forEach(
									token => !token.href || tokens.set(token.href, token))))));

				return tokens;
			},


			progressTicks () {
				return this.midiPlayer && this.midiPlayer.progressTicks;
			},


			cursorPosition () {
				if (!this.midiPlayer || !this.scheduler)
					return null;

				return this.scheduler.lookupPosition(this.progressTicks);
			},
		},


		created () {
			this.updateSheetNotation();
			this.updateMidiNotation();
		},


		mounted () {
			this.onResize();
		},


		methods: {
			onResize () {
				this.size.width = this.$el.clientWidth;
				this.size.height = this.$el.clientHeight;
			},


			onMidi (data, timestamp) {
				this.$emit("midi", data, timestamp);

				const delay = Math.max(timestamp - performance.now(), 0);
				setTimeout(() => {
					//console.log("midi event:", data);
					if (data.ids) {
						const tokens = data.ids.map(id => this.linkedTokens.get(id));

						switch (data.subtype) {
						case "noteOn":
							tokens.forEach(token => Vue.set(token, "on", true));

							break;
						case "noteOff":
							tokens.forEach(token => Vue.set(token, "on", false));

							break;
						}
					}
				}, delay);
			},


			updateSheetNotation () {
				this.sheetNotation = null;
				if (this.doc)
					this.sheetNotation = StaffNotation.parseNotationFromSheetDocument(this.doc);
			},


			async updateMidiNotation () {
				this.midiNotation = null;
				this.scheduler = null;

				if (this.midi) {
					this.midiNotation = MusicNotation.Notation.parseMidi(this.midi);
					this.updateMidiPlayer();

					await this.$nextTick();
					if (this.midiNotation && this.sheetNotation) 
						this.matchNotations();
				}
			},


			updateMidiPlayer () {
				if (this.midiPlayer)
					this.midiPlayer.dispose();

				this.midiPlayer = new MidiPlayer(this.midiNotation, {
					cacheSpan: 200,
					onMidi: (data, timestamp) => this.onMidi(data, timestamp),
				});
			},


			async matchNotations () {
				await StaffNotation.matchNotations(this.midiNotation, this.sheetNotation);
				//console.log("matching:", this.midiNotation.notes.map(n => n.ids && n.ids[0]));

				this.scheduler = SheetScheduler.createFromNotation(this.midiNotation, this.linkedTokens);
			},
		},


		watch: {
			doc: "updateSheetNotation",
			midi: "updateMidiNotation",


			midiPlayer (value) {
				this.$emit("update:midiPlayer", value);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.sheet
	{
		white-space: nowrap;
		display: inline-block;

		.sign 
		{
			line, polygon
			{
				stroke: inherit;
			}

			polygon, rect
			{
				fill: inherit;
			}
		}

		.page
		{
			.pad
			{
				fill: #f6fffa;
			}
		}

		.cursor
		{
			fill: lightblue;
		}
	}
</style>
