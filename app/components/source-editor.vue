<template>
	<div class="source-editor"
		@click="onClick"
	>
		<div class="editor-with-lines">
			<div ref="lineNumbers" class="line-numbers"></div>
			<div ref="editorContainer" class="code-editor-wrapper" @scroll="syncScroll"></div>
		</div>
	</div>
</template>

<script>
	import "prismjs/themes/prism-solarizedlight.css";

	import { highlight, languages } from "prismjs";
	import "prismjs/components/prism-lilypond";
	import { CodeJar } from "codejar";



	export default {
		name: "source-editor",


		props: {
			source: String,
			disabled: Boolean,
		},


		data () {
			return {
				jar: null,
				isUpdatingFromProp: false,
			};
		},


		mounted () {
			this.initializeEditor();
		},


		beforeUnmount () {
			if (this.jar) {
				this.jar.destroy();
				this.jar = null;
			}
		},


		methods: {
			highlighter (editor) {
				const code = editor.textContent;
				editor.innerHTML = highlight(code, languages.lilypond, "lilypond");

				// Update line numbers after highlighting
				this.$nextTick(() => {
					this.updateLineNumbers();
				});
			},


			updateLineNumbers () {
				const container = this.$refs.editorContainer;
				const lineNumbersEl = this.$refs.lineNumbers;
				if (!container || !lineNumbersEl) return;

				const code = container.textContent || "";
				const lines = code.split("\n");
				const lineCount = lines.length;

				// Generate line numbers
				const lineNumbersHTML = Array.from({ length: lineCount }, (_, i) =>
					`<span class="line-number">${i + 1}</span>`
				).join("");

				lineNumbersEl.innerHTML = lineNumbersHTML;
			},


			syncScroll () {
				const container = this.$refs.editorContainer;
				const lineNumbersEl = this.$refs.lineNumbers;
				if (lineNumbersEl && container) {
					lineNumbersEl.scrollTop = container.scrollTop;
				}
			},


			initializeEditor () {
				const container = this.$refs.editorContainer;

				this.jar = CodeJar(container, this.highlighter, {
					tab: "\t",
					indentOn: /[{([]$/,
				});

				// Set initial value
				if (this.source) {
					this.jar.updateCode(this.source);
				}

				// Initial line numbers
				this.updateLineNumbers();

				// Listen to changes
				this.jar.onUpdate(code => {
					this.updateLineNumbers();
					if (!this.isUpdatingFromProp && this.source !== code) {
						this.$emit("update:source", code);
					}
				});

				// Handle readonly state
				if (this.disabled) {
					container.setAttribute("contenteditable", "false");
				}
			},


			onClick () {
				if (this.$refs.editorContainer && !this.disabled)
					this.$refs.editorContainer.focus();
			},
		},


		watch: {
			source (value) {
				if (this.jar && this.jar.toString() !== value) {
					this.isUpdatingFromProp = true;
					this.jar.updateCode(value || "");
					this.$nextTick(() => {
						this.isUpdatingFromProp = false;
					});
				}
			},


			disabled (value) {
				if (this.$refs.editorContainer) {
					this.$refs.editorContainer.setAttribute("contenteditable", value ? "false" : "true");
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.source-editor
	{
		display: inline-block;
	}

	.editor-with-lines
	{
		display: flex;
		flex-direction: row;
		height: 100%;
		background-color: #f4f2f0;
		border-radius: 4px;
	}

	.line-numbers
	{
		background-color: #ebe8e6;
		color: #999;
		padding: 10px 8px;
		text-align: right;
		font-family: monospace;
		font-size: 16px;
		line-height: 19px;
		overflow: hidden;
		user-select: none;
		border-right: 1px solid #ddd;
	}

	.code-editor-wrapper
	{
		background-color: #f4f2f0;
		resize: horizontal;
		width: 50em;
		height: 100%;
		font-family: monospace;
		font-size: 16px;
		line-height: 19px;
		overflow: auto;
		padding: 10px;
		flex: 1;

		&:focus
		{
			outline: 2px solid #4a9eff;
		}
	}
</style>

<style>
	.code-editor-wrapper pre,
	.code-editor-wrapper code
	{
		white-space: pre !important;
		font-family: monospace;
		margin: 0;
		padding: 0;
	}

	.line-numbers .line-number
	{
		display: block;
		height: 19px;
		line-height: 19px;
	}
</style>
