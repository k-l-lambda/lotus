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
	.drag-hover
	{
		outline: 4px #4f4 dashed;
		background-color: #cfc;
	}

	body
	{
		margin: 0;
		overflow: hidden;
	}
</style>
