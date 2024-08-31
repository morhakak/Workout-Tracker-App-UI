import { createApp } from "vue";
import App from "./App.vue";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "./index.css";
import router from "./router";
import "@mdi/font/css/materialdesignicons.css";
import { createPinia } from "pinia";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
});

const pinia = createPinia();

createApp(App).use(vuetify).use(pinia).use(router).mount("#app");
