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
    <div class>
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

    <md-list id="list" class="musicPlayList">
      <md-list-item
        :id="`item${index}`"
        v-for="(item, index) in playlist"
        :key="item.id"
        :class="selectedIndex === index ? active : ''"
      >
        <md-avatar style="margin-right: 0;">
          <img :src="item.imageInfo">
        </md-avatar>

        <span class="md-list-item-text music-title cursor" @click="playItem(index)">{{ item.title }}</span>
        <span v-if="item.videoId && item.isLive != 'live'" class="label_video">{{ item.duration }}</span>
        <span v-if="item.videoId && item.isLive == 'live'" class="label_live">LIVE</span>

        <!-- 확장메뉴 -->
        <context-menu :videoId="item.videoId" :data="item"/>
      </md-list-item>
      <md-list-item v-if="isNext">
        <span v-if="!isMore" class="loadMoreCenter">
          <a class="cursor" @click="nextPageLoad">
            <i class="el-icon-refresh"></i>
            {{ $t('COMMONS.MORE') }}
          </a>
        </span>
        <span v-else class="loadMoreCenter loadMoreLoading">LOADING ...</span>
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
      @previousVideoTrack="previousPlayItem"
      @nextVideoTrack="nextPlayItem"
      @jump="nextTrackScroll(500)"
    />

    <!-- 로딩 컴포넌트 -->
    <loading v-show="!load"/>

    <!-- 팝업 컴포넌트 -->
    <v-dialog :width="300" :height="300" :clickToClose="false"/>
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
import Loading from "@/components/Loader/Loader";

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
      totalTracks: null,
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
  beforeCreate() {
    /**
     * 이벤트 중첩을 피하기 위해 작성한다.
     * 실제 재생목록은 음악이 재생중이라면 외부에서 이벤트를 계속 전달하므로, beforeDestory 훅에서 작성하면 안된다.
     * beforeDestory 훅에서 작성하게되면 페이지를 벗어날때 이벤트가 제거되므로, 루트에서 전달하는 이벤트를 수신할 수 없다.
     */
    this.$eventBus.$off("playlist-nextMusicPlay");
    this.$eventBus.$off("playlist-nextLoad");
  },
  created() {
    /**
     * 다음 비디오 시작을 알리는 이벤트를 수신한다.
     * 이벤트 중첩을 피하기 위해 $once를 사용할 수도 있지만, 사용자가 재생목록에서 벗어나지 않았다면,
     * 외부에서 이벤트를 전달하면 더 이상 받을 수 없으므로 $on을 사용한다.
     */
    this.$eventBus.$on("playlist-nextMusicPlay", this.subscribeNextVideo);
    this.$eventBus.$on("playlist-nextLoad", this.nextPlaylistAutoPageLoad);
  },
  mounted() {
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
      setTimeout(() => {
        let id = "#item" + self.$route.params.start;
        self.$scrollTo(id, -1, options);
        self.load = true;
      }, ms);
    },

    /**
     * 인스턴스 초기화 시 조회되는 재생목록
     */
    feachData() {
      let playlistName = null;
      let playlistId = this.$route.params.id;
      this.playType = this.$route.params.playType;

      if (this.playType === "play") {
        playlistName = `PLAYLIST:${playlistId}`;
      } else if (this.playType === "related") {
        this.videoId = playlistId;
        playlistName = `RELATED:${playlistId}`;
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${playlistId}`;
      }

      // 현재 재생중인 비디오가 있는지 조회
      let musicInfo = this.getMusicInfos();

      // 현재 페이지의 재생목록이 조회
      let findPlaylist = this.$lodash.find(this.getAllPlayList(), {
        playlistId: playlistName
      });

      this.totalTracks = findPlaylist.totalTracks;
      this.nextPageToken = findPlaylist.nextPageToken;
      this.isNext = !!findPlaylist.nextPageToken;

      // 재생중인정보가 있는지?
      if (musicInfo) {
        // 재생중인건 있는데 재생중인 재생목록 페이지와 현재 페이지가 달라서 새로 시작
        let musicId = null;

        if (this.playType === "play") {
          musicId = musicInfo.playlistId;
        } else if (this.playType === "related") {
          musicId = musicInfo.mainId;
        } else if (this.playType === "channel") {
          // 채널 재생목록 아이디 (채널 아이디 아님)
          this.channelPlaylistId = findPlaylist.channelPlaylistId;
          musicId = musicInfo.channelId;
        }

        if (musicId !== playlistId) {
          this.playlist = findPlaylist.list;
          this.data = this.playlist[0];
          this.autoStart();
        } else {
          this.playlist = findPlaylist.list;
          this.data = this.playlist[0];

          // 현재 재생중인 비디오의 인덱스와 현재 페이지의 시작인덱스가 동일한지?
          if (musicInfo.index === this.$route.params.start) {
            /** @override 컬렉션 등록여부 조회 */
            this.getLike();

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
      } else {
        // 재생중인거 없어서 첫 시작
        this.playlist = findPlaylist.list;
        this.data = this.playlist[0];
        if (this.playType === "channel") {
          this.channelPlaylistId = findPlaylist.channelPlaylistId;
        }
        this.autoStart();
      }
    },
    autoStart() {
      // 재생목록 아이디
      let playlistName = null;
      let playlistId = this.$route.params.id;
      this.playType = this.$route.params.playType;

      if (this.playType === "play") {
        playlistName = `PLAYLIST:${playlistId}`;
      } else if (this.playType === "related") {
        this.videoId = playlistId;
        playlistName = `RELATED:${playlistId}`;
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${playlistId}`;
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
      this.getLike();

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
        this.nextTrackScroll(-1);
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
      // 현재 선택한 비디오의 인덱스
      this.selectedIndex = playingItem.index;

      // 커버 및 제목/채널 세팅
      this.coverTitle = playingItem.title;
      this.channelTitle = playingItem.channelTitle;
      this.cover = playingItem.imageInfo;

      let videoId = playingItem.videoId;
      this.$store.commit("setPlayingMusicInfo", playingItem);
      this.$eventBus.$emit("playMusicSetting");
      this.$eventBus.$emit("statusCheck");
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
      let playlistId = this.$route.params.id;
      this.playType = this.$route.params.playType;
      this.isMore = true;

      // 토큰을 사용한 새 재생목록 가져오기
      if (this.playType === "play") {
        playlistName = `PLAYLIST:${playlistId}`;
        playlistItem = $commons.youtubePagingPlaylistItem(
          playlistId,
          this.nextPageToken
        );
      } else if (this.playType === "related") {
        playlistName = `RELATED:${playlistId}`;
        playlistItem = $commons.youtubePagingRelatedSearch(
          playlistId,
          this.nextPageToken
        );
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${playlistId}`;
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

          this.$store.dispatch(pathName).then(results => {
            // 기존 재생목록 뒤로, 토큰으로 조회한 목록을 합친다.
            this.playlist = this.$lodash.concat(this.playlist, results);

            // 토큰여부
            this.nextPageToken = res.data.nextPageToken
              ? res.data.nextPageToken
              : null;

            // 토큰이 있으면 true / 없으면 false
            this.isNext = !!this.nextPageToken;

            // 모든 재생목록
            let allPlaylist = this.getAllPlayList();

            // 전체 재생목록에 등록 된 현재 재생목록에 대한 정보 업데이트
            this.$lodash.forEach(allPlaylist, item => {
              if (item.playlistId === playlistName) {
                let payload = {
                  playlistId: playlistName,
                  appendPlaylist: this.playlist,
                  nextPageToken: this.nextPageToken
                };
                this.$store.commit("setPageAppendList", payload);
              }
            });
            this.isMore = false;
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
            this.$lodash.forEach(allPlaylist, item => {
              if (item.playlistId === playlistName) {
                let payload = {
                  playlistId: playlistName,
                  appendPlaylist: this.playlist,
                  nextPageToken: this.nextPageToken
                };
                this.$store.commit("setPageAppendList", payload);
              }
            });
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