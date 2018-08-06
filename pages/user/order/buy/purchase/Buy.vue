<template>
    <v-app>
         <div v-if="orders.length < 1" class="text-xs-center"><small class="grey--text">暂无待购买的订单</small></div>
                                 <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
<br>
                <v-card raised>
                    <v-layout row wrap >
                                  <v-flex xs12>
                                                <Header :order="order"></Header>

                    </v-flex>
         
                    <v-flex xs12>
                        <v-divider></v-divider>
                        <router-link :to="order.originalLink" class="grey lighten-5">
                        <v-card-text>

                                                                     <Product :products="order.products"></Product>

                        </v-card-text>
                                      </router-link>
                    </v-flex>
                        <v-flex xs12>
                            <v-divider></v-divider>
                            <v-card-actions>
                                                         <v-spacer></v-spacer>
                                <v-btn outline small @click="showCancel = !showCancel">取消订单</v-btn>
                                <!-- <v-btn small outline color="deep-orange" @click="remind(index)" >提醒购买</v-btn> -->
                            </v-card-actions>
                                                        <v-divider></v-divider>
                            <v-card v-if="showCancel" raised color="grey lighten-5">
                                <v-container fluid grid-list-md>
                                <v-card-title>取消原因<small class="red--text">一天只能取消一次</small></v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-radio-group v-model="reason">
                                       <v-radio value="我不想要了" label="我不想要了"></v-radio>

                                        <v-radio value="卖家一直不购买" label="卖家一直不购买"></v-radio>
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
      otherReason: null,
      reason: "我不想要了",
      showCancel: false,
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
          buyer: { cancelReason: this.reason }
        })
        .then(res => {
          if (res.data.Status) {
            this.$store.commit(
              "SUCCESS",
              "取消订单成功,退款将在三个工作日内返回到支付账户中"
            );
            this.orders.splice(index, 1);
          } else {
            this.$store.commit("ERROR", res.data.Error.Err);
          }
        });
    },
    remind(index) {
      this.index = index;
    }
  },
  mounted() {
    this.$http
      .get("/user/orders", { type: 1, identity: 0, state: "^1" })
      .then(res => {
        if (res.data.Status) {
          this.orders = res.data.Data;
        }
      });
  }
};
</script>
<style scoped>
.image {
  width: 50%;
  height: 100px;
}
</style>
