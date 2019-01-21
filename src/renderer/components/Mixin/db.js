export default {
  methods: {
    createIndex(fieldToArray) {
      return this.$test.createIndex({
        index: {
          fields: fieldToArray
        }
      })
    },
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
