<template>
	<div class="sheet">
		<span class="page" v-for="(doc, i) of documents" :key="i" v-html="doc"></span>
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
			documents: Array,
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
