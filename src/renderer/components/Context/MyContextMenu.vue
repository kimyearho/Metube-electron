/*--------------------------------------------------------------------------------------------- *
Licensed under the GPL-3.0 License. See License.txt in the project root for license information. *
You can not delete this comment when you deploy an application.
*--------------------------------------------------------------------------------------------*/ 
'use strict';

<template>
  <div>
    <el-dialog
      class="contextModal"
      :visible="isShow"
      style="text-align:center;padding: 14px;"
      :show-close="false"
      :before-close="closeModal"
      :append-to-body="true"
    >
      <md-button
        class="md-raised"
        @click="watchYoutube"
      >
        <i class="el-icon-news"></i> Open Youtube
      </md-button>
      <md-button
        class="md-raised md-primary"
        @click="changeCover"
      >
        <i class="el-icon-edit-outline"></i> Change Cover
      </md-button>
      <md-button
        class="md-raised"
        @click="copyClipboard"
      >
        <i class="el-icon-star-on"></i> Link Copy
      </md-button>
      <md-button
        class="md-raised md-accent"
        @click="remove"
      >
        <i class="el-icon-delete"></i> Remove
      </md-button>
    </el-dialog>
  </div>
</template>

<script>
import StoreMixin from "@/components/Commons/Mixin/index";

export default {
  name: "MyContextMenu",
  mixins: [StoreMixin],
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    index: Number,
    data: Object
  },
  data() {
    return {
      user: null
    };
  },
  mounted() {
    this.user = this.getUserId();
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    copyClipboard() {
      let link = `https://www.youtube.com/watch?v=${this.data.videoId}`;
      let self = this;
      this.$copyText(link).then(
        function (e) {
          self.closeModal();
          self.$modal.show("dialog", {
            title: "Success",
            text: self.$t("CONTEXT.MESSAGE.CLIPBOARD_SAVE"),
            buttons: [
              {
                title: "Close"
              }
            ]
          });
        },
        function (e) {
          self.$modal.show("dialog", {
            title: "Error",
            text: self.$t("CONTEXT.MESSAGE.CLIPBOARD_FAIL"),
            buttons: [
              {
                title: "Close"
              }
            ]
          });
        }
      );
    },
    changeCover() {
      this.closeModal();
      this.$modal.show("dialog", {
        title: "Info",
        text: this.$t("CONTEXT.MESSAGE.COVER_CHANGE"),
        buttons: [
          {
            title: "Yes",
            handler: () => {
              this.updateMyCollectionCover();
              this.$modal.hide("dialog");
            }
          },
          {
            title: "Close"
          }
        ]
      });
    },
    remove() {
      let musicInfo = this.getMusicInfos();
      if (musicInfo) {
        if (this.data.videoId === musicInfo.videoId) {
          if (musicInfo.type !== "mycollectionItem") {
            // 삭제
            this.deleteDialog();
          } else {
            this.$modal.show("dialog", {
              title: "Info",
              text: this.$t("CONTEXT.MESSAGE.VIDEO_REMOVE_FAIL"),
              buttons: [
                {
                  title: "Close"
                }
              ]
            });
          }
        } else {
          this.deleteDialog();
        }
      } else {
        this.deleteDialog();
      }
    },
    watchYoutube() {
      if (this.data.videoId) {
        this.closeModal();
        this.$ipcRenderer.send(
          "button:watchYoutubePopup",
          `https://www.youtube.com/watch?v=${this.data.videoId}`
        );
      }
    },
    deleteDialog() {
      this.closeModal()
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
    updateMyCollectionCover() {
      this.$test.get(this.data.parentId).then(doc => {
        doc.thumbnails = this.data.thumbnails;
        return this.$test.put(doc).then(result => {
          if (result.ok) {
            this.$emit("is-cover", true);
          } else {
            this.$emit("is-cover", false);
          }
        });
      });
    },
    delete() {
      this.$test.remove(this.data).then(result => {
        // 실제 DB에 등록 된 내 컬렉션 재생목록정보의 아이디 값
        const parentId = this.data.parentId;
        this.getLog(
          "[MyContextMenu]/[delete] 실제 DB에 등록 된 내 컬렉션 재생목록정보 아이디 ====> ",
          parentId
        );
        this.getLog(
          "[MyContextMenu]/[delete] 실제 DB에서 삭제한 비디오 아이디 ====> ",
          this.data.videoId
        );
        if (result.ok) {
          if (this.getMusicInfos()) {
            let musicInfos = this.getMusicInfos();

            // 현재 재생중인데 내 컬렉션일때만,
            // 이 조건이 없으면 유튜브 재생목록 재생 중에, 내 컬렉션 0번째 삭제 후 인덱스가 교체 되버림.
            if (musicInfos.type === "mycollectionItem") {
              let playIndex = musicInfos.index;
              // 내 컬렉션에서 0번째 음악을 삭제했을경우 처리
              if (playIndex > this.index) {
                // 삭제한 비디오 인덱스가 0일때
                musicInfos.index = musicInfos.index - 1;
                // 재생정보 세팅
                this.$store.commit("setPlayingMusicInfo", musicInfos);
                // 재생정보 변경 이벤트
                this.$eventBus.$emit("playMusicSetting");
              }
            }
          }

          // 삭제 후 삭제한 비디오아이디를 전달한다.
          this.$emit("is-success", {
            deletedVideoId: this.data.videoId,
            myCollectionId: parentId
          });
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

.contextModal >>> .el-dialog {
  position: relative;
  margin-top: 35vh !important;
  margin: 0 auto 50px;
  background: #242d40de;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 340px !important;
}

.contextModal >>> .el-dialog__header {
  padding: 0px;
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
