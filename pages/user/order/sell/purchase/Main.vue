<template>
    <v-app>
                               <v-tabs grow>
      <v-tabs-slider color="deep-orange" v-model="orderState"></v-tabs-slider>
            <v-tab @click="orderState = 0" href="#pay">待付款</v-tab>
            <v-tab @click="orderState = 1" href="#buy">待购买</v-tab>
            <v-tab @click="orderState = 2" href="#deliver">待发货</v-tab>
            <v-tab @click="orderState = 3" href="#receiving">待收货</v-tab>
            <v-tab @click="orderState = 4" href="#complete">已完成</v-tab>
            <v-tab @click="orderState = 5" href="#return">退货/售后</v-tab>
            <v-tab @click="orderState = 6" href="#cancel">取消/关闭</v-tab>

            <v-tabs-items>
            <v-tab-item id="pay">
               <Pay v-if="orderState == 0"></Pay>
            </v-tab-item>
            <v-tab-item id="buy">
                 <Buy v-if="orderState == 1"></Buy>
            </v-tab-item>
            <v-tab-item id="deliver">
                 <Deliver v-if="orderState == 2"></Deliver>
            </v-tab-item>
            <v-tab-item id="receiving">
   
                 <Receiving v-if="orderState == 3"></Receiving>
            </v-tab-item>
                        <v-tab-item id="complete">
   
                 <Complete v-if="orderState == 4"></Complete>
            </v-tab-item>
                            <v-tab-item id="return">
   
                 <Return v-if="orderState == 5"></Return>
            </v-tab-item>
                                        <v-tab-item id="cancel">
   
                 <Cancel v-if="orderState == 6"></Cancel>
            </v-tab-item>
            </v-tabs-items>
        </v-tabs>
        
    </v-app>
</template>
<script>
import Pay from './Pay'
import Buy from './Buy'
import Deliver from './Deliver'
import Receiving from './Receiving'
import Complete from './Complete'
import Return from './Return'
import Cancel from './Cancel'
export default {
  components: {
    Pay,
    Buy,
    Deliver,
    Receiving,
    Complete,
    Return,
    Cancel
  },
  data () {
    return {
      identity: 0,
      orderState: 0
    }
  }
}
</script>
