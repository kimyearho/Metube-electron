<template>
  <div class="titlebar">
    <div class="notch">
      <span class="logo" :class="{ noMenu: !isMenu }">{{ $t('MAIN.APP_NAME') }}</span>
    </div>
    <!-- 제목 바 -->
    <span class="notiButton">
      <img
        v-show="isMenu"
        @click="showNavigation = true"
        width="18"
        class="cursor"
        src="@/assets/images/svg/menu.svg"
      >
    </span>
    <span class="topButton">
      <div class="minimize cursor" @click="minimize" style="margin-right: 5px;" title="minimize"></div>
      <div class="close cursor" @click="close" title="exit"></div>
    </span>

    <!-- 유튜브 재생목록 링크 팝업 -->
    <modal
      name="input-focus-modal"
      :width="300"
      :height="150"
      :clickToClose="false"
      :adaptive="true"
    >
      <el-form ref="form" style="margin:5px;">
        <el-form-item label="Search Playlist" class="linkform">
          <el-input v-model="linkForm" :autofocus="true" placeholder="Add a YouTube Playlist URL"/>
        </el-form-item>
        <el-form-item class="buttonform">
          <el-button type="primary" size="small" @click="apply">Apply</el-button>
          <el-button size="small" @click="closeModal">Close</el-button>
        </el-form-item>
      </el-form>
    </modal>

    <!-- Left 메뉴 -->
    <md-drawer
      :md-active.sync="showNavigation"
      style="background: #242d40; width: 190px; z-index:199;"
    >
      <md-toolbar class="md-transparent">
        <div class="picture" v-if="profileData">
          <img class="userPicture" :src="profileData.googlePicture">
          <div class="userName">{{ profileData.googleName }}</div>
        </div>

        <div v-else>
          <img
            width="190"
            src="@/assets/images/logo.jpg"
          >
        </div>
      </md-toolbar>

      <md-list>
        <!-- Menu1 -->
        <md-list-item @click="route('search')">
          <md-icon>search</md-icon>
          <span class="md-list-item-text">{{ $t('MAIN.MENU.SEARCH') }}</span>
        </md-list-item>

        <!-- Menu1 -->
        <md-list-item @click="route('collection')">
          <md-icon>collections_bookmark</md-icon>
          <span class="md-list-item-text">{{ $t('MAIN.MENU.COLLECTION') }}</span>
        </md-list-item>

        <!-- Menu1 -->
        <md-list-item @click="route('history')">
          <md-icon>playlist_play</md-icon>
          <span class="md-list-item-text">{{ $t('MAIN.MENU.HISTORY') }}</span>
        </md-list-item>

        <!-- Menu1 -->
        <md-list-item @click="route('login')">
          <md-icon>vertical_align_bottom</md-icon>
          <span class="md-list-item-text">{{ $t('MAIN.MENU.SIGN') }}</span>
        </md-list-item>

        <!-- Menu2 -->
        <md-list-item @click="route('setting')">
          <md-icon>settings</md-icon>
          <span class="md-list-item-text">{{ $t('MAIN.MENU.SETTING') }}</span>
        </md-list-item>

        <!-- Menu2 -->
        <md-list-item @click="route('faq')">
          <md-icon>settings</md-icon>
          <span class="md-list-item-text">FAQ</span>
        </md-list-item>
      </md-list>
    </md-drawer>

    <!-- 신규 컬렉션 등록 -->
    <create-from :isOpen="isCreate" @is-success="myCollectionSync" @is-close="closeCreateModal"/>
  </div>
</template>

<script>
import * as query from "querystring";
import StoreMixin from "@/components/Commons/Mixin/index";
import MyQueryMixin from "@/components/Commons/Mixin/mycollection";
import CreateFrom from "@/components/MyCollection/create/MyCollectionCreate";

export default {
  name: "Header",
  mixins: [StoreMixin, MyQueryMixin],
  components: {
    CreateFrom
  },
  data() {
    return {
      isCheck: false,
      isCreate: false,
      isUser: false,
      profileData: "",
      playType: null,
      linkForm: null,
      showNavigation: false,
      polling1: null,
      polling2: null
    };
  },
  props: {
    data: {
      type: Object
    },
    isMenu: {
      type: Boolean,
      default: true
    },
    create: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    create(val) {
      this.isCreate = val;
    }
  },
  mounted() {
    this.isUser = this.getUserId();
    if (this.isUser) {
      this.profileData = this.getProfile();
    }
    if (this.data) {
      this.playType = this.data.playType;
    }
  },
  methods: {
    reloadUser() {
      this.isUser = this.getUserId();
      if (this.isUser) {
        this.profileData = this.getProfile();
      } else {
        this.profileData = null;
      }
    },
    apply() {
      let parseURL;
      let url = this.linkForm;
      if (url) {
        // 실제 나의 재생목록 URL일 경우
        if (url.indexOf("playlist") > -1) {
          parseURL = query.parse(url, "?");
        } else {
          parseURL = query.parse(url);
        }
        if (parseURL) {
          let playlistId = parseURL.list;
          if (playlistId) {
            this.$router.push({
              name: "NOT-PLAYING-PLAYLIST",
              params: {
                playType: "play",
                id: playlistId
              }
            });
            if (this.$route.name === "NOT-PLAYING-PLAYLIST") {
              this.$emit("reloadMusicList");
            }
            this.linkForm = "";
            this.closeModal();
          } else {
            this.errorDialog();
          }
        }
      } else {
        this.errorDialog();
      }
    },
    route(name) {
      if (name == "search") {
        this.$router.push({
          name: "play-search"
        });
      } else if (name === "collection") {
        this.$router.push({
          name: "collection"
        });
      } else if (name === "history") {
        this.$router.push({
          name: "VIDEO-HISTORY"
        });
      } else if (name === "login") {
        this.$router.push({
          name: "login"
        });
      } else if (name === "setting") {
        this.$router.push({
          name: "setting"
        });
      } else if(name === "faq") {
        this.$router.push({
          name: "faq"
        })
      }
    },
    close() {
      // 일단 임시로
      // PLAY LIST 및 채널은 토큰을 많이 소비하지 않음.
      // 검색 및 연관검색이 토큰을 많이 소모한다.
      // 따라서, DB를 세가지로 나눌필요가 있음.
      // 연관검색은 보관처리하고, PLAY LIST 및 채널은 주기별로 캐싱한 뒤 초기화 하는 방식으로 구현해야한다.
      // this.$local.destroy().then(result => { console.log(result) });

      let self = this;
      setTimeout(() => {
        self.$ipcRenderer.send("button:close", null);
      }, 1500);
    },
    closeModal() {
      this.$modal.hide("input-focus-modal");
    },
    closeCreateModal(value) {
      this.$emit("create-close", value);
    },
    myCollectionSync() {
      // 컬렉션 목록이나, 내 컬렉션 목록에서만 싱크 실행
      if (this.$route.name === "collection") {
        this.$emit("my-sync");
      } else if (this.$route.name === "COLLECTION-LIST") {
        /** @overide */
        this.$emit("my-sync-list");
      }
    },
    minimize() {
      this.$ipcRenderer.send("button:minimize", null);
    },
    errorDialog() {
      this.$modal.show("dialog", {
        title: "Error",
        text: "The URL you entered is invalid.",
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

<style scoped>
.notch {
  position: absolute;
  border-top: 30px solid rgba(0, 0, 0, 0.1);
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  height: 0;
  width: 245px;
  top: 0;
  left: 60px;
  z-index: 1;
}

.logo {
  font-size: 16px;
  position: absolute;
  width: 140px;
  left: 33px;
  right: 0;
  top: -25px;
}

.md-icon.md-theme-default.md-icon-font {
  color: #ffffff !important;
}

.md-title {
  display: inline-block;
  max-width: 190px;
  font-size: 12px;
  margin-top: 8px !important;
  margin-left: 15px !important;
}

.md-list-item-text {
  color: #ffffff;
}
.md-list-item-text:hover {
  color: #28b1ff;
}

.titlebar {
  -webkit-app-region: drag;
  padding: 5px;
  color: #ffffff;
  font-weight: 700;
  text-align: center;
  border-bottom: 1px solid rgba(35, 35, 35, 0.73);
  height: 28px;
  z-index: 101;
}

.notiButton {
  -webkit-app-region: no-drag;
  float: left;
}

.topButton {
  -webkit-app-region: no-drag;
  float: right;
}

.topButton img {
  vertical-align: middle;
}

.linkform {
  padding: 0px 5px 0px 5px;
  margin-bottom: 12px;
}

.buttonform {
  padding: 0px 5px 0px 5px;
  text-align: center;
}

.close {
  background: #ff5c5c;
  font-size: 9pt;
  width: 11px;
  height: 11px;
  border: 1px solid #e33e41;
  border-radius: 50%;
  display: inline-block;
}

.minimize {
  background: #ffbd4c;
  font-size: 9pt;
  line-height: 16px;
  margin-left: 15px;
  margin-right: 5px;
  width: 11px;
  height: 11px;
  border: 1px solid #e09e3e;
  border-radius: 50%;
  display: inline-block;
}

.picture {
  margin-top: 20px;
  margin-left: 50px;
}

.userPicture {
  width: 70px;
  border-radius: 50px;
}

.userName {
  margin-top: 15px;
  margin-bottom: 20px;
  color: #ffffff;
  font-size: 15px;
}

.noLogin {
  margin-top: 0px;
  margin-left: 30px;
}

.noLogin >>> .el-button {
  padding: 5px 40px 5px 40px;
}
</style>
