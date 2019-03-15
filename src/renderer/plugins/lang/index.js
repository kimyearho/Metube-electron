import Vue from "vue";
import enLocale from "./en";
import koLocale from "./ko";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

const osLocale = require("os-locale");
let defaultLocale = osLocale.sync()
console.log(defaultLocale)

if (defaultLocale !== "ko_KR" && defaultLocale !== "en_US") {
  defaultLocale = "en_US";
}

const messages = {
  "ko_KR": {
    ...koLocale
  },
  "en_US": {
    ...enLocale
  }
};
const i18n = new VueI18n({
  locale: defaultLocale,
  messages,
  silentTranslationWarn: true
});

export default i18n;
