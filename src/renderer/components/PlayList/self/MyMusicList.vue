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
          @is-success="feachData"
        />
        <!-- End -->
      </md-list-item>
      <md-list-item>
        <span class="playlistEnd">
          <i class="el-icon-check"></i>
          {{ $t('COMMONS.END') }}
        </span>
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
import Loading from "@/components/Loader/Loader";

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
        console.log("newIndex => ", value.newIndex);
        console.log("oldIndex => ", value.oldIndex);

        // let sortPlaylist = this.playlist;
        // this.syncMyCollection(sortPlaylist);
      }
    },
    syncCollectionInfo() {
      this.$test.get(this.collectionDoc._id).then(result => {
        this.category = result.category;
        this.coverTitle = result.title;
        this.closeModal();
      });
    },
    feachData() {
      const user = this.getUserId();
      if (user) {
        this.createIndex(["userId", "parentId"]).then(result => {
          return this.$test
            .find({
              selector: {
                userId: user,
                parentId: this.collectionDoc._id
              },
              limit: 100
            })
            .then(result => {
              let docs = result.docs;
              if (docs.length > 0) {
                this.totalTracks = docs.length;
                this.playlist = docs;
              }
            });
        });
      }
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
  margin-left: 125px;
}

.label_v {
  padding: 4px 7px;
  font-size: 12px;
  font-weight: 700;
}
</style>
