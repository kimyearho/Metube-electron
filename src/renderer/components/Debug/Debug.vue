<template>
  <div>
    <top-header :isShow="false"/>
    <h2 class="hello">Hello, Debug</h2>
    <md-button class="md-raised md-primary" @click="getAlbum">get Album</md-button>
    <ul class="rows">
      <li v-for="item in albumList" :key="item._id">
        <div style="margin:10px">
          <span>{{ item.title }}</span>
          <md-button class="md-raised md-primary custom" @click="getMusic(item._id)">get music</md-button>
        </div>
      </li>
    </ul>
    <hr>
    <ul class="rows">
      <li v-for="item in albumMusicList" :key="item._id">
        <div style="margin:10px">
          <span>{{ item.title.substring(0, 30) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DebugPage",
  data: () => {
    return {
      albumList: Array,
      albumMusicList: Array
    };
  },
  methods: {
    setIndex() {
      this.$test
        .createIndex({
          index: {
            fields: ["videoId"]
          }
        })
        .then(result => {
          console.log(result);
        });
    },
    getAlbum() {
      this.$test
        .createIndex({
          index: {
            fields: ["type"]
          }
        })
        .then(result => {
          return this.$test
            .find({
              selector: {
                type: {
                  $eq: "album"
                }
              }
            })
            .then(result => {
              this.albumList = result.docs;
            })
            .catch(error => {
              console.log(error);
            });
        });
    },
    getMusic(id) {
      this.$test
        .createIndex({
          index: {
            fields: ["videoId", "creates"]
          }
        })
        .then(result => {
          return this.$test
            .find({
              selector: {
                parentId: {
                  $eq: id
                }
              }
            })
            .then(result => {
              this.albumMusicList = result.docs;
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
}
.custom {
  height: 20px;
  margin: 0;
  float: right;
}
</style>