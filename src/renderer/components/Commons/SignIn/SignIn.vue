/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header
      ref="header"
      :isMenu="true"
      :isShow="false"
      :data="{ playType: 'list' }"
    />
    <div class="wrapper">
      <div class="contents">
        <div class="cover">
          <img
            width="190"
            v-if="!isSignin"
            src="@/assets/images/logo.jpg"
          >
          <div v-if="isSignin">
            <div class="picture">
              <img
                class="userPicture"
                width="100"
                :src="profileData.googlePicture"
              >
            </div>
            <div class="userName">{{ profileData.googleName }}</div>
          </div>
        </div>
        <div
          class="signin"
          :class="{ signout: isSignin }"
        >

          <button
            type="button"
            v-if="!isSignin"
            class="google-button cursor"
            @click="signin"
          >
            <span class="google-button__icon">
              <svg
                viewBox="0 0 366 372"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z"
                  id="Shape"
                  fill="#EA4335"
                />
                <path
                  d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z"
                  id="Shape"
                  fill="#FBBC05"
                />
                <path
                  d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z"
                  id="Shape"
                  fill="#4285F4"
                />
                <path
                  d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z"
                  fill="#34A853"
                /></svg>
            </span>
            <span class="google-button__text">Sign in with Google</span>
          </button>

          <md-button
            v-else
            class="cursor md-raised md-accent"
            style="width: 120px;"
            @click="signout"
          >{{ $t('SIGN.SIGN_OUT') }}</md-button>
        </div>
        <div class="menu1">
          <label class="gr">
            <strong>{{ $t('SIGN.NOTICE') }}</strong>
          </label>
        </div>
        <div class="description">
          <strong
            class="gr"
            style="color:#ff1744;"
            v-if="!isSignin"
          >{{ $t('SIGN.NO_LOGIN_NOTICE') }}</strong>
          <strong
            class="gr"
            v-if="isSignin"
          >{{ $t('SIGN.YES_LOGIN_NOTICE') }}</strong>
        </div>
      </div>
    </div>
    <!-- 서브 플레이어 컴포넌트 -->
    <sub-player-bar
      class="md-top-61"
      v-show="isMini"
    />
  </div>
</template>

<script>
import SubPlayerBar from "@/components/PlayerBar/SubPlayerBar";
import StoreMixin from "@/components/Commons/Mixin/index";
import CommonMixin from "@/components/Commons/Mixin/common";

export default {
  name: "SignInPage",
  mixins: [StoreMixin, CommonMixin],
  components: {
    SubPlayerBar
  },
  data() {
    return {
      isSignin: false,
      isMini: false,
      profileData: null,
      playlistCount: 0,
      channelCount: 0
    };
  },
  created() {
    this.isMini = this.getMusicInfos() ? true : false;
    this.$ipcRenderer.on("render:googleAuth", (e, args) => {
      if (args.resultCode === 200) {
        this.$store.commit("setGoogleProfile", JSON.parse(args.body));
        this.success();
      }
    });
  },
  mounted() {
    if (this.getUserId()) {
      this.isSignin = true;
      this.profileData = this.getProfile();
    }
  },
  methods: {
    signin() {
      this.$ipcRenderer.send("main:googleAuth", null);
    },
    signout() {
      this.isSignin = false;
      this.$refs.header.reloadUser();
      this.$store.commit("setGoogleProfile", null);
    },
    success() {
      this.isSignin = true;
      this.profileData = this.getProfile();
      if (this.profileData) {
        // 프로필 정보를 받았으면 로그인정보로 프로필이 등록되어있는지 조회한다.
        this.$test
          .find({
            selector: {
              type: "profile",
              userId: this.getUserId()
            },
            fields: ["_id", "collections"]
          })
          .then(result => {
            let docs = result.docs[0];
            // 프로필이 없으면 새로 프로필을 등록한다
            if (!docs) {
              let data = {
                type: "profile",
                userId: this.getUserId(),
                keywords: [],
                setting: [],
                collections: []
              };
              this.$test.post(data);
            }

            this.$message({
              message: 'Login Success.',
              type: 'success'
            });

            this.$refs.header.reloadUser();
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style scoped>
.cover {
  margin-top: 40px;
  text-align: center;
}

.body {
  text-align: center;
  color: #ffffff;
  font-weight: 700;
}

.signin {
  text-align: center;
  margin-top: 20px;
}

.signout {
  text-align: center;
  margin-top: 40px;
}

.gr {
  color: #ffffff;
}

.description {
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 20px;
}

.menu1 {
  margin-top: 70px;
  font-size: 20px;
  margin-left: 30px;
}

.userPicture {
  border-radius: 50px;
}

.userName {
  margin-top: 15px;
  color: #ffffff;
  font-size: 20px;
}

.google-button {
  height: 40px;
  border-width: 0;
  background: white;
  color: #737373;
  border-radius: 5px;
  white-space: nowrap;
  box-shadow: 1px 1px 0px 1px rgba(0, 0, 0, 0.05);
  transition-property: background-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
  padding: 0;
}
.google-button:focus,
.google-button:hover {
  box-shadow: 1px 4px 5px 1px rgba(0, 0, 0, 0.1);
}
.google-button:active {
  background-color: #e5e5e5;
  box-shadow: none;
  transition-duration: 10ms;
}

.google-button__icon {
  display: inline-block;
  vertical-align: middle;
  margin: 8px 0 8px 8px;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
}

.google-button__icon--plus {
  width: 27px;
}

.google-button__text {
  display: inline-block;
  vertical-align: middle;
  padding: 0 24px;
  font-size: 14px;
  font-weight: bold;
  font-family: "Roboto", arial, sans-serif;
}

</style>
