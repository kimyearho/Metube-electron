/*--------------------------------------------------------------------------------------------- *
Licensed under the GPL-3.0 License. See License.txt in the project root for license information. *
You can not delete this comment when you deploy an application.
*--------------------------------------------------------------------------------------------*/ 

<template>
  <div id="app">
    <!-- 루트 라우터 뷰 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>

    <!-- 하단 네비게이션 -->
    <md-tabs class="tab-navi">
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
    <v-dialog
      :width="300"
      :height="300"
      :clickToClose="false"
    />
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
  created() {
    // API 인증
    this.apiAuthentication()

    // 프로덕션 환경에서만 버전체크 실행
    if (process.env.NODE_ENV !== "development") {
      this.onNewReleaseCheck();
    }
  },
  mounted() {
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
    this.$trap.bind("left", () => {
      const volume = Number(this.getVolume()) - 5;
      if (volume >= 0) {
        this.$store.commit("setVolume", volume);
        this.$ipcRenderer.send("win2Player", ["setVolume", volume]);
      }
    });
    this.$trap.bind("right", () => {
      const volume = Number(this.getVolume()) + 5;
      if (volume <= 100) {
        this.$store.commit("setVolume", volume);
        this.$ipcRenderer.send("win2Player", ["setVolume", volume]);
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

    apiAuthentication() {
      this.$db.get("cfb9d27f0b59d3fbc55073830f009acc").then(result => {
        let apiKey = ""
        const keyList = result.key_list
        if (process.env.NODE_ENV === "development") {
          console.log('dev')
          // dev
          const service = this.$lodash.find(keyList, { "service-type": "dev" })
          apiKey = service.apiKey
        } else {
          // production
          const service = this.$lodash.find(keyList, { "service-type": "production1" })
          apiKey = service.apiKey
        }
        this.$store.commit("setKeys", apiKey)
      })
    },

    onNewReleaseCheck() {
      // this.$db
      //   .get("17901f376f4ff226c03adecee0004104")
      //   .then(doc => {
      //     let live_version = `${doc.version}`;
      //     let local_version = this.$version;
      //     if (live_version != local_version) {
      //       this.$modal.show("dialog", {
      //         title: "Info",
      //         text: this.$t("SETTING.NEW_RELEASE"),
      //         buttons: [
      //           {
      //             title: "Yes",
      //             handler: () => {
      //               this.$ipcRenderer.send("showGit", null);
      //               this.$modal.hide("dialog");
      //             }
      //           },
      //           {
      //             title: "Close"
      //           }
      //         ]
      //       });
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
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
