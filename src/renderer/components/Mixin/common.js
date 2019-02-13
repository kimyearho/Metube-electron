'use strict';

export default {
  data() {
    return {
      state: "",
      status: []
    }
  },
  beforeCreate() {
    this.$eventBus.$off("statusCheck")
  },
  created() {
    this.$eventBus.$on("statusCheck", this.videoStatusCheck);
  },
  mounted() {
    this.$watch(
      () => {
        return this.state
      },
      (newVal, oldVal) => {
        this.status.push(newVal)
      }
    )
  },
  methods: {
    playerState(message) {
      this.state = message
      // 버퍼링 or 일시중지
      if (this.state === 2) {
        // 재생모양 아이콘으로 변경
        this.$eventBus.$emit("playTypeControl", { playType: false })
      } else if (this.state === 1) {
        // 일시정지 아이콘으로 변경 (현재 재생 중)
        this.$eventBus.$emit("playTypeControl", { playType: true })
      } else if (this.state === 0) {
        // 종료일 경우
        let musicData = this.getMusicInfos()
        let isRepeat = this.getRepeat()
        // 반복여부
        if (isRepeat) {
          this.$ipcRenderer.send("win2Player", ["loadVideoById", musicData.videoId])
        } else {
          // 이전 음악의 인덱스 (현재 종료된 음악)
          let currentIndex = musicData.index
          // 다음 인덱스
          let nextIndex = currentIndex + 1
          // 내컬렉션일 경우
          if (musicData.type) {
            this.createIndex(["userId", "parentId"]).then(result => {
              return this.$test
                .find({
                  selector: {
                    userId: {
                      $eq: this.getUserId()
                    },
                    parentId: {
                      $eq: musicData.parentId
                    }
                  },
                  limit: 100
                })
                .then(result => {
                  let docs = result.docs
                  if (docs) {
                    if (docs.length > nextIndex) {
                      this.$emit("sendNextMusicPlay", nextIndex)
                    } else {
                      this.$emit("sendNextMusicPlay", 0)
                    }
                  }
                })
            })
          } else {
            // 유튜브 재생목록일 경우
            let allPlaylist = this.getAllPlayList()
            // 재생목록명으로 재생목록 조회
            let playlist = this.$lodash.find(allPlaylist, {
              playlistId: musicData.name
            })

            if (playlist != undefined) {
              if (playlist.list.length > nextIndex) {
                this.$emit("sendNextMusicPlay", nextIndex)
              } else {
                // 토큰여부
                let nextPageToken = playlist.nextPageToken
                if (nextPageToken === null) {
                  // 목록의 마지막 번째 음악이 종료되었으므로, 처음부터 재생
                  this.$emit("sendNextMusicPlay", 0)
                } else {
                  // 다음 페이지 조회
                  this.$emit("sendNextPage")
                }
              }
            }
          }
        }
      }
    },

    /**
     * 비디오 상태 체크
     * 재생불가능한 비디오를 감시한다
     */
    videoStatusCheck() {
      let isTimer = this.$store.getters.getTimer;
      if (isTimer) {
        // clear and set
        let isTime = this.$store.getters.getTime;
        clearTimeout(isTime);
      }
      this.$store.commit("setTimer", true);
      setTimeout(() => {
        this.$store.commit("setTime", 1000);
        this.statusResult();
      }, 15000);
    },

    statusResult() {
      this.$store.commit("setTimer", false);
      let statusSize = this.$lodash.size(this.status);
      let lastIndex = this.status[statusSize - 1];
      if (lastIndex) {
        if (lastIndex === -1) {
          let musicData = this.getMusicInfos();
          let nextIndex = musicData.index + 1;
          if (musicData.type) {
            this.createIndex(["userId", "parentId"]).then(result => {
              return this.$test
                .find({
                  selector: {
                    userId: {
                      $eq: this.getUserId()
                    },
                    parentId: {
                      $eq: musicData.parentId
                    }
                  },
                  limit: 100
                })
                .then(result => {
                  const docs = result.docs;
                  if (docs) {
                    if (docs.length > nextIndex) {
                      this.$emit("sendNextMusicPlay", nextIndex)
                    }
                  }
                });
            });
          } else {
            let all = this.getAllPlayList();
            // 다음 인덱스
            let playlist = this.$lodash.find(all, {
              playlistId: musicData.name
            });
            if (playlist != undefined) {
              if (playlist.list.length > nextIndex) {
                this.$emit("sendNextMusicPlay", nextIndex)
              }
            }
          }
        }
      }
      this.status = [];
    },

    messageDialog(type, message) {
      this.$modal.show("dialog", {
        title: type,
        text: message,
        buttons: [
          {
            title: "Close"
          }
        ]
      })
    }
  }
}
