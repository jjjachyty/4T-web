<template>
    <v-app >

         <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无退货退款的订单</small></div>
               <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
                   <br>
                <v-card >
                    
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
        <v-expansion-panel-content>
      <div slot="header"><small class="font-weight-bold">物流信息 <span class="red--text">{{order.buyer.express.state | dict('expressState')}}</span></small></div>
                           <v-card raised  class="grey--text">
<v-container>
                            <v-layout row wrap justify-start>
                                <v-flex xs6 md4><small>快递公司:{{order.buyer.express.name}}</small></v-flex>
                                <v-flex xs6 md4><small>快递单号:{{order.buyer.express.number}}</small></v-flex>
                                <v-flex xs6 md4><small>发货时间:{{order.buyer.express.createAt | formatDate("YYYY-MM-DD HH:mm:ss")}}</small></v-flex>
                                <v-flex xs12><small>物流到达:{{order.buyer.express.updateAt | formatDate("YYYY-MM-DD HH:mm:ss")}}到达{{order.buyer.express.arrivedAt}}</small></v-flex>
                                <v-flex xs6 md4><v-icon small>account_circle</v-icon><small>派送员:{{order.buyer.express.courier}}</small></v-flex>
                                <v-flex xs6 md4><v-icon small>contact_phone</v-icon><small>电话:<a :href="'tel:'+order.buyer.express.contactNumber">{{order.buyer.express.contactNumber}}</a></small></v-flex>

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
            <v-card-media height="70">
                      <img :src="purchaseRoot+order.buyer.returnTicket">
                    </v-card-media>

    </v-flex>

</v-layout>
</v-container>
                        
    </v-expansion-panel-content>
  </v-expansion-panel>

                        </v-flex>
                        <v-flex>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn small outline color="secondary" v-if="order.state == '50' || order.state == '51'" @click="refuse(index)">拒绝</v-btn>
                                <v-btn small outline v-if="order.state == '50'" color="secondary" @click="returnMoney(index)">仅退款</v-btn>
                                <v-btn small outline v-if="order.state == '51'" color="primary" @click="showReturnProduct(index)" >退货</v-btn>
                            </v-card-actions>
                            <v-card-text v-if="showReturn">
                                <v-card flat>
                                     <v-autocomplete
              v-model="returnAddress"
              :items="address"
              ref="returnAddress"
              color="blue-grey lighten-2"
              label="收货地址"
               :rules="[v => !!v.phone || '不能为空']"
            no-data-text="请前往设置->收货地址中添加"
              
            >
              <template
                slot="selection"
                slot-scope="data"
              >
                <!-- <v-chip
                  :selected="data.selected"
                  close
                  class="chip--select-multi"
                  @input="data.parent.selectItem(data.item)"
                > -->
                 
                
                 <v-list two-line="">
                     <v-list-tile-content>
              <v-list-tile-title> <small class="grey--text">{{data.item.userName}}</small>-<small class="grey--text">{{data.item.phone}}</small></v-list-tile-title>
              <v-list-tile-sub-title> <small>{{data.item.province}}{{data.item.city}}{{data.item.county}}{{data.item.street}}</small></v-list-tile-sub-title>
            </v-list-tile-content>
                 </v-list>
                <!-- </v-chip> -->
              </template>
              <template
                slot="item"
                slot-scope="data"
              >
                
                <template>
                  <v-list-tile-content>
                      <v-layout align-center justify-center>
                          <v-flex class="caption grey--text" xs2 md1 v-if="data.item.default">默认</v-flex>
                          <v-flex>
                              <v-layout>
                                  <v-flex>
                                       <v-list-tile-title>{{data.item.userName}}-{{data.item.phone}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{data.item.province}}{{data.item.city}}{{data.item.county}}</v-list-tile-sub-title>
                                  </v-flex>
                              </v-layout>
                          </v-flex>
                      </v-layout>                   
                  </v-list-tile-content>
                </template>
              </template>
            </v-autocomplete>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small outline @click="showReturn = !showReturn">取消</v-btn>
                <v-btn small outline @click="returnProduct" color="primary">退货退款</v-btn>
            </v-card-actions>
                                </v-card>
                            </v-card-text>
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
      index: null,
      returnAddress: {},
      showReturn: false,
      address: [],
      expand: [false, false, false, true]
    };
  },
  methods: {
    refuse(index) {
      var order = this.orders[index];
      this.$http
        .putJson("/user/order/" + order.id, {
          id: order.id,
          state: "500"
        })
        .then(res => {
          if (res.data.Status) {
            this.$store.commit(
              "SUCCESS",
              "拒绝成功，建议您与买家沟通具体问题并给予解决"
            );
            this.orders[this.index].state = "500";
          } else {
            this.$store.commit("ERROR", res.data.Error.Err);
          }
        });
    },
    showReturnProduct(index) {
      this.index = index;
      this.showReturn = true;
    },
    returnMoney(index) {
      var order = this.orders[index];
      this.$http
        .putJson("/user/order/" + order.id, {
          id: order.id,
          state: "501"
        })
        .then(res => {
          if (res.data.Status) {
            this.$store.commit("SUCCESS", "退款成功");
            this.orders[this.index].state = "501";
          } else {
            this.$store.commit("ERROR", res.data.Error.Err);
          }
        });
    },
    returnProduct() {
      var order = this.orders[this.index];
      if (this.$refs.returnAddress[0].validate()) {
        this.$http
          .putJson("/user/order/" + order.id, {
            id: order.id,
            state: "510",
            seller: { returnAddress: this.returnAddress }
          })
          .then(res => {
            if (res.data.Status) {
              this.$store.commit("SUCCESS", "处理退货请求成功");
              this.orders[this.index].state = "510";
              this.orders[
                this.index
              ].seller.receivingAddress = this.returnAddress;
              this.showReturn = false;
            } else {
              this.$store.commit("ERROR", res.data.Error.Err);
            }
          });
      } else {
        this.$refs.returnAddress[0].error = true;
      }
    }
  },
  created() {
    this.$http
      .get("/user/orders", { type: 1, identity: 1, state: "^5" })
      .then(res => {
        if (res.data.Status) {
          this.orders = res.data.Data;
        }
      });

    this.$http.get("/user/address", {}).then(res => {
      if (res.data.Status) {
        this.address = res.data.Data.address;
        this.receivingAddress = res.data.Data.address[0];
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
