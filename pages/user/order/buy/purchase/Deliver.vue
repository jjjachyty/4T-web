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
                                                          <Header :order="order"></Header>

          </v-flex>

            <v-flex xs12>
                                      <v-divider></v-divider>
                        <router-link :to="order.originalLink" class="grey lighten-5">
                        <v-card-text>

                                                                     <Product :products="order.products"></Product>

                        </v-card-text>
                                      </router-link>
            </v-flex>
     
          <v-flex xs12>

            <v-expansion-panel popout v-model="expand" expand focusable>

              <v-expansion-panel-content>
                <div slot="header">
                  <small>购买凭证</small>
                </div>

                <v-layout class="grey lighten-5">
                  <v-flex xs2 md1>
                    <div v-viewer="viewerOptions" class="images clearfix">
                      <img :src="purchaseRoot+order.seller.buyTicket+'?'+Number(new Date())" :data-source="purchaseRoot+order.seller.buyTicket+'?'+Number(new Date())"
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
import Header from "./Header";
import Product from "./Product";
export default {
  components: {
    Header,
    Product
  },
  data() {
    return {
      expand: [true],
      orders: []
    };
  },
  methods: {
    cancel() {
      this.showCancel = true;
    },
    remind() {}
  },
  mounted() {
    this.$http
      .get("/user/orders", { type: 1, identity: 0, state: "^2" })
      .then(res => {
        if (res.data.Status) {
          this.orders = res.data.Data;
        }
      });
  }
};
</script>
<style scoped>
.image {
  width: 100%;
  height: 50px;
}
</style>
