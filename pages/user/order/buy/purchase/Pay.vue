<template>
    <v-app>

        <div v-if="orders.length < 1" class="text-xs-center">
            <small class="grey--text">暂无待付款的订单</small>
        </div>

        <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
            <br>
            <v-card raised>
                <v-layout row wrap>

                    <v-flex xs12>
                        <v-layout row justify-center align-center>
                            <v-flex xs2 md1>
                                <v-avatar size="30">
                                    <img :src="avatarRoot+order.sellBy">
                                </v-avatar>
                            </v-flex>
                            <v-flex xs5 md8>{{order.seller}}
                                <v-icon small>keyboard_arrow_right</v-icon>
                            </v-flex>
                            <v-flex xs3>
                                <span class="caption font-weight-bold">代购费
                                    <small class=" deep-orange--text">¥{{order.charge}}</small>
                                </span>
                            </v-flex>
                            <v-flex xs2>
                                <small class="caption red--text font-weight-black">{{order.state | dict('orderState')}}</small>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <!-- <router-link :to="order.originalLink" class="grey lighten-5"> -->
                    <v-flex xs12>
                        <v-divider></v-divider>
                        <v-card-text>

                            <v-layout row v-for="pd in order.products" :key="pd.id">
                                <v-flex xs2>
                                    <v-card-media height="70">
                                        <img :src="purchaseRoot+pd.images">
                                    </v-card-media>
                                </v-flex>
                                <v-flex xs10>
                                    <v-layout row wrap class="caption grey--text" align-center justify-center>
                                        <v-flex xs10>名称：{{pd.name}}</v-flex>
                                        <v-flex xs2>
                                            <span>数量:{{pd.quantity}}</span>
                                        </v-flex>
                                        <v-flex xs10>购买渠道:{{pd.shopName}}</v-flex>
                                        <v-flex xs2>¥{{pd.price}}</v-flex>
                                    </v-layout>

                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-flex>
                    <!-- </router-link> -->
                    <v-flex xs12>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="grey" outline small @click="showCancel = !showCancel">取消订单
                                <v-icon small v-if="showCancel">keyboard_arrow_down</v-icon>
                                <v-icon small v-else>keyboard_arrow_up</v-icon>
                            </v-btn>
                            <v-btn small outline color="deep-orange">¥{{order.strikePrice}}去付款</v-btn>
                        </v-card-actions>
                        <v-divider></v-divider>

                    </v-flex>
                    <v-flex xs12>
                        <v-container>
                            <v-card v-if="showCancel" raised color="grey lighten-5">
                                <v-card-title>取消原因
                                    <small class="red--text">一天只能取消一次</small>
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-radio-group v-model="reason">
                                        <v-radio value="我不想要了" label="我不想要了"></v-radio>
                                        <v-radio value="其他" label="其他"></v-radio>
                                    </v-radio-group>
                                    <v-text-field v-if="reason=='其他'" label="其他原因说明" textarea v-model="otherReason">

                                    </v-text-field>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn small outline @click="cancel(index)" color="primary">确定</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-container>
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
      showCancel: false,
      orders: [],
      reason: '我不想要了',
      index: null,
      otherReason: null
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

      this.$http.putJson('/user/order/' + order.id, {id: order.id, type: '1', state: '0', cancelReason: this.reason}).then(res => {
        if (res.data.Status) {
          this.$store.commit('SUCCESS', '取消订单成功')
          this.orders.splice(index, 1)
        } else {
          this.$store.commit('ERROR', res.data.Error.Err)
        }
      })
    }
  },
  mounted () {
    this.$http.get('/user/orders', {type: 1, identity: 0, state: '^0'}).then(res => {
      if (res.data.Status) {
        this.orders = res.data.Data
      }
    })
  }
}
</script>
