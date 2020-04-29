<template>
	<div class="flex-engraver">
		<header>
			<StoreInput v-show="false" v-model="containerSize.offsetWidth" localKey="lotus-flexEngraverContainerWidth" />
			<StoreInput v-show="false" v-model="containerSize.offsetHeight" localKey="lotus-flexEngraverContainerHeight" />
		</header>
		<main>
			<SourceEditor />
			<div class="viewer">
				<div class="sheet-container" ref="sheetContainer"
					:style="{
						width: `${containerSize.offsetWidth}px`,
						height: `${containerSize.offsetHeight}px`,
					}"
					@mousemove="updateContainerSize"
				>
				</div>
				<div class="container-size">
					<span>{{containerSize.width}}</span>
					&times;
					<span>{{containerSize.height}}</span>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
	import resize from "vue-resize-directive";

	import SourceEditor from "../components/source-editor.vue";
	import StoreInput from "../components/store-input.vue";



	export default {
		name: "flex-engraver",


		directives: {
			resize,
		},


		components: {
			SourceEditor,
			StoreInput,
		},


		data () {
			return {
				containerSize: {
					width: 100,
					height: 100,
					offsetWidth: 1215,
					offsetHeight: 495,
				},
			};
		},


		created () {
			window.$main = this;
		},


		async mounted () {
			await this.$nextTick();
			this.updateContainerSize();
		},


		methods: {
			updateContainerSize ({widthOffset = true} = {}) {
				this.containerSize.width = this.$refs.sheetContainer.clientWidth;
				this.containerSize.height = this.$refs.sheetContainer.clientHeight;
				//console.log("updateContainerSize:", this.containerSize.width, this.containerSize.height);

				if (widthOffset) {
					this.containerSize.offsetWidth = this.$refs.sheetContainer.offsetWidth;
					this.containerSize.offsetHeight = this.$refs.sheetContainer.offsetHeight;
				}
			},
		},
	};
</script>

<style lang="scss">
	$header-height: 200px;


	.flex-engraver
	{
		width: 100%;
		height: 100vh;

		header
		{
			position: absolute;
			width: 100%;
			height: $header-height;
			background: #eee;
		}

		main
		{
			padding-top: $header-height;
			height: 100%;

			.source-editor
			{
				height: calc(100% - #{$header-height});
				vertical-align: top;
			}

			.viewer
			{
				display: inline-block;
				position: relative;

				.sheet-container
				{
					display: inline-block;
					resize: both;
					margin: 2em;
					outline: solid 1px #ccc;
					overflow: scroll;
				}

				.container-size
				{
					display: inline-block;
					position: absolute;
					bottom: 0;
					right: 0;
					transform: translate(-2em, 0);
				}
			}
		}
	}
</style>
