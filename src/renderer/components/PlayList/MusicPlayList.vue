/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header :isShow="false" :data="{ playType: 'list' }" @scrollTop="endScrollTop"/>

    <!-- 커버 영역 -->
    <div class="side_menu">
      <a class="cursor" @click="route">
        <img src="@/assets/images/svg/menu-back.svg" title="Back">
      </a>
      <!-- 컬렉션 등록 -->
      <a class="cursor" v-if="playType !== 'related'" @click="addCollection">
        <collection-register
          ref="likes"
          :isLikeToggle="isLikeToggle"
          :data="data"
          :playType="playType"
          @toggle="toggleChange"
        />
      </a>
    </div>

    <!-- 커버 영역 -->
    <div>
      <img class="playlistCover" :src="cover">
      <div class="playlistTrackinfo">
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
          <span class="zaudio_songtitle">{{ coverTitle }}</span>
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
    <md-list id="list" class="musicPlayList">
      <!-- 비디오 목록 -->
      <md-list-item
        v-for="(item, index) in playlist"
        :id="`item${index}`"
        :key="item.id"
        :class="selectedIndex === index ? active : ''"
      >
        <!-- 라운딩 썸네일 -->
        <md-avatar style="margin-right: 0;">
          <img :src="item.imageInfo">
        </md-avatar>

        <!-- 비디오 제목 -->
        <span
          class="md-list-item-text music-title cursor"
          @click="mainPlayItem(index)"
        >{{ item.title }}</span>
        <!-- 비디오 재생시간 -->
        <span v-if="item.videoId && item.isLive != 'live'" class="label_video">{{ item.duration }}</span>
        <!-- 비디오 라이브 여부 -->
        <span v-if="item.videoId && item.isLive == 'live'" class="label_live">LIVE</span>

        <!-- 확장메뉴 -->
        <context-menu :videoId="item.videoId" :data="item"/>
      </md-list-item>

      <!-- 페이징 -->
      <md-list-item v-if="pageNum !== lastPageNum">
        <div v-if="!isMore" class="loadMoreCenter" :class="{ prev: pageNum !== 1 }">
          <a v-if="pageNum !== 1" class="cursor" @click="prevPageLoad">
            <md-icon class="md-size-2x">navigate_before</md-icon>
            <span style="margin-right: 15px;">Prev</span>
          </a>
          <span>{{ pageNum }} / {{ totalPage }}</span>
          <a class="cursor" @click="nextPageLoad">
            <span style="margin-left: 15px;">Next</span>
            <md-icon class="md-size-2x">navigate_next</md-icon>
          </a>
        </div>
        <div v-else class="loadMoreCenter loadMoreLoading">LOADING ...</div>
      </md-list-item>

      <!-- 페이지의 끝 -->
      <md-list-item v-else>
        <div v-if="pageNum === lastPageNum" class="loadMoreCenter" :class="{ prev: pageNum !== 1 }">
          <a class="cursor" @click="prevPageLoad">
            <md-icon class="md-size-2x">navigate_before</md-icon>
            <span style="margin-right: 15px;">Prev</span>
          </a>
          <span>{{ pageNum }} / {{ totalPage }}</span>
        </div>
        <!-- <div class="playlistEnd">
          <i class="el-icon-check"></i>
          {{ $t('COMMONS.END') }}
        </div>-->
      </md-list-item>

      <!-- 유튜브 로고 -->
      <div class="bottom">
        <img src="@/assets/images/youtube/dev.png">
      </div>
    </md-list>

    <!-- 메인 재생바 컴포넌트 -->
    <main-player-bar
      :videoSetting="videoData"
      @nextPage="nextPlaylistAutoPageLoad"
      @nextMusicPlay="subscribeNextVideo"
      @previousVideoTrack="previousPlayItem"
      @nextVideoTrack="nextPlayItem"
    />

    <!-- 로딩 컴포넌트 -->
    <loading v-show="!load"/>

    <!-- 팝업 컴포넌트 -->
    <v-dialog :width="300" :height="300" :clickToClose="false"/>
  </div>
</template>

<script>
import * as $commons from "@/service/commons-service.js";
import IndexMix from "@/components/Mixin/index";
import DataUtils from "@/components/Mixin/db";
import CollectionMix from "@/components/Mixin/collections";
import PlaylistMix from "@/components/Mixin/playlist";
import CollectionRegister from "@/components/Collections/regist/CollectionRegister";
import ContextMenu from "@/components/Context/ContextMenu";
import MainPlayerBar from "@/components/PlayerBar/MainPlayerBar";
import Loading from "@/components/Loader/PageLoading";
import { resolve } from "dns";

const options = {
  container: "#list",
  offset: -80
};

export default {
  name: "MusicPlayList",
  mixins: [IndexMix, PlaylistMix, CollectionMix, DataUtils],
  components: {
    CollectionRegister,
    ContextMenu,
    MainPlayerBar,
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
      coverTitle: "",
      channelTitle: null,
      channelId: null,
      channelPlaylistId: null,
      nextPageToken: null,
      isNext: true,
      isLikeToggle: false,
      isMore: false,
      selected: null,
      selectedIndex: 0,
      active: "active",
      cover: null,
      load: false,
      menu: null,
      videoId: null,
      clickIdx: null,
      playType: null,
      data: null
    };
  },
  created() {
    this.feachData();
  },
  methods: {
    /**
     * 다음 순번의 비디오 수신
     */
    subscribeNextVideo(index) {
      this.playItem(index);
    },

    /**
     * 컬렉션 등록/취소 토글
     */
    toggleChange(value) {
      this.isLikeToggle = value;
    },

    /**
     * 컬렉션 등록/취소
     */
    addCollection() {
      if (this.getUserId()) {
        let message = "";
        if (this.isLikeToggle) {
          message = this.$t("COMMONS.COLLECTION.REMOVE");
        } else {
          message = this.$t("COMMONS.COLLECTION.REGISTER");
        }
        this.$modal.show("dialog", {
          title: "Info",
          text: message,
          buttons: [
            {
              title: "Yes",
              handler: () => {
                this.$refs.likes.like();
                this.$modal.hide("dialog");
              }
            },
            {
              title: "Close"
            }
          ]
        });
      } else {
        this.$modal.show("dialog", {
          title: "Info",
          text: this.$t("COLLECTION.NO_LOGIN"),
          buttons: [
            {
              title: "Close"
            }
          ]
        });
      }
    },

    videoActive(ms) {
      let self = this;
      let id = `#item${this.selectedIndex}`;
      setTimeout(() => {
        self.$scrollTo(id, -1, options);
        self.load = true;
      }, ms);
    },

    /**
     * 인스턴스 초기화 시 조회되는 재생목록
     */
    feachData() {
      this.playlistId = this.$route.params.id;
      this.playType = this.$route.params.playType;

      let playlistName = null;

      if (this.playType === "play") {
        playlistName = `PLAYLIST:${this.playlistId}`;
      } else if (this.playType === "related") {
        this.videoId = this.playlistId;
        playlistName = `RELATED:${this.playlistId}`;
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${this.playlistId}`;
      }

      // 재생목록 정보 조회
      const initPromise = this.getPlaylistInfoData(
        this.playType,
        playlistName
      ).then(result => {
        return result.docs[0];
      });

      initPromise.then(doc => {
        // 재생목록 총 개수가 30개 이상일때
        if (doc.totalResults > 30) {
          // 토큰조회
          this.lastPageToken = doc.lastPageToken;
          this.lastPageNum = doc.totalPage;

          // 토큰이 없으면 처음 조회
          if (this.lastPageToken === "none") {
            this.initWithStart(playlistName, "init");
          } else {
            // 재생중인 음악정보
            const musicInfo = this.getMusicInfos();

            if (musicInfo) {
              // (음악이 재생중인경우, 한번이라도 실행한 경우임 (일시정지 여부 관계없음))
              let parentPlaylistId = null;

              if (this.playType === "play") {
                parentPlaylistId = musicInfo.playlistId;
              } else if (this.playType === "related") {
                parentPlaylistId = musicInfo.mainId;
              } else if (this.playType === "channel") {
                parentPlaylistId = musicInfo.channelId;
              }
              // STEP 01
              // - 현재 재생목록과, 재생중인 음악정보의 재생목록과 동일한지 체크한다. (playlistId 비교)
              // - 토큰 등록시 주의할 점은 pageNum을 현재 페이지 번호의 +1로 해야한다. 1페이지와, 마지막페이지는 토큰이 없음.
              // - 무조건 첫 페이지의 토큰은 2페이를 조회하기 위한 토큰이다. 즉 토큰은 아래와 같은 규칙이 적용된다.
              // 1page: { pageNum: 2, nextToken: 'xxx' }
              if (this.playlistId !== parentPlaylistId) {
                // playlistId가 서로 다르므로, 이건 다른 재생목록이다.
                // 토큰을 초기화 및 새 재생목록에 대한 토큰을 갱신하고 처음 재생한다.
                console.log("다른 재생목록");
                this.initWithStart(playlistName, "init");
              } else {
                // playlistId가 서로 동일하므로, 같은 재생목록이다.
                console.log("같은 재생목록");
                // 현재 페이지 번호를 재생중인 음악정보의 페이지 번호로 갱신
                this.pageNum = musicInfo.pageNum;
                // 현재 재생중인 음악정보의 페이지번호와 일치하는 DB 비디오 레코드를 조회하여 랜더링 한다.
                this.initPlaySetting(playlistName, "same");
              }
            } else {
              this.initWithStart(playlistName, "init");
            }
          }
        }
      });
    },

    /**
     * 재생목록 정보에서 현재 페이지의 토큰을 가져와 토큰 저장소로 등록한다.
     */
    initWithStart(id, listType) {
      this.initPlaySetting(id, listType);
    },

    /**
     * 초기 재생목록 세팅.
     * 현재 페이지 번호와 일치하는 레코드를 DB에서 조회하여 랜더링한다.
     */
    initPlaySetting(id, listType) {
      this.getPlaylistInfoData(this.playType, id).then(result => {
        let doc = result.docs[0];
        // 마지막(최근) 토큰
        // 첫 조회에는 이 토큰이 없으므로, 시작토큰으로 세팅한다.
        if (doc.lastPageToken === "none") {
          doc.lastPageToken = doc.nextPageToken;
        }
        // 필요한 정보 설정
        this.playlistInfoId = doc._id;
        this.totalTracks = doc.totalResults;
        this.totalPage = doc.totalPage;
        this.nextPageToken = doc.lastPageToken;
        this.channelPlaylistId = doc.channelPlaylistId
          ? doc.channelPlaylistId
          : null;
        this.isNext = !!this.nextPageToken;
        // 재생정보의 id값과 일치하는 하위 비디오를 조회
        this.$local
          .find({
            selector: {
              type: this.playType,
              parentId: doc._id,
              pageNum: this.pageNum
            },
            limit: 30
          })
          .then(result => {
            this.playlist = result.docs;
            // this.data = findPlaylist;
            this.feachExtends(listType);
          });
        return this.$local.put(doc).then(result => {
          if (result.ok) {
            console.log("initPlaySetting => 재생목록정보 업데이트 완료!");
          }
        });
      });
    },

    // 재생목록이 컬렉션에 등록되어있는지 체크
    checkCollection() {
      const collection = this.getLike();
      if (collection) {
        collection.then(result => {
          let docs = result.docs;
          if (docs.length > 0) {
            this.isLikeToggle = true;
          }
          this.load = true;
        });
      } else {
        this.load = true;
      }
    },

    feachExtends(listType) {
      // 현재 재생중인 비디오가 있는지 조회
      const musicInfo = this.getMusicInfos();

      // 재생목록 첫 시작 or 다른 재생목록을 실행의 경우.
      if (listType === "init") {
        this.autoStart();
      } else {
        // 같은 재생목록일때
        /** @override 컬렉션 등록여부 조회 */
        this.checkCollection();

        // 재생중인게 있고 페이지 인덱스 변경없이 재방문
        this.coverTitle = musicInfo.title;
        this.channelTitle = musicInfo.channelTitle;
        this.cover = musicInfo.imageInfo;
        this.selectedIndex = musicInfo.index;
        this.videoActive(500);
      }
    },

    autoStart() {
      // 재생목록 아이디
      let playlistName = null;

      if (this.playType === "play") {
        playlistName = `PLAYLIST:${this.playlistId}`;
      } else if (this.playType === "related") {
        this.videoId = this.playlistId;
        playlistName = `RELATED:${this.playlistId}`;
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${this.playlistId}`;
      }

      // 첫 시작 트랙번호
      let startTrack = this.$route.params.start;

      // 재생목록에서 해당하는 트랙번호의 비디오
      let playingItem = this.playlist[startTrack];
      playingItem.index = startTrack;
      playingItem.name = playlistName;

      if (this.playType === "related") {
        playingItem.mainId = this.videoId;
      }

      /** @override 컬렉션 등록여부 조회 */
      this.checkCollection();

      // 재생세팅
      this.playSetting(playingItem);

      this.videoActive(500);
    },

    mainPlayItem(index) {
      const musicInfo = this.getMusicInfos();
      // 재생목록 현재 페이지와 재생이 종료되는 음악의 페이지번호가 일치할경우
      let playingItem = this.playlist[index];
      playingItem.index = index;
      playingItem.name = musicInfo.name;
      if (this.playType === "related") playingItem.mainId = this.videoId;
      this.playSetting(playingItem);
      if (index === 0) {
        this.endScrollTop();
      } else {
        this.nextTrackScroll(500);
      }
    },

    /**
     * 비디오 재생 (외부 이벤트 실행)
     *
     * @param {index} - 다음곡
     */
    playItem(index) {

      // 재생음악 정보
      const musicInfo = this.getMusicInfos();

      let pageNum = musicInfo.pageNum
      let nextIndex = index;
      if(musicInfo.lastVideo) {
        // 마지막번째이므로, 1페이지 첫 음악재생
        pageNum = 1
        nextIndex = 0
      }
      // 재생목록 페이지에서 현재 페이지와, 재생이 종료되는 음악의 페이지번호가 다르면
      // 예) 사용자가 2페이지를 보고 있는데, 현재 종료되는 음악은 1페이지 음악일경우
      console.log("page => ", this.pageNum);
      console.log("musicPageNum => ", pageNum);
      this.createLocalIndex(["type", "parentId", "pageNum"]).then(() => {
        return this.$local
          .find({
            selector: {
              type: musicInfo.type,
              parentId: musicInfo.parentId,
              pageNum: pageNum
            },
            limit: 30
          })
          .then(result => {
            const docs = result.docs;
            if (docs) {
              let playingItem = docs[nextIndex];
              playingItem.index = nextIndex;
              playingItem.name = musicInfo.name;
              if (this.playType === "related") {
                playingItem.mainId = this.videoId;
              }
              if(musicInfo.lastVideo) {
                this.pageNum = pageNum
                this.playlist = docs;
                this.endScrollTop();
              }
              this.playSetting(playingItem);
            }
          });
      });
    },

    /**
     * 메인 플레이어바 이전 곡 재생
     */
    previousPlayItem() {
      let musicInfo = this.getMusicInfos();
      let previousIndex = musicInfo.index - 1;
      if (previousIndex !== -1) {
        // 재생목록에서 해당하는 트랙번호의 비디오
        let playingItem = this.playlist[previousIndex];
        playingItem.index = previousIndex;
        playingItem.name = musicInfo.name;

        this.playSetting(playingItem);
        this.nextTrackScroll(500);
      } else {
        this.playItem(0);
      }
    },

    /**
     * 메인 플레이어바 다음 곡 재생
     */
    nextPlayItem() {
      let musicInfo = this.getMusicInfos();
      let nextIndex = musicInfo.index + 1;

      if (musicInfo.lastVideo) {
        this.playItem(0);
      } else {
        // 현재 인덱스가 목록의 마지막일때 (다음페이지)
        if (nextIndex % 30 === 0) {
          // 목록의 마지막인데, 다음 페이지가 있을 때
          if (this.lastPageToken) {
            this.nextPlaylistAutoPageLoad();
          }
        } else {
          this.nextPlay();
        }
      }
    },

    /**
     * 다음 곡 재생
     */
    nextPlay() {
      let musicInfo = this.getMusicInfos();
      let nextIndex = musicInfo.index + 1;

      // 재생목록에서 해당하는 트랙번호의 비디오
      let playingItem = this.playlist[nextIndex];
      playingItem.index = nextIndex;
      playingItem.name = musicInfo.name;
      if (this.playType === "related") playingItem.mainId = this.videoId;

      this.playSetting(playingItem);
      this.nextTrackScroll(500);
    },

    /**
     * 재생될 재생정보를 설정한다.
     *
     * @param {playingItem} 재생될 재생정보의 데이터 객체
     */
    playSetting(playingItem) {
      // 페이지 설정
      if(this.pageNum === playingItem.pageNum) {
        this.selectedIndex = playingItem.index;
      }
      this.coverTitle = playingItem.title;
      this.channelTitle = playingItem.channelTitle;
      this.cover = playingItem.imageInfo;

      // 재생될 비디오 정보를 갱신
      this.$store.commit("setPlayingMusicInfo", playingItem);

      this.$set(this, "videoData", this.getMusicInfos());
      this.$eventBus.$emit("statusCheck");

      // 비디오 재생 이벤트 전송
      const videoId = playingItem.videoId;
      this.$ipcRenderer.send("win2Player", ["loadVideoById", videoId]);

      if (process.env.NODE_ENV !== "development") {
        /** @overade 히스토리 등록 */
        this.insertVideoHistory(playingItem);

        /** @overade 사용자 재생 등록 */
        this.insertUserRecommand(playingItem);
      }
    },

    /**
     * 스크롤을 맨 위로 이동한다.
     * 단, 현재 페이지가 재생목록일경우만 스크롤링 한다.
     * 외부에서 이벤트로 실행할때는 재생목록이 아니므로 offset 오류가 난다.
     */
    endScrollTop() {
      let cancelScroll = this.$scrollTo("#item0", -1, options);
      setTimeout(() => {
        cancelScroll();
      }, 1500);
    },

    /**
     * 다음 비디오 위치로 스크롤을 이동한다.
     * 단, 현재 페이지가 재생목록일경우만 스크롤링 한다.
     * 외부에서 이벤트로 실행할때는 재생목록이 아니므로 offset 오류가 난다.
     *
     * @param {duration} 지연시간
     */
    nextTrackScroll(duration) {
      let cancelScroll = this.$scrollTo(
        `#item${this.selectedIndex}`,
        duration,
        options
      );
      setTimeout(() => {
        cancelScroll();
      }, 1500);
    },

    // 페이징 재조회
    pagingReload(type, pageNumber) {
      let playlistName = null;
      if (this.playType === "play") {
        playlistName = `PLAYLIST:${this.playlistId}`;
      } else if (this.playType === "related") {
        this.videoId = this.playlistId;
        playlistName = `RELATED:${this.playlistId}`;
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${this.playlistId}`;
      }

      // 재생중인 음악정보 조회
      const musicData = this.getMusicInfos();

      this.getPlaylistInfoData(this.playType, playlistName).then(result => {
        let doc = result.docs[0];
        if (doc) {
          // 재생목록정보에 토큰을 최신화
          doc.lastPageToken = this.nextPageToken;

          // 선택된 인덱스 설정 (기본값)
          this.selectedIndex = null;
          // 현재 토큰이 있는지 여부
          this.isNext = !!this.nextPageToken;
          if (type === "prev") {
            // 재생중인 음악의 페이지 번호와, 현재 페이지가 동일하면
            if (musicData.pageNum === pageNumber) {
              this.selectedIndex = musicData.index;
            }
          }
          // 재생목록 정보의 id값과 일치하는 하위 비디오를 조회
          this.$local
            .find({
              selector: {
                type: this.playType,
                parentId: doc._id,
                pageNum: pageNumber
              },
              limit: 30
            })
            .then(result => {
              this.pageNum = pageNumber;

              const docs = result.docs;
              this.playlist = docs;
              this.endScrollTop();
              // this.data = findPlaylist;
            });
          return this.$local.put(doc).then(result => {
            if (result.ok) {
              console.log("pagingReload => 재생목록정보 업데이트 완료!");
            }
          });
        }
      });
    },

    /**
     * 이전 페이징은 토큰이 필요없다. (전부 DB로 조회)
     */
    prevPageLoad() {
      const prevPageNum = this.pageNum - 1;
      this.pagingReload("prev", prevPageNum);
    },

    /**
     * 다음 페이지 로드
     */
    nextPageLoad() {
      let playlistName = null;
      let playlistItem = null;
      this.isMore = true;

      // 토큰을 사용한 새 재생목록 가져오기
      if (this.playType === "play") {
        playlistName = `PLAYLIST:${this.playlistId}`;
        playlistItem = $commons.youtubePagingPlaylistItem(
          this.playlistId,
          this.nextPageToken
        );
      } else if (this.playType === "related") {
        playlistName = `RELATED:${this.playlistId}`;
        playlistItem = $commons.youtubePagingRelatedSearch(
          this.playlistId,
          this.nextPageToken
        );
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${this.playlistId}`;
        playlistItem = $commons.youtubePagingPlaylistItem(
          this.channelPlaylistId,
          this.nextPageToken
        );
      }

      const nextPageNum = this.pageNum + 1;
      this.getPlaylistVideoCount(this.playType, playlistName, nextPageNum).then(
        count => {
          // 다음 페이지가 DB에 있으므로, DB데이터를 조회한다.
          if (count > 0) {
            this.pagingReload("next", nextPageNum);
            this.isMore = false;
          } else {
            // 다음 페이지가 없으므로 새로 조회한다.
            this.$http
              .get(playlistItem)
              .then(res => {
                let pathName = null;
                if (this.playType === "play") {
                  pathName = "setDuration";
                  this.$store.commit("setMusicList", res.data.items);
                } else if (this.playType === "related") {
                  pathName = "setRelatedDuration";
                  this.$store.commit("setRelatedList", res.data.items);
                } else if (this.playType === "channel") {
                  pathName = "setDuration";
                  this.$store.commit("setMusicList", res.data.items);
                }
                this.$store.dispatch(pathName).then(results => {
                  let list = [];
                  this.$lodash.forEach(results, (item, idx) => {
                    item.type = this.playType;
                    item.parentId = this.playlistInfoId;
                    item.pageNum = nextPageNum;
                    list.push(item);
                    if (idx === results.length - 1) {
                      
                      // 마지막 페이징일때
                      if(nextPageNum === this.totalPage) {
                        let lastIndex = results.length - 1
                        // 마지막번째 비디오 객체에 마지막번째라는 키값을 추가한다.
                        results[lastIndex].lastVideo = true
                      }

                      // 조회된 재생목록 하위 데이터 한꺼번에 등록
                      this.$local.bulkDocs(results).then(() => {
                        // 다음 페이지 토큰 저장
                        this.nextPageToken = res.data.nextPageToken
                          ? res.data.nextPageToken
                          : null;
                        // 현재 페이지 번호를 갱신
                        this.pageNum = nextPageNum;
                        // 페이지 재조회
                        this.pagingReload("next", nextPageNum);
                        this.isMore = false;
                      });
                    }
                  });
                });
              })
              .catch(error => {
                this.errorDialog();
              });
          }
        }
      );
    },

    /**
     * 외부 이벤트 수신으로 실행되는 다음 페이지 로드
     */
    nextPlaylistAutoPageLoad() {
      this.isMore = true;

      let musicInfo = this.getMusicInfos();
      let playlistId = musicInfo.playlistId;
      let allPlaylist = this.getAllPlayList();
      let playlistName = null;
      let playlistItem = null;
      let playType = null;

      let nameType = musicInfo.name.split(":")[0];
      if (nameType === "PLAYLIST") {
        playType = "play";
      } else if (nameType === "CHANNEL") {
        playType = "channel";
      } else if (nameType === "RELATED") {
        playType = "related";
      }

      // 토큰을 사용한 새 재생목록 가져오기
      if (playType === "play") {
        playlistName = `PLAYLIST:${playlistId}`;
        playlistItem = $commons.youtubePagingPlaylistItem(
          playlistId,
          this.nextPageToken
        );
      } else if (playType === "related") {
        playlistName = `RELATED:${musicInfo.mainId}`;
        playlistItem = $commons.youtubePagingRelatedSearch(
          musicInfo.mainId,
          this.nextPageToken
        );
      } else if (playType === "channel") {
        playlistName = `CHANNEL:${musicInfo.channelId}`;
        playlistItem = $commons.youtubePagingPlaylistItem(
          this.channelPlaylistId,
          this.nextPageToken
        );
      }

      this.$http
        .get(playlistItem)
        .then(res => {
          let pathName = null;

          if (playType === "play") {
            pathName = "setDuration";
            this.$store.commit("setMusicList", res.data.items);
          } else if (playType === "related") {
            pathName = "setRelatedDuration";
            this.$store.commit("setRelatedList", res.data.items);
          } else if (playType === "channel") {
            pathName = "setDuration";
            this.$store.commit("setMusicList", res.data.items);
          }

          this.$store.dispatch(pathName).then(results => {
            // 기존 재생목록 뒤로, 토큰으로 조회한 목록을 합친다.
            this.playlist = this.$lodash.concat(this.playlist, results);

            // 토큰여부
            this.nextPageToken = res.data.nextPageToken
              ? res.data.nextPageToken
              : null;

            // 토큰이 있으면 true / 없으면 false
            this.isNext = !!this.nextPageToken;

            // 전체 재생목록에 등록 된 현재 재생목록에 대한 정보 업데이트
            let payload = {
              playlistId: playlistName,
              appendPlaylist: this.playlist,
              nextPageToken: this.nextPageToken
            };
            this.$store.commit("setPageAppendList", payload);
            this.isMore = false;
            this.nextPlay();
          });
        })
        .catch(error => {
          this.errorDialog();
        });
    },

    /**
     * 이전 페이지로 이동
     */
    route() {
      this.$router.push(this.$store.getters.getCurrentPath);
    },

    /**
     * 목록 조회 실패 팝업
     */
    errorDialog() {
      this.$modal.show("dialog", {
        title: "Error!",
        text: "Playlist lookup failed.<br> Do you want to retry?",
        buttons: [
          {
            title: "Close"
          }
        ]
      });
    }
  }
};
</script>

<style>
.loadMoreCenter {
  color: #ffffff;
  margin-left: 140px;
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
