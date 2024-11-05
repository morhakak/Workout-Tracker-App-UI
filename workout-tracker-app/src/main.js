import { createApp } from "vue";
import App from "./App.vue";
import { pinia } from "../src/plugins/pinia";
import { vuetify } from "../src/plugins/vuetify";
import "./index.css";
import router from "./router";

const app = createApp(App);

app.use(vuetify).use(pinia).use(router).mount("#app");
