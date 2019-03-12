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
        <el-dropdown-item class="bold" command="A5" :disabled="user === null">
          <i class="el-icon-edit-outline"></i> Change Cover
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
  </div>
</template>

<script>
import StoreMixin from "@/components/Commons/Mixin/index";

export default {
  name: "MyContextMenu",
  mixins: [StoreMixin],
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
              text: self.$t("CONTEXT.MESSAGE.CLIPBOARD_SAVE"),
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
              text: self.$t("CONTEXT.MESSAGE.CLIPBOARD_FAIL"),
              buttons: [
                {
                  title: "Close"
                }
              ]
            });
          }
        );
      } else if (ev === "A4") {
        let musicInfo = this.getMusicInfos();
        if (musicInfo) {
          if (this.videoId === musicInfo.videoId) {
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
      } else {
        // A5
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
          this.videoId
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
            deletedVideoId: this.videoId,
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
