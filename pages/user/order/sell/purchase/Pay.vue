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
                            <v-flex xs4 md1>
                                <v-avatar size="30">
                                    <img :src="avatarRoot+order.buyer.id">
                                </v-avatar>{{order.buyer.name}}<v-icon small>keyboard_arrow_right</v-icon>
                            </v-flex>
                            <v-flex offset-xs4 xs3 md3>
                                <span class=" font-weight-bold">
                                    <span class=" deep-orange--text"> ¥{{order.strikePrice}}</span>
                                </span>/
                                <small class=" deep-orange--text">代费¥{{order.charge}}</small>
                            </v-flex>
                            <v-flex xs2 md2>
                                <small class="caption red--text font-weight-bold">{{order.state | dict('orderState')}}</small>
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
                            <div v-if="!showModify">
                            <v-btn color="warning" outline small v-if="!showDelete" @click="showDelete = !showDelete">
                                关闭订单
                                <v-icon small>close</v-icon>
                            </v-btn>
                            <div v-if="showDelete">
                            <v-btn color="primary" flat small @click="showDelete = !showDelete">
                                <v-icon small>right</v-icon>
                                取消
                            </v-btn>
                            <v-btn color="warning" flat small @click="close(index)">
                                确定关闭？
                                
                            </v-btn>
                            </div>
                            </div>
                            <!-- 修改价格 -->
                            <div v-if="!showDelete"> 
                            <v-btn small outline  color="deep-orange" @click="showModify = !showModify" v-if="!showModify">修改价格</v-btn>
                            <div v-if="showModify" class="modify">
                                <v-spacer></v-spacer>
                            <v-btn color="teal" flat small @click="showModify = false">
                                取消
                            </v-btn>
                               <s class="red--text"> ¥{{order.strikePrice}}</s>
                            <v-text-field ref="strikePrice"  class="modify-text" clearable v-model.number="strikePrice" prefix="¥" :width="100" type="number":rules="[v => Number(v) > 0 || '价格需大于0']"> </v-text-field>
                            <v-btn color="teal" flat small @click="modify(index)">
                                确定
                            </v-btn>
                            </div>
                            </div>
                        </v-card-actions>
                        <v-divider></v-divider>

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
      showDelete: false,
      showModify: false,
      strikePrice: 0,
      showCancel: false,
      orders: [],
      reason: '我不想要了',
      index: null,
      otherReason: null
    }
  },
  methods: {
    close (index) {
      var order = this.orders[index]
      this.$http.putJson('/user/order/' + order.id, {id: order.id, type: '1', state: '-1', cancelReason: this.reason}).then(res => {
        if (res.data.Status) {
          this.$store.commit('SUCCESS', '关闭订单成功')
          this.orders.splice(index, 1)
        } else {
          this.$store.commit('ERROR', res.data.Error.Err)
        }
      })
    },
    modify (index) {
      var order = this.orders[index]

      if (this.$refs.strikePrice[0].validate()) {
        this.$http.putJson('/user/order/' + order.id, {id: order.id, type: '1', state: '0', strikePrice: this.strikePrice}).then(res => {
          if (res.data.Status) {
            this.$store.commit('SUCCESS', '修改价格成功')
            this.orders[index].strikePrice = this.strikePrice
          } else {
            this.$store.commit('ERROR', res.data.Error.Err)
          }
        })
      } else {
        this.$refs.strikePrice[0].error = true
      }
    }
  },
  mounted () {
    this.$http.get('/user/orders', {type: 1, identity: 1, state: '^0'}).then(res => {
      if (res.data.Status) {
        this.orders = res.data.Data
      }
    })
  }
}
</script>
<style scoped>
.modify{
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
}
.modify-text{
    width: 130px;
}
</style>
