<template>
	<div class="notations-matcher">
		<svg xmlns="http://www.w3.org/2000/svg" height="480" :viewBox="`-20 -20 ${width + 40} 160`">
			<g :transform="`translate(${positionC.x}, ${positionC.y})`" class="criterion">
				<PinaoRoll v-if="innerCriterion" :notation="innerCriterion" :timeScale="timeScale" :pitchScale="1" :tooltips="true" />
			</g>
			<g :transform="`translate(${positionS.x}, ${positionS.y})`" class="sample">
				<PinaoRoll v-if="innerSample" :notation="innerSample" :timeScale="timeScale" :pitchScale="1" :tooltips="true" />
			</g>
			<g class="links" v-if="links">
				<line v-for="link of links" :key="link.s.index"
					:x1="positionS.x + link.s.start * timeScale"
					:x2="positionC.x + link.c.start * timeScale"
					:y1="positionS.y - link.s.pitch + 0.5"
					:y2="positionC.y - link.c.pitch + 0.5"
				/>
			</g>
		</svg>
	</div>
</template>

<script>
	import _ from "lodash";
	import {SvgPianoRoll} from "@k-l-lambda/web-widgets";



	export default {
		name: "notations-matcher",


		props: {
			criterion: Object,
			sample: Object,
			path: Array,
		},


		components: {
			PinaoRoll: SvgPianoRoll,
		},


		data () {
			return {
				timeScale: 1e-3,
				positionC: {x: 0, y: 90},
				positionS: {x: 0, y: 160},
			};
		},


		computed: {
			links () {
				return this.path && this.path.map((ci, si) => ({ci, si})).filter(({ci}) => ci >= 0).map(({ci, si}) => ({
					c: this.innerCriterion.notes[ci],
					s: this.innerSample.notes[si],
				}));
			},


			linkIndices () {
				return this.path && this.path.map((c, s) => ({c, s}));
			},


			width () {
				const lastC = this.innerCriterion && this.innerCriterion.notes[this.innerCriterion.notes.length - 1];
				const lastS = this.innerSample && this.innerSample.notes[this.innerSample.notes.length - 1];

				const cduration = lastC ? (lastC.start + lastC.duration) : 0;
				const sduration = lastS ? (lastS.start + lastS.duration) : 0;

				return Math.max(cduration, sduration, 1) * this.timeScale;
			},


			innerCriterion () {
				if (!this.criterion)
					return null;

				const copy = {
					notes: this.criterion.notes.map(note => _.pick(note, ["softIndex", "duration", "classes", "pitch", "index"])),
				};
				this.satisfyNotation(copy, "c");

				return copy;
			},


			innerSample () {
				if (!this.sample)
					return null;

				const copy = {
					notes: this.sample.notes.map(note => _.pick(note, ["softIndex", "duration", "classes", "pitch", "index"])),
				};
				this.satisfyNotation(copy, "s");

				return copy;
			},
		},


		/*created () {
			this.satisfyNotation(this.criterion, "c");
			this.satisfyNotation(this.sample, "s");
		},*/


		methods: {
			satisfyNotation (notation, type) {
				if (notation) {
					notation.notes.forEach(note => {
						note.start = note.softIndex * 4e+3;
						note.duration = 2000;
						note.classes = note.classes || {};

						const matched = this.linkIndices.some(item => item[type] === note.index);
						note.classes.missed = !matched;
					});
				}
			},
		},


		/*watch: {
			criterion () {
				this.satisfyNotation(this.criterion, "c");
			},


			sample () {
				this.satisfyNotation(this.sample, "s");
			},
		},*/
	};
</script>

<style scoped>
	.links line
	{
		stroke: #000a;
		stroke-width: 0.1px;
	}
</style>

<style>
	.criterion .note
	{
		fill: darkblue;
	}

	.sample .note
	{
		fill: darkslategray;
	}

	.note.missed
	{
		stroke: red;
		stroke-width: 0.2;
	}

	.notations-matcher
	{
		overflow: auto;
	}
</style>
