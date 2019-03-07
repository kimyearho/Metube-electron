/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <!-- root div -->
  <div>
    <div class="zaudio_player">
      <div class="zaudio_playercontrols">
        <!-- 프로그레스바 영역 -->
        <div class="zaudio_seekbar">
          <!-- <md-progress-bar md-mode="determinate" :md-value="range"></md-progress-bar> -->
          <progress class="cursor" @click="seekTo" :value="range" min="0" :max="maxTime"/>
          <span class="playingLive" v-if="isLive">L I V E - P L A Y I N G</span>
          <span class="zaudio_tracktime">{{ totalTime }}</span>
        </div>

        <!-- 재생 컨트롤 영역 -->
        <div class="zaudio_buttonwrapper" style="margin-top: 9px; margin-bottom:10px;">
          <div class="zaudio_playercontrolbuttons">
            <!-- 이전 재생 -->
            <img
              class="cursor md-image"
              width="35"
              height="15"
              src="@/assets/images/svg/play-previous-button.svg"
              @click="!isDelay ? previousVideo() : buttonDelay()"
            >

            <!-- 재생 -->
            <img
              class="cursor md-image"
              width="35"
              v-if="!isPlay"
              src="@/assets/images/svg/main-play-button.svg"
              @click="pause"
            >

            <!-- 일시정지 -->
            <img
              class="cursor md-image"
              width="35"
              v-else
              src="@/assets/images/svg/main-pause-button.svg"
              @click="play"
            >

            <!-- 다음 재생 -->
            <img
              class="cursor md-image"
              width="35"
              height="15"
              src="@/assets/images/svg/play-next-button.svg"
              @click="!isDelay ? nextVideo() : buttonDelay()"
            >

            <!-- 반복 재생 -->
            <img
              class="cursor md-image"
              v-if="!isRepeat"
              width="35"
              height="15"
              src="@/assets/images/svg/play-repeat.svg"
              :title="$t('PLAYERBAR.REPEAT_OFF')"
              @click="repeatOn"
            >
            
            <img
              class="cursor md-image"
              v-else
              width="35"
              height="15"
              src="@/assets/images/svg/play-repeat-on.svg"
              :title="$t('PLAYERBAR.REPEAT_ON')"
              @click="repeatOff"
            >

            <!-- 볼륨 -->
            <img
              class="cursor md-image"
              v-if="!isVolume"
              width="35"
              height="15"
              src="@/assets/images/svg/volume-on.svg"
              :title="$t('PLAYERBAR.VOLUME_OFF')"
              @click="volumeOn"
            >
            
            <img
              class="cursor md-image"
              v-else
              width="35"
              height="15"
              src="@/assets/images/svg/volume-off.svg"
              :title="$t('PLAYERBAR.VOLUME_ON')"
              @click="volumeOff"
            >
          </div>
          <div style="max-width:20%;padding-right:10px;">
            <input type="range" ref="volumeSlider" v-model="volume" step="1" min="0" max="100">
          </div>
        </div>
      </div>
    </div>
    <global-event-handler
      @sendNextMusicPlay="sendNextMusicPlay"
      @playVideoSecond="progressRange"
      @sendNextPage="sendNextPage"
    ></global-event-handler>
  </div>
</template>

<script>
import StoreMixin from "@/components/Commons/Mixin/index";
import GlobalMixin from "@/components/Commons/Mixin/common";

export default {
  name: "MainPlayerBar",
  mixins: [StoreMixin, GlobalMixin],
  props: {
    videoSetting: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      range: 0,
      time: "",
      maxTime: 0,
      totalTime: "",
      state: 0,
      loop: "",
      volume: 50,
      isLive: false,
      isPlay: true,
      isRepeat: false,
      isDelay: false,
      isVolume: false
    };
  },
  created() {
    // 재생 기본설정
    this.playReady();
  },
  watch: {
    // 볼륨 감시
    volume(v) {
      this.volume = v;
      this.$store.commit("setVolume", this.volume);
      this.$ipcRenderer.send("win2Player", ["setVolume", this.volume]);
    },
    // 재생될 비디오 정보 갱신
    videoSetting(event) {
      this.playMusicSetting(event);
    }
  },
  mounted() {
    // 현재 재생음악의 정보를 설정
    this.fetchData();

    // 반복
    this.isRepeat = this.getRepeat();

    // 재생바에 플레이/일시정지 아이콘 변경 이벤트 수신
    this.$eventBus.$on("playTypeControl", this.playTypeControl);
  },
  methods: {
    // 다음 재생 이벤트 전달
    sendNextMusicPlay(value) {
      this.$emit("nextMusicPlay", value);
    },

    // 다음 페이지 조회 이벤트 전달
    sendNextPage(value) {
      this.$emit("nextPage", value);
    },

    // 재생정보 및 플레이타입 설정
    fetchData() {
      let musicInfo = this.getMusicInfos();
      if (musicInfo) {
        this.maxTime = musicInfo.duration_time;
        this.totalTime = musicInfo.duration;
        if (musicInfo.isLive) {
          this.isLive = musicInfo.isLive != "none";
        }
        if (this.getPlayType() === null) {
          this.isPlay = true;
          this.$store.commit("setPlayType", this.isPlay);
        } else {
          this.isPlay = this.getPlayType();
        }
      }
    },

    // 재생준비 (기본 볼륨: 50)
    playReady() {
      this.volume = this.getVolume();
      if (this.volume === 0) {
        this.volume = 50;
      }
      this.$store.commit("setVolume", this.volume);
      this.$ipcRenderer.send("win2Player", ["setVolume", this.volume]);
    },

    // 재생정보 세팅
    playMusicSetting(data) {
      this.maxTime = data.duration_time;
      this.totalTime = data.duration;
      if (data.isLive) {
        this.isLive = data.isLive != "none";
      }
      this.isPlay = true;
    },

    // 프로그레스
    progressRange(value) {
      this.range = this.second(value);
    },

    // 재생
    playTypeControl() {
      this.isPlay = this.getPlayType();
    },

    // 일시정지 -> 재생으로 전환
    pause() {
      this.isPlay = true;
      this.$ipcRenderer.send("win2Player", ["playVideo"]);
      this.$store.commit("setPlayType", this.isPlay);
    },

    // 이전 비디오
    previousVideo() {
      this.isDelay = true;
      let self = this;
      setTimeout(function() {
        self.isDelay = false;
      }, 3000);
      this.$emit("previousVideoTrack");
    },

    // 재생 중 -> 일시정지로 전환
    play() {
      this.isPlay = false;
      this.$ipcRenderer.send("win2Player", ["pauseVideo"]);
      this.$store.commit("setPlayType", this.isPlay);
    },

    // 클릭이벤트로 재생시간 이동
    seekTo(e) {
      let target = $(e.currentTarget);
      let widthclicked = e.pageX - target.offset().left;
      let totalWidth = target.width();
      let calc = (widthclicked / totalWidth) * this.maxTime;
      let calc_fix = calc.toFixed(0);
      this.$ipcRenderer.send("win2Player", ["seekTo", calc_fix]);
    },

    // 볼륨 ON
    volumeOn() {
      this.volume = 0;
      this.isVolume = true;
      this.$ipcRenderer.send("win2Player", ["setVolume", 0]);
    },

    // 볼륨 OFF
    volumeOff() {
      this.volume = 50;
      this.isVolume = false;
      this.$ipcRenderer.send("win2Player", ["setVolume", this.volume]);
    },

    // 다음 비디오
    nextVideo() {
      this.isDelay = true;
      let self = this;
      setTimeout(function() {
        self.isDelay = false;
      }, 3000);
      this.$emit("nextVideoTrack");
    },

    buttonDelay() {
      this.$message({
        showClose: true,
        message: this.$t("PLAYERBAR.BUTTON_DELAY"),
        type: "error"
      });
    },

    // 반복 ON
    repeatOn() {
      this.isRepeat = true;
      this.$store.commit("setRepeat", true);
    },

    // 반복 OFF
    repeatOff() {
      this.isRepeat = false;
      this.$store.commit("setRepeat", false);
    },

    // 문자열을 숫자형으로 변환
    second(n) {
      if (n != undefined) {
        return parseInt(n);
      } else {
        return 0;
      }
    }
  },
  beforeDestroy() {
    this.$eventBus.$off("playTypeControl");
  }
};
</script>

<style scope>
progress {
  width: 92.1%;
  height: 10px;
  border-radius: 5px;
}
progress::-webkit-progress-bar {
  border-radius: 5px;
}

progress::-webkit-progress-value {
  background-color: #ffffff;
  border-radius: 5px;
}

progress.volume::-webkit-progress-bar {
  background-color: rgb(182, 182, 182) !important;
}

progress.volume::-webkit-progress-value {
  background-color: #ffc107 !important;
}

input:focus {
  outline: none;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  border-radius: 8px;
  height: 7px;
  border: 1px solid #bdc3c7;
  background-color: #fff;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  background-color: #ecf0f1;
  border: 1px solid #bdc3c7;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  cursor: pointer;
}

.playingLive {
  position: absolute;
  font-size: 10px;
  font-weight: 700;
  color: #fd4545;
  left: 125px;
}

.zaudio_playercontrols {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.el-message {
  min-width: 310px;
}
</style>
