<template>
  <v-app>
    <div v-if="orders.length < 1" class="text-xs-center">
      <small class="grey--text">暂无待购买的订单</small>
    </div>
    <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
      <br>
      <v-card >
        <v-layout row wrap>
          <v-flex xs12>
            <v-layout row align-center justify-center>
              <v-flex xs2 md1>
                <v-avatar size="30">
                  <img :src="avatarRoot+order.sellBy">
                </v-avatar>
              </v-flex>
              <v-flex xs9 md9>{{order.seller}}
                <v-icon small>keyboard_arrow_right</v-icon>
              </v-flex>
              <v-flex xs2 md1>
                <small class="font-weight-black">¥{{order.strikePrice}}</small>
              </v-flex>
              <v-flex xs2 md1>
                <small class="caption red--text font-weight-black">{{order.state | dict('orderState')}}</small>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-flex>
          <router-link :to="order.originalLink" class="grey lighten-5">

            <v-flex xs12>
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
          </router-link>
          <v-flex xs12>

            <v-expansion-panel popout v-model="expand" expand focusable>

              <v-expansion-panel-content>
                <div slot="header">
                  <small>购买凭证</small>
                </div>

                <v-layout class="grey lighten-5">
                  <v-flex xs2 md1>
                    <div v-viewer="options" class="images clearfix">
                      <img :src="purchaseRoot+order.ticket+'?'+Number(new Date())" :data-source="purchaseRoot+order.ticket+'?'+Number(new Date())"
                        class="image">
                    </div>
                  </v-flex>
                  <v-flex xs10>
                    <v-layout wrap>
                      <v-flex xs12>
                        <small>购买说明:</small>
                      </v-flex>
                      <v-flex class="caption">{{order.ticketExplain}}</v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>

              </v-expansion-panel-content>
            </v-expansion-panel>

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
      expand: [true],
      orders: []
    }
  },
  methods: {
    cancel () {
      this.showCancel = true
    },
    remind () {

    }
  },
  created () {
    this.$http.get('/user/orders', {type: 1, identity: 0, state: '^2'}).then(res => {
      if (res.data.Status) {
        this.orders = res.data.Data
      }
    })
  }
}
</script>
<style scoped>
.image{
    width: 100%;
    height: 50px;
}

</style>
