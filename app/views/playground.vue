<template>
	<div class="playground"
		:class="{'drag-hover': dragHover}"
		:data-hover-type="dragHover"
		@dragover.prevent="onDragOver"
		@dragleave="dragHover = null"
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
				dragHover: null,
				lilySource: null,
			};
		},


		methods: {
			onDragOver (event) {
				const item = event.dataTransfer.items[0];
				if (item)
					this.dragHover = item.type;
			},


			async onDropFile (event) {
				this.dragHover = null;
				//console.log("onDropFile:", event.dataTransfer.files[0]);

				const file = event.dataTransfer.files[0];
				if (file) {
					switch (file.type) {
					case "text/x-lilypond":
						this.lilySource = await file.readAs("Text");
						//console.log("content:", content);

						break;
					case "text/xml":
						const xml = await file.readAs("Text");
						console.log("xml:", xml);

						// TODO: translate xml to ly

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

		&[data-hover-type="text/x-lilypond"]
		{
			background-color: #cfc;
		}

		&[data-hover-type="text/xml"]
		{
			background-color: #ffc;
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
