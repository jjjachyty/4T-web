<template>
    <v-app>
         <br>
         <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无待购买的订单</small></div>
                <v-card v-else  v-for="(order,index) in orders" :key="order.id">
                    <v-layout row wrap >
                        <router-link :to="order.originalLink">
                        <v-flex xs12 >
                           <v-layout row align-center>
                            <v-flex xs1><v-avatar size="30"><img :src="avatarRoot+order.sellBy"></v-avatar></v-flex>
                            <v-flex xs9></v-flex>  
                            <v-flex xs2><small class="caption red--text font-weight-black">{{order.state | dict('orderState')}}</small></v-flex> 
                            </v-layout>
                            <v-divider></v-divider>
                        </v-flex>
                        <v-flex xs12>
                            <v-card-text>
                            <v-layout row v-for="pd in order.products" :key="pd.id">
                        <v-flex xs2>
                            <v-card-media height="70">
                                <img :src="purchaseRoot+pd.images" >
                            </v-card-media>
                        </v-flex>
                        <v-flex xs10>
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
                            <v-divider></v-divider>
                            <v-card-actions>
                                                         <v-spacer></v-spacer>
                                <v-btn small outline color="deep-orange" @click="showUploadTicket(index)" v-if="!showTicket">已购买</v-btn>
                            </v-card-actions>
                                                        <v-divider></v-divider>

                        </v-flex>
                    </v-layout>
                       <div v-if="showTicket">
                            <v-card-actions  >
                                <v-layout justify-center>
<croppa  :prevent-white-space="true" initial-size="contain"  v-model="ticket" @image-remove="handleRemoveImage(pd)"  :accept="'image/*'"    :file-size-limit="1024000"  placeholder="点击上传购买凭证" placeholder-color="grey">
                            
                                </croppa>
                                </v-layout>
                            </v-card-actions>
                             <v-card-actions>
                                 <v-spacer></v-spacer>
                                    <v-btn small  outline color="secondary" @click="cancelUpload">取消</v-btn>
                                    <v-btn flat  small outline color="primary" @click="buy">确定</v-btn>
                                </v-card-actions>
                      </div>
                </v-card>

                
    </v-app>
</template>
<script>
export default {

  data () {
    return {
      showTicket: false,
      index: null,
      ticket: {},
      orders: []
    }
  },
  methods: {
    showUploadTicket (index) {
      this.index = index
      this.showTicket = true
    },
    cancelUpload () {
      this.showTicket = false
      this.index = null
    },
    buy (orderid) {
      this.handerProductImgs().then(res => {

      })
    },
    handerProductImgs () {
      // 获取上传的token
      return new Promise((resolve, reject) => {
        this.$http.get('/user/uptoken', {type: '4'}).then(res => {
          if (res.data.Status) {
            var uploadToken = res.data.Data
            if (this.ticket.imageSet) {
              var pic = pdImages.generateDataUrl('image/png')
              var key = this.orders[this.index].id
              this.$store.dispatch('uploadImages', {uploadToken: uploadToken, file: pic, key: key}).then(res => {
                resolve(true)
              }).catch(res => {
                this.$store.commit('ERROR', '清单上传失败,请稍后再试')
                reject(false)
              })
            } else {
              this.$store.commit('ERROR', '请上传购买凭证，如清单、发票')
              return reject(false)
            }
          } else {
            this.$store.commit('ERROR', '获取清单上传Token失败，请稍后再试')
            return reject(false)
          }
        })
      })
    }
  },
  created () {
    this.$http.get('/user/orders', {type: 1, identity: 0, state: 1}).then(res => {
      if (res.data.Status) {
        this.orders = res.data.Data
      }
    })
  }
}
</script>
<style scoped>
canvas{
    max-width:100%
}

</style>
