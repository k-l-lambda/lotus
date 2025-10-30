<template>
	<dialog :open="visible" @click="close">
		<main @click.stop>
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
		background-color: #0008;
		cursor: pointer;
		margin: 0;
		padding: 0;
		border: 0;
		overflow: auto;
		z-index: 1000;

		&:not([open])
		{
			display: none;
		}

		&[open]
		{
			display: flex;
			align-items: center;
			justify-content: center;
		}

		main
		{
			position: relative;
			max-width: 90vw;
			max-height: 90vh;
			height: 90vh;
			background-color: #fff;
			border-radius: 12px;
			padding: 0;
			cursor: default;
			box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
	}
</style>
