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
	@import "../styles/sheetConstants.css";


	.token
	{
		.staff-line, .line, .slur
		{
			stroke: var(--lotus-token-default-color);
		}

		use
		{
			fill: var(--lotus-token-default-color);
			//stroke-width: 0;
		}

		&.matched
		{
			use.on
			{
				fill: var(--lotus-token-on-color);
				stroke-width: 0.1;
				stroke: var(--lotus-token-on-color);
			}
		}
	}
</style>
