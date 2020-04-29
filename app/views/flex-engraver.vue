<template>
	<div class="flex-engraver">
		<header>

		</header>
		<main>

		</main>
	</div>
</template>

<script>
	export default {
		name: "flex-engraver",
	};
</script>

<style lang="scss">
	$header-height: 120px;


	.flex-engraver
	{
		width: 100%;
		height: 100vh;

		header
		{
			position: absolute;
			width: 100%;
			height: $header-height;
			background: #eee;
		}

		main
		{
			padding-top: $header-height;
			height: 100%;
		}
	}
</style>
