'use strict';

export default {
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
        const musicData = this.getMusicInfos()
        const isRepeat = this.getRepeat()
        // 반복여부
        if (isRepeat) {
          this.$ipcRenderer.send("win2Player", ["loadVideoById", musicData.videoId])
        } else {

          // 이전 음악의 인덱스 (현재 종료된 음악)
          let currentIndex = musicData.index
          // 다음 인덱스
          let nextIndex = currentIndex + 1

          let eventName = ''

          // 라우트 이름이 무엇
          if(this.$route.name === 'MY-PLAYING-PLAYLIST' || this.$route.name === 'PLAYING-PLAYLIST') {
            eventName = 'sendNextMusicPlay'
          } else {
            eventName = 'sendSubNextMusicPlay'
          }

          this.$eventBus.$emit(eventName, nextIndex)
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
      }, 10000);
    },

    statusResult() {
      this.$store.commit("setTimer", false);
      let statusSize = this.$lodash.size(this.status);
      let lastIndex = this.status[statusSize - 1];
      if (lastIndex) {

        // 재생실패
        if (lastIndex === -1) {

          let eventName = ''

          // 라우트 이름이 무엇
          if(this.$route.name === 'MY-PLAYING-PLAYLIST' || this.$route.name === 'PLAYING-PLAYLIST') {
            eventName = 'sendNextMusicPlay'
          } else {
            eventName = 'sendSubNextMusicPlay'
          }

          this.getLog("[PlaylistMix]/[statusResult] ====> 재생실패 lastIndex => ", lastIndex)
          this.getLog("[PlaylistMix]/[statusResult] ====> 재생실패 eventName => ", eventName)

          let musicData = this.getMusicInfos();
          let nextIndex = musicData.index + 1;

          // 내 콜렉션타입일때
          if (musicData.type === 'mycollectionItem') {
            this.getLog("[PlaylistMix]/[statusResult] ====> 컬렉션 재생실패 후 다음 비디오 시작 nextIndex => ", nextIndex)
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
                      this.$eventBus.$emit(eventName, nextIndex)
                    }
                  }
                });
            });
          } else {
            // 유튜브 재생목록 타입일때
            // 재생되는 비디오는 어떠한 경우에든 DB로 등록되어있음.
            const playType = musicData.type
            const playlistParentId = musicData.parentId
            const playPageNum = musicData.pageNum

            this.getLog("[PlaylistMix]/[statusResult] ====> 유튜브 재생실패 후 다음 비디오 시작 nextIndex => ", nextIndex)
            this.getPageVideoList(playType, playlistParentId, playPageNum)
              .then(result => {
                const docs = result.docs;
                if(docs) {
                  if(docs.length > nextIndex) {
                    this.$eventBus.$emit(eventName, nextIndex)
                  }
                }
              })
            
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
