/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <div id="player">
      <!-- 타이틀바 컴포넌트 -->
      <top-header @reloadMusicList="feachData" />

      <div class="zaudio_wrapper">
        <!-- 커버 영역 -->
        <div class="zaudio_container">
          <div class="side_menu">
            <a
              class="cursor"
              @click="goBack"
            >
              <img
                src="@/assets/images/svg/menu-back.svg"
                title="Back"
              >
            </a>
          </div>
          <div class>
            <img
              class="cover"
              :src="cover"
            >
            <div class="zaudio_trackinfo trackinfo">
              <span class="label_related label_v">{{ category }}</span>
              <br>
              <br>
              <div class="titleflow">
                <marquee-text
                  class="zaudio_songtitle"
                  :key="coverTitle"
                  :duration="coverTitle.length / 2"
                >&nbsp; {{ coverTitle }}</marquee-text>
                <span class="zaudio_songartist">{{ channelTitle }}</span>
                <span class="zaudio_songartist">/ {{ totalTracks }} Tracks</span>
              </div>
            </div>
          </div>
          <div class="overay"></div>
        </div>

        <!-- 목록 영역 -->
        <draggable
          element="ul"
          id="myMusicList"
          class="zaudio_playlist"
          :class="{ dynamicHeight: isMini }"
          :options="{animation:150}"
          v-model="playlist"
          @end="endDrag"
        >
          <li
            :id="`item${index}`"
            v-for="(item, index) in playlist"
            :key="index"
            :class="selectedIndex === index ? active : ''"
          >
            <!-- 썸네일 -->
            <img
              class="thumbnails"
              :src="item.thumbnails"
            >

            <!-- 비디오 제목 -->
            <span
              class="music-title cursor"
              @click="playItem(index)"
            >{{ item.title }}</span>

            <!-- 비디오 라벨 -->
            <span style="flex-grow:1"></span>
            <span
              class="label_video"
              v-if="item.videoId && item.isLive !== 'live'"
            >{{ item.duration }}</span>
            <span
              class="label_live"
              v-if="item.videoId && item.isLive === 'live' "
            >LIVE</span>

            <!-- My Context Menu -->
            <my-context-menu
              :id="id"
              :index="index"
              :videoId="item.videoId"
              :data="item"
              @is-success="removeCallback"
            />
          </li>
          <!-- 더 보기 -->
          <li>
            <span class="end">
              <i class="el-icon-check load_more"></i>
              {{ $t('COMMONS.END') }}
            </span>
          </li>
          <!-- 개발자 가이드라인  -->
          <div class="bottom">
            <img src="@/assets/images/youtube/dev.png">
          </div>
        </draggable>
        <!-- 메인 재생바 컴포넌트 -->
        <main-player-bar
          @previousVideoTrack="previousPlayItem"
          @nextVideoTrack="nextPlayItem"
          @jump="nextTrackScroll(500)"
        />
      </div>
    </div>

    <!-- 로딩 컴포넌트 -->
    <transition name="fade">
      <loading v-show="!load" />
    </transition>

    <!-- 팝업 컴포넌트 -->
    <v-dialog
      :width="300"
      :height="300"
      :clickToClose="false"
    />
  </div>
</template>

<script>
import * as $commons from '@/service/commons-service.js'
import MainPlayerBar from '@/components/PlayerBar/MainPlayerBar'
import StoreMixin from '@/components/Mixin/index'
import MyCollectionMixin from '@/components/Mixin/mycollection'
import MyContextMenu from '@/components/Context/MyContextMenu'
import Loading from '@/components/Loader/Loader'
import Draggable from 'vuedraggable'
import MarqueeText from 'vue-marquee-text-component'

const options = { container: '#myMusicList', offset: -80 }

export default {
  name: 'MyMusicPlayList',
  mixins: [StoreMixin, MyCollectionMixin],
  components: {
    Loading,
    MainPlayerBar,
    MarqueeText,
    Draggable,
    MyContextMenu
  },
  data() {
    return {
      load: false,
      isMini: false,
      totalTracks: null,
      playType: null,
      id: null,
      active: 'active',
      cover: '',
      coverTitle: '',
      category: '',
      channelTitle: '',
      selectedIndex: 0,
      startIndex: 0,
      playlist: []
    }
  },
  created() {
    /**
     * 이벤트 중첩을 피하기 위해 작성한다.
     * 실제 재생목록은 음악이 재생중이라면 외부에서 이벤트를 계속 전달하므로, beforeDestory 훅에서 작성하면 안된다.
     * beforeDestory 훅에서 작성하게되면 페이지를 벗어날때 이벤트가 제거되므로, 루트에서 전달하는 이벤트를 수신할 수 없다.
     */
    this.$eventBus.$off('playlist-nextMusicPlay')

    /**
     * 다음 비디오 시작을 알리는 이벤트를 수신한다.
     * 이벤트 중첩을 피하기 위해 $once를 사용할 수도 있지만, 사용자가 재생목록에서 벗어나지 않았다면,
     * 외부에서 이벤트를 전달하면 더 이상 받을 수 없으므로 $on을 사용한다.
     */
    this.$eventBus.$on('playlist-nextMusicPlay', this.subscribeNextVideo)
  },
  mounted() {
    this.feachData()
  },
  methods: {
    endDrag(value) {
      // 현재 인덱스와 새인덱스가 다를경우
      if (value.newIndex !== value.oldIndex) {
        const sortPlaylist = this.playlist
        this.syncMyCollection(sortPlaylist)
      }
    },

    /**
     * 비디오 삭제 후 콜백 이벤트
     */
    removeCallback() {
      let musicInfo = this.getMusicInfos()
      this.selectedIndex = musicInfo.index

      /** @override 재생목록 동기화 */
      this.removeTosyncPlaylist()
    },

    /**
     * 다음 순번의 비디오 수신
     */
    subscribeNextVideo(index) {
      this.playItem(index, 'sync')
    },

    /**
     * 인스턴스 초기화 시 조회되는 재생목록
     */
    feachData() {
      // DOM이 마운트 되고 시작 음악의 위치로 스크롤 되도록 처리
      var self = this;
      setTimeout(() => {
        let id = '#item' + self.$route.params.start
        self.$scrollTo(id, -1, options)
      }, 500)

      this.startIndex = this.$route.params.start
      this.playType = this.$route.params.playType
      this.id = this.$route.params.id
      let user_id = this.getUserId()
      if (user_id) {
        this.$local
          .find({
            selector: {
              type: 'profile',
              userId: user_id
            },
            fields: ['playlists']
          })
          .then(result => {
            let docs = result.docs[0]
            let playlists = docs.playlists
            if (playlists) {
              // 재생목록
              let data = this.$lodash.find(playlists, {
                _key: this.id
              })

              this.playlist = data.tracks

              // 카테고리
              this.category = data.category

              // 재생정보 가져오기
              let musicInfo = this.getMusicInfos()

              // 현재 재생중인 재생정보가 있는지?
              if (musicInfo) {
                // name -> 재생정보에 포함 된 재생목록의 key값
                // id -> 이 재생목록의 key값
                // 따라서 현재 재생중인 정보가 이 재생목록과 다를경우이므로 새로 시작한다.
                if (musicInfo.name != this.id) {
                  this.autoStart()
                } else {
                  // 현재 재생중인정보가 이 재생목록과 같은경우.
                  // 현재 재생중인 비디오의 인덱스와, 현재 재생목록의 시작인덱스가 동일한지?
                  if (musicInfo.index === this.startIndex) {
                    // 재생전 목록에서 재생중인 음악을 다시 클릭한 경우이므로 다시 재생할 필요는 없다.
                    this.cover = musicInfo.thumbnails
                    this.coverTitle = musicInfo.title
                    this.channelTitle = musicInfo.channelTitle
                    this.selectedIndex = musicInfo.index
                    this.load = true
                  } else {
                    // 인덱스가 서로 다르므로 새로 시작
                    this.autoStart()
                  }
                }
              } else {
                this.autoStart()
              }
              // 총 트랙 수
              this.totalTracks = data.tracks.length
              this.load = true
            }
          })
      }
    },

    /**
     * 재생목록 조회 후 첫 비디오는 자동 재생
     */
    autoStart() {
      // 재생목록 아이디
      this.playType = this.$route.params.playType

      // 첫 시작 트랙번호
      let startTrack = this.$route.params.start

      // 재생목록에서 해당하는 트랙번호의 비디오
      let playingItem = this.playlist[startTrack]

      playingItem.index = startTrack
      playingItem.name = this.id
      this.playSetting(playingItem)
    },

    /**
     * 비디오 재생 (사용자가 클릭했을경우 or 외부 이벤트 실행)
     *
     * @param {index} - 다음곡 or 선택곡의 index
     * @param {event} - 외부에서 트리거된 이벤트유무
     */
    playItem(index, event) {
      // 재생정보
      let musicInfo = this.getMusicInfos()

      // 외부에서 EventBus로 재생햇을경우
      if (event != undefined) {
        /** @override 재생목록 동기화 */
        this.getMyMusicSyncList(index, musicInfo)
      } else {
        // 재생목록에서 해당하는 트랙번호의 비디오
        let playingItem = this.playlist[index]
        playingItem.index = index
        playingItem.name = musicInfo.name

        this.playSetting(playingItem)
        if (index === 0) {
          this.endScrollTop()
        } else {
          this.nextTrackScroll(-1)
        }
      }
    },

    /**
     * 메인 플레이어바 이전 곡 재생
     */
    previousPlayItem() {
      let musicInfo = this.getMusicInfos()
      let previousIndex = musicInfo.index - 1
      if (previousIndex !== -1) {
        // 재생목록에서 해당하는 트랙번호의 비디오
        let playingItem = this.playlist[previousIndex]
        playingItem.index = previousIndex
        playingItem.name = musicInfo.name

        this.playSetting(playingItem)
        this.nextTrackScroll(500)
      } else {
        this.playItem(0)
      }
    },

    /**
     * 메인 플레이어바 다음 곡 재생
     */
    nextPlayItem() {
      let musicInfo = this.getMusicInfos()
      let nextIndex = musicInfo.index + 1

      // 목록의 총 갯수와 다음 인덱스가 동일하면 (목록의 끝 )
      if (this.totalTracks === nextIndex) {
        // 처음부터 재생
        let playingItem = this.playlist[0]
        playingItem.index = 0
        playingItem.name = musicInfo.name

        this.playSetting(playingItem)
        this.endScrollTop()
      } else {
        // 재생목록에서 해당하는 트랙번호의 비디오
        let playingItem = this.playlist[nextIndex]
        playingItem.index = nextIndex
        playingItem.name = musicInfo.name

        this.playSetting(playingItem)
        this.nextTrackScroll(500)
      }
    },

    /**
     * 재생될 재생정보를 설정한다.
     *
     * @param {playingItem} 재생될 재생정보의 데이터 객체
     */
    playSetting(playingItem) {
      this.selectedIndex = playingItem.index
      this.coverTitle = playingItem.title
      this.channelTitle = playingItem.channelTitle
      this.cover = playingItem.imageInfo
        ? playingItem.imageInfo
        : playingItem.thumbnails

      this.$store.commit('setPlayingMusicInfo', playingItem)
      this.$eventBus.$emit('playMusicSetting')
      this.$ipcRenderer.send('win2Player', [
        'loadVideoById',
        playingItem.videoId
      ])
      this.$eventBus.$emit('statusCheck')
      this.load = true
    },

    /**
     * 다음 비디오 위치로 스크롤을 이동한다.
     * 단, 현재 페이지가 재생목록일경우만 스크롤링 한다.
     * 외부에서 이벤트로 실행할때는 재생목록이 아니므로 offset 오류가 난다.
     *
     * @param {duration} 지연시간
     */
    nextTrackScroll(duration) {
      if (this.$route.name === 'MY-PLAYING-PLAYLIST') {
       let cancelScroll = this.$scrollTo(`#item${this.selectedIndex}`, duration, options)
       setTimeout(() => {
         console.log('cancel Scroll')
         cancelScroll();
       }, 3000);
      }
    },

    /**
     * 스크롤을 맨 위로 이동한다.
     * 단, 현재 페이지가 재생목록일경우만 스크롤링 한다.
     * 외부에서 이벤트로 실행할때는 재생목록이 아니므로 offset 오류가 난다.
     */
    endScrollTop() {
      if (this.$route.name === 'MY-PLAYING-PLAYLIST') {
        let cancelScroll = this.$scrollTo('#item0', -1, options)
        setTimeout(() => {
         console.log('cancel Scroll2')
         cancelScroll();
       }, 3000);
      }
    },

    /**
     * 이전 페이지로 돌아간다.
     */
    goBack() {
      this.$router.push(this.$store.getters.getCurrentPath)
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
  max-height: 178px;
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
