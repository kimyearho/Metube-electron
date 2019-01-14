/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>
  <div>
    <el-dialog
      title="MY COLLECTION"
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
        <el-form-item label="Category" :label-width="formLabelWidth" prop="category">
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
import StoreMixin from "@/components/Mixin/index";
import CommonMixin from "@/components/Mixin/common";
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
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const myCollection = {
            _key: this.getCollectionKey(),
            title: this.form.name,
            category: this.form.category,
            thumbnails:
              "http://www.groovelily.com/wp-content/uploads/2017/11/3.jpg",
            creates: this.$moment().format("YYYYMMDDHHmmss"),
            created: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
            tracks: []
          };
          this.$local
            .find({
              selector: {
                type: "profile",
                userId: this.getUserId()
              }
            })
            .then(result => {
              let docs = result.docs[0];
              if (docs) {
                // collection max
                if (docs.playlists.length >= 7) {
                  alert(
                    "You can not create more than the maximum number of collections.\nCurrently, the maximum number is 7"
                  );
                } else {
                  docs.playlists.push(myCollection);
                  this.$local.put(docs).then(res => {
                    if (res.ok) {
                      this.$refs.form.resetFields();
                      this.$emit("is-success", true);
                    }
                  });
                }
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
