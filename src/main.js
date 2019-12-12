import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './../node_modules/spectre.css/dist/spectre.min.css'
import './../node_modules/spectre.css/dist/spectre-exp.min.css'
import './../node_modules/spectre.css/dist/spectre-icons.min.css'

import i18nFile from '@/i18n.json'

// this allows verovio as global variable, c.f. https://forum.vuejs.org/t/single-file-component-how-to-access-imported-library-in-template/8850/2
// this seems to be extremely slow while development, as it tries to compile Verovio every time…
/* import vrvToolkit from './verovio.js'
Vue.prototype.$verovio = vrvToolkit */

// const vrvToolkit = new verovio.toolkit()

// const verovio = require('../node_modules/verovio-dev/index.js').init(256)
// const verovio = require('./verovio.js').init(256)
const vrvToolkit = new verovio.toolkit()
Vue.prototype.$verovio = vrvToolkit

const i18n = (code) => {

  if (typeof i18nFile[code] === 'undefined') {
    console.error('ERROR (i18n): Unable to retrieve translation for "' + code + '"')
    return ''
  }

  let obj = i18nFile[code]
  let lang = store.getters.language

  if (typeof obj[lang] === 'undefined') {
    console.warn('WARNING (i18n): Lacking ' + lang + ' value for "' + code + '"')
    lang = 'de'
  }

  return obj[lang]
}
Vue.prototype.$i18n = i18n

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

store.dispatch('fetchComparisons')
