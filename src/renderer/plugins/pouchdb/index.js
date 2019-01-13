import Vue from "vue"

/* PouchDB */
let PouchDB = require("pouchdb-core")
  .plugin(require("pouchdb-adapter-idb"))
  .plugin(require("pouchdb-adapter-http"))
  .plugin(require("pouchdb-mapreduce"))
  .plugin(require("pouchdb-replication"))
  .plugin(require("pouchdb-find"))

// 개발용
// pouchdb-server or couchdb
// Vue.prototype.$local = new PouchDB("http://localhost:5984/metube")

// 로컬
Vue.prototype.$local = new PouchDB("metubev3")

// 서비스
// pouchdb-server or couchdb
// App.vue -> onNewReleaseCheck()
Vue.prototype.$db = new PouchDB("https://sharepod.kr:6984/metube")
