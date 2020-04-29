<template>
	<div class="flex-engraver"
		:class="{'drag-hover': dragHover}"
		@dragover.prevent="dragHover = true"
		@dragleave="dragHover = false"
		@drop.prevent="onDropFile"
	>
		<header>
			<StoreInput v-show="false" v-model="containerSize.offsetWidth" localKey="lotus-flexEngraverContainerWidth" />
			<StoreInput v-show="false" v-model="containerSize.offsetHeight" localKey="lotus-flexEngraverContainerHeight" />
			<StoreInput v-show="false" v-model="chosenSourceIndex" localKey="lotus-flexEngraverChosenSourceIndex" />
			<select class="source-list" v-model="chosenSourceIndex">
				<option v-for="(source, i) of sourceList" :key="i" :value="i">{{source.name}}</option>
			</select>
			<span class="dirty" @click="saveSource">{{sourceDirty ? "*" : " "}}</span>
			<button @click="removeCurrentSource">&#x1f5d1;</button>
			<button @click="gauge">&#x1f4cf;</button>
			<div class="gauge-view" v-if="gaugeSvgDoc">
				<SheetSimple v-if="gaugeSvgDoc" :documents="[gaugeSvgDoc]" />
			</div>
		</header>
		<main>
			<SourceEditor :source.sync="currentSource && currentSource.content" />
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

	import "../utils.js";
	import loadLilyParser from "../loadLilyParser.js";
	import {LilyDocument} from "../../inc/lilyParser";

	import SourceEditor from "../components/source-editor.vue";
	import StoreInput from "../components/store-input.vue";
	import SheetSimple from "../components/sheet-simple.vue";



	export default {
		name: "flex-engraver",


		directives: {
			resize,
		},


		components: {
			SourceEditor,
			StoreInput,
			SheetSimple,
		},


		data () {
			return {
				containerSize: {
					width: 100,
					height: 100,
					offsetWidth: 1215,
					offsetHeight: 495,
				},
				dragHover: false,
				sourceList: [],
				chosenSourceIndex: 0,
				sourceDirty: false,
				gaugeSvgDoc: null,
			};
		},


		computed: {
			currentSource () {
				return this.sourceList[this.chosenSourceIndex];
			},


			currentSourceContent () {
				return this.currentSource && this.currentSource.content;
			},
		},


		async created () {
			window.$main = this;

			this.loadSource();

			this.lilyParser = await loadLilyParser();
			console.log("Lilypond parser loaded.");
		},


		async mounted () {
			await this.$nextTick();
			this.updateContainerSize();
		},


		beforeDestroy () {
			this.checkAndSaveSource();
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


			async onDropFile (event) {
				this.dragHover = false;

				const file = event.dataTransfer.files[0];
				if (file) {
					switch (file.type) {
					case "text/x-lilypond":
						const content = await file.readAs("Text");
						//console.log("content:", file, content);
						const name = file.name.replace(/\.ly$/, "");

						this.sourceList.push({
							name,
							content,
						});
						this.sourceDirty = true;

						break;
					}
				}
			},


			removeCurrentSource () {
				this.sourceList.splice(this.chosenSourceIndex, 1);
				this.chosenSourceIndex = Math.min(this.chosenSourceIndex, this.sourceList.length - 1);
			},


			loadSource () {
				if (localStorage.lotusFlexEngraverSources) {
					this.sourceList = JSON.parse(localStorage.lotusFlexEngraverSources);
					console.log("Source list loaded.");
				}

				this.sourceDirty = false;
			},


			saveSource () {
				localStorage.lotusFlexEngraverSources = JSON.stringify(this.sourceList);
				console.log("Source list saved.");

				this.sourceDirty = false;
			},


			checkAndSaveSource () {
				if (this.sourceDirty)
					this.saveSource();
			},


			async gauge () {
				const lilyDocument = new LilyDocument(this.lilyParser.parse(this.currentSourceContent));
				//console.log("lilyDocument:", lilyDocument);

				const globalAttributes = lilyDocument.globalAttributes();
				globalAttributes.staffSize.value = 20;
				globalAttributes.paperWidth.value.number = 10000;
				globalAttributes.paperHeight.value.number = 1000;
				globalAttributes.raggedLast.value = true;
				globalAttributes.topMargin.value = 0;
				globalAttributes.leftMargin.value = 0;

				const source = lilyDocument.toString();
				//console.log("source:", source);

				try {
					const result = await this.engrave(source);
					//console.log("gauge:", result);
					console.assert(result.svgs.length === 1, "invalid page count:", result);

					this.gaugeSvgDoc = result.svgs[0];
				}
				catch (error) {
					console.warn("Engraving failed:", error);
				}
			},


			async engrave (source) {
				const body = new FormData();
				body.append("source", source);

				const response = await fetch("/engrave", {
					method: "POST",
					body,
				});
				if (!response.ok) 
					throw new Error(await response.text());

				return response.json();
			},
		},


		watch: {
			currentSourceContent (value, oldValue) {
				//console.log("oldValue:", oldValue);
				if (value && oldValue !== undefined)
					this.sourceDirty = true;
			},


			async chosenSourceIndex () {
				this.gaugeSvgDoc = null;
				this.checkAndSaveSource();

				await this.$nextTick();
				this.sourceDirty = false;
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
			background: #fafafa;
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: 36px;
			overflow: hidden;

			& > *
			{
				display: inline-block;
				font-size: inherit;
				margin: 0 .5em;
			}

			.source-list
			{
				min-width: 8em;
			}

			.gauge-view
			{
				height: 100%;
			}

			.dirty
			{
				font-weight: bold;
				color: orange;
				cursor: pointer;
			}
		}

		main
		{
			padding-top: $header-height;
			height: 100%;
			background: #eee;

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
					background: white;
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

		&.drag-hover
		{
			header
			{
				background-color: #cfc;
				outline: 4px #4f4 dashed;
			}
		}
	}
</style>
