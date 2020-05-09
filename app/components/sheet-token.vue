<template>
	<g class="token"
		:transform="`translate(${token.x}, ${token.y})`"
		:class="{on: token.on, ...classes}"
		:data-href="token.href"
	>
		<use :class="token.classes" :xlink:href="`#sign-${token.hash}`" />
	</g>
</template>

<script>
	export default {
		name: "sheet-token",


		props: {
			token: Object,
			classes: Object,
		},
	};
</script>

<style lang="scss" scoped>
	@import "../styles/sheetConstants.scss";


	.token
	{
		.staff-line, .line, .slur
		{
			stroke: $token-default-color;
		}

		use
		{
			fill: $token-default-color;
			//stroke-width: 0;
		}

		&.on use
		{
			fill: $token-on-color;
			stroke-width: 0.1;
			stroke: $token-on-color;
		}
	}
</style>
