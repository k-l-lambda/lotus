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
			<button @click="renderSheet">&#x1f3bc;</button>
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
					<SheetSimple v-if="containerSvgs" :documents="containerSvgs" />
					<Loading v-show="containerEngraving" />
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
	import {mutexDelay} from "../delay.js";
	import loadLilyParser from "../loadLilyParser.js";
	import {LilyDocument} from "../../inc/lilyParser";
	import {parseRaw} from "../../inc/lilyParser/lilyDocument.ts";
	import {recoverJSON} from "../../inc/jsonRecovery.ts";
	import {StaffToken, SheetDocument} from "../../inc/staffSvg";
	import * as constants from "../../inc/constants.ts";

	import SourceEditor from "../components/source-editor.vue";
	import StoreInput from "../components/store-input.vue";
	import SheetSimple from "../components/sheet-simple.vue";
	import Loading from "../components/loading-dots.vue";



	export default {
		name: "flex-engraver",


		directives: {
			resize,
		},


		components: {
			SourceEditor,
			StoreInput,
			SheetSimple,
			Loading,
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
				staffSizeRange: {
					min: 10,
					max: 40,
				},
				containerSvgs: null,
				containerEngraving: false,
			};
		},


		computed: {
			currentSource () {
				return this.sourceList[this.chosenSourceIndex];
			},


			currentSourceContent () {
				return this.currentSource && this.currentSource.content;
			},


			containerSizeHash () {
				return `${this.containerSize.width},${this.containerSize.height}`;
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
				const TEST_STAFF_SIZE = 20;
				const PAPER_WIDTH = 10000;

				const lilyDocument = new LilyDocument(this.lilyParser.parse(this.currentSourceContent));
				//console.log("lilyDocument:", lilyDocument);

				const globalAttributes = lilyDocument.globalAttributes();
				globalAttributes.staffSize.value = TEST_STAFF_SIZE;
				globalAttributes.paperWidth.value.number = PAPER_WIDTH;
				globalAttributes.paperHeight.value.number = 1000;
				globalAttributes.raggedLast.value = true;
				globalAttributes.topMargin.value = 0;
				globalAttributes.leftMargin.value = 0;

				const source = lilyDocument.toString();
				//console.log("source:", source);

				try {
					const result = await this.engrave(source, {tokenize: true});
					//console.log("gauge:", result);
					console.assert(result.svgs.length === 1, "invalid page count:", result);

					this.gaugeSvgDoc = result.svgs[0];

					const sheetDocument = recoverJSON(result.doc, {StaffToken, SheetDocument});
					const row = sheetDocument.pages[0].rows[0];
					const sizeFactor = (PAPER_WIDTH / sheetDocument.pages[0].viewBox.width) / TEST_STAFF_SIZE;
					const naturalWidth = row.width * sizeFactor;
					const naturalHeight = (row.bottom - row.top) * sizeFactor;
					//console.log("natural size:", naturalWidth, naturalHeight, sheetDocument);

					const newLiy = new LilyDocument(this.lilyParser.parse(this.currentSourceContent));
					//console.log("newLiy:", newLiy);

					const nw = lilyDocument.root.getField("naturalWidth");
					if (nw)
						nw.value = naturalWidth;
					else {
						newLiy.root.sections.push(parseRaw({
							proto: "Assignment",
							key: "naturalWidth",
							value: naturalWidth,
						}));
					}

					const nh = lilyDocument.root.getField("naturalHeight");
					if (nh)
						nh.value = naturalHeight;
					else {
						newLiy.root.sections.push(parseRaw({
							proto: "Assignment",
							key: "naturalHeight",
							value: naturalHeight,
						}));
					}

					//console.log("new doc:", newLiy.toString());
					this.currentSource.content = newLiy.toString();

					this.checkAndSaveSource();
				}
				catch (error) {
					console.warn("Engraving failed:", error);
				}
			},


			async engrave (source, {tokenize} = {}) {
				const body = new FormData();
				body.append("source", source);
				if (tokenize)
					body.append("tokenize", tokenize);

				const response = await fetch("/engrave", {
					method: "POST",
					body,
				});
				if (!response.ok) 
					throw new Error(await response.text());

				return response.json();
			},


			async renderSheet () {
				if (!this.currentSourceContent)
					return;

				const lilyDocument = new LilyDocument(this.lilyParser.parse(this.currentSourceContent));

				const naturalWidth = lilyDocument.root.getField("naturalWidth");
				const naturalHeight = lilyDocument.root.getField("naturalHeight");
				if (!naturalWidth || !naturalHeight) {
					console.log("natural size is not set.", naturalWidth, naturalHeight);
					return;
				}

				const nw = naturalWidth.value;
				const nh = naturalHeight.value;

				const globalAttributes = lilyDocument.globalAttributes();

				const paperWidth = this.containerSize.width / constants.CM_TO_PX;
				const paperHeight = (this.containerSize.height - 4) / constants.CM_TO_PX;

				const getNumberUnitValue = key => globalAttributes[key].value ? globalAttributes[key].value.number : null;

				const marginLeft = getNumberUnitValue("leftMargin") || constants.LILY_HORIZONTAL_MARGIN_DEFAULT;
				const marginRight = getNumberUnitValue("rightMargin") || constants.LILY_HORIZONTAL_MARGIN_DEFAULT;
				const marginTop = getNumberUnitValue("topMargin") || constants.LILY_TOP_MARGIN_DEFAULT;
				const marginBottom = getNumberUnitValue("bottomMargin") || constants.LILY_BOTTOM_MARGIN_DEFAULT;

				const innerHeight = paperHeight - marginTop - marginBottom;
				const innerWidth = paperWidth - marginLeft - marginRight;

				let systemCount = 1;
				let staffSize = null;

				for (; systemCount < 1e+3; ++systemCount) {
					const currentStaffSize = innerHeight / (nh * systemCount);
					if (currentStaffSize < this.staffSizeRange.min) {
						if (!Number.isFinite(staffSize))
							staffSize = currentStaffSize;

						break;
					}

					staffSize = currentStaffSize;

					// compute system count by horizontal splitting
					const xsc = (nw - constants.STAFF_HEAD_DEDUCTION) * staffSize / (innerWidth - constants.STAFF_HEAD_DEDUCTION * staffSize);
					if (xsc < 0) {
						console.warn("Horizontal space too little:", xsc, innerWidth - constants.STAFF_HEAD_DEDUCTION * staffSize);
						return;
					}

					if (xsc <= systemCount + 0.4) {
						staffSize = Math.min(staffSize, this.staffSizeRange.max);
						console.log("systemCount:", systemCount, xsc);
						break;
					}

					console.log("systemCount iteration:", systemCount, staffSize, xsc);
				}

				if (staffSize <= this.staffSizeRange.min) {
					console.warn("Vertical space too little:", staffSize);
					return;
				}

				globalAttributes.staffSize.value = staffSize;
				globalAttributes.paperWidth.value = parseRaw({proto: "NumberUnit", number: paperWidth, unit: "\\cm"});
				globalAttributes.paperHeight.value = parseRaw({proto: "NumberUnit", number: paperHeight, unit: "\\cm"});
				globalAttributes.raggedLast.value = false;

				const adjustedSource = lilyDocument.toString();
				//console.log("adjustedSource:", adjustedSource);

				this.containerEngraving = true;

				const result = await this.engrave(adjustedSource, {tokenize: false});
				this.containerSvgs = result.svgs;

				// remove lilypond band
				this.containerSvgs = this.containerSvgs.map(svg => svg.replace(/(?:>)[^<>]+lilypond.org(?=<)/g, ""));

				this.containerEngraving = false;
			},


			async delayRenderSheet () {
				if(await mutexDelay("renderSheet", 500))
					this.renderSheet();
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


			containerSizeHash: "delayRenderSheet",
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

					.sheet
					{
						.page
						{
							margin: 0;
						}
					}

					.loading-dots
					{
						background-color: transparent;

						.ellipsis
						{
							zoom: 200%;

							&  > div
							{
								background-color: steelblue;
							}
						}
					}
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