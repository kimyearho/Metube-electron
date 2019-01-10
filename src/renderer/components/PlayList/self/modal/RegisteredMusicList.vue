/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <el-dialog
      style="z-index:998 !important;"
      title="MyCollectionsList"
      :visible="isOpen"
      :before-close="closeModal"
      :close-on-click-modal="false"
      :append-to-body="true"
      @open="getPlaylist"
      width="300px"
    >
      <div class="wrapper">
        <ul>
          <li
            v-for="(item, index) in listData"
            :key="index"
          >
            <div>{{ item.title }}</div>
            <div class="selected">
              <md-button
                class="md-raised md-primary"
                :disabled="item.isExists"
                @click="addItem(item)"
              >{{ $t('COLLECTION.ADD_VIDEO_LABEL') }}</md-button>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import StoreMixin from '@/components/Mixin/index'
export default {
  name: 'RegisteredMusicList',
  mixins: [StoreMixin],
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    data: Object
  },
  data() {
    return {
      listData: []
    }
  },
  methods: {
    addItem(listData) {
      this.$local
        .find({
          selector: {
            type: 'profile',
            userId: this.getUserId()
          }
        })
        .then(result => {
          let docs = result.docs[0]
          let selectedPlaylistKey = listData._key
          let resultTracks = this.$lodash
            .chain(docs.playlists)
            .find({ _key: selectedPlaylistKey })
            .value().tracks
          let flag = this.$lodash.find(resultTracks, {
            videoId: this.data.videoId
          })
          if (!flag) {
            let insertTrackData = {
              videoId: this.data.videoId,
              channelId: this.data.channelId,
              channelTitle: this.data.channelTitle,
              type: 'MY-COLLECTION',
              isLive: this.data.isLive ? this.data.isLive : 'none',
              title: this.data.title,
              duration: this.data.duration,
              duration_time: this.data.duration_time,
              thumbnails: this.data.imageInfo !== undefined ? this.data.imageInfo : this.data.image,
              creates: this.$moment().format('YYYYMMDDkkmmss'),
              created: this.$moment().format('YYYY-MM-DD kk:mm:ss')
            }
            resultTracks.push(insertTrackData)
            this.$local.put(docs).then(res => {
              if (res.ok) {
                this.closeModal()
              }
            })
          }
        })
    },
    getPlaylist() {
      this.$local
        .find({
          selector: {
            type: 'profile',
            userId: this.getUserId()
          },
          fields: ['playlists']
        })
        .then(result => {
          let docs = result.docs[0]
          if (docs) {
            this.listData = docs.playlists
            this.$lodash.forEach(docs.playlists, (item, index) => {
              let data = this.$lodash.find(item.tracks, {
                videoId: this.data.videoId
              })
              if (data) {
                this.listData[index].isExists = true
              }
            })
          }
        })
    },
    closeModal() {
      this.$emit('closeModal', false)
    }
  }
}
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}

ul li {
  list-style: none;
  padding: 5px;
  line-height: 30px;
}

ul li div {
  display: inline-block;
}

.selected {
  float: right;
}

.md-button {
  min-width: 0px !important;
  height: 21px !important;
}
</style>
