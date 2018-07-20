<template>
    <v-app >

         <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无取消/关闭的订单</small></div>
               <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
                   <br>
                <v-card >
                    
                    <v-layout row wrap >
                        
                        <v-layout row justify-end align-center>
                            <v-flex xs4 md2>
                                <v-avatar size="30">
                                    <img :src="avatarRoot+order.buyer.id">
                                </v-avatar>{{order.buyer.name}}<v-icon small>keyboard_arrow_right</v-icon>
                            </v-flex>
                            <v-flex offset-xs5 xs3 md3>
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

                        <router-link :to="order.originalLink" class="grey lighten-5">
                        <v-flex xs12>
                            <v-card-text>
                            <v-layout row v-for="pd in order.products" :key="pd.id">
                        <v-flex xs2>
                            <v-card-media height="50">
                                <img :src="purchaseRoot+pd.images" >
                            </v-card-media>
                        </v-flex>
                        <v-flex xs10 >
                            <v-layout row wrap class="caption grey--text" align-center justify-center>
                                <v-flex xs10>名称：{{pd.name}}</v-flex>
                                <v-flex xs2><span>数量:{{pd.quantity}}</span></v-flex>
                                <v-flex xs10>购买渠道:{{pd.shopName}}</v-flex>
                                <v-flex xs2>¥{{pd.price}}</v-flex>
                            </v-layout>
                            
                        </v-flex>
                            </v-layout>
                            </v-card-text>
                        </v-flex>
</router-link>
                        <v-flex xs12>
                              <v-expansion-panel  expand focusable popout v-model="expand">
    <v-expansion-panel-content>
      <div slot="header"><small class="font-weight-bold">购买凭证</small></div>
                           <v-card raised  class="grey--text">
                                                       <v-divider></v-divider>

<v-container grid-list-xs>
                               <v-layout class="grey lighten-5">
                                   <v-flex xs2>
                                       <div v-viewer="options" class="images clearfix">
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

                <v-expansion-panel-content>
      <div slot="header">
         
              <div class="font-weight-bold"><span class="red--text"><v-spacer></v-spacer> <small v-if="order.buyer.cancelReason">买家取消</small><small v-else>卖家取消</small></span>
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
export default {
  data () {
    return {
      orders: [],
      expand: [false, false, false, true]
    }
  },
  methods: {},
  mounted () {
    this.$http
      .get('/user/orders', { type: 1, identity: 0, state: '-1' })
      .then(res => {
        if (res.data.Status) {
          this.orders = res.data.Data
        }
      })
  }
}
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

