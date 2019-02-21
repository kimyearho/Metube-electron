/*--------------------------------------------------------------------------------------------- *
Licensed under the GPL-3.0 License. See License.txt in the project root for license information. *
You can not delete this comment when you deploy an application.
*--------------------------------------------------------------------------------------------*/

<template>
  <div>
    <el-dropdown trigger="click" @command="menuEvent" style="padding-left:5px;">
      <a class="cursor">
        <img class="contextMenu" src="@/assets/images/svg/context-menu.svg">
      </a>
      <el-dropdown-menu slot="dropdown" v-show="videoId === data.videoId">
        <el-dropdown-item class="bold" command="A1">
          <i class="el-icon-news"></i> Open Youtube
        </el-dropdown-item>
        <el-dropdown-item class="bold" command="A2" :disabled="isCheck || isSign === null">
          <i class="el-icon-plus"></i> Add to Collection
        </el-dropdown-item>
        <!-- <el-dropdown-item class="bold" command="A3">
          <i class="el-icon-share"></i> Social Share
        </el-dropdown-item>-->
        <el-dropdown-item class="bold" command="A4">
          <i class="el-icon-star-on"></i> Link Copy
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <registered-music-list :isOpen="registerOpen" :data="data" @closeModal="closeModal"/>
  </div>
</template>

<script>
import StoreMixin from "@/components/Mixin/index";
import RegisteredMusicList from "@/components/PlayList/self/modal/RegisteredMusicList";
export default {
  name: "ContextMenu",
  mixins: [StoreMixin],
  components: {
    RegisteredMusicList
  },
  props: {
    videoId: String,
    data: Object
  },
  data() {
    return {
      registerOpen: false,
      isSign: null,
      isCheck: false,
      isShare: false
    };
  },
  mounted() {
    this.isSign = this.getUserId();
  },
  methods: {
    menuEvent(ev) {
      if (ev === "A1") {
        this.watchYoutube();
      } else if (ev === "A2") {
        this.addCollection();
      } else if (ev === "A3") {
        this.isShare = true;
      } else if (ev === "A4") {
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
    addCollection() {
      this.registerOpen = true;
    },
    closeModal(is) {
      this.registerOpen = is;
      this.isShare = is;
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
</style>
