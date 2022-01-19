import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import "./index.css";

createApp(App).use(router).use(mavonEditor).mount("#app");
