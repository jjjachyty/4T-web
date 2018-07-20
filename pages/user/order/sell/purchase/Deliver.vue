<template>
  <v-app>
    <div v-if="orders.length < 1" class="text-xs-center">
      <small class="grey--text">暂无要发货的订单</small>
    </div>
    <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
      <br>
      <v-card >
        <v-layout row wrap >
          <v-flex xs12>
            <Top :order="order"></Top>
          </v-flex>
         

            <v-flex xs12 md12>
               <router-link :to="order.originalLink" >
              <v-card-text class="grey lighten-5">
                <Product :products="order.products"></Product>
              </v-card-text>
               </router-link>
            </v-flex>

          <v-flex xs12>

            <v-expansion-panel popout v-model="expand" expand focusable>

              <!-- <v-expansion-panel-content>
                <div slot="header">
                  <small>购买凭证</small>
                </div>

                <v-layout class="grey lighten-5">
                  <v-flex xs2 md1>
                    <div v-viewer="options" class="images clearfix">
                      <img :src="purchaseRoot+order.buyTicket+'?'+Number(new Date())" :data-source="purchaseRoot+order.buyTicket+'?'+Number(new Date())"
                        class="image">
                    </div>
                  </v-flex>
                  <v-flex xs10>
                    <v-layout wrap>
                      <v-flex xs12>
                        <small>购买说明:</small>
                      </v-flex>
                      <v-flex class="caption">{{order.buyTicketExplain}}</v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>

              </v-expansion-panel-content> -->
                            <v-expansion-panel-content>
                             
                <div slot="header">
                  <small>物流信息</small>
                </div>
                <v-container grid-list-md>
                   <v-form ref="expressForm" lazy-validation>
                <v-layout row wrap class="grey lighten-5" align-center justify-center>
                 <v-flex xs6>
                   收货人:{{order.express.receivingAddress.userName}}
                 </v-flex>
                  <v-flex xs6>
                   电话:{{order.express.receivingAddress.phone}}
                 </v-flex>
                 <v-flex xs12>
                   收货地址:{{order.express.receivingAddress.province+order.express.receivingAddress.city+order.express.receivingAddress.county+order.express.receivingAddress.street}}
                                 <v-divider></v-divider>

                 </v-flex>
                 <v-flex xs8 md5>
                                   <v-autocomplete
                v-model="express.name"
                :items="expresss" 
                placeholder="选择物流公司"
                required
                height="50"
                label="物流公司"
                :rules="[v => !!v || '不能为空']"
                no-data-text="暂无该物流"
                item-text="name"
              item-value="name"
                clearable=""
                autocomplete> 
                  <template slot="selection" slot-scope="data">
                    <!-- <v-chip :selected="data.selected.name" :key="JSON.stringify(data.item.name)" class="chip--select-multi" @input="data.parent.selectItem(data.item)"> -->
                <img :src="'/express/'+data.item.id+'.png'">
                      <!-- {{ data.item.name }} -->
                    <!-- </v-chip> -->
                  </template>
                  <template slot="item" slot-scope="data">
                    <!-- <template v-if="data.item">
                      <v-list-tile-content v-html="data.item.name"></v-list-tile-content>
                    </template>  -->
                    
                    <template>
                      
                      
       
                      <v-list-tile-content>
                          <img :src="'/express/'+data.item.id+'.png'">
                        <!-- <v-list-tile-title v-html="data.item.name"></v-list-tile-title> -->
                      </v-list-tile-content>
                    </template> 
                  </template>
                 </v-autocomplete>

                 </v-flex>
                 
                 <v-flex xs8 md5>
                   <v-text-field height="50" label="快递单号" :rules="[v => !!v || '不能为空']" v-model="express.number" clearable></v-text-field>
                 </v-flex>
                 <v-flex  xs12 md2>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                   <v-btn small outline color="primary" @click="deliver(index)">发货</v-btn>
                 </v-card-actions>
                 </v-flex>

                </v-layout>
                </v-form>
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
import Top from './Top'
import Product from './Product'
export default {
  components: {
    Top,
    Product
  },
  data () {
    return {
      expand: [true],
      orders: [],
      express: {}

    }
  },
  methods: {
    cancel () {
      this.showCancel = true
    },
    deliver (index) {
      var order = this.orders[index]
      this.$http
        .putJson('/user/order/' + order.id, {
          id: order.id,
          state: '2',
          buyer: {express: this.express}
        })
        .then(res => {
          if (res.data.Status) {
            this.$store.commit(
              'SUCCESS',
              '发货成功已更新为[待收货],提醒买家准时收货'
            )
            this.orders.splice(index, 1)
          } else {
            this.$store.commit('ERROR', res.data.Error.Err)
          }
        })
    }
  },
  created () {
    this.$http.get('/user/orders', {type: 1, identity: 1, state: '^2'}).then(res => {
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

</style>
