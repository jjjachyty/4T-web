<template>
  <v-container>
    <br>
    <v-divider></v-divider>

    <v-layout row wrap>
      <v-flex md7> 
              <br>
        <v-layout row wrap>
          <v-flex xs3 md4>
            <v-subheader>充值方式:</v-subheader>
          </v-flex>
          <v-flex xs6 md8>
            <v-btn-toggle v-model="newOrder.type">
              <v-btn flat>
                <img src="/static/bankcardico.png">
              </v-btn>
              <v-btn flat>
                <img src="/static/wexinpayico.png">
              </v-btn>
              <v-btn flat>
                <img src="/static/alipayico.png">
              </v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs6 offset-md4 md6>
            <v-text-field :error-messages="amountErrors" label="充值金额" v-model="newOrder.amount" type="number"></v-text-field>
          </v-flex>
          <v-flex xs6  offset-md4 md5>
            <v-subheader>
              <v-btn small outline color="blue" @click="newRecharge">生成充值单</v-btn>
            </v-subheader>
          </v-flex>

        </v-layout>
      </v-flex>
      <v-flex md5>
        <v-layout row wrap>
          <v-flex  xs12 v-if="newOrder.type == 0">
            <v-card>
              <v-card-title>银行转账
                <span class="red--text">(备注充值单交易号)</span>
              </v-card-title>
              <v-divider></v-divider>

              <v-layout row wrap>
                <v-flex xs4>
                  <v-subheader>开户行:</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader>招商银行</v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader>账户名:</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader>张力</v-subheader>
                </v-flex>
                <v-flex xs5 md4>
                  <v-subheader>开户机构:</v-subheader>
                </v-flex>
                <v-flex xs7 md8>
                  <v-subheader>北京东三环支行</v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader>账号:</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader>6225 8801 4801 5242</v-subheader>
                </v-flex>

              </v-layout>
            </v-card>

          </v-flex>
          <v-flex  xs12 v-if="newOrder.type == 1">
            <v-card>
              <v-card-title>微信转账
                <span class="red--text">(备注充值单交易号)</span>
              </v-card-title>
              <v-divider></v-divider>
              <img class="weixin" src="/static/weixin.png">
            </v-card>
          </v-flex>
          <v-flex  xs12 v-if="newOrder.type == 2">
            <v-card>
              <v-card-title>支付宝转账
                <span class="red--text">(备注充值单交易号)</span>
              </v-card-title>
              <v-divider></v-divider>

              <img class="weixin" src="/static/alipay.png">
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

    </v-layout>
          <v-alert v-model="alert" :type="type">
              {{message}}
          </v-alert>
    <v-divider></v-divider>
    <br>
    <v-flex xs12>
    <v-card>
      <v-card-title class="subheading">
        充值单历史:
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-data-table rows-per-page-text="每页" no-data-text="还没有充值记录" :headers="headers" :items="recharges" :pagination.sync="pagination" class="elevation-1">
          <template slot="items" slot-scope="props" >

            <td class="text-xs-center">{{ props.item.tradeNumber }}</td>
          
            <td class="text-xs-center">{{ props.item.type | dict('rechargeType')}}</td>
            
            <td class="text-xs-center">{{ props.item.amount}}</td>
           
            <td class="text-xs-center">{{ props.item.createAt | formatDate("YYYY/MM/DD HH:mm:ss") }}</td>
          
            <td class="text-xs-center">{{ props.item.state=="0"?'待充值':'已完成' }}</td>
            
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    
    </v-flex>    
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required} from 'vuelidate/lib/validators'
import Recharge from './Recharge'

export default {
  components: {
    Recharge
  },
  mixins: [validationMixin],
  validations: {
    newOrder: {
      amount: { required,
        amountRule (v) {
          return v > 0 && v % 100 == 0
        } }
    }

  },
  data: () => ({
    alert: false,
    message: '',
    type: 'error',
    pagination: {
    },
    newOrder: {
      type: 0
    },
    headers: [{
      text: '交易号',
      align: 'center',
      sortable: false,
      value: 'code'
    },
    {
      text: '方式',
      align: 'center',
      value: 'type'
    },
    {
      text: '金额',
      align: 'center',
      value: 'amount'
    },

    {
      text: '时间',
      align: 'center',
      value: 'time'
    },
    {
      text: '状态',
      align: 'center',
      value: 'state'
    }
    ],
    recharges: []
  }),
  computed: {
    amountErrors () {
      const errors = []
      if (!this.$v.newOrder.amount.$dirty) return errors
      !this.$v.newOrder.amount.amountRule && errors.push('金额必须是大于0且是100的整倍数')
      !this.$v.newOrder.amount.required && errors.push('金额不能为空')
      return errors
    }
  },
  methods: {
    newRecharge () {
      console.log(this.$v.newOrder.amount.$touch())
      this.alert = false
      if (!this.$v.$invalid) {
        this.$http.post('/user/recharge', this.newOrder).then(res => {
          console.log('Res', res, res.data.Status)
          if (res.data.Status) {
            this.getMyRechargeOrder()
          } else {
            this.alert = true
            this.message = res.data.Error.Err
            this.type = 'error'
          }
        }).catch(res => {
          this.alert = true
          this.message = res.data.Error.Err
          this.type = 'error'
        })
      }
    },
    getMyRechargeOrder () {
      this.$http.get('/user/recharges', {}).then(res => {
        this.recharges = res.data.Data
      })
    }
  },
  created () {
    this.getMyRechargeOrder()
  }
}
</script>
<style>
  .weixin {
    margin-left: 20%;
    height: 200px;
    width: 200px;
  }
</style>