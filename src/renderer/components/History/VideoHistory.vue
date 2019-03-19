<template>
  <div>
    <top-header :isShow="false"/>
    <div class="wrapper">
      <el-row v-if="isLogin">
        <el-col>
          <div class="menu1_tip">
            <div>
              <img width="20" style="margin-bottom: 10px;" src="@/assets/images/svg/playlist.svg">
              <span class="collections">{{ $t('HISTORY.MENU_NAME') }}</span>
            </div>
            <strong class="tr" style="font-size:11px;">{{ $t('HISTORY.MENU_DESC') }}</strong>
          </div>
        </el-col>
      </el-row>

      <md-list v-if="isLogin" id="list" class="historyList" :class="{ staticHeight: isMini }">
        <md-list-item :id="`item${index}`" v-for="(item, index) in playlist" :key="index">
          <md-avatar style="margin-right: 0;">
            <img :src="item.image">
          </md-avatar>

          <span class="md-list-item-text music-title cursor">{{ item.title }}</span>
          <span class="label_video">{{ item.duration }}</span>
          <a class="cursor" @click="openContext(item)">
            <img class="contextMenu" src="@/assets/images/svg/context-menu.svg">
          </a>
        </md-list-item>
        <div class="bottom" v-if="playlist.length > 0">
          <img src="@/assets/images/youtube/dev.png">
        </div>
      </md-list>
      <el-row v-else>
        <el-col>
          <p class="notLogin">{{ $t('HISTORY.NO_LOGIN') }}</p>
        </el-col>
        <el-col class="link" style="margin-top:10px;">
          <md-button
            class="md-raised md-primary btn"
            @click="signLink"
          >{{ $t('COLLECTION.NO_LOGIN_BUTTON_LINK') }}</md-button>
        </el-col>
      </el-row>
    </div>

    <!-- 로딩 컴포넌트 -->
    <transition name="fade">
      <loading v-show="!load"/>
    </transition>

    <context-menu :isShow="contextShow" :data="selectedData" @close="contextShow = false"/>

    <!-- 서브 플레이어 -->
    <sub-player-bar v-show="isMini"/>
  </div>
</template>

<script>
import Loading from "@/components/Commons/Loader/PageLoading";
import storeMixin from "@/components/Commons/Mixin/index";
import DataUtils from "@/components/Commons/Mixin/db";
import SubPlayerBar from "@/components/PlayerBar/SubPlayerBar";
import ContextMenu from "@/components/Context/ContextMenu";

export default {
  name: "VideoHistory",
  mixins: [storeMixin, DataUtils],
  components: {
    ContextMenu,
    SubPlayerBar,
    Loading
  },
  data() {
    return {
      contextShow: false,
      isLogin: false,
      isMini: false,
      load: false,
      selectedData: null,
      playlist: []
    };
  },
  beforeCreate() {
    this.load = false;
  },
  created() {

    const data = { url: `${this.$version}/VideoHistorys` }
    this.$ipcRenderer.send('pageView', data)

    this.isLogin = this.getUserId() ? true : false;
    this.isMini = this.getMusicInfos() ? true : false;
  },
  mounted() {
    if (this.isLogin) {
      this.getHistory();
    } else {
      this.load = true;
    }
  },
  methods: {
    openContext(data) {
      this.$set(this, "selectedData", data);
      this.contextShow = true;
    },
    getHistory() {
      this.createIndex(["creates"]).then(() => {
        this.$test
          .find({
            selector: {
              type: "history",
              userId: this.getUserId(),
              creates: {
                $gte: null
              }
            },
            sort: [{ creates: "desc" }]
          })
          .then(result => {
            let docs = result.docs;
            if (docs.length > 0) {
              this.playlist = docs;
            }
          });
      });
      this.load = true;
    },
    signLink() {
      this.$router.push({
        name: "login"
      });
    }
  }
};
</script>

<style scoped>
.historyList {
  overflow-y: scroll;
  max-height: 455px;
  border-top: 1px solid rgba(23, 30, 45, 0.48);
}
.notLogin {
  margin-top: 200px;
}
.staticHeight {
  max-height: 420px;
}
.btn {
  color: #ffffff;
  background: #448aff;
  width: 140px;
}
</style>