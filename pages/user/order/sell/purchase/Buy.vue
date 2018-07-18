<template>
    <v-app>
         <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无待购买的订单</small></div>
                                 <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
<br>
                <v-card raised>
                    <v-layout row wrap >
                          <v-flex xs12>
                        <v-layout row justify-space-between align-center>
                            <v-flex xs4 md2>
                                <v-avatar size="30">
                                    <img :src="avatarRoot+order.buyer.id">
                                </v-avatar>{{order.buyer.name}}<v-icon small>keyboard_arrow_right</v-icon>
                            </v-flex>
                            <v-flex offset-xs4 xs4 md3>
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

                        <v-flex xs12 md12>
                            <v-card-text>
                            <v-layout row v-for="pd in order.products" :key="pd.id">
                        <v-flex xs2 md2>
                            <v-card-media height="70">
                                <img :src="purchaseRoot+pd.images" >
                            </v-card-media>
                        </v-flex>
                        <v-flex xs10 md10>
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
                                <v-btn outline small @click="showCancel = !showCancel">取消订单</v-btn>
                                <v-btn small outline color="deep-orange" @click="showTicket(index)" >已购买</v-btn>
                            </v-card-actions>
                                                        <v-divider></v-divider>
                            <v-card v-if="showCancel" raised color="grey lighten-5">
                                <v-container fluid grid-list-md>
                                <v-card-title>取消原因<small class="red--text">一天只能取消一次</small></v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-radio-group v-model="reason">
                                        <v-radio value="无货" label="无货"></v-radio>
                                        <v-radio value="其他" label="其他"></v-radio>
                                    </v-radio-group>
                                    <v-text-field v-if="reason === '其他'" label="其他原因说明" textarea v-model="otherReason">

                                    </v-text-field>
                                </v-card-text>
                                                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn small outline @click="cancel(index)" color="primary">确定</v-btn>
                                </v-card-actions>
                                </v-container>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 v-if="showBuy">
                                  <v-card>
        <v-card-text>
            <v-layout align-center>
                <v-flex xs4>            <croppa  class="upload-btn"
             :prevent-white-space="true" v-model="croppa" 
            placeholder="点击上传(小于1M)凭证" :accept="'image/*'" :file-size-limit="1024000" :height="125">
          </croppa></v-flex>
                <v-flex xs8>
                    <v-layout row wrap>
                        <v-flex xs12>
                                     <small class="red--text">凭证需要能看清购买地、店铺名称、单价、以及购买时间</small>

                        </v-flex>
                        <v-flex xs12>
          <v-text-field textarea v-model="buyTicketExplain" label="购买说明"></v-text-field>

                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>

        </v-card-text>
        <v-card-actions>
                    <v-spacer></v-spacer>

          <v-btn  color=" primary darken-1" flat @click.native="returned(2)">确定</v-btn>
        </v-card-actions>
      </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
                                 </div>
                
    </v-app>
</template>
<script>
export default {
  data() {
    return {
      showBuy: false,
      otherReason: null,
      reason: "无货",
      showCancel: false,
      buyTicketExplain: "",
      index: null,
      ticket: {},
      orders: []
    };
  },
  methods: {
    cancel(index) {
      var order = this.orders[index];
      if (this.reason == "其他") {
        if (this.otherReason == null) {
          this.$store.commit("ERROR", "请填写其他原因说明");
          return;
        } else {
          this.reason = this.otherReason;
        }
      }

      this.$http
        .putJson("/user/order/" + order.id, {
          id: order.id,
          state: "-1",
          cancelReason: this.reason
        })
        .then(res => {
          if (res.data.Status) {
            this.$store.commit("SUCCESS", "取消订单成功");
            this.orders.splice(index, 1);
          } else {
            this.$store.commit("ERROR", res.data.Error.Err);
          }
        });
    },
    showTicket(index) {
      this.index = index;
      this.showBuy = true;
    },
    buy() {
      if (this.croppa.imageSet) {
        handerReturnTicket().then(res => {
          this.$http
            .putJson("/user/order/" + order.id, {
              id: order.id,
              state: "1",
              buyTicket: this.orders[this.index].id + "_sbt",
              buyTicketExplain: this.buyTicketExplain
            })
            .then(res => {
              if (res.data.Status) {
                this.$store.commit(
                  "SUCCESS",
                  "更新订单成功,已为[待发货],请及时发货"
                );
                this.orders.splice(index, 1);
              } else {
                this.$store.commit("ERROR", res.data.Error.Err);
              }
            });
        });
      } else {
        this.$store.commit("INFO", "还未上传上传凭证哦");
      }
    },
    handerReturnTicket() {
      // 获取上传的token
      return new Promise((resolve, reject) => {
        this.$http.get("/user/uptoken", { type: "3" }).then(res => {
          if (res.data.Status) {
            var uploadToken = res.data.Data;
            if (this.croppa.imageSet) {
              // 需要上传
              var pic = this.croppa.generateDataUrl("image/png");
              var key = this.orders[this.index].id + "_sbt";
              this.$store
                .dispatch("uploadImages", {
                  uploadToken: uploadToken,
                  file: pic,
                  key: key
                })
                .then(res => {
                  resolve(true);
                })
                .catch(res => {
                  this.$store.commit("ERROR", "凭证上传失败");
                  reject(false);
                });
            }
            resolve(true);
          } else {
            this.$store.commit("ERROR", "获取头像上传Token失败，请稍后再试");
            return reject(false);
          }
        });
      });
    }
  },
  created() {
    this.$http
      .get("/user/orders", { type: 1, identity: 1, state: "^1" })
      .then(res => {
        if (res.data.Status) {
          this.orders = res.data.Data;
        }
      });
  }
};
</script>
<style scoped>
image {
  max-width: 100%;
  height: 100px;
}
</style>
<style>
canvas {
  max-width: 100%;
}
</style>
