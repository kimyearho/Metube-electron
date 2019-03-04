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
    <global-event-handler @sendSubNextMusicPlay="sendNextMusicPlay" @playVideoSecond="progressRange"></global-event-handler>
  </div>
</template>

<script>
import * as $commons from "@/service/commons-service.js";
import PlaylistMix from "@/components/Mixin/playlist";
import StoreMixin from "@/components/Mixin/index";
import DataMixin from "@/components/Mixin/db";

export default {
  name: "SubPlayerBar",
  mixins: [StoreMixin, DataMixin, PlaylistMix],
  data() {
    return {
      coverTitle: "",
      channelTitle: "",
      playlistParentId: null,
      channelPlaylistId: null,
      playlistLastPage: 0,
      lastPageToken: null,
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
    sendNextMusicPlay(nextIndex) {

      console.log('11111111111111111111111')

      // 재생중인 음악정보
      const musicInfo = this.getMusicInfos();
      const playingPageNum = musicInfo.pageNum;

      // Youtube 재생목록일때
      if (musicInfo.type !== "mycollectionItem") {
        // 재생목록정보의 아이디
        this.playlistParentId = musicInfo.parentId;

        this.$local.get(this.playlistParentId).then(doc => {
          // 이 재생목록의 총 페이지 번호
          this.playlistLastPage = doc.totalPage;

          // 최근 토큰
          this.lastPageToken = doc.lastPageToken;

          // 채널 아이디 여부
          this.channelPlaylistId = doc.channelPlaylistId
            ? doc.channelPlaylistId
            : null;

          this.getPageVideoList(
            musicInfo.type,
            this.playlistParentId,
            musicInfo.pageNum
          ).then(result => {
            let docs = result.docs;
            if (docs) {
              // 임시 목록
              this.subList = docs;

              // 목록의 총 갯수가 index보다 큰가?
              if (docs.length > nextIndex) {
                // 클때 재생
                this.subPlay(nextIndex);
              } else {
                const playType = musicInfo.type;
                const nextPage = musicInfo.pageNum + 1;
                const playlistName = musicInfo.name;

                // 재생중인 음악의 페이지번호와, 마지막페이지 번호가 일치하는가?
                if (playingPageNum === this.playlistLastPage) {
                  // 마지막 번째 음악이 종료됬음.
                  if (this.subList.length === nextIndex) {
                    this.getLog("[SubPlayerBar]/[sendNextMusicPlay] ====> 마지막 번째 음악이 종료 됨");
                    // 여기서 1페이지 0번째 음악을 실행시키는 로직이 필요함.
                    this.getPageVideoList(
                      playType,
                      this.playlistParentId,
                      1
                    ).then(result => {
                      let docs = result.docs;
                      if (docs) {
                        // 조회된 다음 페이지 목록
                        this.subList = docs;
                        // 다음 페이지 번호를 재생목록정보에 갱신
                        this.$local.get(this.playlistParentId).then(doc => {
                          doc.pageNum = 1;
                          return this.$local.put(doc).then(result => {
                            if (result.ok) {
                              // 다음 페이지 목록의 0번째 음악 실행
                              this.getLog("[SubPlayerBar]/[sendNextMusicPlay] ====> 재생목록정보 업데이트 완료 및 1페이지 0번째 음악 시작");
                              this.subPlay(0);
                            }
                          });
                        });
                      }
                    });
                  }
                } else {
                  this.getLog("[SubPlayerBar]/[sendNextMusicPlay] ====> 다음 페이지 조회");
                  // 다음 페이지의 데이터가 DB에 있는지?
                  this.getPlaylistVideoCount(
                    playType,
                    playlistName,
                    nextPage
                  ).then(count => {
                    if (count > 0) {
                      // 다음 페이지 데이터가 DB에 있음.
                      this.getPageVideoList(
                        playType,
                        this.playlistParentId,
                        nextPage
                      ).then(result => {
                        let docs = result.docs;
                        if (docs) {
                          // 조회된 다음 페이지 목록
                          this.subList = docs;

                          // 다음 페이지 번호를 재생목록정보에 갱신
                          this.$local.get(this.playlistParentId).then(doc => {
                            doc.pageNum = nextPage;
                            return this.$local.put(doc).then(result => {
                              if (result.ok) {
                                this.getLog("[SubPlayerBar]/[sendNextMusicPlay] ====> 재생목록정보 업데이트 완료 및 0번째 음악 시작");
                                // 다음 페이지 목록의 0번째 음악 실행
                                this.subPlay(0);
                              }
                            });
                          });
                        }
                      });
                    } else {
                      // 다음 페이지 데이터가 DB에 없을 때
                      this.subNextPlayPageLoad();
                    }
                  });
                }
              }
            }
          });
        });
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
                if (this.subList.length > nextIndex) {
                  this.subPlay(nextIndex);
                } else {
                  this.subPlay(0);
                }
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

    subNextPlayPageLoad() {
      this.getLog("[SubPlayerBar]/[subNextPlayPageLoad] ====> 다음 페이지가 DB에 없어 API를 통해서 조회");

      let playlistName = null;
      let playlistItem = null;

      const musicInfo = this.getMusicInfos();
      const playType = musicInfo.type;
      const playlistIdName = musicInfo.name;
      const nextPageNum = musicInfo.pageNum + 1;
      const playlistId = playlistIdName.split(":")[1];

      if (playType === "play") {
        playlistName = playlistIdName;
        playlistItem = $commons.youtubePagingPlaylistItem(
          playlistId,
          this.lastPageToken
        );
      } else if (playType === "related") {
        playlistName = playlistIdName;
        playlistItem = $commons.youtubePagingRelatedSearch(
          playlistId,
          this.lastPageToken
        );
      } else if (playType === "channel") {
        playlistName = playlistIdName;
        playlistItem = $commons.youtubePagingPlaylistItem(
          this.channelPlaylistId,
          this.lastPageToken
        );
      }

      this.$http
        .get(playlistItem)
        .then(res => {
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
            let list = [];
            this.$lodash.forEach(results, (item, idx) => {
              item.type = playType;
              item.parentId = this.playlistParentId;
              item.sortIndex = idx;
              item.pageNum = nextPageNum;
              list.push(item);
              if (idx === results.length - 1) {
                // 마지막 페이징일때
                if (nextPageNum === this.playlistLastPage) {
                  let lastIndex = results.length - 1;
                  // 마지막번째 비디오 객체에 마지막번째라는 키값을 추가한다.
                  results[lastIndex].lastVideo = true;
                }

                // 조회된 재생목록 하위 데이터 한꺼번에 등록
                this.$local.bulkDocs(results).then(() => {
                  this.$local.get(this.playlistParentId).then(doc => {
                    doc.lastPageToken = res.data.nextPageToken
                      ? res.data.nextPageToken
                      : null;
                    doc.pageNum = nextPageNum;
                    return this.$local.put(doc).then(result => {
                      if (result.ok) {
                        this.getLog("[SubPlayerBar]/[sendNextMusicPlay] ====> 현재 페이지번호 : ", nextPageNum);
                        this.getLog("[SubPlayerBar]/[sendNextMusicPlay] ====> 재생목록정보 업데이트 완료 및 0번째 음악 시작");
                        this.subList = results;
                        this.subPlay(0);
                      }
                    });
                  });
                });
              }
            });
          });
        })
        .catch(error => {
          this.errorDialog();
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
      this.isPlay = event.playType;
    },

    // 재생정보를 기반으로 해당 실제 재생목록으로 이동
    showPlaylist() {
      let musicInfo = this.getMusicInfos();
      this.$store.commit("setPath", this.$route.path);
      if (musicInfo.type === "mycollectionItem") {
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
    this.$eventBus.$off("playTypeControl");
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
