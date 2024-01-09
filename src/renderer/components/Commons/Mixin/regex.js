const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const numberRegex = /^[0-9]+$/;
const nameRegex = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s]/;

export default {
  methods: {
    regex(name, str) {
      if (name === "email") {
        return this.emailCheck(str);
      } else if (name === "usercode") {
        return this.userCodeCheck(str);
      } else if (name === "username") {
        return this.userNameCheck(str);
      }
    },

    emailCheck(str) {
      return emailRegex.test(str);
    },

    userCodeCheck(str) {
      return numberRegex.test(str);
    },

    userNameCheck(str) {
      return nameRegex.test(str);
    }
  }
};
