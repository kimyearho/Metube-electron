/*---------------------------------------------------------------------------------------------
 *  Licensed under the GPL-3.0 License. See License.txt in the project root for license information.
 *  You can not delete this comment when you deploy an application.
 *--------------------------------------------------------------------------------------------*/

'use strict';

<template>

  <div>
    <el-dialog class="dialog"
               style="z-index:998 !important; overflow-y: hidden;"
               :title="$t('COLLECTION.MENU.MY_COLLECTION')"
               :visible="isOpen"
               :before-close="closeModal"
               :close-on-click-modal="false"
               :append-to-body="true"
               @open="getMyCollectionList"
               width="300px">
      <div class="wrapper" v-loading="loading" element-loading-background="#ffffff">
        <ul>
          <li v-for="(item, index) in listData" :key="index">
            <div>{{ item.title }}</div>
            <div class="selected">
              <md-button class="md-raised md-primary"
                         :disabled="item.isExists"
                         @click="addItem(item)">
                <i class="material-icons" style="float:left;">add</i>
              </md-button>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <md-button style="width: 92%;margin-top: 20px;"
                   class="md-raised"
                   @click="$emit('closeToCreateModal', true)">{{ $t('COLLECTION.CREATE_COLLECTION_LABEL') }}</md-button>
      </div>
    </el-dialog>

    <my-collection-create-modal :isOpen="isCreate"
                                @is-close="isCreate = false"
                                @is-success="closeCreateModal"></my-collection-create-modal>
  </div>

</template>

<script>

  import StoreMixin from '@/components/Commons/Mixin/index'
  import DataUtils from '@/components/Commons/Mixin/db'
  import MyCollectionCreateModal from '@/components/MyCollection/create/MyCollectionCreate'

  export default {
    name: 'RegisteredMusicList',
    mixins: [StoreMixin, DataUtils],
    components: {
      MyCollectionCreateModal
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      data: Object
    },
    data() {
      return {
        listData: [],
        isCreate: false,
        loading: true
      }
    },
    methods: {
      create() {
        this.isCreate = true
      },

      closeCreateModal() {
        this.isCreate = false
        this.$emit('reTryRegister', true)
      },

      /**
       * 지정한 컬렉션에 음악을 추가한다.
       */
      addItem(listData) {
        this.createIndex(['creates']).then(() => {
          return this.$test
            .find({
              selector: {
                parentId: listData._id,
                type: 'mycollectionItem',
                creates: {
                  $gte: null
                }
              }
            })
            .then(result => {
              const count = result.docs.length
              if (count < 100) {
                let track = {
                  userId: this.getUserId(),
                  parentId: listData._id,
                  videoId: this.data.videoId,
                  channelId: this.data.channelId,
                  channelTitle: this.data.channelTitle,
                  type: 'mycollectionItem',
                  isLive: this.data.isLive ? this.data.isLive : 'none',
                  title: this.data.title,
                  duration: this.data.duration,
                  duration_time: this.data.duration_time,
                  thumbnails: this.data.imageInfo !== undefined ? this.data.imageInfo : this.data.image,
                  creates: this.$moment().format('YYYYMMDDHHmmss'),
                  created: this.$moment().format('YYYY-MM-DD HH:mm:ss')
                }
                this.$test.post(track).then(result => {
                  if (result.ok) {
                    this.$test.get(result.id).then(doc => {
                      if (doc) {
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
                              let findData = this.$lodash.find(docs.collections, {
                                id: doc.parentId
                              })
                              findData.list.push(doc)
                              findData.listCount = findData.list.length
                              this.$test.put(docs).then(result => {
                                if (result.ok) {
                                  this.$message({
                                    showClose: true,
                                    message: this.$t('CONTEXT.MESSAGE.ADD_COLLECTION_SUCCESS'),
                                    type: 'success'
                                  })
                                  console.log('success db store insert and update!')
                                } else {
                                  this.$message({
                                    showClose: true,
                                    message: this.$t('CONTEXT.MESSAGE.ADD_COLLECTION_FAIL'),
                                    type: 'error'
                                  })
                                }
                              })
                            }
                          })
                      }
                    })
                    this.closeModal()
                  }
                })
              } else {
                this.$message({
                  showClose: true,
                  message: this.$t('COLLECTION.MYCOLLECTION_MUSICSET_TOTAL_OVER'),
                  type: 'error'
                })
              }
            })
        })
      },

      /**
       * 등록한 나의 컬렉션 조회
       *   - 내가 등록한 컬렉션 목록을 조회
       *   - 각 컬렉션별 하위 데이터셋을 조회한 뒤 현재 비디오 아이디가 존재하는지 확인.
       *   - 존재한다면 isExists Valiable을 추가한다
       */
      getMyCollectionList() {
        this.createIndex(['creates']).then(() => {
          return this.$test
            .find({
              selector: {
                type: {
                  $eq: 'mycollection'
                },
                userId: {
                  $eq: this.getUserId()
                },
                creates: {
                  $gte: null
                }
              }
            })
            .then(result => {
              let docs = result.docs
              if (docs.length > 0) {
                const arrayToItems = []
                this.$lodash.forEach(docs, item => {
                  let dataToItem = this.getSubsetMusic(item._id).then(result => {
                    let findData = this.$lodash.find(result.docs, {
                      videoId: this.data.videoId
                    })
                    if (findData) item.isExists = true
                    return item
                  })
                  arrayToItems.push(dataToItem)
                })
                Promise.all(arrayToItems).then(result => {
                  this.listData = result
                  this.loading = false
                })
              }
            })
        })
      },
      closeModal() {
        this.$emit('closeModal', false)
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

  .wrapper {
    overflow-y: scroll;
    max-height: 250px;
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

  ul {
    margin: 0;
    padding: 0;
  }

  ul li {
    color: #ffffff;
    padding: 5px;
    list-style: none;
    line-height: 30px;
  }

  ul li div {
    display: inline-block;
  }

  .selected {
    float: right;
  }

  .md-button {
    min-width: 0px !important;
    height: 21px !important;
  }

  .md-button.md-theme-default.md-raised[disabled] {
    background-color: #ddddddd9;
  }

</style>
