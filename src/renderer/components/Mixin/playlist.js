export default {
  methods: {
    /**
     * 재생목록 정보를 조회한다.
     * 
     * @param {*} playType 재생타입 (play/channel/related)
     * @param {*} id alias + playlistId가 합쳐진 고유 kEY 
     */
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
