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
	$default-color: black;
	$on-color: #0af;


	.token
	{
		.staff-line, .line, .slur
		{
			stroke: $default-color;
		}

		use
		{
			fill: $default-color;
			//stroke-width: 0;
		}

		&.on use
		{
			fill: $on-color;
			stroke-width: 0.1;
			stroke: $on-color;
		}
	}
</style>
