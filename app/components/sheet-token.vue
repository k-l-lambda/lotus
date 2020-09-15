<template>
	<g class="token"
		:transform="`translate(${token.x}, ${token.y})`"
		:class="classes"
		:data-href="token.href"
		:data-track="token.track"
		@click="$emit('click', $event)"
	>
		<use :class="token.classes" :data-href="token.href" :xlink:href="`#sign-${token.hash}`" />
		<title v-if="showTitle && token.href">{{token.href}}</title>
	</g>
</template>

<script>
	export default {
		name: "sheet-token",


		props: {
			token: Object,
			classes: Object,
			showTitle: Boolean,
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

		&.matched
		{
			use.on
			{
				fill: $token-on-color;
				stroke-width: 0.1;
				stroke: $token-on-color;
			}
		}
	}
</style>
