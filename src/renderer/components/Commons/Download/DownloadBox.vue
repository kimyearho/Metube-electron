<template>
  <div>
    <div class="wrapper">
      <el-row>
        <el-col>
          <div class="menu1_tip">
            <div>
              <img width="20" style="margin-bottom: 10px;" src="@/assets/images/svg/download.svg">
              <span class="collections">Download Box (Beta)</span>
            </div>
            <strong class="tr" style="font-size:11px;">Please check the help. (Sign-in only)</strong>
          </div>
          <div>
            <md-button class="md-raised md-accent help" @click="isHelp = true">
              <i class="el-icon-warning"></i> Help
            </md-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form ref="form" label-width="120px" label-position="top" size="mini">
            <el-form-item
              class="form-item"
              label="Choose Folder Path"
              style="margin:10px;display: inline-block;"
            >
              <md-button
                class="md-raised md-default choose"
                style="margin:0;min-width: 40px;"
                :disabled="proceeding"
                @click="chooseFolderPath"
              >
                <i class="el-icon-search" style="font-weight: 700;"></i>
              </md-button>
              <span
                class="folderPath"
                v-if="path.length > 0"
              >...{{ path[0].substring(path[0].lastIndexOf('\\'), path[0].length) }}</span>
            </el-form-item>

            <el-form-item
              class="form-item select"
              label="Quality"
              style="margin:10px;margin-left: 95px;"
            >
              <div style="position:absolute;top:-38px;right:0;">
                <md-button
                  class="md-raised md-accent help"
                  style="min-width: 25px;height: 17px;"
                  @click="isQuality = true"
                >
                  <i class="el-icon-warning"></i>
                </md-button>
              </div>
              <el-select
                v-model="selectedOption"
                :size="`mini`"
                :disabled="proceeding"
                placeholder="Select"
                @change="changeOption"
                style="width:100px;"
              >
                <el-option
                  v-for="item in downloadOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="form-item" label="Download" style="margin:10px;">
              <md-button
                class="md-raised md-primary download"
                @click="download"
                :disabled="proceeding"
              >
                <i class="el-icon-download"></i>
                All Download
              </md-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <md-list
        v-if="downloadList.length > 0"
        id="list"
        class="historyList"
        :class="{ staticHeight: isMini }"
      >
        <md-list-item v-for="(item, index) in downloadList" :key="index">
          <div class="title">
            <span style="color:#ffffff;">{{ item.title.substring(0, 30) }} ...</span>
          </div>
          <div class="action">
            <span>
              <div>
                <md-button
                  class="md-raised md-accent help delete"
                  style="min-width: 30px;"
                  :disabled="item.progress === 'complate' || proceeding"
                  @click="itemDelete(item)"
                >
                  <i class="el-icon-delete"></i>
                </md-button>
              </div>
            </span>
            <span v-if="item.progress === 'Waiting'">
              <md-chip class="md-primary">{{ item.progress }}</md-chip>
            </span>
            <span v-else-if="item.progress === 'downloading'" style="width:100%;margin-top:10px;">
              <md-progress-bar class="md-primary" md-mode="indeterminate"></md-progress-bar>
            </span>
            <span v-else-if="item.progress === 'complate'">
              <md-chip class="md-success">{{ item.progress }}</md-chip>
            </span>
          </div>
        </md-list-item>
      </md-list>
      <md-list v-else id="list" :class="{ staticHeight: isMini }">
        <md-list-item>
          <span class="noDownloadItems">The download item does not exist.</span>
        </md-list-item>
      </md-list>
    </div>

    <download-help :isOpen="isHelp" @close="isHelp = false"/>

    <download-quality :isOpen="isQuality" @close="isQuality = false"/>
  </div>
</template>

<script>
import Loading from "@/components/Commons/Loader/PageLoading";
import storeMixin from "@/components/Commons/Mixin/index";
import DataUtils from "@/components/Commons/Mixin/db";
import DownloadHelp from "@/components/Commons/Download/DownloadHelp";
import DownloadQuality from "@/components/Commons/Download/DownloadQuality";
import SubPlayerBar from "@/components/PlayerBar/SubPlayerBar";

const { dialog } = require("electron").remote;

export default {
  name: "DownloadBox",
  mixins: [storeMixin, DataUtils],
  components: {
    DownloadQuality,
    DownloadHelp,
    SubPlayerBar,
    Loading
  },
  data() {
    return {
      isLogin: false,
      isMini: false,
      isHelp: false,
      isQuality: false,
      load: false,
      proceeding: false,
      path: [],
      downloadList: [],
      selectedOption: "",
      downloadOption: [
        {
          value: "highestaudio",
          label: "HighestAudio"
        },
        {
          value: "highest",
          label: "Highest"
        }
      ]
    };
  },
  created() {

    console.log('1231232')
    // this.path = this.getDownloadPath();
    // this.selectedOption = this.getDownloadQuality();
    // this.proceeding = this.getDownloadProgress();
    // this.downloadList = this.getDownloadList().data;
    // this.isLogin = this.getUserId() ? true : false;
    // this.isMini = this.getMusicInfos() ? true : false;

    this.$ipcRenderer.on("data", this.progress);
  },
  methods: {
    progress(e, args) {

      console.log('============= progress ==============')

      let list = this.getDownloadList().data;
      let downloadStatus = args.progress;

      const videoId = args.videoId;
      const data = this.$lodash.find(list, { videoId: videoId });

      if (downloadStatus === "end") {
        data.progress = "complate";

        const nextIndex = args.index + 1;
        if (list[nextIndex] !== undefined) {
          // 다음 인덱스 있음
          list[nextIndex].path = this.path[0];

          // 퀄리티 입력
          list[nextIndex].quality = this.selectedOption;

          list[nextIndex].progress = "downloading";

          this.$ipcRenderer.send("videoDownload", list[nextIndex]);
        } else {
          this.proceeding = false;
          this.$store.commit("setDownloadProgress", false);
          // 현재 다운로드 목록이 완료되었으므로 상태값을 갱신해줌.
          this.$store.commit("setDownloadComplate", "complate");
        }
      }
    },

    chooseFolderPath() {
      this.path = dialog.showOpenDialog({
        properties: ["openDirectory"]
      });
      this.$store.commit("setDownloadPath", this.path);
    },

    download() {
      if (this.path.length <= 0) {
        this.$message({
          type: "error",
          message: "Please specify the download path."
        });
        return;
      }

      if (this.selectedOption === "") {
        this.$message({
          type: "error",
          message: "Please Quality select."
        });
        return;
      }

      if (this.downloadList.length <= 0) {
        this.$message({
          type: "error",
          message: "The download item does not exist."
        });
        return;
      }

      this.proceeding = true;
      this.$store.commit("setDownloadProgress", true);

      // 첫번째 다운로드 아이템 시작
      this.downloadList[0].quality = this.selectedOption;
      this.downloadList[0].path = this.path[0];
      this.downloadList[0].progress = "downloading";
      this.$ipcRenderer.send("videoDownload", this.downloadList[0]);
    },

    itemDelete(data) {
      this.$store.commit("setResetDownloadList");
      // let downloadList = this.getDownloadList().data;
      this.downloadList = this.$lodash.reject(this.downloadList, o => {
        return o.index === data.index;
      });
      this.$lodash.forEach(this.downloadList, (item, index) => {
        item.index = index;
        this.$store.commit("setDownloadItem", item);
      });
    },

    changeOption() {
      this.$store.commit("setDownloadQuality", this.selectedOption);
    }
  },
  beforeDestroy() {
    this.$eventBus.$off("downloadStart");
  }
};
</script>

<style scoped>
.md-list-item-container {
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  text-align: left;
  text-transform: none;
}
.form-item >>> .el-form-item__label {
  color: #ffffff;
}
.md-chip {
  border-radius: 5px;
  height: 20px;
  line-height: 19px;
  vertical-align: -webkit-baseline-middle;
}
.choose {
  min-width: 70px;
  height: 26px;
  /* margin: 6px 8px; */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
}
.help {
  min-width: 63px;
  height: 20px;
  /* margin: 6px 8px; */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}
.folderPath {
  background: rgba(0, 0, 0, 0.2);
  color: #ffeb3b;
  padding: 4px;
  margin-left: 5px;
  font-size: 12px;
}
.download {
  margin: 0px;
  width: 100%;
  height: 20px;
}
.md-list.md-theme-default [disabled] {
  background-color: #67c23a !important;
  color: #ffffff !important;
}
.md-button.md-theme-default.md-raised[disabled] {
  background-color: #b5b5b5 !important;
  color: #ffffff !important;
}
.md-progress-bar {
  height: 12px;
}
.historyList {
  overflow-y: scroll;
  max-height: 278px;
}
.noDownloadItems {
  color: #ffffff;
  font-size: 16px;
  margin-left: 45px;
}
.title {
  max-width: 210px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.action {
  width: 112px;
  display: inline-flex;
  line-height: 24px;
  margin-right: 12px;
}
.select {
  display: inline-block;
}
</style>