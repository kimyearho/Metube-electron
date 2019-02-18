import _ from "lodash"
import axios from "axios"
import * as utils from "../../../service/commons-service"

const state = {
  playingInfo: null,
  volume: 0,
  second: 0,
  isRepeat: false,
  isPlay: true,
  tokenList: [],
  musicList: [],
  playlist: [],
  videoList: [],
  searchList: [],
  relatedList: [],
  relatedVideoList: []
}

const getters = {
  getVolume() {
    return state.volume
  },
  getPlayType() {
    return state.isPlay
  },
  getRepeat() {
    return state.isRepeat
  },
  getNextSearchList() {
    return state.videoList
  },
  getPlayList() {
    return state.playlist
  },
  getPlayerSecond() {
    return state.second
  },
  getPlayingMusicInfo() {
    return state.playingInfo
  }
}

// 동기
const mutations = {
  setPlayingMusicInfo(state, payload) {
    state.playingInfo = payload
  },
  setVolume(state, value) {
    state.volume = value
  },
  setPlayType(state, value) {
    state.isPlay = value
  },
  setRepeat(state, value) {
    state.isRepeat = value
  },
  setNextSearchList(state, data) {
    state.videoList = data
  },
  setTokenList(state, data) {
    const list = {
      pageNum: data.pageNum,
      pageToken: data.pageToken
    }
    state.tokenList.push(list)
  },
  // 연관 재생목록 생성
  setRelatedList(state, data) {
    state.relatedList = []
    _.forEach(data, item => {
      let trackInfo = {}
      let thumbnails = item.snippet.thumbnails
      trackInfo.channelId = item.snippet.channelId
      trackInfo.channelTitle = item.snippet.channelTitle
      trackInfo.title = item.snippet.title
      trackInfo.isLive = item.snippet.liveBroadcastContent
      if (item.id.videoId) {
        trackInfo.videoId = item.id.videoId
      } else if (item.id.channelId) {
        trackInfo.otherChannelId = item.id.channelId
      } else if (item.id !== undefined && item.id.playlistId === undefined) {
        trackInfo.videoId = item.id
      } else {
        trackInfo.playlistId = item.id.playlistId
      }
      if (thumbnails) {
        if (item.snippet.thumbnails.maxres) {
          trackInfo.imageInfo = item.snippet.thumbnails.maxres.url
        } else {
          trackInfo.imageInfo = item.snippet.thumbnails.medium.url
        }
      } else {
        trackInfo.imageInfo = ""
      }
      state.relatedList.push(trackInfo)
      if (_.size(state.relatedList) > 0) {
        state.relatedList = _.filter(state.relatedList, obj => {
          return obj.title != "Private video" && obj.title != "Deleted video"
        })
      }
    })
  },
  // 검색목록 생성
  setSearchList(state, data) {
    state.searchList = []
    _.forEach(data, item => {
      let trackInfo = {}
      let thumbnails = item.snippet.thumbnails
      trackInfo.channelId = item.snippet.channelId
      trackInfo.channelTitle = item.snippet.channelTitle
      trackInfo.title = item.snippet.title
      trackInfo.isLive = item.snippet.liveBroadcastContent
      if (item.id.videoId) {
        trackInfo.videoId = item.id.videoId
      } else if (item.id.channelId) {
        trackInfo.otherChannelId = item.id.channelId
      } else if (item.id !== undefined && item.id.playlistId === undefined) {
        trackInfo.videoId = item.id
      } else {
        trackInfo.playlistId = item.id.playlistId
      }
      if (thumbnails) {
        if (item.snippet.thumbnails.maxres) {
          trackInfo.imageInfo = item.snippet.thumbnails.maxres.url
        } else {
          trackInfo.imageInfo = item.snippet.thumbnails.medium.url
        }
      } else {
        trackInfo.imageInfo = ""
      }
      state.searchList.push(trackInfo)
      if (_.size(state.searchList) > 0) {
        state.searchList = _.filter(state.searchList, obj => {
          return obj.title != "Private video" && obj.title != "Deleted video"
        })
      }
    })
  },
  // 그외 재생목록 생성
  setMusicList(state, data) {
    state.musicList = []
    _.forEach(data, item => {
      let trackInfo = {}
      let thumbnails = item.snippet.thumbnails
      trackInfo.channelId = item.snippet.channelId
      trackInfo.playlistId = item.snippet.playlistId
      trackInfo.channelTitle = item.snippet.channelTitle
      trackInfo.title = item.snippet.title
      trackInfo.videoId = item.snippet.resourceId.videoId
      if (thumbnails) {
        if (item.snippet.thumbnails.maxres) {
          trackInfo.imageInfo = item.snippet.thumbnails.maxres.url
        } else {
          trackInfo.imageInfo = item.snippet.thumbnails.medium.url
        }
      } else {
        trackInfo.imageInfo = ""
      }
      state.musicList.push(trackInfo)
    })
    if (_.size(state.musicList) > 0) {
      state.musicList = _.filter(state.musicList, obj => {
        return obj.title != "Private video" && obj.title != "Deleted video"
      })
    }
  },
  // 모든 재생목록을 하나의 배열에 저장함.
  setPlayList(state, payload) {
    let playData = {}
    playData.playlistId = payload.playlistName
    if (payload.playlistId2) {
      playData.channelPlaylistId = payload.playlistId2
    }
    playData.nextPageToken = payload.nextPageToken
    playData.totalTracks = payload.totalResults
    playData.playlistTitle = payload.playlistTitle
    playData.list = payload.list
    state.playlist.push(playData)
  },
  // 페이지를 추가 (주로 다음페이지 조회시)
  setPageAppendList(state, payload) {
    _.forEach(state.playlist, item => {
      item.list = []
      if (item.playlistId === payload.playlistId) {
        item.list = payload.appendPlaylist
        item.nextPageToken = payload.nextPageToken
      }
    })
  }
}

const actions = {
  // 검색목록 각 비디오별 재생타임
  setSearchDuration() {
    state.videoList = []
    const videoIds = _.map(state.searchList, "videoId")
    return new Promise((resolve, reject) => {
      const url = utils.youtubeVideoDuration(videoIds)
      axios.get(url).then(res => {
        _.forEach(state.searchList, item => {
          let videoId = item.videoId
          _.forEach(res.data.items, videoIdArray => {
            if (videoId === videoIdArray.id) {
              item.duration_code = videoIdArray.contentDetails.duration
              item.duration_time = utils.convertToSeconds(videoIdArray.contentDetails.duration)
              item.duration = utils.secondFormat(item.duration_time)
            }
          })
          state.videoList.push(item)
        })
        resolve(state.videoList)
      })
    })
  },
  // 연관 비디오 재생타임
  setRelatedDuration() {
    state.relatedVideoList = []
    const videoIds = _.map(state.relatedList, "videoId")
    return new Promise((resolve, reject) => {
      const url = utils.youtubeVideoDuration(videoIds)
      axios.get(url).then(res => {
        _.forEach(state.relatedList, item => {
          let videoId = item.videoId
          _.forEach(res.data.items, videoIdArray => {
            if (videoId === videoIdArray.id) {
              item.duration_code = videoIdArray.contentDetails.duration
              item.duration_time = utils.convertToSeconds(videoIdArray.contentDetails.duration)
              item.duration = utils.secondFormat(item.duration_time)
            }
          })
          state.relatedVideoList.push(item)
        })
        resolve(state.relatedVideoList)
      })
    })
  },
  // 그외 재생목록 재생타임
  setDuration() {
    let videoIds = _.map(state.musicList, "videoId")
    return new Promise((resolve, reject) => {
      const url = utils.youtubeVideoDuration(videoIds)
      axios.get(url).then(res => {
        _.forEach(res.data.items, (item, index) => {
          if (state.musicList[index].videoId === item.id) {
            if (state.musicList[index].imageInfo !== "") {
              state.musicList[index].duration_code = item.contentDetails.duration
              state.musicList[index].duration_time = utils.convertToSeconds(
                item.contentDetails.duration
              )
              state.musicList[index].duration = utils.secondFormat(
                state.musicList[index].duration_time
              )
            }
          }
        })
        resolve(state.musicList)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
