<template>
	<svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" :viewBox="viewBox" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<!-- Save -->
		<g v-if="name === 'save'">
			<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
			<polyline points="17 21 17 13 7 13 7 21"/>
			<polyline points="7 3 7 8 15 8"/>
		</g>

		<!-- Settings -->
		<g v-if="name === 'settings'">
			<circle cx="12" cy="12" r="3"/>
			<path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
		</g>

		<!-- Markup (code braces) -->
		<g v-if="name === 'markup'">
			<path d="M16 18l4-4-4-4M8 6l-4 4 4 4"/>
		</g>

		<!-- Auto engrave (refresh/cycle) -->
		<g v-if="name === 'auto'">
			<polyline points="23 4 23 10 17 10"/>
			<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
		</g>

		<!-- Engrave (music note) -->
		<g v-if="name === 'engrave'">
			<path d="M9 18V5l12-2v13"/>
			<circle cx="6" cy="18" r="3"/>
			<circle cx="18" cy="16" r="3"/>
		</g>

		<!-- Export (download) -->
		<g v-if="name === 'export'">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
			<polyline points="7 10 12 15 17 10"/>
			<line x1="12" y1="15" x2="12" y2="3"/>
		</g>

		<!-- Live staff (piano keys) -->
		<g v-if="name === 'live'">
			<rect x="3" y="3" width="18" height="18" rx="2"/>
			<line x1="9" y1="3" x2="9" y2="12"/>
			<line x1="15" y1="3" x2="15" y2="12"/>
		</g>

		<!-- Chromatic (palette) -->
		<g v-if="name === 'chromatic'">
			<circle cx="13.5" cy="6.5" r=".5"/>
			<circle cx="17.5" cy="10.5" r=".5"/>
			<circle cx="8.5" cy="7.5" r=".5"/>
			<circle cx="6.5" cy="12.5" r=".5"/>
			<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
		</g>

		<!-- MIDI roll (sliders) -->
		<g v-if="name === 'roll'">
			<line x1="4" y1="21" x2="4" y2="14"/>
			<line x1="4" y1="10" x2="4" y2="3"/>
			<line x1="12" y1="21" x2="12" y2="12"/>
			<line x1="12" y1="8" x2="12" y2="3"/>
			<line x1="20" y1="21" x2="20" y2="16"/>
			<line x1="20" y1="12" x2="20" y2="3"/>
			<line x1="1" y1="14" x2="7" y2="14"/>
			<line x1="9" y1="8" x2="15" y2="8"/>
			<line x1="17" y1="16" x2="23" y2="16"/>
		</g>

		<!-- Notations matcher (git compare) -->
		<g v-if="name === 'matcher'">
			<circle cx="18" cy="18" r="3"/>
			<circle cx="6" cy="6" r="3"/>
			<path d="M13 6h3a2 2 0 0 1 2 2v7"/>
			<line x1="6" y1="9" x2="6" y2="21"/>
		</g>

		<!-- MIDI Audio (volume) -->
		<g v-if="name === 'audio'">
			<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
			<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
		</g>

		<!-- Show cursor (playback cursor) -->
		<g v-if="name === 'cursor'">
			<rect x="10.5" y="3" width="3" height="18" rx="1.5"/>
			<path d="M7 3L10.5 6M17 3L13.5 6M7 21L10.5 18M17 21L13.5 18"/>
		</g>

		<!-- Play -->
		<g v-if="name === 'play'">
			<polygon points="5 3 19 12 5 21 5 3"/>
		</g>

		<!-- Pause -->
		<g v-if="name === 'pause'">
			<rect x="6" y="4" width="4" height="16"/>
			<rect x="14" y="4" width="4" height="16"/>
		</g>

		<!-- Music font (type) -->
		<g v-if="name === 'font'">
			<polyline points="4 7 4 4 20 4 20 7"/>
			<line x1="9" y1="20" x2="15" y2="20"/>
			<line x1="12" y1="4" x2="12" y2="20"/>
		</g>

		<!-- Baking (layers) -->
		<g v-if="name === 'baking'">
			<polygon points="12 2 2 7 12 12 22 7 12 2"/>
			<polyline points="2 17 12 22 22 17"/>
			<polyline points="2 12 12 17 22 12"/>
		</g>

		<!-- Hide images (eye-off) -->
		<g v-if="name === 'hide'">
			<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
			<line x1="1" y1="1" x2="23" y2="23"/>
		</g>

		<!-- Pointer (mouse pointer) -->
		<g v-if="name === 'pointer'">
			<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
		</g>

		<!-- Measure layout (grid) -->
		<g v-if="name === 'measure'">
			<rect x="3" y="3" width="18" height="18" rx="2"/>
			<line x1="9" y1="3" x2="9" y2="21"/>
			<line x1="15" y1="3" x2="15" y2="21"/>
			<line x1="3" y1="9" x2="21" y2="9"/>
			<line x1="3" y1="15" x2="21" y2="15"/>
		</g>

		<!-- Inspect (search) -->
		<g v-if="name === 'inspect'">
			<circle cx="11" cy="11" r="8"/>
			<line x1="21" y1="21" x2="16.65" y2="16.65"/>
		</g>

		<!-- Folder -->
		<g v-if="name === 'folder'">
			<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
		</g>
	</svg>
</template>

<script>
	export default {
		name: "Icon",

		props: {
			name: {
				type: String,
				required: true,
			},
			size: {
				type: [Number, String],
				default: 18,
			},
		},

		computed: {
			viewBox () {
				return "0 0 24 24";
			},
		},
	};
</script>

<style scoped>
	svg
	{
		display: inline-block;
		vertical-align: middle;
	}
</style>
