import _ from "lodash"
import axios from "axios"
import * as $commons from "../../../service/commons-service"

const state = {
  volume: 0,
  isRepeat: false,
  minTraffic: false,
  isPlay: true,
  second: 0,
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
  getTrafficOption() {
    return state.minTraffic
  },
  getPlayerSecond() {
    return state.second
  }
}

// 동기
const mutations = {
  setLessTrafficOption(state, value) {
    state.minTraffic = value
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
  setRelatedList(state, data) {
    state.relatedList = []
    _.forEach(data, item => {
      let trackInfo = {}
      let thumbnails = item.snippet.thumbnails
      trackInfo.channelId = item.snippet.channelId
      trackInfo.channelTitle = item.snippet.channelTitle
      trackInfo.title = item.snippet.title
      trackInfo.isLive = item.snippet.liveBroadcastContent
      if (item.id.videoId != undefined) {
        trackInfo.videoId = item.id.videoId
      } else if (item.id.channelId != undefined) {
        trackInfo.otherChannelId = item.id.channelId
      } else if (item.id != undefined && item.id.playlistId === undefined) {
        trackInfo.videoId = item.id
      } else {
        trackInfo.playlistId = item.id.playlistId
      }
      if (thumbnails != undefined) {
        if (item.snippet.thumbnails.maxres != undefined) {
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
  setSearchList(state, data) {
    state.searchList = []
    _.forEach(data, item => {
      let trackInfo = {}
      let thumbnails = item.snippet.thumbnails
      trackInfo.channelId = item.snippet.channelId
      trackInfo.channelTitle = item.snippet.channelTitle
      trackInfo.title = item.snippet.title
      trackInfo.isLive = item.snippet.liveBroadcastContent
      if (item.id.videoId != undefined) {
        trackInfo.videoId = item.id.videoId
      } else if (item.id.channelId != undefined) {
        trackInfo.otherChannelId = item.id.channelId
      } else if (item.id != undefined && item.id.playlistId === undefined) {
        trackInfo.videoId = item.id
      } else {
        trackInfo.playlistId = item.id.playlistId
      }
      if (thumbnails != undefined) {
        if (item.snippet.thumbnails.maxres != undefined) {
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
      if (thumbnails != undefined) {
        if (item.snippet.thumbnails.maxres != undefined) {
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
  setPageAppendList(state, payload) {
    _.forEach(state.playlist, item => {
      if (item.playlistId === payload.playlistId) {
        item.list = []
        item.list = payload.appendPlaylist
        item.nextPageToken = payload.nextPageToken
      }
    })
  }
}

// 비동기
const actions = {
  setPlayerSecond(state, value) {
    return value
  },
  setSearchDuration(context) {
    state.videoList = []
    let videoIds = _.map(state.searchList, "videoId")
    return new Promise((resolve, reject) => {
      axios.get($commons.youtubeVideoDuration(videoIds)).then(res => {
        _.forEach(state.searchList, search_list => {
          let videoId = search_list.videoId
          _.forEach(res.data.items, videoId_list => {
            if (videoId == videoId_list.id) {
              search_list.duration_code = videoId_list.contentDetails.duration
              search_list.duration_time = $commons.convertToSeconds(
                videoId_list.contentDetails.duration
              )
              search_list.duration = $commons.secondFormat(search_list.duration_time)
            }
          })
          state.videoList.push(search_list)
        })
        resolve(state.videoList)
      })
    })
  },
  setRelatedDuration(context) {
    state.relatedVideoList = []
    let videoIds = _.map(state.relatedList, "videoId")
    return new Promise((resolve, reject) => {
      axios.get($commons.youtubeVideoDuration(videoIds)).then(res => {
        _.forEach(state.relatedList, search_list => {
          let videoId = search_list.videoId
          _.forEach(res.data.items, videoId_list => {
            if (videoId == videoId_list.id) {
              search_list.duration_code = videoId_list.contentDetails.duration
              search_list.duration_time = $commons.convertToSeconds(
                videoId_list.contentDetails.duration
              )
              search_list.duration = $commons.secondFormat(search_list.duration_time)
            }
          })
          state.relatedVideoList.push(search_list)
        })
        resolve(state.relatedVideoList)
      })
    })
  },
  setDuration(context) {
    let videoIds = _.map(state.musicList, "videoId")
    return new Promise((resolve, reject) => {
      axios.get($commons.youtubeVideoDuration(videoIds)).then(res => {
        _.forEach(res.data.items, (item, index) => {
          if (state.musicList[index].videoId == item.id) {
            if (state.musicList[index].imageInfo != "") {
              state.musicList[index].duration_code = item.contentDetails.duration
              state.musicList[index].duration_time = $commons.convertToSeconds(
                item.contentDetails.duration
              )
              state.musicList[index].duration = $commons.secondFormat(
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
