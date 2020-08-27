<template>
	<div class="source-editor">
		<PrismEditor v-model="editText"
			:lineNumbers="true"
			:highlight="highlighter"
			:readonly="disabled"
			:tabSize="4"
		/>
	</div>
</template>

<script>
	import "vue-prism-editor/dist/prismeditor.min.css";
	import "prismjs/themes/prism-solarizedlight.css";

	import {highlight, languages} from "prismjs";
	import "prismjs/components/prism-lilypond";

	import {PrismEditor} from "vue-prism-editor";



	export default {
		name: "source-editor",


		props: {
			source: String,
			disabled: Boolean,
		},


		components: {
			PrismEditor,
		},


		data () {
			return {
				editText: this.source,
			};
		},


		/*created () {
			console.log("languages:", languages);
		},*/


		methods: {
			highlighter (code) {
				return highlight(code, languages.lilypond);
			},
		},


		watch: {
			editText (value) {
				if (this.source !== value)
					this.$emit("update:source", value);
			},


			source (value) {
				this.editText = value;
			},
		},
	};
</script>

<style lang="scss"scoped>
	.source-editor
	{
		display: inline-block;
	}

	.prism-editor-wrapper
	{
		background-color: #f4f2f0;
		resize: horizontal;
		width: 50em;
		height: 100%;
		//background-color: transparent;
		font-family: monospace;
		font-size: 16px;
		overflow: auto;
	}
</style>

<style>
	/*.prism-editor-wrapper code {
		font-family: inherit;
		line-height: inherit;
	}

	.prism-editor-wrapper {
		width: 50em;
		height: 100%;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: start;
		-ms-flex-align: start;
		align-items: flex-start;
		overflow: auto;
		-o-tab-size: 1.5em;
		tab-size: 1.5em;
		-moz-tab-size: 1.5em;
	}

	.prism-editor__line-numbers {
		height: 100%;
		overflow: hidden;
		-ms-flex-negative: 0;
		flex-shrink: 0;
		padding-top: 4px;
		margin-top: 0;
	}

	.prism-editor__line-number {
		text-align: right;
		white-space: nowrap;
	}

	.prism-editor__code {
		margin-top: 0!important;
		margin-bottom: 0!important;
		-webkit-box-flex: 2;
		-ms-flex-positive: 2;
		flex-grow: 2;
		min-height: 100%;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		-o-tab-size: 4;
		tab-size: 4;
		-moz-tab-size: 4;
		outline: none;
	}

	pre.prism-editor__code:focus {
		outline: none;
	}*/

	.prism-editor-wrapper pre, .prism-editor-wrapper textarea
	{
		white-space: pre !important;
	}

	.prism-editor-wrapper textarea:focus
	{
		outline: 0;
	}
</style>
