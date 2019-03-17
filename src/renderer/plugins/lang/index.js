import Vue from "vue";
import enLocale from "./en";
import koLocale from "./ko";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

const messages = {
  "ko_KR": {
    ...koLocale
  },
  "en_US": {
    ...enLocale
  }
};
const i18n = new VueI18n({
  locale: 'en_US',
  messages,
  silentTranslationWarn: true
});

export default i18n;
