<template>
  <v-app>


      <v-layout row wrap>

        <v-flex md7 offset-md1 xs12>
          <v-card>
            <v-card-title>
              <v-layout row wrap>

                <v-flex xs8 md10>
                  <v-layout row>
                    <v-flex xs4 md1>
                      <v-badge overlap>
                      <v-avatar size="50">
                        <img :src="avatarRoot+item.createBy">
                      </v-avatar>
                      <span slot="badge" v-if="$store.state.User.user.idCardValid">实</span>
                      </v-badge>

                    </v-flex>
                    <v-flex>
                      <span>{{item.creator}}</span>
                      <br>
                      <small class="grey--text">发布于{{item.createAt|formatDate('YYYY-MM-DD')}}</small>
                      <br>
                      <v-icon small>pin_drop</v-icon>
                      <span class="caption" v-if="item.address">{{item.address.province}} {{item.address.city}}</span>

                      <br>
                    </v-flex>

                  </v-layout>

                </v-flex>

                <v-flex xs4 md2>
                  <p>
                    <v-chip small color="red"  label class="white--text body-2">
                      <div v-if="amount>0"><small class="caption">¥</small>{{item.amount}}
                      </div>
                      <div v-else><small class="caption">求报价</small>
                      </div>
                      </v-chip>
                      <small class="caption red--text">{{item.state | dict('purchaseState')}}</small>
                  </p>

                </v-flex>
              </v-layout>
              <!-- <v-avatar><img :src="avatarRoot+item.createBy"></v-avatar> -->
            </v-card-title>
            <v-divider></v-divider>
            <!-- <v-card-media height="250">
              <carousel class="img-detail" :mouseDrag="true">
                <slide v-for="(img,index) in item.detailImgURLs" :key="index">

                  <img :src="img">

                </slide>
              </carousel>
            </v-card-media> -->

            <v-card-text class="grey--text content">
              <v-subheader>备注说明:</v-subheader>
              <v-container>{{item.content}}</v-container>
            </v-card-text>

            <v-card-text>
              <v-toolbar height="30" class="body-2 font-weight-medium">商品清单：</v-toolbar>
              <v-card >
                <div v-for="(pd,index) in item.products" :key="pd.id">
                  <v-card-title>
                    <span class="title red--text">{{index+1}}.</span>
                    <v-spacer></v-spacer>
                    <small class="red--text" v-if="pd.price>0">¥{{pd.quantity * pd.price}}</small>
                    <small class="red--text" v-else>求报价</small>
                  </v-card-title>
                  <v-layout row justify-center>

                    <v-flex md2 xs3 >
                           <div v-viewer="options" class="images clearfix">
                            <img :src="purchaseRoot+pd.images+'?'+Number(new Date())" :data-source="purchaseRoot+pd.images+'?'+Number(new Date())" class="image" >
                        </div>



                        <!-- <img :src="pd.images" height="100px" v-viewer> -->
                    
                    </v-flex>
                    <v-flex md10 xs10>
                      <v-layout row wrap class="caption">
                        <v-flex xs6 md4>名称:
                          <small class="font-weight-medium">{{pd.name}}</small>
                        </v-flex>
                        <v-flex xs6 md4>数量:
                          <small class="font-weight-medium">{{pd.quantity}}</small>
                        </v-flex>
                        <v-flex xs6 md4>参考渠道:
                          <small class="font-weight-medium">{{pd.shopName}}</small>
                        </v-flex>
                        <v-flex xs6 md4>参考单价:
                          <small class="red--text" v-if="pd.price>0">¥{{pd.price}}</small>
                          <small class="red--text" v-else>求报价</small>
                        </v-flex>

                        <!-- <v-flex xs6 md4>购买渠道:{{pd.shopName}}</v-flex> -->
                        <v-flex xs12>描述:
                          <small class="grey--text font-weight-medium">{{pd.describe}}</small>
                        </v-flex>
                      </v-layout>


                    </v-flex>
                  </v-layout>
                  <v-divider></v-divider>
                </div>
              </v-card>
          </v-card-text>

            <v-card-actions>
              <span>
                <v-chip small :color="item.type == 0?'red':'teal'" label class="white--text">
                  <v-icon small>pin_drop</v-icon>
                  <span class="caption">{{item.destination}}</span>
                </v-chip>
              </span>
              <v-spacer></v-spacer>
              <v-btn small outline color="red" @click="goPurchase" v-if="purchaseFlag">我要代购</v-btn>

              <br>
            </v-card-actions>

          </v-card>
          <v-card>

          </v-card>
          <br>
          <!-- 报价单-->

          <v-card-title height="40" class="body-2 font-weight-medium">代购报价</v-card-title>
           
            <QuotationList  v-if="item.quotationOrders" :purchase="item"></QuotationList>
             <small v-else>暂无人报价,</small>

        </v-flex>
        <v-flex md4 v-if="item.createBy == $store.state.User.user.id">
          <v-card>
            <v-card-title>
              他们在 <span class="primary--text font-weight-medium">{{item.destination}}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <DestinationUser v-if="item.destination" :destination="item.destination" :purchase="item"></DestinationUser>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md4 v-else>
          <v-card>
            <v-card-title>
              其他<span class="primary--text font-weight-medium">{{item.destination}}</span>求购单
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <DestinationPurchase v-if="item.destination" :destination="item.destination" :purchase="item"></DestinationPurchase>
            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>
   
   <QuotationDialog @updateOrders="updateOrders" :quotationOrder="quotationOrder" :dialog="dialog" :type="false" :purchase="item" @closeDialog="closeDialog"></QuotationDialog>
    



  </v-app>
</template>
<script>
// import 'viewerjs/dist/viewer.css'
import QuotationList from './QuotationList'
import QuotationDialog from './QuotationDialog'
import DestinationUser from './DestinationUser'
import DestinationPurchase from './DestinationPurchase'

export default {
  components: {
    QuotationList,
    QuotationDialog,
    DestinationUser,
    DestinationPurchase
  },

  data () {
    return {
      dialog: false,
      refuseFlag: false,
      timeDialog: false,
      opQuotationOrder: {},
      // avatarRoot:avatarRoot,
      quotationOrders: [],
      quotationOrder: {
        products: [],
        charge: 0
      }
    }
  },
  methods: {
    goPurchase () {
      if (this.$store.state.auth.token) {
        this.dialog = true
      } else {
        this.$store.commit('INFO', '请先登录后再代购哦')
        this.$router.replace({
          name: 'login',
          query: { redirect: this.$router.currentRoute.fullPath }
        })
      }
    },
    closeDialog (data) {
      this.dialog = false
    },
    updateOrders (data, index) {
      if (index) {
        this.item.quotationOrders[index] = data
      } else {
        this.item.quotationOrders.push(data)
      }
    },
    purchase (quotation) {
    }
  },
  computed: {
    purchaseFlag: function () {
      var flag = true
      if (this.item.createBy == this.$store.state.User.user.id) {
        flag = false
      }

      this.item.quotationOrders.forEach(pd => {
        if (pd.createBy == this.$store.state.User.user.id) {
          flag = false
        }
      })
      return flag
    }
  },
  mounted () {
    this.quotationOrder.products = JSON.parse(JSON.stringify(this.item.products))
  },
  asyncData (context) {
    var item = {}
    return context.$http.get('/purchase', { id: context.params.id }).then(res => {
      if (res.data.Status) {
        item = res.data.Data
        var productNames = new Array()
        item.products.forEach(element => {
          productNames.push(element.name)
        })

        context.app.head.title = item.destination + '代购' + productNames
        return {item: item}
      }
    }).catch(res => {
      context.error({statusCode: 401, message: res})
    })
  }

}
</script>
<style scoped>
/* .img-detail{
    width: 100%;
    height: auto;
} */
.card__media img {
  height: 100px;
  width: 100px;
}
.quotation-content {
  padding: 0 1% 0 6%;
}
.quotation-item {
  margin-bottom: 10px;
  /* box-shadow: 0px 0px 0px 0.1px grey !important */
}

.amount {
  float: right;
}
.image {
  max-width: 90%;
  max-height: 90%;
}
.content {
  word-wrap: break-word;
}
</style>
