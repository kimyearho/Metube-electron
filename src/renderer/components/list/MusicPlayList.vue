/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <div id="player">
      <!-- 타이틀바 컴포넌트 -->
      <top-header :data="{ playType: 'list' }" :isShow="false" @scrollTop="top"/>

      <div class="zaudio_wrapper">
        <!-- 커버 영역 -->
        <div class="zaudio_container">
          <div class="side_menu">
            <a class="cursor" @click="route">
              <img src="@/assets/images/svg/menu-back.svg" title="Back">
            </a>
            <!-- 컬렉션 등록 -->
            <a class="cursor" v-if="playType !== 'related'" @click="addCollection">
              <like
                ref="likes"
                :isLikeToggle="isLikeToggle"
                :data="data"
                :playType="playType"
                @toggle="toggleChange"
              />
            </a>
          </div>
          <div class>
            <img class="cover" :src="cover">
            <div class="zaudio_trackinfo trackinfo">
              <span
                class="label_channel label_v"
                v-if="playType === 'channel'"
              >{{ $t('COMMONS.LABEL.CHANNEL') }}</span>
              <span
                class="label_playlist label_v"
                v-if="playType === 'play'"
              >{{ $t('COMMONS.LABEL.PLAY_LIST') }}</span>
              <span
                class="label_related label_v"
                v-if="playType === 'related'"
              >{{ $t('COMMONS.LABEL.RELATED') }}</span>
              <br>
              <br>
              <div class="titleflow">
                <marquee-text
                  class="zaudio_songtitle"
                  :key="coverTitle"
                  :duration="coverTitle.length / 2"
                >&nbsp; {{ coverTitle }}</marquee-text>
                <div style="margin-top:5px;">
                  <span class="zaudio_songartist">{{ channelTitle }}</span>
                  <span class="zaudio_songartist">/ {{ totalTracks }} Tracks</span>
                </div>
              </div>
            </div>
          </div>
          <div class="overay"></div>
        </div>

        <!-- 목록 영역 -->
        <ul id="muiscList" class="zaudio_playlist">
          <li
            :id="`item${index}`"
            v-for="(item, index) in playlist"
            :key="item.id"
            :class="selectedIndex === index ? active : ''"
          >
            <!-- 썸네일 -->
            <img class="thumbnails" :src="item.imageInfo">

            <!-- 비디오 제목 -->
            <span
              class="music-title cursor"
              @click="playItem(index)"
            >{{ item.title.substring(0, 40) }}</span>

            <!-- 비디오 라벨 -->
            <span style="flex-grow:1;"></span>
            <span
              class="label_video"
              v-if="item.videoId && item.isLive !== 'live' "
            >{{ item.duration }}</span>
            <span class="label_live" v-if="item.videoId && item.isLive === 'live' ">LIVE</span>

            <!-- 확장메뉴 컴포넌트 -->
            <context-menu :videoId="item.videoId" :data="item"/>
          </li>

          <!-- 더 보기 -->
          <li v-if="isNext" @click="nextPageLoad">
            <span class="loadMore center cursor" v-if="!isMore">
              <i class="el-icon-refresh load_more"></i>
              {{ $t('COMMONS.MORE') }}
            </span>
            <span class="center" v-if="isMore">
              <i class="el-icon-refresh load_more"></i> LOADING ...
            </span>
          </li>
          <!-- 더 보기 끝 -->
          <li v-else>
            <span class="end">
              <i class="el-icon-check load_more"></i>
              {{ $t('COMMONS.END') }}
            </span>
          </li>
          <!-- 개발자 가이드라인  -->
          <div class="bottom">
            <img src="@/assets/images/youtube/dev.png">
          </div>
        </ul>
        <!-- 메인 재생바 컴포넌트 -->
        <main-player-bar
          @previousVideoTrack="previousPlayItem"
          @nextVideoTrack="nextPlayItem"
          @jump="playingMusicJump(500)"
        />
      </div>
    </div>

    <!-- 로딩 컴포넌트 -->
    <loading v-show="!load"/>

    <!-- 팝업 컴포넌트 -->
    <v-dialog :width="300" :height="300" :clickToClose="false"/>
  </div>
</template>

<script>
import * as $commons from '@/service/commons-service.js'
import storeMixin from '@/components/Mixin/index'
import collectionQueryMixin from '@/components/Mixin/collections'
import contextMenu from '@/components/ContextMenu/ContextMenu'
import mainPlayerBar from '@/components/PlayerBar/MainPlayerBar'
import loading from '@/components/Loader/Loader'
import like from '@/components/Collections/like/like'
import MarqueeText from 'vue-marquee-text-component'

export default {
  name: 'MusicPlayList',
  mixins: [storeMixin, collectionQueryMixin],
  components: {
    mainPlayerBar,
    loading,
    contextMenu,
    MarqueeText,
    like
  },
  data () {
    return {
      playlist: [],
      totalTracks: null,
      coverTitle: null,
      channelTitle: null,
      channelId: null,
      channelPlaylistId: null,
      nextPageToken: null,
      isNext: true,
      isLikeToggle: false,
      isMore: false,
      selected: null,
      selectedIndex: 0,
      active: 'active',
      cover: null,
      load: false,
      menu: null,
      videoId: null,
      clickIdx: null,
      playType: null,
      data: null
    }
  },
  created () {
    this.$eventBus.$off('playlist-nextMusicPlay')
    this.$eventBus.$on('playlist-nextMusicPlay', index => {
      this.playItem(index)
    })

    this.$eventBus.$off('playlist-nextLoad')
    this.$eventBus.$on('playlist-nextLoad', () => {
      this.nextPlaylistAutoPageLoad()
    })

    this.feachData()
  },
  mounted () {
    let self = this
    setTimeout(() => {
      self.scrollTo()
    }, 350)
  },
  methods: {
    toggleChange (value) {
      this.isLikeToggle = value
    },

    addCollection () {
      if (this.getUserId()) {
        let message = ''
        if (this.isLikeToggle) {
          message = this.$t('COMMONS.COLLECTION.REMOVE')
        } else {
          message = this.$t('COMMONS.COLLECTION.REGISTER')
        }
        this.$modal.show('dialog', {
          title: 'Info',
          text: message,
          buttons: [
            {
              title: 'Yes',
              handler: () => {
                this.$refs.likes.like()
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Close'
            }
          ]
        })
      } else {
        this.$modal.show('dialog', {
          title: 'Info',
          text: this.$t('COLLECTION.NO_LOGIN'),
          buttons: [
            {
              title: 'Close'
            }
          ]
        })
      }
    },

    top () {
      let options = {
        container: '#muiscList',
        offset: -80
      }
      this.$scrollTo('#item0', 0, options)
    },

    playingMusicJump (duration) {
      let options = {
        container: '#muiscList',
        offset: -80
      }
      this.$scrollTo(`#item${this.selectedIndex}`, duration, options)
    },

    feachData () {
      // 재생목록 아이디

      let playlistName = null
      let playlistId = this.$route.params.id
      this.playType = this.$route.params.playType

      if (this.playType === 'play') {
        playlistName = `PLAYLIST:${playlistId}`
      } else if (this.playType === 'related') {
        this.videoId = playlistId
        playlistName = `RELATED:${playlistId}`
      } else if (this.playType === 'channel') {
        playlistName = `CHANNEL:${playlistId}`
      }

      // 현재 재생중인 비디오가 있는지 조회
      let musicInfo = this.getMusicInfos()

      // 현재 페이지의 재생목록이 조회
      let findPlaylist = this.$lodash.find(this.getAllPlayList(), {
        playlistId: playlistName
      })

      this.totalTracks = findPlaylist.totalTracks
      this.nextPageToken = findPlaylist.nextPageToken
      this.isNext = !!findPlaylist.nextPageToken
      this.load = true

      // 재생중인정보가 있는지?
      if (musicInfo) {
        // 재생중인건 있는데 재생중인 재생목록 페이지와 현재 페이지가 달라서 새로 시작
        let musicId = null

        if (this.playType === 'play') {
          musicId = musicInfo.playlistId
        } else if (this.playType === 'related') {
          musicId = musicInfo.mainId
        } else if (this.playType === 'channel') {
          // 채널 재생목록 아이디 (채널 아이디 아님)
          this.channelPlaylistId = findPlaylist.channelPlaylistId
          musicId = musicInfo.channelId
        }

        if (musicId !== playlistId) {
          this.playlist = findPlaylist.list
          this.data = this.playlist[0]
          this.autoStart()
        } else {
          this.playlist = findPlaylist.list
          this.data = this.playlist[0]

          // 현재 재생중인 비디오의 인덱스와 현재 페이지의 시작인덱스가 동일한지?
          if (musicInfo.index === this.$route.params.start) {
            // 재생중인게 있고 페이지 인덱스 변경없이 재방문
            this.coverTitle = musicInfo.title
            this.channelTitle = musicInfo.channelTitle
            this.cover = musicInfo.imageInfo
            this.selectedIndex = musicInfo.index
            this.load = true
            this.getLike()
          } else {
            // 재생중인게 있고 페이지 시작 인덱스가 달라서 시작 인덱스로 새로 시작
            this.autoStart()
          }
        }
      } else {
        // 재생중인거 없어서 첫 시작
        this.playlist = findPlaylist.list
        this.data = this.playlist[0]
        if (this.playType === 'channel') {
          this.channelPlaylistId = findPlaylist.channelPlaylistId
        }
        this.autoStart()
      }
    },
    autoStart () {
      // 재생목록 아이디
      let playlistName = null
      let playlistId = this.$route.params.id
      this.playType = this.$route.params.playType

      if (this.playType === 'play') {
        playlistName = `PLAYLIST:${playlistId}`
      } else if (this.playType === 'related') {
        this.videoId = playlistId
        playlistName = `RELATED:${playlistId}`
      } else if (this.playType === 'channel') {
        playlistName = `CHANNEL:${playlistId}`
      }

      // 첫 시작 트랙번호
      let startTrack = this.$route.params.start

      // 재생목록에서 해당하는 트랙번호의 비디오
      let playingItem = this.playlist[startTrack]
      playingItem.index = startTrack
      playingItem.name = playlistName

      if (this.playType === 'related') {
        playingItem.mainId = this.videoId
      }

      this.getLike()

      // 재생세팅
      this.playSetting(playingItem)
    },
    playItem (index) {
      let musicInfo = this.getMusicInfos()

      // 재생목록에서 해당하는 트랙번호의 비디오
      let playingItem = this.playlist[index]
      playingItem.index = index
      playingItem.name = musicInfo.name
      if (this.playType === 'related') playingItem.mainId = this.videoId

      this.playSetting(playingItem)
      this.playingMusicJump(-1)
      if (index === 0) {
        this.top()
      }
    },
    previousPlayItem () {
      let musicInfo = this.getMusicInfos()
      let previousIndex = musicInfo.index - 1
      if (previousIndex !== -1) {
        this.previousPlay()
      } else {
        this.playItem(0)
      }
    },
    nextPlayItem () {
      let musicInfo = this.getMusicInfos()
      let nextIndex = musicInfo.index + 1

      // 목록의 총 갯수와 다음 인덱스가 동일하면 (목록의 끝 / 페이징 끝)
      if (this.totalTracks === nextIndex) {
        this.resetPlay()
      } else {
        // 현재 인덱스가 목록의 마지막일때 (다음페이지)
        if (nextIndex % 30 === 0) {
          // 목록의 마지막인데, 다음 페이지가 있을 때
          if (this.nextPageToken) {
            this.nextPlaylistAutoPageLoad()
          }
        } else {
          this.nextPlay()
        }
      }
    },
    resetPlay () {
      let musicInfo = this.getMusicInfos()

      // 처음부터 재생
      let playingItem = this.playlist[0]
      playingItem.index = 0
      playingItem.name = musicInfo.name

      this.playSetting(playingItem)
      this.top()
    },
    previousPlay () {
      let musicInfo = this.getMusicInfos()
      let previousIndex = musicInfo.index - 1

      // 재생목록에서 해당하는 트랙번호의 비디오
      let playingItem = this.playlist[previousIndex]
      playingItem.index = previousIndex
      playingItem.name = musicInfo.name

      this.playSetting(playingItem)
      this.playingMusicJump(500)
    },
    nextPlay () {
      let musicInfo = this.getMusicInfos()
      let nextIndex = musicInfo.index + 1

      // 재생목록에서 해당하는 트랙번호의 비디오
      let playingItem = this.playlist[nextIndex]
      playingItem.index = nextIndex
      playingItem.name = musicInfo.name
      if (this.playType === 'related') playingItem.mainId = this.videoId

      this.playSetting(playingItem)
      this.playingMusicJump(500)
    },
    playSetting (playingItem) {
      // 현재 선택한 비디오의 인덱스
      this.selectedIndex = playingItem.index

      // 커버 및 제목/채널 세팅
      this.coverTitle = playingItem.title
      this.channelTitle = playingItem.channelTitle
      this.cover = playingItem.imageInfo

      // 비디오아이디
      let videoId = playingItem.videoId

      // // 재생정보 세팅
      this.$store.commit('setPlayingMusicInfo', playingItem)

      // 재생정보 변경 이벤트
      this.$eventBus.$emit('playMusicSetting')

      // 재생
      this.$ipcRenderer.send('win2Player', ['loadVideoById', videoId])

      // 상태체크 시작
      this.$eventBus.$emit('statusCheck')

      this.load = true
    },
    scrollTo () {
      let options = {
        container: '#muiscList',
        offset: -80
      }
      let id = '#item' + this.$route.params.start
      this.$scrollTo(id, -1, options)
    },
    nextPageLoad () {
      let playlistName = null
      let playlistItem = null
      let playlistId = this.$route.params.id
      this.playType = this.$route.params.playType
      this.isMore = true

      // 토큰을 사용한 새 재생목록 가져오기
      if (this.playType === 'play') {
        playlistName = `PLAYLIST:${playlistId}`
        playlistItem = $commons.youtubePagingPlaylistItem(
          playlistId,
          this.nextPageToken
        )
      } else if (this.playType === 'related') {
        playlistName = `RELATED:${playlistId}`
        playlistItem = $commons.youtubePagingRelatedSearch(
          playlistId,
          this.nextPageToken
        )
      } else if (this.playType === 'channel') {
        playlistName = `CHANNEL:${playlistId}`
        playlistItem = $commons.youtubePagingPlaylistItem(
          this.channelPlaylistId,
          this.nextPageToken
        )
      }

      this.$http
        .get(playlistItem)
        .then(res => {
          let pathName = null

          if (this.playType === 'play') {
            pathName = 'setDuration'
            this.$store.commit('setMusicList', res.data.items)
          } else if (this.playType === 'related') {
            pathName = 'setRelatedDuration'
            this.$store.commit('setRelatedList', res.data.items)
          } else if (this.playType === 'channel') {
            pathName = 'setDuration'
            this.$store.commit('setMusicList', res.data.items)
          }

          this.$store.dispatch(pathName).then(results => {
            // 기존 재생목록 뒤로, 토큰으로 조회한 목록을 합친다.
            this.playlist = this.$lodash.concat(this.playlist, results)

            // 토큰여부
            this.nextPageToken = res.data.nextPageToken
              ? res.data.nextPageToken
              : null

            // 토큰이 있으면 true / 없으면 false
            this.isNext = !!this.nextPageToken

            // 모든 재생목록
            let allPlaylist = this.getAllPlayList()

            // 전체 재생목록에 등록 된 현재 재생목록에 대한 정보 업데이트
            this.$lodash.forEach(allPlaylist, item => {
              if (item.playlistId === playlistName) {
                let payload = {
                  playlistId: playlistName,
                  appendPlaylist: this.playlist,
                  nextPageToken: this.nextPageToken
                }
                this.$store.commit('setPageAppendList', payload)
              }
            })
            this.isMore = false
          })
        })
        .catch(error => {
          this.errorDialog()
        })
    },
    nextPlaylistAutoPageLoad () {
      this.isMore = true

      let musicInfo = this.getMusicInfos()
      let playlistId = musicInfo.playlistId
      let allPlaylist = this.getAllPlayList()
      let playlistName = null
      let playlistItem = null
      let playType = null

      let nameType = musicInfo.name.split(':')[0]
      if (nameType === 'PLAYLIST') {
        playType = 'play'
      } else if (nameType === 'CHANNEL') {
        playType = 'channel'
      } else if (nameType === 'RELATED') {
        playType = 'related'
      }

      // 토큰을 사용한 새 재생목록 가져오기
      if (playType === 'play') {
        playlistName = `PLAYLIST:${playlistId}`
        playlistItem = $commons.youtubePagingPlaylistItem(
          playlistId,
          this.nextPageToken
        )
      } else if (playType === 'related') {
        playlistName = `RELATED:${musicInfo.mainId}`
        playlistItem = $commons.youtubePagingRelatedSearch(
          musicInfo.mainId,
          this.nextPageToken
        )
      } else if (playType === 'channel') {
        playlistName = `CHANNEL:${musicInfo.channelId}`
        playlistItem = $commons.youtubePagingPlaylistItem(
          this.channelPlaylistId,
          this.nextPageToken
        )
      }

      this.$http
        .get(playlistItem)
        .then(res => {
          let pathName = null

          if (playType === 'play') {
            pathName = 'setDuration'
            this.$store.commit('setMusicList', res.data.items)
          } else if (playType === 'related') {
            pathName = 'setRelatedDuration'
            this.$store.commit('setRelatedList', res.data.items)
          } else if (playType === 'channel') {
            pathName = 'setDuration'
            this.$store.commit('setMusicList', res.data.items)
          }

          this.$store.dispatch(pathName).then(results => {
            // 기존 재생목록 뒤로, 토큰으로 조회한 목록을 합친다.
            this.playlist = this.$lodash.concat(this.playlist, results)

            // 토큰여부
            this.nextPageToken = res.data.nextPageToken
              ? res.data.nextPageToken
              : null

            // 토큰이 있으면 true / 없으면 false
            this.isNext = !!this.nextPageToken

            // 전체 재생목록에 등록 된 현재 재생목록에 대한 정보 업데이트
            this.$lodash.forEach(allPlaylist, item => {
              if (item.playlistId === playlistName) {
                let payload = {
                  playlistId: playlistName,
                  appendPlaylist: this.playlist,
                  nextPageToken: this.nextPageToken
                }
                this.$store.commit('setPageAppendList', payload)
              }
            })
            this.isMore = false
            this.nextPlay()
          })
        })
        .catch(error => {
          this.errorDialog()
        })
    },
    route () {
      this.$router.push(this.$store.getters.getCurrentPath)
    },
    errorDialog () {
      this.$modal.show('dialog', {
        title: 'Error!',
        text: 'Playlist lookup failed.<br> Do you want to retry?',
        buttons: [
          {
            title: 'Close'
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.zaudio_wrapper {
  min-height: 516px;
}

.zaudio_playlist {
  max-height: 265px;
  z-index: 100;
}

.cover {
  width: 100%;
  background-position: center;
  filter: brightness(1.1);
}

.end {
  margin-left: 115px;
}

.contextMenu {
  width: 15px;
  height: 15px;
}

.none {
  display: none;
}
</style>
