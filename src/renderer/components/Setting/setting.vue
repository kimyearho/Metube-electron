/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

<template>
  <div>
    <top-header />
    <div class="wrapper" :class="{ updateHeight: isCheck }">
      <form>
        <div class="menu1">
          <label class="wh">
            <strong v-html="$tc('SETTING.MENU.PLAYER_HIDE')"></strong>
          </label>
          <toggle-button
            v-model="state"
            :width="60"
            :height="20"
            :sync="true"
            style="float:right;"
            color="#82C7EB"
            :labels="{checked: 'On', unchecked: 'Off'}"
            @change="onChangeEventPlayerHide"
          />
        </div>
        <div class="menu1_tip">
          <strong class="gr">{{ $t('SETTING.PLAYER_HIDE') }}</strong>
        </div>
        <div class="menu1">
          <label class="wh">
            <strong>{{ $t('SETTING.MENU.ALWAYS_TOP') }}</strong>
          </label>
          <toggle-button
            v-model="top_state"
            :width="60"
            :height="20"
            :sync="true"
            style="float:right;"
            color="#82C7EB"
            :labels="{checked: 'On', unchecked: 'Off'}"
            @change="onChangeEventTop"
          />
        </div>
        <div class="menu1_tip">
          <strong class="tr">{{ $t('SETTING.ALWAYS_TOP') }}</strong>
        </div>
        <div class="menu1">
          <label class="wh">
            <strong>Snow</strong>
          </label>
          <toggle-button
            v-model="snow_state"
            :width="60"
            :height="20"
            :sync="true"
            style="float:right;"
            color="#82C7EB"
            :labels="{checked: 'On', unchecked: 'Off'}"
            @change="onChangeEventSnow"
          />
        </div>
        <div class="menu1_tip">
          <strong class="tr">Snow theme for winter</strong>
        </div>
        <div class="menu1">
          <label class="wh">
            <strong>{{ $t('SETTING.MENU.LOCALE') }}</strong>
          </label>
          <el-select
            v-model="locale"
            :size="`mini`"
            placeholder="Select"
            style="width:100px;float:right;"
          >
            <el-option
              v-for="item in localeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="menu1_tip">
          <strong class="tr">{{ $t('SETTING.LOCALE') }}</strong>
        </div>
        <hr>
        <div class="menu1">
          <label class="wh">
            <strong>{{ $t('SETTING.MENU.VERSION') }}</strong>
          </label>
        </div>
        <div class="menu1_tip">
          <strong
            class="tr"
            style="color: #ffeb3b;"
          >
            {{ $version }}
            <br>
          </strong>
        </div>
        <div class="menu1">
          <label class="wh">
            <strong>{{ $t('SETTING.MENU.RELEASE') }}</strong>
          </label>
        </div>
        <div class="menu1_tip">
          <strong
            class="tr"
            :class="{ gr: isCheck }"
          >{{ releaseMessage }}</strong>
          <div
            style="margin-top: 10px;"
            v-if="isCheck"
          >
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="openGit"
            >Download</el-button>
          </div>
        </div>
      </form>
    </div>
    <sub-player-bar
      class="md-top-61"
      v-show="isMini"
    />
  </div>
</template>

<script>
import SubPlayerBar from '@/components/PlayerBar/SubPlayerBar'
import StoreMixin from '@/components/Mixin/index'

export default {
  name: 'SettingPage',
  mixins: [StoreMixin],
  components: {
    SubPlayerBar
  },
  data() {
    return {
      state: false,
      top_state: false,
      selected: false,
      snow_state: false,
      isMini: false,
      isCheck: false,
      locale: null,
      localeOptions: [
        {
          value: 'en',
          label: 'English'
        },
        {
          value: 'ko',
          label: '한국어'
        }
      ],
      releaseMessage: ''
    }
  },
  created() {
    // 플레이어 숨김 상태 옵션
    this.state = this.getState()

    // 항상 위 상태 옵션
    this.top_state = this.getAlwaysTop()

    // 언어 설정 옵션
    this.locale = this.getLocale()

    // 버전 체크
    this.isCheck = this.getVersionCheck()

    this.snow_state = this.getSnow()

    if (this.isCheck) {
      this.releaseMessage = this.$t('SETTING.NEW_RELEASE')
    } else {
      this.releaseMessage = this.$t('SETTING.RELEASE')
    }
    let musicInfo = this.getMusicInfos()
    if (musicInfo) {
      this.isMini = true
    }
  },
  watch: {
    locale(v) {
      this.$store.commit('setLocale', v)
      this.$i18n.locale = v
      // this.releaseMessage = this.$t("SETTING.RELEASE");
    }
  },
  methods: {
    openGit() {
      this.$ipcRenderer.send('showGit', {})
    },
    onChangeEventPlayerHide(event) {
      if (event.value) {
        this.$store.commit('setPlayerHideOption', true)
        this.$ipcRenderer.send('isPlayer', true)
      } else {
        this.$store.commit('setPlayerHideOption', false)
        this.$ipcRenderer.send('isPlayer', false)
      }
    },
    onChangeEventTop(event) {
      if (event.value) {
        this.$store.commit('setAlwaysTopOption', true)
        this.$ipcRenderer.send('option:alwaystop', true)
      } else {
        this.$store.commit('setAlwaysTopOption', false)
        this.$ipcRenderer.send('option:alwaystop', false)
      }
    },
    onChangeEventSnow(event) {
      this.$eventBus.$emit('test')
      if (event.value) {
        this.$eventBus.$emit('showSnow', true)
        this.$store.commit('setSnow', true)
      } else {
        this.$eventBus.$emit('showSnow', false)
        this.$store.commit('setSnow', false)
      }
    },
    onNewReleaseCheck() {
      if (this.isCheck) {
        this.releaseMessage = this.$t('SETTING.NEW_RELEASE')
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
  margin: 5px;
  height: 510px;
}

.updateHeight {
  height: 480px;
  overflow-y: scroll;
}

.header {
  margin-left: 10px;
  margin-bottom: 30px;
}

.menuName {
  color: #ffffff;
}

.menu1 {
  margin: 21px 10px 0px 10px;
}

.wh {
  color: #ffffff;
}

.tr {
  color: #2196f3;
}

.gr {
  color: #d85f5f;
}

.menu1_tip {
  margin-left: 10px;
  margin-top: 7px;
}

hr {
  margin: 20px 10px 0px 10px;
}

.md-top-61 {
  margin-top: 61px;
}
</style>
