<template>
  <div>
    <top-header :isShow="false"/>
    <div class="wrapper">
      <el-row v-if="isLogin">
        <el-col>
          <div class="menu1_tip">
            <div>
              <img width="20" style="margin-bottom: 10px;" src="@/assets/images/svg/playlist.svg">
              <span class="collections">Play History</span>
            </div>
            <strong class="tr" style="font-size:11px;">A list of 20 videos you recently watched.</strong>
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
          <context-menu :videoId="item.videoId" :data="item"/>
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

    <!-- 서브 플레이어 -->
    <sub-player-bar v-show="isMini"/>
  </div>
</template>

<script>
import * as $commons from "@/service/commons-service.js";
import Loading from "@/components/Loader/loader";
import storeMixin from "@/components/Mixin/index";
import DataUtils from "@/components/Mixin/db";
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
      isLogin: false,
      isMini: false,
      load: false,
      playlist: []
    };
  },
  beforeCreate() {
    this.load = false;
  },
  created() {
    this.isLogin = this.getUserId() ? true : false;
    this.isMini = this.getMusicInfos() ? true : false;
    if (this.isLogin) {
      this.getHistory();
    } else {
      this.load = true;
    }
  },
  mounted() {},
  methods: {
    getHistory() {
      this.createIndex(["type", "userId", "creates", "videoId"]).then(() => {
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