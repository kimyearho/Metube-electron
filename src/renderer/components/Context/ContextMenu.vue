/*--------------------------------------------------------------------------------------------- *
Licensed under the GPL-3.0 License. See License.txt in the project root for license information. *
You can not delete this comment when you deploy an application.
*--------------------------------------------------------------------------------------------*/

<template>

  <div>
    <el-dialog class="contextModal"
               :visible="isShow"
               style="text-align:center;padding: 14px;"
               :show-close="false"
               :before-close="closeContextModal"
               :append-to-body="true">
      <el-row>
        <el-col>
          <md-button class="md-raised md-primary" style="width:100%" @click="addCollection">
            <i class="el-icon-plus"></i> Add to Collection
          </md-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <md-button class="md-raised" style="width:100%" @click="watchYoutube">
            <i class="el-icon-news"></i> Open Youtube
          </md-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <md-button class="md-raised" style="width:100%" @click="copyClipboard">
            <i class="el-icon-star-on"></i> Link Copy
          </md-button>
        </el-col>
      </el-row>
    </el-dialog>
    <registered-music-list ref="mycollectionList"
                           :isOpen="registerOpen"
                           :data="data"
                           @closeModal="closeModal"
                           @closeToCreateModal="closeToCreateOpenModal"
                           @reTryRegister="closeToRegisterOpenModal" />
  </div>

</template>

<script>

  import StoreMixin from '@/components/Commons/Mixin/index'
  import RegisteredMusicList from '@/components/PlayList/self/modal/RegisteredMusicList'
  export default {
    name: 'ContextMenu',
    mixins: [StoreMixin],
    components: {
      RegisteredMusicList
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      data: Object
    },
    data() {
      return {
        registerOpen: false,
        isSign: null,
        isCheck: false,
        isShare: false
      }
    },
    mounted() {
      this.isSign = this.getUserId()
    },
    methods: {
      closeToCreateOpenModal() {
        this.closeModal(false)
        this.$refs.mycollectionList.create()
      },
      closeToRegisterOpenModal() {
        this.registerOpen = true
      },
      closeContextModal() {
        this.$emit('close')
      },
      copyClipboard() {
        let link = `https://www.youtube.com/watch?v=${this.data.videoId}`
        let self = this
        this.$copyText(link).then(
          function(e) {
            self.closeContextModal()
            self.$message({
              showClose: true,
              message: self.$t('CONTEXT.MESSAGE.CLIPBOARD_SAVE'),
              type: 'success'
            })
          },
          function(e) {
            self.closeContextModal()
            self.$message({
              showClose: true,
              message: self.$t('CONTEXT.MESSAGE.CLIPBOARD_FAIL'),
              type: 'error'
            })
          }
        )
      },
      watchYoutube() {
        this.closeContextModal()
        if (this.data.videoId) {
          this.$ipcRenderer.send('button:watchYoutubePopup', `https://www.youtube.com/watch?v=${this.data.videoId}`)
        }
      },
      addCollection() {
        this.closeContextModal()
        if (this.isSign) {
          this.registerOpen = true
        } else {
          this.$modal.show('dialog', {
            title: 'Info',
            text: this.$t('COLLECTION.NO_LOGIN'),
            buttons: [
              {
                title: 'Close'
              }
            ]
          })
        }
      },
      closeModal(is) {
        this.registerOpen = is
      }
    }
  }

</script>

<style scoped>

  .wrapper {
    width: 320px;
    height: 42px;
  }

  .contextModal >>> .el-dialog {
    position: relative;
    margin-top: 35vh !important;
    margin: 0 auto 50px;
    background: #242d40de;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 340px !important;
  }

  .contextModal >>> .el-dialog__header {
    padding: 0px;
  }

  .el-mgn {
    margin-top: 8px;
    margin-left: 26px;
  }

  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 2px;
  }

  .close {
    width: 20px;
    position: absolute;
    right: 27px;
    top: 305px;
  }
  .contextMenu {
    width: 15px;
    height: 15px;
  }
  .bold {
    font-weight: 500;
  }

</style>
