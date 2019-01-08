/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div id="app">

    <!-- 루트 라우터 뷰 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>

    <!-- 하단 네비게이션 -->
    <md-tabs
      class="tab-navi"
      :md-active-tab="isSelected"
    >
      <md-tab
        id="tabSearch"
        class="md-tab"
        md-label="Search"
        @click="route('search')"
      ></md-tab>
      <md-tab
        id="tabCollection"
        class="md-tab"
        md-label="Collections"
        @click="route('collection')"
      ></md-tab>
      <md-tab
        id="tabHistory"
        class="md-tab"
        md-label="History"
        @click="route('history')"
      ></md-tab>
    </md-tabs>
    <span
      v-show="isCheck"
      class="badge"
    ></span>
    <v-dialog
      :width="300"
      :height="300"
      :clickToClose="false"
    />
  </div>
</template>

<script>
import StoreMixin from "@/components/Mixin/index";

export default {
  name: "App",
  mixins: [StoreMixin],
  data() {
    return {
      isShow: false,
      isSpinShow: false,
      isCheck: false,
      isSelected: 'tabSearch',
      state: "",
      status: []
    };
  },
  created() {
    // 프로덕션 환경에서만 버전체크 실행
    if (process.env.NODE_ENV !== 'development') {
      this.onNewReleaseCheck();
    }

    // 비디오 상태 체크 이벤트 종료
    this.$eventBus.$off("statusCheck");

    // 비디오 상태 체크 이벤트 수신
    this.$eventBus.$on("statusCheck", this.videoStatusCheck);

    // 재생 플레이어 상태 체크 이벤트 수신
    this.$eventBus.$on("playerState", this.playerStatusCheck);

    // 현재 텝 이벤트 수신
    this.$eventBus.$on('setActiveMenu', this.setActiveMenu)
  },
  mounted() {
    this.$watch(
      () => {
        return this.state;
      },
      (newVal, oldVal) => {
        this.status.push(newVal);
      }
    );
    this.$trap.bind("space", () => {
      let playType = this.getPlayType();
      if (playType) {
        // 재생 중
        this.$ipcRenderer.send("win2Player", ["pauseVideo"]);
        this.$store.commit("setPlayType", false);
        this.$eventBus.$emit("playTypeControl", { playType: false });
      } else {
        // 일시 정지
        this.$ipcRenderer.send("win2Player", ["playVideo"]);
        this.$store.commit("setPlayType", true);
        this.$eventBus.$emit("playTypeControl", { playType: true });
      }
    });
  },
  methods: {
    docs() {
      get(this);
    },
    route(path) {
      if (path == "search") {
        this.$router.push({
          name: "play-search"
        });
      } else if (path == "collection") {
        this.$router.push({
          name: "collection"
        });
      } else if (path == "history") {
        this.$router.push({
          name: "VIDEO-HISTORY"
        });
      }
    },

    setActiveMenu(data) {
      this.$set(this, "isSelected", data.menu)
    },

    clickItem(idx) {
      console.log('idx: ' + idx)
    },
    clickMainBtn() {
      console.log('clickMainBtn')
    },

    playerStatusCheck(value) {
      this.state = value;
      // 버퍼링 or 일시중지
      if (this.state === 2) {
        // 재생모양 아이콘으로 변경
        this.$eventBus.$emit("playTypeControl", { playType: false });
      } else if (this.state === 1) {
        // 일시정지 아이콘으로 변경 (현재 재생 중)
        this.$eventBus.$emit("playTypeControl", { playType: true });
      } else if (this.state === 0) {
        // 종료일 경우
        // 재생중인 음악정보
        let musicData = this.getMusicInfos();
        let isRepeat = this.getRepeat();

        // 반복여부
        if (isRepeat) {
          this.$ipcRenderer.send("win2Player", [
            "loadVideoById",
            musicData.videoId
          ]);
        } else {
          // 이전 음악의 인덱스 (현재 종료된 음악)
          let currentIndex = musicData.index;
          // 다음 인덱스
          let nextIndex = currentIndex + 1;

          if (musicData.type) {
            this.$local
              .find({
                selector: {
                  type: "profile",
                  userId: this.getUserId()
                },
                fields: ["playlists"]
              })
              .then(result => {
                let docs = result.docs[0];
                let playlists = docs.playlists;
                if (playlists) {
                  this.playlist = this.$lodash.find(playlists, {
                    _key: musicData.name
                  });
                  if (this.playlist.tracks.length > nextIndex) {
                    this.$eventBus.$emit("playlist-nextMusicPlay", nextIndex);
                  } else {
                    this.$eventBus.$emit("playlist-nextMusicPlay", 0);
                  }
                }
              });
          } else {
            // 전체 재생 목록
            let allPlaylist = this.getAllPlayList();
            // 재생목록명으로 재생목록 조회
            let playlist = this.$lodash.find(allPlaylist, {
              playlistId: musicData.name
            });

            if (playlist != undefined) {
              if (playlist.list.length > nextIndex) {
                this.$eventBus.$emit("playlist-nextMusicPlay", nextIndex);
              } else {
                // 토큰여부
                let nextPageToken = playlist.nextPageToken;
                if (nextPageToken === null) {
                  // 목록의 마지막 번째 음악이 종료되었으므로, 처음부터 재생
                  this.$eventBus.$emit("playlist-nextMusicPlay", 0);
                } else {
                  // 다음 페이지 조회
                  this.$eventBus.$emit("playlist-nextLoad");
                }
              }
            }
          }
        }
      }
    },
    videoStatusCheck() {
      let isTimer = this.$store.getters.getTimer;
      if (isTimer) {
        // clear and set
        let isTime = this.$store.getters.getTime;
        clearTimeout(isTime);
      }
      this.$store.commit("setTimer", true);
      setTimeout(() => {
        this.$store.commit("setTime", 1000);
        this.statusResult();
      }, 10000);
    },
    statusResult() {
      this.$store.commit("setTimer", false);
      let statusSize = this.$lodash.size(this.status);
      let lastIndex = this.status[statusSize - 1];
      if (lastIndex) {
        if (lastIndex === -1) {
          let musicData = this.getMusicInfos();
          let nextIndex = musicData.index + 1;
          if (musicData.type) {
            let key = musicData.name;
            this.$local
              .find({
                selector: {
                  type: "profile",
                  userId: this.getUserId()
                },
                fields: ["playlists"]
              })
              .then(result => {
                let docs = result.docs[0];
                let playlists = docs.playlists;
                if (playlists) {
                  let data = this.$lodash.find(playlists, {
                    _key: key
                  });
                  let playlist = data.tracks;
                  if (playlist != undefined) {
                    if (playlist.length > nextIndex) {
                      this.$eventBus.$emit("playlist-nextMusicPlay", nextIndex);
                    }
                  }
                }
              });
          } else {
            let all = this.getAllPlayList();
            // 다음 인덱스
            let playlist = this.$lodash.find(all, {
              playlistId: musicData.name
            });
            if (playlist != undefined) {
              if (playlist.list.length > nextIndex) {
                this.$eventBus.$emit("playlist-nextMusicPlay", nextIndex);
              }
            }
          }
        }
      }
      this.status = [];
    },
    onNewReleaseCheck() {
      this.$db
        .get("adfe10ffbd1f206762f478326800a5b6")
        .then(doc => {
          console.log("doc => ", doc);
          let live_version = `${doc.version}`;
          let local_version = this.$version;
          // new version.
          if (live_version != local_version) {
            this.isCheck = true;
            this.$store.commit("setVersionCheck", true);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    test() {
      this.$modal.show("dialog", {
        title: "알림",
        text: "Development in progress ...",
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
.md-ripple .md-button-content {
  padding-left: 5px;
}

i {
  padding-right: 5px;
}

.position {
  position: absolute;
  bottom: 29px;
  right: 9px;
  width: 14px;
  z-index: 99999;
}

.tab-navi {
  background-color: #1d232f !important;
  border-top: 1px solid #000000;
  overflow: hidden;
  position: fixed;
  bottom: 0px;
  width: 100%;
  z-index: 1000;
}

.md-list-item {
  border-bottom: 1px solid #171e2d;
}

.md-tabs-navigation {
  background-color: #1d232f !important;
}

.md-tabs-navigation .md-button {
  float: left;
  display: block;
  width: 100%;
  color: #f2f2f2 !important;
  text-align: center;
  padding: 15px 19.4px;
  text-decoration: none;
  height: 42px !important;
  font-size: 11px !important;
  font-weight: 700;
}

/* .md-active {
  color: #000000 !important;
  background: #ffffff !important;
} */

.badge {
  width: 10px;
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 13px;
  bottom: 27px;
  background: #f94848;
  border-radius: 100%;
  color: #fff;
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: -0.05em;
  z-index: 10000;
}
</style>
