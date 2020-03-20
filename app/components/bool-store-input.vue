<template>
	<span>
		<StoreInput v-show="false" type="number" v-model="numberValue"
			:localKey="localKey"
			:sessionKey="sessionKey"
		/>
		<input type="checkbox" v-model="boolValue" />
	</span>
</template>

<script>
	import StoreInput from "./store-input.vue";



	export default {
		name: "bool-store-input",


		components: {
			StoreInput,
		},


		props: {
			value: Boolean,
			localKey: String,
			sessionKey: String,
		},


		computed: {
			numberValue: {
				get () {
					return this.value ? 1 : 0;
				},


				set (value) {
					this.$emit("input", value !== 0);
				},
			},


			boolValue: {
				get () {
					return this.value;
				},


				set (value) {
					this.$emit("input", value);
				},
			},
		},
	};
</script>
