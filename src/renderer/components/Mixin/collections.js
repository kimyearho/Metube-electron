/* ---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *-------------------------------------------------------------------------------------------- */

"use strict"

export default {
  methods: {
    getLike() {
      const user_id = this.getUserId()
      if (user_id) {
        if (this.playType === "play") {
          const playlistId = this.playlist[0].playlistId
          this.createIndex(["type", "userId", "playlistId"]).then(() => {
            return this.$test
              .find({
                selector: {
                  type: { $eq: "myplaylist" },
                  userId: { $eq: user_id },
                  playlistId: { $eq: playlistId }
                }
              })
              .then(result => {
                let docs = result.docs
                if (docs.length > 0) {
                  this.isLikeToggle = true
                }
              })
          })
        } else if (this.playType === "channel") {
          const channelId = this.playlist[0].channelId
          this.createIndex(["type", "userId", "playlistId"]).then(() => {
            return this.$test
              .find({
                selector: {
                  type: { $eq: "mychannel" },
                  userId: { $eq: user_id },
                  channelId: { $eq: channelId }
                }
              })
              .then(result => {
                let docs = result.docs
                if (docs.length > 0) {
                  this.isLikeToggle = true
                }
              })
          })
        }
      }
    },

    getCollectionList() {
      let musicInfo = this.getMusicInfos()
      if (musicInfo) this.isSub = true

      let id = this.getUserId()
      if (id) {
        this.$local
          .find({
            selector: {
              type: "profile",
              userId: id
            },
            fields: ["collections"]
          })
          .then(result => {
            let docs = result.docs[0]
            let collections = docs.collections
            if (collections) {
              let items = this.$lodash.filter(collections, {
                playType: this.playType
              })
              if (items) {
                this.playlists = this.$lodash
                  .chain(items)
                  .orderBy(["creates"], ["desc"])
                  .take(10)
                  .value()
                this.load = true
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.load = true
      }
    },

    getPlaylist() {
      const musicInfo = this.getMusicInfos()
      if (musicInfo) this.isSub = true
      const id = this.getUserId()
      if (id) {
        this.createIndex(["type", "userId", "playlistId"]).then(() => {
          this.$test
            .find({
              selector: {
                type: {
                  $eq: "myplaylist"
                },
                userId: {
                  $eq: this.getUserId()
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

    getChannelList() {
      const musicInfo = this.getMusicInfos()
      if (musicInfo) this.isSub = true
      const id = this.getUserId()
      if (id) {
        this.createIndex(["type", "userId", "channelId"]).then(() => {
          this.$test
            .find({
              selector: {
                type: {
                  $eq: "mychannel"
                },
                userId: {
                  $eq: id
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

    albumRemoveCallback() {
      let playlistId = this.data.playlistId
      this.$local
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          },
          fields: ["_id", "collections"]
        })
        .then(result => {
          let docs = result.docs[0]
          let key = docs._id
          if (key) {
            this.$local.get(key).then(doc => {
              doc.collections = this.$lodash.reject(doc.collections, {
                playlistId: playlistId
              })
              return this.$local.put(doc).then(res => {
                if (res.ok) {
                  if (this.playType === "play") {
                    this.getPlaylist()
                  } else {
                    this.getChannelList()
                  }
                }
              })
            })
            this.$modal.hide("dialog")
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    albumCollectionRemoveCallback() {
      let playlistId = this.data.playlistId
      this.$local
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          },
          fields: ["_id", "collections"]
        })
        .then(result => {
          let docs = result.docs[0]
          let key = docs._id
          if (key) {
            this.$local.get(key).then(doc => {
              doc.collections = this.$lodash.reject(doc.collections, {
                playlistId: playlistId
              })
              return this.$local.put(doc).then(res => {
                if (res.ok) {
                  this.getList()
                }
              })
            })
            this.$modal.hide("dialog")
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
