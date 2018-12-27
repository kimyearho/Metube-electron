import Vue from "vue";
import App from "./App";
import router from "./plugins/router";
import store from "./plugins/store";
import i18n from "./plugins/lang";
import "expose-loader?$!jquery";
import "electron-disable-file-drop";
import "./plugins/pouchdb";
import "./plugins/ipc";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* topHeader */
import topHeader from "./components/Header/Header";

/* vue-toggle */
import ToggleButton from "vue-js-toggle-button";

/* vue-modal */
import VModal from "vue-js-modal";

/* vue-scroll */
import VueScrollTo from "vue-scrollto";

/* ElementUI */
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

/* axios or jsonp */
import axios from "./plugins/http";

/* moment */
import moment from "moment";

/* lodash */
import lodash from "lodash";

/* VueClipboard */
import VueClipboard from "vue-clipboard2";

/* mousetrap */
import mousetrap from "mousetrap";

library.add(fas);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("top-header", topHeader);
Vue.use(ToggleButton);
Vue.use(VModal, { dialog: true });
Vue.use(VueScrollTo);
Vue.use(ElementUI);
Vue.use(VueClipboard);
Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;
Vue.prototype.$lodash = lodash;

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.config.productionTip = false;

Vue.prototype.$version = require("electron").remote.app.getVersion();
Vue.prototype.$locale = require("electron").remote.app.getLocale();
Vue.prototype.$trap = mousetrap;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: "<App/>"
}).$mount("#app");
