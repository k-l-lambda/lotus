<template>
	<button :class="`check-button ${classes} ${value ? 'on' : 'off'}`" v-html="content" @click="onClick"></button>
</template>

<script>

	export default {
		name: "check-button",


		props: {
			value: Boolean,
			classes: {
				type: String,
				default: "",
			},
			content: String,
		},


		methods: {
			onClick () {
				this.$emit("input", !this.value);
			},
		},
	};

</script>

<style scoped>
	.check-button
	{
		cursor: pointer;
	}
</style>
