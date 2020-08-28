<template>
	<span :class="{connected: remoteFile.connected}">
		<button class="link" :class="{on: remoteFile.connected}" @click="onLink" :disabled="!host || !filePath">&#x1f517;</button>
		<input class="file-path" type="text" v-model="filePath" :readonly="filePathReadOnly" />
	</span>
</template>

<script>
	import _ from "lodash";
	import {RemoteFile} from "@k-l-lambda/web-editor";



	export default {
		props: {
			host: String,
			filePath: String,
			content: String,
			filePathReadOnly: Boolean,
		},


		data () {
			return {
				remoteFile: new RemoteFile(),
				loading: false,
			};
		},


		created () {
			this.remoteFile.on("sync", ({timestamp}) => {
				this.$emit("update:content", this.remoteFile.content);
				this.$nextTick(() => this.loading = false);

				console.debug("remote file synchronized:", new Date(timestamp));
			});


			this.remoteFile.on("connected", () => this.$emit("update:connected", true));
			this.remoteFile.on("disconnected", () => {
				this.loading = false;

				this.$emit("update:connected", false);
			});
		},


		methods: {
			onLink () {
				if (this.remoteFile.connected)
					this.disconnect();
				else
					this.connect();
			},


			connect () {
				this.loading = true;
				this.remoteFile.connect(this.host, this.filePath);
			},


			disconnect () {
				this.remoteFile.close();
			},
		},


		watch: {
			content: _.debounce(function (value) {
				if (this.remoteFile.connected && value !== this.remoteFile.content)
					this.remoteFile.content = value;
			}, 1e+3),


			loading (value) {
				this.$emit("update:loading", value);
			},
		},
	};
</script>
