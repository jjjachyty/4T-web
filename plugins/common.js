import Vue from 'vue'
import VueShowdown from 'vue-showdown'
import mavonEditor from 'mavon-editor'
import VueCarousel from 'vue-carousel'
import Viewer from 'v-viewer'
import Croppa from 'vue-croppa'
Vue.use(Viewer)
Vue.use(Croppa)
Vue.use(VueCarousel)
Vue.component('VueShowdown', VueShowdown)
Vue.use(mavonEditor)
