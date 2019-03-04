/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

<template>
  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header :isShow="false" @reloadMusicList="feachData"/>

    <!-- 커버 영역 -->
    <div class="side_menu">
      <a class="cursor" @click="goBack">
        <img src="@/assets/images/svg/menu-back.svg" title="Back">
      </a>
    </div>
    <div class>
      <img class="playlistCover" :src="cover">
      <div class="playlistTrackinfo">
        <span class="label_related label_v">{{ category }}</span>
        <br>
        <br>
        <div class="titleflow">
          <span class="zaudio_songtitle">{{ coverTitle }}</span>
          <br>
          <span class="zaudio_songartist">{{ channelTitle }}</span>
          <span class="zaudio_songartist">/ {{ totalTracks }} Tracks</span>
          <div class="sideMenu">
            <a class="cursor" title="Collection edit" style="color:#fff;" @click="collectionEdit">
              <font-awesome-icon class="f20" icon="edit"/>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="overay"></div>

    <!-- 재생목록 드래그 지점 -->
    <draggable
      element="md-list"
      id="list"
      class="searchList"
      :class="{ dynamicHeight: isMini }"
      :options="{animation:150}"
      :list="playlist"
      @end="endDrag"
    >
      <md-list-item :id="`item${index}`" v-for="(item, index) in playlist" :key="item.etag">
        <md-avatar style="margin-right: 0;">
          <img :src="item.thumbnails !== undefined ? item.thumbnails : item.image">
        </md-avatar>
        <span
          class="md-list-item-text music-title cursor"
          @click="route(item, index)"
        >{{ item.title }}</span>
        <span class="label_video" v-if="item.videoId && item.isLive != 'live'">{{ item.duration }}</span>
        <span class="label_live" v-if="item.videoId && item.isLive == 'live'">LIVE</span>
        <!-- 내 확장메뉴 -->
        <my-context-menu
          :id="id"
          :index="index"
          :videoId="item.videoId"
          :data="item"
          @is-cover="reloadCollection"
          @is-success="feachData"
        />
        <!-- End -->
      </md-list-item>
      <md-list-item>
        <span class="playlistEnd">Thanks for using "Metube"</span>
      </md-list-item>
      <div class="bottom">
        <img src="@/assets/images/youtube/dev.png">
      </div>
    </draggable>
    <!-- // END 재생목록 드래그 지점 -->
    <!-- 컬렉션 수정 -->
    <collection-modify-form
      :data="collectionDoc"
      :isOpen="isModify"
      @is-close="closeModal"
      @is-success="syncCollectionInfo"
    />

    <!-- 서브 플레이어 -->
    <sub-player-bar v-show="isMini"/>

    <!-- 팝업 컴포넌트 -->
    <v-dialog :width="300" :height="300" :clickToClose="false"/>
  </div>
</template>

<script>
import * as $commons from "@/service/commons-service.js";
import SubPlayerBar from "@/components/PlayerBar/SubPlayerBar";
import StoreMixin from "@/components/Mixin/index";
import MyQueryMixin from "@/components/Mixin/mycollection";
import DataUtils from "@/components/Mixin/db";
import CollectionQueryMixin from "@/components/Mixin/collections";
import CollectionModifyForm from "@/components/MyCollection/modify/MyCollectionModify";
import MyContextMenu from "@/components/Context/MyContextMenu";
import draggable from "vuedraggable";
import Loading from "@/components/Loader/PageLoading";

export default {
  name: "MyMusicList",
  mixins: [StoreMixin, CollectionQueryMixin, MyQueryMixin, DataUtils],
  components: {
    SubPlayerBar,
    Loading,
    MyQueryMixin,
    MyContextMenu,
    CollectionModifyForm,
    draggable
  },
  data() {
    return {
      load: false,
      isMini: false,
      isModify: false,
      totalTracks: 0,
      id: null,
      playType: null,
      collectionDoc: null,
      cover: "",
      coverTitle: "",
      category: "",
      channelTitle: "MyChannel",
      playlist: []
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.feachData();
  },
  methods: {
    init() {
      this.isMini = this.getMusicInfos() ? true : false;
      this.playType = this.$route.params.playType;
      this.collectionDoc = this.$route.params.doc;
      this.category = this.collectionDoc.category;
      this.cover = this.collectionDoc.thumbnails;
      this.coverTitle = this.collectionDoc.title;
    },

    endDrag(value) {
      // 현재 인덱스와 새인덱스가 다를경우
      if (value.newIndex !== value.oldIndex) {
        // 드래그로인한 정렬은 DB와 연관이 없으므로, 별도 업데이트 처리는 하지 않고, DB스토어만 동기화한다.
        // TODO: 단, 삭제 이벤트가 발생할경우는 별도의 동기화 처리를 해야한다.
        this.getRemoteProfile().then(result => {
          const collections = result.collections;
          if (collections) {
            const findIndex = this.$lodash.findIndex(collections, {
              id: this.collectionDoc._id
            });
            let findData = this.$lodash.find(collections, {
              id: this.collectionDoc._id
            });
            if (findData) {
              // 현재 목록의 순서로 갱신
              findData.list = this.playlist;
              this.$test.put(result).then(res => {
                if (res.ok) {
                  // console.log("remote store update!");
                  const musicInfo = this.getMusicInfos();
                  if (musicInfo) {
                    // 재생중...
                    if (musicInfo.name === this.collectionDoc._id) {
                      // 현재 재생중인 비디오의 재생목록이 현재 재생목록과 동일한경우,
                      this.getRemoteProfile().then(res => {
                        const syncCollections = res.collections;
                        let findData = this.$lodash.find(collections, {
                          id: this.collectionDoc._id
                        });
                        if (findData) {
                          // 동기화 된 재생목록의 비디오중 현재 재생중인 음악과 동일한 비디오를 찾는다.
                          const videoIndex = this.$lodash.findIndex(
                            findData.list,
                            {
                              videoId: musicInfo.videoId
                            }
                          );
                          // 인덱스 교체
                          musicInfo.index = videoIndex;
                          // 재생정보 세팅
                          this.$store.commit("setPlayingMusicInfo", musicInfo);
                          // 재생정보 변경 이벤트
                          this.$eventBus.$emit("playMusicSetting");
                        }
                      });
                    }
                  }
                }
              });
            }
          }
        });
      }
    },

    syncCollectionInfo() {
      this.$test.get(this.collectionDoc._id).then(result => {
        this.category = result.category;
        this.coverTitle = result.title;
        this.closeModal();
      });
    },

    feachData(deletedItem) {
      const user = this.getUserId();
      if (user) {
        // DB 스토어 조회
        this.getRemoteProfile().then(result => {
          const dbStoreList = result.collections;
          if (dbStoreList) {

            this.getLog("[MyMusicList]/[feachData] 스토어 DB ====> ", dbStoreList)

            // 스토어 DB 조회
            const findData = this.$lodash.find(dbStoreList, {
              id: this.collectionDoc._id
            });

            this.getLog("[MyMusicList]/[feachData] 스토어 DB에서 찾은 findData ====> ", findData)

            // DB스토어와 DB문서는 1:1임.
            if (findData) {
              // 실제 DB에 등록된 목록을 조회
              this.getRemoteDocument().then(doc => {

                this.getLog("[MyMusicList]/[feachData] 삭제 후 실제 DB 목록 ====> ", doc)

                const remoteTotalCount = doc.docs.length;
                // 스토어 개수와 DB개수가 다를경우(추가 or 삭제 이벤트가 일어난 경우)
                if (remoteTotalCount !== findData.listCount) {
                  this.getLog("[MyMusicList]/[feachData] ====> List Sync")
                  this.getRemoteList(doc.docs, deletedItem);
                } else {
                  this.getLog("[MyMusicList]/[feachData] ====> remote store get!")
                  this.totalTracks = findData.listCount;
                  this.playlist = findData.list;
                }
              });
            } else {
              // DB스토어의 목록이 없으면, DB로 조회
              this.getRemoteDocument().then(result => {
                let docs = result.docs;
                if (docs.length > 0) {
                  this.totalTracks = docs.length;
                  this.playlist = docs;
                  this.getRemoteList(docs);
                }
              });
            }
          } else {
            // DB스토어의 목록이 없으면, DB로 조회
            this.getRemoteDocument().then(result => {
              let docs = result.docs;
              if (docs.length > 0) {
                this.totalTracks = docs.length;
                this.playlist = docs;
                this.getRemoteList(docs);
              }
            });
          }
        });
      }
    },

    reloadCollection() {
      this.$test.get(this.collectionDoc._id).then(doc => {
        this.cover = doc.thumbnails;
      });
    },

    /**
     * RemoteDB 및 StoreDB 동기화
     *
     * @param docs RemoteDB (or LocalDB)
     * @param deletedItem 삭제한 비디오 아이디 (없으면 undefined)
     * @param flag 재생여부
     */
    getRemoteList(docs, deletedItem) {
      this.setRemoteSubsetMusicData(docs, deletedItem, "n");
    },

    getRemoteDocument() {
      return this.createIndex(["creates"]).then(result => {
        return this.$test.find({
          selector: {
            userId: this.getUserId(),
            parentId: this.collectionDoc._id,
            creates: {
              $gte: null
            }
          },
          limit: 100,
          sort: [{ creates: "asc" }]
        });
      });
    },

    route(items, index) {
      this.$store.commit("setPath", this.$route.path);
      this.$router.push({
        name: "MY-PLAYING-PLAYLIST",
        params: {
          playType: this.playType,
          id: this.collectionDoc._id,
          start: index
        }
      });
    },

    collectionEdit() {
      this.isModify = true;
    },

    closeModal() {
      this.isModify = false;
    },

    goBack() {
      this.$router.push(this.$store.getters.getIndexPath);
    }
  }
};
</script>

<style scoped>
.dynamicHeight {
  max-height: 300px;
}

.playlistEnd {
  color: #ffffff;
  margin-left: 68px;
}

.label_v {
  padding: 4px 7px;
  font-size: 12px;
  font-weight: 700;
}
</style>
