<template>
    <v-app>
                          <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无待收货的订单</small></div>
                                 <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
<br>
                <v-card raised>
                    <v-layout row wrap >
                                                <v-flex xs12 >
                          <Header :order="order"></Header>
                        </v-flex>

                        <v-flex xs12 class="grey lighten-5">
                                                <router-link :to="order.originalLink" >

                            <v-card-text>
                <Product :products="order.products"></Product>
                            </v-card-text>
                            </router-link>
                        </v-flex>

                        <v-flex xs12>
                              <v-expansion-panel popout expand focusable>
        <v-expansion-panel-content value="true">
      <div slot="header"><small class="font-weight-bold">物流信息 <span class="red--text">{{order.buyer.express.state | dict('expressState')}}</span></small></div>
                           <v-card raised  class="grey--text">
<v-container>
                            <v-layout row wrap justify-start>
                                <v-flex xs6><small>快递公司:{{order.buyer.express.name}}</small></v-flex>
                                <v-flex xs6><small>快递单号:{{order.buyer.express.number}}</small></v-flex>
                                <v-flex xs12><small>发货时间:{{order.buyer.express.createAt | formatDate("YYYY-MM-DD HH:mm:ss")}}</small></v-flex>
                                <v-flex xs12 v-if="order.buyer.express.arrivedAt"><small>物流到达:{{order.buyer.express.updateAt | formatDate("YYYY-MM-DD HH:mm:ss")}}到达{{order.buyer.express.arrivedAt}}</small></v-flex>
                                <v-flex xs6 v-if="courier"><v-icon small>account_circle</v-icon><small>派送员:{{order.buyer.express.courier}}</small></v-flex>
                                <v-flex xs6 v-if="courier"><v-icon small>contact_phone</v-icon><small>电话:<a :href="'tel:'+order.buyer.express.contactNumber">{{order.buyer.express.contactNumber}}</a></small></v-flex>

                            </v-layout>
</v-container>
                           </v-card>
                        
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
      confirm: false,
      otherReason: null,
      reason: null,
      showCancel: false,
      index: null,
      ticket: {},
      orders: []
    };
  },
  methods: {
    cancel() {
      this.showCancel = true;
    },
    showConfirm(index) {
      this.confirm = true;
      this.index = index;
    },
    received() {
      var order = this.orders[this.index];
      this.$http
        .putJson("/user/order/" + order.id, {
          id: order.id,
          type: "1",
          state: "3"
        })
        .then(res => {
          if (res.data.Status) {
            this.$store.commit("SUCCESS", "取消订单成功");
            this.orders.splice(this.index, 1);
          } else {
            this.$store.commit("ERROR", res.data.Error.Err);
          }
        });
    }
  },
  created() {
    this.$http
      .get("/user/orders", { type: 1, identity: 1, state: "^3" })
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
