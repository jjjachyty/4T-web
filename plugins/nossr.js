import Vue from 'vue'

import mavonEditor from 'mavon-editor'
import VueCarousel from 'vue-carousel'
import Viewer from 'v-viewer'
import Croppa from 'vue-croppa'
import rate from 'vue-rate'

import VueQrcode from '@xkeshi/vue-qrcode'

Vue.component(VueQrcode.name, VueQrcode)
Vue.use(rate)
Vue.use(Viewer)
Vue.use(Croppa)
Vue.use(VueCarousel)
Vue.use(mavonEditor)
