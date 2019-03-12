import Vue from "vue"
import enLocale from "./en"
import koLocale from "./ko"
import VueI18n from "vue-i18n"
Vue.use(VueI18n)

let defaultLocale = require("electron").remote.app.getLocale()

if(defaultLocale !== 'ko') {
  defaultLocale = 'en'
}

const messages = {
  ko: {
    ...koLocale
  },
  en: {
    ...enLocale
  }
}
const i18n = new VueI18n({
  locale: defaultLocale,
  messages,
  silentTranslationWarn: true
})

export default i18n
