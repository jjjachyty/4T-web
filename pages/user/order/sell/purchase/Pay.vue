<template>
    <v-app>

        <div v-if="orders.length < 1" class="text-xs-center">
            <small class="grey--text">暂无待付款的订单</small>
        </div>

        <div v-else v-for="(order,index) in orders" :key="order.id" class="grey lighten-5">
            <br>
            <v-card raised>
                <v-layout row wrap>

                    <v-flex xs12>
                                                <Header :order="order"></Header>

                    </v-flex>
         
                    <v-flex xs12 class="grey lighten-5">
                        <v-divider></v-divider>
                        <router-link :to="order.originalLink">
                        <v-card-text>

                                                                     <Product :products="order.products"></Product>

                        </v-card-text>
                                      </router-link>
                    </v-flex>
      
                    <v-flex xs12>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <div v-if="!showModify">
                            <v-btn color="warning" outline small v-if="!showDelete" @click="showDelete = !showDelete">
                                关闭订单
                                <v-icon small>close</v-icon>
                            </v-btn>
                            <div v-if="showDelete">
                            <v-btn color="primary" flat small @click="showDelete = !showDelete">
                                <v-icon small>right</v-icon>
                                取消
                            </v-btn>
                            <v-btn color="warning" flat small @click="close(index)">
                                确定关闭？
                                
                            </v-btn>
                            </div>
                            </div>
                            <!-- 修改价格 -->
                            <div v-if="!showDelete"> 
                            <v-btn small outline  color="deep-orange" @click="showModify = !showModify" v-if="!showModify">修改代购费</v-btn>
                            <div v-if="showModify" class="modify">
                                <v-spacer></v-spacer>
                            <v-btn color="teal" flat small @click="showModify = false">
                                取消
                            </v-btn>
                               <s class="red--text">{{order.charge}}</s>
                            <v-text-field ref="charge"  class="modify-text" :error="chargeError" clearable v-model.number="charge" prefix="¥" :width="100" type="number" :rules="[v =>  v >= 0 || '价格需大于等于0']"> </v-text-field>
                            <v-btn color="teal" flat small @click="modify(index)">
                                确定
                            </v-btn>
                            </div>
                            </div>
                        </v-card-actions>
                        <v-divider></v-divider>

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
      chargeError: false,
      showDelete: false,
      showModify: false,
      charge: 0,
      showCancel: false,
      orders: [],
      reason: "我不想要了",
      index: null,
      otherReason: null
    };
  },
  methods: {
    close(index) {
      var order = this.orders[index];
      this.$http
        .putJson("/user/order/" + order.id, {
          id: order.id,
          type: "1",
          state: "-1",
          seller: { cancelReason: this.reason }
        })
        .then(res => {
          if (res.data.Status) {
            this.$store.commit("SUCCESS", "关闭订单成功");
            this.orders.splice(index, 1);
          } else {
            this.$store.commit("ERROR", res.data.Error.Err);
          }
        });
    },
    modify(index) {
      var order = this.orders[index];

      if (this.charge >= 0) {
        this.$http
          .putJson("/user/order/" + order.id, {
            id: order.id,
            type: "1",
            state: "0",
            charge: Number(this.charge)
          })
          .then(res => {
            if (res.data.Status) {
              this.$store.commit("SUCCESS", "修改价格成功");
              var productAmount =
                this.orders[index].strikePrice - this.orders[index].charge;
              this.orders[index].strikePrice =
                productAmount + Number(this.charge);
              this.orders[index].charge = Number(this.charge);
              this.showModify = false;
            } else {
              this.$store.commit("ERROR", res.data.Error.Err);
            }
          });
      } else {
        this.chargeError = true;
      }
    }
  },
  mounted() {
    this.$http
      .get("/user/orders", { type: 1, identity: 1, state: "^0" })
      .then(res => {
        if (res.data.Status) {
          this.orders = res.data.Data;
        }
      });
  }
};
</script>
<style scoped>
.modify {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
}
.modify-text {
  width: 130px;
}
</style>
