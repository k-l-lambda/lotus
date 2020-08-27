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


		mounted () {
			this.bindLinks();
		},


		updated () {
			this.$nextTick(() => this.bindLinks());
		},


		methods: {
			bindLinks () {
				const links = this.$el.querySelectorAll("a");
				for (const a of links)
					a.onclick = event => this.$emit("linkClick", event, a.href.baseVal);
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
