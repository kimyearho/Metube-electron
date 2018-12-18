/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <el-dropdown
      trigger="click"
      @command="menuEvent"
    >
      <a class="cursor">
        <img
          class="contextMenu"
          src="@/assets/images/svg/context-menu.svg"
        >
      </a>
      <el-dropdown-menu
        slot="dropdown"
        v-if="videoId === data.videoId"
      >
        <el-dropdown-item
          class="bold"
          :disabled="user === null"
        >
          <i class="el-icon-delete"></i> Remove
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import storeMixin from '@/components/Mixin/index'
export default {
  name: 'MyContextMenu',
  mixins: [storeMixin],
  props: {
    id: String,
    videoId: String,
    index: Number,
    data: Object
  },
  data() {
    return {
      user: null
    }
  },
  mounted() {
    this.user = this.getUserId()
  },
  methods: {
    menuEvent(ev) {
      let musicInfo = this.getMusicInfos();
      if (musicInfo) {
        if (this.videoId === musicInfo.videoId) {
          this.$modal.show('dialog', {
            title: 'Info',
            text: 'You can not delete videos that are playing',
            buttons: [
              {
                title: 'Close'
              }
            ]
          })
        } else {
          this.delete()
        }
      } else {
        this.delete()
      }
    },
    delete() {
      this.$local
        .find({
          selector: {
            type: 'profile',
            userId: this.user
          }
        })
        .then(result => {
          let docs = result.docs[0]
          if (docs) {
            let playlists = docs.playlists
            let playlistDataIndex = this.$lodash.findIndex(docs.playlists, {
              _key: this.id
            })

            if (playlistDataIndex != undefined) {
              // 나의 컬렉션 목록중 _key와 일치하는 재생목록정보를 찾는다.
              let playlistData = this.$lodash
                .chain(docs.playlists)
                .find({ _key: this.id })
                .value()
              // 재생목록정보내 포함된 트랙에서 비디오를 삭제하고 배열로 돌려받는다.
              playlistData.tracks = this.$lodash.reject(
                playlistData.tracks,
                {
                  videoId: this.videoId
                }
              )
              // 위 작업후 나의 컬렉션목록에 데이터를 갱신 후 업데이트
              docs.playlists[playlistDataIndex] = playlistData
              this.$local.put(docs).then(res => {
                if (res.ok) {
                  /**
                   * 음악이 재생중일때 삭제 될 비디오의 인덱스를 저장한다.
                   * 비디오가 삭제 된 재생목록은 인덱스가 새로 갱신되기 때문에 재생중인 음악의 인덱스 번호를 새로 동기화 하기 위함.
                   * 그렇지 않으면 재생순서가 어긋난다. 단, 비디오가 재생중이지 않다면 저장하지 않아도 된다.
                   */
                  if (this.getMusicInfos() != undefined) {
                    let musicInfos = this.getMusicInfos()
                    let playIndex = musicInfos.index
                    if (playIndex > this.index) {
                      musicInfos.index = this.index
                      // // 재생정보 세팅
                      this.$store.commit('setPlayingMusicInfo', musicInfos)

                      // 재생정보 변경 이벤트
                      this.$eventBus.$emit('playMusicSetting')
                    }
                  }
                  this.$emit('is-success', true)
                }
              })
            }
          }
        })
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 320px;
  height: 42px;
}

.el-mgn {
  margin-top: 8px;
  margin-left: 26px;
}

.el-button--mini,
.el-button--mini.is-round {
  padding: 5px 2px;
}

.close {
  width: 20px;
  position: absolute;
  right: 27px;
  top: 305px;
}
.contextMenu {
  width: 15px;
  height: 15px;
}
.bold {
  font-weight: 500;
}
</style>
