<template>
	<div class="source-editor"
		@click="onClick"
	>
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


		methods: {
			highlighter (code) {
				return highlight(code, languages.lilypond);
			},

			onClick () {
				if (!document.activeElement || document.activeElement.tagName !== "TEXTAREA")
					this.$el.querySelector("textarea").focus();
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
	.prism-editor-wrapper pre, .prism-editor-wrapper textarea
	{
		white-space: pre !important;
	}

	.prism-editor-wrapper textarea:focus
	{
		outline: 0;
	}

	.prism-editor__line-numbers
	{
		user-select: none;
	}

	.prism-editor__container
	{
		overflow: unset !important;
		width: 1000% !important;
	}
</style>
