<template>
    <v-app> 
         <v-container>
             <v-layout justify-center>
                 <v-flex md6  xs12>
  <v-form ref="form" v-model="valid" lazy-validation>

            <v-card>
                <v-layout row wrap justify-center>
                    <v-flex xs12 class="text-xs-center">
                      总余额 <span class="headline red--text">¥{{wallet.totalAmount}}</span> 
                      <v-btn small flat color="primary" @click="showApplyCash = !showApplyCash"><small>提现</small></v-btn>
                       <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 v-if="!showApplyCash">
                        <v-tabs grow>
                            <v-tab>
                                收入记录
                            </v-tab>
                            <v-tab>
                                提现记录
                            </v-tab>
                        </v-tabs>
                    </v-flex>
                    <v-flex v-if="showApplyCash">
                        <v-form>
                            <v-layout wrap align-center justify-center>

                            <v-flex xs12 md5>
                            <v-text-field :error-messages="bankCodeErrors" 
                     v-model="bank.number" clearable mask="####-####-####-#######" label="银行卡卡号" @blur="$v.bank.number.$touch()"></v-text-field>
                            </v-flex>
                                <v-flex xs5 md2>
                                    <img v-if="bank.code" :src="'https://apimg.alipay.com/combo.png?d=cashier&t='+bank.code">
                                </v-flex>
                            <v-flex xs12 md5>
                            <v-text-field   prefix="¥" v-model.number="bank.amount" type="number" @blur="$v.bank.amount.$touch()" :error-messages="bankAmountErrors" label="提现金额" :placeholder="wallet.totalAmount+''"></v-text-field>
                            </v-flex>
                            <v-flex xs12 md2 class="text-xs-center">
                                <v-btn small outline color="primary" @click="applyCash">提现</v-btn>
                            </v-flex>
                            </v-layout>
                        </v-form>
                    </v-flex>
                </v-layout>
            </v-card>
  </v-form>
                    </v-flex>
             </v-layout>
        </v-container>

         
    </v-app>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, max } from "vuelidate/lib/validators";
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
      },
      amount: {
        required,
        validAmount(value) {
          if (value > this.wallet.totalAmount) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  },
  data() {
    return {
      valid: false,
      bank: {
        name: "",
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
      !this.$v.bank.number.validBankCode && errors.push("银行卡号识别错误");
      !this.$v.bank.number.minLength && errors.push("银行卡号为16-19位");
      !this.$v.bank.number.required && errors.push("银行卡号不能为空");
      return errors;
    },
    bankAmountErrors() {
      const errors = [];
      if (!this.$v.bank.amount.$dirty) return errors;
      !this.$v.bank.amount.validAmount && errors.push("体现金额必须小于总金额");
      !this.$v.bank.amount.required && errors.push("金额不能为空");
      return errors;
    }
  },
  methods: {
    applyCash() {
      console.log("this.$refs.form.validate()", this.$refs.form.validate());
      if (this.$refs.form.validate()) {
        this.$http
          .post("/wallet/applycash", {
            amount: this.amount,
            bankCard: this.bank
          })
          .then(res => {
            if (res.data.Status) {
              this.$store.commit("SUCCESS", "申请提现成功,预计2个工作日到账");
            }
          });
      }
    }
  }
};
</script>
