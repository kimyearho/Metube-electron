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
import * as $commons from '@/service/commons-service.js'
import StoreMixin from '@/components/Mixin/index'

export default {
  name: 'CollectionRegister',
  mixins: [StoreMixin],
  props: {
    isLikeToggle: {
      type: Boolean,
      default: false
    },
    data: Object,
    playType: String
  },
  data () {
    return {
      isToggle: false,
      id: null
    }
  },
  watch: {
    data (val) {
      this.data = val
    },
    isLikeToggle (val) {
      this.isToggle = val
    }
  },
  methods: {
    like () {
      let id = this.getUserId()
      if (id) {
        if (this.isToggle) {
          if (this.data) {
            this.$local
              .find({
                selector: {
                  type: 'profile',
                  userId: id
                },
                fields: ['_id', 'collections']
              })
              .then(result => {
                let docs = result.docs[0]
                let key = docs._id
                if (key) {
                  this.$local.get(key).then(doc => {
                    doc.collections = this.$lodash.reject(doc.collections, {
                      playlistId: this.data.playlistId
                    })
                    return this.$local.put(doc).then(res => {
                      if (res.ok) {
                        this.isToggle = false
                        this.$emit('toggle', this.isToggle)
                        this.$emit('callback', true)
                      }
                    })
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        } else {
          if (this.data) {
            // 나의 아이디로 등록 된 콜렉션 리스트 조회
            this.$local
              .find({
                selector: {
                  type: 'profile',
                  userId: id
                },
                fields: ['_id', 'collections']
              })
              .then(result => {
                let docs = result.docs[0]
                let collections = docs.collections
                if (this.$lodash.size(collections) > 0) {
                  let item = this.$lodash.find(docs, {
                    playlistId: this.data.playlistId
                  })
                  if (item) {
                    // 이미 등록 된 콜렉션
                    this.alreadyDialog()
                  } else {
                    // 등록되지 않은 콜렉션이면 등록한다.
                    this.addCollection(id, this.data)
                  }
                } else {
                  // 나의 계정으로 등록 된 콜렉션이 전혀 없을 경우.
                  this.addCollection(id, this.data)
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      } else {
        this.errorLogin()
      }
    },

    addCollection (id, item) {
      let data = {
        playType: this.playType,
        playlistId: item.playlistId,
        channelId: item.channelId ? item.channelId : null,
        videoId: item.videoId,
        title: item.title,
        creates: this.$moment().format('YYYYMMDDkkmmss'),
        created: this.$moment().format('YYYY-MM-DD kk:mm:ss')
      }
      if (this.playType === 'play') {
        data.thumbnails = item.imageInfo
        this.$local
          .find({
            selector: {
              type: 'profile',
              userId: this.getUserId()
            }
          })
          .then(result => {
            let docs = result.docs[0]
            docs.collections.push(data)
            this.$local.put(docs).then(res => {
              if (res.ok) {
                this.isToggle = true
                this.$emit('toggle', true)
              }
            })
          })
      } else {
        let requestURL = $commons.youtubeChannelSearch(item.channelId)
        this.$http.get(requestURL).then(res => {
          let items = res.data.items[0]
          this.$http.get(requestURL).then(res => {
            data.thumbnails = res.data.items[0].snippet.thumbnails.medium.url
            data.title = res.data.items[0].snippet.title
            this.$local
              .find({
                selector: {
                  type: 'profile',
                  userId: this.getUserId()
                }
              })
              .then(result => {
                let docs = result.docs[0]
                docs.collections.push(data)
                this.$local.put(docs).then(res => {
                  if (res.ok) {
                    this.isToggle = true
                    this.$emit('toggle', true)
                  }
                })
              })
          })
        })
      }
    },

    alreadyDialog () {
      this.$modal.show('dialog', {
        title: 'Info',
        text: 'Already registered playlist.',
        buttons: [
          {
            title: 'Close'
          }
        ]
      })
    },

    errorLogin () {
      this.$modal.show('dialog', {
        title: 'Infomation',
        text: 'It is available after login.',
        buttons: [
          {
            title: 'Close'
          }
        ]
      })
    }
  }
}
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
