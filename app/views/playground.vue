<template>
	<div class="playground"
		:class="{'drag-hover': dragHover}"
		:data-hover-type="dragHover"
		@dragover.prevent="onDragOver"
		@dragleave="dragHover = null"
		@drop.prevent="onDropFile"
	>
		<header>
			<button @click="engrave">Engrave</button>
		</header>
		<main>
			<SourceEditor :source.sync="lilySource" :disabled="converting" />
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
				converting: false,
				engraving: false,
			};
		},


		created () {
			window.$main = this;
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
						//console.log("xml:", xml);
						this.lilySource = await this.musicxml2ly(xml);

						break;
					}
				}
			},


			async musicxml2ly (xml) {
				this.converting = true;

				const body = new FormData();
				body.append("xml", xml);

				const response = await fetch("/musicxml2ly", {
					method: "POST",
					body,
				});
				if (!response.ok)
					console.warn("musicxml2ly failed:", await response.text());
				else  {
					const result = await response.text();
					console.log("musicxml2ly accomplished.");

					this.converting = false;

					return result;
				}

				this.converting = false;
			},


			async engrave () {
				this.engraving = true;

				const body = new FormData();
				body.append("source", this.lilySource);

				const response = await fetch("/engrave", {
					method: "POST",
					body,
				});
				if (!response.ok)
					console.warn("engrave failed:", await response.text());
				else  {
					const result = await response.text();
					console.log("engrave accomplished.");

					this.engraving = false;

					return result;
				}

				this.engraving = false;
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
		display: flex;
		flex-direction: column;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;

		& > main
		{
			flex-grow: 1;
			position: relative;
			width: 100%;

			.source-editor
			{
				height: 100%;
			}
		}
	}
</style>
