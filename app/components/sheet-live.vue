<template>
	<div class="sheet live">
		<svg v-for="(page, i) of doc.pages" :key="i"
			class="page"
			xmlns="http://www.w3.org/2000/svg"
			:width="page.width"
			:height="page.height"
			:viewBox="`${page.viewBox.x} ${page.viewBox.y} ${page.viewBox.width} ${page.viewBox.height}`"
			:style="{['background-image']: backgroundImages && backgroundImages[i] && `url(${backgroundImages[i]})`}"
		>
			<g v-if="!bakingMode">
				<g class="page-tokens">
					<SheetToken v-for="(token, ii) of page.tokens" :key="ii" :token="token" />
				</g>
				<g class="row" v-for="(row, ii) of page.rows" :key="ii"
					:transform="`translate(${row.x}, ${row.y})`"
				>
					<rect class="mark" v-if="showMark" :x="0" :y="row.top" :width="row.width" :height="row.bottom - row.top" />
					<rect class="cursor" v-if="showCursor && cursorPosition && cursorPosition.row === row.index"
						:x="cursorPosition.x" :y="row.top - 0.5" width="1" :height="row.bottom - row.top + 1"
					/>
					<g>
						<SheetToken v-for="(token, i5) of row.tokens" :key="i5" :token="token" />
					</g>
					<g class="staff" v-for="(staff, iii) of row.staves" :key="iii"
						:transform="`translate(${staff.x}, ${staff.y})`"
					>
						<rect class="mark head" v-if="showMark" :x="0" :y="-2" :width="staff.headWidth" :height="4" />
						<circle class="mark" v-if="showMark" />
						<line class="mark" v-if="showMark && Number.isFinite(staff.top)" :x1="0" :y1="staff.top" :x2="row.width" :y2="staff.top" />
						<g>
							<SheetToken v-for="(token, i5) of staff.tokens" :key="i5" :token="token" />
						</g>
						<g class="measure" v-for="(measure, i4) of staff.measures" :key="i4">
							<g class="mark" v-if="showMark">
								<text :x="measure.headX">'{{i4}}</text>
							</g>
							<SheetToken v-for="(token, i5) of measure.tokens" :key="i5"
								:token="token"
								:classes="{
									matched: statusMap.has(token.href),
									mismatched: token.is('NOTEHEAD') && !statusMap.has(token.href),
									tied: token.tied,
									attached: Number.isFinite(token.stemX),
								}"
								:showTitle="showMark"
							/>
						</g>
					</g>
				</g>
			</g>
			<g v-if="bakingMode" class="bake">
				<g class="row" v-for="(row, ii) of page.rows" :key="ii"
					:transform="`translate(${row.x}, ${row.y})`"
				>
					<rect class="cursor" v-if="showCursor && cursorPosition && cursorPosition.row === row.index"
						:x="cursorPosition.x" :y="row.top - 0.5" width="1" :height="row.bottom - row.top + 1"
					/>
					<g class="staff" v-for="(staff, iii) of row.staves" :key="iii"
						:transform="`translate(${staff.x}, ${staff.y})`"
					>
						<g class="measure" v-for="(measure, i4) of staff.measures" :key="i4">
							<g v-for="(token, i5) of measure.matchedTokens" :key="i5"
								:transform="`translate(${token.x + token.musicFontNoteOffset}, ${token.y})` + (token.scale && token.scale !== 1 ? ` scale(${token.scale})` : '')"
								class="token matched"
							>
								<text :data-href="token.href">{{token.fontChar}}</text>
							</g>
						</g>
						<g class="markings">
							<g v-for="marking of staff.markings" :key="marking.index"
								:transform="`translate(${marking.x}, ${marking.y + staff.yRoundOffset})`"
								:class="marking.cls"
							>
								<text>{{marking.text}}</text>
								<text class="alter" v-if="marking.alterText" x="-0.2" y="0">{{marking.alterText}}</text>
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
	import {MidiPlayer} from "@k-l-lambda/web-widgets";

	import SheetScheduler from "../../inc/staffSvg/scheduler.ts";

	import SheetToken from "./sheet-token.vue";



	class PlaceholderTokenList extends Set {
		remove () {}
	};

	const placeholderElement = () => ({
		classList: new PlaceholderTokenList(),
	});

	const elemById = id => document.querySelector(`.token *[data-href='${id}']`) || placeholderElement();



	export default {
		name: "sheet-live",


		components: {
			SheetToken,
		},


		props: {
			doc: Object,
			midiNotation: Object,
			pitchContextGroup: Array,
			showMark: Boolean,
			showCursor: {
				type: Boolean,
				default: true,
			},
			noteHighlight: {
				type: Boolean,
				default: true,
			},
			bakingMode: {
				type: Boolean,
				default: false,
			},
			backgroundImages: Array,
		},


		data () {
			return {
				midiPlayer: null,
				scheduler: null,
				statusMap: new Map(),
			};
		},


		computed: {
			linkedTokens () {
				if (!this.doc)
					return null;

				const tokens = new Map();
				this.doc.pages.forEach(
					page => page.rows.forEach(
						row => row.staves.forEach(
							staff => staff && staff.measures.forEach(
								measure => measure.tokens.forEach(
									token => {
										if (token.href) {
											Vue.set(token, "on", token.on || false);
											tokens.set(token.href, token);
										}
									})))));

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


			cursorPageIndex () {
				if (!this.cursorPosition || !this.doc)
					return null;

				const row = this.doc.rows[this.cursorPosition.row];
				console.assert(row, "invalid cursor row index:", this.cursorPosition);

				if (!row)
					return null;

				return row.pageIndex;
			},
		},


		created () {
			this.preparePlayer();
		},


		methods: {
			onPlayerMidi (data, timestamp) {
				this.$emit("midi", data, timestamp);

				if (this.noteHighlight) {
					const delay = Math.max(timestamp - performance.now(), 0);
					setTimeout(() => {
						//console.log("midi event:", data);
						if (!this.midiPlayer.isPlaying)
							return;

						if (data.ids) {
							switch (data.subtype) {
							case "noteOn":
							case "noteOff":
								const on = data.subtype === "noteOn";
								if (on)
									data.ids.forEach(id => this.statusMap.get(id).add("on"));
								else
									data.ids.forEach(id => this.statusMap.get(id).remove("on"));

								break;
							}
						}
					}, delay);
				}
			},


			setNoteStatus (noteIndex, className, on) {
				if (this.midiNotation) {
					const note = this.midiNotation.notes[noteIndex];
					if (note) {
						if (note.ids)
							note.ids.forEach(on ? id => this.statusMap.get(id).add(className) : id => this.statusMap.get(id).remove(className));
					}
					else
						console.warn("invalid note index:", noteIndex, this.midiNotation.notes.length);
				}
			},


			clearNoteStatus () {
				for (const status of this.statusMap.values())
					status.value = "";
			},


			updateTokenStatus () {
				if (this.midiNotation && this.noteHighlight) {
					for (const note of this.midiNotation.notes) {
						const on = this.midiPlayer.progressTime >= note.start && this.midiPlayer.progressTime < note.start + note.duration;
						if (note.ids) {
							note.ids.forEach(id => {
								const status = this.statusMap.get(id);
								if (on)
									status.add("on");
								else
									status.remove("on");
							});
						}
					}
				}
			},


			async preparePlayer () {
				//console.log("t1:", performance.now());
				this.scheduler = null;
				this.statusMap.clear();

				if (this.midiPlayer) {
					this.midiPlayer.dispose();
					this.midiPlayer = null;
				}

				if (this.midiNotation) {
					this.updateMidiPlayer();

					// wait DOM update
					await this.$nextTick();

					this.updateStatusMap();

					this.scheduler = SheetScheduler.createFromNotation(this.midiNotation, this.linkedTokens);
				}
				
			},


			updateMidiPlayer () {
				if (this.midiPlayer)
					this.midiPlayer.dispose();

				this.midiPlayer = new MidiPlayer(this.midiNotation, {
					cacheSpan: 400,
					onMidi: (data, timestamp) => this.onPlayerMidi(data, timestamp),
					onTurnCursor: () => this.updateTokenStatus(),
				});
			},


			updateStatusMap () {
				if (this.midiNotation)
					this.midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => this.statusMap.set(id, elemById(id).classList)));
			},


			addMarkingByTick (tick, pitch, staffIndex, {id, cls, text = "\u0174", xoffset = 0} = {}) {
				if (!this.pitchContextGroup) {
					console.warn("[addMarkingByTick]	pitchContextGroup is required.");
					return;
				}

				const contextTable = this.pitchContextGroup[staffIndex];
				if (!contextTable) {
					console.warn("[addMarkingByTick]	invalid staffIndex:", staffIndex, this.pitchContextGroup.length);
					return;
				}

				const position = this.scheduler.lookupPosition(tick);
				if (!position) {
					console.warn("[addMarkingByTick]	invalid tick:", tick);
					return;
				}

				const context = contextTable.lookup(tick);
				const {y, alter} = context.pitchToY(pitch);

				return this.doc.addMarking(position.row, staffIndex, {x: position.x + xoffset, y, text, alter, id, cls});
			},


			addMarkingByNote (noteIndex, pitch, {id = null, cls, text = "\u0174"} = {}) {
				console.assert(this.midiNotation, "[addMarkingByNote]	midiNotation is null.");

				const note = this.midiNotation.notes[noteIndex];
				if (!note) {
					console.warn("[addMarkingByNote]	invalid noteIndex:", noteIndex, this.midiNotation.notes.length);
					return;
				}

				if (!id) {
					if (!note.ids)
						return null;

					id = note.ids[0];
				}

				return this.addMarkingByTick(note.startTick, pitch, note.staffTrack, {id, cls, text, xoffset: 1.2});
			},


			removeMarking (id) {
				this.doc.removeMarking(id);
			},


			clearMarkings () {
				this.doc.clearMarkings();
			},


			onDocChanged () {
				this.clearNoteStatus();
				this.clearMarkings();
			},
		},


		watch: {
			midiNotation: "preparePlayer",


			midiPlayer (value) {
				this.$emit("update:midiPlayer", value);
			},


			async bakingMode () {
				await this.$nextTick();

				this.updateStatusMap();
				this.updateTokenStatus();
			},


			doc: "onDocChanged",


			cursorPageIndex (value) {
				this.$emit("cursorPageShift", value);
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import "../styles/sheetConstants.scss";


	$musicFontSize: 2.2px;


	.sheet
	{
		.mark
		{
			visibility: hidden;
		}

		.bake
		{
			font-family: lotus-music;

			.token
			{
				text
				{
					user-select: none;
					font-size: $musicFontSize;
					fill: $token-default-color;

					&.on
					{
						fill: $token-on-color;
						stroke-width: 0.1;
						stroke: $token-on-color;
					}
				}
			}
		}

		.markings
		{
			text
			{
				user-select: none;
				font-size: $musicFontSize;
			}

			.alter
			{
				text-anchor: end;
			}
		}
	}
</style>

<style>
	@import "../styles/music-font.css";
</style>
