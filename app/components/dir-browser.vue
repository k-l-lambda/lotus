<template>
	<div class="dir-browser" v-show="shown"
		@mouseenter="hover = true"
		@mouseleave="hover = false"
	>
		<iframe ref="frame" :src="homeURL"
			@load="onFrameLoad"
		/>
		<div class="controls">
			<button @click="$refs.frame.contentWindow.location.href = homeURL">{{"\ud83c\udfe0"}}</button>
			<button @click="$refs.frame.contentWindow.history.back()">&#x21e6;</button>
		</div>
	</div>
</template>

<script>
	import debounce from "lodash/debounce";



	export default {
		name: "dir-browser",


		props: {
			homeURL: String,
			shown: Boolean,
			handlePattern: RegExp,
			autoHide: Boolean,
		},


		data () {
			return {
				href: this.homeURL,
				hover: false,
			};
		},


		methods: {
			onFrameLoad () {
				this.href = this.$refs.frame.contentWindow.location.href;
			},


			hide () {
				this.$emit("update:shown", false);
			},


			reload () {
				this.$refs.frame.contentWindow.location.reload();
			},
		},


		watch: {
			href () {
				if (this.handlePattern && this.handlePattern.test(this.href)) {
					this.$refs.frame.contentWindow.history.back();

					this.hide();

					const pos = Math.max(this.href.indexOf(this.homeURL), 0);
					const filePath = decodeURI(this.href.substr(pos + this.homeURL.length));
					this.$emit("pickFile", filePath);
				}
			},


			hover (value) {
				if (!value && this.autoHide) {
					debounce(() => {
						if (!this.hover)
							this.hide();
					}, 1e+3)();
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	iframe
	{
		width: 100%;
		height: 100%;
	}

	.controls
	{
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
