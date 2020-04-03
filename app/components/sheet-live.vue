<template>
	<div class="sheet live">
		<svg class="sign-prefabs"
			v-show="false"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<g class="sign" v-for="sign of signs" :key="sign.id" :id="`sign-${sign.id}`"
					:transform="sign.def.scale && `scale(${sign.def.scale.x}, ${sign.def.scale.y})`"
				>
					<path v-if="sign.def.type === 'path'" :d="sign.def.d" :stroke-width="sign.def['stroke-width']" />
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
		</svg>
		<svg v-for="(page, i) of doc.pages" :key="i"
			class="page"
			xmlns="http://www.w3.org/2000/svg"
			:width="page.width"
			:height="page.height"
			:viewBox="`${page.viewBox.x} ${page.viewBox.y} ${page.viewBox.width} ${page.viewBox.height}`"
		>
			<g class="row" v-for="(row, ii) of page.rows" :key="ii"
				:transform="`translate(${row.x}, ${row.y})`"
			>
				<rect class="mark" :x="0" :y="row.top" :width="row.width" :height="row.bottom - row.top" />
				<rect class="cursor" v-if="cursorPosition && cursorPosition.row === row.index"
					:x="cursorPosition.x" :y="row.top - 0.5" width="1" :height="row.bottom - row.top + 1"
				/>
				<g>
					<SheetToken v-for="(token, i5) of row.tokens" :key="i5" :token="token" />
				</g>
				<g class="staff" v-for="(staff, iii) of row.staves" :key="iii"
					:transform="`translate(${staff.x}, ${staff.y})`"
				>
					<circle class="mark" />
					<g>
						<SheetToken v-for="(token, i5) of staff.tokens" :key="i5" :token="token" />
					</g>
					<g class="measure" v-for="(measure, i4) of staff.measures" :key="i4">
						<g class="mark">
							<text :x="measure.headX">{{i4}}</text>
						</g>
						<SheetToken v-for="(token, i5) of measure.tokens" :key="i5" :token="token" :matchedIds="matchedIds" />
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>

<script>
	import Vue from "vue";
	import {MusicNotation, MidiPlayer} from "@k-l-lambda/web-widgets";

	import * as StaffNotation from "../../inc/staffSvg/staffNotation.ts";
	import SheetScheduler from "../../inc/staffSvg/scheduler.ts";
	import LogRecorder from "../../inc/logRecorder.ts";

	import SheetToken from "./sheet-token.vue";



	export default {
		name: "sheet-live",


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
				midiPlayer: null,
				scheduler: null,
				matchedIds: new Set(),
			};
		},


		computed: {
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
							staff => staff && staff.measures.forEach(
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


		methods: {
			onMidi (data, timestamp) {
				this.$emit("midi", data, timestamp);

				const delay = Math.max(timestamp - performance.now(), 0);
				setTimeout(() => {
					//console.log("midi event:", data);
					if (data.ids) {
						const tokens = data.ids.map(id => this.linkedTokens.get(id));

						switch (data.subtype) {
						case "noteOn":
							tokens.forEach(token => token && Vue.set(token, "on", true));

							break;
						case "noteOff":
							tokens.forEach(token => token && Vue.set(token, "on", false));

							break;
						}
					}
				}, delay);
			},


			updateTokenStatus () {
				if (this.midiNotation) {
					for (const note of this.midiNotation.notes) {
						const on = this.midiPlayer.progressTime >= note.start && this.midiPlayer.progressTime < note.start + note.duration;
						if (note.ids) {
							note.ids.forEach(id => {
								const token = this.linkedTokens.get(id);
								if (token)
									Vue.set(token, "on", on);
							});
						}
					}
				}
			},


			updateSheetNotation () {
				this.sheetNotation = null;
				if (this.doc) {
					const logger = new LogRecorder({enabled: true});
					this.sheetNotation = StaffNotation.parseNotationFromSheetDocument(this.doc, {logger});

					console.log("sheet notation parsed:", logger.toJSON());
				}
			},


			async updateMidiNotation () {
				this.midiNotation = null;
				this.scheduler = null;
				this.matchedIds.clear();

				if (this.midiPlayer) {
					this.midiPlayer.dispose();
					this.midiPlayer = null;
				}

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
					onTurnCursor: () => this.updateTokenStatus(),
				});
			},


			async matchNotations () {
				const matcherNotations = await StaffNotation.matchNotations(this.midiNotation, this.sheetNotation);
				//console.log("matching:", this.midiNotation.notes.map(n => n.ids && n.ids[0]));

				const matchedIds = new Set();
				this.midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => matchedIds.add(id)));
				this.matchedIds = matchedIds;

				this.scheduler = SheetScheduler.createFromNotation(this.midiNotation, this.linkedTokens);

				this.$emit("update:matcherNotations", matcherNotations);
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

			path
			{
				stroke: inherit;
				//stroke-width: inherit;
				fill: inherit;
			}
		}

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

		.mark
		{
			visibility: hidden;
		}
	}
</style>
