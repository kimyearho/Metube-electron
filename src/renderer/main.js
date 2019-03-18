import Vue from "vue";
import App from "./App";
import router from "./plugins/router";
import store from "./plugins/store";
import i18n from "./plugins/lang";
import "expose-loader?$!jquery";
import "electron-disable-file-drop";
import "./plugins/pouchdb";

/* topHeader */
import topHeader from "./components/Commons/Header/Header";

import GlobalEventHandler from "./components/PlayerBar/GlobalEventHandler";

/* vue-modal */
import VModal from "vue-js-modal";

/* vue-scroll */
import VueScrollTo from "vue-scrollto";

/* axios */
import axios from "./plugins/http/axios";

/* jsonp  */
import axiosp from "./plugins/http/axiosp";

/* moment */
import moment from "moment";

/* lodash */
import lodash from "lodash";

/* VueClipboard */
import VueClipboard from "vue-clipboard2";

/* mousetrap */
import mousetrap from "mousetrap";

import { ipcRenderer } from "electron";

/* ElementUI */
import {
  Dialog,
  Dropdown,
  DropdownMenu,
  Autocomplete,
  DropdownItem,
  Input,
  Select,
  Option,
  Button,
  Form,
  FormItem,
  Row,
  Col,
  Card,
  Carousel,
  CarouselItem,
  Loading,
  Message
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// Vue Material
import {
  MdButton,
  MdList,
  MdImage,
  MdTabs,
  MdAvatar,
  MdBadge,
  MdSpeedDial,
  MdDrawer,
  MdToolbar,
  MdIcon,
  MdSwitch
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";

import "./assets/css/default.css";
import "./assets/css/zaudio-1.css";
import "./assets/css/commons.css";
import "./assets/css/playlist.css";
import "./assets/css/collection.css";
import "./assets/css/search.css";
import "./assets/css/autocomplete.css";

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.config.productionTip = false;

import VueAnalytics from "vue-analytics";
Vue.use(VueAnalytics, {
  id: "UA-128591940-1",
  autoTracking: {
    pageviewOnLoad: false
  },
  batch: {
    enabled: true, // enable/disable
    amount: 1, // amount of events fired
    delay: 5000 // delay in milliseconds
  },
});

/* global component */
Vue.component("global-event-handler", GlobalEventHandler);
Vue.component("top-header", topHeader);

/* side lib */
Vue.use(VModal, { dialog: true });
Vue.use(VueScrollTo);
Vue.use(VueClipboard);

/* vue element-ui  */
Vue.use(Autocomplete);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Loading);

/* vue material  */
Vue.use(MdAvatar);
Vue.use(MdButton);
Vue.use(MdBadge);
Vue.use(MdDrawer);
Vue.use(MdList);
Vue.use(MdImage);
Vue.use(MdIcon);
Vue.use(MdTabs);
Vue.use(MdToolbar);
Vue.use(MdSpeedDial);
Vue.use(MdSwitch);

/* vue prototype */
Vue.prototype.$http = axios;
Vue.prototype.$jsonp = axiosp;
Vue.prototype.$moment = moment;
Vue.prototype.$lodash = lodash;
Vue.prototype.$trap = mousetrap;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$version = require("../../package.json").version;
Vue.prototype.$locale = require("electron").remote.app.getLocale();
Vue.prototype.$ipcRenderer = ipcRenderer;
Vue.prototype.$eventBus = new Vue();

const osLocale = i18n.locale;

/* eslint-disable no-new */
const vm = new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: "<App/>"
}).$mount("#app");

vm.$store.commit("setLocale", osLocale);
