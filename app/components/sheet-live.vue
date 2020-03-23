<template>
	<div class="sheet live" v-resize="onResize">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			:width="600"
			:viewBox="svgViewBox"
		>
			<g class="page" v-for="(page, i) of content.pages" :key="i">

			</g>
		</svg>
	</div>
</template>

<script>
	import resize from "vue-resize-directive";



	export default {
		name: "sheet-live",


		directives: {
			resize,
		},


		props: {
			content: Object,
			hashTable: Object,
		},


		data () {
			return {
				size: {
					width: 100,
					height: 100,
				},
			};
		},


		computed: {
			svgViewBox () {
				// TODO:
				return "0 0 600 800";
			},
		},


		mounted () {
			this.onResize();
		},


		methods: {
			onResize () {
				this.size.width = this.$el.clientWidth;
				this.size.height = this.$el.clientHeight;
			},
		},
	};
</script>

<style scoped>
	.sheet
	{
		white-space: nowrap;
		display: inline-block;
	}
</style>
