<template>
    <v-app>

        <div v-if="orders.length < 1" class="text-xs-center">
            <small class="grey--text">暂无取消/关闭的订单</small>
        </div>
        <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
            <br>
            <v-card>

                <v-layout row wrap>
                    <v-flex xs12>
                        <Header :order="order"></Header>

                    </v-flex>


                    <v-flex xs12 md12 class="grey lighten-5">
                        <router-link :to="order.originalLink">
                            <v-card-text class="grey lighten-5">
                                <Product :products="order.products"></Product>

                            </v-card-text>
                        </router-link>
                    </v-flex>

                    <v-flex xs12>
                        <v-expansion-panel expand focusable popout v-model="expand">
                            <v-expansion-panel-content v-if="order.ticket">
                                <div slot="header">
                                    <small class="font-weight-bold">购买凭证</small>
                                </div>
                                <v-card raised class="grey--text">
                                    <v-divider></v-divider>

                                    <v-container grid-list-xs>
                                        <v-layout class="grey lighten-5">
                                            <v-flex xs2>
                                                <div v-viewer="viewerOptions" class="images clearfix">
                                                    <img :src="purchaseRoot+order.ticket+'?'+Number(new Date())" :data-source="purchaseRoot+order.ticket+'?'+Number(new Date())"
                                                        class="image">
                                                </div>
                                            </v-flex>
                                            <v-flex>
                                                <v-layout wrap>
                                                    <v-flex xs12>
                                                        <small>购买说明:</small>
                                                    </v-flex>
                                                    <v-flex class="caption">{{order.ticketExplain}}</v-flex>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card>

                            </v-expansion-panel-content>

                            <v-expansion-panel-content value="true">
                                <div slot="header">

                                    <div class="font-weight-bold">
                                        <span class="red--text">
                                            <v-spacer></v-spacer>
                                            <small v-if="order.buyer.cancelReason">买家取消</small>
                                            <small v-else>卖家取消</small>
                                        </span>
                                    </div>
                                </div>
                                <v-container class="caption grey--text">
                                    {{order.buyer.cancelReason}}
                                </v-container>

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
      orders: [],
      expand: [false, false, false, true]
    };
  },
  methods: {},
  mounted() {
    this.$http
      .get("/user/orders", { type: 1, identity: 0, state: "-1" })
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
.rate {
  display: flex;
  padding: 0px;
  align-items: center;
}
</style>

