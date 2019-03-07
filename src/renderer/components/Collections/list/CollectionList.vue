/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

<template>
  <div>
    <top-header @my-sync-list="getMyCollectionList"/>
    <div class="wrapper">
      <!-- 로그인 상태 -->
      <el-row>
        <el-col>
          <div class="menu1_tip">
            <div>
              <img width="20" style="margin-bottom: 10px;" src="@/assets/images/svg/collection.svg">
              <span class="collections">{{ $t('COLLECTION.MENU.COLLECTION') }}</span>
            </div>
            <strong class="tr" style="font-size:11px;">{{ $t('COLLECTION.ALBUM_INDEX') }}</strong>
          </div>
        </el-col>
      </el-row>
      <!-- 로그인 상태 -->
      <el-row class="el-scroll" :class="{ dynamicHeight: isSub }">
        <!-- 재생목록 -->
        <el-col>
          <div class="menu1">
            <label class="wh" v-if="playType === 'play'">
              <strong style="margin-left: 5px;">{{ $t('COLLECTION.MENU.PLAY_LIST') }}</strong>
            </label>
            <label class="wh" v-else-if="playType === 'channel'">
              <strong style="margin-left: 5px;">{{ $t('COLLECTION.MENU.CHANNEL') }}</strong>
            </label>
            <label class="wh" v-else>
              <strong style="margin-left: 5px;">MY COLLECTIONS</strong>
            </label>
          </div>
        </el-col>

        <!-- NO PLAYLIST -->
        <el-col
          class="noList"
          v-if="isLogin && playlists.length === 0"
        >{{ $t('COLLECTION.NO_PLAYLIST') }}</el-col>

        <!-- PLAY LIST -->
        <el-col v-else class="cols" v-for="item in playlists" :key="item._id" :span="12">
          <el-card class="thumb" :body-style="{ padding: '0px' }">
            <div class="overlay">
              <img
                class="md-image thumbnail"
                :src="item.thumbnails"
                :class="{ channelThumb: playType === 'channel' }"
                width="158"
                height="100"
              >
              <div class="myCollectionLabel" v-if="playType === 'my-collection'">
                <span class="label_related label_v">{{ item.category }}</span>
              </div>
              <div class="playWrapper" :class="{ channelWrapper: playType === 'channel' }">
                <div class="overlayMenu" :class="{ channelMenu: playType === 'channel' }">
                  <a class="cursor" @click="showMusicList(item)" title="Play">
                    <font-awesome-icon class="f25 fa" icon="play"/>
                  </a>
                  <a class="cursor" @click="showRemove(item)" title="Remove">
                    <font-awesome-icon class="f25 fa" icon="times"/>
                  </a>
                  <a
                    class="cursor"
                    @click="showCoverModal(item)"
                    title="Cover change"
                    v-if="playType !== 'channel'"
                  >
                    <font-awesome-icon class="f25 fa" icon="images"/>
                  </a>
                </div>
              </div>
            </div>
            <div class="channelForm">
              <div class="titleflow">
                <span class="sub">{{ item.title }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- // end 재생목록 -->
      </el-row>
    </div>
    <!-- 서브 플레이어 컴포넌트 -->
    <sub-player-bar v-show="isSub"/>

    <!-- 로딩 컴포넌트 -->
    <loading v-show="!load"></loading>

    <!-- 커버 이미지 변경 -->
    <cover-change-modal ref="coverModal" :data="selectedData" @is-success="saveCover"/>
  </div>
</template>

<script>
import DataUtils from "@/components/Commons/Mixin/db";
import CollectionQueryMixin from "@/components/Commons/Mixin/collections";
import MyQueryMixin from "@/components/Commons/Mixin/mycollection";
import CoverChangeModal from "@/components/Collections/cover/CollectionCoverChange";
import StoreMixin from "@/components/Commons/Mixin/index";
import SubPlayerBar from "@/components/PlayerBar/SubPlayerBar";
import Loading from "@/components/Commons/Loader/PageLoading";

export default {
  name: "CollectionList",
  mixins: [StoreMixin, CollectionQueryMixin, MyQueryMixin, DataUtils],
  components: {
    CoverChangeModal,
    SubPlayerBar,
    Loading
  },
  data() {
    return {
      isSub: false,
      load: false,
      playlists: [],
      data: null,
      playType: null,
      selectedData: null,
      isLogin: false
    };
  },
  created() {
    this.init();
  },
  mounted() {
    if (this.playType === "my-collection") {
      this.getMyCollectionList();
    } else {
      this.getCollectionList();
    }
  },
  methods: {
    init() {
      if (this.getUserId()) {
        this.isLogin = true;
      }
      this.playType = this.$route.params.playType;
    },

    showRemove(data) {
      this.$modal.show("dialog", {
        title: "Info",
        text: this.$t("COLLECTION.REMOVE_ALBUM"),
        buttons: [
          {
            title: "Yes",
            handler: () => {
              this.$set(this, "data", data);
              this.$set(this, "playType", data.playType);
              if (data.category) {
                this.myCollectionRemove(data, "list");
              } else {
                this.albumCollectionRemoveCallback(data);
              }
            }
          },
          {
            title: "Close"
          }
        ]
      });
    },
    showMusicList(item) {
      console.log(item)
      this.$store.commit("setPath", this.$route.path);
      if (item.category) {
        this.$router.push({
          name: "NOT-MY-PLAYLIST",
          params: {
            playType: "self",
            id: item._id,
            doc: item
          }
        });
      } else {
        this.$router.push({
          name: "NOT-PLAYING-PLAYLIST",
          params: {
            playType: item.playType,
            id: item.playType === "play" ? item.playlistId : item.channelId
          }
        });
      }
    },
    showCoverModal(item) {
      this.$refs.coverModal.showModal();
      this.$set(this, "selectedData", item);
    },
    saveCover(data) {
      if (data) {
        if (data.playType === "play") {
          this.getCollectionList();
        } else if (data.playType === "channel") {
          this.getChannelList();
        } else {
          this.getMyCollectionList();
        }
      }
    }
  }
};
</script>

<style scoped>
.dynamicHeight {
  height: 410px !important;
}

.c-add {
  float: right;
  color: #ffffff;
  min-width: 40px;
  height: 20px;
  margin-bottom: 0;
}

.el-card {
  border: none;
  border-radius: 0px;
  background-color: rgba(255, 255, 255, 0);
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
</style>
