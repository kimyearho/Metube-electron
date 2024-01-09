/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>

  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header ref="header"
                :isMenu="true"
                :isShow="false"
                :data="{ playType: 'list' }" />
    <div class="wrapper">
      <el-row>
        <el-col>
          <div class="menu1_tip">
            <div>
              <img width="20"
                   style="margin-bottom: 10px;"
                   src="@/assets/images/svg/playlist.svg">
              <span class="collections">Sign in</span>
            </div>
            <strong class="tr"
                    style="font-size:11px;">Please sign in or register to use more features.</strong>
          </div>
        </el-col>
      </el-row>

      <el-form v-if="!isUser"
               ref="ruleForm"
               :model="form"
               :rules="rules"
               v-loading="formLoading"
               element-loading-text="Loading..."
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)"
               class="form"
               label-position="top"
               label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item class="form-item"
                          label="Email"
                          prop="email">
              <el-input v-model="form.email"
                        class="form-input"
                        placeholder="Enter your email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item class="form-item"
                          label="User code"
                          prop="userCode">
              <el-input v-model="form.userCode"
                        type="text"
                        maxlength="6"
                        class="form-input"
                        placeholder="Enter your user code (6 digits)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-top: 15px;">
          <el-col :span="24">
            <md-button class="md-raised md-primary btn"
                       @click="signin">
              <i class="el-icon-download"></i> Sign in
            </md-button>
          </el-col>
          <el-col style="margin-top:10px;">
            <strong class="tr"
                    style="font-size:11px;">
                Please sign in or register to use more features.
                <a
                  class="cursor"
                  @click="reoute('signup')"
                >Click Sign up</a>
              </strong>
          </el-col>
        </el-row>
      </el-form>

      <el-form v-if="isUser"
               ref="userForm"
               class="form"
               v-loading="formLoading2"
               element-loading-text="Loading..."
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)"
               label-position="top"
               label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item class="form-item"
                          style="color:#FFF;">
              <div class="profile">
                <img width="100"
                     :src="isUser.avatar">
              </div>
              <div class="profile">
                <strong style="font-size: 25px;">{{ isUser.name }}</strong>
              </div>
              <div class="profile">
                <md-button class="md-raised md-default"
                           @click="signout">Sign out</md-button>
              </div>
            </el-form-item>
            <!-- <el-form-item class="form-item" style="color:#FFF;">
              </el-form-item>-->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 서브 플레이어 컴포넌트 -->
    <sub-player-bar class="md-top-61"
                    v-show="isMini" />
  </div>

</template>

<script>

  import SubPlayerBar from '@/components/PlayerBar/SubPlayerBar'
  import StoreMixin from '@/components/Commons/Mixin/index'
  import CommonMixin from '@/components/Commons/Mixin/common'

  import jwt from 'jsonwebtoken'
  import { decode } from 'punycode'
  import { resolve } from 'dns'

  const form = {
    email: '',
    userCode: ''
  }

  export default {
    name: 'SignInPage',
    mixins: [StoreMixin, CommonMixin],
    components: {
      SubPlayerBar
    },
    data() {
      return {
        isMini: false,
        isUser: null,
        profileData: null,
        playlistCount: 0,
        channelCount: 0,
        formLoading: false,
        formLoading2: false,
        form: Object.assign({}, form),
        rules: {
          email: [
            {
              required: true,
              message: 'Please enter a your email.',
              trigger: 'change'
            }
          ],
          userCode: [
            {
              required: true,
              message: 'Please enter a user code.',
              trigger: 'change'
            }
          ]
        }
      }
    },
    created() {
      this.isMini = this.getMusicInfos() ? true : false
      this.isUser = this.getUser()
    },
    methods: {
      signin() {
        this.$refs.ruleForm.validate(valid => {
          if (!valid) return
          this.formLoading = true
          this.$user
            .allDocs({
              include_docs: true
            })
            .then(docs => {
              // 등록 된 사용자 정보를 모두 가져온다.
              const rows = docs.rows
              this.$lodash.forEach(rows, (item, index) => {
                let doc = item.doc
                // 사용자 정보의 토큰을 하나씩 복호화한다.
                let decoded = jwt.verify(doc.userToken, 'metubev2')
                // 복호화 된 이메일정보와 현재 등록하고자 하는 이메일이 동일한지 체크한다.
                if (decoded.email === this.form.email.trim() && decoded.userCode === this.form.userCode.trim()) {
                  const data = {
                    id: doc._id,
                    name: decoded.userName,
                    avatar: decoded.avatar,
                    created: decoded.created
                  }

                  this.$store.dispatch('setAuthUser', { vm: this, userData: data }).then(() => {
                    // 로그인 성공
                    setTimeout(() => {
                      this.$message({
                        type: 'success',
                        message: 'log-in succeed'
                      })
                      this.$refs.ruleForm.resetFields()
                      this.isUser = this.$sessionStorage.get('user')
                      this.formLoading = false
                    }, 1000)
                  })
                  return false
                }
                // 반복의 마지막
                if (index === rows.length - 1) {
                  this.formLoading = false
                  this.$refs.ruleForm.resetFields()
                  // 일치하는 사용자가 없음
                  this.$message({
                    type: 'error',
                    message: 'Login fail'
                  })
                }
              })
            })
        })
      },

      signout() {
        // 재생중
        if (this.isMini) {
          const musicInfo = this.getMusicInfos()
          if (musicInfo.type === 'mycollectionItem') {
            // 내 컬렉션 음악이 재생중임.
            this.$modal.show('dialog', {
              title: 'Info',
              text:
                'The videos in my collection are currently playing. Sign out and video playback will end. Do you want to proceed?',
              buttons: [
                {
                  title: 'Yes',
                  handler: () => {
                    this.formLoading2 = true
                    this.$ipcRenderer.send('win2Player', ['pauseVideo'])
                    this.$store.commit('setPlayingMusicInfo', null)
                    this.isMini = false
                    this.$modal.hide('dialog')
                    setTimeout(() => {
                      this.signoutSuccess()
                    }, 1500)
                  }
                },
                {
                  title: 'Close'
                }
              ]
            })
          } else {
            this.signoutSuccess()
          }
        } else {
          this.signoutSuccess()
        }
      },

      signoutSuccess() {
        this.formLoading2 = true
        this.$sessionStorage.remove('user')
        this.$store.commit('setSignout', null)
        setTimeout(() => {
          this.isUser = null
          this.formLoading2 = false
        }, 1000)
      },

      reoute(path) {
        this.$router.push({
          name: 'signup'
        })
      }
    }
  }

</script>

<style scoped>

  .body {
    text-align: center;
    color: #ffffff;
    font-weight: 700;
  }

  .form {
    margin-top: 15px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .form-item >>> .el-form-item__label {
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
  }

  .form-item >>> .el-input__inner {
    color: #ffffff;
    background-color: #242d40;
    border-radius: 2px;
    border: 1px solid #dcdfe6a8;
  }

  .btn {
    width: 100%;
    margin: 0;
  }

  .line {
    margin-top: 30px;
    width: 100px;
  }

  .description {
    margin-top: 10px;
    color: #ffeb3b;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 700;
  }

  .profile {
    margin-top: 20px;
    text-align: center;
  }

</style>
