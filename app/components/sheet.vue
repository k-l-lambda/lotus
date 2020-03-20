<template>
	<div class="sheet" v-resize="onResize">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			:width="size.width"
			:viewBox="svgViewBox"
		>
			<g class="staff" v-html="staff"></g>
		</svg>
	</div>
</template>

<script>
	import resize from "vue-resize-directive";



	export default {
		name: "sheet",


		directives: {
			resize,
		},


		props: {
			staff: String,
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
				return `0 0 ${this.size.width} 800`;
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
	svg
	{
		background-color: #f0f0f0;
	}
</style>
