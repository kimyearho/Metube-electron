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
  searchApiKey: null,
  videoItemsApiKey: null,
  locale: "en"
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
