/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <img
      class="like"
      v-if="isToggle"
      src="@/assets/images/svg/bookmark-on.svg"
      title="Remove Collection"
    >
    <img
      class="like"
      v-if="!isToggle"
      src="@/assets/images/svg/bookmark-off.svg"
      title="Add Collection"
    >
  </div>
</template>

<script>
import * as $commons from "@/service/commons-service.js";
import StoreMixin from "@/components/Mixin/index";
import DataUtils from "@/components/Mixin/db";

export default {
  name: "CollectionRegister",
  mixins: [StoreMixin, DataUtils],
  props: {
    isLikeToggle: {
      type: Boolean,
      default: false
    },
    data: Object,
    playType: String
  },
  data() {
    return {
      isToggle: false,
      id: null
    };
  },
  watch: {
    data(val) {
      this.data = val;
    },
    isLikeToggle(val) {
      this.isToggle = val;
    }
  },
  methods: {
    like() {
      let id = this.getUserId();
      if (id) {
        if (this.isToggle) {
          if (this.data) {

            console.log(this.data)

            // this.createIndex(["type", "userId", "playlistId"])
            //   .then(() => {
            //     return this.$test
            //       .find({
            //         selector: {
            //           type: {
            //             $eq: "myplaylist"
            //           },
            //           userId: {
            //             $eq: id
            //           },
            //           plyalistId: {
            //             $eq: ""
            //           }
            //         },
            //       })
            //   });

            // this.$local
            //   .find({
            //     selector: {
            //       type: "profile",
            //       userId: id
            //     },
            //     fields: ["_id", "collections"]
            //   })
            //   .then(result => {
            //     let docs = result.docs[0];
            //     let key = docs._id;
            //     if (key) {
            //       this.$local.get(key).then(doc => {
            //         doc.collections = this.$lodash.reject(doc.collections, {
            //           playlistId: this.data.playlistId
            //         });
            //         return this.$local.put(doc).then(res => {
            //           if (res.ok) {
            //             this.isToggle = false;
            //             this.$emit("toggle", this.isToggle);
            //             this.$emit("callback", true);
            //           }
            //         });
            //       });
            //     }
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   });
          }
        } else {
          if (this.data) {

            console.log(this.data)

            let listType = "";
            if (this.playType === 'play') {
              listType = "myplaylist"
            } else {
              listType = "mychannel"
            }

            // 나의 아이디로 등록 된 콜렉션 리스트 조회
            this.createIndex(["type", "userId"]).then(() => {
              return this.$test
                .find({
                  selector: {
                    type: {
                      $eq: listType
                    },
                    userId: {
                      $eq: this.getUserId()
                    }
                  }
                })
                .then(result => {
                  const docs = result.docs;
                  if (docs.length > 0) {
                    let findToItem = "";
                    if (this.playType === 'play') {
                      findToItem = this.$lodash.find(docs, {
                        playlistId: this.data.playlistId
                      });
                    } else {
                      findToItem = this.$lodash.find(docs, {
                        channelId: this.data.list[0].channelId
                      });
                    }
                    if (findToItem) {
                      // 이미 등록 된 컬렉션
                      this.alreadyDialog();
                    } else {
                      // 등록되지 않은 콜렉션이면 등록한다.
                      this.addCollection(this.data);
                    }
                  } else {
                    // 등록되지 않은 콜렉션이면 등록한다.
                    this.addCollection(this.data);
                  }
                });
            });
          }
        }
      } else {
        this.errorLogin();
      }
    },

    addCollection(item) {
      let data = {
        playType: this.playType,
        userId: this.getUserId(),
        playlistId: item.list[0].playlistId,
        channelId: item.list[0].channelId ? item.list[0].channelId : null,
        videoId: item.videoId ? item.videoId : null,
        title: item.playlistTitle,
        creates: this.$moment().format("YYYYMMDDHHmmss"),
        created: this.$moment().format("YYYY-MM-DD HH:mm:ss")
      };
      if (this.playType === "play") {
        data.type = "myplaylist";
        data.thumbnails = item.list[0].imageInfo;
        this.$test.post(data).then(result => {
          if (result.ok) {
            this.isToggle = true;
            this.$emit("toggle", true);
          }
        });
      } else {
        // 채널
        let requestURL = $commons.youtubeChannelSearch(data.channelId);
        this.$http.get(requestURL).then(res => {
          console.log(res)
          data.thumbnails = res.data.items[0].snippet.thumbnails.medium.url;
          data.title = res.data.items[0].snippet.title;
          data.type = "mychannel";
          this.$test.post(data).then(result => {
            if (result.ok) {
              this.isToggle = true;
              this.$emit("toggle", true);
            }
          });
        });
      }
    },

    alreadyDialog() {
      this.$modal.show("dialog", {
        title: "Info",
        text: "Already registered playlist.",
        buttons: [
          {
            title: "Close"
          }
        ]
      });
    },

    errorLogin() {
      this.$modal.show("dialog", {
        title: "Infomation",
        text: "It is available after login.",
        buttons: [
          {
            title: "Close"
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.like {
  width: 20px;
  height: 20px;
  top: 48px;
  left: 335px;
  z-index: 10;
}
</style>
