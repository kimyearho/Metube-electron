<template>
  <div>
    <el-dialog
      class="dialog"
      title="Help"
      width="90%"
      :visible="isOpen"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <div class="wrapper">
        <el-row>
          <el-col>
            <p>
              # The download feature is currently in beta. Therefore, we are pleased to inform you that there may be some errors. The following describes the errors that may occur.
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              0. Currently only supported by my collection.
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              1. 403 error
              - There is no solution. Please try again later.
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              2. Too Many Redirect
              - This is an error that occurs when youtube module receives an error and makes a lot of retries. The error can be downloaded normally if you try again.
            </p>
          </el-col>
        </el-row>
          <el-col>
            <p>
              3. Please use English only when specifying folder.
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              4. It is downloaded in .mp4 format by default.
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              5. mp3 conversion function is not supported at present.
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              # Convenience will be improved with future updates. Please give feedback if you have a good idea.
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              # Using open source modules, download errors are difficult to respond quickly.
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p>
              # When the download list is complete, the existing download list will be initialized when you add a new video.
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
  overflow-y: scroll;
  max-height: 300px;
}

.wrapper::-webkit-scrollbar {
  width: 7px;
}

.wrapper::-webkit-scrollbar-track {
  background: #1d232f;
}

.wrapper::-webkit-scrollbar-thumb {
  background: #ffffff;
}

p {
  color: #ffffff;
}
</style>