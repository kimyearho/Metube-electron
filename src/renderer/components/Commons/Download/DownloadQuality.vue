<template>
  <div>
    <el-dialog
      class="dialog"
      title="Quality"
      width="90%"
      :visible="isOpen"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <div class="wrapper">
        <el-row>
          <el-col>
            <p>
              There is no difference in sound quality between high capacity and low capacity. <br/> If you want to store it as a sound recording, please select low capacity.
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              * HighestAudio: Only high quality sound is output. (Slow download speed)
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              * Highest: Includes high quality sound and video content.
            </p>
          </el-col>
        </el-row>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose"><i class="el-icon-close"></i> Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    isOpen: {
      type: Boolean
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
};
    </script>

<style scoped>
.dialog >>> .el-dialog {
  background: #242d40de;
}
.dialog >>> .el-dialog__title {
  color: #ffffff !important;
}
.dialog >>> .el-dialog__body {
  padding: 10px 20px;
}

.el-button {
  padding: 7px 15px;
}

.wrapper {
  max-height: 300px;
}

p {
  color: #ffffff;
}
</style>