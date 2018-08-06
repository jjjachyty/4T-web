<template>
    <v-app >

         <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无待发货的订单</small></div>
               <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
                   <br>
                <v-card >
                    
                    <v-layout row wrap >
                        
                        <v-flex xs12 >
                                                  <Header :order="order"></Header>

                        </v-flex>
                        <v-flex xs12>
                             <router-link :to="order.originalLink">
                            <v-card-text class="grey lighten-5">
                                <Product :products="order.products"></Product>

                            </v-card-text>
                        </router-link>
                        </v-flex>
                        <v-flex xs12>
                              <v-expansion-panel  expand focusable popout v-model="expand">
    <v-expansion-panel-content>
      <div slot="header"><small class="font-weight-bold">购买凭证</small></div>
                           <v-card raised  class="grey--text">
                                                       <v-divider></v-divider>

<v-container grid-list-xs>
                               <v-layout class="grey lighten-5">
                                   <v-flex xs2>
                                       <div v-viewer="viewerOptions" class="images clearfix">
                            <img :src="purchaseRoot+order.seller.buyTicket+'?'+Number(new Date())" :data-source="purchaseRoot+order.seller.buyTicket+'?'+Number(new Date())" class="image" >
                        </div>
                                   </v-flex>
                                   <v-flex>
                                       <v-layout wrap>
                                           <v-flex xs12><small>购买说明:</small></v-flex>
                                           <v-flex class="caption">{{order.seller.buyTicketExplain}}</v-flex>
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
            <v-expansion-panel-content v-if="order.reviews">
      <div slot="header" class="rate">
         
              <small class="font-weight-bold">评价</small>
              <rate class="rate" :length="5" :value="2" :readonly="true" :ratedesc="['非常糟糕', '糟糕的', '一般', '好', '非常好']" />
          
          </div>
<v-container class="caption grey--text">
    <v-avatar size="20"><img :src="avatarRoot+order.buyBy"></v-avatar>
{{order.reviews}}
</v-container>
                        
    </v-expansion-panel-content>
                <v-expansion-panel-content>
      <div slot="header">
         
              <small class="font-weight-bold">退换货</small>
                        <small class="font-weight-bold red--text">{{order.buyer.returnReason}}</small>

          </div>
<v-container class="caption grey--text">
<v-layout wrap justify-center>
        <v-flex xs3>
            <v-card-media height="70" >
                      <img :src="purchaseRoot+order.buyer.returnTicket">
                    </v-card-media>

    </v-flex>
       <v-flex xs12 v-if="order.state == '510'">
       <v-divider></v-divider>
       <v-subheader>退货地址</v-subheader>
       <v-layout row wrap>
           <v-flex>收货人:{{order.seller.returnAddress.userName}}</v-flex>
           <v-flex>电话:{{order.seller.returnAddress.phone}}</v-flex>
           <v-flex xs12>地址:{{order.seller.returnAddress.province}}{{order.seller.returnAddress.city}}{{order.seller.returnAddress.county}}{{order.seller.returnAddress.street}}</v-flex>
       </v-layout>
   </v-flex>
</v-layout>
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
      .get("/user/orders", { type: 1, identity: 0, state: "^5" })
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
