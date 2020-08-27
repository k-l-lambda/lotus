<template>
	<span>
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
			};
		},


		created () {
			this.remoteFile.on("sync", ({timestamp}) => {
				this.$emit("update:content", this.remoteFile.content);

				console.debug("remote file synchronized:", new Date(timestamp));
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
				this.remoteFile.connect(this.host, this.filePath);
			},


			disconnect () {
				this.remoteFile.close();
			},
		},


		watch: {
			content: _.debounce(function (value) {
				if (value !== this.remoteFile.content)
					this.remoteFile.content = value;
			}, 1e+3),
		},
	};
</script>
