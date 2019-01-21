export default {
  methods: {
    /**
     * 공통 CreateIndex
     *
     * @param {*} fieldToArray - 색인필드
     */
    createIndex(fieldToArray) {
      return this.$test.createIndex({
        index: {
          fields: fieldToArray
        }
      })
    },

    /**
     * 내 컬렉션 하위에 속해있는 데이터(비디오)셋을 조회
     *
     * @param {*} _id - 선택한 컬렉션의 아이디
     */
    getSubsetMusic(_id) {
      return this.createIndex(["userId", "parentId"]).then(() => {
        return this.$test.find({
          selector: {
            userId: {
              $eq: this.getUserId()
            },
            parentId: {
              $eq: _id
            }
          },
          limit: 100
        })
      })
    }
  }
}
