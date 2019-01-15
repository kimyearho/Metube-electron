const state = {
  googleId: null,
  googleName: null,
  googlePicture: null
}

const getters = {
  getGoogleProfile() {
    return {
      googleId: state.googleId,
      googleName: state.googleName,
      googlePicture: state.googlePicture
    }
  }
}

// 동기
const mutations = {
  setGoogleProfile(state, payload) {
    if (payload) {
      state.googleId = payload.id
      state.googleName = payload.name
      state.googlePicture = payload.picture
    } else {
      state.googleId = null
      state.googleName = null
      state.googlePicture = null
    }
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
