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
     <v-btn small outline color="red" @click="showReturnDialog(index)">退款退货</v-btn>
  </v-card-actions>
                        </v-flex>
                    </v-layout>
                </v-card>


   <v-dialog v-model="returnDialog"  :max-width="320">
      <v-card>
        <v-card-title class="headline primary white--text">退货原因</v-card-title>
        <v-card-text>
            <div><small>退款金额</small><small class="red--text return-money">¥{{orders[index].strikePrice}}</small></div>
            <v-radio-group v-model="returnReason">
                <v-radio value="商品非正品" label="商品非正品"></v-radio>
                <v-radio value="商品已损坏" label="商品已损坏"></v-radio>
                <v-radio value="商品发错" label="商品发错"></v-radio>
                <v-radio value="其他" label="其他"></v-radio>
                <v-text-field v-if="returnReason == '其他'" textarea v-model="otherReason"></v-text-field>
            </v-radio-group>
            <croppa  class="upload-btn"
             :prevent-white-space="true" v-model="croppa" 
            placeholder="点击上传(小于1M)凭证" :accept="'image/*'" :file-size-limit="1024000" :height="125">
          </croppa>
        </v-card-text>
        <v-card-actions>
          <v-btn color=" secondary darken-1" flat @click.native="returned(1)"><small>未收货</small>仅退款</v-btn>
                    <v-spacer></v-spacer>

          <v-btn  color=" primary darken-1" flat @click.native="returned(2)"><small>已收货</small>退货退款</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</div>
                
    </v-app>
</template>
<script>
export default {

  data () {
    return {
      croppa: {},
      returnDialog: false,
      returnReason: '商品非正品',
      orders: [],
      index: null,
      expand: [false, false, true]
    }
  },
  methods: {
    showReturnDialog (index) {
      this.index = index
      this.returnDialog = true
    },
    returned (type) {
      if (this.croppa.imageSet) { // 需要上传凭证
        this.handerReturnTicket().then(res => {
          this.returnIt(type, true)
        })
      } else {
        this.returnIt(type, false)
      }
    },
    returnIt (type, hasTicket) {
      var state = type === 1 ? '50' : '51'
      var order = this.orders[this.index]
      var returnTicket = hasTicket ? order.id + '_brt' : ''
      this.$http.putJson('/user/order/' + order.id, {id: order.id, type: '1', state: state, returnTicket: returnTicket}).then(res => {
        if (res.data.Status) {
          this.$store.commit('SUCCESS', '申请退货成功，等待卖家处理')
          this.orders[this.index].state = state
          this.returnDialog = false
        } else {
          this.$store.commit('ERROR', res.data.Error.Err)
        }
      })
    },
    handerReturnTicket () {
      // 获取上传的token
      return new Promise((resolve, reject) => {
        this.$http.get('/user/uptoken', {type: '3'}).then(res => {
          if (res.data.Status) {
            var uploadToken = res.data.Data
            if (this.croppa.imageSet) { // 需要上传
              var pic = this.croppa.generateDataUrl('image/png')
              var key = this.orders[this.index].id + '_brt'
              this.$store.dispatch('uploadImages', {uploadToken: uploadToken, file: pic, key: key}).then(res => {
                resolve(true)
              }).catch(res => {
                this.$store.commit('ERROR', '凭证上传失败')
                reject(false)
              })
            }
            resolve(true)
          } else {
            this.$store.commit('ERROR', '获取头像上传Token失败，请稍后再试')
            return reject(false)
          }
        })
      })
    }

  },
  mounted () {
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
.return-money{
    float: right;
}
</style>