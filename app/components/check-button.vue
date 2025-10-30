<template>
	<button :class="`check-button ${classes} ${value ? 'on' : 'off'}`" @click="onClick">
		<Icon v-if="icon" :name="icon" />
		<span v-else v-html="content"></span>
	</button>
</template>

<script>
	import Icon from "./icon.vue";

	export default {
		name: "check-button",

		components: {
			Icon,
		},

		props: {
			value: Boolean,
			classes: {
				type: String,
				default: "",
			},
			content: String,
			icon: String,
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
		transition: all 0.2s;
	}

	.check-button.off
	{
		background: white;
		color: #586069;
	}

	.check-button.off:hover:not(:disabled)
	{
		background: #f6f8fa;
		color: #24292e;
	}

	.check-button.on
	{
		background: #0969da;
		color: white;
		border-color: #0860ca;
	}

	.check-button.on:hover:not(:disabled)
	{
		background: #0860ca;
		border-color: #0757ba;
	}

	.check-button.on:active:not(:disabled)
	{
		background: #0757ba;
	}
</style>
