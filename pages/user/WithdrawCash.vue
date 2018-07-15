<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs1>
            <v-text-field label="姓名" value="张力" disabled></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field required v-model="applyOrder.bankName" :rules="[rules.required]" label="开户行"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field v-model="applyOrder.bankOrgin" label="开户机构"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field :rules="[rules.required]" mask="credit-card" v-model="applyOrder.cardNumber" required label="卡号"></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field required :rules="[rules.required]" label="金额" v-model="applyOrder.amount" type="number"></v-text-field>
          </v-flex>

          <v-btn outline="" color="primary" @click="newApply">申请提取</v-btn>
        </v-layout>
      </v-card-text>

    </v-card>
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        充值历史
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-data-table no-data-text="没有申请的提现单" :headers="headers" :items="applyCashs" hide-actions class="elevation-1">
          <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{ props.item.applyTime }}</td>
            <td class="text-xs-center">{{ props.item.amount }}</td>
            <td class="text-xs-center">{{ props.item.bankName}}</td>
            <td class="text-xs-center">{{ props.item.bankOrgin }}</td>
            <td class="text-xs-center">{{ props.item.cardNumber }}</td>
            <td class="text-xs-center">{{ props.item.state }}</td>

          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      applyOrder: {},
      headers: [
        {
          text: '申请时间',
          align: 'center',
          sortable: false,
          value: 'applyTime'
        },
        {
          text: '金额',
          align: 'center',
          value: 'amount'
        },
        {
          text: '开户行',
          align: 'center',
          value: 'bankName'
        },
        {
          text: '开户行机构',
          align: 'center',
          value: 'bankOrgin'
        },
        {
          text: '卡号',
          align: 'center',
          value: 'cardNumber'
        },
        {
          text: '状态',
          align: 'center',
          value: 'state'
        }
      ],
      applyCashs: [],
      rules: {
        required: value => !!value || '此项为必填项.',
        amount: value => {
          return (value > 0 && value < user.bond) || 'Invalid e-mail.'
        }
      }
    }
  },
  methods: {
    newApply () {
      this.$http
        .post('/user/applycash', this.applyOrder)
        .then(res => {
          console.log(res)
        })
        .catch(res => {
          console.log(res)
        })
    }
  }
}
</script>
