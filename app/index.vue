<template>
	<body
		:class="{'drag-hover': dragHover}"
		@dragover.prevent="dragHover = true"
		@dragleave="dragHover = false"
		@drop.prevent="onDropFile"
	>
		<main>

		</main>
	</body>
</template>

<script>
	import "./utils.js";



	export default {
		name: "lotus",


		data () {
			return {
				dragHover: false,
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
						const content = await file.readAs("Text");
						console.log("content:", content);

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
	}

	body
	{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		overflow: hidden;

		& > main
		{
			width: 100%;
			height: 100%;
		}
	}
</style>
