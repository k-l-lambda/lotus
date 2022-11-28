<template>
	<svg xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox" :height="height"
		@click="onClickCanvas"
		@mousewheel="onMouseWheel"
	>
		<g :transform="`translate(${-xScroll}, 0)`">
			<g v-if="progressTime" class="progress">
				<rect :x="0" :y="-120" :height="121 - notation.keyRange.low" :width="progressTime * timeScale" />
				<line :x1="progressTime * timeScale" :x2="progressTime * timeScale" :y1="-notation.keyRange.low + 1" y2="-120" />
			</g>
			<g v-if="notation">
				<g class="bar measure" v-for="(bar, i) of notation.bars" :key="i">
					<line v-if="bar.index === 0"
						:x1="bar.time * timeScale" :x2="bar.time * timeScale" :y1="-notation.keyRange.low + 1" y2="-120"
					/>
				</g>
				<g class="bar pitch-group" v-for="pitch of pitchScales" :key="`p-${pitch}`">
					<line :x1="0" :x2="timeScale * notation.endTime" :y1="-pitch + 1" :y2="-pitch + 1" />
				</g>
			</g>
			<SvgPianoRoll v-if="notation" :notation="notation" :timeScale="timeScale" :pitchScale="1" />
		</g>
		<g class="scales" v-if="notation">
			<rect class="pitch-padding" :x="-10" :y="-120" :width="10" :height="-notation.keyRange.low + 121" />
			<line x1="0" x2="0" :y1="-notation.keyRange.low + 1" y2="-120" />
			<line x1="0" :x2="timeScale * notation.endTime - xScroll" :y1="-notation.keyRange.low + 1" :y2="-notation.keyRange.low + 1" />
			<g class="pitch-bar" v-for="pitch of pitchScales" :key="`p-${pitch}`">
				<line x1="-.8" x2="0" :y1="-pitch + 0.5" :y2="-pitch + 0.5" />
				<text x="-2" :y="-pitch + 1" >{{pitch}}</text>
			</g>
			<g :transform="`translate(${-xScroll}, 0)`">
				<g class="time-bar" v-for="time of timeScales" :key="`t-${time}`">
					<line :x1="time * timeScale" :x2="time * timeScale" :y1="-notation.keyRange.low + 1" :y2="-notation.keyRange.low + 1.8" />
					<text :x="time * timeScale" :y="-notation.keyRange.low + 4">{{time * 1e-3}}s</text>
				</g>
			</g>
		</g>
	</svg>	
</template>

<script>
	import Vue from "vue";
	import {MIDI, MusicNotation} from "@k-l-lambda/music-widgets";

	import SvgPianoRoll from "./svg-piano-roll.vue";



	const {parseMidiData} = MIDI;
	const {Notation} = MusicNotation;


	const PADDINGS = {
		left: 3,
		right: 1,
	};



	export default {
		name: "midi-roll",


		props: {
			midiURL: String,
			player: Object,
			height: {
				type: Number,
				default: 200,
			},
			width: Number,
			timeScale: {
				type: Number,
				default: 1e-3,
			},
		},


		components: {
			SvgPianoRoll,
		},


		data () {
			return {
				notation: null,
				timeScroll: 0,
			};
		},


		computed: {
			widthLimited () {
				return Number.isFinite(this.width);
			},


			aspectRatio () {
				return this.widthLimited ? this.width / this.height : 1.6;
			},


			viewHeight () {
				if (this.notation) {
					const {low, high} = this.notation.keyRange;

					return high - low + 5;
				}

				return 90;
			},


			justifyWidth () {
				const duration = this.notation ? this.notation.endTime : this.height * this.aspectRatio;
				return duration * this.timeScale + PADDINGS.left + PADDINGS.right;
			},


			viewWidth () {
				if (this.widthLimited)
					//return Math.min(justifyWidth, this.width * this.viewHeight / this.height);
					return this.width * this.viewHeight / this.height;

				return this.justifyWidth;
			},


			viewBox () {
				return `-${PADDINGS.left} ${this.notation ? -this.notation.keyRange.high - 1 : 0} ${this.viewWidth} ${this.viewHeight}`;
			},


			pitchScales () {
				if (!this.notation)
					return [];

				return Array(9).fill().map((_, i) => i * 12).filter(p => p >= this.notation.keyRange.low);
			},


			timeScales () {
				if (!this.notation)
					return [];

				return Array(Math.ceil(this.notation.endTime / 15e+3)).fill().map((_, i) => i * 15e+3);
			},


			progressTime () {
				return this.player ? this.player.progressTime : null;
			},


			visibleTimeSpan () {
				if (this.widthLimited)
					return (this.viewWidth - (PADDINGS.left + PADDINGS.right)) / this.timeScale;

				return Infinity;
			},


			xScroll () {
				return this.timeScroll * this.timeScale;
			},
		},


		created () {
			this.load();
		},


		methods: {
			async load () {
				this.notation = null;

				if (this.player) {
					this.notation = this.player.notation;

					this.updateNoteStatus();
					this.$forceUpdate();
				}
				else if (this.midiURL) {
					const buffer = await (await fetch(this.midiURL)).arrayBuffer();
					const midi = parseMidiData(buffer);

					this.notation = Notation.parseMidi(midi);
					//console.log("notation:", this.notation);
				}
			},


			updateNoteStatus () {
				if (!this.notation)
					return;

				const valid = Number.isFinite(this.progressTime);
				for (const note of this.notation.notes)
					Vue.set(note, "on", valid && (note.start < this.progressTime) && (note.start + note.duration > this.progressTime));
			},


			onClickCanvas (event) {
				//console.log("click:", event.offsetX, event.offsetY);

				if (this.player) {
					const docToCanvas = (this.notation.keyRange.high - this.notation.keyRange.low + 5) / this.height;
					const x = event.offsetX * docToCanvas - PADDINGS.left + this.xScroll;
					const time = x / this.timeScale;

					if (time >= 0 && time < this.notation.endTime)
						this.player.turnCursor(time);
				}
			},


			onMouseWheel (event) {
				//console.log("onMouseWheel:", event);
				this.timeScroll += event.deltaY * 0.4 / this.timeScale;
			},


			adjustTimeScroll () {
				if (this.progressTime - this.timeScroll > this.visibleTimeSpan * 0.6)
					this.timeScroll = Math.max(Math.min(this.progressTime - this.visibleTimeSpan * 0.6, this.notation.endTime - this.visibleTimeSpan), 0);
				else if (this.progressTime - this.timeScroll < this.visibleTimeSpan * 0.4)
					this.timeScroll = Math.max(this.progressTime - this.visibleTimeSpan * 0.4, 0);
			},
		},


		watch: {
			midiURL: "load",
			player: "load",


			progressTime () {
				this.updateNoteStatus();

				if (this.widthLimited)
					this.adjustTimeScroll();
			},
		},
	};
</script>

<style scoped>
	.scales line
	{
		stroke: black;
		stroke-width: 0.1;
	}

	.scales text
	{
		font-size: 2px;
		text-anchor: middle;
		user-select: none;
	}

	.bar line
	{
		stroke: black;
		stroke-width: 0.01;
	}

	.pitch-bar line, .time-bar line
	{
		stroke: black;
		stroke-width: 0.06;
	}

	.pitch-padding
	{
		fill: #fffc;
	}

	.progress rect
	{
		fill: #afa1;
	}

	.progress line
	{
		stroke: #0a0;
		stroke-width: 0.04;
	}
</style>
