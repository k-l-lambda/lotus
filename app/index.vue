<template>
	<body>
		<keep-alive>
			<component v-if="view" :is="view"></component>
		</keep-alive>
	</body>
</template>

<script>
	import Vue from "vue";



	const components = [
		"playground",
		"profiler",
	];


	components.forEach(name => Vue.component(name, () => import(`./views/${name}.vue`)));



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
				this.view = location.hash.substr(1) || "playground";
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
