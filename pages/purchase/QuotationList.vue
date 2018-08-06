<template>
  <div>
    <div v-if="items.length<1" class="text-xs-center">
      <small class="grey--text">暂无人报价...</small>
    </div>
    <v-expansion-panel v-else>
      <v-expansion-panel-content v-for="(qo,index) in items" :key="qo.id">
        <div slot="header" v-bind:class="{'grey--text':qo.state == '0'}">
          <v-layout row wrap>

            <v-flex md1 xs2>
              <v-avatar size="40">
                <img :src="avatarRoot+qo.createBy">
              </v-avatar>

            </v-flex>
            <v-flex md3 xs3>
              <v-layout row wrap>
                <v-flex md12 xs12>{{qo.creator}}</v-flex>
                <v-flex md4 xs12>
                  <v-icon small>pin_drop</v-icon>
                  <small class="caption grey--text">重庆</small>
                  <!-- /<small class="caption grey--text">3单</small> -->
                </v-flex>
              </v-layout>

            </v-flex>
            <v-flex md5 xs5 class="text-xs-center">
              <span class="caption" v-if="qo.state=='1'">
                <v-icon :color="qo.state=='1'?'black':'grey'" small>timer</v-icon>今天{{qo.expiryTime |formatDate('HH:mm')}}前有效</span>
              <small  v-else>{{qo.state | dict('quotationType')}}</small>
            </v-flex>

            <v-flex md3 xs2 >
              <span v-bind:class="{'red--text':qo.state == '1','body-1':true}">¥{{qo.amount}}</span>
            
              <span v-bind:class="{'red--text':qo.state == '1','caption':true}">¥{{qo.charge}}</span>

            </v-flex>
          </v-layout>

        </div>
        <v-card>
          <v-card-text class="quotation-content">
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12 md6 >
                  <span v-bind:class="{'black--text':qo.state == '1','caption':true}">预计发货时间:{{qo.deliveryTime |formatDate('YYYY/MM/DD')}}</span>
                </v-flex>
                <v-flex v-if="qo.state == '0'" xs12 class="caption" md6>
                  <span>拒绝理由:
                    <small class="red--text ">{{qo.refuseReason}}</small>
                  </span>
                </v-flex>

              </v-layout>
            </v-card-text>

            <v-card v-if="qo" v-for="(product,index) in qo.products" :key="product.id" class="quotation-item">
              <v-layout row wrap align-center v-bind:class="{'grey--text':qo.state == '0'}">
          
                <v-flex md2 xs3>
                  <div v-viewer="viewerOptions" class="images clearfix">
                    <img :src="purchaseRoot+product.images" :data-source="purchaseRoot+product.images" class="image" height="100" width="100">
                  </div>
                </v-flex>
                <v-flex xs8>
                  <v-layout row wrap>
                    <v-flex md3 xs8>
                      名称:
                      <span class="caption">{{product.name}}</span>
                    </v-flex>
                    <v-flex xs4 md2>
                      数量:
                      <span class=" caption">{{product.quantity}}</span>
                    </v-flex>
                    <v-flex xs8 md2>渠道:{{product.shopName}}</v-flex>

                    <v-flex xs4 md2>报价:
                      <span v-bind:class="{'red--text':qo.state == '1'}">¥{{product.price}}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>


              </v-layout>
              <v-divider></v-divider>

            </v-card>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="container text-xs-center" v-if="qo.state == '1' && purchase.createBy == $store.state.user.id">
              <v-btn small color="primary" @click="showRefuse(index)">拒绝</v-btn>

              <v-btn small color="secondary" @click="confirm(index)">让代购</v-btn>
            </div>
            <div v-if="(qo.buyByID == $store.state.user.id ) && qo.state == '0' && qo.allowRepeat" class="container text-xs-center" color="primary"
              @click="editQuotation(index)">
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
          <v-radio-group v-model="reason" column>
            <v-radio label="代购费高" color="red" value="代购费高"></v-radio>
            <v-radio label="商品价格高" color="red darken-3" value="商品价格高"></v-radio>
            <v-radio label="渠道非正品" color="indigo" value="渠道非正品"></v-radio>
            <v-radio label="发货时间长" color="indigo darken-3" value="发货时间长"></v-radio>
            <v-radio label="其他" color="orange" value="其他"></v-radio>

          </v-radio-group>
          <v-text-field v-show="reason =='其他' " v-model="otherReason" ref="reason" :rules="reasonRules" required textarea label="详细说明" placeholder="请填写详细说明"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat="flat" @click.native="refuseFlag = false">取消</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="refuse">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <QuotationDialog :quotationOrder="opQuotationOrder" :dialog="dialog" :type="editIndex" :purchase="purchase" @closeDialog="closeDialog"></QuotationDialog>

                        <v-dialog persistent v-model="showWxpay" max-width="290">
                            
                            <v-card class="text-xs-center">
                            <v-card-title class="green white--text">请使用微信扫码支付</v-card-title>
                            <v-card-text>
                                                            <qrcode v-model="wxPayCode" :options="{ size: 200 }"></qrcode>

                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn outline color="teal" small @click="checkPay">我已支付</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn outline small color="secondary" @click="showWxpay = false">取消</v-btn>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>

  </div>
</template>
<script>
import QuotationDialog from "./QuotationDialog";

export default {
  props: ["purchase"],
  components: {
    QuotationDialog
  },

  data() {
    return {
      showWxpay: false,
      wxPayCode: null,
      repeat: true,
      reason: "",
      otherReason: "",
      refuseFlag: false,
      dialog: false,
      items: [],
      editIndex: null,
      allowRepeat: true,
      opQuotationOrder: {},
      index: null,
      reasonRules: [
        v => !!v || "还是详细说明一下吧",
        v => (v && v.length >= 10) || "再详细点儿吧 10个字都没有呢"
      ]
    };
  },
  computed: {},
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    editQuotation(index) {
      this.opQuotationOrder = JSON.parse(
        JSON.stringify(purchase.quotationOrders[index])
      );
      this.opQuotationOrder.expiryTime = null;
      this.opQuotationOrder.deliveryTime = null;
      this.dialog = true;
      this.editIndex = index;
    },

    showRefuse(index) {
      // 显示拒绝订单对话框
      this.refuseFlag = true;
      this.index = index;
    },
    refuse() {
      // 拒绝该订单
      if (this.$refs.reason.validate() || this.$refs.reason.focus()) {
        if ("其他" == this.reason) {
          this.reason = this.otherReason;
        }
        this.$http
          .post("/user/refusequotation", {
            purchaseID: this.purchase.id,
            quotationID: this.items[this.index].id,
            reason: this.reason,
            allowRepeat: this.allowRepeat
          })
          .then(res => {
            if (res.data.Status) {
              this.refuseFlag = false;
              this.$store.commit("SUCCESS", "拒绝该报价成功,重新进入报价中");
              this.items[this.index].state = "0";
              this.purchase.state = "0";
            } else {
              this.$store.commit("ERROR", res.data.Error.Err);
            }
          })
          .catch(res => {
            this.$store.commit("ERROR", res.data);
          });
      }
    },
    confirm(index) {
      this.index = index;
      this.$http
        .post("/user/purchase/confirm", { quotationid: this.items[index].id })
        .then(res => {
          if (res.data.Status) {
            if (
              res.data.Data.ReturnCode == "SUCCESS" &&
              res.data.Data.ResultCode == "SUCCESS"
            ) {
              this.showWxpay = true;
              this.wxPayCode = res.data.Data.CodeURL;
            } else {
              this.$store.commit(
                "ERROR",
                res.data.Data.ReturnMsg + res.data.Data.ErrCodeDes
              );
            }
          }
        });
    },
    checkPay() {
      this.$http
        .get("/user/checkorderpay/" + this.items[this.index].id, {})
        .then(res => {
          if (res.data.Status) {
            if (res.data.Data) {
              // 支付成功
              this.$store.commit("SUCCESS", "支付成功");
              this.showWxpay = false;
              this.purchase.state = "1";
              this.items[this.index].state = "2";
            } else {
              this.$store.commit(
                "ERROR",
                "尚未收到支付金额,如已支付,请前往[我的订单]查看"
              );
            }
          }
        });
    }
  },
  mounted() {
    this.$http
      .get("/purchasequotations", { purchaseid: this.purchase.id })
      .then(res => {
        if (res.data.Status) {
          this.items = res.data.Data;
        }
      });

    // var now = new Date().getTime();

    // var quotationOrderTime = this.string2Date(
    //   this.purchase.quotationOrders[0].expiryTime,
    //   "YYYY-MM-DD HH:mm:ss"
    // ).getTime();
    // console.log(
    //   "报价时间",
    //   quotationOrderTime,
    //   "现在时间",
    //   now,
    //   "相差",
    //   quotationOrderTime - now
    // );
    // if (
    //   "-1" !== this.purchase.quotationOrders[0].state &&
    //   quotationOrderTime - now < 0
    // ) {
    //   this.purchase.quotationOrders[0].state = "-1";
    //   this.$http.get(
    //     "/quotationexpiry/" + this.purchase.quotationOrders[0].id,
    //     {}
    //   );
    // }
  },
  asyncData(context) {}
};
</script>
<style scoped>
img {
  max-height: 100%;
  max-width: 100%;
}
</style>
