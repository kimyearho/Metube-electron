/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header
      :data="{ playType: 'list' }"
      @scrollTop="searchTop"
    />

    <!-- 검색어 영역 -->
    <div class="search">
      <input
        type="text"
        v-model="searchText"
        @keyup="autoComplateSearch"
        @keyup.enter="submit(searchText)"
        placeholder=" Search Youtube"
      >
      <a
        class="searchCancel cursor"
        @click="searchReset"
      >
        <img
          width="20"
          src="../../assets/images/svg/cancel.svg"
        >
      </a>
    </div>
    <div
      class="tag"
      v-show="isTag"
    >
      <span
        v-if="searchKeywords.length === 0"
        class="no_keyword"
      >
        <i class="el-icon-warning"></i>
        {{ $t('COMMONS.NO_KEYWORD') }}
      </span>
      <el-button
        size="mini"
        type="info"
        v-for="item in searchKeywords"
        class="cursor taginfo tagSize"
        @click="submit(item, 'tag')"
        :key="item"
      >{{ item }}</el-button>
    </div>
    <md-button
      class="md-raised md-primary searchKeywords"
      @click="showTag"
    >Recent search terms</md-button>

    <!-- 자동검색 영역  -->
    <div
      class="autoSearch"
      v-show="isAppend"
    >
      <ul class="autoList">
        <li
          v-for="(item, index) in autoSearchList"
          :key="index"
          @click="itemSelected(item)"
        >
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <el-carousel
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :interval="5000"
      type="card"
      indicator-position="none"
      height="100px"
      style="margin:10px;"
    >
      <el-carousel-item
        v-for="(item, index) in recommandList"
        :key="index"
      >
        <img
          class="md-image"
          style="border: 1px solid #606266;"
          width="174"
          height="100"
          :src="item.thumbnail"
          @click="route(item)"
        >
        <span
          class="recommandMusic"
          @click="route(item)"
        >{{ item.title.substring(0, 30) }} ..</span>
      </el-carousel-item>
    </el-carousel>

    <md-list
      id="list"
      class="searchList"
      :class="{ subHightAuto: isMini }"
    >
      <md-list-item
        :id="`item${index}`"
        v-for="(item, index) in searchList"
        :key="item.etag"
        class="cursor"
        @click="route(item)"
      >
        <md-avatar style="margin-right: 0;">
          <img
            :src="item.imageInfo"
            alt="People"
          >
        </md-avatar>

        <span class="md-list-item-text music-title">{{ item.title.substring(0, 60) }}</span>

        <span
          class="label_channel"
          v-if="item.otherChannelId"
        >{{ $t('COMMONS.LABEL.CHANNEL') }}</span>
        <span
          class="label_playlist"
          v-if="item.playlistId"
        >{{ $t('COMMONS.LABEL.PLAY_LIST') }}</span>
        <span
          class="label_video"
          v-if="item.videoId && item.isLive === 'none'"
        >{{ item.duration }}</span>
        <span
          class="label_live"
          v-if="item.videoId && item.isLive === 'live'"
        >{{ $t('COMMONS.LABEL.LIVE') }}</span>
      </md-list-item>
      <md-list-item>
        <span
          v-if="!isMore"
          @click="nextPageLoad"
          class="searchPagingCenter"
        >
          <a class="cursor">
            <i class="el-icon-refresh"></i>
            {{ $t('COMMONS.MORE') }}
          </a>
        </span>
        <span
          v-if="isMore"
          class="searchPagingCenter" style="color:#ffffff;"
        >LOADING ...</span>
      </md-list-item>
      <div class="bottom">
        <img src="@/assets/images/youtube/dev.png">
      </div>
    </md-list>

    <!-- 로딩 컴포넌트 -->
    <transition name="fade">
      <loading v-show="!load" />
    </transition>

    <!-- 서브 플레이어 컴포넌트 -->
    <sub-player-bar v-show="isMini" />
  </div>
</template>

<script>
// import * as $commons from "@/service/commons-service.js";
import StoreMixin from "@/components/Mixin/index";
import ApiMixin from "@/components/Mixin/api";
import SubPlayerBar from "@/components/PlayerBar/SubPlayerBar";
import Loading from "@/components/Loader/PageLoading";

export default {
  name: "SearchList",
  mixins: [StoreMixin, ApiMixin],
  components: {
    Loading,
    SubPlayerBar
  },
  data() {
    return {
      searchList: [],
      autoSearchList: [],
      autoSearchSize: 0,
      searchText: "",
      searchKeywords: [],
      recommandList: [],
      isMini: false,
      isMore: false,
      isAppend: false,
      isTag: false,
      loading: false,
      load: false,
      timer: 0,
      googleSearchPath: "https://suggestqueries.google.com/complete/search?ds=yt&client=youtube&q=",
    };
  },
  created() {
    this.recommandTrack();
    this.searchText = this.getSearchKeyword();
    setTimeout(() => {
      this.API_KEY = this.$store.getters.getKeys
      this.init(this.searchText);
    }, 1000);
  },
  watch: {
    searchText(value) {
      if (this.$lodash.size(value) === 0) {
        this.isAppend = false;
      }
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
          let data = result.recommand;
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
    searchReset() {
      this.searchText = "";
      this.isAppend = false;
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
        if (text === null) {
          text = "top music 2018";
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
            this.$store.dispatch("setSearchDuration").then(results => {
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
      this.isAppend = false;
      this.$store.commit("setNextSearchList", undefined);
      if (text === undefined || text === "") {
        text = "top music 2018";
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
          this.$store.dispatch("setSearchDuration").then(results => {
            this.searchList = results;
            if (tag === undefined) {
              this.updateKeyword(text);
            }
            this.isAppend = false;
            this.$el.querySelector("#list").scrollTo(0, 0);
            this.load = true;
          });
        })
        .catch(error => {
          console.error(error);
        });
      this.isAppend = false;
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
          this.$store.dispatch("setSearchDuration").then(results => {
            this.searchList = this.$lodash.concat(this.searchList, results);
            this.$store.commit("setNextSearchList", this.searchList);
            this.isMore = false;
          });
        })
        .catch(error => {
          console.error(error);
        });
    },
    autoComplateSearch(event) {
      if (
        event.key !== "Enter" &&
        event.key !== "Control" &&
        event.key !== "Shift" &&
        event.key !== "CapsLock" &&
        event.key !== "Tab" &&
        event.keyCode !== 32 &&
        event.keyCode !== 27 &&
        event.keyCode !== 112 &&
        event.keyCode !== 113 &&
        event.keyCode !== 114 &&
        event.keyCode !== 115 &&
        event.keyCode !== 116 &&
        event.keyCode !== 117 &&
        event.keyCode !== 118 &&
        event.keyCode !== 119 &&
        event.keyCode !== 120 &&
        event.keyCode !== 121 &&
        event.keyCode !== 122 &&
        event.keyCode !== 123
      ) {
        let re = /([xEA-xED][x80-xBF]{2}|[a-zA-Z0-9.~!@#$%&*()_+^'\"`~;:<>,?/{}[]|]|[ㄱ-ㅎ가-힣])+/g;
        if (this.searchText !== "") {
          if (re.test(this.searchText)) {
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.timer = setTimeout(() => {
              let url = this.googleSearchPath.concat(this.searchText);
              this.$http
                .jsonp(url)
                .then(res => {
                  let value = this.$lodash.map(res[1], item => {
                    return {
                      name: item[0]
                    };
                  });
                  let searchText = this.$lodash.toLower(this.searchText);
                  let searchResults = this.$lodash.map(value, "name");
                  this.autoSearchList = [];
                  this.$lodash.forEach(searchResults, item => {
                    this.autoSearchList.push(item);
                  });
                  this.isAppend = true;
                })
                .catch(error => {
                  console.error(error);
                });
            }, 500);
          }
        } else {
          // 검색어가 없을 때 자동검색목록 닫음.
          this.isAppend = false;
          this.$store.commit("setSearchText", this.searchText);
        }
      }
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
  },
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
</style>