/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    
    <!-- 타이틀바 컴포넌트 -->
    <top-header ref="header" 
      :data="{ playType: 'list' }" 
      @scrollTop="searchTop"/>

    <!-- 검색 및 자동완성 영역 -->
    <div class="search">
      <auto-complate ref="autoComplate" 
        :userSearchQuery="searchText" 
        @searchQuery="itemSelected" />
    </div>

    <!-- 사용자가 검색한 키워드 -->
    <div class="tag" v-show="isTag">
      <span v-if="searchKeywords.length === 0" class="no_keyword">
        <i class="el-icon-warning"></i>
        {{ $t('COMMONS.NO_KEYWORD') }}
      </span>
      <el-button
        size="mini"
        type="text"
        style="width: 100px;"
        v-for="item in searchKeywords"
        class="cursor taginfo tagSize"
        @click="submit(item, 'tag')"
        :key="item"
      >{{ item }}</el-button>
    </div>
    <md-button class="md-raised md-primary searchKeywords" @click="showTag">Recent search terms</md-button>
    <!-- END 사용자가 검색한 키워드 -->

    <!-- 다른 사용자가 감상했던 비디오 -->
    <el-carousel
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :interval="5000"
      type="card"
      indicator-position="none"
      height="100px"
      style="padding: 10px 0px 10px 0px;
    background-color: #1e2431 ;"
    >
      <el-carousel-item v-for="(item, index) in recommandList" :key="index">
        <img
          class="md-image"
          style="border: 1px solid #606266;"
          width="184"
          height="100"
          :src="item.thumbnail"
          @click="route(item)"
        >
        <span class="recommandMusic" @click="route(item)">{{ item.title.substring(0, 30) }} ..</span>
      </el-carousel-item>
    </el-carousel>
    <!-- END 다른 사용자가 감상했던 비디오 -->

    <!-- 검색 목록 -->
    <md-list id="list" class="searchList" :class="{ subHightAuto: isMini }">
      <md-list-item
        :id="`item${index}`"
        v-for="(item, index) in searchList"
        :key="item.etag"
        class="cursor"
        @click="route(item)"
      >
        <md-avatar style="margin-right: 0;">
          <img :src="item.imageInfo" alt="People">
        </md-avatar>

        <span class="md-list-item-text music-title">{{ item.title.substring(0, 60) }}</span>
        
        <span class="label_channel" v-if="item.otherChannelId">{{ $t('COMMONS.LABEL.CHANNEL') }}</span>
        <span class="label_playlist" v-if="item.playlistId">{{ $t('COMMONS.LABEL.PLAY_LIST') }}</span>
        <span class="label_video" v-if="item.videoId && item.isLive === 'none'">{{ item.duration }}</span>
        <span
          class="label_live"
          v-if="item.videoId && item.isLive === 'live'"
        >{{ $t('COMMONS.LABEL.LIVE') }}</span>
      </md-list-item>
      <md-list-item>
        <span v-if="!isMore" @click="nextPageLoad" class="searchPagingCenter">
          <a class="cursor">
            <i class="el-icon-refresh"></i>
            {{ $t('COMMONS.MORE') }}
          </a>
        </span>
        <span v-if="isMore" class="searchPagingCenter" style="color:#ffffff;">LOADING ...</span>
      </md-list-item>
      <div class="bottom">
        <img src="@/assets/images/youtube/dev.png">
      </div>
    </md-list>
    <!-- 검색 목록 -->
    
    <!-- 로딩 컴포넌트 -->
    <transition name="fade">
      <loading :init="initLoading" v-show="!load"/>
    </transition>

    <!-- 서브 플레이어 컴포넌트 -->
    <sub-player-bar v-show="isMini"/>
  </div>
</template>

<script>
import StoreMixin from "@/components/Commons/Mixin/index";
import ApiMixin from "@/components/Commons/Mixin/api";
import AutoComplate from "@/components/Commons/Main/AutoComplate";
import SubPlayerBar from "@/components/PlayerBar/SubPlayerBar";
import Loading from "@/components/Commons/Loader/PageLoading";

export default {
  name: "SearchList",
  mixins: [StoreMixin, ApiMixin],
  components: {
    Loading,
    AutoComplate,
    SubPlayerBar
  },
  data() {
    return {
      searchList: [],
      autoSearchList: [],
      autoSearchSize: 0,
      defaultQuery: "top music 2019",
      searchText: "",
      searchKeywords: [],
      recommandList: [],
      isMini: false,
      isMore: false,
      isTag: false,
      limit: 3,
      initLoading: false,
      loading: false,
      load: false,
      timer: 0,
      googleSearchPath:
        "https://suggestqueries.google.com/complete/search?ds=yt&client=youtube&q="
    };
  },
  created() {
    // DB에서 추천트랙 조회
    this.recommandTrack();

    // DB에서 키워드 조회
    this.searchText = this.getSearchKeyword();

    // API AUTH
    let key = this.$store.getters.getKeys;
    if (key.length > 0) {
      this.init(this.searchText);
    } else {
      // 최초 로딩 시작
      this.getLog("[init]/[Search] ===> API KEY 로딩 중 ...");
      this.$set(this, "initLoading", true);

      // 앱 구동 후 처음 초기화 세팅 약 5초의 지연을 줌
      this.$store.dispatch("setAuthKey", { vm: this }).then(() => {
        setTimeout(() => {
          const keyList = this.$store.getters.getKeys;
          const searchKey = this.$lodash.find(keyList, { query: "search" });
          const videoItemsKey = this.$lodash.find(keyList, {
            query: "videoItems"
          });
          this.SEARCH_KEY = searchKey.apiKey;
          this.VIDEO_ITEMS_KEY = videoItemsKey.apiKey;
          this.init(this.searchText);
          this.$set(this, "initLoading", false);
        }, 3500);
      });
    }
  },
  computed: {
    limitForKeyword() {
      return this.limit ? this.searchKeywords.slice(0, this.limit) : this.searchKeywords
    }
  },
  mounted() {
    let pos = this.getScrollPos();
    this.$el.querySelector("#list").scrollTo(0, pos);
  },
  methods: {
    recommandTrack() {
      this.loading = true;
      this.$db
        .get("17901f376f4ff226c03adecee00013d5")
        .then(result => {
          const data = result.recommand;
          this.recommandList = this.$lodash
            .chain(data)
            .orderBy(["creates"], ["desc"])
            .take(30)
            .shuffle()
            .value();
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleScroll() {
      let pos = this.$el.querySelector("#list").scrollTop;
      this.$store.commit("setScrollPos", pos);
    },
    showTag() {
      if (!this.getUserId()) {
        this.$modal.show("dialog", {
          title: "Info",
          text: this.$t("COLLECTION.NO_LOGIN"),
          buttons: [
            {
              title: "Close"
            }
          ]
        });
      } else {
        if (this.isTag) {
          this.isTag = false;
        } else {
          this.isTag = true;
        }
      }
    },
    searchTop() {
      let options = {
        container: "#list",
        offset: -80
      };
      this.$scrollTo("#item0", 0, options);
    },
    init(text) {
      this.isMini = this.getMusicInfos() ? true : false;
      let totalSearchList = this.getNextSearchList();
      if (this.$lodash.size(totalSearchList) === 0) {
        if (!text) {
          text = this.defaultQuery;
        } else {
          this.$store.commit("setSearchText", text);
        }
        let request = this.youtubeSearch(text);
        this.$http
          .get(request)
          .then(res => {
            if (res.data.nextPageToken) {
              this.$store.commit("setNextPageToken", res.data.nextPageToken);
            }
            this.$store.commit("setSearchList", res.data.items);
            this.$store
              .dispatch("setSearchDuration", { vm: this })
              .then(results => {
                this.searchList = results;
                this.load = true;
              });
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        this.searchList = totalSearchList;
        this.load = true;
      }
      this.getKeyword();
    },
    submit(text, tag) {
      this.load = false;
      this.$store.commit("setNextSearchList", undefined);
      if (!text) {
        text = this.defaultQuery;
      } else {
        this.$store.commit("setSearchText", text);
      }
      let request = this.youtubeSearch(text);
      this.$http
        .get(request)
        .then(res => {
          if (res.data.nextPageToken) {
            this.$store.commit("setNextPageToken", res.data.nextPageToken);
          }
          this.$store.commit("setSearchList", res.data.items);
          this.$store
            .dispatch("setSearchDuration", { vm: this })
            .then(results => {
              this.searchList = results;
              if (!tag) {
                this.updateKeyword(text);
              }
              this.$refs.autoComplate.reset();
              this.$el.querySelector("#list").scrollTo(0, 0);
              this.load = true;
            });
        })
        .catch(error => {
          console.error(error);
        });
      this.isTag = false;
    },
    getKeyword() {
      if (this.getUserId()) {
        this.$test
          .find({
            selector: {
              type: "profile",
              userId: this.getUserId()
            },
            fields: ["_id", "keywords"]
          })
          .then(result => {
            let docs = result.docs[0];
            if (docs) {
              let keywords = docs.keywords;
              keywords = this.$lodash
                .chain(keywords)
                .orderBy(["created"], ["desc"])
                .take(10)
                .map("searchKey")
                .value();
              this.searchKeywords = this.$lodash.uniqWith(
                keywords,
                this.$lodash.isEqual
              );
            }
          });
      }
    },
    updateKeyword(k) {
      let id = this.getUserId();
      if (id) {
        this.$test
          .find({
            selector: {
              type: "profile",
              userId: id
            }
          })
          .then(result => {
            let docs = result.docs[0];
            docs.keywords.push({
              searchKey: k,
              created: this.$moment().format("YYYYMMDDHHmmss")
            });
            this.$test.put(docs).then(() => {
              this.getKeyword();
            });
          });
      }
    },
    route(item) {
      this.$store.commit("setPath", this.$route.path);
      if (item.playlistId) {
        this.$router.push({
          name: "NOT-PLAYING-PLAYLIST",
          params: {
            playType: "play",
            id: item.playlistId
          }
        });
      } else if (item.videoId) {
        this.$router.push({
          name: "NOT-PLAYING-PLAYLIST",
          params: {
            playType: "related",
            id: item.videoId
          }
        });
      } else {
        this.$router.push({
          name: "NOT-PLAYING-PLAYLIST",
          params: {
            playType: "channel",
            id: item.channelId
          }
        });
      }
    },
    nextPageLoad() {
      this.isMore = true;
      let text =
        this.getSearchKeyword() === null
          ? "top music 2018"
          : this.getSearchKeyword();
      let request = this.youtubePagingSearch(text, this.getNextPageToken());
      this.$http
        .get(request)
        .then(res => {
          if (res.data.nextPageToken) {
            this.$store.commit("setNextPageToken", res.data.nextPageToken);
          }
          this.$store.commit("setSearchList", res.data.items);
          this.$store
            .dispatch("setSearchDuration", { vm: this })
            .then(results => {
              this.searchList = this.$lodash.concat(this.searchList, results);
              this.$store.commit("setNextSearchList", this.searchList);
              this.isMore = false;
            });
        })
        .catch(error => {
          console.error(error);
        });
    },
    itemSelected(item) {
      this.searchText = item;
      this.submit(this.searchText);
    }
  },
  beforeMount() {
    this.$store.commit("setIndexPath", this.$route.path);
  },
  beforeDestroy() {
    this.handleScroll();
  }
};
</script>

<style scope>
.md-list.md-theme-default {
  background-color: #242d40 !important;
}
.searchPagingCenter {
  margin-left: 110px !important;
  padding: 0;
}
.searchPagingCenter a {
  color: #ffffff !important;
}
.taginfo {
  overflow-x: hidden;
  max-width: 220px;
  text-overflow: ellipsis;
}

.allKeyword {
  font-size: 18px;
  vertical-align: middle;
  padding-left: 5px;
  color: #ffffff;
}
</style>