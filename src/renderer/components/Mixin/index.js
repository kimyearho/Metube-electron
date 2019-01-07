/* ---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *-------------------------------------------------------------------------------------------- */

'use strict'

export default {
  methods: {
    getProfile () {
      return this.$store.getters.getGoogleProfile
    },
    getUserId () {
      return this.$store.getters.getGoogleProfile.googleId
    },
    getMusicInfos () {
      return this.$store.getters.getPlayingMusicInfo
    },
    getAllPlayList () {
      return this.$store.getters.getPlayList
    },
    getSearchKeyword () {
      return this.$store.getters.getSearchText
    },
    getNextSearchList () {
      return this.$store.getters.getNextSearchList
    },
    getNextPageToken () {
      return this.$store.getters.getNextPageToekn
    },
    getRepeat () {
      return this.$store.getters.getRepeat
    },
    getPlayType () {
      return this.$store.getters.getPlayType
    },
    getVolume () {
      return this.$store.getters.getVolume
    },
    getState () {
      return this.$store.getters.getPlayerOption
    },
    getAlwaysTop () {
      return this.$store.getters.getAlwaysTopOption
    },
    getLocale () {
      return this.$store.getters.getLocale
    },
    getVersionCheck () {
      return this.$store.getters.getVersionCheck
    },
    getScrollPos () {
      return this.$store.getters.getScrollPos
    },
    getRemoveTrackIndex () {
      return this.$store.getters.getRemoveTrackIndex
    },
    getSnow () {
      return this.$store.getters.getSnow
    },
    getLog(message, data) {
      if(process.env.NODE_ENV !== 'production') {
        console.log(message, data)
      }
    },
    closeFab() {
      this.$refs.fab.MdSpeedDial.active = false
    },
    insertVideoHistory(data) {
      this.$local
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          },
          fields: ['_id', 'history']
        }).then(result => {
          let docs = result.docs[0]
          if(docs) {
            let item = this.$lodash.find(docs.history, { videoId: data.videoId })
            if(!item) {
              this.insertHistoryCallback(data)
            } else {
              this.getLog('exists item: ', item);
            }
          }
        })
      
    },
    insertHistoryCallback(data) {
      let postData = {
        videoId: data.videoId,
        title: data.title,
        isLive: data.isLive,
        image: data.imageInfo !== undefined ? data.imageInfo : data.thumbnails,
        duration_code: data.duration_code,
        duration_time: data.duration_time,
        duration: data.duration,
        creates: this.$moment().format('YYYYMMDDkkmmss'),
        created: this.$moment().format('YYYY-MM-DD kk:mm:ss')
      }

      this.$local
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          }
        })
        .then(result => {
          let docs = result.docs[0]
          if (docs) {
            docs.history.push(postData)
            this.$local.put(docs).then(res => {
              if (res.ok) {
                // this.getLog('put success', null);
              }
            })
          }
        })
        .catch(err => {
          this.getLog('[insertHistoryCallback] error => ', err);
        });
    }
  }
}
