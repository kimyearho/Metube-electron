/*--------------------------------------------------------------------------------------------- *
Licensed under the GPL-3.0 License. See License.txt in the project root for license information. *
You can not delete this comment when you deploy an application.
*--------------------------------------------------------------------------------------------*/ 'use
strict';

<template>
  <div id="app">
    <!-- 루트 라우터 뷰 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>

    <!-- 하단 네비게이션 -->
    <md-tabs class="tab-navi">
      <md-tab id="tabSearch" class="md-tab" md-label="Search" @click="route('search')"></md-tab>
      <md-tab id="tabCollection" class="md-tab" md-label="Collections" @click="route('collection')"></md-tab>
      <md-tab id="tabHistory" class="md-tab" md-label="History" @click="route('history')"></md-tab>
    </md-tabs>
    <v-dialog :width="300" :height="300" :clickToClose="false"/>
  </div>
</template>

<script>
import StoreMixin from "@/components/Mixin/index";
import DataUtils from "@/components/Mixin/db";

export default {
  name: "App",
  mixins: [StoreMixin, DataUtils],
  data() {
    return {
      isShow: false,
      isSpinShow: false,
      state: "",
      status: []
    };
  },
  beforeCreate() {
    // 이벤트 버스 종료
    this.$eventBus.$off("statusCheck");
    this.$eventBus.$off("playTypeControl");
    this.$eventBus.$off("playlist-nextMusicPlay");
    this.$eventBus.$off("playlist-nextLoad");
  },
  created() {
    // 프로덕션 환경에서만 버전체크 실행
    if (process.env.NODE_ENV !== "development") {
      this.onNewReleaseCheck();
    }

    // 비디오 상태 체크 이벤트 수신
    this.$eventBus.$on("statusCheck", this.videoStatusCheck);
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

    /**
     * 비디오 상태 체크
     * 재생불가능한 비디오를 감시한다
     */
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
      }, 15000);
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
            this.createIndex(["userId", "parentId"]).then(result => {
              return this.$test
                .find({
                  selector: {
                    userId: {
                      $eq: this.getUserId()
                    },
                    parentId: {
                      $eq: musicData.parentId
                    }
                  },
                  limit: 100
                })
                .then(result => {
                  const docs = result.docs;
                  if (docs) {
                    if (docs.length > nextIndex) {
                      this.$eventBus.$emit("playlist-nextMusicPlay", nextIndex);
                    }
                  }
                });
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
        .get("17901f376f4ff226c03adecee0004104")
        .then(doc => {
          let live_version = `${doc.version}`;
          let local_version = this.$version;
          if (live_version != local_version) {
            this.$modal.show("dialog", {
              title: "Info",
              text: this.$t("SETTING.NEW_RELEASE"),
              buttons: [
                {
                  title: "Yes",
                  handler: () => {
                    this.$ipcRenderer.send("showGit", null);
                    this.$modal.hide("dialog");
                  }
                },
                {
                  title: "Close"
                }
              ]
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scope>
.position {
  position: absolute;
  bottom: 29px;
  right: 9px;
  width: 14px;
  z-index: 99999;
}

.tab-navi {
  border-top: 1px solid #000000;
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
</style>
