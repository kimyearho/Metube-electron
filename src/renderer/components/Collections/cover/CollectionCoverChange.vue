/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <modal name="modal" :width="300" :height="150" :clickToClose="false" :adaptive="true">
      <el-form ref="form" style="margin:5px;">
        <el-form-item label="Change Cover Thumbnail" class="linkform">
          <el-input
            v-model="linkForm"
            :autofocus="true"
            placeholder="Please enter a URL to change"
          />
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
import StoreMixin from '@/components/Mixin/index'
import CommonMixin from '@/components/Mixin/common'
export default {
  name: 'CollectionCoverChange',
  mixins: [StoreMixin, CommonMixin],
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      linkForm: null
    }
  },
  methods: {
    showModal () {
      this.$modal.show('modal')
    },
    closeModal () {
      this.$modal.hide('modal')
    },
    apply () {
      let self = this
      let url = self.linkForm
      if (url) {
        let img = new Image()
        img.src = url

        // this가 사용되지 않으므로 임시적으로 self로 대체
        img.onload = function () {
          self.CollectionCoverChange(url)
        }
        img.onerror = function () {
          self.messageDialog('Error', self.$t('COMMONS.DIALOG.ERROR_URL'))
        }

        self.linkForm = ''
      } else {
        self.messageDialog('Info', self.$t('COMMONS.DIALOG.BLANK_FORM'))
      }
    },
    CollectionCoverChange (img) {
      this.$local
        .find({
          selector: {
            type: 'profile',
            userId: this.getUserId()
          }
        })
        .then(result => {
          let docs = result.docs[0]
          let key = docs._id
          if (key) {
            this.$local.get(key).then(doc => {
              // TODO: MY-COLLECTION 구분
              if (this.data.category) {
                this.$lodash.forEach(doc.playlists, item => {
                  if (item._key === this.data._key) {
                    item.thumbnails = img
                  }
                })
              } else {
                this.$lodash.forEach(doc.collections, item => {
                  if (item.playlistId === this.data.playlistId) {
                    item.thumbnails = img
                  }
                })
              }
              return this.$local.put(doc).then(res => {
                if (res.ok) {
                  if (this.data.category) {
                    this.$emit('is-success', {
                      playType: 'my-collection'
                    })
                  } else {
                    this.$emit('is-success', {
                      playType: this.data.playType
                    })
                  }
                  this.closeModal()
                }
              })
            })
          }
        })
    }
  }
}
</script>

<style scoped>
.linkform {
  padding: 0px 5px 0px 5px;
  margin-bottom: 12px;
}

.buttonform {
  padding: 0px 5px 0px 5px;
  text-align: center;
}
</style>
