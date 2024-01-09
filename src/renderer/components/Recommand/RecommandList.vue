<template>

  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header ref="header" :isMenu="true" :isShow="false" />
    <el-row>
      <el-col>
        <div class="menu1_tip">
          <div>
            <img width="20" style="margin-bottom: 10px;" src="@/assets/images/svg/like-on.svg">
            <span class="collections">Recommand</span>
          </div>
          <strong class="tr"
                  style="font-size:11px;">Content is updated periodically. (Available with mouse wheel)</strong>
        </div>
      </el-col>
    </el-row>

    <!-- Popular music -->
    <div class="wrapper">
      <el-row>
        <el-col>
          <el-form class="form"
                   v-loading="loading"
                   element-loading-background="rgba(0, 0, 0, 0.8)"
                   label-position="top"
                   style="padding: 5px; height:145px;">
            <el-form-item class="form-item" label="Popular Playlist 💖">
              <hooper ref="slide1"
                      :itemsToShow="1.25"
                      :keysControl="false"
                      :mouseDrag="false"
                      :autoPlay="true"
                      :playSpeed="12000"
                      style="height: 145px">
                <slide v-for="(item, i) in appRecommand" :key="i">
                  <img class="md-image cursor"
                       style="border: 1px solid #606266;"
                       width="286"
                       :src="item.thumbnail"
                       @click="popular(item)">
                  <span class="recommandMusic" style="top: 110px;
                           width: 278px;">{{ item.title.substring(0, 30) }} ..</span>
                </slide>
                <hooper-navigation slot="hooper-addons"></hooper-navigation>
              </hooper>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- Live Radio -->
      <el-row>
        <el-col>
          <el-form class="form"
                   v-loading="loading1"
                   element-loading-background="rgba(0, 0, 0, 0.8)"
                   label-position="top"
                   style="padding: 5px; height:145px; margin-top: 60px;">
            <el-form-item class="form-item" label="Live Radio 📻">
              <hooper ref="slide2"
                      :itemsToShow="1.25"
                      :keysControl="false"
                      :mouseDrag="false"
                      :autoPlay="true"
                      :playSpeed="6000"
                      style="height: 148px">
                <slide v-for="(item, i) in liveRecommand" :key="i">
                  <img class="md-image cursor"
                       style="border: 1px solid #606266;"
                       width="286"
                       :src="item.snippet.thumbnails.medium.url"
                       @click="live(item)">
                  <span class="recommandMusic" style="top: 110px;
                           width: 278px;">{{ item.snippet.title.substring(0, 45) }}</span>
                </slide>
                <hooper-navigation slot="hooper-addons"></hooper-navigation>
              </hooper>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- Music watched by members -->
      <el-row>
        <el-col>
          <el-form class="form"
                   v-loading="loading2"
                   element-loading-background="rgba(0, 0, 0, 0.8)"
                   label-position="top"
                   style="padding: 5px; height:145px; margin-top: 60px;">
            <el-form-item class="form-item" :class="{ isSub: isMini }" label="Music watched by members 🎶">
              <hooper ref="slide3"
                      :autoPlay="true"
                      :settings="hooperSettings"
                      style="height: 100px">
                <slide v-for="(item, i) in userRecommand" :key="i">
                  <img class="md-image cursor"
                       style="border: 1px solid #606266;"
                       width="184"
                       height="100"
                       :src="item.thumbnail"
                       @click="watchMember(item)">
                  <span class="recommandMusic" style="width: 154px;
                             height: 31px;">{{ item.title.substring(0, 30) }} ..</span>
                </slide>
                <hooper-navigation slot="hooper-addons"></hooper-navigation>
              </hooper>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <!-- 서브 플레이어 -->
    <sub-player-bar v-show="isMini" />

  </div>

</template>

<script>

  import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper'
  import '@/assets/css/hooper.css'

  import apiMixin from '@/components/Commons/Mixin/api'
  import dbMixin from '@/components/Commons/Mixin/db'
  import StoreMixin from '@/components/Commons/Mixin/index'
  import SubPlayerBar from '@/components/PlayerBar/SubPlayerBar'

  const USER_RECOMMAND_DOUMENT_ID = '17901f376f4ff226c03adecee00013d5'

  export default {
    name: '',
    mixins: [apiMixin, dbMixin, StoreMixin],
    data() {
      return {
        loading: false,
        loading1: false,
        loading2: false,
        loading3: false,
        isMini: false,
        // 앱의 모듈 문제로 디폴트 값이 없으면 오류가 발생함.
        userRecommand: [{ title: 'asd' }],
        appRecommand: [{ title: 'asd' }],
        liveRecommand: [
          {
            snippet: {
              title: 'init',
              thumbnails: {
                medium: {
                  url: 'https://storage.googleapis.com/twg-content/images/download.width-1200.jpg'
                }
              }
            }
          }
        ],
        developRecommand: [{ title: 'asd' }],
        hooperSettings: {
          itemsToShow: 2.25,
          centerMode: false,
          shortDrag: false,
          keysControl: false,
          mouseDrag: false
        }
      }
    },
    components: {
      Hooper,
      Slide,
      HooperNavigation,
      SubPlayerBar
    },
    mounted() {
      const musicInfo = this.getMusicInfos()
      this.isMini = musicInfo ? true : false

      this.appRecommandList()
      this.getLiveAudio()
      this.userRecommandList()
    },
    methods: {
      watchMember(data) {
        this.$router.push({
          name: 'NOT-PLAYING-PLAYLIST',
          params: {
            playType: 'related',
            id: data.videoId
          }
        })
      },
      live(data) {
        this.$router.push({
          name: 'NOT-PLAYING-PLAYLIST',
          params: {
            playType: 'related',
            id: data.id.videoId
          }
        })
      },
      popular(data) {
        this.$router.push({
          name: 'NOT-PLAYING-PLAYLIST',
          params: {
            playType: 'play',
            id: data.playlistId
          }
        })
      },
      appRecommandList() {
        this.loading = true
        this.$recommand
          .find({
            selector: {
              docType: {
                $eq: 'appRecommand'
              }
            }
          })
          .then(result => {
            const docs = result.docs
            this.appRecommand = this.$lodash
              .chain(docs)
              .take(50)
              .shuffle()
              .value()
            this.loading = false
            this.$refs.slide1.restart()
          })
      },
      getLiveAudio() {
        this.loading1 = true
        const text = 'Live Radio'
        const request = this.youtubeLiveRadio(text)
        this.$http.get(request).then(result => {
          const live = result.data.items
          this.liveRecommand = this.$lodash
            .chain(live)
            .take(50)
            .shuffle()
            .value()
          this.loading1 = false
          this.$refs.slide2.restart()
        })
      },
      userRecommandList() {
        this.loading2 = true
        this.$db
          .get(USER_RECOMMAND_DOUMENT_ID)
          .then(result => {
            const data = result.recommand
            this.userRecommand = this.$lodash
              .chain(data)
              .orderBy(['creates'], ['desc'])
              .take(50)
              .shuffle()
              .value()
            this.loading2 = false
            this.$refs.slide3.restart()
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }

</script>

<style scoped>

  .hooper-slide {
    background: #ddd;
    border: 1px solid #000;
  }

  .form >>> .el-form-item__label {
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    padding: 0;
    padding-left: 2px;
  }

  .form >>> .el-loading-mask {
    top: 37px;
    bottom: -56px;
  }

  .isSub {
    margin-bottom: 60px;
  }

  .developerList {
    border-top: 1px solid rgba(23, 30, 45, 0.48);
  }

  .md-list-item-content {
    padding: 4px 8px 4px 2px !important;
  }

  .wrapper {
    margin: 0;
    max-height: 470px;
    overflow-y: scroll;
  }

  .wrapper::-webkit-scrollbar {
    width: 7px;
  }

  .wrapper::-webkit-scrollbar-track {
    background: #1d232f;
  }

  .wrapper::-webkit-scrollbar-thumb {
    background: #ddd;
  }

</style>
