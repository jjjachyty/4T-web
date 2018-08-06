<template>
    <v-app >

         <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无待发货的订单</small></div>
               <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
                   <br>
                <v-card >
                    
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
                              <v-expansion-panel popout expand focusable>
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
        <v-expansion-panel-content>
      <div slot="header"><small class="font-weight-bold">物流信息<span class="red--text">{{order.buyer.express.state | dict('expressState')}}</span> </small></div>
                           <v-card raised  class="grey--text">
<v-container>
                            <v-layout wrap>
                                <v-flex xs6><small>快递公司:{{order.buyer.express.name}}</small></v-flex>
                                <v-flex xs6><small>快递单号:{{order.buyer.express.number}}</small></v-flex>
                                <v-flex xs12><small>发货时间:{{order.buyer.express.createAt | formatDate("YYYY-MM-DD HH:mm:ss")}}</small></v-flex>
                                <v-flex xs12 v-if="order.buyer.express.arrivedAt"><small>物流到达:{{order.buyer.express.updateAt | formatDate("YYYY-MM-DD HH:mm:ss")}}到达{{order.buyer.express.arrivedAt}}</small></v-flex>
                                <v-flex xs6 v-if="order.buyer.express.courier"><v-icon small>account</v-icon><small>派送员:{{order.buyer.express.courier}}</small></v-flex>
                                <v-flex xs6 v-if="order.buyer.express.courier"><v-icon small>phone</v-icon><small>电话:<a :href="'tel:'+order.buyer.express.contactNumber">{{order.buyer.express.contactNumber}}</a></small></v-flex>

                            </v-layout>
</v-container>
                           </v-card>
                        
    </v-expansion-panel-content>
              <v-expansion-panel-content v-if="order.state!='4'">
                <div slot="header" class="rate">

  <small class="font-weight-bold">评价</small>
                  <small class="font-weight-bold red--text" v-if="order.state=='41'">卖家已评论</small>
                  <small class="font-weight-bold red--text" v-if="order.state=='41'">买家已评论</small>
                  <small class="font-weight-bold red--text" v-if="order.state=='43'">已互评</small>
                </div>
                <v-container class="caption grey--text">
                  <v-layout row wrap>
                    <v-flex xs12 class="text-xs-left">
                      <v-layout row wrap align-center>
                        <v-flex xs1>
                          <v-avatar size="30">
                            <img :src="avatarRoot+order.buyer.id">
                          </v-avatar>

                        </v-flex>
                        <v-flex xs11>
                          <v-layout row wrap>
                            <v-flex xs12>
                              <rate class="rate" :length="5" :value="order.buyer.evaluateRate" :readonly="true" :ratedesc="['非常糟糕', '糟糕的', '一般', '好', '非常好']"
                              />
                            </v-flex>
                            <v-flex xs12>
                              <v-chip small v-if="order.buyer.evaluate"> {{order.buyer.evaluate}}</v-chip>
                              <small v-else class="grey--text">还未评价</small>
                            </v-flex>
                          </v-layout>

                        </v-flex>
                      </v-layout>

                    </v-flex>
                    <v-flex xs12 class="text-xs-right">
                      <v-layout row wrap align-center>

                        <v-flex xs11>
                          <v-layout row wrap>
                            <v-flex xs12 class="text-xs-right">
                             <rate  class="rate rate-seller" :length="5" :value="order.seller.evaluateRate" :readonly="true" :ratedesc="['非常糟糕', '糟糕的', '一般', '好', '非常好']"
                              />
                            </v-flex>
                            <v-flex xs12>
                              <v-chip small v-if="order.seller.evaluate"> {{order.seller.evaluate}}</v-chip>
                              <small v-else class="grey--text">还未评价</small>
                            </v-flex>
                          </v-layout>

                        </v-flex>
                                                <v-flex xs1>
                          <v-avatar size="30">
                            <img :src="avatarRoot+order.seller.id">
                          </v-avatar>

                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>

                </v-container>

              </v-expansion-panel-content>
  </v-expansion-panel>
  <v-card-actions >
     <v-spacer></v-spacer> <v-btn color="primary" v-if="order.state != '42' && order.state != '43'" @click="showEvaluate(index)" small outline>评论</v-btn>
  </v-card-actions>

                        </v-flex>
                    </v-layout>
                </v-card>
</div>
         <v-dialog v-model="showEvaluateState"  :max-width="320">
          <v-card>
    <v-card-title>对买家评分<rate class="rate" :length="5" v-model="evaluateRate" :ratedesc="['非常糟糕', '糟糕的', '一般', '好', '非常好']" />
</v-card-title>
    <v-card-text>
     <v-textarea outline v-model="evaluate" label="对买家评价"></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small outline color="secondary" @click="showEvaluateState = false">取消</v-btn>
      <v-btn small outline color="primary" @click="evaluateSeller">确定</v-btn>
    </v-card-actions>
  </v-card>   
        </v-dialog>       

 


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
      croppa: {},
      showEvaluateState: false,
      orders: [],
      index: null,
      evaluate: "",
      evaluateRate: 0
    };
  },
  methods: {
    showEvaluate(index) {
      this.index = index;
      this.showEvaluateState = true;
    },
    evaluateSeller() {
      var order = this.orders[this.index];
      if (this.evaluateRate < 1) {
        return this.$store.commit("INFO", "给我一个评分吧");
      }
      console.log(this.evaluate.length, this.evaluate.length > 10);
      if (this.evaluate.length < 10) {
        return this.$store.commit("INFO", "给我10个字以上的评价吧");
      }
      this.$http
        .putJson("/user/order/" + order.id, {
          seller: {
            evaluate: this.evaluate,
            evaluateRate: this.evaluateRate
          },
          type: "1",
          state: "4"
        })
        .then(res => {
          if (res.data.Status) {
            this.showEvaluateState = false;
            this.$store.commit("SUCCESS", "评论成功");
            this.orders[this.index].seller.evaluate = this.evaluate;
            this.orders[this.index].seller.evaluateRate = this.evaluateRate;
          }
        });
    }
  },
  mounted() {
    this.$http
      .get("/user/orders", { type: 1, identity: 1, state: 4 })
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
.rate-seller {
  float: right;
}
</style>
<style>
.Rate__star {
  padding: 0px !important;
}
.return-money {
  float: right;
}
</style>