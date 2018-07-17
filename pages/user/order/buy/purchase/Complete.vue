<template>
    <v-app >

         <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无待发货的订单</small></div>
               <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
                   <br>
                <v-card >
                    
                    <v-layout row wrap >
                        
                        <v-flex xs12 >
                           <v-layout row align-center justify-center>
                            <v-flex xs2 md1><v-avatar size="30"><img :src="avatarRoot+order.sellBy"></v-avatar></v-flex>
                            <v-flex xs9 md9>{{order.seller}}<v-icon small>keyboard_arrow_right</v-icon></v-flex>  
                            <v-flex xs2 md1><small class="font-weight-black">¥{{order.strikePrice}}</small></v-flex>
                            <v-flex xs2 md1><small class="caption red--text font-weight-black">{{order.state | dict('orderState')}}</small></v-flex> 
                            </v-layout>
                            <v-divider></v-divider>
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
                              <v-expansion-panel popout v-model="expand" expand focusable>
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
      <div slot="header"><small class="font-weight-bold">物流信息<span class="red--text">{{order.express.state}}</span> </small></div>
                           <v-card raised  class="grey--text">
<v-container>
                            <v-layout wrap>
                                <v-flex><small>快递公司:{{order.express.name}}</small></v-flex>
                                <v-flex><small>快递单号:{{order.express.number}}</small></v-flex>
                                <v-flex><small>发货时间:{{order.express.createAt | formatDate("YYYY-MM-DD HH:mm:ss")}}</small></v-flex>
                                <v-flex><small>物流到达:{{order.express.updateAt | formatDate("YYYY-MM-DD HH:mm:ss")}}到达{{order.express.arrivedAt}}</small></v-flex>
                                <v-flex xs6><v-icon small>account</v-icon><small>派送员:{{order.express.courier}}</small></v-flex>
                                <v-flex xs6><v-icon small>phone</v-icon><small>电话:<a :href="'tel:'+order.express.contactNumber">{{order.express.contactNumber}}</a></small></v-flex>

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
  </v-expansion-panel>
  <v-card-actions >
     <v-spacer></v-spacer> <v-btn v-if="!order.reviews" small outline>评论</v-btn>
     <v-btn small outline color="red">退款退货</v-btn>
  </v-card-actions>
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
      expand: [false, false, true]
    }
  },
  methods: {

  },
  created () {
    this.$http.get('/user/orders', {type: 1, identity: 0, state: 4}).then(res => {
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
.rate{
 display:flex;
 padding:0px;
 align-items: center;
}


</style>
<style>
.Rate__star{
    padding:0px !important;
}
</style>