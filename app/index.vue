<template>
	<div>
		<component v-if="view" :is="view"></component>
	</div>
</template>

<script>
	export default {
		name: "lotus",


		data () {
			return {
				view: null,
			};
		},


		mounted () {
			this.onHashChange ();
			window.onhashchange = () => this.onHashChange();
		},


		methods: {
			onHashChange () {
				this.view = (location.hash.substr(1) || "playground").replace(/\?.*/, "");
			},
		},
	};
</script>

<style lang="scss">
	body
	{
		margin: 0;
		overflow: hidden;
	}
</style>
