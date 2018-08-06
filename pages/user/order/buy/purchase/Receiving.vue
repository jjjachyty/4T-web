<template>
    <v-app>
                          <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无待收货的订单</small></div>
                                 <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
<br>
                <v-card raised>
                    <v-layout row wrap >
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
                              <v-expansion-panel popout v-model="expand" expand focusable>
    <v-expansion-panel-content>
      <div slot="header"><small class="font-weight-bold">购买凭证</small></div>
                           <v-card raised  class="grey--text">
                                                       <v-divider></v-divider>

<v-container grid-list-xs>
                               <v-layout class="grey lighten-5">
                                   <v-flex xs2>
                                       <div v-viewer="viewerOptions" class="images clearfix">
                            <img :src="purchaseRoot+order.ticket+'?'+Number(new Date())" :data-source="purchaseRoot+order.ticket+'?'+Number(new Date())" class="image" >
                        </div>
                                   </v-flex>
                                   <v-flex>
                                       <v-layout wrap>
                                           <v-flex xs12><small>购买说明:</small></v-flex>
                                           <v-flex class="caption">{{order.ticketExplain}}</v-flex>
                                       </v-layout>
                                   </v-flex>
                               </v-layout>
                               </v-container>
                           </v-card>
                        
    </v-expansion-panel-content>
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
      <v-divider></v-divider>

  <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small outline color="teal" @click="showConfirm(index)">确认收货</v-btn>
  </v-card-actions>
                        </v-flex>
                    </v-layout>
                </v-card>
  <v-dialog v-model="confirm" persistent max-width="290">
      <v-card>
        <v-card-title class="headline warning white--text">请确认已经收到货？</v-card-title>
        <v-card-text>
<v-subheader>确认收货会将付款打给卖家</v-subheader>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="confirm = false">取消</v-btn>
          <v-btn color="green darken-1" flat @click.native="received">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      expand: [false, true],
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
      this.$http.get("/user/orderreceived/" + order.id, {}).then(res => {
        if (res.data.Status) {
          this.$store.commit("SUCCESS", "确认收货成功");
          this.orders.splice(this.index, 1);
        } else {
          this.$store.commit("ERROR", res.data.Error.Err);
        }
      });
    }
  },
  mounted() {
    this.$http
      .get("/user/orders", { type: 1, identity: 0, state: "^3" })
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
