<template>
	<g class="token"
		:transform="`translate(${token.x}, ${token.y})`"
		:class="{on: token.on}"
	>
		<use :class="token.classes" :xlink:href="`#sign-${token.hash}`" />
	</g>
</template>

<script>
	export default {
		name: "sheet-token",


		props: {
			token: Object,
		},
	};
</script>

<style lang="scss" scoped>
	$default-color: black;
	$on-color: #06f;


	.token
	{
		.staff-line
		{
			stroke: $default-color;
		}

		use
		{
			fill: $default-color;
		}

		&.on use
		{
			fill: $on-color;
		}
	}
</style>
