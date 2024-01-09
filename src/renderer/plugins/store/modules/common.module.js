import { session } from "electron";

const state = {
  path: "",
  indexPath: "",
  isTop: false,
  isPlayer: false,
  isTimer: false,
  isTime: 0,
  isVersion: false,
  searchText: null,
  nextPageToken: null,
  scrollPos: 0,
  apiKeys: [],
  downloadPath: [],
  downloadList: { data: [], status: "uncompleted" },
  downloadQuality: "",
  downloadProgress: false,
  searchApiKey: null,
  videoItemsApiKey: null,
  defaultLocalPK: "init8715",
  locale: ""
}

const getters = {
  getIndexPath() {
    return state.indexPath
  },
  getCurrentPath() {
    return state.path
  },
  getPlayerOption() {
    return state.isPlayer
  },
  getSearchText() {
    return state.searchText
  },
  getNextPageToken() {
    return state.nextPageToken
  },
  getAlwaysTopOption() {
    return state.isTop
  },
  getTimer() {
    return state.isTimer
  },
  getTime() {
    return state.isTime
  },
  getVersionCheck() {
    return state.isVersion
  },
  getLocale() {
    return state.locale
  },
  getScrollPos() {
    return state.scrollPos
  },
  getSnow() {
    return state.isSnow
  },
  getKeys() {
    return state.apiKeys
  },
  getLocalPK() {
    return state.defaultLocalPK
  },
  getDownloadQuality() {
    return state.downloadQuality
  },
  getDownloadPath() {
    return state.downloadPath
  },
  getDownloadList() {
    return state.downloadList
  },
  getDownloadProgress() {
    return state.downloadProgress
  }
}

// 동기
const mutations = {
  setKeys(state, value) {
    state.apiKeys = []
    state.apiKeys = value
  },
  setPath(state, value) {
    state.path = value
  },
  setIndexPath(state, value) {
    state.indexPath = value
  },
  setPlayerHideOption(state, value) {
    state.isPlayer = value
  },
  setLessTrafficOption(state, value) {
    state.minTraffic = value
  },
  setAlwaysTopOption(state, value) {
    state.isTop = value
  },
  setSearchText(state, value) {
    state.searchText = value
  },
  setNextPageToken(state, value) {
    state.nextPageToken = value
  },
  setTimer(state, value) {
    state.isTimer = value
  },
  setTime(state, value) {
    state.isTime = value
  },
  setVersionCheck(state, value) {
    state.isVersion = value
  },
  setLocale(state, value) {
    state.locale = value
  },
  setScrollPos(state, value) {
    state.scrollPos = value
  },
  setDownloadProgress(state, value) {
    state.downloadProgress = value
  },
  setDownloadQuality(state, value) {
    state.downloadQuality = value
  },
  setDownloadPath(state, value) {
    state.downloadPath = value
  },
  setDownloadItem(state, value) {
    state.downloadList.data.push(value)
  },
  setDownloadComplate(state, value) {
    state.downloadList.status = value;
  },
  setResetDownloadList(state, value) {
    state.downloadList = {
      data: [],
      status: "uncompleted"
    }
  }
}

// 비동기
const actions = {
  setAuthKey(context, { vm }) {
    vm.$db.get("cfb9d27f0b59d3fbc55073830f01db05").then(result => {
      const auth = result.auth
      const envType = process.env.NODE_ENV === "development" ? "dev" : "production"
      const service = vm.$lodash.find(auth, { type: envType })
      if (service.type === envType) {
        const keyList = service.key_list
        vm.$store.commit("setKeys", keyList)
      }
    })
  },
  setAuthUser(c, { vm, userData }) {
    vm.$sessionStorage.set("user", userData);
    vm.$store.commit('setUserInfo', userData)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
