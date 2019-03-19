<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-autocomplete
          ref="auto"
          style="width:100%"
          class="inline-input"
          prefix-icon="el-icon-search"
          clearable
          :debounce="500"
          v-model="keyword"
          @keyup.enter.native="handleSelect(keyword)"
          :fetch-suggestions="querySearch"
          placeholder="Search Youtube"
          :trigger-on-focus="false"
          @select="handleSelect"
        ></el-autocomplete>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AutoComplate",
  props: {
    userSearchQuery: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      links: [],
      keyword: "",
      timer: 0,
      googleSearch:
        "https://suggestqueries.google.com/complete/search?ds=yt&client=youtube&q="
    };
  },
  mounted() {
    this.keyword = this.userSearchQuery;
  },
  methods: {
    querySearch(queryString, cb) {
      const url = this.googleSearch.concat(queryString);
      this.$jsonp.jsonp(url).then(res => {
        let value = this.$lodash.map(res[1], item => {
          return {
            name: item[0]
          };
        });
        const results = this.$lodash.map(value, "name");
        this.links = [];
        this.$lodash.forEach(results, item => {
          let key = { value: item };
          this.links.push(key);
        });
        cb(this.links);
      });
    },
    handleSelect(item) {
      this.$refs.auto.suggestions = [];
      if (item.value) {
        this.$emit("searchQuery", item.value);
      } else {
        this.$emit("searchQuery", item);
      }
    },
    reset() {
      this.$refs.auto.suggestions = [];
    }
  }
};
</script>

<style scoped>
.inline-input >>> .el-input {
  height: 40px;
}
.inline-input >>> .el-input__inner {
  border-radius: 0px;
}
.el-select-dropdown {
  left: 54px !important;
}
</style>