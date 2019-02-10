import Vue from "vue"
import App from "./App"
import router from "./plugins/router"
import store from "./plugins/store"
import i18n from "./plugins/lang"
import "expose-loader?$!jquery"
import "electron-disable-file-drop"
import "./plugins/pouchdb"

import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

/* topHeader */
import topHeader from "./components/Header/Header"

import GlobalEventHandler from "./components/PlayerBar/GlobalEventHandler"

/* vue-modal */
import VModal from "vue-js-modal"

/* vue-scroll */
import VueScrollTo from "vue-scrollto"

/* axios or jsonp */
import axios from "./plugins/http"

/* moment */
import moment from "moment"

/* lodash */
import lodash from "lodash"

/* VueClipboard */
import VueClipboard from "vue-clipboard2"

/* mousetrap */
import mousetrap from "mousetrap"

import { ipcRenderer } from "electron"

/* ElementUI */
import {
  Dialog,
  Dropdown,
  DropdownMenu,
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
} from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

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
} from "vue-material/dist/components"
import "vue-material/dist/vue-material.min.css"

import "./assets/css/default.css"
import "./assets/css/zaudio-1.css"
import "./assets/css/commons.css"
import "./assets/css/playlist.css"
import "./assets/css/collection.css"
import "./assets/css/search.css"

library.add(fas)

if (!process.env.IS_WEB) Vue.use(require("vue-electron"))
Vue.config.productionTip = false

/* global component */
Vue.component("global-event-handler", GlobalEventHandler)
Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.component("top-header", topHeader)

/* side lib */
Vue.use(VModal, { dialog: true })
Vue.use(VueScrollTo)
Vue.use(VueClipboard)

/* vue element-ui  */
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Loading)

/* vue material  */
Vue.use(MdAvatar)
Vue.use(MdButton)
Vue.use(MdBadge)
Vue.use(MdDrawer)
Vue.use(MdList)
Vue.use(MdImage)
Vue.use(MdIcon)
Vue.use(MdTabs)
Vue.use(MdToolbar)
Vue.use(MdSpeedDial)
Vue.use(MdSwitch)

/* vue prototype */
Vue.prototype.$http = axios
Vue.prototype.$moment = moment
Vue.prototype.$lodash = lodash
Vue.prototype.$trap = mousetrap
Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$version = require("../../package.json").version
Vue.prototype.$locale = require("electron").remote.app.getLocale()
Vue.prototype.$ipcRenderer = ipcRenderer
Vue.prototype.$eventBus = new Vue()

/* eslint-disable no-new */
const vm = new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: "<App/>"
}).$mount("#app")

if (process.env.NODE_ENV !== "development") {
  setInterval(() => {
    ipcRenderer.send("event:appStart", {})
  }, 30000)
}

// 10분 간격으로 최근 히스토리 20개를 제외하고 삭제한다.
// 히스토리의 총 개수에서 20개를 뺀 나머지 만큼 오름차순 정렬 후 삭제한다.
let timer = 6 * 100000
setInterval(() => {
  let user = vm.$store.getters.getGoogleProfile.googleId
  if (user) {
    vm.$test
      .find({
        selector: {
          type: "history",
          userId: user
        }
      })
      .then(result => {
        let docs = result.docs
        if (docs.length > 0) {
          let size = docs.length
          let defaultNum = 20
          let result = size - defaultNum
          if (result > defaultNum) {
            // 0부터 결과개수-1 만큼 삭제 후 갱신
            docs.splice(0, result - 1)
            vm.$test.bulkDocs(docs).then(res => {
              if (res.ok) {
                console.log("Success history Remove => ", result - 1)
              }
            })
          } else {
            console.log("Non Removing. history size: " + size)
          }
        }
      })
  }
}, timer)
