import Vue from "vue";

/* PouchDB */
let PouchDB = require("pouchdb-core")
  .plugin(require("pouchdb-adapter-idb"))
  .plugin(require("pouchdb-adapter-http"))
  .plugin(require("pouchdb-replication"))
  .plugin(require("pouchdb-mapreduce"))
  .plugin(require("pouchdb-find"));

const DATABASE = {
  DEV: {
    LOCAL: "http://localhost:5984/local",
    YTDL: "http://localhost:5984/ytdl",
    COLLECTION: "http://localhost:5984/collection"
  },
  PRODUCTION: {
    LOCAL: "local/cache",
    YTDL: "local/ytdl",
    COLLECTION: "local/collection"
  },
  COMMONS: {
    USER: "http://202.182.100.137:5984/user",
    CONFIG: "http://202.182.100.137:5984/metube",
    RECOMMAND: "http://202.182.100.137:5984/recommand"
  }
}

if (process.env.NODE_ENV !== "production") {
  Vue.prototype.$test = new PouchDB(DATABASE.DEV.COLLECTION);
  Vue.prototype.$local = new PouchDB(DATABASE.DEV.LOCAL);
  Vue.prototype.$ytdl = new PouchDB(DATABASE.DEV.YTDL);
  Vue.prototype.$user = new PouchDB(DATABASE.COMMONS.USER);
} else {
  Vue.prototype.$test = new PouchDB(DATABASE.PRODUCTION.COLLECTION);
  Vue.prototype.$local = new PouchDB(DATABASE.PRODUCTION.LOCAL);
  Vue.prototype.$ytdl = new PouchDB(DATABASE.PRODUCTION.YTDL);
  Vue.prototype.$user = new PouchDB(DATABASE.COMMONS.USER);
}

// 메인서버 데이터베이스
Vue.prototype.$db = new PouchDB(DATABASE.COMMONS.CONFIG);
Vue.prototype.$recommand = new PouchDB(DATABASE.COMMONS.RECOMMAND);

export default PouchDB;
