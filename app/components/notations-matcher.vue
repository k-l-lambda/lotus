<template>
	<div>
		<svg xmlns="http://www.w3.org/2000/svg" height="480" viewBox="-20 -20 1000 160">
			<g :transform="`translate(${positionC.x}, ${positionC.y})`" class="criterion">
				<PinaoRoll v-if="criterion" :notations="criterion" :timeScale="timeScale" :pitchScale="1" />
			</g>
			<g :transform="`translate(${positionS.x}, ${positionS.y})`" class="sample">
				<PinaoRoll v-if="sample" :notations="sample" :timeScale="timeScale" :pitchScale="1" />
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
	import PinaoRoll from "@k-l-lambda/web-widgets/source/components/svg-piano-roll.vue";



	export default {
		name: "notations-matcher",


		props: {
			criterion: Object,
			sample: Object,
			path: Array,
		},


		components: {
			PinaoRoll,
		},


		data () {
			return {
				timeScale: 1e-3,
				positionC: {x: 0, y: 90},
				positionS: {x: 0, y: 160},
			};
		},


		created () {
			this.satisfyNotation(this.criterion, "c");
			this.satisfyNotation(this.sample, "s");
		},


		computed: {
			links () {
				return this.path && this.path.map((ci, si) => ({ci, si})).filter(({ci}) => ci >= 0).map(({ci, si}) => ({
					c: this.criterion.notes[ci],
					s: this.sample.notes[si],
				}));
			},
		},


		methods: {
			satisfyNotation (notation, type) {
				if (notation) {
					notation.notes.forEach(note => {
						note.duration = note.duration || 2000;
						note.classes = note.classes || {};

						const matched = this.links.find(item => item[type].index === note.index);
						note.classes.missed = !matched;
					});
				}
			},
		},


		watch: {
			criterion () {
				this.satisfyNotation(this.criterion, "c");
			},


			sample () {
				this.satisfyNotation(this.sample, "s");
			},
		},
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
</style>
