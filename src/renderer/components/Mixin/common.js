export default {
  methods: {
    messageDialog(type, message) {
      this.$modal.show("dialog", {
        title: type,
        text: message,
        buttons: [
          {
            title: "Close"
          }
        ]
      })
    },

    profileMakeKey() {
      let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"
      let string_length = 20
      let randomstring = ""
      for (let i = 0; i < string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length)
        randomstring += chars.substring(rnum, rnum + 1)
      }
      return randomstring
    },

    getProfileKey() {
      return (
        this.profileMakeKey() + "" + this.$moment().format("YYYYMMDDkkmmss") + "" + this.getUserId()
      )
    },

    collectionMakeKey() {
      let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ"
      let string_length = 20
      let randomstring = ""
      for (let i = 0; i < string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length)
        randomstring += chars.substring(rnum, rnum + 1)
      }
      return randomstring
    },

    getCollectionKey() {
      return (
        this.collectionMakeKey() +
        "" +
        this.$moment().format("YYYYMMDDkkmmss") +
        "" +
        this.getUserId()
      )
    }
  }
}
