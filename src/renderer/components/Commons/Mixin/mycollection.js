/* ---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *-------------------------------------------------------------------------------------------- */

"use strict";

export default {
  methods: {
    /**
     * 나의 컬렉션을 삭제한다.
     * 추가: DB 스토어도 삭제해야한다.
     *
     * @param {*} data - 컬렉션 데이터
     * @param {*} type - 타입
     */
    myCollectionRemove(_id, type) {
      this.$test
        .createIndex({
          index: {
            fields: ["userId", "parentId"]
          }
        })
        .then(result => {
          this.getLog("index => ", result);
          return this.$test
            .find({
              selector: {
                userId: {
                  $eq: this.getUserId()
                },
                parentId: {
                  $eq: _id
                }
              },
              limit: 100
            })
            .then(results => {
              // 내 컬렉션 삭제
              return Promise.all(
                results.docs.map(row => {
                  return this.$test.remove(row);
                })
              );
            })
            .then(() => {
              // 내 컬렉션이 삭제되면, 내 컬렉션에 포함된 하위 데이터들을 모두 삭제한다.
              this.$test.get(_id).then(doc => {
                return this.$test.remove(doc).then(result => {
                  if (result.ok) {
                    if (type === "index") {
                      this.getMyCollection();
                    } else {
                      this.getMyCollectionList();
                    }
                    // 위 실제 DB 모델이 삭제되었으므로, DB 스토어도 삭제한다.
                    this.$test
                      .find({
                        selector: {
                          type: "profile",
                          userId: this.getUserId()
                        }
                      })
                      .then(result => {
                        const docs = result.docs[0];
                        if (docs) {
                          let collections = docs.collections;
                          docs.collections = this.$lodash.reject(collections, {
                            id: _id
                          });
                          this.$test.put(docs).then(result => {
                            if (result.ok) {
                              this.getLog("DB Stroe Remove Update!", {});
                            }
                          });
                        }
                      });
                  }
                });
              });
              this.$modal.hide("dialog");
            });
        });
    },

    /**
     * 내 컬렉션 목록을 가져온다 (상위 4개)
     */
    getMyCollection() {
      let user_id = this.getUserId();
      if (user_id) {
        this.createIndex(["creates"]).then(() => {
          return this.$test
            .find({
              selector: {
                type: {
                  $eq: "mycollection"
                },
                userId: {
                  $eq: user_id
                },
                creates: {
                  $gte: null
                }
              },
              sort: [{ creates: "desc" }],
              limit: 4
            })
            .then(result => {
              this.myCollections = result.docs;
              this.isCreate = false;
            })
            .catch(error => {
              console.log(error);
            });
        });
      }
    },

    /**
     * 내 컬렉션 목록을 가져온다. (최대 20개)
     */
    getMyCollectionList() {
      const musicInfo = this.getMusicInfos();
      const user = this.getUserId();
      if (musicInfo) this.isSub = true;
      if (user) {
        this.createIndex(["creates"]).then(() => {
          return this.$test
            .find({
              selector: {
                type: {
                  $eq: "mycollection"
                },
                userId: {
                  $eq: user
                },
                creates: {
                  $gte: null
                }
              },
              limit: 20,
              sort: [{ creates: "desc" }]
            })
            .then(result => {
              this.playlists = result.docs;
              this.isCreate = false;
            })
            .catch(error => {
              console.log(error);
            });
        });
      }
      this.load = true;
    },

    // 내 컬렉션 총 개수를 가져온다
    getMyCollectionListCount() {
      const user = this.getUserId();
      if (user) {
        return this.createIndex(["creates"]).then(() => {
          return this.$test
            .find({
              selector: {
                type: {
                  $eq: "mycollection"
                },
                userId: {
                  $eq: user
                },
                creates: {
                  $gte: null
                }
              },
              limit: 20,
              sort: [{ creates: "desc" }]
            })
            .then(result => {
              return result.docs.length;
            })
            .catch(error => {
              console.log(error);
            });
        });
      }
    },

    /**
     * 재생목록 동기화 및 비디오 실행
     *
     * @param {*} index - 다음 곡 index
     * @param {*} musicInfo - 현재 재생정보
     */
    getMyMusicSyncList(index, musicData) {
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
                id: musicData.name
              });
              this.playlist = findItem.list;

              let nextIndex = 0;
              if (this.playlist.length > index) {
                nextIndex = index;
              }
              // 재생목록에서 해당하는 트랙번호의 비디오
              let playingItem = this.playlist[nextIndex];
              playingItem.index = nextIndex;
              playingItem.name = musicData.name;

              this.totalTracks = this.playlist.length;
              this.playSetting(playingItem, "event");
              if (index === 0) {
                this.nextTrackScroll(-1);
              } else {
                this.nextTrackScroll(500);
              }
            }
          });
      });
    }
  }
};
