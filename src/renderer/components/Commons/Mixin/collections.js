/* ---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *-------------------------------------------------------------------------------------------- */

"use strict"

export default {
  methods: {
    /**
     * @/MusicList.vue
     * @/MusicPlayList.vue
     *
     * Youtube로 검색되는 재생 목록 or 채널 목록에서 사용 됨.
     * 해당 재생목록이 콜렉션에 등록되어 있는지 체크함. (재생목록내 상단 우측에 별모양 아이콘(on/off) 확인)
     */
    getLike() {
      const user_id = this.getUserId()
      if (user_id) {
        if (this.playType === "play") {
          const playlistId = this.playlist[0].playlistId
          return this.createIndex(["type", "userId", "playlistId"]).then(() => {
            return this.$test.find({
              selector: {
                type: { $eq: "myplaylist" },
                userId: { $eq: user_id },
                playlistId: { $eq: playlistId }
              }
            })
          })
        } else if (this.playType === "channel") {
          const channelId = this.playlist[0].channelId
          return this.createIndex(["type", "userId", "playlistId"]).then(() => {
            return this.$test.find({
              selector: {
                type: { $eq: "mychannel" },
                userId: { $eq: user_id },
                channelId: { $eq: channelId }
              }
            })
          })
        }
      }
    },

    /**
     * @/CollectionList.vue
     *
     * 내 콜렉션 PLAY LIST or CHANNEL 상세 목록조회
     * 목록 최대갯수는 디폴트 25개이며, 리미트로 변경가능.
     */
    getCollectionList() {
      const musicInfo = this.getMusicInfos()
      const user = this.getUserId()
      if (musicInfo) this.isSub = true
      if (user) {
        const options = {
          selector: {
            type: {
              $eq: this.playType === "play" ? "myplaylist" : "mychannel"
            },
            userId: {
              $eq: user
            }
          }
        }
        this.createIndex(["type", "userId", "playlistId"]).then(() => {
          this.$test.find(options).then(result => {
            this.playlists = result.docs
          })
        })
      }
      this.load = true
    },

    /**
     * @/Collection/Index.vue
     *
     * 내 컬렉션 목록에 등록 된 PLAY LIST를 최근 4개만 조회한다.
     */
    getPlaylist() {
      const musicInfo = this.getMusicInfos()
      const user = this.getUserId()
      if (musicInfo) this.isSub = true
      if (user) {
        this.createIndex(["type", "userId", "playlistId"]).then(() => {
          this.$test
            .find({
              selector: {
                type: {
                  $eq: "myplaylist"
                },
                userId: {
                  $eq: user
                }
              },
              limit: 4
            })
            .then(result => {
              this.playlists = result.docs
            })
        })
      }
    },

    /**
     * @/Collection/Index.vue
     *
     * 내 컬렉션 목록에 등록 된 CHANNEL을 최근 4개만 조회한다.
     */
    getChannelList() {
      const musicInfo = this.getMusicInfos()
      const user = this.getUserId()
      if (musicInfo) this.isSub = true
      if (user) {
        this.createIndex(["type", "userId", "channelId"]).then(() => {
          this.$test
            .find({
              selector: {
                type: {
                  $eq: "mychannel"
                },
                userId: {
                  $eq: user
                }
              },
              limit: 4
            })
            .then(result => {
              this.channelLists = result.docs
            })
        })
      }
    },

    /**
     * @/Collections/Index.vue
     *
     * 내 컬렉션에 등록 된 PLAY LIST or CHANNEL을 삭제한다.
     * // 주의: 이 삭제는 Index 페이지에서 삭제일 경우임.
     */
    albumRemoveCallback(doc) {
      this.$test.remove(doc).then(result => {
        if (result.ok) {
          if (doc.playType === "play") {
            this.getPlaylist()
          } else if (doc.playType === "channel") {
            this.getChannelList()
          }
        }
        this.$modal.hide("dialog")
      })
    },

    /**
     * @/CollectionList.vue
     *
     * 내 컬렉션에 등록 된 PLAY LIST or CHANNEL을 삭제한다.
     * // 주의: 이 삭제는 상세 페이지 목록에서 삭제일 경우임.
     */
    albumCollectionRemoveCallback(doc) {
      this.$test.remove(doc).then(result => {
        if (result.ok) {
          this.getCollectionList()
        }
        this.$modal.hide("dialog")
      })
    }
  }
}
