<template>
	<div class="sheet live" v-resize="onResize">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			:width="600"
			:viewBox="svgViewBox"
		>
			<defs>
				<g v-for="sign of signs" :key="sign.id" :id="`sign-${sign.id}`"
					:transform="sign.def.scale && `scale(${sign.def.scale.x}, ${sign.def.scale.y})`"
				>
					<path v-if="sign.def.type === 'path'" :d="sign.def.d" />
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
					<text v-if="sign.def.type === 'text'" :font-size="sign.def['font-size']">
						<tspan>{{sign.def.text}}</tspan>
					</text>
				</g>
			</defs>
			<g class="page" v-for="(page, i) of content.pages" :key="i">
				<rect class="pad" x="0" y="0" :width="page.width" :height="page.height" />
				<g class="row" v-for="(row, ii) of page.rows" :key="ii">
					<g class="staff" v-for="(staff, iii) of row.staves" :key="iii"
						:transform="`translate(${staff.x}, ${staff.y})`"
					>
						<g class="measure" v-for="(measure, i4) of staff.measures" :key="i4">
							<g class="token" v-for="(token, i5) of measure.tokens" :key="i5"
								:transform="`translate(${token.x}, ${token.y})`"
							>
								<use :class="token.classes" :xlink:href="`#sign-${token.hash}`" />
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>

<script>
	import resize from "vue-resize-directive";



	export default {
		name: "sheet-live",


		directives: {
			resize,
		},


		props: {
			content: Object,
			hashTable: Object,
		},


		data () {
			return {
				size: {
					width: 100,
					height: 100,
				},
			};
		},


		computed: {
			svgViewBox () {
				// TODO:
				return "0 0 60 80";
			},


			signs () {
				if (!this.hashTable)
					return [];

				return Object.entries(this.hashTable).map(([id, def]) => ({id, def}));
			},
		},


		mounted () {
			this.onResize();
		},


		methods: {
			onResize () {
				this.size.width = this.$el.clientWidth;
				this.size.height = this.$el.clientHeight;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.sheet
	{
		white-space: nowrap;
		display: inline-block;

		.page
		{
			.pad
			{
				fill: #f6fffa;
			}
		}
	}
</style>
