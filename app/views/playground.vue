<template>
	<div class="playground"
		:class="{'drag-hover': dragHover}"
		@dragover.prevent="dragHover = true"
		@dragleave="dragHover = false"
		@drop.prevent="onDropFile"
	>
		<main>
			<SourceEditor :source="lilySource" />
		</main>
	</div>
</template>

<script>
	import "../utils.js";

	import SourceEditor from "../components/source-editor.vue";



	export default {
		name: "playground",


		components: {
			SourceEditor,
		},


		data () {
			return {
				dragHover: false,
				lilySource: null,
			};
		},


		methods: {
			async onDropFile (event) {
				this.dragHover = false;
				//console.log("onDropFile:", event.dataTransfer.files[0]);

				const file = event.dataTransfer.files[0];
				if (file) {
					switch (file.type) {
					case "text/x-lilypond":
						this.lilySource = await file.readAs("Text");
						//console.log("content:", content);

						break;
					}
				}
			},
		},
	};
</script>

<style lang="scss">
	.drag-hover
	{
		outline: 4px #4f4 dashed;
		background-color: #cfc;

		textarea, input
		{
			background-color: #cfc;
		}
	}

	.playground
	{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;

		& > main
		{
			width: 100%;
			height: 100%;

			.source-editor
			{
				height: 100%;
			}
		}
	}
</style>
