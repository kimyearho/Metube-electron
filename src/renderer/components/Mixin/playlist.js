export default {
  methods: {
    getPlaylistInfoData(playType, id) {
      const params = ["type", "playlistId"];
      return this.createLocalIndex(params).then(() => {
        return this.$local.find({
          selector: {
            type: playType + "ListInfo",
            playlistId: id
          }
        });
      });
    }
  }
};
