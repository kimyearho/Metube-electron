/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <el-dialog
      title="Create Collection"
      :visible="isOpen"
      :before-close="closeModal"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="300px"
    >
      <el-form :model="form" ref="form" label-position="top" :rules="rules">
        <el-form-item label="Collection name" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Category" :label-width="formLabelWidth">
          <el-select v-model="form.category" placeholder="Please select a category">
            <el-option
              v-for="item in form.categories"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeModal">Cancel</el-button>
        <el-button type="primary" size="mini" @click="save">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import StoreMixin from "@/components/Commons/Mixin/index";
import CommonMixin from "@/components/Commons/Mixin/common";
export default {
  name: "MyCollectionCreate",
  mixins: [StoreMixin, CommonMixin],
  props: {
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
        ]
        // category: [
        //   {
        //     required: true,
        //     message: "Please select a collection category.",
        //     trigger: "change"
        //   }
        // ]
      },
      form: {
        name: "",
        category: "",
        categories: [
          { label: "default", value: "default" },
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
          { label: "Travel", value: "Travel" },
          { label: "Action", value: "Action" }
        ]
      }
    };
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const myCollection = {
            title: this.form.name,
            userId: this.getUserId(),
            type: "mycollection",
            category:
              this.form.category !== "" ? this.form.category : "default",
            thumbnails:
              "http://smeaker.com/wp-content/uploads/2017/03/Nonton-Video-YouTube-Gratis-Hanya-Bisa-pada-Waktu-Tengah-Malam-Kenapa.jpg",
            creates: this.$moment().format("YYYYMMDDHHmmss"),
            created: this.$moment().format("YYYY-MM-DD HH:mm:ss")
          };
          this.$test.post(myCollection).then(result => {
            if (result.ok) {
              const storeInitItem = {
                list: [],
                listCount: 0,
                id: result.id
              };
              this.$test
                .find({
                  selector: {
                    type: "profile",
                    userId: this.getUserId()
                  }
                })
                .then(result => {
                  let docs = result.docs[0];
                  if (docs) {
                    docs.collections.push(storeInitItem);
                    this.$test.put(docs).then(result => {
                      if (result.ok) {
                        this.getLog("db store collection create success!", {});
                      }
                    });
                  }
                  this.$refs.form.resetFields();
                  this.$emit("is-success", true);
                });
            }
          });
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
