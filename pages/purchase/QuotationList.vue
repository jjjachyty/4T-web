<template>
    <div>
      <div  v-if="purchase.quotationOrder" class="text-xs-center">
        <small class="grey--text">暂无人报价...</small>
      </div>
                  <v-expansion-panel v-else>
          <v-expansion-panel-content v-for="(qo,sq) in purchase.quotationOrders" :key="qo.id">
            <div slot="header" v-bind:class="{'grey--text':qo.state == '0'}">
              <v-layout row wrap>

                                <v-flex md1 xs2>
                <v-avatar size="40"><img :src="avatarRoot+qo.createBy"></v-avatar>
                
                  </v-flex>

           


                <v-flex md4 xs4>
                  <v-layout row wrap>
                    <v-flex md12 xs12 >{{qo.creator}}</v-flex>
                     <v-flex md4 xs12>
                       <v-icon small>pin_drop</v-icon><small class="caption grey--text">重庆</small>
                       <!-- /<small class="caption grey--text">3单</small> -->
                     </v-flex>
                  </v-layout>

                </v-flex>
                     <v-flex md3 xs6>
                  <span class="caption"><v-icon :color="qo.state=='1'?'black':'grey'" small>timer</v-icon>{{qo.expiryTime |formatDate('HH:mm YYYY/MM/DD')}}前有效</span>
                  </v-flex>
                  <v-flex md2 xs6 class="text-xs-center text-md-center"><span v-bind:class="{'black--text':qo.state == '1','caption':true}">{{qo.expiryTime |formatDate('YYYY/MM/DD')}}发货</span></v-flex>

                <v-flex md1 xs6 class="text-xs-right text-md-left">
                    <span class="title amount">
                        <span v-bind:class="{'red--text':qo.state == '1','body-2':true}">¥{{qo.amount}}</span>
                        <br>
                        <span v-bind:class="{'red--text':qo.state == '1','caption':true}">费¥{{qo.charge}}</span>
                    </span>
                    
                </v-flex>

                <v-flex v-if="qo.refuseReason" offset-xs1 xs12 class="caption">
                    <span>拒绝原因:<small class="red--text ">{{qo.reasonType | dict('reasonType')}}</small></span>
                    <span>拒绝理由:<small class="red--text ">{{qo.refuseReason}}</small></span>
                </v-flex>
              </v-layout>
                
            </div>
          <v-card> 
            <v-card-text class="quotation-content">
                <v-card v-if="qo" v-for="(product,index) in qo.products" :key="product.id" class="quotation-item">
            <v-layout row wrap align-center v-bind:class="{'grey--text':qo.state == '0'}">
              <v-flex xs1 md1>
                <span class="body-1">({{index+1}}).</span>
              </v-flex>
              <v-flex md2 xs3>
                 <div v-viewer="options" class="images clearfix">
                            <img :src="purchaseRoot+product.images" :data-source="purchaseRoot+product.images" class="image" height="100" width="100">
                        </div>
              </v-flex>
              <v-flex xs8>
                <v-layout row wrap>
                  <v-flex md3 xs6>
                名称:<span class="caption">{{product.name}}</span>
              </v-flex>
              <v-flex xs6 md2>
                数量:<span class=" caption">{{product.quantity}}</span>
              </v-flex>
              <v-flex xs6 md2 >渠道:{{product.shopName}}</v-flex>
             
              <v-flex xs6 md2>报价:<span  v-bind:class="{'red--text':qo.state == '1'}">¥{{product.price}}</span></v-flex>
                </v-layout>
              </v-flex>
              
              
            </v-layout>
            <v-divider></v-divider>
           
          </v-card>
            </v-card-text>
            <v-divider></v-divider>
               <v-card-actions>
                 <div class="container text-xs-center"  v-if="qo.state == '1' && purchase.createBy == $store.state.User.user.id">
                 <v-btn  color="primary" @click="showRefuse(qo)">拒绝</v-btn>
                 
              <v-btn  color="secondary" @click="purchase(qo)">代购</v-btn>
              </div>
              <div v-if="(qo.buyByID == $store.state.User.user.id ) && qo.state == '0' && qo.allowRepeat" class="container text-xs-center" color="primary" @click="editQuotation(index)">
                  <v-btn color="primary">修改</v-btn>
              </div>
              
               </v-card-actions>
          </v-card>
           </v-expansion-panel-content>
  </v-expansion-panel>

            <v-dialog v-model="refuseFlag" max-width="290">
      <v-card>
        <v-card-text>
            <v-switch v-model="allowRepeat" :label="`${allowRepeat?'允许再次报价':'不允许再次报价'}`"></v-switch>
            <v-radio-group v-model="reasonType" column>
            <v-radio
                label="代购费高"
                color="red"
                value="0"
              ></v-radio>
              <v-radio
                label="商品价格高"
                color="red darken-3"
                value="1"
              ></v-radio>
              <v-radio
                label="渠道非正品"
                color="indigo"
                value="2"
              ></v-radio>
              <v-radio
                label="发货时间长"
                color="indigo darken-3"
                value="3"
              ></v-radio>
              <v-radio
                label="其他"
                color="orange"
                value="4"
              ></v-radio>
 
            </v-radio-group>
          <v-text-field v-model="reason"  ref="reason" :rules="reasonRules" required textarea label="详细说明" placeholder="请填写详细说明"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat="flat" @click.native="refuseFlag = false">取消</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="refuse">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

   <QuotationDialog :quotationOrder="opQuotationOrder" :dialog="dialog" :type="editIndex" :purchase="purchase" @closeDialog="closeDialog"></QuotationDialog>

    </div>
</template>
<script>
import QuotationDialog from './QuotationDialog'

export default {
  props: ['purchase'],
  components: {
    QuotationDialog
  },

  data () {
    return {
      repeat: true,
      reason: '',
      refuseFlag: false,
      dialog: false,
      reasonType: '0',
      editIndex: null,
      allowRepeat: true,
      opQuotationOrder: {},
      reasonRules: [
        v => !!v || '还是详细说明一下吧',
        v => (v && v.length >= 10) || '再详细点儿吧 10个字都没有呢'
      ]
    }
  },
  methods: {
    closeDialog () {
      this.dialog = false
    },
    editQuotation (index) {
      this.opQuotationOrder = JSON.parse(JSON.stringify(purchase.quotationOrders[index]))
      this.opQuotationOrder.expiryTime = null
      this.opQuotationOrder.deliveryTime = null
      this.dialog = true
      this.editIndex = index
    },
    showRefuse (quotation) { // 显示拒绝订单对话框
      this.refuseFlag = true
      this.opQuotationOrder = quotation
      console.log('purchase quotation', quotation)
    },
    refuse () { // 拒绝该订单
      if (this.$refs.reason.validate() || this.$refs.reason.focus()) {
        this.$http.post('/user/refusequotation', {purchaseID: this.purchase.id, quotationID: this.opQuotationOrder.id, reasonType: this.reasonType, reason: this.reason, allowRepeat: this.allowRepeat}).then(res => {
          if (res.data.Status) {
            this.refuseFlag = false
            this.$store.commit('SUCCESS', '拒绝该报价成功,重新进入报价中')
          } else {
            this.$store.commit('ERROR', res.data.Error.Err)
          }
        }).catch(res => {
          this.$store.commit('ERROR', res.data)
        })
      }
    }
  }
}
</script>
