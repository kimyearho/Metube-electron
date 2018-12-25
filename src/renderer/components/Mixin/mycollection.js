/* ---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *-------------------------------------------------------------------------------------------- */

"use strict";

export default {
  methods: {
    /**
     * 나의 컬렉션 재생목록 드래그를 통한 목록 및 재생정보 동기화
     *
     * @param {*} value - 드래그 완료시 재생목록의 배열
     */
    syncMyCollection(value) {
      if (this.getUserId()) {
        this.$local
          .find({
            selector: {
              type: "profile",
              userId: this.getUserId()
            }
          })
          .then(result => {
            let docs = result.docs[0];
            if (docs) {
              let playlistDataIndex = this.$lodash.findIndex(docs.playlists, {
                _key: this.id
              });
              if (playlistDataIndex != undefined) {
                docs.playlists[playlistDataIndex].tracks = value;
                this.$local.put(docs).then(res => {
                  if (res.ok) {
                    let musicData = this.getMusicInfos();
                    // 현재 음악이 재생중이면 음악정보도 동기화 해야한다.
                    if (musicData) {
                      // 현재 재생중인 음악의 재생목록이 맞을때만,
                      if (musicData.name === this.id) {
                        // 동기화 된 재생목록을 가져온다.
                        this.$local
                          .find({
                            selector: {
                              type: "profile",
                              userId: this.getUserId()
                            },
                            fields: ["playlists"]
                          })
                          .then(result => {
                            let docs = result.docs[0];
                            let playlists = docs.playlists;
                            if (playlists) {
                              // 현재 페이지의 아이디와 동일한 재생목록을 찾는다.
                              let data = this.$lodash.find(playlists, {
                                _key: this.id
                              });
                              // 있음.
                              if (data) {
                                // 동기화 된 재생목록의 비디오중 현재 재생중인 음악과 동일한 비디오를 찾는다.
                                let trackIndex = this.$lodash.findIndex(
                                  data.tracks,
                                  { videoId: musicData.videoId }
                                );
                                // 인덱스 교체
                                musicData.index = trackIndex;

                                this.selectedIndex = trackIndex;

                                // 재생정보 세팅
                                this.$store.commit(
                                  "setPlayingMusicInfo",
                                  musicData
                                );
                                // 재생정보 변경 이벤트
                                this.$eventBus.$emit("playMusicSetting");
                              }
                            }
                          });
                      }
                    }
                  }
                });
              }
            }
          });
      }
    },

    /**
     * 나의 컬렉션을 삭제한다.
     *
     * @param {*} data - 컬렉션 데이터
     * @param {*} type - 타입
     */
    myCollectionRemove(data, type) {
      this.$local
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          }
        })
        .then(result => {
          let docs = result.docs[0];
          if (docs) {
            docs.playlists = this.$lodash
              .chain(docs.playlists)
              .reject({ _key: data._key })
              .value();
            this.$local.put(docs).then(res => {
              if (res.ok) {
                if (type === "index") {
                  this.getMyCollection();
                } else {
                  this.getMyCollectionList();
                }
              }
            });
            this.$modal.hide("dialog");
          }
        });
    },

    /**
     * 내 컬렉션 목록을 가져온다 (상위 4개)
     */
    getMyCollection() {
      let user_id = this.getUserId();
      if (user_id) {
        this.$local
          .find({
            selector: {
              type: "profile",
              userId: user_id
            },
            fields: ["playlists"]
          })
          .then(result => {
            let docs = result.docs[0];
            let playlists = docs.playlists;
            if (playlists) {
              this.myCollections = this.$lodash
                .chain(playlists)
                .orderBy(["creates"], ["desc"])
                .take(4)
                .value();
            }
          });
      }
    },

    /**
     * 내 컬렉션 목록을 가져온다.
     */
    getMyCollectionList() {
      let musicInfo = this.getMusicInfos();
      if (musicInfo) this.isSub = true;
      let id = this.getUserId();
      if (id) {
        this.$local
          .find({
            selector: {
              type: "profile",
              userId: id
            },
            fields: ["playlists"]
          })
          .then(result => {
            let docs = result.docs[0];
            let collections = docs.playlists;
            if (collections) {
              this.playlists = this.$lodash
                .chain(collections)
                .orderBy(["creates"], ["desc"])
                .take(10)
                .value();
            }
            this.load = true;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.load = true;
      }
    },

    /**
     * 재생목록 동기화 및 비디오 실행
     *
     * @param {*} index - 다음 곡 index
     * @param {*} musicInfo - 현재 재생정보
     */
    getMyMusicSyncList(index, musicInfo) {
      this.$local
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          },
          fields: ["playlists"]
        })
        .then(result => {
          let docs = result.docs[0];
          let playlists = docs.playlists;
          if (playlists) {
            let data = this.$lodash.find(playlists, {
              _key: this.id
            });

            this.playlist = data.tracks;

            // 재생목록에서 해당하는 트랙번호의 비디오
            let playingItem = this.playlist[index];
            playingItem.index = index;
            playingItem.name = musicInfo.name;

            this.totalTracks = this.playlist.length;
            this.playSetting(playingItem);
            if (index === 0) {
              this.nextTrackScroll(-1);
            } else {
              this.nextTrackScroll(500);
            }
          }
        });
    },

    /**
     * 비디오 삭제 후 재생목록 동기화
     */
    removeTosyncPlaylist() {
      this.$local
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          },
          fields: ["playlists"]
        })
        .then(result => {
          let docs = result.docs[0];
          let playlists = docs.playlists;
          if (playlists) {
            let data = this.$lodash.find(playlists, {
              _key: this.id
            });
            this.playlist = data.tracks;
            this.totalTracks = data.tracks.length;
          }
        });
    }
  }
};
