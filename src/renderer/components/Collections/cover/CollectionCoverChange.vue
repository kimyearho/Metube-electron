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
    CollectionCoverChange (url) {
      this.$test.get(this.data._id).then(doc => {
        doc.thumbnails = url;
        return this.$test.put(doc).then(result => {
          if(result.ok) {
            this.$emit('is-success', {
              playType: this.data.playType
            })
          }
          this.closeModal()
        })
      });
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
