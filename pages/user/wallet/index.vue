<template>
    <v-app> 
         <v-container>
             <v-layout justify-center>
                 <v-flex md6  xs12>

            <v-card>
                <v-layout row wrap justify-center>
                    <v-flex xs12 class="text-xs-center">
                      总余额 <span class="headline red--text">¥{{wallet.totalAmount}}</span> 
                      <v-btn small flat color="primary" @click="showApplyCash = !showApplyCash"><small>提现</small></v-btn>
                       <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 v-if="!showApplyCash">
                        <v-tabs grow>
                            <v-tab href="#transactions">
                                收入记录
                            </v-tab>
                            <v-tab-item id="transactions">
                                <div v-for="tran in transactions" :key="tran.id">
                                    <v-card>
                                        <v-card-title height="50"><span v-if="$store.state.user.id == tran.seller"><v-icon small>add</v-icon>收入</span><span v-else>支出</span><v-spacer></v-spacer><span class="red--text">¥{{tran.amount}}</span></v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                            <v-layout wrap>
                                                <v-flex xs12>订单号:<span class="grey--text">{{tran.orderID}}</span></v-flex>

                                                <v-flex xs12>支付人:              <v-avatar size="20">
                <img :src="avatarRoot+tran.buyer">
              </v-avatar></v-flex>
                                                              <v-flex xs12>支付时间:<span class="grey--text">{{tran.createAt|formatDate("YYYY-MM-DD HH:mm:ss")}}</span></v-flex>

                                            </v-layout>
                                        </v-card-text>
                                    </v-card>
                                    <br>
                                </div>
                            </v-tab-item>
                            <v-tab href="#applycashs">
                                提现记录
                            </v-tab>
                            <v-tab-item id="applycashs">
                                {{applyCashs}}
                            </v-tab-item>
                        </v-tabs>
                    </v-flex>
                    <v-flex v-if="showApplyCash">
                          <v-form ref="form" v-model="valid" lazy-validation>

                            <v-layout wrap align-center justify-center>

                            <v-flex xs12 md5>
                            <v-text-field :error-messages="bankCodeErrors" 
                     v-model="bank.number" clearable mask="####-####-####-#######" label="银行卡卡号" @blur="$v.bank.number.$touch()"></v-text-field>
                            </v-flex>
                                <v-flex xs5 md2>
                                    <img v-if="bank.code" :src="'https://apimg.alipay.com/combo.png?d=cashier&t='+bank.code">
                                </v-flex>
                            <v-flex xs12 md5>
                            <v-text-field   prefix="¥" v-model.number="amount" type="number" @blur="$v.amount.$touch()" :error-messages="bankAmountErrors" label="提现金额" :placeholder="wallet.totalAmount+''"></v-text-field>
                            </v-flex>
                            <v-flex xs12 md2 class="text-xs-center">
                                <v-btn small outline color="primary" @click="applyCash">提现</v-btn>
                            </v-flex>
                            </v-layout>
                        </v-form>
                    </v-flex>
                </v-layout>
            </v-card>
                    </v-flex>
             </v-layout>
        </v-container>

         
    </v-app>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    bank: {
      number: {
        required,
        minLength: minLength(16),
        maxLength: maxLength(19),
        validBankCode(value) {
          if (15 < value.length && 20 > value.length) {
            return this.$http.get("/wallet/bancode/" + value, {}).then(res => {
              if (res.data.Status) {
                this.bank.code = res.data.Data;
                return true;
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        }
      }
    },
    amount: {
      required,
      validAmount(value) {
        if (value < this.wallet.totalAmount && value > 0) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  data() {
    return {
      valid: true,
      amount: 0,
      applyCashs: [],
      transactions: [],
      bank: {
        code: "",
        number: ""
      },
      wallet: {
        totalAmount: 5000
      },
      showApplyCash: false
    };
  },
  computed: {
    bankCodeErrors() {
      const errors = [];
      if (!this.$v.bank.number.$dirty) return errors;
      !this.$v.bank.number.minLength && errors.push("银行卡号为16-19位");
      !this.$v.bank.number.required && errors.push("银行卡号不能为空");
      !this.$v.bank.number.validBankCode && errors.push("银行卡号识别错误");

      return errors;
    },
    bankAmountErrors() {
      const errors = [];
      if (!this.$v.amount.$dirty) return errors;
      !this.$v.amount.validAmount && errors.push("提现金额必须大于0小于总金额");
      !this.$v.amount.required && errors.push("金额不能为空");
      return errors;
    }
  },
  methods: {
    applyCash() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$http
          .postJson("/wallet/applycash", {
            amount: this.amount,
            bankCard: { code: this.bank.code, number: this.bank.number }
          })
          .then(res => {
            if (res.data.Status) {
              this.$store.commit("SUCCESS", "申请提现成功,预计2个工作日到账");
            }
          });
      }
    }
  },
  mounted() {
    this.$http.get("/wallet/applycashs", {}).then(res => {
      if (res.data.Status) {
        this.applyCashs = res.data.Data;
      }
    });

    this.$http.get("/wallet/transactions", {}).then(res => {
      if (res.data.Status) {
        this.transactions = res.data.Data;
      }
    });
  }
};
</script>
