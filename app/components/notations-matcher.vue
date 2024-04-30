<template>
	<div class="notations-matcher">
		<svg xmlns="http://www.w3.org/2000/svg" height="480" :viewBox="`-20 -20 ${width + 40} 160`">
			<g :transform="`translate(${positionC.x}, ${positionC.y})`" class="criterion">
				<PinaoRoll v-if="innerCriterion"
					:notation="innerCriterion"
					:timeScale="timeScale"
					:pitchScale="1"
					:tooltips="true"
					@clickNote="onClickCNote"
				/>
			</g>
			<g :transform="`translate(${positionS.x}, ${positionS.y})`" class="sample">
				<PinaoRoll v-if="innerSample"
					:notation="innerSample"
					:timeScale="timeScale"
					:pitchScale="1"
					:tooltips="true"
					@clickNote="onClickSNote"
				/>
			</g>
			<g class="links" v-if="links">
				<line v-for="link of links" :key="link.s.index"
					:class="{
						oblique: link.s.start !== link.c.start,
						'heavy-oblique': Math.abs(link.s.start - link.c.start) > 128,
					}"
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
	import {SvgPianoRoll} from "@k-l-lambda/music-widgets";

	import pick from "../../inc/pick";



	const copyNotation = notation => ({
		notes: notation.notes.map(note => pick(note, ["startTick", "endTick", "softIndex", "duration", "classes", "pitch", "index", "id"])),
	});



	export default {
		name: "notations-matcher",


		props: {
			criterion: Object,
			sample: Object,
			path: Array,
			softIndexAsX: {
				type: Boolean,
				default: false,
			},
			timeFactorC: {
				type: Number,
				default: 1,
			},
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

				const copy = copyNotation(this.criterion);
				this.satisfyNotation(copy, "c");

				return copy;
			},


			innerSample () {
				if (!this.sample)
					return null;

				const copy = copyNotation(this.sample);
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
						if (this.softIndexAsX) {
							note.start = note.softIndex * 4e+3;
							note.duration = 2000;
						}
						else {
							note.start = note.startTick * 32 * (type === "s" ? this.timeFactorC : 1);
							note.duration = 2000;
						}
						note.classes = note.classes || {};

						const matched = this.linkIndices.some(item => item[type] === note.index);
						note.classes.missed = !matched;
					});
				}
			},


			onClickCNote (note) {
				const cnote = this.criterion.notes[note.index];
				this.$emit("clickCNote", cnote);
			},


			onClickSNote (note) {
				const snote = this.sample.notes[note.index];
				this.$emit("clickSNote", snote);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.links
	{
		 line
		{
			stroke: #000a;
			stroke-width: 0.1px;

			&.oblique
			{
				stroke: #400;

				&.heavy-oblique
				{
					stroke: #a00;
					stroke-width: 0.2px;
				}
			}
		}
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
