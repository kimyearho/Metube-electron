/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <!-- root div -->
  <div>
    <div class="zaudio_player">
      <progress :value="range" min="0" :max="maxTime"/>
      <div class="zaudio_playercontrols">
        <div class="zaudio_buttonwrapper">
          <div>
            <img class="miniImage" width="30" :src="image">
          </div>
          <div class="zaudio_playercontrolbuttons">
            <div class="cover channelInfo cursor" @click="showPlaylist">
              <div>{{ coverTitle }}</div>
              <div class="channel">{{ channelTitle }}</div>
            </div>
            <div class="playerButton">
              <img
                class="cursor"
                v-if="!isPlay"
                @click="pause"
                width="35"
                src="@/assets/images/svg/play-button.svg"
              >
              <img
                class="cursor"
                v-else
                @click="play"
                width="35"
                src="@/assets/images/svg/pause.svg"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StoreMixin from "@/components/Mixin/index";

export default {
  name: "SubPlayerBar",
  mixins: [StoreMixin],
  data() {
    return {
      coverTitle: "",
      channelTitle: "",
      image: "",
      totalTime: 0,
      maxTime: 0,
      range: 0,
      state: 0,
      isPlay: true
    };
  },
  created() {
    // 영상의 재생시간 수신
    this.$eventBus.$on("playerSecond", this.progressRange);

    // 재생음악의 정보 수신
    this.$eventBus.$on("playMusicSetting", this.playMusicSetting);

    // 영상을 클릭했을때 수신
    this.$eventBus.$on("playerPause", this.playerPause);

    // 영상을 클릭했을때 수신
    this.$eventBus.$on("playerPlay", this.playerPlay);
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 재생정보 설정
    fetchData() {
      this.playMusicSetting();
    },

    // 재생정보 세팅
    playMusicSetting() {
      let musicInfo = this.getMusicInfos();
      if (musicInfo) {
        this.image = musicInfo.imageInfo
          ? musicInfo.imageInfo
          : musicInfo.thumbnails;
        this.coverTitle = musicInfo.title.substring(0, 38);
        if (this.$lodash.size(musicInfo.title) > 38) {
          this.coverTitle = this.coverTitle.concat("...");
        }
        this.channelTitle = musicInfo.channelTitle;
        this.maxTime = musicInfo.duration_time;
        this.totalTime = musicInfo.duration;
        this.isPlay = this.getPlayType();
      }
    },

    // 프로그레스
    progressRange($event) {
      this.range = this.second($event);
    },

    // 일시정지
    playerPause() {
      this.isPlay = true;
    },

    // 재생
    playerPlay() {
      this.isPlay = false;
    },

    // 재생정보를 기반으로 해당 실제 재생목록으로 이동
    showPlaylist() {
      let musicInfo = this.getMusicInfos();
      this.$store.commit("setPath", this.$route.path);
      if (musicInfo.type != undefined) {
        this.$router.push({
          name: "MY-PLAYING-PLAYLIST",
          params: {
            playType: "self",
            id: musicInfo.name,
            start: musicInfo.index
          }
        });
      } else {
        let listType = musicInfo.name.split(":")[0];
        let mainId = musicInfo.name.split(":")[1];

        if (listType === "RELATED") {
          this.$router.push({
            name: "PLAYING-PLAYLIST",
            params: { playType: "related", id: mainId, start: musicInfo.index }
          });
        } else if (listType === "CHANNEL") {
          this.$router.push({
            name: "PLAYING-PLAYLIST",
            params: { playType: "channel", id: mainId, start: musicInfo.index }
          });
        } else {
          this.$router.push({
            name: "PLAYING-PLAYLIST",
            params: { playType: "play", id: mainId, start: musicInfo.index }
          });
        }
      }
    },

    // 재생시간 이동
    seekTo(e) {
      let target = $(e.currentTarget);
      let widthclicked = e.pageX - target.offset().left;
      let totalWidth = target.width();
      let calc = (widthclicked / totalWidth) * this.maxTime;
      let calc_fix = calc.toFixed(0);
      this.$ipcRenderer.send("win2Player", ["seekTo", calc_fix]);
    },

    // 재생중 -> 일시정지
    play() {
      this.isPlay = false;
      this.$ipcRenderer.send("win2Player", ["pauseVideo"]);
      this.$store.commit("setPlayType", this.isPlay);
    },

    // 일시정지 -> 재생
    pause() {
      this.isPlay = true;
      this.$ipcRenderer.send("win2Player", ["playVideo"]);
      this.$store.commit("setPlayType", this.isPlay);
    },

    second(n) {
      if (n != undefined) {
        return parseInt(n);
      } else {
        return 0;
      }
    }
  }
};
</script>

<style scoped>
.zaudio_player {
  width: 369px;
  height: 48px;
  top: 514px;
  background-color: #3e3e3e;
  position: absolute;
  z-index: 200;
}

.zaudio_player {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #20293a !important;
}

.zaudio_playercontrols {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-top: 8px;
}

.zaudio_player:hover {
  background-color: #2b2b2b;
}

.channelInfo {
  margin-left: 5px;
  margin-bottom: 6px;
  color: #ffffff;
  font-size: 12px;
}

.channel {
  padding-top: 4px;
  font-size: 10px;
  color: #ddd;
}

.miniImage {
  width: 50px;
  height: 48px;
  padding-bottom: 5px;
}

.playerButton {
  margin-bottom: 7px;
}

progress {
  width: 100%;
  height: 4px;
  border-radius: 5px;
}

progress::-webkit-progress-value {
  background-color: #ffffff;
}

progress.volume::-webkit-progress-bar {
  background-color: rgb(182, 182, 182) !important;
}
</style>
