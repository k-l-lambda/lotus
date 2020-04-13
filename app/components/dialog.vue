<template>
	<dialog :open="visible" @click="close">
		<main @click.stop="">
			<slot />
		</main>
	</dialog>
</template>

<script>
	export default {
		name: "popup-dialog",


		props: {
			visible: Boolean,
		},


		methods: {
			close () {
				this.$emit("update:visible", false);
			},
		},
	};
</script>

<style lang="scss" scoped>
	dialog
	{
		position: fixed;
		top: 0;
		height: 100%;
		left: 0;
		width: 100%;
		background-color: #ccca;
		cursor: pointer;
		margin: 0;
		padding: 0;
		border: 0;

		main
		{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #fff;
			border-radius: 2em;
			padding: 2em;
			cursor: default;
			text-align: center;
			padding: 2em;
		}
	}
</style>
