/* ---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *-------------------------------------------------------------------------------------------- */

"use strict";

export default {
  methods: {
    getLike() {
      let user_id = this.getUserId();
      if (user_id) {
        if (this.playType === "play") {
          let id = this.playlist[0].playlistId;
          this.$local
            .find({
              selector: {
                type: "profile",
                userId: user_id
              },
              fields: ["collections"]
            })
            .then(result => {
              let docs = result.docs[0];
              let collections = docs.collections;
              if (collections) {
                let item = this.$lodash.find(collections, {
                  playType: "play",
                  playlistId: id
                });
                if (item) {
                  this.isLikeToggle = true;
                }
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else if (this.playType === "channel") {
          let id = this.playlist[0].channelId;
          this.$local
            .find({
              selector: {
                type: "profile",
                userId: user_id
              },
              fields: ["collections"]
            })
            .then(result => {
              let docs = result.docs[0];
              let collections = docs.collections;
              if (collections) {
                let item = this.$lodash.find(collections, {
                  playType: "channel",
                  channelId: id
                });
                if (item) {
                  this.isLikeToggle = true;
                }
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    },

    getCollectionList() {
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
            fields: ["collections"]
          })
          .then(result => {
            let docs = result.docs[0];
            let collections = docs.collections;
            if (collections) {
              let items = this.$lodash.filter(collections, {
                playType: this.playType
              });
              if (items) {
                this.playlists = this.$lodash
                  .chain(items)
                  .orderBy(["creates"], ["desc"])
                  .take(10)
                  .value();
                this.load = true;
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.load = true;
      }
    },

    getPlaylist() {
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
            fields: ["collections"]
          })
          .then(result => {
            let docs = result.docs[0];
            let collections = docs.collections;
            if (collections) {
              let items = this.$lodash.filter(collections, {
                playType: "play"
              });
              if (items) {
                this.playlists = this.$lodash
                  .chain(items)
                  .orderBy(["creates"], ["desc"])
                  .take(4)
                  .value();
              }
            } else {
              this.playlists = [];
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    getChannelList() {
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
            fields: ["collections"]
          })
          .then(result => {
            let docs = result.docs[0];
            let collections = docs.collections;
            if (collections) {
              let items = this.$lodash.filter(collections, {
                playType: "channel"
              });
              if (items) {
                this.channelLists = this.$lodash
                  .chain(items)
                  .orderBy(["creates"], ["desc"])
                  .take(4)
                  .value();
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    albumRemoveCallback() {
      let playlistId = this.data.playlistId;
      this.$local
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          },
          fields: ["_id", "collections"]
        })
        .then(result => {
          let docs = result.docs[0];
          let key = docs._id;
          if (key) {
            this.$local.get(key).then(doc => {
              doc.collections = this.$lodash.reject(doc.collections, {
                playlistId: playlistId
              });
              return this.$local.put(doc).then(res => {
                if (res.ok) {
                  if (this.playType === "play") {
                    this.getPlaylist();
                  } else {
                    this.getChannelList();
                  }
                }
              });
            });
            this.$modal.hide("dialog");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    albumCollectionRemoveCallback() {
      let playlistId = this.data.playlistId;
      this.$local
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          },
          fields: ["_id", "collections"]
        })
        .then(result => {
          let docs = result.docs[0];
          let key = docs._id;
          if (key) {
            this.$local.get(key).then(doc => {
              doc.collections = this.$lodash.reject(doc.collections, {
                playlistId: playlistId
              });
              return this.$local.put(doc).then(res => {
                if (res.ok) {
                  this.getList();
                }
              });
            });
            this.$modal.hide("dialog");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
