<template>
	<div class="source-editor">
		<textarea v-model="editText" cols="80" autocorrect="off" spellcheck="false" :disabled="disabled"></textarea>
	</div>
</template>

<script>
	export default {
		name: "source-editor",


		props: {
			source: String,
			disabled: Boolean,
		},


		data () {
			return {
				editText: this.source,
			};
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

<style scoped>
	.source-editor
	{
		display: inline-block;
	}

	textarea
	{
		resize: horizontal;
		height: 100%;
		background-color: transparent;
	}
</style>
