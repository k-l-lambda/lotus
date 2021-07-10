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
					<g class="system" v-for="(system, ii) of page.systems" :key="ii"
						:transform="`translate(${system.x}, ${system.y})`"
						@mousemove="enablePointer && onMousemovePad(system, $event)"
						@mouseleave="enablePointer && onMouseleavePad(system, $event)"
						@click="onClickPad(system, $event)"
					>
						<rect :x="0" :y="system.top" :width="system.width" :height="system.bottom - system.top" />
						<slot name="system" :system="system" :page="page"></slot>
					</g>
					<slot name="page" :page="page"></slot>
				</g>
				<g v-if="!bakingMode">
					<g v-if="watermark" class="wm">
						<image :href="watermark"
							:x="(doc.pageSize.width - watermarkSize.width) / 2 / svgScale"
							:y="(doc.pageSize.height - watermarkSize.height) / 2 / svgScale"
							:width="watermarkSize.width / 2 / svgScale"
							:height="watermarkSize.height / 2 / svgScale"
						/>
					</g>
					<g class="page-tokens">
						<SheetToken v-for="(token, ii) of page.tokens" :key="ii" :token="token" />
					</g>
					<g class="system" v-for="(system, ii) of page.systems" :key="ii"
						:transform="`translate(${system.x}, ${system.y})`"
					>
						<rect class="cursor" v-if="showCursor && cursorPosition && cursorPosition.system === system.index"
							:x="cursorPosition.x" :y="system.top - 0.5" width="1" :height="system.bottom - system.top + 1"
						/>
						<g>
							<SheetToken v-for="(token, i5) of system.tokens" :key="i5" :token="token" />
						</g>
						<g class="staff" v-for="(staff, iii) of system.staves" :key="iii"
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
										highlight: highlightSymbol && token.is(highlightSymbol),
									}"
									:showTitle="showMark"
									:scale="enabledFont ? token.scale2 : null"
									@click="$emit('click-token', token, $event)"
								/>
							</g>
							<g v-if="showMark" class="mark">
								<slot name="staff" :staff="staff" :system="system" :page="page"></slot>
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
					<g class="system" v-for="(system, ii) of page.systems" :key="ii"
						:transform="`translate(${system.x}, ${system.y})`"
					>
						<rect class="cursor" v-if="showCursor && cursorPosition && cursorPosition.system === system.index"
							:x="cursorPosition.x" :y="system.top - 0.5" width="1" :height="system.bottom - system.top + 1"
						/>
						<g class="staff" v-for="(staff, iii) of system.staves" :key="iii"
							:transform="`translate(${staff.x}, ${staff.y})`"
						>
							<g class="measure" v-for="(measure, i4) of staff.measures" :key="i4">
								<g v-for="(token, i5) of measure.matchedTokens" :key="i5"
									:transform="`translate(${token.x}, ${token.y})` + (token.scale && token.scale !== 1 ? ` scale(${token.scale})` : '')"
									class="token matched"
									:class="{tied: token.tied}"
									:data-track="token.track"
									:data-index="token.index"
								>
									<text :data-href="token.href">{{token.fontUnicode}}</text>
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

		get value () {
			return this.elems[0] && this.elems[0].value;
		}

		set value (value) {
			this.elems.forEach(elem => elem.value = value);
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


	const DEFAULT_WATERMARK = process.env.VUE_APP_DEFAULT_WATERMARK;



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
			watermark: {
				type: String,
				default: DEFAULT_WATERMARK,
			},
			enabledFont: Boolean,
			highlightSymbol: String,
		},


		data () {
			return {
				midiPlayer: null,
				//scheduler: null,
				statusMap: new Map(),
				shownPages: [],
				watermarkSize: {
					width: 256,
					height: 256,
				},
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

				const system = this.doc.systems[this.cursorPosition.system];
				console.assert(system, "invalid cursor system index:", this.cursorPosition);

				if (!system)
					return null;

				return system.pageIndex;
			},


			cursorSystemIndex () {
				if (!this.cursorPosition || !this.doc)
					return null;

				return this.cursorPosition.system;
			},


			// DEPRECATED
			cursorRowIndex () {
				return this.cursorSystemIndex;
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

			if (this.watermark) {
				const img = new Image();
				img.src = this.watermark;
				img.onload = () => {
					this.watermarkSize.width = img.naturalWidth;
					this.watermarkSize.height = img.naturalHeight;
				};
			}
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
							task = () => ids.forEach(id => {
								const status = this.statusMap.get(id);
								status && status.add("on");
							});

							break;
						case "noteOff":
							task = () => ids.forEach(id => {
								const status = this.statusMap.get(id);
								status && status.remove("on");
							});

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
								if (status) {
									if (on)
										status.add("on");
									else
										status.remove("on");
								}
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


			addMarkingByTick (tick, pitch, staffIndex, {id, cls, text = "\ue0a9", xoffset = 0} = {}) {
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
				if (!context) {
					console.warn("no context at tick:", tick, contextTable);
					return null;
				}
				const {y, alter} = context.pitchToY(pitch);

				return this.doc.addMarking(position.system, staffIndex, {x: position.x + xoffset, y, text, alter, id, cls});
			},


			addMarkingByNote (noteIndex, pitch, {id = null, cls, text = "\ue0a9"} = {}) {
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


			eventToSystemPosition (system, event) {
				return {
					x: event.offsetX / this.svgScale - system.x,
					y: event.offsetY / this.svgScale - system.y,
				};
			},


			eventToPointer (system, event) {
				const pos = this.eventToSystemPosition(system, event);
				const systemIndex = system.index;
				const measureIndex = this.doc.lookupMeasureIndex(systemIndex, pos.x);
				const tick = this.scheduler && this.scheduler.lookupTick({system: systemIndex, x: pos.x});

				return {
					systemIndex, measureIndex, tick, ...pos,
				};
			},


			onMousemovePad (system, event) {
				this.$emit("pointerUpdate", this.eventToPointer(system, event));
			},


			onMouseleavePad () {
				this.$emit("pointerUpdate", null);
			},


			onClickPad (system, event) {
				this.$emit("pointerClick", this.eventToPointer(system, event), event);
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


			cursorSystemIndex (value) {
				this.$emit("cursorSystemShift", value);
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

		.wm
		{
			pointer-events: none;
		}

		.cursor
		{
			pointer-events: none;
		}

		.bake
		{
			font-family: var(--music-font-family);

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
				font-family: var(--music-font-family);
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
