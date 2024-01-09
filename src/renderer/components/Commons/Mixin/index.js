/* ---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *-------------------------------------------------------------------------------------------- */

"use strict";

export default {
  methods: {
    getProfile() {
      return this.$store.getters.getUserInfo;
    },
    getUserId() {
      return this.$store.getters.getUserInfo.id;
    },
    getMusicInfos() {
      return this.$store.getters.getPlayingMusicInfo;
    },
    getAllPlayList() {
      return this.$store.getters.getPlayList;
    },
    getSearchKeyword() {
      return this.$store.getters.getSearchText;
    },
    getNextSearchList() {
      return this.$store.getters.getNextSearchList;
    },
    getNextPageToken() {
      return this.$store.getters.getNextPageToken;
    },
    getRepeat() {
      return this.$store.getters.getRepeat;
    },
    getPlayType() {
      return this.$store.getters.getPlayType;
    },
    getVolume() {
      return this.$store.getters.getVolume;
    },
    getState() {
      return this.$store.getters.getPlayerOption;
    },
    getAlwaysTop() {
      return this.$store.getters.getAlwaysTopOption;
    },
    getLocale() {
      return this.$store.getters.getLocale;
    },
    getVersionCheck() {
      return this.$store.getters.getVersionCheck;
    },
    getScrollPos() {
      return this.$store.getters.getScrollPos;
    },
    getMyMusicList() {
      return this.$store.getters.getMyMusicList;
    },
    getLocalPK() {
      return this.$store.getters.getLocalPK;
    },
    getDownloadQuality() {
      return this.$store.getters.getDownloadQuality
    },
    getDownloadPath() {
      return this.$store.getters.getDownloadPath;
    },
    getDownloadList() {
      return this.$store.getters.getDownloadList;
    },
    getDownloadProgress() {
      return this.$store.getters.getDownloadProgress;
    },
    getUser() {
      return this.$sessionStorage.get('user')
    },
    getLog(message, data) {
      if (process.env.NODE_ENV !== "production") {
        let logger = {};
        if (data) {
          logger = {
            message: message,
            value: data
          };
        } else {
          logger = {
            message: message
          };
        }
        // this.$ipcRenderer.send("eventLogger", logger);
      }
    },
    getNextToken() {
      return this.$store.getters.getNextToken;
    },
    sendTracker(eventName, data) {
      if(process.env.NODE_ENV === 'production') {
        this.$ipcRenderer.send(eventName, data)
      }
    },
    insertVideoHistory(data) {
      this.createIndex(["type", "userId", "videoId"]).then(() => {
        return this.$test
          .find({
            selector: {
              type: {
                $eq: "history"
              },
              userId: {
                $eq: this.getUserId()
              },
              videoId: {
                $eq: data.videoId
              }
            }
          })
          .then(result => {
            let docs = result.docs;
            if (docs.length <= 0) {
              const postData = {
                type: "history",
                userId: this.getUserId(),
                videoId: data.videoId,
                channelId: data.channelId,
                channelTitle: data.channelTitle,
                title: data.title,
                isLive: data.isLive,
                image:
                  data.imageInfo !== undefined
                    ? data.imageInfo
                    : data.thumbnails,
                duration_time: data.duration_time,
                duration: data.duration,
                creates: this.$moment().format("YYYYMMDDHHmmss"),
                created: this.$moment().format("YYYY-MM-DD HH:mm:ss")
              };
              this.$test.post(postData);
            } else {
              this.getLog("exists item: ", data);
            }
          });
      });
    },
    insertUserRecommand(data) {
      this.$db.get("17901f376f4ff226c03adecee00013d5").then(result => {
        let recommand = result.recommand;
        if (recommand) {
          let item = this.$lodash.find(recommand, {
            videoId: data.videoId
          });
          if (!item) {
            this.insertUserRecommandCallback(data);
          } else {
            this.getLog("exists item: ", item);
          }
        }
      });
    },
    insertUserRecommandCallback(data) {
      let postData = {
        videoId: data.videoId,
        title: data.title,
        thumbnail:
          data.imageInfo !== undefined ? data.imageInfo : data.thumbnails,
        creates: this.$moment().format("YYYYMMDDHHmmss"),
        created: this.$moment().format("YYYY-MM-DD HH:mm:ss")
      };
      this.$db.get("17901f376f4ff226c03adecee00013d5").then(result => {
        let recommand = result.recommand;
        if (recommand) {
          recommand.push(postData);
          return this.$db.put(result).then(res => {
            if (res.ok) {
              this.getLog("success item: ", data.videoId);
            } else {
              console.error("error");
            }
          });
        }
      });
    }
  }
};
