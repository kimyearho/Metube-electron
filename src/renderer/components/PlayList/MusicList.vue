/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header :isShow="false" @reloadMusicList="feachData"/>

    <!-- 커버 영역 -->
    <div class="side_menu">
      <a class="cursor" @click="goBack">
        <img src="@/assets/images/svg/menu-back.svg" title="Back">
      </a>
      <!-- 컬렉션 등록 -->
      <a class="cursor" v-if="playType !== 'related'" @click="addCollection">
        <collection-register
          ref="likes"
          :isLikeToggle="isLikeToggle"
          :data="data"
          :playType="playType"
          @toggle="toggleChange"
        />
      </a>
    </div>
    <div class>
      <img class="playlistCover" :src="cover">
      <div class="playlistTrackinfo">
        <span
          class="label_channel label_v"
          v-if="playType === 'channel'"
        >{{ $t('COMMONS.LABEL.CHANNEL') }}</span>
        <span
          class="label_playlist label_v"
          v-if="playType === 'play'"
        >{{ $t('COMMONS.LABEL.PLAY_LIST') }}</span>
        <span
          class="label_related label_v"
          v-if="playType === 'related'"
        >{{ $t('COMMONS.LABEL.RELATED') }}</span>
        <br>
        <br>
        <div class="titleflow">
          <span class="zaudio_songtitle">{{ coverTitle.substring(0, 32) }}</span>
          <br>
          <span class="zaudio_songartist">{{ channelTitle }}</span>
          <span class="zaudio_songartist">/ {{ totalTracks }} Tracks</span>
        </div>
      </div>
    </div>
    <div class="overay"></div>

    <md-list id="list" class="searchList" :class="{ dynamicHeight: isMini }">
      <md-list-item :id="`item${index}`" v-for="(item, index) in playlist" :key="item.etag">
        <md-avatar style="margin-right: 0;">
          <img :src="item.imageInfo" alt="People">
        </md-avatar>

        <span
          class="md-list-item-text music-title cursor"
          @click="route(item, index)"
        >{{ item.title }}</span>
        <span class="label_video" v-if="item.videoId && item.isLive != 'live'">{{ item.duration }}</span>
        <span class="label_live" v-if="item.videoId && item.isLive == 'live'">LIVE</span>
        <context-menu :videoId="item.videoId" :data="item"/>
      </md-list-item>
      <md-list-item v-if="isNext">
        <span v-if="!isMore" class="loadMoreCenter">
          <a class="cursor" @click="nextPageLoad">
            <i class="el-icon-refresh"></i>
            {{ $t('COMMONS.MORE') }}
          </a>
        </span>
        <span v-else class="loadMoreCenter loadMoreLoading">LOADING ...</span>
      </md-list-item>
      <md-list-item v-else>
        <span class="playlistEnd">
          <i class="el-icon-check"></i>
          {{ $t('COMMONS.END') }}
        </span>
      </md-list-item>
      <div class="bottom">
        <img src="@/assets/images/youtube/dev.png">
      </div>
    </md-list>

    <!-- 로딩 컴포넌트 -->
    <transition name="fade">
      <loading v-show="!load"/>
    </transition>

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
import DataUtils from "@/components/Mixin/db";
import CollectionQueryMixin from "@/components/Mixin/collections";
import ContextMenu from "@/components/Context/ContextMenu";
import Loading from "@/components/Loader/PageLoading";
import CollectionRegister from "@/components/Collections/regist/CollectionRegister";

export default {
  name: "MusicList",
  mixins: [StoreMixin, DataUtils, CollectionQueryMixin],
  components: {
    CollectionRegister,
    ContextMenu,
    SubPlayerBar,
    Loading
  },
  data() {
    return {
      load: false,
      isMini: false,
      isNext: true,
      isMore: false,
      isLikeToggle: false,
      cover: "",
      coverTitle: "",
      channelTitle: "",
      menu: null,
      playlistInfoId: null,
      playType: null,
      selected: null,
      totalTracks: null,
      nextPageToken: null,
      channelPlaylistId: null,
      videoId: null,
      clickIdx: null,
      playlist: [],
      data: null
    };
  },
  mounted() {
    this.feachData();
  },
  methods: {
    feachData() {
      // 현재 음악이 재생중인지 여부 체크
      const musicInfo = this.getMusicInfos();
      this.isMini = musicInfo ? true : false;

      let playlistName = null;
      this.playType = this.$route.params.playType;
      this.playlistId = this.$route.params.id;

      // 재생목록명 설정
      if (this.playType === "play") {
        playlistName = `PLAYLIST:${this.playlistId}`;
      } else if (this.playType === "related") {
        playlistName = `RELATED:${this.playlistId}`;
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${this.playlistId}`;
      }

      // 로컬 디비로 등록 되어있는 재생목록인지 조회
      this.createLocalIndex(["_id", "type", "parentId"]).then(() => {
        return this.$local
          .find({
            selector: {
              type: this.playType + "ListInfo",
              playlistId: playlistName
            }
          })
          .then(result => {
            let doc = result.docs[0];
            if (doc) {
              // 필요한 정보 설정
              this.playlistInfoId = doc._id;
              this.totalTracks = doc.totalResults;
              this.nextPageToken = doc.nextPageToken;
              this.channelPlaylistId = doc.channelPlaylistId
                ? doc.channelPlaylistId
                : null;
              this.isNext = !!this.nextPageToken;

              // 재생정보의 id값과 일치하는 하위 비디오를 조회
              this.$local
                .find({
                  selector: {
                    type: this.playType,
                    parentId: doc._id
                  },
                  limit: this.totalTracks
                })
                .then(result => {
                  const docs = result.docs;
                  // 커버 및 재생목록정보를 설정한다.
                  this.coverTitle = docs[0].title.substring(0, 35);
                  this.channelTitle = docs[0].channelTitle;
                  this.cover = docs[0].imageInfo;
                  this.playlist = docs;
                  // 체크 콜렉션
                  this.checkCollection();
                  // this.data = findPlaylist;
                });
            } else {
              // no
              this.initialSetting(playlistName);
            }
          });
      });
    },

    // 재생목록이 존재하지 않을경우
    initialSetting(playlistName) {
      // 현재 요청하고자 하는 재생목록 타입
      let requestURL = null;
      if (this.playType === "play") {
        requestURL = $commons.youtubePlaylistInfo(this.playlistId);
      } else if (this.playType === "related") {
        requestURL = $commons.youtubeVideoResult(this.playlistId);
      } else if (this.playType === "channel") {
        requestURL = $commons.youtubeChannelSearch(this.playlistId);
      }

      // 재생목록 요청
      this.$http
        .get(requestURL)
        .then(res => {
          let plistTitle = "";
          let videoInfo = null;
          let subChannelId = null;

          // 재생목록별 하위 조회 섫정
          if (this.playType === "play") {
            plistTitle = res.data.items[0].snippet.title;
            requestURL = $commons.youtubePlaylistItem(this.playlistId);
          } else if (this.playType === "related") {
            videoInfo = res.data.items[0];
            requestURL = $commons.youtubeRelatedSearch(this.playlistId);
          } else if (this.playType === "channel") {
            subChannelId =
              res.data.items[0].contentDetails.relatedPlaylists.uploads;
            requestURL = $commons.youtubePlaylistItem(subChannelId);
          }

          // 재생목록 하위 데이터 요청
          this.$http.get(requestURL).then(res => {
            if (this.$lodash.size(res.data.items) > 0) {
              let pathName = null;
              if (this.playType === "play") {
                pathName = "setDuration";
                this.$store.commit("setMusicList", res.data.items);
              } else if (this.playType === "related") {
                pathName = "setRelatedDuration";
                res.data.items.unshift(videoInfo);
                this.$store.commit("setRelatedList", res.data.items);
              } else if (this.playType === "channel") {
                pathName = "setDuration";
                this.$store.commit("setMusicList", res.data.items);
              }

              this.$store.dispatch(pathName).then(results => {
                // 만약 갯수가 30가 나누어 참이 아니라면 맨 뒤에 배열을 제거한다.
                let listSize = this.$lodash.size(results);
                if (listSize % 30 !== 0) {
                  results.splice(listSize - 1, listSize);
                }

                // 재생목록 기본정보 설정
                const playlistInfo = {
                  type: this.playType + "ListInfo",
                  playlistId: playlistName, // PLAYLIST:ID
                  playlistTitle: plistTitle,
                  channelPlaylistId: subChannelId || null,
                  nextPageToken: res.data.nextPageToken
                    ? res.data.nextPageToken
                    : null,
                  totalResults: res.data.pageInfo.totalResults
                };

                // 재생목록 기본정보 등록 및 하위 데이터 모두 등록
                this.$local.post(playlistInfo).then(result => {
                  if (result.ok) {
                    const docId = result.id;
                    let list = [];
                    this.$lodash.forEach(results, (item, idx) => {
                      item.type = this.playType;
                      item.parentId = docId;
                      list.push(item);
                      if (idx === results.length - 1) {
                        // 조회된 재생목록 하위 데이터 한꺼번에 등록
                        this.$local.bulkDocs(results).then(() => {
                          // 등록이 끝났으면, 랜더링하기 위해 등록된 정보를 모두 조회한다.
                          this.getData();
                        });
                      }
                    });
                  }
                });
              });
            } else {
              this.errorDialog();
            }
          });
        })
        .catch(error => {
          this.errorDialog();
        });
    },

    // 최초 등록 후 데이터 조회
    getData() {
      let playlistName = null;
      if (this.playType === "play") {
        playlistName = `PLAYLIST:${this.playlistId}`;
      } else if (this.playType === "related") {
        playlistName = `RELATED:${this.playlistId}`;
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${this.playlistId}`;
      }

      this.createLocalIndex(["type", "parentId"]).then(() => {
        return this.$local
          .find({
            selector: {
              type: this.playType + "ListInfo",
              playlistId: playlistName
            }
          })
          .then(result => {
            let docs = result.docs[0];

            // 채널 재생목록 아이디 (채널 아이디 아님)
            this.channelPlaylistId =
              this.playType === "channel" ? docs.channelPlaylistId : null;
            // 총 트랙수
            this.totalTracks = docs.totalResults;
            // 다음 페이지 토큰
            this.nextPageToken = docs.nextPageToken ? docs.nextPageToken : null;
            // 토큰이 있으면 true / 없으면 false
            this.isNext = !!this.nextPageToken;

            // 1초후 실행
            const self = this;
            setTimeout(() => {
              // 재생목록 기본정보를 통해 하위 데이터 조회
              self.$local
                .find({
                  selector: {
                    type: self.playType,
                    parentId: docs._id
                  },
                  limit: self.totalTracks
                })
                .then(res => {
                  let docs = res.docs;
                  if (docs.length > 0) {
                    // 커버설정
                    self.coverTitle = docs[0].title.substring(0, 35);
                    self.channelTitle = docs[0].channelTitle;
                    self.cover = docs[0].imageInfo;
                    self.playlist = docs;

                    self.checkCollection();

                    // this.data = findPlaylist;
                  }
                });
            }, 10 * 100);
          });
      });
    },

    // 재생목록이 컬렉션에 등록되어있는지 체크
    checkCollection() {
      const collection = this.getLike();
      if (collection) {
        collection.then(result => {
          let docs = result.docs;
          if (docs.length > 0) {
            this.isLikeToggle = true;
          }
          this.load = true;
        });
      } else {
        this.load = true;
      }
    },

    addCollection() {
      if (this.getUserId()) {
        let message = "";
        if (this.isLikeToggle) {
          message = this.$t("COMMONS.COLLECTION.REMOVE");
        } else {
          message = this.$t("COMMONS.COLLECTION.REGISTER");
        }
        this.$modal.show("dialog", {
          title: "Info",
          text: message,
          buttons: [
            {
              title: "Yes",
              handler: () => {
                this.$refs.likes.like();
                this.$modal.hide("dialog");
              }
            },
            {
              title: "Close"
            }
          ]
        });
      } else {
        this.$modal.show("dialog", {
          title: "Info",
          text: this.$t("COLLECTION.NO_LOGIN"),
          buttons: [
            {
              title: "Close"
            }
          ]
        });
      }
    },

    nextPageLoad() {
      // 재생목록 아이디
      let playlistName = null;
      let playlistItem = null;

      this.isMore = true;

      // 토큰을 사용한 새 재생목록 가져오기
      if (this.playType === "play") {
        playlistName = `PLAYLIST:${this.playlistId}`;
        playlistItem = $commons.youtubePagingPlaylistItem(
          this.playlistId,
          this.nextPageToken
        );
      } else if (this.playType === "related") {
        playlistName = `RELATED:${this.playlistId}`;
        playlistItem = $commons.youtubePagingRelatedSearch(
          this.playlistId,
          this.nextPageToken
        );
      } else if (this.playType === "channel") {
        playlistName = `CHANNEL:${this.playlistId}`;
        playlistItem = $commons.youtubePagingPlaylistItem(
          this.channelPlaylistId,
          this.nextPageToken
        );
      }

      this.$http
        .get(playlistItem)
        .then(res => {
          let pathName = null;

          if (this.playType === "play") {
            pathName = "setDuration";
            this.$store.commit("setMusicList", res.data.items);
          } else if (this.playType === "related") {
            pathName = "setRelatedDuration";
            this.$store.commit("setRelatedList", res.data.items);
          } else if (this.playType === "channel") {
            pathName = "setDuration";
            this.$store.commit("setMusicList", res.data.items);
          }

          this.$store.dispatch(pathName).then(results => {
            let list = [];
            this.$lodash.forEach(results, (item, idx) => {
              item.type = this.playType;
              item.parentId = this.playlistInfoId;
              list.push(item);
              if (idx === results.length - 1) {
                // 조회된 재생목록 하위 데이터 한꺼번에 등록
                this.$local.bulkDocs(results).then(() => {
                  // 등록이 끝났으면, 다음 페이지 토큰을 업데이트 하기위해 재생목록정보를 조회한다.
                  this.$local.get(this.playlistInfoId).then(doc => {
                    // 토큰 갱신
                    doc.nextPageToken = res.data.nextPageToken
                      ? res.data.nextPageToken
                      : null;
                      // 재생정보 업데이트
                    return this.$local.put(doc).then(result => {
                      if (result.ok) {
                        // 성공 후 페이지 리로드
                        this.feachData();
                        this.isMore = false;
                      }
                    });
                  });
                });
              }
            });
          });
        })
        .catch(error => {
          this.errorDialog();
        });
    },
    errorDialog() {
      this.$modal.show("dialog", {
        title: "Error!",
        text: "List lookup failed.<br/>Return to search page.",
        buttons: [
          {
            title: "Go Back",
            handler: () => {
              this.$router.push("/search");
              this.$modal.hide("dialog");
            }
          }
        ]
      });
    },
    errorLogin() {
      this.$modal.show("dialog", {
        title: "Info",
        text: "It is available after login.",
        buttons: [
          {
            title: "Close"
          }
        ]
      });
    },
    goBack() {
      this.$router.push(this.$store.getters.getIndexPath);
    },
    toggleChange(value) {
      this.isLikeToggle = value;
    },
    route(items, index) {
      this.$store.commit("setPath", this.$route.path);
      this.$router.push({
        name: "PLAYING-PLAYLIST",
        params: {
          playType: this.playType,
          id: this.$route.params.id,
          start: index
        }
      });
    }
  }
};
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

.searchList {
  overflow-y: scroll;
  max-height: 348px;
}

.music-title {
  width: 170px;
  font-size: 11px;
  padding-left: 15px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
  color: #ffffff;
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

.none {
  display: none;
}
</style>
