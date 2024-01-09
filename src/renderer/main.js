import Vue from "vue";
import App from "./App";
import router from "./plugins/router";
import store from "./plugins/store";
import i18n from "./plugins/lang";
import "expose-loader?$!jquery";
import "electron-disable-file-drop";

/* topHeader */
import topHeader from "./components/Commons/Header/Header";

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

import PouchDB from "./plugins/pouchdb";

import Storage from 'vue-web-storage';
Vue.use(Storage, {
  drivers: ['session'], // default 'local'
});

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
  Collapse,
  CollapseItem,
  Card,
  Carousel,
  CarouselItem,
  Loading,
  Message,
  Popover
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// Vue Material
import {
  MdButton,
  MdBottomBar,
  MdCard,
  MdChips,
  MdList,
  MdImage,
  MdTabs,
  MdAvatar,
  MdBadge,
  MdSpeedDial,
  MdDrawer,
  MdToolbar,
  MdIcon,
  MdSwitch,
  MdProgress
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";

import "./assets/css/default.css";
import "./assets/css/zaudio-1.css";
import "./assets/css/commons.css";
import "./assets/css/playlist.css";
import "./assets/css/collection.css";
import "./assets/css/search.css";

import "./assets/css/message.css";
import "./assets/css/collapse.css";

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.config.productionTip = false;

/* global component */
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
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Card);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Loading);
Vue.use(Popover)

/* vue material  */
Vue.use(MdAvatar);
Vue.use(MdButton);
Vue.use(MdBadge);
Vue.use(MdBottomBar)
Vue.use(MdCard)
Vue.use(MdChips)
Vue.use(MdDrawer);
Vue.use(MdList);
Vue.use(MdImage);
Vue.use(MdIcon);
Vue.use(MdTabs);
Vue.use(MdToolbar);
Vue.use(MdSpeedDial);
Vue.use(MdSwitch);
Vue.use(MdProgress)

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

/* eslint-disable no-new */
const vm = new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: "<App/>"
}).$mount("#app");

const userData = Vue.$sessionStorage.get('user')
if(userData) {
  vm.$store.commit('setUserInfo', userData)
}

vm.$store.commit("setLocale", i18n.locale);
vm.$local
  .get(vm.$store.getters.getLocalPK)
  .then(doc => {
    const current = doc.created;
    const today = vm.$moment();
    const result = vm.$moment.duration(today.diff(current)).asDays();
    const day = Math.floor(result);
    if (day > 3) {
      destroyToInitLocal()
    }
  })
  .catch(error => {
    if (error.status === 404) {
      destroyToInitLocal()
    }
  });

function destroyToInitLocal() {
  vm.$local.destroy().then(res => {
    if (res.ok) {
      console.log("local db deleted!");
      // DB 삭제 후 새로 생성
      if(process.env.NODE_ENV !== 'production') {
        Vue.prototype.$local = new PouchDB("http://localhost:5984/local");
      } else {
        Vue.prototype.$local = new PouchDB("local/160/release");
      }
      const data = {
        _id: vm.$store.getters.getLocalPK,
        created: vm.$moment().format("YYYY-MM-DD")
      };
      vm.$local.post(data).then(result => {
        if (result.ok) {
          console.log("init create local db !");
        }
      });
    }
  });
}
