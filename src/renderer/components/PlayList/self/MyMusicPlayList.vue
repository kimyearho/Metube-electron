/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header :isShow="false" @reloadMusicList="feachData"/>

    <div v-if="isLogin">
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
            <marquee-text
              class="zaudio_songtitle"
              :key="coverTitle"
              :duration="coverTitle.length / 2"
            >&nbsp; {{ coverTitle }}</marquee-text>
            <span class="zaudio_songartist">{{ channelTitle }}</span>
            <span class="zaudio_songartist">/ {{ totalTracks }} Tracks</span>
          </div>
        </div>
      </div>
      <div class="overay"></div>

      <!-- 목록 영역 -->
      <draggable
        tag="md-list"
        v-model="playlist"
        class="musicPlayList"
        :class="{ dynamicHeight: isMini, one: playlist.length === 1  }"
        animation="150"
        @end="endDrag"
      >
        <md-list-item
          v-for="(item, index) in playlist"
          :id="`item${index}`"
          :key="item.etag"
          :class="selectedIndex === index ? 'activeBackground' : ''"
        >
          <md-avatar style="margin-right: 0;">
            <img :src="item.thumbnails">
          </md-avatar>

          <span
            class="md-list-item-text music-title cursor"
            :class="selectedIndex === index ? 'active' : ''"
            @click="playItem(index)"
          >{{ item.title }}</span>
          <span class="label_video" v-if="item.videoId && item.isLive != 'live'">{{ item.duration }}</span>
          <span class="label_live" v-if="item.videoId && item.isLive == 'live'">LIVE</span>

          <my-context-menu
            :id="id"
            :index="index"
            :videoId="item.videoId"
            :data="item"
            @is-success="feachSyncData"
          />
        </md-list-item>

        <md-list-item>
          <span class="playlistEnd">
            <span class="playlistEnd">Thanks for using "Metube"</span>
          </span>
        </md-list-item>
        <div class="bottom">
          <img src="@/assets/images/youtube/dev.png">
        </div>
      </draggable>

      <!-- 메인 재생바 컴포넌트 -->
      <main-player-bar
        :videoSetting="videoData"
        @nextMusicPlay="subscribeNextVideo"
        @previousVideoTrack="previousPlayItem"
        @nextVideoTrack="nextPlayItem"
      />

      <!-- 팝업 컴포넌트 -->
      <v-dialog :width="300" :height="300" :clickToClose="false"/>
    </div>

    <!-- 비 로그인 상태 -->
    <div v-else>
      <el-row>
        <el-col>
          <el-card
            style="height: 200px; margin-top: 70px; margin-left: 30px; margin-right: 30px;"
            class="thumb"
            :body-style="{ padding: '0px' }"
          >
            <img
              class="md-image thumbnail"
              style="width: 100%; height: 200px;"
              :src="playingMusicData.thumbnails"
            >
          </el-card>
          <div class="titleflow" style="text-align: center; margin-top: 30px;">
            <span class="sub">{{ playingMusicData.title }}</span>
          </div>
          <div class="titleflow" style="text-align: center; margin-top: 30px;">
            <span class="sub">{{ $t('COLLECTION.CONTINUE') }}</span>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <md-button
              class="cursor md-raised md-primary"
              style="width: 120px;"
              @click="signLink"
            >{{ $t('SIGN.SIGN_IN') }}</md-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import MainPlayerBar from "@/components/PlayerBar/MainPlayerBar";
import StoreMixin from "@/components/Commons/Mixin/index";
import DataUtils from "@/components/Commons/Mixin/db";
import MyCollectionMixin from "@/components/Commons/Mixin/mycollection";
import MyContextMenu from "@/components/Context/MyContextMenu";
import draggable from "vuedraggable";
import MarqueeText from "vue-marquee-text-component";

const options = { container: ".musicPlayList", offset: -80 };

export default {
  name: "MyMusicPlayList",
  mixins: [StoreMixin, MyCollectionMixin, DataUtils],
  components: {
    MainPlayerBar,
    MarqueeText,
    draggable,
    MyContextMenu
  },
  data() {
    return {
      load: false,
      isLogin: this.getUserId(),
      playingMusicData: this.getMusicInfos(),
      isMini: false,
      videoData: null,
      totalTracks: null,
      playType: null,
      id: null,
      active: "active",
      cover: "",
      coverTitle: "",
      category: "",
      channelTitle: "",
      selectedIndex: 0,
      startIndex: 0,
      playlist: []
    };
  },
  mounted() {
    this.$ga.screenview('MyMusicPlayList')
    this.getCategory();
  },
  methods: {
    // 카테고리 가져온 뒤 목록가져오기
    getCategory() {
      this.load = false;
      this.id = this.$route.params.id;
      this.$test.get(this.id).then(result => {
        if (result) {
          this.category = result.category;
          this.feachData();
        }
      });
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
              id: this.id
            });
            let findData = this.$lodash.find(collections, { id: this.id });
            if (findData) {
              // 현재 목록의 순서로 갱신
              findData.list = this.playlist;
              this.$test.put(result).then(res => {
                if (res.ok) {
                  // console.log("remote store update!");
                  const musicInfo = this.getMusicInfos();
                  if (musicInfo) {
                    // 재생중...
                    if (musicInfo.name === this.id) {
                      // 현재 재생중인 비디오의 재생목록이 현재 재생목록과 동일한경우,
                      this.getRemoteProfile().then(res => {
                        const syncCollections = res.collections;
                        let findData = this.$lodash.find(collections, {
                          id: this.id
                        });
                        // 재생목록 갱신
                        this.playlist = findData.list;

                        if (findData) {
                          // 동기화 된 재생목록의 비디오중 현재 재생중인 음악과 동일한 비디오를 찾는다.
                          const videoIndex = this.$lodash.findIndex(
                            findData.list,
                            {
                              videoId: musicInfo.videoId
                            }
                          );
                          this.selectedIndex = videoIndex;
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

    // 재생중인 비디오 선택
    videoActive(selectedIndex) {
      const self = this;
      const id = "#item" + selectedIndex;
      setTimeout(() => {
        self.$scrollTo(id, -1, options);
        self.load = true;
      }, 250);
    },

    /**
     * 다음 순번의 비디오 수신
     */
    subscribeNextVideo(index) {
      this.playItem(index, "sync");
    },

    /**
     * 비디오 삭제 후 동기화
     */
    feachSyncData(data) {
      this.load = false;
      this.playType = this.$route.params.playType;
      let user = this.getUserId();
      if (user) {
        const param1 = this.$test.get(this.id);
        const param2 = this.$test.find({
          selector: {
            userId: user,
            parentId: this.id
          },
          limit: 100
        });
        Promise.all([param1, param2]).then(results => {
          this.category = results[0].category;
          let listDocs = results[1].docs;
          if (listDocs.length > 0) {
            /**
             * RemoteDB 및 StoreDB 동기화
             *
             * @param docs RemoteDB (or LocalDB)
             * @param deletedItem 삭제한 비디오 아이디 (없으면 undefined)
             * @param flag 재생여부
             */
            this.setRemoteSubsetMusicData(listDocs, data, "p");
          }
        });
      }
    },

    // DB 조회
    getRemoteList(data) {
      this.createIndex(["creates"]).then(result => {
        return this.$test
          .find({
            selector: {
              userId: this.getUserId(),
              parentId: this.id,
              creates: {
                $gte: null
              }
            },
            sort: [{ creates: "asc" }],
            limit: 100
          })
          .then(result => {
            let docs = result.docs;
            if (docs.length > 0) {
              /**
               * RemoteDB 및 StoreDB 동기화
               *
               * @param docs RemoteDB (or LocalDB)
               * @param deletedItem 삭제한 비디오 아이디 (없으면 undefined)
               * @param flag 재생여부
               */
              this.setRemoteSubsetMusicData(docs, data, "p");
              this.feachExtends();
            }
          });
      });
    },

    // DB Doc 조회
    getRemoteDocument() {
      return this.createIndex(["creates"]).then(result => {
        return this.$test.find({
          selector: {
            userId: this.getUserId(),
            parentId: this.id,
            creates: {
              $gte: null
            }
          },
          limit: 100,
          sort: [{ creates: "asc" }]
        });
      });
    },

    /**
     * 인스턴스 초기화 시 조회되는 재생목록
     */
    feachData() {
      this.startIndex = this.$route.params.start;
      this.playType = this.$route.params.playType;
      const user = this.getUserId();
      if (user) {
        this.getRemoteProfile().then(result => {
          const list = result.collections;
          if (list) {
            const findData = this.$lodash.find(list, {
              id: this.id
            });
            if (findData.list.length > 0) {
              this.getRemoteDocument().then(result => {
                const remoteTotalCount = result.docs.length;
                if (remoteTotalCount !== findData.listCount) {
                  console.log("========================= list sync!");
                  this.getRemoteList();
                } else {
                  console.log("========================= remote store get!");
                  this.totalTracks = findData.listCount;
                  this.playlist = findData.list;

                  this.feachExtends();
                }
              });
            } else {
              this.getRemoteList();
            }
          } else {
            this.getRemoteList();
          }
        });
      }
    },

    // 재생
    feachExtends() {
      const musicInfo = this.getMusicInfos();
      if (musicInfo) {
        // name -> 재생정보에 포함 된 재생목록의 key값
        // id -> 이 재생목록의 key값
        // 따라서 현재 재생중인 정보가 이 재생목록과 다를경우이므로 새로 시작한다.
        if (musicInfo.name !== this.id) {
          this.autoStart();
        } else {
          // 현재 재생중인정보가 이 재생목록과 같은경우.
          // 현재 재생중인 비디오의 인덱스와, 현재 재생목록의 시작인덱스가 동일한지?
          if (musicInfo.index === this.startIndex) {
            // 재생전 목록에서 재생중인 음악을 다시 클릭한 경우이므로 다시 재생할 필요는 없다.
            this.cover = musicInfo.thumbnails;
            this.coverTitle = musicInfo.title;
            this.channelTitle = musicInfo.channelTitle;
            this.selectedIndex = musicInfo.index;
            this.videoActive(musicInfo.index);
          } else {
            // 인덱스가 서로 다르므로 새로 시작
            this.autoStart();
          }
        }
      } else {
        this.autoStart();
      }
    },

    /**
     * 재생목록 조회 후 첫 비디오는 자동 재생
     */
    autoStart() {
      // 재생목록 아이디
      this.playType = this.$route.params.playType;

      // 재생목록에서 해당하는 트랙번호의 비디오
      let playingItem = this.playlist[this.startIndex];

      playingItem.index = this.startIndex;
      playingItem.name = this.id;
      this.playSetting(playingItem);
    },

    /**
     * 비디오 재생 (사용자가 클릭했을경우 or 외부 이벤트 실행)
     *
     * @param {index} - 다음곡 or 선택곡의 index
     * @param {event} - 외부에서 트리거된 이벤트유무
     */
    playItem(index, event) {
      if (event != undefined) {
        let musicData = this.getMusicInfos();
        this.getMyMusicSyncList(index, musicData);
      } else {
        // 재생목록에서 해당하는 트랙번호의 비디오
        let playingItem = this.playlist[index];
        playingItem.index = index;
        playingItem.name = this.getMusicInfos().name;
        this.playSetting(playingItem);
        if (index === 0) {
          this.endScrollTop();
        } else {
          this.nextTrackScroll(500);
        }
      }
    },

    /**
     * 메인 플레이어바 이전 곡 재생
     */
    previousPlayItem() {
      let musicInfo = this.getMusicInfos();
      let previousIndex = musicInfo.index - 1;
      if (previousIndex !== -1) {
        // 재생목록에서 해당하는 트랙번호의 비디오
        let playingItem = this.playlist[previousIndex];
        playingItem.index = previousIndex;
        playingItem.name = musicInfo.name;

        this.playSetting(playingItem);
        this.nextTrackScroll(500);
      } else {
        this.playItem(0);
      }
    },

    /**
     * 메인 플레이어바 다음 곡 재생
     */
    nextPlayItem() {
      let musicInfo = this.getMusicInfos();
      let nextIndex = musicInfo.index + 1;

      // 목록의 총 갯수와 다음 인덱스가 동일하면 (목록의 끝 )
      if (this.totalTracks === nextIndex) {
        // 처음부터 재생
        let playingItem = this.playlist[0];
        playingItem.index = 0;
        playingItem.name = musicInfo.name;

        this.playSetting(playingItem);
        this.endScrollTop();
      } else {
        // 재생목록에서 해당하는 트랙번호의 비디오
        let playingItem = this.playlist[nextIndex];
        playingItem.index = nextIndex;
        playingItem.name = musicInfo.name;

        this.playSetting(playingItem);
        this.nextTrackScroll(500);
      }
    },

    /**
     * 재생될 재생정보를 설정한다.
     *
     * @param {playingItem} 재생될 재생정보의 데이터 객체
     */
    playSetting(playingItem) {
      this.selectedIndex = playingItem.index;
      this.coverTitle = playingItem.title;
      this.channelTitle = playingItem.channelTitle;
      this.cover = playingItem.imageInfo
        ? playingItem.imageInfo
        : playingItem.thumbnails;

      this.$store.commit("setPlayingMusicInfo", playingItem);
      this.$store.commit("setPlayType", true);
      this.$set(this, "videoData", this.getMusicInfos());

      this.$eventBus.$emit("statusCheck");

      const videoId = playingItem.videoId;
      this.$ipcRenderer.send("win2Player", ["loadVideoById", videoId]);

      this.$ga.event("MyCollection", this.getUserId(), this.selectedIndex, videoId);
      this.$ga.page({
        page: `MyCollection/${this.getUserId()}/${this.selectedIndex}/${videoId}`,
        title: "MyCollectionPlay",
      });

      if (process.env.NODE_ENV !== "development") {
        /** @overade 히스토리 등록 */
        this.insertVideoHistory(playingItem);

        /** @overade 사용자 재생 등록 */
        this.insertUserRecommand(playingItem);
      }

      this.load = true;
    },

    /**
     * 다음 비디오 위치로 스크롤을 이동한다.
     * 단, 현재 페이지가 재생목록일경우만 스크롤링 한다.
     * 외부에서 이벤트로 실행할때는 재생목록이 아니므로 offset 오류가 난다.
     *
     * @param {duration} 지연시간
     */
    nextTrackScroll(duration) {
      if (this.$route.name === "MY-PLAYING-PLAYLIST") {
        const cancelScroll = this.$scrollTo(
          `#item${this.selectedIndex}`,
          duration,
          options
        );
        setTimeout(() => {
          cancelScroll();
        }, 1500);
      }
    },

    /**
     * 스크롤을 맨 위로 이동한다.
     * 단, 현재 페이지가 재생목록일경우만 스크롤링 한다.
     * 외부에서 이벤트로 실행할때는 재생목록이 아니므로 offset 오류가 난다.
     */
    endScrollTop() {
      if (this.$route.name === "MY-PLAYING-PLAYLIST") {
        let cancelScroll = this.$scrollTo("#item0", -1, options);
        setTimeout(() => {
          cancelScroll();
        }, 1500);
      }
    },

    /**
     * 이전 페이지로 돌아간다.
     */
    goBack() {
      this.$router.push(this.$store.getters.getIndexPath);
    },

    signLink() {
      this.$router.push({
        name: "login"
      });
    }
  }
};
</script>

<style scoped>
.playlistEnd {
  color: #ffffff;
  margin-left: 38px;
}
.label_v {
  padding: 4px 7px;
  font-size: 12px;
  font-weight: 700;
}
.one {
  height: 260px;
}
</style>
