/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header
      :isShow="false"
      :data="{ playType: 'list' }"
      @scrollTop="endScrollTop"
    />

    <!-- 커버 영역 -->
    <div class="side_menu">
      <a
        class="cursor"
        @click="route"
      >
        <img
          src="@/assets/images/svg/menu-back.svg"
          title="Back"
        >
      </a>
      <!-- 컬렉션 등록 -->
      <a
        class="cursor"
        v-if="playType !== 'related'"
        @click="addCollection"
      >
        <collection-register
          ref="likes"
          :isLikeToggle="isLikeToggle"
          :data="data"
          :playType="playType"
          @toggle="toggleChange"
        />
      </a>
    </div>
    <div class>
      <img
        class="playlistCover"
        :src="cover"
      >
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
          <!-- <marquee-text
            class="zaudio_songtitle"
            :key="coverTitle"
            :duration="coverTitle.length / 2"
          >&nbsp; {{ coverTitle }}</marquee-text>-->
          <div style="margin-top:5px;">
            <span class="zaudio_songartist">{{ channelTitle }}</span>
            <span class="zaudio_songartist">/ {{ totalTracks }} Tracks</span>
          </div>
        </div>
      </div>
    </div>
    <div class="overay"></div>

    <md-list
      id="list"
      class="musicPlayList"
    >
      <md-list-item
        :id="`item${index}`"
        v-for="(item, index) in playlist"
        :key="item.id"
        :class="selectedIndex === index ? active : ''"
      >
        <md-avatar style="margin-right: 0;">
          <img :src="item.imageInfo">
        </md-avatar>

        <span
          class="md-list-item-text music-title cursor"
          @click="playItem(index)"
        >{{ item.title }}</span>
        <span
          v-if="item.videoId && item.isLive != 'live'"
          class="label_video"
        >{{ item.duration }}</span>
        <span
          v-if="item.videoId && item.isLive == 'live'"
          class="label_live"
        >LIVE</span>

        <!-- 확장메뉴 -->
        <context-menu
          :videoId="item.videoId"
          :data="item"
        />
      </md-list-item>
      <md-list-item v-if="isNext">
        <span
          v-if="!isMore"
          class="loadMoreCenter"
        >
          <a
            class="cursor"
            @click="nextPageLoad"
          >
            <i class="el-icon-refresh"></i>
            <!-- {{ $t('COMMONS.MORE') }} -->
            {{ pageNum }} / {{ totalPage }} Next ->
          </a>
        </span>
        <span
          v-else
          class="loadMoreCenter loadMoreLoading"
        >LOADING ...</span>
      </md-list-item>
      <md-list-item v-else>
        <span class="playlistEnd">
          <i class="el-icon-check"></i>
          {{ $t('COMMONS.END') }}
        </span>
      </md-list-item>
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
    <loading v-show="!load" />

    <!-- 팝업 컴포넌트 -->
    <v-dialog
      :width="300"
      :height="300"
      :clickToClose="false"
    />
  </div>
</template>

<script>
import * as $commons from "@/service/commons-service.js";
import StoreMixin from "@/components/Mixin/index";
import DataUtils from "@/components/Mixin/db";
import CollectionQueryMixin from "@/components/Mixin/collections";
import CollectionRegister from "@/components/Collections/regist/CollectionRegister";
import ContextMenu from "@/components/Context/ContextMenu";
import MainPlayerBar from "@/components/PlayerBar/MainPlayerBar";
import MarqueeText from "vue-marquee-text-component";
import Loading from "@/components/Loader/PageLoading";

const options = { container: "#list", offset: -80 };

export default {
  name: "MusicPlayList",
  mixins: [StoreMixin, DataUtils, CollectionQueryMixin],
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
      let playlistName = null;
      this.playlistId = this.$route.params.id;
      this.playType = this.$route.params.playType;

      if (this.playType === "play") {
        playlistName = `PLAYLIST:${this.playlistId}`;
      } else if (this.playType === "related") {
        this.videoId = this.playlistId;
        playlistName = `RELATED:${this.playlistId}`;
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${this.playlistId}`;
      }

      // 재생중인 음악정보
      const musicInfo = this.getMusicInfos();

      if(musicInfo) {

        const storeTokens = this.getTokenList();
        console.log(storeTokens)

        // TODO: 1. 토큰 저장소 조회
        // 토큰 저장소를 조회하여 저장된 토큰이 있으면, 현재 재생중인 음악의 페이지 번호를 이용하여 토큰정보를 찾는다.
        const tokenData = this.$lodash.find(storeTokens, { pageNum: musicInfo.pageNum })
        console.log(tokenData)
      }


      // this.playlistId === (this.playType별) musicInfo.playlistId / mainId / channelId
      // 현재 재생목록 페이지와, 재생중인 음악정보의 재생목록과 동일한지
         // YES
           // - 위에서 조회한 토큰이 없는경우는 1페이지 이므로 별도 처리할건 없다. 아래로 패스
             // - 토큰도 있고, 페이지도 동일하면 최소 한번은 페이징을 사용했다는 의미임. (페이징을 누르기전에는 토큰저장소에 추가하지 않음.)
             // - 재생목록 정보의 토큰을 새로 갱신하고, 페이지 번호도 갱신해준다. 그럼 갱신된 재생목록정보를 기반으로 아래에서 데이터를 조회할거임.
         // NO
           // - 다른 재생목록으로 들어왔으면, 다른 재생목록을 실행하는것이므로, 토큰저장소를 초기화하면 된다.

      // 로컬 디비로 등록 되어있는 재생목록인지 조회
      this.createLocalIndex(["_id", "type", "parentId"]).then(() => {
        return this.$local
          .find({
            selector: {
              type: this.playType + "ListInfo",
              playlistId: playlistName
            }
          })
          .then(result => {
            let doc = result.docs[0];
            if (doc) {
              // 필요한 정보 설정
              this.playlistInfoId = doc._id;
              this.totalTracks = doc.totalResults;
              this.totalPage = doc.totalPage;
              this.pageNum = doc.pageNum;
              this.nextPageToken = doc.nextPageToken;
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
                  const docs = result.docs;
                  this.playlist = docs;
                  // this.data = findPlaylist;
                  this.feachExtends();
                });
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

    feachExtends() {
      // 현재 재생중인 비디오가 있는지 조회
      const musicInfo = this.getMusicInfos();

      // 재생중인정보가 있는지?
      if (musicInfo) {
        let id = null;

        if (this.playType === "play") {
          id = musicInfo.playlistId;
        } else if (this.playType === "related") {
          id = musicInfo.mainId;
        } else if (this.playType === "channel") {
          id = musicInfo.channelId;
        }

        // 재생중인건 있는데 재생중인 재생목록 페이지와 현재 페이지가 달라서 새로 시작
        if (id !== this.playlistId) {
          // this.data = findPlaylist;
          this.autoStart();
        } else {
          // this.data = findPlaylist;

          // 현재 재생중인 음악의 페이지 번호가 현재 페이지 번호와 같으면
          if (musicInfo.pageNum === this.pageNum) {
            this.checkCollection();
            this.coverTitle = musicInfo.title;
            this.channelTitle = musicInfo.channelTitle;
            this.cover = musicInfo.imageInfo;
            this.selectedIndex = musicInfo.index;
            this.videoActive(500);
          } else {
            // 현재 재생중인 비디오의 인덱스와 현재 페이지의 시작인덱스가 동일한지?
            if (musicInfo.index === this.$route.params.start) {
              /** @override 컬렉션 등록여부 조회 */
              this.checkCollection();

              // 재생중인게 있고 페이지 인덱스 변경없이 재방문
              this.coverTitle = musicInfo.title;
              this.channelTitle = musicInfo.channelTitle;
              this.cover = musicInfo.imageInfo;
              this.selectedIndex = musicInfo.index;
              this.videoActive(500);
            } else {
              // 재생중인게 있고 페이지 시작 인덱스가 달라서 시작 인덱스로 새로 시작
              this.autoStart();
            }
          }
        }
      } else {
        // 재생중인거 없어서 첫 시작

        // this.data = findPlaylist;
        this.autoStart();
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

    /**
     * 비디오 재생 (사용자가 클릭했을경우 or 외부 이벤트 실행)
     *
     * @param {index} - 다음곡 or 선택곡의 index
     */
    playItem(index) {
      let musicInfo = this.getMusicInfos();

      // 재생목록에서 해당하는 트랙번호의 비디오
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

      // 목록의 총 갯수와 다음 인덱스가 동일하면 (목록의 끝 / 페이징 끝)
      if (this.totalTracks === nextIndex) {
        this.playItem(0);
      } else {
        // 현재 인덱스가 목록의 마지막일때 (다음페이지)
        if (nextIndex % 30 === 0) {
          // 목록의 마지막인데, 다음 페이지가 있을 때
          if (this.nextPageToken) {
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
      this.selectedIndex = playingItem.index;
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

          const nextPage = this.pageNum + 1
          this.$store.dispatch(pathName).then(results => {
            let list = [];
            this.$lodash.forEach(results, (item, idx) => {
              item.type = this.playType;
              item.parentId = this.playlistInfoId;
              item.pageNum = nextPage;
              list.push(item);
              if (idx === results.length - 1) {
                // 조회된 재생목록 하위 데이터 한꺼번에 등록
                this.$local.bulkDocs(results).then(() => {
                  // 등록이 끝났으면, 다음 페이지 토큰을 업데이트 하기위해 재생목록정보를 조회한다.
                  this.$local.get(this.playlistInfoId).then(doc => {
                    // 토큰 갱신
                    doc.nextPageToken = res.data.nextPageToken
                      ? res.data.nextPageToken
                      : null;
                    doc.pageNum = nextPage;
                    // 재생정보 업데이트
                    return this.$local.put(doc).then(result => {
                      if (result.ok) {
                        let currentTokenData = {
                          pageNum: this.pageNum,
                          pageToken: this.nextPageToken
                        }
                        // 이전 토큰 저장
                        this.$store.commit('setTokenList', currentTokenData);

                        // 총 페이지와, 다음페이지가 동일하면 마지막 페이지도 함께 토큰저장소에 추가한다.
                        // 마지막 페이지 이므로 토큰은 없고, 페이지 번호만 필요.
                        if (this.totalPage === nextPage) {
                          currentTokenData.pageNum = nextPage
                          currentTokenData.pageToken = 'end'
                          this.$store.commit('setTokenList', currentTokenData);
                        }

                        // 성공 후 페이지 리로드
                        this.feachData();
                        this.isMore = false;
                      }
                    });
                  });
                });
              }
            });
          });
        })
        .catch(error => {
          this.errorDialog();
        });
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

<style scope>
.loadMoreCenter {
  color: #ffffff;
  margin-left: 110px;
}
</style>