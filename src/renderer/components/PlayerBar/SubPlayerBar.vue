/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <!-- root div -->
  <div>
    <div class="zaudio_player">
      <progress
        :value="range"
        min="0"
        :max="maxTime"
      />
      <div class="zaudio_playercontrols">
        <div class="zaudio_buttonwrapper">
          <div>
            <img
              class="miniImage"
              width="30"
              :src="image"
            >
          </div>
          <div class="zaudio_playercontrolbuttons">
            <div
              class="cover channelInfo cursor"
              @click="showPlaylist"
            >
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
    <global-event-handler
      @sendNextPage="subNextPlaylistAutoPageLoad"
      @sendNextMusicPlay="sendNextMusicPlay"
      @playVideoSecond="progressRange"
    ></global-event-handler>
  </div>
</template>

<script>
import * as $commons from "@/service/commons-service.js";
import StoreMixin from "@/components/Mixin/index";
import DataMixin from "@/components/Mixin/db";

export default {
  name: "SubPlayerBar",
  mixins: [StoreMixin, DataMixin],
  data() {
    return {
      coverTitle: "",
      channelTitle: "",
      subList: [],
      image: "",
      totalTime: 0,
      maxTime: 0,
      range: 0,
      state: 0,
      isPlay: true
    };
  },
  created() {
    this.$eventBus.$on("playTypeControl", this.playTypeControl);
  },
  mounted() {
    this.playMusicSetting();
  },
  methods: {
    // 서브 플레이어에서는 현재 재생중인 목록을 가져와 컨트롤한다.
    sendNextMusicPlay(index) {
      let musicInfo = this.getMusicInfos();
      if (!musicInfo.type) {
        // 현재 재생중인 비디오의 재생정보를 검색
        const findPlaylist = this.$lodash.find(this.getAllPlayList(), {
          playlistId: musicInfo.name
        });
        // 재생목록 조회
        this.subList = findPlaylist.list;
        this.subPlay(index);
      } else {
        this.createIndex(["userId", "parentId"]).then(() => {
          return this.$test
            .find({
              selector: {
                type: "profile",
                userId: this.getUserId()
              }
            })
            .then(result => {
              let docs = result.docs[0];
              if (docs) {
                let collections = docs.collections;
                let findItem = this.$lodash.find(collections, {
                  id: musicInfo.name
                });
                this.subList = findItem.list;
                this.subPlay(index);
              }
            });
        });
      }
    },

    subPlay(index) {
      // 재생목록에서 해당하는 트랙번호의 비디오
      const musicInfo = this.getMusicInfos();
      let playingItem = this.subList[index];
      playingItem.index = index;
      playingItem.name = musicInfo.name;
      if (this.playType === "related") playingItem.mainId = this.videoId;

      this.$store.commit("setPlayingMusicInfo", playingItem);
      this.$eventBus.$emit("statusCheck");

      // 서브 플레이어 재생정보 갱신
      this.playMusicSetting();

      const videoId = playingItem.videoId;
      this.$ipcRenderer.send("win2Player", ["loadVideoById", videoId]);
      if (process.env.NODE_ENV !== "development") {
        /** @overade 히스토리 등록 */
        this.insertVideoHistory(playingItem);

        /** @overade 사용자 재생 등록 */
        this.insertUserRecommand(playingItem);
      }
    },

    subNextPlaylistAutoPageLoad() {
      const musicInfo = this.getMusicInfos();
      const playlistId = musicInfo.playlistId;
      const allPlaylist = this.getAllPlayList();

      let playlistName = null;
      let playlistItem = null;
      let playType = null;

      let nameType = musicInfo.name.split(":")[0];
      if (nameType === "PLAYLIST") {
        playType = "play";
      } else if (nameType === "CHANNEL") {
        playType = "channel";
      } else if (nameType === "RELATED") {
        playType = "related";
      }

      // 현재 재생중인 비디오의 재생정보를 검색
      let findItem = this.$lodash.find(allPlaylist, {
        playlistId: musicInfo.name
      });

      // 토큰을 사용한 새 재생목록 가져오기
      if (playType === "play") {
        playlistName = `PLAYLIST:${playlistId}`;
        playlistItem = $commons.youtubePagingPlaylistItem(
          playlistId,
          findItem.nextPageToken
        );
      } else if (playType === "related") {
        playlistName = `RELATED:${musicInfo.mainId}`;
        playlistItem = $commons.youtubePagingRelatedSearch(
          musicInfo.mainId,
          findItem.nextPageToken
        );
      } else if (playType === "channel") {
        playlistName = `CHANNEL:${musicInfo.channelId}`;
        playlistItem = $commons.youtubePagingPlaylistItem(
          this.channelPlaylistId,
          findItem.nextPageToken
        );
      }

      this.$http.get(playlistItem).then(res => {
        let pathName = null;

        if (playType === "play") {
          pathName = "setDuration";
          this.$store.commit("setMusicList", res.data.items);
        } else if (playType === "related") {
          pathName = "setRelatedDuration";
          this.$store.commit("setRelatedList", res.data.items);
        } else if (playType === "channel") {
          pathName = "setDuration";
          this.$store.commit("setMusicList", res.data.items);
        }

        this.$store.dispatch(pathName).then(results => {
          // 기존 재생목록 뒤로, 토큰으로 조회한 목록을 합친다.
          this.subList = this.$lodash.concat(findItem.list, results);

          // 토큰여부
          findItem.nextPageToken = res.data.nextPageToken
            ? res.data.nextPageToken
            : null;

          // 전체 재생목록에 등록 된 현재 재생목록에 대한 정보 업데이트
          const payload = {
            playlistId: playlistName,
            appendPlaylist: this.subList,
            nextPageToken: findItem.nextPageToken
          };
          this.$store.commit("setPageAppendList", payload);

          const nextIndex = musicInfo.index + 1;
          this.subPlay(nextIndex);
        });
      });
    },

    // 재생정보 세팅
    playMusicSetting() {
      let musicInfo = this.getMusicInfos();
      if (musicInfo) {
        this.image = musicInfo.imageInfo
          ? musicInfo.imageInfo
          : musicInfo.thumbnails;

        let titleLength = this.countUtf8Bytes(musicInfo.title);
        if (titleLength > 35) {
          this.coverTitle = musicInfo.title.substring(0, 35).concat("...");
        } else {
          this.coverTitle = musicInfo.title;
        }
        this.channelTitle = musicInfo.channelTitle;
        this.maxTime = musicInfo.duration_time;
        this.totalTime = musicInfo.duration;
        this.isPlay = this.getPlayType();
      }
    },

    // 프로그레스
    progressRange(value) {
      this.range = this.second(value);
    },

    // 재생
    playTypeControl(event) {
      console.log(event)
      this.isPlay = event.playType;
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
      const calc_fix = calc.toFixed(0);
      this.$ipcRenderer.send("win2Player", ["seekTo", calc_fix]);
    },

    // 재생중 -> 일시정지
    play() {
      this.isPlay = false;
      this.$ipcRenderer.send("win2Player", ["pauseVideo"]);
      this.$store.commit("setPlayType", false);
    },

    // 일시정지 -> 재생
    pause() {
      this.isPlay = true;
      this.$ipcRenderer.send("win2Player", ["playVideo"]);
      this.$store.commit("setPlayType", true);
    },

    second(n) {
      if (n != undefined) {
        return parseInt(n);
      } else {
        return 0;
      }
    },

    countUtf8Bytes(s) {
      var b = 0,
        i = 0,
        c;
      for (; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
      return b;
    }
  },
  beforeDestroy() {
    this.$eventBus.$off("playTypeControl")
  }
};
</script>

<style scoped>
.zaudio_player {
  width: 369px;
  height: 48px;
  top: 520px;
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
  /* padding-top: 4px; */
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
