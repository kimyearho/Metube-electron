/*--------------------------------------------------------------------------------------------- *
Licensed under the GPL-3.0 License. See License.txt in the project root for license information. *
You can not delete this comment when you deploy an application.
*--------------------------------------------------------------------------------------------*/

<template>

  <div id="app">
    <!-- 루트 라우터 뷰 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>

    <!-- 하단 네비게이션 -->
    <md-tabs class="tab-navi" v-if="tabVisible">
      <md-tab id="tabSearch" class="md-tab" md-label="Search" @click="route('search')"></md-tab>
      <md-tab id="tabRecommand" class="md-tab" md-label="Recommand" @click="route('recommand')"></md-tab>
      <md-tab id="tabCollection" class="md-tab" md-label="Collection" @click="route('collection')"></md-tab>
    </md-tabs>

    <v-dialog :width="300" :height="300" :clickToClose="false" />
  </div>

</template>

<script>

  import GlobalMix from '@/components/Commons/Mixin/common'
  import PlaylistMix from '@/components/Commons/Mixin/Playlist'
  import StoreMixin from '@/components/Commons/Mixin/index'
  import DataUtils from '@/components/Commons/Mixin/db'

  export default {
    name: 'App',
    mixins: [StoreMixin, DataUtils, GlobalMix, PlaylistMix],
    data() {
      return {
        isShow: false,
        isSpinShow: false,
        tabVisible: false,
        currentPage: null,
        state: '',
        status: []
      }
    },
    watch: {
      $route(to, from) {
        this.$store.commit('setPath', to.fullPath)
      }
    },
    created() {
      this.$ipcRenderer.on('player2Win', this.player2Win)

      this.$eventBus.$on('init', flag => {
        this.tabVisible = flag
      })

      this.$eventBus.$off('statusCheck')
      this.$eventBus.$on('statusCheck', this.videoStatusCheck)
    },
    mounted() {
      this.$watch(
        () => {
          return this.state
        },
        (newVal, oldVal) => {
          this.status.push(newVal)
        }
      )

      // 마우스 뒤로가기를 통해 재생중인 재생목록으로 접근못하도록 지정
      window.onpopstate = event => {
        let pathName = this.$route.name
        if (pathName === 'MY-PLAYING-PLAYLIST' || pathName === 'PLAYING-PLAYLIST') {
          this.$router.go(-1)
        }
      }

      // 히스토리 모니터링
      this.loopHistoryMonitering()

      this.$trap.bind('space', () => {
        let playType = this.getPlayType()
        if (playType) {
          // 재생 중
          this.$ipcRenderer.send('win2Player', ['pauseVideo'])
          this.$store.commit('setPlayType', false)
          this.$eventBus.$emit('playTypeControl', { playType: false })
        } else {
          // 일시 정지
          this.$ipcRenderer.send('win2Player', ['playVideo'])
          this.$store.commit('setPlayType', true)
          this.$eventBus.$emit('playTypeControl', { playType: true })
        }
      })
      this.$trap.bind('left', () => {
        const volume = Number(this.getVolume()) - 5
        if (volume >= 0) {
          this.$store.commit('setVolume', volume)
          this.$ipcRenderer.send('win2Player', ['setVolume', volume])
        }
      })
      this.$trap.bind('right', () => {
        const volume = Number(this.getVolume()) + 5
        if (volume <= 100) {
          this.$store.commit('setVolume', volume)
          this.$ipcRenderer.send('win2Player', ['setVolume', volume])
        }
      })
    },
    methods: {
      player2Win(e, data) {
        let event_key = data[0]
        let event_value = data[1]
        if (event_key == 'onReady') {
        } else if (event_key == 'onStateChange') {
          this.playerState(event_value)
        } else if (event_key == 'currentTime') {
          this.$eventBus.$emit('playVideoSecond', event_value)
          // this.$emit("playVideoSecond", event_value);
        }
      },

      progress(e, args) {
        this.$eventBus.$emit('downloadStart', args)
      },

      route(path) {
        if (path === 'search') {
          this.$router.push({
            name: 'play-search'
          })
        } else if (path === 'collection') {
          this.$router.push({
            name: 'collection'
          })
        } else if (path === 'history') {
          this.$router.push({
            name: 'VIDEO-HISTORY'
          })
        } else if (path === 'recommand') {
          this.$router.push({
            name: 'recommand'
          })
        }
      },

      // 10분 간격으로 최근 히스토리 20개를 제외하고 삭제한다.
      loopHistoryMonitering() {
        setInterval(() => {
          let user = this.getUserId()
          if (user) {
            this.$test
              .find({
                selector: {
                  type: 'history',
                  userId: user
                }
              })
              .then(result => {
                let docs = result.docs
                if (docs.length > 0) {
                  let size = docs.length
                  let defaultNum = 20
                  let result = size - defaultNum
                  if (result > defaultNum) {
                    // 0부터 결과개수-1 만큼 삭제 후 갱신
                    docs.splice(0, result - 1)
                    this.$test.bulkDocs(docs).then(res => {
                      if (res.ok) {
                        console.log('Success history Remove => ', result - 1)
                      }
                    })
                  } else {
                    console.log('Non Removing. history size: ' + size)
                  }
                }
              })
          }
        }, 6 * 100000)
      }
    },
    beforeDestroy() {
      // this.$eventBus.$off("downloadStart");
    }
  }

</script>

<style scope>

  .position {
    position: absolute;
    bottom: 29px;
    right: 9px;
    width: 14px;
    z-index: 99999;
  }

  .tab-navi {
    border-top: 1px solid #000000;
    position: fixed;
    bottom: 0px;
    width: 100%;
    z-index: 1000;
  }

  .md-list-item {
    border-bottom: 1px solid #171e2d;
  }

  .md-tabs-navigation {
    background-color: #1d232f !important;
  }

  .md-tabs-navigation .md-button {
    float: left;
    display: block;
    width: 100%;
    color: #f2f2f2 !important;
    text-align: center;
    padding: 15px 19.4px;
    text-decoration: none;
    height: 42px !important;
    font-size: 11px !important;
    font-weight: 700;
  }

</style>
