/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <div id="player">
      <div class="zaudio_wrapper">
        <!-- 타이틀바 컴포넌트 -->
        <top-header :data="{ playType: 'list' }" @scrollTop="searchTop"/>

        <!-- 검색어 영역 -->
        <div class="zaudio_container">
          <div class="search">
            <input
              type="text"
              v-model="searchText"
              @keyup="autoComplateSearch"
              @keyup.enter="submit(searchText)"
              placeholder=" Search Youtube"
            >
            <a class="searchCancel cursor" @click="searchReset">
              <img width="20" src="../../assets/images/svg/cancel.svg">
            </a>
          </div>
          <div class="tag" v-show="isTag">
            <span v-if="searchKeywords.length === 0" class="no_keyword">
              <i class="el-icon-warning"></i>
              {{ $t('COMMONS.NO_KEYWORD') }}
            </span>
            <el-button
              size="mini"
              type="info"
              v-for="item in searchKeywords"
              class="cursor tagSize"
              @click="submit(item, 'tag')"
              :key="item"
            >{{ item }}</el-button>
          </div>
          <el-button
            type="primary"
            class="keywords"
            icon="el-icon-d-caret"
            @click="showTag"
          >Recent search terms</el-button>
        </div>

        <!-- 자동검색 영역  -->
        <div class="autoSearch" v-show="isAppend">
          <ul class="autoList">
            <li v-for="(item, index) in autoSearchList" :key="index" @click="itemSelected(item)">
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <el-carousel
          :interval="3000"
          type="card"
          indicator-position="none"
          height="100px"
          style="margin:10px;"
        >
          <el-carousel-item v-for="item in recommandList" :key="item.playlistId">
            <img width="174" height="100" :src="item.image">
            <span class="recommandMusic">{{ item.title }}</span>
          </el-carousel-item>
        </el-carousel>

        <!-- 검색목록  -->
        <ul id="list" class="zaudio_playlist" :class="{ dynamicHeight: isMini }">
          <li
            :id="`item${index}`"
            v-for="(item, index) in searchList"
            :key="item.etag"
            class="cursor"
            @click="route(item)"
          >
            <img class="thumbnails" :src="item.imageInfo">
            <span class="music-title">{{ item.title.substring(0, 60) }}</span>
            <span style="flex-grow:1;"></span>
            <span class="label_channel" v-if="item.otherChannelId">{{ $t('COMMONS.LABEL.CHANNEL') }}</span>
            <span class="label_playlist" v-if="item.playlistId">{{ $t('COMMONS.LABEL.PLAY_LIST') }}</span>
            <span
              class="label_video"
              v-if="item.videoId && item.isLive === 'none'"
            >{{ item.duration }}</span>
            <span
              class="label_live"
              v-if="item.videoId && item.isLive === 'live'"
            >{{ $t('COMMONS.LABEL.LIVE') }}</span>
          </li>

          <!-- 다음 페이지 버튼 -->
          <li v-on:click="nextPageLoad">
            <span class="loadMore center cursor" v-if="!isMore">
              <i class="el-icon-refresh load_more"></i>
              {{ $t('COMMONS.MORE') }}
            </span>
            <span class="center" v-if="isMore">
              <i class="el-icon-refresh load_more"></i> LOADING ...
            </span>
          </li>

          <!-- 개발자 가이드라인  -->
          <div class="bottom">
            <img src="@/assets/images/youtube/dev.png">
          </div>
        </ul>
      </div>
    </div>

    <!-- 로딩 컴포넌트 -->
    <transition name="fade">
      <loading v-show="!load"/>
    </transition>

    <!-- 서브 플레이어 컴포넌트 -->
    <sub-player-bar v-show="isMini"/>
  </div>
</template>

<script>
import * as $commons from "@/service/commons-service.js";
import storeMixin from "@/components/Mixin/index";
import subPlayerBar from "@/components/PlayerBar/SubPlayerBar";
import loading from "@/components/Loader/Loader";

export default {
  name: "SearchList",
  mixins: [storeMixin],
  components: {
    loading,
    subPlayerBar
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
      load: false,
      timer: 0,
      state: 0
    };
  },
  created() {
    this.searchText = this.getSearchKeyword();
    this.recommandTrack();
    this.init(this.searchText);
  },
  watch: {
    searchText(value) {
      if (this.$lodash.size(value) === 0) {
        this.isAppend = false;
      }
    }
  },
  beforeMount() {
    this.$store.commit("setIndexPath", this.$route.path);
  },
  mounted() {
    let pos = this.getScrollPos();
    this.$el.querySelector("#list").scrollTo(0, pos);
  },
  beforeDestroy() {
    this.handleScroll();
  },
  methods: {
    recommandTrack() {
      let request1, request2, request3;
      if (this.$locale === "ko") {
        request1 = $commons.youtubePlaylistSearch("한국 노래 탑 100");
        request2 = $commons.youtubePlaylistSearch("KPOP 2018");
        request3 = $commons.youtubePlaylistSearch("Billboard Charts");
      } else {
        request1 = $commons.youtubePlaylistSearch("iTunes Charts");
        request2 = $commons.youtubePlaylistSearch("Billboard Charts");
        request3 = $commons.youtubePlaylistSearch("Merry Christmas 2018");
      }
      const fetchURL = url => this.$http.get(url);
      const promiseArray = [request1, request2, request3].map(fetchURL);
      Promise.all(promiseArray)
        .then(data => {
          let data1 = data[0].data.items;
          let data2 = data[1].data.items;
          let data3 = data[2].data.items;
          let results = this.$lodash.concat(data1, data2).concat(data3);
          let arr = [];
          this.$lodash.forEach(results, (items, index) => {
            let obj = {};
            obj.playlistId = items.id.playlistId;
            obj.title = items.snippet.title;
            obj.image = items.snippet.thumbnails.medium.url;
            arr.push(obj);
            if (arr.length === results.length - 1) {
              this.recommandList = this.$lodash
                .chain(arr)
                .uniqWith(this.$lodash.isEqual)
                .shuffle()
                .value();
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleScroll() {
      let pos = this.$el.querySelector("#list").scrollTop;
      this.$store.commit("setScrollPos", pos);
    },
    tagSearch(tag) {
      this.submit(tag);
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
      let musicInfo = this.getMusicInfos();
      if (musicInfo) {
        this.isMini = !this.isMini;
      }
      let totalSearchList = this.getNextSearchList();
      if (this.$lodash.size(totalSearchList) === 0) {
        if (text === null) {
          text = "top music 2018";
        } else {
          this.$store.commit("setSearchText", text);
        }
        let request = $commons.youtubeSearch(text);
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
      let request = $commons.youtubeSearch(text);
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
        this.$local
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
        this.$local
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
              created: this.$moment().format("YYYYMMDDkkmmss")
            });
            this.$local.put(docs).then(() => {
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
      let request = $commons.youtubePagingSearch(text, this.getNextPageToken());
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
              let url = $commons.googleSearchPath.concat(this.searchText);
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
            }, 100);
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
  }
};
</script>

<style scoped>
.searchCancel {
  position: absolute;
  top: 43px;
  right: 10px;
}

.keywords {
  width: 100%;
  border-radius: 0px;
  padding: 5px;
}

.autoSearch {
  border-top: 1px solid rgb(17, 17, 17);
  position: absolute;
  background: #3e3e3e;
  color: #ffffff;
  top: 76px;
  width: 100%;
  z-index: 5000;
}

.autoList {
  list-style: none;
  padding: 0px;
  margin-left: 5px;
  margin-right: 5px;
  overflow-x: hidden;
  overflow-y: auto;
}

.autoList li {
  padding: 5px;
  cursor: pointer;
}

.autoList li:hover {
  background: #a3a3a3;
}

.search {
  width: 100%;
  height: 40px;
}

.tag {
  width: 100%;
  padding: 18px;
}

.tagSize {
  padding: 5px;
  margin-left: 10px;
  margin-bottom: 5px;
}

.icon-search {
  position: absolute;
  top: 35px;
  bottom: 0;
  color: #ffffff;
  left: 0px;
  background: #3e3e3e;
  padding: 11px 3px 0px 8px;
  height: 31px;
}

.search input {
  width: 100%;
  height: 100%;
  background: #3e3e3e;
  border: none;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  padding-left: 5px;
  outline: none;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.recommandMusic {
  z-index: 9999;
  position: absolute;
  color: rgb(255, 255, 255);
  top: 63px;
  font-size: 11px;
  padding-left: 5px;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.zaudio_playlist {
  max-height: 350px;
  margin-top: 3px;
}

.thumbnails {
  border-radius: 20px;
}

.music-title {
  width: 170px;
  font-size: 11px;
  padding-left: 15px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dynamicHeight {
  max-height: 300px;
}

.no_keyword {
  color: #fff;
  font-weight: 700;
  font-size: 15px;
}
</style>
