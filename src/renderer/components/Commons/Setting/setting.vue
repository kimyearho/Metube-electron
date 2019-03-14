/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

<template>
  <div>
    <top-header :isShow="false"/>
    <div class="wrapper" :class="{ updateHeight: isCheck }">
      <form>
        <div class="menu1">
          <label class="wh">
            <strong v-html="$tc('SETTING.MENU.PLAYER_HIDE')"></strong>
          </label>
          <md-switch v-model="state" class="switchStyle"/>
        </div>
        <div class="menu1_tip">
          <strong class="gr">{{ $t('SETTING.PLAYER_HIDE') }}</strong>
        </div>
        <div class="menu1">
          <label class="wh">
            <strong>{{ $t('SETTING.MENU.ALWAYS_TOP') }}</strong>
          </label>
          <md-switch v-model="topState" class="switchStyle md-primary"/>
        </div>
        <div class="menu1_tip">
          <strong class="tr">{{ $t('SETTING.ALWAYS_TOP') }}</strong>
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
          <strong class="tr" style="color: #ffeb3b;">
            {{ $version }}
            <br>
          </strong>
        </div>
      </form>
    </div>
    <sub-player-bar class="md-top-61" v-show="isMini"/>
  </div>
</template>

<script>
import SubPlayerBar from "@/components/PlayerBar/SubPlayerBar";
import StoreMixin from "@/components/Commons/Mixin/index";

export default {
  name: "SettingPage",
  mixins: [StoreMixin],
  components: {
    SubPlayerBar
  },
  data() {
    return {
      state: false,
      topState: false,
      selected: false,
      isMini: false,
      isCheck: false,
      locale: this.getLocale(),
      novalue: null,
      localeOptions: [
        {
          value: "en-US",
          label: "English"
        },
        {
          value: "ko",
          label: "한국어"
        }
      ],
      releaseMessage: ""
    };
  },
  created() {
    this.isMini = this.getMusicInfos() ? true : false;

    // 플레이어 숨김 상태 옵션
    this.state = this.getState();

    // 항상 위 상태 옵션
    this.topState = this.getAlwaysTop();

    // 언어 설정 옵션
    this.locale = this.getLocale();

    // 버전 체크
    this.isCheck = this.getVersionCheck();
  },
  watch: {
    locale(v) {
      this.$store.commit("setLocale", v);
      this.$i18n.locale = v;
    },
    state(v) {
      this.$store.commit("setPlayerHideOption", v);
      this.$ipcRenderer.send("isPlayer", v);
    },
    topState(v) {
      this.$store.commit("setAlwaysTopOption", v);
      this.$ipcRenderer.send("option:alwaystop", v);
    }
  },
  methods: {
    openGit() {
      this.$ipcRenderer.send("showGit", {});
    },
    onNewReleaseCheck() {
      if (this.isCheck) {
      }
    }
  }
};
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

.switchStyle {
  float: right;
  margin: 0;
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
