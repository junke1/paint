import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./design/utils/font.js";

//加载vuex
import store from "./store";

//支持fabricjs
import { fabric } from "fabric-with-erasing";
// import {fabric-brush} from "fabric-brush";

//加载js
Vue.use(fabric);
Vue.use(ElementUI);
// Vue.use(fabric-brush)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
