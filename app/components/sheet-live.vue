<template>
	<div class="sheet live">
		<svg v-for="(page, i) of shownPages" :key="i" ref="pages"
			class="page"
			xmlns="http://www.w3.org/2000/svg"
			:width="page.width"
			:height="page.height"
			:viewBox="`${page.viewBox.x} ${page.viewBox.y} ${page.viewBox.width} ${page.viewBox.height}`"
			:style="{['background-image']: backgroundImages && backgroundImages[i] && `url(${backgroundImages[i]})`}"
			@DOMNodeInserted="onPageChanged"
		>
			<g v-if="!partialVisible || !page.hidden">
				<g v-if="showMark" class="mark">
					<g class="row" v-for="(row, ii) of page.rows" :key="ii"
						:transform="`translate(${row.x}, ${row.y})`"
						@mousemove="enablePointer && onMousemovePad(row, $event)"
						@mouseleave="enablePointer && onMouseleavePad(row, $event)"
						@click="onClickPad(row, $event)"
					>
						<rect :x="0" :y="row.top" :width="row.width" :height="row.bottom - row.top" />
						<slot name="system" :row="row"></slot>
					</g>
					<slot name="page" :page="page"></slot>
				</g>
				<g v-if="!bakingMode">
					<g class="page-tokens">
						<SheetToken v-for="(token, ii) of page.tokens" :key="ii" :token="token" />
					</g>
					<g class="row" v-for="(row, ii) of page.rows" :key="ii"
						:transform="`translate(${row.x}, ${row.y})`"
					>
						<rect class="cursor" v-if="showCursor && cursorPosition && cursorPosition.row === row.index"
							:x="cursorPosition.x" :y="row.top - 0.5" width="1" :height="row.bottom - row.top + 1"
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
								<SheetToken v-for="(token, i5) of measure.tokens" :key="i5"
									:token="token"
									:classes="{
										matched: statusMap.has(token.href),
										mismatched: token.is('NOTEHEAD') && !statusMap.has(token.href),
										tied: token.tied,
										attached: Number.isFinite(token.stemX),
									}"
									:showTitle="showMark"
									@click="$emit('click-token', token, $event)"
								/>
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
									:class="{tied: token.tied}"
									:data-track="token.track"
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
			</g>
		</svg>
	</div>
</template>

<script>
	import Vue from "vue";
	import {MidiPlayer} from "@k-l-lambda/web-widgets";

	import SheetScheduler from "../../inc/lilyNotation/scheduler.ts";
	import {animationDelay} from "../delay.js";
	import {SingleLock} from "../../inc/mutex.ts";
	import SchedulePool from "../../inc/schedulePool.ts";

	import SheetToken from "./sheet-token.vue";



	class PlaceholderTokenList {
		add () {}
		remove () {}
	};


	class MultiClassList {
		constructor (elems) {
			this.elems = elems;
		}

		/*has (name) {
			return this.elems[0].has(name);
		}*/

		add (name) {
			this.elems.forEach(elem => elem.classList.add(name));
		}

		remove (name) {
			this.elems.forEach(elem => elem.classList.remove(name));
		}
	};


	const elemClassById = (id, parent = document) => {
		const elems = parent.querySelectorAll(`.token *[data-href='${id}']`);
		if (elems.length === 0)
			return new PlaceholderTokenList();

		if (elems.length === 1)
			return elems[0].classList;

		return new MultiClassList(elems);
	};



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
			enablePointer: {
				type: Boolean,
				default: false,
			},
			showPagesProgressively: {
				type: Boolean,
				default: false,
			},
			partialVisible: {
				type: Boolean,
				default: true,
			},
			scheduler: Object,
		},


		data () {
			return {
				midiPlayer: null,
				//scheduler: null,
				statusMap: new Map(),
				shownPages: [],
			};
		},


		computed: {
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


			cursorRowIndex () {
				if (!this.cursorPosition || !this.doc)
					return null;

				return this.cursorPosition.row;
			},


			svgScale () {
				const page = this.doc && this.doc.pages[0];
				if (page)
					return this.doc.pageSize.width / page.viewBox.width;

				return 1;
			},


			isPlaying () {
				return this.midiPlayer && this.midiPlayer.isPlaying;
			},
		},


		created () {
			this.pageLoadingLock = new SingleLock();
			this.schedulePool = new SchedulePool(performance);

			this.preparePlayer();

			this.showPages();
		},


		methods: {
			onPlayerMidi (data, timestamp) {
				this.$emit("midi", data, timestamp);

				if (this.noteHighlight) {
					if (data.ids) {
						let task = null;
						const ids = data.ids;

						switch (data.subtype) {
						case "noteOn":
							task = () => ids.forEach(id => this.statusMap.get(id).add("on"));

							break;
						case "noteOff":
							task = () => ids.forEach(id => this.statusMap.get(id).remove("on"));

							break;
						}

						if (task)
							this.schedulePool.appendTask(timestamp, task);
					}
				}
			},


			setNoteStatus (noteIndex, className, on) {
				if (this.midiNotation) {
					const note = this.midiNotation.notes[noteIndex];
					if (note) {
						if (note.ids) {
							note.ids.forEach(id => {
								const list = this.statusMap.get(id);
								if (list) {
									if (on)
										list.add(className);
									else
										list.remove(className);
								}
							});
						}
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
						const on = this.midiPlayer.isPlaying && this.midiPlayer.progressTime >= note.start && this.midiPlayer.progressTime < note.start + note.duration;
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
				//this.scheduler = null;
				this.statusMap.clear();

				if (this.midiPlayer) {
					this.midiPlayer.dispose();
					this.midiPlayer = null;
				}

				if (this.midiNotation) {
					this.updateMidiPlayer();

					// wait DOM update
					await this.$nextTick();
					await this.pageLoadingLock.wait();

					this.updateStatusMap();

					if (!this.scheduler) {
						const tokenMap = this.doc && this.doc.getTokenMap();
						if (tokenMap) {
							for (const token of tokenMap.values())
								Vue.set(token, "on", token.on || false);

							const scheduler = SheetScheduler.createFromNotation(this.midiNotation, tokenMap);
							this.$emit("update:scheduler", scheduler);
						}
					}
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
				if (this.midiNotation) {
					this.midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => {
						if (!this.statusMap.get(id))
							this.statusMap.set(id, elemClassById(id, this.$el));
					}));
				}
			},


			updateStatusMapInPage (page) {
				const tokens = page.querySelectorAll(".token *[data-href]");
				tokens.forEach(token => {
					const id = token.dataset.href;
					//this.statusMap.set(id, token.classList);
					this.statusMap.set(id, elemClassById(id, page));
				});
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


			async showPages () {
				this.shownPages = [];

				if (!this.doc)
					return;

				if (this.showPagesProgressively) {
					await this.pageLoadingLock.wait();
					this.pageLoadingLock.lock();

					for (let i = 0; i < this.doc.pages.length; ++i) {
						this.shownPages.push(this.doc.pages[i]);

						await this.$nextTick();
						await animationDelay();
					}

					this.pageLoadingLock.release();
				}
				else
					this.shownPages = this.doc.pages;
			},


			onDocChanged () {
				this.clearNoteStatus();
				this.clearMarkings();

				this.showPages();
			},


			eventToRowPosition (row, event) {
				return {
					x: event.offsetX / this.svgScale - row.x,
					y: event.offsetY / this.svgScale - row.y,
				};
			},


			eventToPointer (row, event) {
				const pos = this.eventToRowPosition(row, event);
				const rowIndex = row.index;
				const measureIndex = this.doc.lookupMeasureIndex(rowIndex, pos.x);
				const tick = this.scheduler && this.scheduler.lookupTick({row: rowIndex, x: pos.x});

				return {
					rowIndex, measureIndex, tick, ...pos,
				};
			},


			onMousemovePad (row, event) {
				this.$emit("pointerUpdate", this.eventToPointer(row, event));
			},


			onMouseleavePad () {
				this.$emit("pointerUpdate", null);
			},


			onClickPad (row, event) {
				this.$emit("pointerClick", this.eventToPointer(row, event), event);
			},


			updatePageVisibility () {
				//console.log("pages:", this.$refs.pages);
				//const dirtyPages = [];
				if (!this.$refs.pages) {
					console.log("[updatePageVisibility] $refs.pages is null:", this.$refs.pages);
					return;
				}

				this.$refs.pages.forEach((pageElem, i) => {
					const rect = pageElem.getBoundingClientRect();

					const page = this.shownPages[i];
					const hidden = rect.top > window.innerHeight || rect.bottom < 0 || rect.left > window.innerWidth || rect.right < 0;
					if (!!page.hidden !== hidden)
						Vue.set(page, "hidden", hidden);
						//if (!hidden)
						//	dirtyPages.push(pageElem);
					
					//console.log("page:", i, rect, window.innerWidth, window.innerHeight, page.hidden);
				});

				//this.$nextTick(() => dirtyPages.forEach(page => this.updateStatusMapInPage(page)));
			},


			onPageChanged (event) {
				//console.log("onPageChanged:", event);
				if (event.target && event.target.nodeName === "g")
					this.updateStatusMapInPage(event.target);
			},
		},


		watch: {
			midiNotation: "preparePlayer",


			midiPlayer (value) {
				this.$emit("update:midiPlayer", value);
			},


			async bakingMode () {
				await this.$nextTick();
				await this.pageLoadingLock.wait();

				this.updateStatusMap();
				this.updateTokenStatus();
			},


			doc: "onDocChanged",


			cursorPageIndex (value) {
				this.$emit("cursorPageShift", value);
			},


			cursorRowIndex (value) {
				this.$emit("cursorRowShift", value);
			},


			isPlaying (value) {
				if (!value)
					this.schedulePool.clear();
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import "../styles/sheetConstants.css";


	.sheet
	{
		.mark
		{
			//visibility: hidden;
			opacity: 0;

			.locator
			{
				text
				{
					font-size: 2px;
					text-anchor: start;
					pointer-events: none;
				}
			}

			rect
			{
				fill: transparent;
			}
		}

		.cursor
		{
			pointer-events: none;
		}

		.bake
		{
			font-family: lotus-music;

			.token
			{
				text
				{
					user-select: none;
					pointer-events: none;
					font-size: var(--music-font-size);
				}
			}
		}

		.markings
		{
			text
			{
				font-family: lotus-music;
				user-select: none;
				font-size: var(--music-font-size);
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
<style lang="scss">
	@import "../styles/sheetConstants.css";


	.sheet
	{
		.bake
		{
			.token
			{
				text
				{
					fill: var(--lotus-token-default-color);

					&.on
					{
						fill: var(--lotus-token-on-color);
						stroke-width: 0.1;
						stroke: var(--lotus-token-on-color);
					}
				}
			}
		}
	}
</style>
