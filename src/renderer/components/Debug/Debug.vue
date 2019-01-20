<template>
  <div>
    <top-header :isShow="false"/>
    <h2 class="hello">Hello, PouchDB Debug</h2>
    <md-button class="md-raised md-primary" @click="getAlbum">get Album</md-button>
    <md-button class="md-raised md-primary" @click="addAlbum">add Album</md-button>
    <md-button class="md-raised md-primary" @click="addMusic">add Music</md-button>
    <!-- ======================= Album List ======================= -->
    <el-row>
      <el-col class="cols" v-for="item in albumList" :key="item._id" :span="12">
        <el-card class="thumb" style="width: 160px;" :body-style="{ padding: '0px' }">
          <div class="overlay">
            <img class="md-image thumbnail cursor" :src="item.thumbnails" width="158" height="100">
            <div class="playWrapper">
              <div class="overlayMenu">
                <a class="cursor" @click="getMusic(item._id)" title="Play">
                  <font-awesome-icon class="f25 fa" icon="play"/>
                </a>
                <a class="cursor" title="Remove" @click="deleteAlbum(item._id)">
                  <font-awesome-icon class="f25 fa" icon="times"/>
                </a>
                <a class="cursor" @click="coverChange(item)" title="Cover change">
                  <font-awesome-icon class="f25 fa" icon="images"/>
                </a>
              </div>
            </div>
            <div class="channelForm">
              <div class="titleflow">
                <span class="sub">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <hr>
    <!-- ======================= Album List and Music items ======================= -->
    <ul class="rows">
      <li v-for="item in albumMusicList" :key="item._id">
        <div style="margin:10px">
          <span>{{ item.title.substring(0, 40) }}</span>
          <md-button class="md-raised md-primary custom" @click="deleteMusic(item)">delete</md-button>
        </div>
      </li>
    </ul>
    <hr>
  </div>
</template>

<script>
import ContextMenu from "@/components/Context/MyContextMenu";

export default {
  name: "DebugPage",
  components: {
    ContextMenu
  },
  data: () => {
    return {
      albumList: Array,
      albumMusicList: Array
    };
  },
  methods: {
    getAlbum() {
      this.$test
        .createIndex({
          index: {
            fields: ["type", "userId"]
          }
        })
        .then(result => {
          return this.$test
            .find({
              selector: {
                type: {
                  $eq: "mycollection"
                },
                userId: {
                  $eq: "113388783344159291766"
                }
              },
              limit: 4
            })
            .then(result => {
              this.albumList = result.docs;
            })
            .catch(error => {
              console.log(error);
            });
        });
    },
    addAlbum() {
      let data = {
        title: "TEST-COLLECTION-" + this.$moment().format("YYYYMMDDHHmmss"),
        userId: "113388783344159291766",
        type: "mycollection",
        category: "Music",
        thumbnails:
          "http://www.groovelily.com/wp-content/uploads/2017/11/3.jpg",
        creates: this.$moment().format("YYYYMMDDHHmmss"),
        created: this.$moment().format("YYYY-MM-DD HH:mm:ss")
      };
      this.$test.post(data).then(result => {
        if (result.ok) {
          this.getAlbum();
        }
      });
    },
    deleteAlbum(_id) {
      this.$test
        .createIndex({
          index: {
            fields: ["userId", "parentId"]
          }
        })
        .then(result => {
          return this.$test
            .find({
              selector: {
                userId: {
                  $eq: "113388783344159291766"
                },
                parentId: {
                  $eq: _id
                }
              },
              limit: 100
            })
            .then(results => {
              return Promise.all(
                results.docs.map(row => {
                  return this.$test.remove(row);
                })
              );
            })
            .then(arrayToResult => {
              this.$test.get(_id).then(doc => {
                return this.$test.remove(doc).then(result => {
                  if (result.ok) {
                    this.getAlbum();
                    this.getMusic(_id);
                  }
                });
              });
            });
        });
    },
    getMusic(id) {
      this.$test
        .createIndex({
          index: {
            fields: ["userId", "parentId"]
          }
        })
        .then(result => {
          return this.$test
            .find({
              selector: {
                userId: {
                  $eq: "113388783344159291766"
                },
                parentId: {
                  $eq: id
                }
              },
              limit: 50
            })
            .then(result => {
              // docs -> 25 rows.
              this.albumMusicList = result.docs;
            });
        });
    },
    addMusic() {
      let data = {
        userId: "113388783344159291766",
        parentId: "d33f1ff5c0ff60bfd971ae32e10cd8e8",
        videoId: this.$moment().format("YYYYMMDDHHmmss"),
        title: "TEST MUSIC - " + this.$moment().format("YYYYMMDDHHmmss"),
        isLive: "none",
        image: "https://i.ytimg.com/vi/8yjJVNphHAc/mqdefault.jpg",
        duration_code: "PT2M38S",
        duration_time: 158,
        duration: "2:38",
        creates: this.$moment().format("YYYYMMDDHHmmss"),
        created: this.$moment().format("YYYY-MM-DD HH:mm:ss")
      };
      this.$test.post(data).then(result => {
        if (result.ok) {
          // alert("Insert Music Success.\nGet Album click!");
        }
      });
    },
    deleteMusic(data) {
      this.$test.get(data._id).then(doc => {
        let parentId = doc.parentId;
        return this.$test.remove(doc).then(result => {
          if (result.ok) {
            this.getMusic(parentId);
          }
        });
      });
    },
    coverChange(data) {
      //   let thumb =
      //     "https://i.pinimg.com/originals/ac/82/7a/ac827ac9853e6deece1ee3fc8e593f80.jpg";
      let thumb =
        "https://i.pinimg.com/originals/01/92/5b/01925b118b57702938149eb34003fff7.jpg";
      this.$test.get(data._id).then(doc => {
        doc.thumbnails = thumb;
        return this.$test.put(doc).then(result => {
          if (result.ok) {
            this.getAlbum();
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.hello {
  text-align: center;
  color: #ffffff;
}
.rows {
  color: #ffffff;
  list-style: none;
  padding: 0;
  overflow-y: scroll;
  max-height: 240px;
}
.custom {
  min-width: 60px !important;
  height: 20px;
  margin: 0;
  float: right;
}
</style>