/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

<template>
  <div>
    <div id="player">
      <!-- 타이틀바 컴포넌트 -->
      <top-header @reloadMusicList="feachData" />

      <div class="zaudio_wrapper">
        <!-- 커버 영역 -->
        <div class="zaudio_container">
          <div class="side_menu">
            <a
              class="cursor"
              @click="goBack"
            >
              <img
                src="@/assets/images/svg/menu-back.svg"
                title="Back"
              >
            </a>
          </div>
          <div class>
            <img
              class="cover"
              :src="cover"
            >
            <div class="zaudio_trackinfo trackinfo">
              <span class="label_related label_v">{{ category }}</span>
              <br>
              <br>
              <div class="titleflow">
                <span class="zaudio_songtitle">{{ coverTitle }}</span>
                <br>
                <span class="zaudio_songartist">{{ channelTitle }}</span>
                <span class="zaudio_songartist">/ {{ totalTracks }} Tracks</span>
                <div class="sideMenu">
                  <a
                    class="cursor"
                    title="Collection edit"
                    style="margin-right:10px;"
                    @click="collectionEdit"
                  >
                    <font-awesome-icon
                      class="f20"
                      icon="edit"
                    />
                  </a>
                  <a
                    class="cursor"
                    title="Cover change"
                    @click="collectionCoverChange"
                  >
                    <font-awesome-icon
                      class="f20"
                      icon="images"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="overay"></div>
        </div>

        <!-- 재생목록 드래그 지점 -->
        <draggable
          element="ul"
          id="list"
          class="zaudio_playlist"
          :class="{ dynamicHeight: isMini }"
          :options="{animation:150}"
          :list="playlist"
          @end="endDrag"
        >
          <li
            v-if="playlist.length === 0"
            style="height: 140px;"
          >
            <span style="margin-left:40px;">😭 There is no registered video.</span>
          </li>
          <li
            :id="`item${index}`"
            v-for="(item, index) in playlist"
            :key="index"
          >
            <img
              class="thumbnails"
              :src="item.thumbnails"
            >
            <span
              class="music-title cursor"
              @click="route(item, index)"
            >{{ item.title }}</span>
            <span style="flex-grow:1"></span>
            <span
              class="label_video"
              v-if="item.videoId"
            >{{ item.duration }}</span>
            <my-context-menu
              :id="id"
              :index="index"
              :videoId="item.videoId"
              :data="item"
              @is-success="feachData"
            />
          </li>
          <!-- 개발자 가이드라인  -->
          <div class="bottom">
            <img src="@/assets/images/youtube/dev.png">
          </div>
        </draggable>
        <!-- // END 재생목록 드래그 지점 -->
      </div>
    </div>

    <!-- 로딩 컴포넌트 -->
    <transition name="fade">
      <loading v-show="!load" />
    </transition>

    <!-- 컬렉션 수정 -->
    <collection-modify-form
      :id="id"
      :isOpen="isModify"
      @is-close="closeModal"
      @is-success="syncCollectionInfo"
    />

    <!-- 커버 이미지 변경 -->
    <cover-change-modal
      ref="coverModal"
      :data="collectionData"
      @is-success="syncCollectionCover"
    />

    <!-- 서브 플레이어 -->
    <sub-player-bar v-show="isMini" />

    <!-- 팝업 컴포넌트 -->
    <v-dialog
      :width="300"
      :height="300"
      :clickToClose="false"
    />
  </div>
</template>

<script>
import * as $commons from '@/service/commons-service.js'
import SubPlayerBar from '@/components/PlayerBar/SubPlayerBar'
import StoreMixin from '@/components/Mixin/index'
import MyQueryMixin from '@/components/Mixin/mycollection'
import CollectionQueryMixin from '@/components/Mixin/collections'
import CoverChangeModal from '@/components/Collections/cover/CollectionCoverChange'
import CollectionModifyForm from '@/components/MyCollection/modify/MyCollectionModify'
import MyContextMenu from '@/components/Context/MyContextMenu'
import Draggable from 'vuedraggable'
import Loading from '@/components/Loader/Loader'

export default {
  name: 'MyMusicList',
  mixins: [StoreMixin, CollectionQueryMixin, MyQueryMixin],
  components: {
    SubPlayerBar,
    Loading,
    MyQueryMixin,
    MyContextMenu,
    CoverChangeModal,
    CollectionModifyForm,
    Draggable
  },
  data() {
    return {
      load: false,
      isMini: false,
      isModify: false,
      totalTracks: null,
      selectedIndex: null,
      playType: null,
      id: null,
      collectionData: null,
      cover: '',
      coverTitle: '',
      channelTitle: '',
      category: '',
      playlist: []
    }
  },
  created() {
    this.feachData()
  },
  methods: {
    endDrag(value) {
      // 현재 인덱스와 새인덱스가 다를경우
      if (value.newIndex !== value.oldIndex) {
        const sortPlaylist = this.playlist
        this.syncMyCollection(sortPlaylist)
      }
    },
    syncCollectionInfo() {
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
          let playlists = docs.playlists
          if (playlists) {
            let data = this.$lodash.find(playlists, {
              _key: this.id
            })
            this.category = data.category
            this.coverTitle = data.title
            this.closeModal()
          }
        })
    },
    syncCollectionCover() {
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
          let playlists = docs.playlists
          if (playlists) {
            let data = this.$lodash.find(playlists, {
              _key: this.id
            })
            this.cover = data.thumbnails
          }
        })
    },
    feachData() {
      this.playType = this.$route.params.playType
      this.id = this.$route.params.id
      let musicInfo = this.getMusicInfos()
      if (musicInfo) {
        this.isMini = true
      }
      let user_id = this.getUserId()
      if (user_id) {
        this.$local
          .find({
            selector: {
              type: 'profile',
              userId: user_id
            },
            fields: ['playlists']
          })
          .then(result => {
            let docs = result.docs[0]
            let playlists = docs.playlists
            if (playlists) {
              let data = this.$lodash.find(playlists, {
                _key: this.id
              })

              this.category = data.category
              this.cover = data.thumbnails
              this.coverTitle = data.title
              this.channelTitle = 'MyChannel'
              this.totalTracks = data.tracks.length
              this.playlist = data.tracks

              // option
              this.collectionData = {}
              this.collectionData._key = this.id;
              this.collectionData.category = this.category
              // this.$set(this, 'collectionData', this.collectionData)

              this.load = true
            }
          })
      }
    },
    route(items, index) {
      this.$store.commit('setPath', this.$route.path)
      this.$router.push({
        name: 'MY-PLAYING-PLAYLIST',
        params: {
          playType: this.playType,
          id: this.$route.params.id,
          start: index
        }
      })
    },
    collectionCoverChange() {
      this.$refs.coverModal.showModal()
    },
    collectionEdit() {
      this.isModify = true;
    },
    closeModal() {
      this.isModify = false;
    },
    goBack() {
      this.$router.push(this.$store.getters.getIndexPath)
    }
  }
}
</script>

<style scoped>
.zaudio_wrapper {
  min-height: 516px;
}

.zaudio_playlist {
  max-height: 352px;
  overflow-x: hidden;
  z-index: 100;
}

.cover {
  width: 100%;
  background-position: center;
  max-height: 178px;
  filter: brightness(1.1);
}

.dynamicHeight {
  max-height: 300px;
}

.end {
  margin-left: 115px;
}

.contextMenu {
  width: 15px;
  height: 15px;
}

.none {
  display: none;
}

.thumbnails {
  height: 44px;
  width: 44px;
}
</style>
