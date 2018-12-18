const state = {
  playingInfo: null,
  removeTrackIndex: null
}

const getters = {
  getPlayingMusicInfo () {
    return state.playingInfo
  },
  getRemoveTrackIndex () {
    return state.removeTrackIndex
  }
}

// 동기
const mutations = {
  setPlayingMusicInfo (state, payload) {
    state.playingInfo = payload
  },
  setRemoveTrackIndex (state, payload) {
    state.removeTrackIndex = payload
  }
}

// 비동기
const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
