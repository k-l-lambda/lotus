<template>
	<div class="sheet" v-resize="onResize">
		<span class="page" v-for="(staff, i) of staves" :key="i" v-html="staff"></span>
	</div>
</template>

<script>
	import resize from "vue-resize-directive";



	export default {
		name: "sheet-simple",


		directives: {
			resize,
		},


		props: {
			staves: Array,
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
	.sheet
	{
		white-space: nowrap;
		display: inline-block;
	}

	.page
	{
		display: inline-block;
		margin: 0 1em;
		background-color: #f6faff;
	}
</style>
