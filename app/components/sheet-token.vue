<template>
	<g class="token"
		:transform="`translate(${token.x}, ${token.y})`"
		:class="{on: token.on, matched, dismatched}"
	>
		<use :class="token.classes" :xlink:href="`#sign-${token.hash}`" />
	</g>
</template>

<script>
	export default {
		name: "sheet-token",


		props: {
			token: Object,
			matchedIds: Set,
		},


		computed: {
			isNotehead () {
				return this.token && this.token.is("NOTEHEAD");
			},


			matched () {
				return this.isNotehead && this.matchedIds && this.matchedIds.has(this.token.href);
			},


			dismatched () {
				return this.isNotehead && this.matchedIds && !this.matchedIds.has(this.token.href);
			},
		},
	};
</script>

<style lang="scss" scoped>
	$default-color: black;
	$on-color: #0af;


	.token
	{
		.staff-line, .line
		{
			stroke: $default-color;
		}

		use
		{
			fill: $default-color;
			stroke-width: 0;
		}

		&.on use
		{
			fill: $on-color;
			stroke-width: 0.1;
			stroke: $on-color;
		}
	}
</style>
