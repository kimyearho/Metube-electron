import _ from "lodash"

const state = {
  myMusicList: []
}

const getters = {
  getMyMusicList() {
    return state.myMusicList
  }
}

// 동기
const mutations = {
  setMyMusicList(state, payload) {
    const myMusicData = {
      list: payload,
      listCount: payload.length,
      id: payload[0].parentId // 모든 데이터에는 부모 아이디가 있으므로 1개만 선택한다.
    }

    if (state.myMusicList.length <= 0) {
      state.myMusicList.push(myMusicData)
    } else {
      const findData = _.find(state.myMusicList, { id: myMusicData.id })
      if (!findData) {
        state.myMusicList.push(myMusicData)
      } else {
        if (findData.listCount != myMusicData.listCount) {
          const findDataIndex = _.findIndex(state.myMusicList, { id: myMusicData.id })
          state.myMusicList[findDataIndex] = myMusicData
          // TODO: 나중에 여기서 드래그에 처리 로직이 필요
        }
      }
    }
  }
}

export default {
  state,
  getters,
  mutations
}
