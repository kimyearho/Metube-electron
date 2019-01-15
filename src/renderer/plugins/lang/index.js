import Vue from "vue"
import enLocale from "./en"
import koLocale from "./ko"
import VueI18n from "vue-i18n"
Vue.use(VueI18n)

const messages = {
  ko: {
    ...koLocale
  },
  en: {
    ...enLocale
  }
}
const i18n = new VueI18n({
  locale: "en",
  messages,
  silentTranslationWarn: true
})

export default i18n
