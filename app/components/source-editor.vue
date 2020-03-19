<template>
	<div class="source-editor">
		<textarea v-model="editText" cols="70"></textarea>
	</div>
</template>

<script>
	export default {
		name: "source-editor",


		props: {
			source: String,
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
	textarea
	{
		resize: horizontal;
		height: 100%;
	}
</style>
