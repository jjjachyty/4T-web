import Vue from 'vue'

import mavonEditor from 'mavon-editor'

import Viewer from 'v-viewer'
import Croppa from 'vue-croppa'
import rate from 'vue-rate'

import VueQrcode from '@xkeshi/vue-qrcode'
import VueAgile from 'vue-agile'

import {
  Carousel,
  Slide
} from 'vue-carousel'
Vue.component('carousel', Carousel)
Vue.component('slide', Slide)

Vue.use(VueAgile)
Vue.component(VueQrcode.name, VueQrcode)
Vue.use(rate)
Vue.use(Viewer)
Vue.use(Croppa)
Vue.use(mavonEditor)
