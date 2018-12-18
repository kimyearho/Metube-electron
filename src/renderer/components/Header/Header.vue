<template>
  <div class="titlebar">
    <span class="notiButton">
      <!-- 페이지 검색 -->
      <img
        v-if="isShow"
        @click="showPageSearch"
        class="cursor"
        width="20"
        src="@/assets/images/svg/youtube-play-button.svg"
      >
    </span>
    <span class="logo" :class="{ dyLogo : !isShow }">M e T u b e</span>
    <span class="topButton">
      <div class="minimize cursor" @click="minimize" style="margin-right: 5px;" title="minimize"></div>
      <div class="close cursor" @click="close" title="exit"></div>
    </span>

    <!-- 유튜브 재생목록 링크 팝업 -->
    <modal
      name="input-focus-modal"
      :width="300"
      :height="150"
      :clickToClose="false"
      :adaptive="true"
    >
      <el-form ref="form" style="margin:5px;">
        <el-form-item label="Youtbue Playlist" class="linkform">
          <el-input v-model="linkForm" :autofocus="true" placeholder="Add a YouTube Playlist URL"/>
        </el-form-item>
        <el-form-item class="buttonform">
          <el-button type="primary" size="small" @click="apply">Apply</el-button>
          <el-button size="small" @click="closeModal">Close</el-button>
        </el-form-item>
      </el-form>
    </modal>
  </div>
</template>

<script>
import * as query from 'querystring'

export default {
  name: 'Header',
  data () {
    return {
      isCheck: false,
      playType: null,
      linkForm: null
    }
  },
  props: {
    data: {
      type: Object
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    if (this.data) {
      this.playType = this.data.playType
    }
  },
  methods: {
    topScroll () {
      if (this.playType) {
        this.$emit('scrollTop')
      }
    },
    showPageSearch () {
      this.$modal.show('input-focus-modal')
    },
    closeModal () {
      this.$modal.hide('input-focus-modal')
    },
    apply () {
      let parseURL
      let url = this.linkForm
      if (url) {
        // 실제 나의 재생목록 URL일 경우
        if (url.indexOf('playlist') > -1) {
          parseURL = query.parse(url, '?')
        } else {
          parseURL = query.parse(url)
        }
        if (parseURL) {
          let playlistId = parseURL.list
          if (playlistId) {
            this.$router.push({
              name: 'NOT-PLAYING-PLAYLIST',
              params: {
                playType: 'play',
                id: playlistId
              }
            })
            if (this.$route.name === 'NOT-PLAYING-PLAYLIST') {
              this.$emit('reloadMusicList')
            }
            this.linkForm = ''
            this.closeModal()
          } else {
            this.errorDialog()
          }
        }
      } else {
        this.errorDialog()
      }
    },
    minimize () {
      this.$ipcRenderer.send('button:minimize', null)
    },
    close () {
      this.$ipcRenderer.send('button:close', null)
    },
    errorDialog () {
      this.$modal.show('dialog', {
        title: 'Error',
        text: 'The URL you entered is invalid.',
        buttons: [
          {
            title: 'Close'
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.logo {
  padding-left: 40px !important;
}

.dyLogo {
  padding-left: 60px !important;
}

.titlebar {
  -webkit-app-region: drag;
  padding: 7px;
  color: #ffffff;
  font-weight: 700;
  text-align: center;
  border-bottom: 1px solid #232323;
  z-index: 101;
}

.notiButton {
  -webkit-app-region: no-drag;
  float: left;
}

.topButton {
  -webkit-app-region: no-drag;
  float: right;
}

.topButton img {
  vertical-align: middle;
}

.linkform {
  padding: 0px 5px 0px 5px;
  margin-bottom: 12px;
}

.buttonform {
  padding: 0px 5px 0px 5px;
  text-align: center;
}

.close {
  background: #ff5c5c;
  font-size: 9pt;
  width: 11px;
  height: 11px;
  border: 1px solid #e33e41;
  border-radius: 50%;
  display: inline-block;
}

.minimize {
  background: #ffbd4c;
  font-size: 9pt;
  line-height: 16px;
  margin-left: 15px;
  margin-right: 5px;
  width: 11px;
  height: 11px;
  border: 1px solid #e09e3e;
  border-radius: 50%;
  display: inline-block;
}
</style>
