<template>
    <v-app>
                               <v-tabs grow>
      <v-tabs-slider color="deep-orange" v-model="orderState"></v-tabs-slider>
            <v-tab @click="orderState = 0" href="#pay">待付款</v-tab>
            <v-tab @click="orderState = 1" href="#buy">待购买</v-tab>
            <v-tab @click="orderState = 2">待发货</v-tab>
            <v-tab @click="orderState = 3">待评价</v-tab>
            <v-tab @click="orderState = 4">售后/维权</v-tab>

            <v-tabs-items>
            <v-tab-item id="pay">
               <Pay v-if="orderState == 0"></Pay>
            </v-tab-item>
            <v-tab-item id="buy">
                 <Buy v-if="orderState == 1"></Buy>
            </v-tab-item>
            </v-tabs-items>
        </v-tabs>
        
    </v-app>
</template>
<script>
import Pay from './Pay'
import Buy from './Buy'
export default {
  components: {
    Pay,
    Buy
  },
  data () {
    return {
      identity: 0,
      orderState: 0
    }
  }
}
</script>
