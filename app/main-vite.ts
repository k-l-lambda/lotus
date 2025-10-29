import { createApp, defineAsyncComponent } from "vue";
import { configureCompat } from "@vue/compat";
import AppVue from "./index.vue";

// Configure Vue compat mode to suppress GLOBAL_EXTEND warnings from third-party libraries
configureCompat({
	GLOBAL_EXTEND: "suppress-warning",
});

// Register async views similarly to Vue 2 dynamic components
const components = [
	"playground",
	"profiler",
	"flex-engraver",
];

const app = createApp(AppVue as any);

components.forEach(name => {
	app.component(name, defineAsyncComponent(() => import(`./views/${name}.vue`)));
});

app.mount("#app");
