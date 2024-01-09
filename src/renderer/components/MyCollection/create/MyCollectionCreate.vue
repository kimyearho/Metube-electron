'use strict';

<template>

  <div>
    <el-dialog class="dialog"
               title="Create Collection"
               :visible="isOpen"
               :before-close="closeModal"
               :close-on-click-modal="false"
               :append-to-body="true"
               width="300px">
      <el-form :model="form"
               ref="form"
               label-position="top"
               :rules="rules">
        <el-form-item label="Collection name"
                      :label-width="formLabelWidth"
                      prop="name">
          <el-input v-model="form.name"
                    placeholder="Please enter name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Category"
                      :label-width="formLabelWidth">
          <el-select class="select"
                     v-model="form.category"
                     placeholder="Please select a category">
            <el-option v-for="item in form.categories"
                       :key="item.label"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
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

  import StoreMixin from '@/components/Commons/Mixin/index'
  import CommonMixin from '@/components/Commons/Mixin/common'
  import DataUtilMixin from '@/components/Commons/Mixin/db'
  import MyCollectionMixin from '@/components/Commons/Mixin/mycollection'
  export default {
    name: 'MyCollectionCreate',
    mixins: [StoreMixin, CommonMixin, MyCollectionMixin, DataUtilMixin],
    props: {
      isOpen: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        formLabelWidth: '120px',
        rules: {
          name: [
            {
              required: true,
              message: 'Please enter a collection name.',
              trigger: 'change'
            }
          ]
        },
        form: {
          name: '',
          category: '',
          categories: [
            { label: 'default', value: 'default' },
            { label: 'Music', value: 'Music' },
            { label: 'Radio', value: 'Radio' },
            { label: 'Rock', value: 'Rock' },
            { label: 'Anime', value: 'Anime' },
            { label: 'Gaming', value: 'Gaming' },
            { label: 'Classics', value: 'Classics' },
            { label: 'Electronic', value: 'Electronic' },
            { label: 'Movie', value: 'Movie' },
            { label: 'Piano', value: 'Piano' },
            { label: 'Sleep', value: 'Sleep' },
            { label: 'Epic', value: 'Epic' },
            { label: 'Travel', value: 'Travel' },
            { label: 'Action', value: 'Action' }
          ]
        }
      }
    },
    methods: {
      save() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.getMyCollectionListCount().then(count => {
              if (count < 20) {
                const myCollection = {
                  title: this.form.name,
                  userId: this.getUserId(),
                  type: 'mycollection',
                  category: this.form.category !== '' ? this.form.category : 'default',
                  thumbnails:
                    'http://smeaker.com/wp-content/uploads/2017/03/Nonton-Video-YouTube-Gratis-Hanya-Bisa-pada-Waktu-Tengah-Malam-Kenapa.jpg',
                  creates: this.$moment().format('YYYYMMDDHHmmss'),
                  created: this.$moment().format('YYYY-MM-DD HH:mm:ss')
                }
                this.$test.post(myCollection).then(result => {
                  if (result.ok) {
                    const storeInitItem = {
                      list: [],
                      listCount: 0,
                      id: result.id
                    }
                    this.$test
                      .find({
                        selector: {
                          type: 'profile',
                          userId: this.getUserId()
                        }
                      })
                      .then(result => {
                        let docs = result.docs[0]
                        if (docs) {
                          docs.collections.push(storeInitItem)
                          this.$test.put(docs).then(result => {
                            if (result.ok) {
                              this.getLog('db store collection create success!', {})
                            }
                          })
                        }
                        this.$refs.form.resetFields()
                        this.$emit('is-success', true)
                      })
                  }
                })
              } else {
                this.$message({
                  showClose: true,
                  message: this.$t('COLLECTION.MYCOLLECTION_MAX_TOTAL_OVER'),
                  type: 'error'
                })
              }
            })
          }
        })
      },
      closeModal() {
        this.$refs.form.resetFields()
        this.form.category = ''
        this.$emit('is-close', false)
      }
    }
  }

</script>

<style scoped>

  .dialog >>> .el-dialog {
    background: #242d40de;
  }

  .dialog >>> .el-dialog__title {
    color: #ffffff !important;
  }

  .dialog >>> .el-form-item__label {
    color: #ffffff !important;
  }

  .dialog >>> .el-input__inner {
    background: #242d40de;
    color: #ffffff;
    border: 1px solid #dcdfe6a8;
  }

  .el-dialog__body {
    padding: 10px 20px !important;
    color: #606266;
    font-size: 14px;
  }
  .select >>> .el-select-dropdown {
    top: 150px !important;
    left: 253px !important;
  }

</style>
