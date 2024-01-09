/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>

  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header :isShow="false"
                :data="{ playType: 'list' }"
                @scrollTop="endScrollTop" />

    <!-- 커버 영역 -->
    <div class="side_menu">
      <a class="cursor"
         @click="route">
          <img
            src="@/assets/images/svg/menu-back.svg"
            title="Back"
          >
        </a>
      <!-- 컬렉션 등록 -->
      <a class="cursor"
         v-if="playType !== 'related'"
         @click="addCollection">
        <collection-register ref="likes"
                             :isLikeToggle="isLikeToggle"
                             :data="data"
                             :playType="playType"
                             @toggle="toggleChange" />
      </a>
    </div>

    <!-- 커버 영역 -->
    <div>
      <img class="playlistCover"
           :src="cover">
      <div class="playlistTrackinfo">
        <span class="label_channel label_v"
              v-if="playType === 'channel'">{{ $t('COMMONS.LABEL.CHANNEL') }}</span>
        <span class="label_playlist label_v"
              v-if="playType === 'play'">{{ $t('COMMONS.LABEL.PLAY_LIST') }}</span>
        <span class="label_related label_v"
              v-if="playType === 'related'">{{ $t('COMMONS.LABEL.RELATED') }}</span>
        <br>
        <br>
        <div class="titleflow">
          <marquee-text class="zaudio_songtitle"
                        :key="coverTitle"
                        :duration="coverTitle.length / 2">&nbsp; {{ coverTitle }}</marquee-text>
          <div style="margin-top:5px;">
            <span class="zaudio_songartist">{{ channelTitle }}</span>
            <span class="zaudio_songartist">/ {{ totalTracks }} Tracks</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 커버 오버레이 -->
    <div class="overay"></div>

    <!-- 재생목록 -->
    <md-list id="list"
             class="musicPlayList">
      <!-- 비디오 목록 -->
      <md-list-item v-for="(item, index) in playlist"
                    :class="selectedIndex === index ? 'activeBackground' : ''"
                    :id="`item${index}`"
                    :key="item.id">
        <!-- 라운딩 썸네일 -->
        <md-avatar style="margin-right: 0;">
          <img :src="item.imageInfo">
        </md-avatar>

        <!-- 비디오 제목 -->
        <span :class="selectedIndex === index ? 'active' : ''"
              class="md-list-item-text music-title cursor"
              @click="mainPlayItem(index)">{{ item.title }}</span>
        <!-- 비디오 재생시간 -->
        <span v-if="item.videoId && item.isLive != 'live'"
              class="label_video">{{ item.duration }}</span>
        <!-- 비디오 라이브 여부 -->
        <span v-if="item.videoId && item.isLive == 'live'"
              class="label_live">LIVE</span>

        <a class="cursor"
           @click="openContext(item)">
            <img
              class="contextMenu"
              src="@/assets/images/svg/context-menu.svg"
            >
          </a>
      </md-list-item>

      <!-- 페이징 -->
      <md-list-item v-if="pageNum !== lastPageNum">
        <div v-if="!isMore"
             class="loadMoreCenter"
             :class="{ prev: pageNum !== 1 }">
          <a v-if="pageNum !== 1"
             class="cursor"
             @click="prevPageLoad('self')">
            <md-icon class="md-size-2x">navigate_before</md-icon>
            <span style="margin-right: 15px;">Prev</span>
          </a>
          <span>{{ pageNum }} / {{ totalPage }}</span>
          <a class="cursor"
             @click="nextPageLoad('self')">
              <span style="margin-left: 15px;">Next</span>
              <md-icon class="md-size-2x">navigate_next</md-icon>
            </a>
        </div>
        <div v-else
             class="loadMoreCenter loadMoreLoading">LOADING ...</div>
      </md-list-item>

      <!-- 페이지의 끝 -->
      <md-list-item v-else>
        <div v-if="pageNum === lastPageNum && nextPageToken !== null"
             class="loadMoreCenter"
             :class="{ prev: pageNum !== 1 }">
          <a class="cursor"
             @click="prevPageLoad('self')">
            <md-icon class="md-size-2x">navigate_before</md-icon>
            <span style="margin-right: 15px;">Prev</span>
          </a>
          <span>{{ pageNum }} / {{ totalPage }}</span>
        </div>
        <div v-else
             class="loadMoreCenter noPage">
          <span>{{ pageNum }} / {{ totalPage }}</span>
        </div>
      </md-list-item>

      <!-- 유튜브 로고 -->
      <div class="bottom">
        <img src="@/assets/images/youtube/dev.png">
      </div>
    </md-list>

    <!-- 메인 재생바 컴포넌트 -->
    <main-player-bar :videoSetting="videoData"
                     @nextMusicPlay="subscribeNextVideo"
                     @previousVideoTrack="previousPlayItem"
                     @nextVideoTrack="nextPlayItem" />

    <!-- 로딩 컴포넌트 -->
    <loading v-show="!load" />

    <!-- 비디오 확장메뉴 -->
    <context-menu :isShow="contextShow"
                  :data="selectedData"
                  @close="contextShow = false" />

    <!-- 팝업 컴포넌트 -->
    <v-dialog :width="300"
              :height="300"
              :clickToClose="false" />
  </div>

</template>

<script>

  import IndexMix from '@/components/Commons/Mixin/index'
  import ApiMix from '@/components/Commons/Mixin/api'
  import DataUtils from '@/components/Commons/Mixin/db'
  import CollectionMix from '@/components/Commons/Mixin/collections'
  import PlaylistMix from '@/components/Commons/Mixin/playlist'
  import CollectionRegister from '@/components/Collections/regist/CollectionRegister'
  import ContextMenu from '@/components/Context/ContextMenu'
  import MainPlayerBar from '@/components/PlayerBar/MainPlayerBar'
  import MarqueeText from 'vue-marquee-text-component'
  import Loading from '@/components/Commons/Loader/PageLoading'
  import { resolve } from 'dns'

  const options = {
    container: '#list',
    offset: -80
  }

  export default {
    name: 'MusicPlayList',
    mixins: [IndexMix, ApiMix, PlaylistMix, CollectionMix, DataUtils],
    components: {
      CollectionRegister,
      ContextMenu,
      MainPlayerBar,
      MarqueeText,
      Loading
    },
    data() {
      return {
        playlist: [],
        playlistInfoId: null,
        playlistId: null,
        videoData: null,
        totalTracks: null,
        pageNum: 1,
        lastPageNum: null,
        lastPageToken: null,
        totalPage: 0,
        coverTitle: '',
        channelTitle: null,
        channelId: null,
        channelPlaylistId: null,
        nextPageToken: null,
        isLikeToggle: false,
        isMore: false,
        selectedIndex: 0,
        selectedData: null,
        contextShow: false,
        active: 'active',
        cover: null,
        load: false,
        videoId: null,
        playType: null,
        data: null
      }
    },
    created() {
      this.feachData()
    },
    methods: {
      openContext(data) {
        this.$set(this, 'selectedData', data)
        this.contextShow = true
      },

      /**
       * 다음 순번의 비디오 수신
       */
      subscribeNextVideo(index) {
        this.playItem(index, 'typeEvent')
      },

      /**
       * 컬렉션 등록/취소 토글
       */
      toggleChange(value) {
        this.isLikeToggle = value
      },

      /**
       * 컬렉션 등록/취소
       */
      addCollection() {
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

      videoActive(ms) {
        let self = this
        let id = `#item${this.selectedIndex}`
        setTimeout(() => {
          self.$scrollTo(id, 500, options)
          self.load = true
        }, ms)
      },

      /**
       * 인스턴스 초기화 시 조회되는 재생목록
       */
      feachData() {
        this.playlistId = this.$route.params.id
        this.playType = this.$route.params.playType

        let pathName = null
        let playlistName = null

        if (this.playType === 'play') {
          pathName = 'Playlist'
          playlistName = `PLAYLIST:${this.playlistId}`
        } else if (this.playType === 'related') {
          pathName = 'Related'
          this.videoId = this.playlistId
          playlistName = `RELATED:${this.playlistId}`
        } else if (this.playType === 'channel') {
          pathName = 'Channel'
          playlistName = `CHANNEL:${this.playlistId}`
        }

        const data = { url: `${this.$version}/Youtube/${pathName}/Play` }
        this.sendTracker('pageView', data)

        // 재생목록 정보 조회
        const initPromise = this.getPlaylistInfoData(this.playType, playlistName).then(result => {
          return result.docs[0]
        })

        // 재생중인 음악정보
        const musicInfo = this.getMusicInfos()

        initPromise.then(doc => {
          // 토큰조회
          this.lastPageToken = doc.lastPageToken
          this.lastPageNum = doc.totalPage

          // 재생목록 총 개수가 30개 이상일때
          if (doc.totalResults > 30) {
            // 토큰이 없으면 처음 조회
            if (this.lastPageToken === 'none') {
              this.initWithStart(playlistName, 'init')
            } else {
              this.initWithPlayStart(playlistName)
            }
          } else {
            // 페이지가 1페이지 뿐일때
            // this.initWithStart(playlistName, "init");
            this.initWithPlayStart(playlistName)
          }
        })
      },

      initWithPlayStart(playlistName) {
        // 재생중인 음악정보
        const musicInfo = this.getMusicInfos()

        if (musicInfo) {
          let parentPlaylistId = null

          if (this.playType === 'play') {
            parentPlaylistId = musicInfo.playlistId
          } else if (this.playType === 'related') {
            parentPlaylistId = musicInfo.name.split(':')[1]
          } else if (this.playType === 'channel') {
            parentPlaylistId = musicInfo.channelId
          }

          // (음악이 재생중인경우, 한번이라도 실행한 경우임 (일시정지 여부 관계없음))
          // - 현재 재생목록과, 재생중인 음악정보의 재생목록과 동일한지 체크한다. (playlistId 비교)
          // - 토큰 등록시 주의할 점은 pageNum을 현재 페이지 번호의 +1로 해야한다. 1페이지와, 마지막페이지는 토큰이 없음.
          // - 무조건 첫 페이지의 토큰은 2페이를 조회하기 위한 토큰이다. 즉 토큰은 아래와 같은 규칙이 적용된다.
          // 1page: { pageNum: 2, nextToken: 'xxx' }
          if (this.playlistId !== parentPlaylistId) {
            this.getLog('[MusicPlayList]/[feachData] ====> playlistId가 불일치하므로 다른 재생목록일때')
            // playlistId가 서로 다르므로, 이건 다른 재생목록이다.
            // 토큰을 초기화 및 새 재생목록에 대한 토큰을 갱신하고 처음 재생한다.
            this.initWithStart(playlistName, 'init')
          } else {
            this.getLog('[MusicPlayList]/[feachData] ====> playlistId가 일치하므로 같읕 재생목록일때')
            // playlistId가 서로 동일하므로, 같은 재생목록이다.
            // 현재 페이지 번호를 재생중인 음악정보의 페이지 번호로 갱신
            this.pageNum = musicInfo.pageNum
            this.getLog('[MusicPlayList]/[feachData] ====> 현재 페이지번호 : ', this.pageNum)
            // 현재 재생중인 음악정보의 페이지번호와 일치하는 DB 비디오 레코드를 조회하여 랜더링 한다.
            this.initPlaySetting(playlistName, 'same')
          }
        } else {
          this.initWithStart(playlistName, 'init')
        }
      },

      /**
       * 재생목록 정보에서 현재 페이지의 토큰을 가져와 토큰 저장소로 등록한다.
       */
      initWithStart(id, listType) {
        this.initPlaySetting(id, listType)
      },

      /**
       * 초기 재생목록 세팅.
       * 현재 페이지 번호와 일치하는 레코드를 DB에서 조회하여 랜더링한다.
       */
      initPlaySetting(id, listType) {
        this.getPlaylistInfoData(this.playType, id).then(result => {
          let doc = result.docs[0]
          // 마지막(최근) 토큰
          // 첫 조회에는 이 토큰이 없으므로, 시작토큰으로 세팅한다.
          if (doc.lastPageToken === 'none') {
            doc.lastPageToken = doc.nextPageToken
          }
          // 필요한 정보 설정
          this.playlistInfoId = doc._id
          this.totalTracks = doc.totalResults
          this.totalPage = doc.totalPage
          this.nextPageToken = doc.lastPageToken
          this.channelPlaylistId = doc.channelPlaylistId ? doc.channelPlaylistId : null

          // 재생정보의 id값과 일치하는 하위 비디오를 조회
          this.getPageVideoList(this.playType, doc._id, this.pageNum).then(result => {
            this.playlist = result.docs
            this.data = result.docs
            this.feachExtends(listType)
          })
          return this.$local.put(doc).then(result => {
            if (result.ok) {
              this.getLog('[MusicPlayList]/[initPlaySetting] ====> 재생목록정보 업데이트 완료')
            }
          })
        })
      },

      // 재생목록이 컬렉션에 등록되어있는지 체크
      checkCollection() {
        const collection = this.getLike()
        if (collection) {
          collection.then(result => {
            let docs = result.docs
            if (docs.length > 0) {
              this.isLikeToggle = true
            }
            this.load = true
          })
        } else {
          this.load = true
        }
      },

      feachExtends(listType) {
        // 현재 재생중인 비디오가 있는지 조회
        const musicInfo = this.getMusicInfos()

        // 재생목록 첫 시작 or 다른 재생목록을 실행의 경우.
        if (listType === 'init') {
          this.autoStart()
        } else {
          // 같은 재생목록일때
          /** @override 컬렉션 등록여부 조회 */
          this.checkCollection()

          // 재생중인게 있고 페이지 인덱스 변경없이 재방문
          this.coverTitle = musicInfo.title
          this.channelTitle = musicInfo.channelTitle
          this.cover = musicInfo.imageInfo
          this.selectedIndex = Number(musicInfo.index)
          this.videoActive(300)
        }
      },

      autoStart() {
        // 재생목록 아이디
        let playlistName = null

        if (this.playType === 'play') {
          playlistName = `PLAYLIST:${this.playlistId}`
        } else if (this.playType === 'related') {
          this.videoId = this.playlistId
          playlistName = `RELATED:${this.playlistId}`
        } else if (this.playType === 'channel') {
          playlistName = `CHANNEL:${this.playlistId}`
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

        /** @override 컬렉션 등록여부 조회 */
        this.checkCollection()

        // 재생세팅
        this.playSetting(playingItem)

        this.videoActive(300)
      },

      mainPlayItem(index) {
        const musicInfo = this.getMusicInfos()
        // 재생목록 현재 페이지와 재생이 종료되는 음악의 페이지번호가 일치할경우
        let playingItem = this.playlist[index]
        playingItem.index = index
        playingItem.name = musicInfo.name
        if (this.playType === 'related') playingItem.mainId = this.videoId
        this.playSetting(playingItem)
        if (index === 0) {
          this.endScrollTop()
        } else {
          this.nextTrackScroll(500)
        }
      },

      /**
       * 비디오 재생
       *
       * @param {index} - 다음곡
       */
      playItem(index, event) {
        // 재생음악 정보
        const musicInfo = this.getMusicInfos()
        const playType = musicInfo.type
        const parentId = musicInfo.parentId

        // 다음순번 or 이전순번 인덱스
        let nextIndex = index
        // 재생중인 음악의 페이지 번호
        let musicPageNum = musicInfo.pageNum

        // 마지막 페이지, 마지막 비디오일때
        if (musicInfo.lastVideo) {
          this.getLog('[MusicPlayList]/[playItem] ====> 마지막페이지, 마지막곡이 종료되어 1페이지로 돌아가서 다시 시작.')
          musicPageNum = 1
          nextIndex = 0
          this.getPageVideoList(playType, parentId, musicPageNum).then(result => {
            const docs = result.docs
            if (docs) {
              let playingItem = docs[nextIndex]
              playingItem.index = nextIndex
              playingItem.name = musicInfo.name
              // 연관재생목록 처리
              if (this.playType === 'related') {
                playingItem.mainId = this.videoId
              }
              // 마지막 비디오일때
              this.pageNum = musicPageNum
              this.playlist = docs
              this.endScrollTop()
              this.playSetting(playingItem)
            }
          })
        } else {
          // 각 페이지의 마지막 번째 음악이 종료됬을 때
          if (nextIndex !== 0 && nextIndex % 30 === 0) {
            // 현재 보고 있는페이지가 다르다면,
            if (this.pageNum !== musicInfo.pageNum) {
              this.getLog(
                '[MusicPlayList]/[playItem] ====> 각 페이지 마지막번째 음악이 종료되고, 현재 보고있는 페이지가 다를때 - ',
                'P0003'
              )
              this.nextPageLoad('P0003')
            } else {
              this.getLog(
                '[MusicPlayList]/[playItem] ====> 각 페이지 마지막번째 음악이 종료되고, 현재 보고있는 페이지가 같음 - ',
                'P0004'
              )
              this.nextPageLoad('P0004')
            }
          } else {
            // 그외 다음 곡 재생
            this.getPageVideoList(playType, parentId, musicPageNum).then(result => {
              const docs = result.docs
              if (docs) {
                let playingItem = docs[nextIndex]
                if (!playingItem && docs.length === nextIndex) {
                  playingItem = docs[0]
                  playingItem.index = 0
                  playingItem.name = musicInfo.name
                } else {
                  playingItem.index = nextIndex
                  playingItem.name = musicInfo.name
                }
                // 연관재생목록 처리
                if (this.playType === 'related') {
                  playingItem.mainId = this.videoId
                }
                this.playSetting(playingItem, event)
                this.nextTrackScroll(500)
              }
            })
          }
        }
      },

      /**
       * 메인 플레이어바 이전 곡 재생
       */
      previousPlayItem() {
        let musicInfo = this.getMusicInfos()
        let previousIndex = Number(musicInfo.index - 1)

        if (previousIndex !== -1) {
          this.prevPlay(previousIndex)
        } else {
          // 현재 페이지가 1페이지가 아니고, 인덱스가 -1일때
          if (musicInfo.pageNum !== 1) {
            // 현재 보고 있는 페이지와, 재생음악 페이지가 다를때
            this.getLog('[MusicPlayList]/[previousPlayItem] ====> (현재 페이지 번호) pageNum : ', this.pageNum)
            this.getLog(
              '[MusicPlayList]/[previousPlayItem] ====> (재생중 음악정보 페이지 번호) pageNum : ',
              musicInfo.pageNum
            )

            // 보고 있는 페이지가 다르면 P0002 / 같으면 P0001
            if (this.pageNum !== musicInfo.pageNum) {
              this.getLog(
                '[MusicPlayList]/[previousPlayItem] ====> 각 페이지 마지막번째 음악이 종료되고, 현재 보고있는 페이지가 다를때 - ',
                'P0002'
              )
              this.prevPageLoad('P0002')
            } else {
              this.getLog(
                '[MusicPlayList]/[previousPlayItem] ====> 각 페이지 마지막번째 음악이 종료되고, 현재 보고있는 페이지가 같을때 - ',
                'P0001'
              )
              this.prevPageLoad('P0001')
            }
          }
        }
      },

      /**
       * 메인 플레이어바 다음 곡 재생
       */
      nextPlayItem() {
        let musicInfo = this.getMusicInfos()
        let nextIndex = Number(musicInfo.index + 1)

        if (musicInfo.lastVideo) {
          this.playItem(0)
        } else {
          // 현재 인덱스가 목록의 마지막일때 (다음페이지)
          if (nextIndex % 30 === 0) {
            // 목록의 마지막인데, 다음 페이지가 있을 때
            if (this.lastPageToken || this.lastPageToken === null) {
              this.getLog('[MusicPlayList]/[nextPlayItem] ====> (현재 페이지 번호) pageNum : ', this.pageNum)
              this.getLog(
                '[MusicPlayList]/[nextPlayItem] ====> (재생중 음악정보 페이지 번호) pageNum : ',
                musicInfo.pageNum
              )

              // 보고 있는 페이지가 다르면 P0003 / 같으면 P0004
              if (this.pageNum !== musicInfo.pageNum) {
                this.getLog(
                  '[MusicPlayList]/[nextPlayItem] ====> 각 페이지 마지막번째 음악이 종료되고, 현재 보고있는 페이지가 다를때 - ',
                  'P0003'
                )
                this.nextPageLoad('P0003')
              } else {
                this.getLog(
                  '[MusicPlayList]/[nextPlayItem] ====> 각 페이지 마지막번째 음악이 종료되고, 현재 보고있는 페이지가 같을때 - ',
                  'P0004'
                )
                this.nextPageLoad('P0004')
              }
            }
          } else {
            this.nextPlay()
          }
        }
      },

      prevPlay(prevIndex) {
        let musicInfo = this.getMusicInfos()
        // 보고있는 페이지가 다를 때
        if (this.pageNum !== musicInfo.pageNum) {
          this.playItem(prevIndex)
        } else {
          // 페이지가 같음
          // 재생목록에서 해당하는 트랙번호의 비디오
          let playingItem = this.playlist[prevIndex]
          playingItem.index = prevIndex
          playingItem.name = musicInfo.name
          if (this.playType === 'related') playingItem.mainId = this.videoId

          this.playSetting(playingItem)
          this.nextTrackScroll(500)
        }
      },

      /**
       * 다음 곡 재생
       */
      nextPlay() {
        let musicInfo = this.getMusicInfos()
        let nextIndex = Number(musicInfo.index + 1)

        // TODO: 보고있는 페이지가 다를 때
        if (this.pageNum !== musicInfo.pageNum) {
          this.playItem(nextIndex)
        } else {
          // 페이지가 같음
          // 재생목록에서 해당하는 트랙번호의 비디오

          let playingItem = this.playlist[nextIndex]

          // 재생목록 총 페이지 수가 1이면 (페이징이 없는 1페이지인경우)
          if (this.lastPageNum === 1) {
            // 그럼 여긴 undefined임
            if (!playingItem && this.playlist.length === nextIndex) {
              playingItem = this.playlist[0]
              playingItem.index = 0
              playingItem.name = musicInfo.name
            } else {
              playingItem.index = nextIndex
              playingItem.name = musicInfo.name
            }
          } else {
            // 그외
            playingItem.index = nextIndex
            playingItem.name = musicInfo.name
          }

          if (this.playType === 'related') playingItem.mainId = this.videoId

          this.playSetting(playingItem)
          this.nextTrackScroll(500)
        }
      },

      /**
       * 재생될 재생정보를 설정한다.
       *
       * @param {playingItem} 재생될 재생정보의 데이터 객체
       */
      playSetting(playingItem, event) {
        // 현재 페이지와, 재생하고자하는 페이지가 동일할때
        if (this.pageNum === playingItem.pageNum) {
          this.selectedIndex = Number(playingItem.index)
        }

        // 페이지 설정
        this.coverTitle = playingItem.title
        this.channelTitle = playingItem.channelTitle
        this.cover = playingItem.imageInfo

        if (process.env.NODE_ENV !== 'development') {
          /** @overade 히스토리 등록 */
          this.insertVideoHistory(playingItem)

          // 사용자가 감상한 비디오를 등록하기 위한 조건이 변경 됨.
          // 이제는 음악이 종료된 시점에 등록이 되도록 변경함.
          // 무번별하게 등록되는 문제를 보완함.
          if (event !== undefined) {
            const currentMusic = this.getMusicInfos()
            /** @overade 사용자 재생 등록 */
            this.insertUserRecommand(playingItem)
          }
        }

        // 재생될 비디오 정보를 갱신
        this.$store.commit('setPlayingMusicInfo', playingItem)

        this.$set(this, 'videoData', this.getMusicInfos())
        this.$eventBus.$emit('statusCheck')

        // 비디오 재생 이벤트 전송
        const videoId = playingItem.videoId
        this.$ipcRenderer.send('win2Player', ['loadVideoById', videoId])

        let category = ''

        if (this.playType === 'play') {
          category = 'Playlist'
        } else if (this.playType === 'channel') {
          category = 'Channel'
        } else if (this.playType === 'related') {
          category = 'Related'
        }

        const data = {
          eventCategory: category,
          eventAction: 'Play',
          eventLabel: this.coverTitle
        }

        this.$ipcRenderer.send('eventView', data)
      },

      /**
       * 스크롤을 맨 위로 이동한다.
       * 단, 현재 페이지가 재생목록일경우만 스크롤링 한다.
       * 외부에서 이벤트로 실행할때는 재생목록이 아니므로 offset 오류가 난다.
       */
      endScrollTop() {
        let cancelScroll = this.$scrollTo('#item0', -1, options)
        setTimeout(() => {
          cancelScroll()
        }, 1500)
      },

      /**
       * 다음 비디오 위치로 스크롤을 이동한다.
       * 단, 현재 페이지가 재생목록일경우만 스크롤링 한다.
       * 외부에서 이벤트로 실행할때는 재생목록이 아니므로 offset 오류가 난다.
       *
       * @param {duration} 지연시간
       */
      nextTrackScroll(duration) {
        let cancelScroll = this.$scrollTo(`#item${this.selectedIndex}`, duration, options)
        setTimeout(() => {
          cancelScroll()
        }, 1500)
      },

      // 페이징 재조회
      pagingReload(type, page, eventType) {
        let playlistName = null
        if (this.playType === 'play') {
          playlistName = `PLAYLIST:${this.playlistId}`
        } else if (this.playType === 'related') {
          this.videoId = this.playlistId
          playlistName = `RELATED:${this.playlistId}`
        } else if (this.playType === 'channel') {
          playlistName = `CHANNEL:${this.playlistId}`
        }

        // 재생중인 음악정보 조회
        const musicData = this.getMusicInfos()

        // 선택된 인덱스 설정 (기본값)
        this.selectedIndex = 0

        this.getPlaylistInfoData(this.playType, playlistName).then(result => {
          let doc = result.docs[0]
          if (doc) {
            // 재생목록 정보 페이지 갱신
            doc.pageNum = page

            // 재생목록정보에 토큰을 최신화
            doc.lastPageToken = this.nextPageToken

            if (type) {
              // 재생중인 음악의 페이지 번호와, 현재 페이지가 동일하면
              if (musicData.pageNum === page) {
                this.selectedIndex = Number(musicData.index)
              }
            }
            // 재생목록 정보의 id값과 일치하는 하위 비디오를 조회

            this.getPageVideoList(this.playType, doc._id, page).then(result => {
              const docs = result.docs

              // 이벤트 타입이 other가 아니면
              if (eventType !== 'P0002' && eventType !== 'P0003') {
                // 이벤트 타입 self, auto만 해당 됨.
                this.pageNum = page
                this.playlist = docs

                // 이벤트 타입이 auto 이면 목록의 0번째 시작
                if (eventType === 'P0004') {
                  this.mainPlayItem(0)
                }

                if (eventType !== 'P0001') {
                  this.endScrollTop()
                }

                if (eventType === 'P0001') {
                  let playingItem = docs[docs.length - 1]
                  playingItem.index = docs.length - 1
                  playingItem.name = musicData.name
                  if (this.playType === 'related') {
                    playingItem.mainId = this.videoId
                  }
                  this.selectedIndex = Number(playingItem.index)
                  this.playSetting(playingItem)
                  this.videoActive(300)
                }
              } else {
                let playingItem
                if (eventType === 'P0002') {
                  playingItem = docs[docs.length - 1]
                  playingItem.index = docs.length - 1
                  playingItem.name = musicData.name
                  if (this.playType === 'related') {
                    playingItem.mainId = this.videoId
                  }
                } else if (eventType === 'P0003') {
                  playingItem = docs[0]
                  playingItem.index = 0
                  playingItem.name = musicData.name
                  if (this.playType === 'related') {
                    playingItem.mainId = this.videoId
                  }
                }
                this.playSetting(playingItem)
              }
            })
            return this.$local.put(doc).then(result => {
              if (result.ok) {
                this.getLog('[MusicPlayList]/[pagingReload] ====> 재생목록정보 업데이트 완료')
              }
            })
          }
        })
      },

      /**
       * 이전 페이징은 토큰이 필요없다. (전부 DB로 조회)
       */
      prevPageLoad(eventType) {
        let prevPageNum = 0
        if (eventType === 'P0002') {
          prevPageNum = this.getMusicInfos().pageNum - 1
        } else {
          prevPageNum = this.pageNum - 1
        }
        this.pagingReload('prev', prevPageNum, eventType)
      },

      /**
       * 다음 페이지 실행
       *
       * @param {*} eventType (self/auto) auto일때 다음 페이지 자동 조회
       */
      nextPageLoad(eventType) {
        this.isMore = true

        let playlistName = null
        let playlistItem = null

        // 토큰을 사용한 새 재생목록 가져오기
        if (this.playType === 'play') {
          playlistName = `PLAYLIST:${this.playlistId}`
          playlistItem = this.youtubePagingPlaylistItem(this.playlistId, this.nextPageToken)
        } else if (this.playType === 'related') {
          // api -> search
          playlistName = `RELATED:${this.playlistId}`
          playlistItem = this.youtubePagingRelatedSearch(this.playlistId, this.nextPageToken)
        } else if (this.playType === 'channel') {
          playlistName = `CHANNEL:${this.playlistId}`
          playlistItem = this.youtubePagingPlaylistItem(this.channelPlaylistId, this.nextPageToken)
        }

        let nextPageNum

        // 페이지가 다름
        if (eventType === 'P0003') {
          const musicInfo = this.getMusicInfos()
          nextPageNum = musicInfo.pageNum + 1
        } else {
          // 동일 페이지내에서
          nextPageNum = this.pageNum + 1
        }

        this.getPlaylistVideoCount(this.playType, playlistName, nextPageNum).then(count => {
          // 다음 페이지가 DB에 있으므로, DB데이터를 조회한다.
          if (count > 0) {
            this.pagingReload('next', nextPageNum, eventType)
            this.isMore = false
          } else {
            this.getLog('[MusicPlayList]/[nextPageLoad] ====> 다음 페이지가 DB에 없어 API를 통해서 조회')
            // 다음 페이지가 없으므로 새로 조회한다.
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
                this.$store.dispatch(pathName, { vm: this }).then(results => {
                  let list = []
                  this.$lodash.forEach(results, (item, idx) => {
                    item.type = this.playType
                    item.parentId = this.playlistInfoId
                    item.sortIndex = idx
                    item.pageNum = nextPageNum
                    list.push(item)
                    if (idx === results.length - 1) {
                      // 마지막 페이징일때
                      if (nextPageNum === this.totalPage) {
                        let lastIndex = results.length - 1
                        // 마지막번째 비디오 객체에 마지막번째라는 키값을 추가한다.
                        results[lastIndex].lastVideo = true
                      }

                      // 조회된 재생목록 하위 데이터 한꺼번에 등록
                      this.$local.bulkDocs(results).then(() => {
                        // 다음 페이지 토큰 저장
                        this.nextPageToken = res.data.nextPageToken ? res.data.nextPageToken : null
                        // 현재 페이지 번호를 갱신
                        this.pageNum = nextPageNum
                        // 페이지 재조회
                        this.pagingReload('next', nextPageNum, eventType)
                        this.isMore = false
                      })
                    }
                  })
                })
              })
              .catch(error => {
                this.errorDialog()
              })
          }
        })
      },

      /**
       * 다음 페이지를 실행하고, 첫번째 음악을 실행한다.
       */
      nextPageMusicPlay() {
        this.nextPageLoad('P0004')
      },

      /**
       * 이전 페이지로 이동
       */
      route() {
        this.$router.push(this.$store.getters.getCurrentPath)
      },

      /**
       * 목록 조회 실패 팝업
       */
      errorDialog() {
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

<style scope>

  .pageCenter {
    color: #ffffff;
    margin-left: 140px;
  }

  .loadMoreCenter {
    color: #ffffff;
    margin-left: 140px;
  }

  .noPage {
    margin-left: 150px !important;
  }

  .prev {
    margin-left: 45px;
  }

  .md-icon {
    color: #ffffff !important;
  }

  .md-icon:hover {
    color: #448aff !important;
  }

</style>
