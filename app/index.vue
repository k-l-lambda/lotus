<template>
	<body>
		<Playground />
	</body>
</template>

<script>
	import Playground from "./views/playground.vue";



	export default {
		name: "lotus",


		components: {
			Playground,
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
