import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

export default new VueRouter({
  saveScrollPosition: true,
  routes: [
    {
      path: "*",
      redirect: "/search"
    },
    {
      path: "/search",
      name: "play-search",
      component: require("@/components/Search/SearchList").default
    },
    {
      path: "/collections",
      name: "collection",
      component: require("@/components/Collections/Index").default
    },
    {
      path: "/collections/:playType",
      name: "COLLECTION-LIST",
      component: require("@/components/Collections/list/CollectionList").default
    },
    {
      path: "/collection/:playType/:id",
      name: "NOT-MY-PLAYLIST",
      component: require("@/components/PlayList/self/MyMusicList").default
    },
    {
      path: "/:playType/:id/:start",
      name: "MY-PLAYING-PLAYLIST",
      component: require("@/components/PlayList/self/MyMusicPlayList").default
    },
    {
      path: "/setting",
      name: "setting",
      component: require("@/components/Setting/Setting").default
    },
    {
      path: "/signin",
      name: "login",
      component: require("@/components/SignIn/SignIn").default
    },
    {
      path: "/:playType/:id",
      name: "NOT-PLAYING-PLAYLIST",
      component: require("@/components/PlayList/MusicList").default
    },
    {
      path: "/:playType/:id/:start",
      name: "PLAYING-PLAYLIST",
      component: require("@/components/PlayList/MusicPlayList").default
    }
  ]
});
