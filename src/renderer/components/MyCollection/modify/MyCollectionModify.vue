/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <el-dialog
      title="Collection Edit"
      :visible="isOpen"
      :before-close="closeModal"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="300px"
      @open="get"
    >
      <el-form
        :model="form"
        ref="form"
        label-position="top"
        :rules="rules"
      >
        <el-form-item
          label="Collection name"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Category"
          :label-width="formLabelWidth"
          prop="category"
        >
          <el-select
            v-model="form.category"
            placeholder="Please select a category"
          >
            <el-option
              v-for="item in form.categories"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="closeModal"
        >Cancel</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="save"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import StoreMixin from "@/components/Commons/Mixin/index";
import CommonMixin from "@/components/Commons/Mixin/common";
import DataUtils from "@/components/Commons/Mixin/db";
export default {
  name: "MyCollectionModify",
  mixins: [StoreMixin, CommonMixin, DataUtils],
  props: {
    data: null,
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLabelWidth: "120px",
      rules: {
        name: [
          {
            required: true,
            message: "Please enter a collection name.",
            trigger: "change"
          }
        ],
        category: [
          {
            required: true,
            message: "Please select a collection category.",
            trigger: "change"
          }
        ]
      },
      form: {
        name: "",
        category: "",
        categories: [
          { label: "Film", value: "Film" },
          { label: "Vehicles", value: "Vehicles" },
          { label: "Music", value: "Music" },
          { label: "Radio", value: "Radio" },
          { label: "Rock", value: "Rock" },
          { label: "Anime", value: "Anime" },
          { label: "Gaming", value: "Gaming" },
          { label: "Classics", value: "Classics" },
          { label: "Electronic", value: "Electronic" },
          { label: "Movie", value: "Movie" },
          { label: "Piano", value: "Piano" },
          { label: "Sleep", value: "Sleep" },
          { label: "Epic", value: "Epic" },
          { label: "Pets", value: "Pets" },
          { label: "Entertainment", value: "Entertainment" },
          { label: "Travel", value: "Travel" },
          { label: "Comedy", value: "Comedy" },
          { label: "Trailers", value: "Trailers" },
          { label: "Shorts", value: "Shorts" },
          { label: "Action", value: "Action" }
        ]
      }
    };
  },
  methods: {
    get() {
      let user = this.getUserId();
      if (user) {
        this.createIndex(["type", "userId", "_id"])
          .then(() => {
            return this.$test
              .get(this.data._id)
              .then(result => {
                this.form.name = result.title;
                this.form.category = result.category;
              })
          })
      } else {
        // no login
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let user = this.getUserId();
          if (user) {
            this.data.title = this.form.name;
            this.data.category = this.form.category;
            this.$test.put(this.data).then(res => {
              if(res.ok) {
                this.$emit('is-success', true)
              }
            })
          }
        }
      });
    },
    closeModal() {
      this.$refs.form.resetFields();
      this.form.category = "";
      this.$emit("is-close", false);
    }
  }
};
</script>

<style scoped>
.el-dialog__body {
  padding: 10px 20px !important;
  color: #606266;
  font-size: 14px;
}
</style>
