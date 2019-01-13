/*--------------------------------------------------------------------------------------------- *
Licensed under the GPL-3.0 License. See License.txt in the project root for license information. *
You can not delete this comment when you deploy an application.
*--------------------------------------------------------------------------------------------*/ 'use
strict';

<template>
  <div>
    <el-dialog
      style="z-index:998 !important;"
      title="Social Share"
      :visible="isOpen"
      :before-close="closeModal"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="300px"
    >
      <div class="wrapper">
        <facebook class="padding-10 cursor" :url="url" scale="3" title="facebook"></facebook>
        <twitter class="padding-10 cursor" :url="url" title="twitter" scale="3"></twitter>
        <telegram class="padding-10 cursor" :url="url" title="telegram" scale="3"></telegram>
        <reddit class="padding-10 cursor" :url="url" title="reddit" scale="3"></reddit>
        <google class="padding-10 cursor" :url="url" title="google" scale="3"></google>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import StoreMixin from "@/components/Mixin/index"
import { Facebook, Twitter, Telegram, Reddit, Google } from "vue-socialmedia-share"
export default {
  name: "SocialShareModal",
  mixins: [StoreMixin],
  components: {
    Facebook,
    Twitter,
    Telegram,
    Reddit,
    Google
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    videoId: String
  },
  data() {
    return {
      url: `https://www.youtube.com/watch?v=${this.videoId}`
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal", false)
    }
  }
}
</script>

<style scoped>
.wrapper {
  text-align: center;
}
.padding-10 {
  padding: 2px;
}
.el-dialog,
.el-dialog__header {
  border-bottom: 1px solid #f1efef;
}
</style>
