<template>
	<svg class="sheet-signs"
		xmlns="http://www.w3.org/2000/svg"
	>
		<defs>
			<g class="sign" v-for="sign of signs" :key="sign.id" :id="`sign-${sign.id}`"
				:transform="sign.def.scale && `scale(${sign.def.scale.x}, ${sign.def.scale.y})`"
			>
				<path v-if="sign.def.type === 'path'" :d="sign.def.d" :stroke-width="sign.def['stroke-width']" />
				<rect v-if="sign.def.type === 'rect'"
					x="0" y="0"
					:width="sign.def.width"
					:height="sign.def.height"
				/>
				<line v-if="sign.def.type === 'line'"
					x1="0" y1="0"
					:x2="sign.def.width"
					:y2="sign.def.height"
					:stroke-width="sign.def['stroke-width']"
					:stroke-dasharray="sign.def['stroke-dasharray']"
				/>
				<polygon v-if="sign.def.type === 'polygon'"
					:points="sign.def.points"
					:stroke-width="sign.def['stroke-width']"
				/>
				<text v-if="sign.def.type === 'text'"
					:font-size="sign.def['font-size']"
					:font-weight="sign.def['font-weight']"
					:font-style="sign.def['font-style']"
					:text-anchor="sign.def['text-anchor']"
					:fill="sign.def.color"
				>
					<tspan>{{sign.def.text}}</tspan>
				</text>
			</g>
		</defs>
	</svg>
</template>

<script>
	export default {
		name: "sheet-signs",


		props: {
			hashTable: Object,
		},


		computed: {
			signs () {
				if (!this.hashTable)
					return [];

				return Object.entries(this.hashTable).map(([id, def]) => ({id, def}));
			},
		},
	};
</script>

<style lang="scss" scoped>
	.sign 
	{
		line, polygon
		{
			stroke: inherit;
		}

		polygon, rect
		{
			fill: inherit;
		}

		path
		{
			stroke: inherit;
			fill: inherit;
		}
	}
</style>
