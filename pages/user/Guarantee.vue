<template>
    <!-- <v-card>
            <v-card-title class="title">当前保额：2000 元
              <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-title>
              <v-tabs>
                <v-tab href="#recharge">保额充值</v-tab>
                <v-tab href="#withdrawcash">保额取现</v-tab>
                <v-tab-item id="recharge">
               
                    <Recharge></Recharge>
          
                </v-tab-item>
                <v-tab-item id="withdrawcash">
                  <WithdrawCash></WithdrawCash>
                </v-tab-item>
              </v-tabs>
            </v-card-title>

            <v-card-text>
            </v-card-text>
          </v-card> -->
            <v-subheader>该功能只针对物流代购担保使用,物流代购模块暂未开通,敬请等待</v-subheader>
</template>

<script>
import Recharge from './Recharge'
import WithdrawCash from './WithdrawCash'

export default {
  components: {
    Recharge,
    WithdrawCash
  },
  data: () => ({

    recharges: []
  }),
  computed: {

  },
  methods: {

  },
  created () {
  }
}
</script>
<style>
 
</style>