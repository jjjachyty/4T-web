<template>
    <v-app>
         <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无待购买的订单</small></div>
                                 <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
<br>
                <v-card raised>
                    <v-layout row wrap >
                                                <v-flex xs12 >
                           <v-layout row align-center justify-center>
                            <v-flex xs2 md1><v-avatar size="30"><img :src="avatarRoot+order.sellBy"></v-avatar></v-flex>
                            <v-flex xs9 md9>{{order.seller}}<v-icon small>keyboard_arrow_right</v-icon></v-flex>  
                            <v-flex xs2 md1><small class="font-weight-black">¥{{order.strikePrice}}</small></v-flex>
                            <v-flex xs2 md1><small class="caption red--text font-weight-black">{{order.state | dict('orderState')}}</small></v-flex> 
                            </v-layout>
                            <v-divider></v-divider>
                        </v-flex>
                                                <router-link :to="order.originalLink" class="grey lighten-5">

                        <v-flex xs12 md12>
                            <v-card-text>
                            <v-layout row v-for="pd in order.products" :key="pd.id">
                        <v-flex xs2 md2>
                            <v-card-media height="70">
                                <img :src="purchaseRoot+pd.images" >
                            </v-card-media>
                        </v-flex>
                        <v-flex xs10 md10>
                            <v-layout row wrap class="caption grey--text" align-center justify-center>
                                <v-flex xs10>名称：{{pd.name}}</v-flex>
                                <v-flex xs2><span>数量:{{pd.quantity}}</span></v-flex>
                                <v-flex xs10>购买渠道:{{pd.shopName}}</v-flex>
                                <v-flex xs2>¥{{pd.price}}</v-flex>
                            </v-layout>
                            
                        </v-flex>
                            </v-layout>
                            </v-card-text>
                        </v-flex>
</router-link>
                        <v-flex xs12>
                            <v-divider></v-divider>
                            <v-card-actions>
                                                         <v-spacer></v-spacer>
                                <v-btn outline small @click="showCancel = !showCancel">取消订单</v-btn>
                                <v-btn small outline color="deep-orange" @click="remind(index)" >提醒购买</v-btn>
                            </v-card-actions>
                                                        <v-divider></v-divider>
                            <v-card v-if="showCancel" raised color="grey lighten-5">
                                <v-container fluid grid-list-md>
                                <v-card-title>取消原因<small class="red--text">一天只能取消一次</small></v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-radio-group v-model="reason">
                                        <v-radio value="卖家一直不购买" label="卖家一直不购买"></v-radio>
                                        <v-radio value="我不想要了" label="我不想要了"></v-radio>
                                        <v-radio value="其他" label="其他"></v-radio>
                                    </v-radio-group>
                                    <v-text-field v-if="reason === '其他'" label="其他原因说明" textarea v-model="otherReason">

                                    </v-text-field>
                                </v-card-text>
                                                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn small outline @click="cancel(index)" color="primary">确定</v-btn>
                                </v-card-actions>
                                </v-container>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
                                 </div>
                
    </v-app>
</template>
<script>
export default {

  data () {
    return {
      otherReason: null,
      reason: '我不想要了',
      showCancel: false,
      index: null,
      ticket: {},
      orders: []
    }
  },
  methods: {
    cancel (index) {
      var order = this.orders[index]
      if (this.reason == '其他') {
        if (this.otherReason == null) {
          this.$store.commit('ERROR', '请填写其他原因说明')
          return
        } else {
          this.reason = this.otherReason
        }
      }

      this.$http.putJson('/user/order/' + order.id, {id: order.id, state: '-1', cancelReason: this.reason}).then(res => {
        if (res.data.Status) {
          this.$store.commit('SUCCESS', '取消订单成功')
          this.orders.splice(index, 1)
        } else {
          this.$store.commit('ERROR', res.data.Error.Err)
        }
      })
    },
    remind (index) {
      this.index = index
    }
  },
  created () {
    this.$http.get('/user/orders', {type: 1, identity: 0, state: '^1'}).then(res => {
      if (res.data.Status) {
        this.orders = res.data.Data
      }
    })
  }
}
</script>
<style scoped>
.image{
    width: 50%;
    height: 100px;
}

</style>
