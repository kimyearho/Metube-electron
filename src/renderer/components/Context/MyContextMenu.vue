/*--------------------------------------------------------------------------------------------- *
Licensed under the GPL-3.0 License. See License.txt in the project root for license information. *
You can not delete this comment when you deploy an application.
*--------------------------------------------------------------------------------------------*/ 'use
strict';

<template>
  <div>
    <el-dropdown trigger="click" @command="menuEvent" style="padding-left:5px;">
      <a class="cursor">
        <img class="contextMenu" src="@/assets/images/svg/context-menu.svg">
      </a>
      <el-dropdown-menu slot="dropdown" v-if="videoId === data.videoId">
        <el-dropdown-item class="bold" command="A1" :disabled="user === null">
          <i class="el-icon-news"></i> Open Youtube
        </el-dropdown-item>
        <!-- <el-dropdown-item class="bold" command="A2" :disabled="user === null">
          <i class="el-icon-share"></i> Social Share
        </el-dropdown-item>-->
        <el-dropdown-item class="bold" command="A3" :disabled="user === null">
          <i class="el-icon-star-on"></i> Link Copy
        </el-dropdown-item>
        <el-dropdown-item class="bold" command="A4" :disabled="user === null">
          <i class="el-icon-delete"></i> Remove
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <social-share-modal :isOpen="isShare" :videoId="videoId" @closeModal="closeModal"/>
  </div>
</template>

<script>
import StoreMixin from "@/components/Mixin/index";
import SocialShareModal from "@/components/Context/modal/SocialShareModal";

export default {
  name: "MyContextMenu",
  mixins: [StoreMixin],
  components: {
    SocialShareModal
  },
  props: {
    id: String,
    videoId: String,
    index: Number,
    data: Object
  },
  data() {
    return {
      user: null,
      isShare: false
    };
  },
  mounted() {
    this.user = this.getUserId();
  },
  methods: {
    closeModal() {
      this.isShare = false;
    },
    menuEvent(ev) {
      if (ev === "A1") {
        this.watchYoutube();
      } else if (ev === "A2") {
        this.isShare = true;
      } else if (ev === "A3") {
        let link = `https://www.youtube.com/watch?v=${this.videoId}`;
        let self = this;
        this.$copyText(link).then(
          function(e) {
            self.$modal.show("dialog", {
              title: "Success",
              text: "😁 The link has been saved to the clipboard.",
              buttons: [
                {
                  title: "Close"
                }
              ]
            });
          },
          function(e) {
            self.$modal.show("dialog", {
              title: "Error",
              text: "😥 Failed to copy link to clipboard.",
              buttons: [
                {
                  title: "Close"
                }
              ]
            });
          }
        );
      } else {
        let musicInfo = this.getMusicInfos();
        if (musicInfo) {
          if (this.videoId === musicInfo.videoId) {
            this.$modal.show("dialog", {
              title: "Info",
              text: "You can not delete videos that are playing",
              buttons: [
                {
                  title: "Close"
                }
              ]
            });
          } else {
            this.deleteDialog();
          }
        } else {
          this.deleteDialog();
        }
      }
    },
    watchYoutube() {
      if (this.videoId) {
        this.$ipcRenderer.send(
          "button:watchYoutubePopup",
          `https://www.youtube.com/watch?v=${this.videoId}`
        );
      }
    },
    deleteDialog() {
      this.$modal.show("dialog", {
        title: "Info",
        text: this.$t("COLLECTION.REMOVE_VIDEO"),
        buttons: [
          {
            title: "Yes",
            handler: () => {
              this.delete();
              this.$modal.hide("dialog");
            }
          },
          {
            title: "Close"
          }
        ]
      });
    },
    delete() {
      this.$test.remove(this.data).then(result => {
        if (result.ok) {
          if (this.getMusicInfos() != undefined) {
            let musicInfos = this.getMusicInfos();
            let playIndex = musicInfos.index;
            if (playIndex > this.index) {
              // 삭제한 비디오 인덱스가 0일때
              musicInfos.index = musicInfos.index - 1;
              // 재생정보 세팅
              this.$store.commit("setPlayingMusicInfo", musicInfos);
              // 재생정보 변경 이벤트
              this.$eventBus.$emit("playMusicSetting");
            }
          }
          // 삭제 후 삭제한 비디오아이디를 전달한다.
          this.$emit("is-success", { deletedVideoId: this.videoId });
        }
      });
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 320px;
  height: 42px;
}

.el-mgn {
  margin-top: 8px;
  margin-left: 26px;
}

.el-button--mini,
.el-button--mini.is-round {
  padding: 5px 2px;
}

.close {
  width: 20px;
  position: absolute;
  right: 27px;
  top: 305px;
}
.contextMenu {
  width: 15px;
  height: 15px;
}
.bold {
  font-weight: 500;
}
.el-message {
  min-width: 310px;
}
</style>
