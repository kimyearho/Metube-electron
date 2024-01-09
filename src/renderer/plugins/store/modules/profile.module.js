const state = {
  googleId: null,
  googleName: null,
  googlePicture: null,
  userInfo: {
    id: null,
    name: null,
    avatar: null,
    created: null
  }
}

const getters = {
  getGoogleProfile() {
    return {
      googleId: state.googleId,
      googleName: state.googleName,
      googlePicture: state.googlePicture
    }
  },
  getUserInfo() {
    return {
      id: state.userInfo.id,
      name: state.userInfo.name,
      avatar: state.userInfo.avatar,
      created: state.userInfo.created
    }
  }
}

// 동기
const mutations = {
  setUserInfo(state, payload) {
    state.userInfo.id = payload.id
    state.userInfo.name = payload.name
    state.userInfo.avatar = payload.avatar
    state.userInfo.created = payload.created
  },
  setSignout(state, payload) {
    state.userInfo.id = null
    state.userInfo.name = null
    state.userInfo.avatar = null
    state.userInfo.created = null
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
