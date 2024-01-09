/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>

  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header ref="header" :isMenu="true" :isShow="false" :data="{ playType: 'list' }" />
    <div class="wrapper">
      <el-row>
        <el-col>
          <div class="menu1_tip">
            <div>
              <img width="20" style="margin-bottom: 10px;" src="@/assets/images/svg/playlist.svg">
              <span class="collections">Sign up</span>
            </div>
            <strong class="tr"
                    style="font-size:11px;">Please log in or register to use more features.</strong>
          </div>
        </el-col>
      </el-row>

      <el-form ref="ruleForm"
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
            <el-form-item class="form-item" label="Email" prop="email">
              <el-input v-model="form.email"
                        class="form-input"
                        placeholder="Enter your email (ex: example@mail.com)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item class="form-item" label="User code" prop="userCode">
              <el-input v-model="form.userCode"
                        maxlength="6"
                        class="form-input"
                        placeholder="Enter your user code (0 ~ 9 / 6 digits)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item class="form-item" label="User name" prop="userName">
              <el-input v-model="form.userName"
                        class="form-input"
                        maxlength="20"
                        placeholder="Enter your username"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-top: 15px;text-align: center;">
          <el-col :span="12">
            <md-button class="md-raised md-primary btn" @click="signup">
              <i class="el-icon-upload2"></i> Sign up
            </md-button>
          </el-col>
          <el-col :span="12">
            <md-button class="md-raised md-default btn" @click="back">
              <i class="el-icon-back"></i> Back
            </md-button>
          </el-col>
        </el-row>

        <el-row style="text-align: center;">
          <el-col class="description" :span="24">
            <p>- All user information is encrypted.</p>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 서브 플레이어 컴포넌트 -->
    <sub-player-bar class="md-top-61" v-show="isMini" />
  </div>

</template>

<script>

  import SubPlayerBar from '@/components/PlayerBar/SubPlayerBar'
  import StoreMixin from '@/components/Commons/Mixin/index'
  import CommonMixin from '@/components/Commons/Mixin/common'
  import RegExMixin from '@/components/Commons/Mixin/regex'

  import jwt from 'jsonwebtoken'

  const form = {
    email: '',
    userCode: '',
    userName: '',
    avatar:
      'https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1'
  }

  export default {
    name: 'SignInPage',
    mixins: [StoreMixin, CommonMixin, RegExMixin],
    components: {
      SubPlayerBar
    },
    data() {
      return {
        isSignin: false,
        isMini: false,
        profileData: null,
        playlistCount: 0,
        channelCount: 0,
        formLoading: false,
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
          ],
          userName: [
            {
              required: true,
              message: 'Please enter a user name.',
              trigger: 'change'
            }
          ]
        }
      }
    },
    created() {
      this.isMini = this.getMusicInfos() ? true : false
    },
    methods: {
      signup() {
        this.$refs.ruleForm.validate(valid => {
          if (!valid) return

          const emailCheck = this.regex('email', this.form.email)
          const userCodeCheck = this.regex('usercode', this.form.userCode)
          const userNameCheck = this.regex('username', this.form.userName)
          if (!emailCheck) {
            this.$message({
              type: 'error',
              message: 'Email format is invalid.'
            })
            return false
          }

          if (!userCodeCheck) {
            this.$message({
              type: 'error',
              message: 'Invalid user code format.'
            })
            return false
          }

          if (userNameCheck) {
            this.$message({
              type: 'error',
              message: 'Invalid username format'
            })
            return false
          }

          this.formLoading = true
          this.$user
            .allDocs({
              include_docs: true
            })
            .then(docs => {
              // 등록 된 사용자 정보를 모두 가져온다.
              const rows = docs.rows
              if (rows.length > 0) {
                this.$lodash.forEach(rows, (item, index) => {
                  let doc = item.doc
                  // 사용자 정보의 토큰을 하나씩 복호화한다.
                  let decoded = jwt.verify(doc.userToken, 'metubev2')
                  // 복호화 된 이메일정보와 현재 등록하고자 하는 이메일이 동일한지 체크한다.
                  if (decoded.email === this.form.email) {
                    this.formLoading = false
                    this.$message({
                      type: 'error',
                      message: 'Already registered email.'
                    })
                    return false
                  }
                  // 반복의 마지막
                  if (index === rows.length - 1) {
                    // 사용자를 등록한다
                    this.register()
                  }
                })
              } else {
                this.register()
              }
            })
        })
      },

      // 등록처리
      register() {
        const token = jwt.sign(
          {
            email: this.form.email,
            userCode: this.form.userCode,
            userName: this.form.userName,
            avatar: this.form.avatar,
            created: this.$moment().format('YYYY-MM-DD HH:mm:ss')
          },
          'metubev2'
        )
        const encryptUser = {
          userToken: token
        }
        this.$user.post(encryptUser).then(res => {
          if (res.ok) {
            const data = {
              type: 'profile',
              userId: res.id,
              keywords: [],
              setting: [],
              collections: []
            }
            this.$test.post(data).then(result => {
              this.formLoading = false
              this.$message({
                type: 'success',
                message: 'Registration is complete! Sign in again'
              })
              this.$refs.ruleForm.resetFields()
              this.back()
            })
          }
        })
      },

      back() {
        this.$router.push({
          name: 'login'
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
    width: 90%;
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

</style>
