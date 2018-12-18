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
    }
  }
}
