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
                      <Header :order="order"></Header>
                    </v-flex>
                    <!-- <router-link :to="order.originalLink" class="grey lighten-5"> -->
                    <v-flex xs12>
                        <v-divider></v-divider>
                        <v-card-text>
                            <Product :products="order.products"></Product>
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
                            <v-btn small outline color="deep-orange" @click="pay(index)">¥{{order.strikePrice}}付款</v-btn>
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

                        <v-dialog persistent v-model="showWxpay" max-width="290">
                            
                            <v-card class="text-xs-center">
                            <v-card-title class="green white--text">请使用微信扫码支付</v-card-title>
                            <v-card-text>
                                                            <qrcode v-model="wxPayCode" :options="{ size: 200 }"></qrcode>

                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn outline color="teal" small @click="checkPay">我已支付</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn outline small color="secondary" @click="showWxpay = false">取消</v-btn>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-flex>
                </v-layout>

            </v-card>
        </div>
    </v-app>
</template>
<script>
import Header from './Header'
import Product from './Product'
export default {
  components: {
    Header,
    Product
  },
  data () {
    return {
      showWxpay: false,
      showCancel: false,
      orders: [],
      reason: '我不想要了',
      index: null,
      wxPayCode: null,
      otherReason: null
    }
  },
  methods: {
    cancel (index) {
      var order = this.orders[index]
      if (this.reason === '其他' && this.otherReason === '') {
        this.$store.commit('ERROR', '请填写其他原因说明')
        return
      } else {
        this.reason = this.otherReason
      }

      this.$http
        .putJson('/user/order/' + order.id, {
          id: order.id,
          type: '1',
          state: '0',
          buyer: { cancelReason: this.reason }
        })
        .then(res => {
          if (res.data.Status) {
            this.$store.commit('SUCCESS', '取消订单成功')
            this.orders.splice(index, 1)
          } else {
            this.$store.commit('ERROR', res.data.Error.Err)
          }
        })
    },
    pay (index) {
      this.index = index
      this.$http.post('/pay/wx/native/' + this.orders[index].id, {}).then(res => {
        if (res.data.Status) {
          if (
            res.data.Data.ReturnCode == 'SUCCESS' &&
            res.data.Data.ResultCode == 'SUCCESS'
          ) {
            this.showWxpay = true
            this.wxPayCode = res.data.Data.CodeURL
          } else {
            this.$store.commit(
              'ERROR',
              res.data.Data.ReturnMsg + res.data.Data.ErrCodeDes
            )
          }
        } else {
          this.$store.commit('ERROR', res.data.Error.Err)
        }
      })
      // this.showWxpay = true;
    },
    checkPay () {
      this.$http
        .get('/user/payment/' + this.orders[this.index].id, {})
        .then(res => {
          if (res.data.Status) {
            // 支付成功
            this.$store.commit('SUCCESS', '支付成功')
            this.showWxpay = false
            this.orders.splice(this.index, 1)
          } else {
            this.$store.commit('ERROR', '尚未收到支付金额')
          }
        })
    }
  },

  mounted () {
    this.$http
      .get('/user/orders', { type: 1, identity: 0, state: '^0' })
      .then(res => {
        if (res.data.Status) {
          this.orders = res.data.Data
        }
      })
  }
}
</script>
