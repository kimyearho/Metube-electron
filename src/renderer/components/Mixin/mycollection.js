/* ---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *-------------------------------------------------------------------------------------------- */

"use strict"

export default {
  methods: {
    /**
     * 나의 컬렉션을 삭제한다.
     *
     * @param {*} data - 컬렉션 데이터
     * @param {*} type - 타입
     */
    myCollectionRemove(data, type) {
      this.$test
        .createIndex({
          index: {
            fields: ["userId", "parentId"]
          }
        })
        .then(result => {
          this.getLog("index => ", result)
          return this.$test
            .find({
              selector: {
                userId: {
                  $eq: this.getUserId()
                },
                parentId: {
                  $eq: data._id
                }
              },
              limit: 100
            })
            .then(results => {
              return Promise.all(
                results.docs.map(row => {
                  return this.$test.remove(row)
                })
              )
            })
            .then(() => {
              this.$test.get(data._id).then(doc => {
                return this.$test.remove(doc).then(result => {
                  if (result.ok) {
                    if (type === "index") {
                      this.getMyCollection()
                    } else {
                      this.getMyCollectionList()
                    }
                  }
                })
              })
              this.$modal.hide("dialog")
            })
        })
    },

    /**
     * 내 컬렉션 목록을 가져온다 (상위 4개)
     */
    getMyCollection() {
      let user_id = this.getUserId()
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
              this.myCollections = result.docs
            })
            .catch(error => {
              console.log(error)
            })
        })
      }
    },

    /**
     * 내 컬렉션 목록을 가져온다. (최대 7개)
     */
    getMyCollectionList() {
      const musicInfo = this.getMusicInfos()
      const user = this.getUserId()
      if (musicInfo) this.isSub = true
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
              limit: 7,
              sort: [{ creates: "desc" }]
            })
            .then(result => {
              this.playlists = result.docs
            })
            .catch(error => {
              console.log(error)
            })
        })
      }
      this.load = true
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
              this.playlist = docs

              // 재생목록에서 해당하는 트랙번호의 비디오
              let playingItem = this.playlist[index]
              playingItem.index = index
              playingItem.name = musicData.name

              this.totalTracks = this.playlist.length
              this.playSetting(playingItem)
              if (index === 0) {
                this.nextTrackScroll(-1)
              } else {
                this.nextTrackScroll(500)
              }
            }
          })
      })
    }
  }
}
