import { createApp, defineAsyncComponent } from "vue";
import AppVue from "./index.vue";

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
