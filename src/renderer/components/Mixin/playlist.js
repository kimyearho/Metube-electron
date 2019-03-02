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
    },

    /**
     * 재생목록정보를 조회하고,
     * 해당 재생목록정보에 일치하는 비디오 목록의 갯수를 조회한다.
     *
     * @param {*} playType 재생타입
     * @param {*} listId   재생목록아이디
     * @param {*} page     페이지 번호
     */
    getPlaylistVideoCount(playType, listId, page) {
      const params = ["type", "playlistId"];
      return this.createLocalIndex(params).then(() => {
        return this.$local
          .find({
            selector: {
              type: playType + "ListInfo",
              playlistId: listId
            }
          })
          .then(result => {
            return this.$local
              .find({
                selector: {
                  type: playType,
                  parentId: result.docs[0]._id,
                  pageNum: page
                },
                limit: 30
              })
              .then(result => {
                const docs = result.docs;
                return this.$lodash.size(docs);
              });
          });
      });
    },

    /**
     * 아래 3가지 조건과 일치하는 비디오 목록을 가져온다.
     *
     * @param {*} playType 재생타입
     * @param {*} parentId 재생목록정보 아이디
     * @param {*} page     페이지 번호
     */
    getPageVideoList(playType, parentId, page) {
      const param = ["type", "parentId", "pageNum"];
      return this.createLocalIndex(param).then(() => {
        return this.$local.find({
          selector: {
            type: playType,
            parentId: parentId,
            pageNum: page
          },
          limit: 30
        });
      });
    }
  }
};
